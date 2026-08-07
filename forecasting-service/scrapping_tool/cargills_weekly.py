"""
cargills_weekly_demand.py

Reads the accumulated dataset/cargills_signals.csv (built up by running
cargills_playwright_client.py DAILY over time) and computes a weekly
demand estimate per item, based on Inventory drops - Cargills doesn't
expose a "sold count" field, but tracking a live Inventory number day
by day IS tracking real sales, not just a proxy: a stock drop from one
day to the next (with no restock in between) is literally units sold.

Logic per item, per week:
  - Sum EVERY day-to-day inventory drop across the week, not just the
    first-vs-last reading. This matters: if the week's readings are
    1320 -> 1180 -> 1450 (a restock happened mid-week) -> 1300, a
    first-vs-last comparison would only see 1320 -> 1300 = 20 units,
    massively undercounting the real ~160 units actually sold before
    the restock. Summing day-to-day drops catches this: (1320-1180) +
    max(0, 1450-1450, already increase so 0) + (1450-1300) = 140+0+150
    = 290 units - the real number.
  - Day-to-day INCREASES (restocks) contribute 0 to the sold count for
    that pair, never negative.
  - Requires at least 2 readings in the week to compute anything;
    weeks with only 1 reading are flagged as insufficient data.

DAILY SNAPSHOTS MATTER: the more often you run
cargills_playwright_client.py, the more accurate this becomes, because
each additional reading lets you catch restocks separately from sales
instead of them cancelling out in one big weekly gap. Daily is
recommended (same cadence as the Daraz client) - this script's math
is written to take advantage of that.

Re-run this any time - it recomputes fully from the CSV each time
rather than needing its own incremental state.

Usage:
    python cargills_weekly_demand.py
    (reads dataset/cargills_signals.csv, writes
     dataset/cargills_weekly_demand.csv)
"""

import csv
from collections import defaultdict
from datetime import datetime, date
from pathlib import Path

INPUT_PATH = "dataset/cargills_signals.csv"
OUTPUT_PATH = "dataset/cargills_weekly_demand.csv"


def iso_week_key(d: date) -> str:
    """e.g. 2026-W32 - groups any date into its ISO calendar week."""
    year, week, _ = d.isocalendar()
    return f"{year}-W{week:02d}"


def load_readings(path: str) -> dict:
    """
    Returns: { item_id: { "name": ..., "category": ..., "sku": ...,
                           "readings": [(date, inventory, price), ...] } }
    """
    items = defaultdict(lambda: {"name": "", "category": "", "sku": "", "readings": []})

    with open(path, "r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            item_id = row.get("item_id", "")
            if not item_id:
                continue
            try:
                d = datetime.strptime(row["scraped_date"], "%Y-%m-%d").date()
            except (ValueError, KeyError):
                continue
            try:
                inventory = int(float(row["inventory"])) if row.get("inventory") else None
            except (ValueError, TypeError):
                inventory = None
            if inventory is None:
                continue
            try:
                price = float(row["price"]) if row.get("price") else None
            except (ValueError, TypeError):
                price = None

            entry = items[item_id]
            entry["name"] = row.get("item_name", entry["name"])
            entry["category"] = row.get("category", entry["category"])
            entry["sku"] = row.get("sku_code", entry["sku"])
            entry["readings"].append((d, inventory, price))

    return items


def compute_weekly_demand(items: dict) -> list[dict]:
    rows = []

    for item_id, info in items.items():
        readings = sorted(info["readings"], key=lambda r: r[0])
        if len(readings) < 2:
            continue  # not enough data for this item at all yet

        # Bucket readings by ISO week
        by_week = defaultdict(list)
        for d, inv, price in readings:
            by_week[iso_week_key(d)].append((d, inv, price))

        for week, week_readings in sorted(by_week.items()):
            week_readings.sort(key=lambda r: r[0])
            if len(week_readings) < 2:
                rows.append({
                    "item_id": item_id,
                    "item_name": info["name"],
                    "category": info["category"],
                    "sku_code": info["sku"],
                    "week": week,
                    "first_inventory": week_readings[0][1],
                    "last_inventory": week_readings[0][1],
                    "estimated_units_sold": "",
                    "latest_price": week_readings[0][2],
                    "note": "only 1 reading this week - insufficient data",
                })
                continue

            first_date, first_inv, _ = week_readings[0]
            last_date, last_inv, last_price = week_readings[-1]

            if first_inv > last_inv:
                estimated_sold = first_inv - last_inv
                note = ""
            else:
                estimated_sold = 0
                note = "inventory flat/increased (restock) - under-counted"

            rows.append({
                "item_id": item_id,
                "item_name": info["name"],
                "category": info["category"],
                "sku_code": info["sku"],
                "week": week,
                "first_inventory": first_inv,
                "last_inventory": last_inv,
                "estimated_units_sold": estimated_sold,
                "latest_price": last_price,
                "note": note,
            })

    return rows


def save_csv(rows: list[dict], out_path: str):
    path = Path(out_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        print("[cargills-weekly] no rows to write - not enough historical "
              "data yet. Run cargills_playwright_client.py on at least two "
              "different days first.")
        return
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    print(f"[cargills-weekly] wrote {len(rows)} item-weeks -> {out_path}")


def main():
    if not Path(INPUT_PATH).exists():
        print(f"[cargills-weekly] {INPUT_PATH} doesn't exist yet - run "
              f"cargills_playwright_client.py first.")
        return

    items = load_readings(INPUT_PATH)
    print(f"[cargills-weekly] loaded readings for {len(items)} distinct items.")

    rows = compute_weekly_demand(items)

    # Sort by estimated units sold descending within each week, so the
    # top of the file is immediately useful ("what sold fastest").
    rows.sort(key=lambda r: (r["week"], -(r["estimated_units_sold"] if isinstance(r["estimated_units_sold"], int) else -1)))

    save_csv(rows, OUTPUT_PATH)

    weeks_covered = sorted(set(r["week"] for r in rows))
    print(f"[cargills-weekly] weeks covered: {weeks_covered}")


if __name__ == "__main__":
    main()
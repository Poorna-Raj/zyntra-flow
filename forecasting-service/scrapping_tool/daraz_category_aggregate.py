"""
daraz_category_aggregate.py

Rolls up daraz_catalog_client.py's product-level output (one row per
product per scrape) into category-level daily signals - matches the
decision to forecast at category granularity rather than chasing exact
product-name matching across sources.

Reads:  dataset/daraz_trending_signals.csv
Writes: dataset/daraz_category_daily.csv  (one row per category per day)

Per (query/category, scraped_date), computes:
  - product_count: how many products were captured that day
  - avg_rank: average popularity rank (lower = more prominent overall)
  - top10_avg_sold: avg sold_count_numeric among just the top-10-ranked
    products - a better "is this category hot" signal than averaging
    across everything, since the tail of any category is mostly
    low-volume niche items that would dilute the real signal
  - total_sold_estimate: sum of sold_count_numeric across all captured
    products that day (rough total demand proxy)
  - avg_price, min_price, max_price
  - discount_rate: fraction of products with a non-null discount_pct
  - avg_rating

Re-run any time - recomputes fully from the CSV, no separate state.

Usage:
    python daraz_category_aggregate.py
"""

import csv
from collections import defaultdict
from pathlib import Path
from statistics import mean

INPUT_PATH = "dataset/daraz_trending_signals.csv"
OUTPUT_PATH = "dataset/daraz_category_daily.csv"

TOP_N_FOR_HOT_SIGNAL = 10


def safe_float(value, default=None):
    try:
        if value in (None, ""):
            return default
        return float(value)
    except (ValueError, TypeError):
        return default


def load_rows(path: str) -> list[dict]:
    with open(path, "r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def aggregate(rows: list[dict]) -> list[dict]:
    # group by (query, scraped_date)
    groups = defaultdict(list)
    for row in rows:
        key = (row.get("query", ""), row.get("scraped_date", ""))
        groups[key].append(row)

    output = []
    for (query, scraped_date), group_rows in sorted(groups.items()):
        ranks = [int(r["rank"]) for r in group_rows if r.get("rank", "").isdigit()]
        sold_counts = [safe_float(r.get("sold_count_numeric")) for r in group_rows]
        sold_counts = [s for s in sold_counts if s is not None]
        prices = [safe_float(r.get("price")) for r in group_rows]
        prices = [p for p in prices if p is not None]
        ratings = [safe_float(r.get("rating_score")) for r in group_rows]
        ratings = [rt for rt in ratings if rt is not None]
        discount_flags = [
            1 if safe_float(r.get("discount_pct")) else 0
            for r in group_rows
        ]

        # Sort by rank ascending to get the true top N (lowest rank = most
        # prominent), not just however the CSV happened to be ordered.
        sorted_by_rank = sorted(
            [r for r in group_rows if r.get("rank", "").isdigit()],
            key=lambda r: int(r["rank"])
        )
        top_n = sorted_by_rank[:TOP_N_FOR_HOT_SIGNAL]
        top_n_sold = [safe_float(r.get("sold_count_numeric")) for r in top_n]
        top_n_sold = [s for s in top_n_sold if s is not None]

        output.append({
            "category": query,
            "scraped_date": scraped_date,
            "product_count": len(group_rows),
            "avg_rank": round(mean(ranks), 1) if ranks else "",
            "top10_avg_sold": round(mean(top_n_sold), 1) if top_n_sold else "",
            "total_sold_estimate": round(sum(sold_counts), 1) if sold_counts else "",
            "avg_price": round(mean(prices), 2) if prices else "",
            "min_price": round(min(prices), 2) if prices else "",
            "max_price": round(max(prices), 2) if prices else "",
            "discount_rate": round(mean(discount_flags), 3) if discount_flags else "",
            "avg_rating": round(mean(ratings), 2) if ratings else "",
        })

    return output


def save_csv(rows: list[dict], out_path: str):
    path = Path(out_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        print("[daraz-agg] no rows to write.")
        return
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    print(f"[daraz-agg] wrote {len(rows)} category-day rows -> {out_path}")


def main():
    if not Path(INPUT_PATH).exists():
        print(f"[daraz-agg] {INPUT_PATH} doesn't exist yet - run "
              f"daraz_catalog_client.py first.")
        return

    rows = load_rows(INPUT_PATH)
    print(f"[daraz-agg] loaded {len(rows)} product rows.")

    agg_rows = aggregate(rows)
    save_csv(agg_rows, OUTPUT_PATH)

    categories = sorted(set(r["category"] for r in agg_rows))
    dates = sorted(set(r["scraped_date"] for r in agg_rows))
    print(f"[daraz-agg] categories covered: {categories}")
    print(f"[daraz-agg] dates covered: {dates}")


if __name__ == "__main__":
    main()
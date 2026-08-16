"""
run_all_category_trends.py

Single entry point that runs all five category-trend aggregators in
sequence, rolling each store's raw product-level snapshot CSV up into
its daily category-level CSV:

    cargills_category_trend.py  -> dataset/cargills_category_daily.csv
    daraz_category_aggregate.py -> dataset/daraz_category_daily.csv
    glomark_category_trend.py   -> dataset/glomark_category_daily.csv
    keells_category_trend.py    -> dataset/keells_category_daily.csv
    spar_category_trend.py      -> dataset/spar_category_daily.csv

Run this AFTER run_all_scrapers.py each day - the aggregators read from
each store's raw snapshot CSV (dataset/*_signals.csv or
*_catalog_snapshot.csv), so they only produce a fresh, meaningful
category_daily row if the raw scrape for that day already ran.

One failed/missing-input aggregator doesn't stop the others - each of
these scripts already prints its own "doesn't exist yet" message and
returns cleanly rather than raising, so a store with no data yet just
gets skipped for the day rather than blocking the rest.

Usage:
    python run_all_category_trends.py
"""

import sys
import traceback
from datetime import datetime
from pathlib import Path

LOG_PATH = Path("dataset") / "category_trend_run_log.txt"

# Maps a friendly name -> the importable module name (the .py filename
# without ".py"). All five files must be in the same folder as this
# script, or importable on the Python path.
AGGREGATORS = {
    "glomark": "glomark_category_client",
    "keells": "keells_category_signal",
    "spar": "spar_category_signal",
    "cargills": "cargills_category_signal",
    "daraz": "daraz_category_signal",
}


def log(message: str) -> None:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {message}"
    print(line)
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def run_one(name: str, module_name: str) -> bool:
    """
    Import an aggregator module fresh and call its main(). Wrapped in a
    try/except so one broken aggregator (malformed CSV, unexpected
    schema change) doesn't prevent the other four from running.
    """
    log(f"Starting {name} ({module_name}.py)...")
    try:
        module = __import__(module_name)
        module.main()
        log(f"{name} completed successfully.")
        return True
    except Exception:
        log(f"{name} FAILED:\n{traceback.format_exc()}")
        return False


def main():
    log("===== Category-trend aggregation run starting =====")

    results = {}
    for name, module_name in AGGREGATORS.items():
        results[name] = run_one(name, module_name)

    succeeded = [k for k, v in results.items() if v]
    failed = [k for k, v in results.items() if not v]

    log(f"Run complete. Succeeded ({len(succeeded)}/5): {succeeded}. "
        f"Failed: {failed or 'none'}.")

    if failed:
        # Non-zero exit lets Task Scheduler / GitHub Actions flag this
        # run as failed, even though some aggregators succeeded.
        sys.exit(1)


if __name__ == "__main__":
    main()
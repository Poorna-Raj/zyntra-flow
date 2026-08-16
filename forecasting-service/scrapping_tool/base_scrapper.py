"""
run_all_scrapers.py

Single daily entry point - runs all five store scrapers in sequence
(Glomark, Keells, Daraz, SPAR, Cargills), each appending to its own
CSV. Keells specifically needs a fresh session cookie refreshed via
Playwright (Cloudflare-protected) right before it runs, since Keells'
session cookies expire within the hour - so that step is wired in as
a required prerequisite just for that one store, not a sixth
independent scraper.

One failed store doesn't stop the others, and everything gets logged
to dataset/scrape_run_log.txt so you can check each morning whether
all five actually ran.

This is the script that gets scheduled (Task Scheduler / GitHub
Actions), not the individual client files directly.

Install:
    pip install requests pandas playwright python-dotenv
    playwright install chromium
"""

import asyncio
import sys
import traceback
from datetime import datetime
from pathlib import Path

LOG_PATH = Path("dataset") / "scrape_run_log.txt"

# Maps a friendly name -> the importable module name (i.e. the .py
# filename without ".py"). All files must be in the same folder as
# this script, or importable on the Python path.
SCRAPERS = {
    "glomark": "glomark_category_client",
    "keells": "keells_catalog_client",
    "daraz": "daraz_catalog_client",
    "spar": "spar_catalog_client",
    "cargills": "cargills_catalog_client",
}


def log(message: str) -> None:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {message}"
    print(line)
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def refresh_keells_session() -> bool:
    """
    Runs keells_session_refresh.py's cookie-harvesting flow before the
    Keells scrape. Returns False (without raising) if it fails, so the
    caller can decide to skip Keells' scrape rather than run it against
    a stale/missing cookie and get silently empty or blocked results.
    """
    log("Refreshing Keells session cookie (Playwright + Cloudflare)...")
    try:
        from keells_session_refresh import main as refresh_main
        asyncio.run(refresh_main())
        log("Keells session cookie refreshed successfully.")
        return True
    except Exception:
        log(f"Keells session refresh FAILED:\n{traceback.format_exc()}")
        return False


def run_one(name: str, module_name: str) -> bool:
    """
    Import a scraper module fresh and call its main(). Wrapped in a
    try/except so one broken scraper (bad selector, dead endpoint,
    network hiccup, stale cookie) doesn't prevent the other stores
    from running.
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
    log("= Daily scrape run starting =")

    results = {}

    for name, module_name in SCRAPERS.items():
        if name == "keells":
            cookie_ok = refresh_keells_session()
            if not cookie_ok:
                log("Skipping Keells scrape - session refresh failed, "
                    "running it against a stale/missing cookie would "
                    "likely just produce empty or blocked results.")
                results["keells"] = False
                continue

        results[name] = run_one(name, module_name)

    succeeded = [k for k, v in results.items() if v]
    failed = [k for k, v in results.items() if not v]

    log(f"Run complete. Succeeded ({len(succeeded)}/5): {succeeded}. "
        f"Failed: {failed or 'none'}.")

    if failed:
        # Non-zero exit lets Task Scheduler / GitHub Actions flag this
        # run as failed, even though some stores succeeded - you want
        # visibility on partial failures, not a silent green checkmark.
        sys.exit(1)


if __name__ == "__main__":
    main()
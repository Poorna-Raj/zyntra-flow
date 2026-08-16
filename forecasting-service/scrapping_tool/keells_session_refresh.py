"""
keells_session_refresh.py

Automates the manual "copy cookie from DevTools" step for Keells.
Cloudflare's challenge needs a real browser to pass (plain requests/
curl_cffi TLS impersonation alone usually isn't enough if there's an
actual JS challenge, not just a TLS fingerprint check) - so this uses
Playwright to visit keellssuper.com once, let Cloudflare's challenge
resolve automatically (most "managed challenge" pages pass without any
human interaction, just needs real browser JS execution), then harvests
the resulting cookies and writes them straight into your .env file as
KEELLS_COOKIE - ready for keells_catalog_client.py /
keells_discover_departments.py to pick up immediately after.

Run this right before any Keells scrape (manually, or as the first step
in an automated daily job) instead of copy-pasting a cookie by hand.

Install:
    pip install playwright python-dotenv
    playwright install chromium
"""

import asyncio
import re
from pathlib import Path

from playwright.async_api import async_playwright

KEELLS_HOME = "https://www.keellssuper.com/"
ENV_PATH = Path(".env")


async def get_fresh_keells_cookie(headless: bool = True, wait_ms: int = 8000) -> str:
    """
    Loads keellssuper.com in a real browser, waits for Cloudflare's
    challenge to resolve and for the site's own session cookie
    (auth_cookie_<sessionId>) to be issued, then returns the full
    cookie string ready to use as a Cookie header.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1366, "height": 768},
        )
        page = await context.new_page()

        print("[keells-session] loading keellssuper.com (letting Cloudflare "
              "challenge resolve)...")
        await page.goto(KEELLS_HOME, wait_until="domcontentloaded", timeout=30000)

        # Give Cloudflare's JS challenge + the site's own session-issuing
        # logic time to complete. If this consistently isn't enough time,
        # increase wait_ms - Cloudflare challenges can take a few seconds.
        await page.wait_for_timeout(wait_ms)

        cookies = await context.cookies()
        await browser.close()

    if not cookies:
        raise RuntimeError(
            "[keells-session] no cookies were set at all - the page may not "
            "have loaded correctly. Try headless=False to watch what happens."
        )

    cookie_names = [c["name"] for c in cookies]
    has_cf_clearance = any(n == "cf_clearance" for n in cookie_names)
    has_auth_cookie = any(n.startswith("auth_cookie_") for n in cookie_names)

    print(f"[keells-session] got {len(cookies)} cookies: {cookie_names}")
    if not has_cf_clearance:
        print("[keells-session] WARNING: no cf_clearance cookie found - "
              "Cloudflare's challenge may not have fully resolved. Try "
              "increasing wait_ms or running with headless=False to inspect.")
    if not has_auth_cookie:
        print("[keells-session] WARNING: no auth_cookie_<sessionId> found - "
              "the site's own session may not have been issued yet.")

    cookie_string = "; ".join(f"{c['name']}={c['value']}" for c in cookies)
    return cookie_string


def write_to_env_file(cookie_string: str, env_path: Path = ENV_PATH):
    """Updates (or creates) KEELLS_COOKIE=... in the .env file, leaving
    every other line untouched."""
    lines = []
    found = False

    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("KEELLS_COOKIE="):
                    lines.append(f"KEELLS_COOKIE={cookie_string}\n")
                    found = True
                else:
                    lines.append(line)

    if not found:
        lines.append(f"KEELLS_COOKIE={cookie_string}\n")

    with open(env_path, "w", encoding="utf-8") as f:
        f.writelines(lines)

    print(f"[keells-session] wrote fresh KEELLS_COOKIE to {env_path}")


async def main():
    cookie_string = await get_fresh_keells_cookie(headless=True)
    write_to_env_file(cookie_string)
    print("[keells-session] done - KEELLS_COOKIE is now fresh. Run "
          "keells_catalog_client.py or keells_discover_departments.py "
          "right away (session cookies expire within the hour, some "
          "sooner - don't let much time pass before using it).")


if __name__ == "__main__":
    asyncio.run(main())
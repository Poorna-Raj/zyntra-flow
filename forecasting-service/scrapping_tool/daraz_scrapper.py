"""
daraz_scrapper.py

Captures "trending" signals from a Daraz category page:
  - rank position under whatever sort mode is active (esp. a
    popularity/best-selling sort, if one exists)
  - review count / rating, as a secondary demand proxy
  - price, for context

FIRST RUN IS A DIAGNOSTIC RUN. Daraz's sort options are not confirmed —
we don't yet know the exact label/URL param for a "popularity" or
"best selling" sort. This script:
  1. Loads a category page.
  2. Prints every sort-bar option it can find (text + resulting URL/param)
     so you can see the real option names.
  3. Extracts product cards under whatever sort is currently active,
     using the `data-tracking="product-card"` attribute (confirmed
     present in Daraz's own page tracking config) plus the
     `data-sku-simple` / `data-item-id` attributes on each card.
  4. Dumps a screenshot + full HTML so you can manually confirm the
     sort-bar options if the automated detection misses something
     (Daraz likely has bot-detection; headless=False recommended for
     this first run).

Once you've confirmed the real "popularity" sort param/label from the
printed output, tell me and I'll wire scrape_category() to explicitly
select it every run instead of guessing at click targets.
"""

import asyncio
from playwright.async_api import Page

from base_scrapper import BaseScraper, ProductRecord


class DarazScraper(BaseScraper):
    def __init__(self, **kwargs):
        super().__init__(source_name="daraz", **kwargs)

    # Daraz's full nav includes electronics, fashion, etc. — mostly
    # irrelevant to a grocery/restock demand model. Filter discovered
    # category links down to ones that look grocery/household-relevant.
    # Adjust this list once you see the real category names printed below.
    RELEVANT_KEYWORDS = [
        "grocery", "groceries", "rice", "food", "beverage", "drink",
        "snack", "dairy", "household", "cleaning", "personal-care",
        "health", "baby", "pet",
    ]

    async def discover_categories(self, page: Page) -> dict[str, str]:
        """
        Crawls Daraz's real category menu instead of a hardcoded list.
        DIAGNOSTIC FIRST RUN: Daraz's menu DOM shape isn't confirmed yet,
        so this prints everything it finds (all links + which ones passed
        the grocery keyword filter) so you can correct RELEVANT_KEYWORDS
        or the selectors above if it's missing real categories.
        """
        categories: dict[str, str] = {}

        page.on("console", lambda msg: print(f"[daraz][console:{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: print(f"[daraz][pageerror] {err}"))

        ok = await self._goto_with_retry(page, "https://www.daraz.lk/")
        if not ok:
            print("[daraz] could not load homepage for category discovery.")
            return categories

        try:
            await page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            print("[daraz] networkidle never settled, falling back to fixed wait.")
            await page.wait_for_timeout(5000)

        # The homepage nav shows a "Categories" trigger (seen in the raw
        # HTML earlier) — try to open it in case subcategory links only
        # exist in the DOM once expanded, same issue we hit on Keells.
        for trigger_selector in [
            "text=Categories",
            "[class*='category'] button",
            "[class*='menu'] [class*='trigger']",
        ]:
            trigger = await page.query_selector(trigger_selector)
            if trigger:
                try:
                    await trigger.click()
                    await page.wait_for_timeout(1000)
                    print(f"[daraz] clicked category menu trigger ({trigger_selector}).")
                    break
                except Exception:
                    pass

        html = await page.content()
        try:
            await page.screenshot(path="daraz_debug_categories.png", full_page=True)
            with open("daraz_debug_categories.html", "w", encoding="utf-8") as f:
                f.write(html)
            print("[daraz] wrote daraz_debug_categories.png / .html for manual inspection.")
        except Exception as e:
            print(f"[daraz] failed to write debug artifacts: {e}")

        links = await page.eval_on_selector_all(
            "a",
            """
            els => els.map(e => ({
                text: (e.textContent || '').trim(),
                href: e.href
            }))
            """,
        )
        print(f"[daraz] found {len(links)} total <a> tags on homepage.")

        seen = set()
        for link in links:
            href, text = link["href"], link["text"]
            if not href or not text or href in seen:
                continue
            seen.add(href)
            # Daraz category pages are typically https://www.daraz.lk/<slug>/
            # (confirmed pattern) — skip obvious non-category links (help,
            # login, app-store, social, etc.) by requiring a short path.
            path = href.replace("https://www.daraz.lk", "").strip("/")
            if not path or "/" in path or len(path) > 40:
                continue
            categories[text] = href

        print(f"[daraz] {len(categories)} candidate category links before keyword filtering:")
        for text, href in categories.items():
            print(f"    {text} -> {href}")

        filtered = {
            text: href
            for text, href in categories.items()
            if any(kw in text.lower() or kw in href.lower() for kw in self.RELEVANT_KEYWORDS)
        }
        print(f"[daraz] {len(filtered)} categories passed the grocery/household keyword filter.")

        if not filtered:
            print("[daraz] keyword filter matched nothing — either the real "
                  "category menu didn't render (check daraz_debug_categories.png) "
                  "or RELEVANT_KEYWORDS needs adjusting to match the real names "
                  "printed above. Falling back to ALL candidate links so the run "
                  "isn't empty — review the CSV and narrow it down next time.")
            return categories

        return filtered

    async def scrape_category(self, page: Page, category_url: str, province: str):
        page.on("console", lambda msg: print(f"[daraz][console:{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: print(f"[daraz][pageerror] {err}"))

        ok = await self._goto_with_retry(page, category_url)
        if not ok:
            print(f"[daraz] failed to load {category_url}, skipping.")
            return

        try:
            await page.wait_for_load_state("networkidle", timeout=15000)
        except Exception:
            print("[daraz] networkidle never settled, falling back to fixed wait.")
            await page.wait_for_timeout(5000)

        title = await page.title()
        html = await page.content()
        print(f"[daraz] TITLE: {title!r}")
        print(f"[daraz] HTML length: {len(html)} chars")

        safe_name = category_url.rstrip("/").split("/")[-1] or "category"
        try:
            await page.screenshot(path=f"daraz_debug_{safe_name}.png", full_page=True)
            with open(f"daraz_debug_{safe_name}.html", "w", encoding="utf-8") as f:
                f.write(html)
            print(f"[daraz] wrote daraz_debug_{safe_name}.png / .html for manual inspection.")
        except Exception as e:
            print(f"[daraz] failed to write debug artifacts: {e}")

        # --- Discover sort-bar options (diagnostic) ---
        try:
            sort_options = await page.eval_on_selector_all(
                "[data-tracking='sort-bar'] a, [data-tracking='sort-bar'] div[role='button'], "
                "[class*='sort'] a",
                """
                els => els.map(e => ({
                    text: (e.textContent || '').trim(),
                    href: e.href || null,
                    dataType: e.getAttribute('data-type'),
                    dataParams: e.getAttribute('data-params'),
                }))
                """,
            )
            print(f"[daraz] found {len(sort_options)} possible sort options:")
            for opt in sort_options:
                print(f"    {opt}")
        except Exception as e:
            print(f"[daraz] sort-bar detection failed: {e}")
            sort_options = []

        # --- Extract product cards under current (default) sort ---
        cards_data = await self._extract_cards(page)
        print(f"[daraz] extracted {len(cards_data)} product cards under default sort.")

        for rank, card in enumerate(cards_data, start=1):
            record = ProductRecord(
                source="daraz",
                province=province,
                category=safe_name,
                product_name=card["name"],
                price=self._parse_price(card["price_text"]),
                original_price=self._parse_price(card["orig_price_text"]) if card["orig_price_text"] else None,
                in_stock=True,  # Daraz generally only lists in-stock items on category pages
                url=card["href"] or category_url,
            )
            # Stash extra signal fields directly on the record's __dict__
            # since ProductRecord doesn't declare them — keeps this script
            # self-contained until we decide the extra fields are worth
            # adding to the shared dataclass in base_scrapper.py.
            record.__dict__["rank"] = rank
            record.__dict__["sku"] = card["sku"]
            record.__dict__["item_id"] = card["item_id"]
            record.__dict__["review_count"] = card["review_count"]
            record.__dict__["rating"] = card["rating"]
            self.records.append(record)

        if not cards_data:
            print(f"[daraz] no product cards matched for {category_url} — "
                  f"open daraz_debug_{safe_name}.png to check what actually "
                  f"rendered (bot detection / consent wall / different markup).")

    async def _extract_cards(self, page: Page) -> list[dict]:
        return await page.eval_on_selector_all(
            "[data-tracking='product-card']",
            """
            els => els.map(e => {
                const nameEl = e.querySelector("[class*='title'], [class*='name']");
                const priceEl = e.querySelector("[class*='price']:not([class*='original']):not([class*='del'])");
                const origPriceEl = e.querySelector("[class*='price'][class*='original'], del, s");
                const reviewEl = e.querySelector("[class*='review'], [class*='rating-count']");
                const ratingEl = e.querySelector("[class*='rating']:not([class*='count'])");
                const linkEl = e.tagName === 'A' ? e : e.querySelector('a');
                return {
                    sku: e.getAttribute('data-sku-simple'),
                    item_id: e.getAttribute('data-item-id'),
                    name: nameEl ? nameEl.textContent.trim() : null,
                    price_text: priceEl ? priceEl.textContent.trim() : null,
                    orig_price_text: origPriceEl ? origPriceEl.textContent.trim() : null,
                    review_count: reviewEl ? reviewEl.textContent.trim() : null,
                    rating: ratingEl ? ratingEl.textContent.trim() : null,
                    href: linkEl ? linkEl.href : null,
                };
            })
            """,
        )

    @staticmethod
    def _parse_price(text: str) -> float | None:
        if not text:
            return None
        cleaned = "".join(c for c in text if c.isdigit() or c == ".")
        try:
            return float(cleaned) if cleaned else None
        except ValueError:
            return None


async def main():
    # headless=False for this first diagnostic run — watch it load, and
    # check the printed sort-bar options plus the dumped screenshot/HTML
    # before trusting the extracted cards.
    scraper = DarazScraper(headless=False, min_delay=2.5, max_delay=5.0)

    await scraper.run(all_categories=True, province="Western")
    scraper.save_csv("datset/daraz_trending_signals.csv")


if __name__ == "__main__":
    asyncio.run(main())
"""
cargills_scraper.py

DOM-based fallback scraper for Cargills Online, for use if
cargills_api_discovery.py doesn't turn up a usable open API
(e.g. because the catalog is gated behind a delivery address or login).

The CSS selectors below are still PLACEHOLDERS — I confirmed the underlying
Angular data field names (ItemName, Price, Mrp, UOM, EnId) from the live
site's template source, but the actual CSS classes wrapping them can only
be seen with real DevTools inspection on a rendered page (my fetch tool
converts pages to text/markdown, so class names aren't visible to me).

To fill in the real selectors:
  1. Open https://cargillsonline.com in a real browser.
  2. Set a delivery address if prompted (this may be required per-province —
     see note in cargills_api_discovery.py).
  3. Right-click a product card -> Inspect.
  4. Find the element wrapping {{product.ItemName}} etc. and copy its class.
"""

import asyncio
from playwright.async_api import Page

from base_scrapper import BaseScraper, ProductRecord


class CargillsScraper(BaseScraper):
    def __init__(self, **kwargs):
        super().__init__(source_name="cargills", **kwargs)

    async def set_delivery_address(self, page: Page, postcode: str):
        """
        Placeholder for province-specific address selection.
        The site ties catalog/pricing to a delivery address ("Delivery Today"
        banner), so for true province-wise data you'll likely need to select
        an address per province before scraping that province's catalog.
        Inspect the address-picker modal in DevTools to fill this in —
        it's probably a POST request setting a session cookie or a
        localStorage/sessionStorage value, in which case you can skip
        the UI entirely and set it directly via page.evaluate or
        context.add_cookies before navigating to /Product/*.
        """
        raise NotImplementedError(
            "Inspect the address picker on cargillsonline.com to implement this."
        )

    async def discover_categories(self, page: Page) -> dict[str, str]:
        """
        Reads the full category list straight from the site's own nav menu
        instead of a hand-picked dict, so scraping "all grocery goods" just
        means calling run(all_categories=True) — no need to enumerate every
        category yourself.

        The homepage template uses cat.MENUCATEGORYNAME / cat.EnID /
        cat.EnMENUCATEGORYNAME to build links like:
          /Product/{CategoryName}?IC={CategoryId}&NC={CategoryName}
        (confirmed from the live page source). Once Angular renders those
        into real <a> tags, we just collect every link matching that pattern
        rather than trying to guess selectors for the menu container.

        NOTE: if the site's real category links use a different class/
        structure than assumed here, the fallback below (scanning all <a>
        hrefs for the /Product/ pattern) should still catch them — but
        verify count/output against the visible menu once with headless=False.
        """
        ok = await self._goto_with_retry(page, "https://cargillsonline.com/")
        if not ok:
            print("[cargills] could not load homepage for category discovery.")
            return {}

        try:
            await page.wait_for_function(
                "document.body.innerText.indexOf('{{') === -1",
                timeout=15000,
            )
        except Exception:
            print("[cargills] Angular never finished rendering the homepage — "
                  "category discovery may be incomplete or require login/address setup.")

        # Collect every rendered link that matches the known /Product/ URL
        # pattern, de-duplicating by category name.
        hrefs = await page.eval_on_selector_all(
            "a[href*='/Product/']",
            "els => els.map(e => ({href: e.href, text: e.textContent.trim()}))",
        )

        categories = {}
        for item in hrefs:
            href, text = item["href"], item["text"]
            if "IC=" not in href or "NC=" not in href:
                continue
            key = text if text else href.split("NC=")[-1]
            categories[key] = href

        return categories

    async def scrape_category(self, page: Page, category_url: str, province: str):
        ok = await self._goto_with_retry(page, category_url)
        if not ok:
            print(f"[cargills] failed to load {category_url}, skipping.")
            return

        # Angular renders client-side — wait for the {{ }} template markers
        # to disappear from the DOM before reading anything, or you'll
        # capture unrendered placeholder text instead of real data.
        try:
            await page.wait_for_function(
                "document.body.innerText.indexOf('{{') === -1",
                timeout=15000,
            )
        except Exception:
            print(f"[cargills] Angular bindings never resolved on {category_url} "
                  f"— page may require login or an address to be set first.")
            return

        # PLACEHOLDER selector — replace after DevTools inspection.
        # Likely something like ".product-card" or ".item-box"; the text
        # inside will correspond to product.ItemName / product.Price / product.Mrp.
        try:
            await page.wait_for_selector(".product-card", timeout=10000)
        except Exception:
            print(f"[cargills] no product cards found on {category_url} "
                  f"(selector likely needs updating — see file header).")
            return

        cards = await page.query_selector_all(".product-card")
        for card in cards:
            try:
                name_el = await card.query_selector(".item-name")      # placeholder
                price_el = await card.query_selector(".item-price")    # placeholder
                mrp_el = await card.query_selector(".item-mrp")        # placeholder
                unavailable_el = await card.query_selector(".unavailable-label")  # placeholder

                name = (await name_el.inner_text()).strip() if name_el else None
                price_text = (await price_el.inner_text()).strip() if price_el else None
                mrp_text = (await mrp_el.inner_text()).strip() if mrp_el else None

                if not name or not price_text:
                    continue

                record = ProductRecord(
                    source="cargills",
                    province=province,
                    category=category_url.split("NC=")[-1] if "NC=" in category_url else "",
                    product_name=name,
                    price=self._parse_price(price_text),
                    original_price=self._parse_price(mrp_text) if mrp_text else None,
                    in_stock=(unavailable_el is None),
                    url=category_url,
                )
                self.records.append(record)

            except Exception as e:
                print(f"[cargills] error parsing a card: {e}")
                continue

    @staticmethod
    def _parse_price(text: str) -> float | None:
        """'Rs. 1,250.00' -> 1250.00"""
        if not text:
            return None
        cleaned = "".join(c for c in text if c.isdigit() or c == ".")
        try:
            return float(cleaned) if cleaned else None
        except ValueError:
            return None


async def main():
    # Scraping the whole catalog means far more page loads than two
    # categories — widen the delay range so you don't get rate-limited
    # or blocked partway through a full run.
    scraper = CargillsScraper(headless=True, min_delay=2.5, max_delay=5.0)

    # all_categories=True calls discover_categories() to walk the site's
    # own nav menu and scrape every category it finds — no hardcoded list.
    await scraper.run(all_categories=True, province="Western")
    scraper.save_csv("/home/claude/scraper/output/cargills_western_all.csv")

    # To scrape only specific categories instead, pass a dict directly:
    #   category_urls = {
    #       "rice-and-grains": "https://cargillsonline.com/Product/Rice-and-Grains?IC=1&NC=Rice-and-Grains",
    #       "dairy": "https://cargillsonline.com/Product/Dairy?IC=2&NC=Dairy",
    #   }
    #   await scraper.run(category_urls, province="Western")


if __name__ == "__main__":
    asyncio.run(main())
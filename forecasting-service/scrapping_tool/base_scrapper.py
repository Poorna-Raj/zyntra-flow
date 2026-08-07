"""
base_scraper.py

Reusable Playwright scraper foundation for e-commerce sites
(Keells, Cargills, Daraz). Handles browser lifecycle, retries,
polite rate-limiting, and writes structured output for the
forecasting pipeline (product, province, price, stock, date).

Install:
    pip install playwright pandas
    playwright install chromium
"""

import asyncio
import csv
import random
import time
from dataclasses import dataclass, asdict, field
from datetime import date
from pathlib import Path
from typing import Optional

from playwright.async_api import async_playwright, Page, Browser, TimeoutError as PWTimeout



@dataclass
class ProductRecord:
    source: str                # "keells" | "cargills" | "daraz"
    province: str               # e.g. "Western", "Southern" — set per scrape run
    category: str
    product_name: str
    price: Optional[float]
    original_price: Optional[float] = None   # useful for discount tracking
    in_stock: Optional[bool] = None
    url: str = ""
    scraped_date: str = field(default_factory=lambda: date.today().isoformat())



class BaseScraper:
    """
    Common scraping scaffolding. Subclasses implement `scrape_category()`
    with the site-specific selectors.
    """

    def __init__(
        self,
        source_name: str,
        headless: bool = True,
        min_delay: float = 1.5,
        max_delay: float = 4.0,
        max_retries: int = 3,
    ):
        self.source_name = source_name
        self.headless = headless
        self.min_delay = min_delay
        self.max_delay = max_delay
        self.max_retries = max_retries
        self.records: list[ProductRecord] = []

    async def _polite_wait(self):
        """Randomized delay between requests to avoid hammering the site."""
        await asyncio.sleep(random.uniform(self.min_delay, self.max_delay))

    async def _goto_with_retry(self, page: Page, url: str) -> bool:
        for attempt in range(1, self.max_retries + 1):
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=20000)
                return True
            except PWTimeout:
                print(f"[{self.source_name}] timeout on {url}, attempt {attempt}/{self.max_retries}")
                await asyncio.sleep(2 * attempt)  # backoff
            except Exception as e:
                print(f"[{self.source_name}] error on {url}: {e}")
                await asyncio.sleep(2 * attempt)
        return False

    async def new_browser(self, p) -> Browser:
        """
        Launch with args that reduce automation fingerprinting.
        For sites with heavier bot detection (Daraz), consider
        adding playwright-stealth on top of this.
        """
        return await p.chromium.launch(
            headless=self.headless,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
            ],
        )

    async def new_context(self, browser: Browser):
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1366, "height": 768},
            locale="en-US",
        )
        return context

    def save_csv(self, out_path: str):
        Path(out_path).parent.mkdir(parents=True, exist_ok=True)
        if not self.records:
            print(f"[{self.source_name}] no records to save.")
            return
        with open(out_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=list(asdict(self.records[0]).keys()))
            writer.writeheader()
            for r in self.records:
                writer.writerow(asdict(r))
        print(f"[{self.source_name}] saved {len(self.records)} records -> {out_path}")

    # Override in subclasses
    async def scrape_category(self, page: Page, category_url: str, province: str):
        raise NotImplementedError

    async def discover_categories(self, page: Page) -> dict[str, str]:
        raise NotImplementedError(
            f"{self.source_name} scraper does not implement category discovery yet."
        )

    async def run(
        self,
        category_urls: dict[str, str] | None = None,
        province: str = "Western",
        all_categories: bool = False,
    ):
        """
        category_urls: {"category_name": "url", ...} — hand-picked categories.
        all_categories: if True, ignores category_urls and calls
            discover_categories() to scrape the entire site's catalog.
            Expect this to take much longer and hit far more pages —
            make sure min_delay/max_delay are set generously before
            running this at full scale.
        """
        async with async_playwright() as p:
            browser = await self.new_browser(p)
            context = await self.new_context(browser)
            page = await context.new_page()

            if all_categories:
                print(f"[{self.source_name}] discovering full category list...")
                category_urls = await self.discover_categories(page)
                print(f"[{self.source_name}] found {len(category_urls)} categories.")

            if not category_urls:
                print(f"[{self.source_name}] no categories to scrape - aborting.")
                await browser.close()
                return

            for category, url in category_urls.items():
                print(f"[{self.source_name}] scraping category: {category}")
                await self.scrape_category(page, url, province)
                await self._polite_wait()

            await browser.close()
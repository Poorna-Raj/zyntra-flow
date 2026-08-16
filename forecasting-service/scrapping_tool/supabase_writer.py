"""
supabase_writer.py

Shared helper for extractors writing directly to Supabase instead of
local CSVs. Each extractor's dataclass records are converted to plain
dicts and upserted in batches, keyed on that table's unique constraint.

Install:
    pip install supabase python-dotenv
"""

import os
from dataclasses import asdict
from typing import Any

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

BATCH_SIZE = 500


def get_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        raise RuntimeError("SUPABASE_URL / SUPABASE_SERVICE_KEY missing from .env")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def upsert_records(client: Client, table_name: str, records: list, on_conflict: str,
                    row_transform=None) -> None:
    """
    Converts a list of dataclass instances to dicts (via asdict) and
    upserts them into a Supabase table in batches.

    row_transform: optional function(dict) -> dict, applied to each row
    before sending - use this for per-table fixups (e.g. parsing a JSON
    string field into a real object, casting a string flag to int).
    """
    if not records:
        print(f"[supabase-writer] no records to write to {table_name}.")
        return

    rows = [asdict(r) for r in records]
    if row_transform:
        rows = [row_transform(r) for r in rows]

    total = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        client.table(table_name).upsert(batch, on_conflict=on_conflict).execute()
        total += len(batch)

    print(f"[supabase-writer] upserted {total} rows -> Supabase.{table_name}")
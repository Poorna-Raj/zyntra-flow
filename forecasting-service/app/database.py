import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

supabase: Client = create_client(
    os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

_product_cache: list[dict] = []


def load_products() -> list[dict]:
    response = (
        supabase.table("product")
        .select("id, product_name, category, Price, image_url")
        .execute()
    )

    if not response.data:
        raise RuntimeError("No products found in the database.")
    return response.data


def get_products() -> list[dict]:
    return _product_cache


def refresh_products() -> list[dict]:
    global _product_cache
    _product_cache = load_products()
    return _product_cache

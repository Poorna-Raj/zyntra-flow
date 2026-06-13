import pandas as pd
import uuid
from datetime import timedelta, date

CREATED_BY_USER = "b1a6992f-5df4-445c-bbf9-2cbcf2d74d79"
WEEK1_DATE = date(2025, 1, 6)

df = pd.read_csv("../dataset/v3.csv")

products = df[["product_name", "category"]].drop_duplicates().reset_index(drop=True)
products["id"] = [str(uuid.uuid4()) for _ in range(len(products))]
products["created_by"] = CREATED_BY_USER

master_products_out = products.rename(columns={"product_name": "name"})[
    ["id", "name", "category", "created_by"]
]

master_products_out.to_csv("../dataset/master_products_seed.csv", index=False)
print(f"master_products_seed.csv: {len(master_products_out)} rows")

name_to_id = dict(zip(products["product_name"], products["id"]))

agg = (
    df.groupby(["province", "product_name", "week_number"])["quantity_sold"]
    .sum()
    .reset_index()
)

agg["master_product_id"] = agg["product_name"].map(name_to_id)
agg["week"] = agg["week_number"].apply(
    lambda w: WEEK1_DATE + timedelta(weeks=int(w) - 1)
)
agg["snapshot_id"] = [str(uuid.uuid4()) for _ in range(len(agg))]
agg = agg.rename(columns={"quantity_sold": "total_units_sold"})

snapshots_out = agg[
    ["snapshot_id", "master_product_id", "province", "week", "total_units_sold"]
]
snapshots_out.to_csv("../dataset/province_sale_snapshot_seed.csv", index=False)

products[["product_name", "category", "id"]].to_csv(
    "../dataset/product_id_mapping.csv", index=False
)

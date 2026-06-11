-- Users Table
-- Represents the person who owns/manages shops.
create table users(
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shop Table
-- A physical or virtual store using your POS.
CREATE TABLE shops (
  shop_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  province VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  created_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Master Product Table
-- A GLOBAL product definition shared across all shops.
CREATE TABLE master_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

-- Product Table (Shop-specific product)
-- A product as defined by a specific shop.
CREATE TABLE products (
  product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  master_product_id UUID NOT NULL REFERENCES master_products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shop_id UUID NOT NULL REFERENCES shops(shop_id) ON DELETE CASCADE
);

-- Sale Table
-- A single transaction (invoice header)
CREATE TABLE sales (
  sale_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  sold_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shop_id UUID NOT NULL REFERENCES shops(shop_id) ON DELETE CASCADE
);

-- Sale Item Table
-- The actual products inside a sale.
CREATE TABLE sale_items (
  sale_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(product_id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0)
);

-- Province Sales Snapshot Table
-- Weekly aggregated sales per province.
CREATE TABLE province_sale_snapshots (
  snapshot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  master_product_id UUID NOT NULL REFERENCES master_products(id) ON DELETE CASCADE,
  province VARCHAR(100) NOT NULL,
  week DATE NOT NULL,
  total_units_sold INTEGER NOT NULL DEFAULT 0 CHECK (total_units_sold >= 0),
  UNIQUE(master_product_id, province, week)
);

-- Forecast (Shop-level prediction) Table
-- Predictions for a specific shop.
CREATE TABLE forecasts (
  forecast_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(shop_id) ON DELETE CASCADE,
  week DATE NOT NULL,
  predicted_units INTEGER NOT NULL CHECK (predicted_units >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE
);

-- ProvinceForecast Table
-- Predicted demand for each product in each province.
CREATE TABLE province_forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  master_product_id UUID NOT NULL REFERENCES master_products(id) ON DELETE CASCADE,
  province VARCHAR(100) NOT NULL,
  week DATE NOT NULL,
  demand DECIMAL(10, 2),
  units INTEGER NOT NULL CHECK (units >= 0),
  UNIQUE(master_product_id, province, week)
);
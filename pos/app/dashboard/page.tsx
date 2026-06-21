"use client";
import { createClient } from "@supabase/supabase-js";

import { useState, useMemo, useEffect } from "react";
const supabase= createClient(
  "https://aosbwlhnyaifworwzqks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvc2J3bGhueWFpZndvcnd6cWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDU0MiwiZXhwIjoyMDk2NzU2NTQyfQ.ZLOBJWJuhdEnKkJb6c8l6Z7AFzPUyOQi5Z9eEkFYDqc"
);

// ── Types ──────────────────────────────────────────────────────────
type Sale = {
  sale_id: string;
  total_price: number;
  sold_at: string;
};

type Product = {
  product_id: string;
  name: string;
  price: number;
  is_active: boolean;
  master_products?: { category: string } | null;
};

type TopProduct = {
  product_id: string;
  name: string;
  qty: number;
  revenue: number;
};

type RangeKey = "today" | "week" | "month" | "all" | "custom";

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "all", label: "All Time" },
  { key: "custom", label: "Custom" },
];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = Sunday
  x.setDate(x.getDate() - day);
  return x;
}
function startOfMonth(d: Date) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

export default function DashboardPage() {
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState("Your Shop");
  const [initError, setInitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState<RangeKey>("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ── Resolve shop on mount ─────────────────────────────────────────
  useEffect(() => {
    init();
  }, []);

  async function init() {
  setLoading(true);
  setInitError(null);

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    setInitError("You must be logged in to view the dashboard.");
    setLoading(false);
    return;
  }

  const { data: shopList, error: shopErr } = await supabase
    .from("shops")
    .select("shop_id, name")
    .eq("created_by", user.id)
    .order("created_at");

  if (shopErr || !shopList || shopList.length === 0) {
    setInitError("No shop found for this account. Please create a shop first.");
    setLoading(false);
    return;
  }

  const remembered = localStorage.getItem("currentShopId");
  const match = shopList.find((s) => s.shop_id === remembered);
  const shop = match ?? shopList[0];

  setShopId(shop.shop_id);
  setShopName(shop.name);
  setLoading(false);
}
  // ── Date bounds for the selected range ────────────────────────────
  const { rangeStart, rangeEnd } = useMemo(() => {
    const now = new Date();
    switch (range) {
      case "today":
        return { rangeStart: startOfDay(now), rangeEnd: now };
      case "week":
        return { rangeStart: startOfWeek(now), rangeEnd: now };
      case "month":
        return { rangeStart: startOfMonth(now), rangeEnd: now };
      case "custom":
        return {
          rangeStart: customStart ? new Date(customStart) : null,
          rangeEnd: customEnd ? new Date(customEnd + "T23:59:59") : null,
        };
      case "all":
      default:
        return { rangeStart: null, rangeEnd: null };
    }
  }, [range, customStart, customEnd]);

  // ── Load data whenever shop or range changes ──────────────────────
  useEffect(() => {
    if (!shopId) return;
    if (range === "custom" && (!customStart || !customEnd)) return;
    loadData();
  }, [shopId, range, rangeStart, rangeEnd]);

  async function loadData() {
    if (!shopId) return;
    setError(null);

    // ── Sales in range ──
    let salesQuery = supabase
      .from("sales")
      .select("sale_id, total_price, sold_at")
      .eq("shop_id", shopId)
      .order("sold_at", { ascending: false });

    if (rangeStart) salesQuery = salesQuery.gte("sold_at", rangeStart.toISOString());
    if (rangeEnd) salesQuery = salesQuery.lte("sold_at", rangeEnd.toISOString());

    const { data: salesData, error: salesErr } = await salesQuery;
    if (salesErr) {
      setError(salesErr.message);
    } else {
      setSales((salesData as Sale[]) ?? []);
    }

    // ── Products (inventory snapshot — not date filtered) ──
    const { data: productsData, error: productsErr } = await supabase
      .from("products")
      .select("product_id, name, price, is_active, master_products(category)")
      .eq("shop_id", shopId);

    if (!productsErr) setProducts((productsData as any[]) ?? []);

    // ── Top selling products in range ──
    let itemsQuery = supabase
      .from("sale_items")
      .select("quantity, unit_price, product_id, products(name), sales!inner(shop_id, sold_at)")
      .eq("sales.shop_id", shopId);

    if (rangeStart) itemsQuery = itemsQuery.gte("sales.sold_at", rangeStart.toISOString());
    if (rangeEnd) itemsQuery = itemsQuery.lte("sales.sold_at", rangeEnd.toISOString());

    const { data: itemsData, error: itemsErr } = await itemsQuery;

    if (!itemsErr && itemsData) {
      const map = new Map<string, TopProduct>();
      for (const row of itemsData as any[]) {
        const id = row.product_id;
        const name = row.products?.name ?? "Unknown product";
        const qty = row.quantity ?? 0;
        const revenue = (row.unit_price ?? 0) * qty;
        if (!map.has(id)) map.set(id, { product_id: id, name, qty: 0, revenue: 0 });
        const entry = map.get(id)!;
        entry.qty += qty;
        entry.revenue += revenue;
      }
      const top = Array.from(map.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      setTopProducts(top);
    } else {
      setTopProducts([]);
    }
  }

  // ── Derived stats ──────────────────────────────────────────────
  const totalRevenue = sales.reduce((s, x) => s + x.total_price, 0);
  const totalOrders = sales.length;
  const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;

  const activeProducts = products.filter((p) => p.is_active).length;
  const inactiveProducts = products.length - activeProducts;
  const categoriesUsed = new Set(
    products.map((p) => p.master_products?.category).filter(Boolean)
  ).size;

  // ── Revenue trend (grouped by day) for a simple bar chart ────────
  const trend = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sales) {
      const day = s.sold_at.slice(0, 10); // YYYY-MM-DD
      map.set(day, (map.get(day) ?? 0) + s.total_price);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .slice(-14); // last 14 days with activity in range
  }, [sales]);

  const maxTrendValue = Math.max(1, ...trend.map(([, v]) => v));

  // ── Blocking states ──────────────────────────────────────────────
  if (!loading && initError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f0f4ff",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: "32px 28px",
            maxWidth: 380,
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(10,30,80,0.06)",
            border: "1px solid #eef0f8",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
          <p style={{ fontWeight: 800, color: "#0B1120", marginBottom: 6, fontSize: 15 }}>
            Can't load dashboard
          </p>
          <p style={{ color: "#6B7A99", fontSize: 13 }}>{initError}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f4ff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: "28px 32px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d0d8f0; border-radius: 99px; }

        .stat-card {
          background: #fff; border-radius: 16px; padding: 16px 18px;
          border: 1px solid #eef0f8; box-shadow: 0 2px 10px rgba(10,30,80,0.04);
          display: flex; align-items: center; gap: 12px;
        }
        .stat-icon {
          width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 17px;
        }
        .range-btn {
          padding: 8px 14px; border-radius: 9px; border: 1.5px solid #e8eaf0;
          background: #fff; color: #51607a; font-family: inherit;
          font-size: 12px; font-weight: 700; cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .range-btn:hover { border-color: #0A84FF; color: #0A84FF; }
        .range-btn.active {
          background: linear-gradient(135deg, #0A84FF, #0055CC);
          border-color: transparent; color: #fff;
        }
        .date-input {
          padding: 8px 12px; border: 1.5px solid #e8eaf0; border-radius: 9px;
          font-family: inherit; font-size: 12px; outline: none;
          background: #fafbff; color: #0B1120;
        }
        .date-input:focus { border-color: #0A84FF; background: #fff; }

        .panel {
          background: #fff; border-radius: 18px; overflow: hidden;
          border: 1px solid #eef0f8; box-shadow: 0 2px 12px rgba(10,30,80,0.04);
        }
        .panel-header {
          padding: 16px 18px; border-bottom: 1px solid #eef0f8;
          font-size: 14px; font-weight: 800; color: #0B1120;
        }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th {
          text-align: left; padding: 11px 18px; font-size: 11px; font-weight: 700;
          color: #9BA8BF; text-transform: uppercase; letter-spacing: 0.04em;
          background: #fafbff; border-bottom: 1px solid #eef0f8;
        }
        td { padding: 11px 18px; border-bottom: 1px solid #f3f5fb; }
        tr:last-child td { border-bottom: none; }

        .bar-wrap {
          display: flex; align-items: flex-end; gap: 6px; height: 160px;
          padding: 16px 18px 8px;
        }
        .bar {
          flex: 1; background: linear-gradient(180deg, #0A84FF, #0055CC);
          border-radius: 6px 6px 2px 2px; min-height: 3px;
          transition: opacity 0.15s;
          position: relative;
        }
        .bar:hover { opacity: 0.8; }
      `}</style>

      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                color: "#9BA8BF",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              Overview
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>
              Dashboard
            </h1>
            <p style={{ fontSize: 12, color: "#9BA8BF", fontWeight: 500, marginTop: 2 }}>
              {shopName} · sales &amp; inventory at a glance
            </p>
          </div>

          {/* Date range filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                className={`range-btn${range === opt.key ? " active" : ""}`}
                onClick={() => setRange(opt.key)}
              >
                {opt.label}
              </button>
            ))}
            {range === "custom" && (
              <>
                <input
                  type="date"
                  className="date-input"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
                <span style={{ color: "#9BA8BF", fontSize: 12 }}>to</span>
                <input
                  type="date"
                  className="date-input"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </>
            )}
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#fff0f0",
              color: "#e74c3c",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* Sales stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#eaf3ff", color: "#0A84FF" }}>
              💰
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Total Revenue</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>
                Rs{totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f9ef", color: "#1aa14a" }}>
              🧾
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Total Orders</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>{totalOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3eaff", color: "#8a3ffc" }}>
              📈
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Avg. Order Value</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>Rs{avgOrder.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Inventory stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 12,
            marginBottom: 22,
          }}
        >
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff4e5", color: "#e8930a" }}>
              📦
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Total Products</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>{products.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f9ef", color: "#1aa14a" }}>
              ✓
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Active</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>{activeProducts}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f1f2f6", color: "#8b95a8" }}>
              ⏸
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Inactive</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>{inactiveProducts}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#eaf3ff", color: "#0A84FF" }}>
              🏷️
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Categories Used</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>{categoriesUsed}</p>
            </div>
          </div>
        </div>

        {/* Revenue trend + Top products */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div className="panel">
            <div className="panel-header">Revenue Trend</div>
            {trend.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#9BA8BF", fontSize: 13 }}>
                No sales in this period
              </div>
            ) : (
              <div className="bar-wrap">
                {trend.map(([day, value]) => (
                  <div
                    key={day}
                    title={`${day}: Rs${value.toFixed(2)}`}
                    className="bar"
                    style={{ height: `${(value / maxTrendValue) * 100}%` }}
                  />
                ))}
              </div>
            )}
            {trend.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 18px 14px",
                  fontSize: 10,
                  color: "#9BA8BF",
                  fontWeight: 600,
                }}
              >
                <span>{trend[0][0]}</span>
                <span>{trend[trend.length - 1][0]}</span>
              </div>
            )}
          </div>

          <div className="panel">
            <div className="panel-header">Top Selling Products</div>
            {topProducts.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#9BA8BF", fontSize: 13 }}>
                No sales in this period
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.product_id}>
                      <td style={{ fontWeight: 700, color: "#0B1120" }}>{p.name}</td>
                      <td style={{ color: "#6B7A99" }}>{p.qty}</td>
                      <td style={{ fontWeight: 800, color: "#0A84FF" }}>Rs{p.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent sales */}
        <div className="panel">
          <div className="panel-header">Recent Sales</div>
          {loading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#9BA8BF", fontSize: 13 }}>
              Loading…
            </div>
          ) : sales.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#9BA8BF", fontSize: 13 }}>
              No sales in this period
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice(0, 10).map((s) => (
                  <tr key={s.sale_id}>
                    <td style={{ fontWeight: 700, color: "#0B1120" }}>
                      #{s.sale_id.slice(0, 8).toUpperCase()}
                    </td>
                    <td style={{ color: "#6B7A99" }}>
                      {new Date(s.sold_at).toLocaleString()}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 800, color: "#0A84FF" }}>
                      Rs{s.total_price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
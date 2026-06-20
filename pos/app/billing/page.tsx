"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const supabase = createClient(
  "https://aosbwlhnyaifworwzqks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvc2J3bGhueWFpZndvcnd6cWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDU0MiwiZXhwIjoyMDk2NzU2NTQyfQ.ZLOBJWJuhdEnKkJb6c8l6Z7AFzPUyOQi5Z9eEkFYDqc"
);

type Product = {
  product_id: string;
  master_product_id: string;
  name: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
  shop_id: string;
  category: string; // pulled from joined master_products.category
};

type CartItem = Product & { qty: number };

// ── Fallback mock products (used only if DB query fails or returns empty) ──
const MOCK_PRODUCTS: Product[] = [
  { product_id: "1", master_product_id: "m1", name: "Coca-Cola 1.5L", price: 2.99, category: "Food & Beverage", image_url: null, is_active: true, shop_id: "" },
  { product_id: "2", master_product_id: "m2", name: "Sprite 400ml", price: 1.49, category: "Food & Beverage", image_url: null, is_active: true, shop_id: "" },
  { product_id: "3", master_product_id: "m3", name: "Anchor Butter 200g", price: 3.50, category: "Food & Beverage", image_url: null, is_active: true, shop_id: "" },
  { product_id: "4", master_product_id: "m4", name: "Milo 400g", price: 4.35, category: "Food & Beverage", image_url: null, is_active: true, shop_id: "" },
  { product_id: "9", master_product_id: "m9", name: "Sunlight Soap", price: 0.85, category: "Home & Garden", image_url: null, is_active: true, shop_id: "" },
  { product_id: "10", master_product_id: "m10", name: "Toothpaste", price: 2.20, category: "Home & Garden", image_url: null, is_active: true, shop_id: "" },
];

// ── Order label generator (display only — not stored, sales has no order_number column) ──
function genOrderLabel() {
  return "#" + Math.floor(10000 + Math.random() * 90000);
}

const NAV_ITEMS = [
  { label: "POS System",    href: "/pos",           icon: "🏪" },
  { label: "Dashboard",     href: "/dashboard",      icon: "📊" },
  { label: "Product",       href: "/product",        icon: "📦" },
  { label: "Sales Reports", href: "/sales-reports",  icon: "📈" },
  { label: "Settings",      href: "/settings",       icon: "⚙️" },
];

export default function POSPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [shopId,      setShopId]      = useState<string | null>(null);
  const [shopName,    setShopName]    = useState("Your Shop");
  const [userName,    setUserName]    = useState("User");
  const [userAvatar,  setUserAvatar]  = useState<string | null>(null);
  const [activeTab,   setActiveTab]   = useState("All Items");
  const [search,      setSearch]      = useState("");
  const [products,    setProducts]    = useState<Product[]>([]);
  const [categories,  setCategories]  = useState<string[]>(["All Items"]);
  const [cart,        setCart]        = useState<CartItem[]>([]);
  // Start empty so SSR and client render the same thing (no Math.random on server)
  const [orderLabel,  setOrderLabel]  = useState("");
  const [discount,    setDiscount]    = useState(0);
  const [paying,      setPaying]      = useState(false);
  const [toast,       setToast]       = useState<{ msg: string; ok: boolean } | null>(null);

  const TAX_RATE = 0.08;

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Load user, shop, and products on mount ─────────
  useEffect(() => {
    setOrderLabel(genOrderLabel());

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      setUserName(user.user_metadata?.full_name ?? user.email ?? "users");
      setUserAvatar(user.user_metadata?.avatar_url ?? null);

      // shops uses shop_id (not id) and created_by (not owner_id)
      const { data: shop } = await supabase
        .from("shops")
        .select("shop_id, name")
        .eq("created_by", user.id)
        .single();

      if (shop) {
        setShopId(shop.shop_id);
        setShopName(shop.name);
      }

      // products has no `category`/`stock` columns — category comes via
      // the master_products join, stock doesn't exist in the schema at all
      const { data: dbProducts, error } = await supabase
        .from("products")
        .select("product_id, master_product_id, name, price, image_url, is_active, shop_id, master_products(category)")
        .eq("shop_id", shop?.shop_id ?? "")
        .eq("is_active", true)
        .order("name");

      if (error) console.warn("Failed to load products:", error.message);

      const list: Product[] =
        dbProducts && dbProducts.length > 0
          ? dbProducts.map((p: any) => ({
              product_id: p.product_id,
              master_product_id: p.master_product_id,
              name: p.name,
              price: p.price,
              image_url: p.image_url,
              is_active: p.is_active,
              shop_id: p.shop_id,
              category: p.master_products?.category ?? "Uncategorized",
            }))
          : MOCK_PRODUCTS;

      setProducts(list);

      const cats = Array.from(new Set(list.map(p => p.category))).sort();
      setCategories(["All Items", ...cats]);
    }

    load();
  }, []);

  // ── Cart helpers ───────────────────────────────────
  function addToCart(product: Product) {
    setCart(prev => {
      const exists = prev.find(i => i.product_id === product.product_id);
      if (exists) return prev.map(i => i.product_id === product.product_id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart(prev =>
      prev
        .map(i => i.product_id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  }

  function clearOrder() {
    setCart([]);
    setDiscount(0);
    setOrderLabel(genOrderLabel());
  }

  // ── Totals ────────────────────────────────────────
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = (subtotal - discount) * TAX_RATE;
  const total    = subtotal - discount + tax;

  // ── Pay Now → save sale + sale_items (matches actual schema) ──
  // NOTE: public.sales only has sale_id, total_price, sold_at, shop_id.
  // There's no column for order_number, subtotal, discount, or tax —
  // if you want those tracked, add columns to `sales` first.
  async function handlePay() {
    if (cart.length === 0 || paying || !shopId) return;
    setPaying(true);

    try {
      const { data: sale, error: saleErr } = await supabase
        .from("sales")
        .insert({
          shop_id: shopId,
          total_price: parseFloat(total.toFixed(2)),
        })
        .select("sale_id")
        .single();

      if (saleErr) throw new Error(saleErr.message);

      const items = cart.map(item => ({
        sale_id: sale.sale_id,
        product_id: item.product_id,
        quantity: item.qty,
        unit_price: item.price,
      }));

      const { error: itemsErr } = await supabase
        .from("sale_items")
        .insert(items);

      if (itemsErr) throw new Error(itemsErr.message);

      showToast(`Order ${orderLabel} saved! 🎉`);
      clearOrder();
    } catch (err: any) {
      showToast(err.message ?? "Something went wrong", false);
    } finally {
      setPaying(false);
    }
  }

  // ── Filtered products ─────────────────────────────
  const filtered = products.filter(p => {
    const matchCat    = activeTab === "All Items" || p.category === activeTab;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: "#f0f4ff",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d0d8f0; border-radius: 99px; }
        .nav-item {
          width: 100%; padding: 11px 16px; border-radius: 12px;
          border: none; background: none; cursor: pointer;
          font-family: inherit; font-size: 13px; font-weight: 600;
          color: #6B7A99; text-align: left;
          transition: background 0.15s, color 0.15s;
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .nav-item:hover { background: #e8efff; color: #0A84FF; }
        .nav-item.active {
          background: linear-gradient(135deg, #0A84FF, #0055CC);
          color: #fff; box-shadow: 0 4px 14px rgba(10,132,255,0.30);
        }
        .cat-tab {
          padding: 7px 14px; border-radius: 8px; border: none;
          font-family: inherit; font-size: 12px; font-weight: 700;
          cursor: pointer; white-space: nowrap;
          background: #f0f4ff; color: #6B7A99;
          transition: background 0.15s, color 0.15s;
        }
        .cat-tab.active { background: #0A84FF; color: #fff; }
        .cat-tab:hover:not(.active) { background: #dce8ff; color: #0A84FF; }
        .product-card {
          background: #fff; border-radius: 14px; padding: 12px;
          cursor: pointer; border: 1.5px solid transparent;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .product-card:hover {
          border-color: #0A84FF;
          box-shadow: 0 4px 16px rgba(10,132,255,0.12);
          transform: translateY(-2px);
        }
        .qty-btn {
          width: 26px; height: 26px; border-radius: 8px; border: none;
          cursor: pointer; font-size: 16px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .qty-btn.minus { background: #f0f4ff; color: #0A84FF; }
        .qty-btn.plus  { background: #0A84FF; color: #fff; }
        .qty-btn:hover.minus { background: #dce8ff; }
        .qty-btn:hover.plus  { background: #0066dd; }
        .pay-btn {
          width: 100%; padding: 14px; border: none; border-radius: 14px;
          background: linear-gradient(135deg, #0A84FF, #0055CC);
          color: #fff; font-family: inherit; font-size: 15px; font-weight: 800;
          cursor: pointer; box-shadow: 0 6px 20px rgba(10,132,255,0.35);
          transition: opacity 0.15s, transform 0.15s;
        }
        .pay-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .pay-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .search-input {
          width: 100%; padding: 9px 16px 9px 38px;
          border: 1.5px solid #e8eaf0; border-radius: 10px;
          font-family: inherit; font-size: 13px; outline: none;
          background: #fafbff; color: #0B1120;
          transition: border-color 0.15s;
        }
        .search-input:focus { border-color: #0A84FF; background: #fff; }
        .search-input::placeholder { color: #b0baca; }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: toast.ok ? "#0A84FF" : "#e74c3c",
          color: "#fff", padding: "12px 22px", borderRadius: 12,
          fontSize: 13, fontWeight: 700, zIndex: 9999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}>
          {toast.msg}
        </div>
      )}

      {/* ══ SIDEBAR ══ */}
      <div style={{
        width: 200, background: "#fff", display: "flex",
        flexDirection: "column", padding: "20px 14px",
        borderRight: "1px solid #eef0f8", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, paddingLeft: 4 }}>
          <img src="/logo new lokapos.ico" alt="logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>
            Loka<span style={{ color: "#0A84FF" }}>POS</span>
          </span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${pathname === item.href ? " active" : ""}`}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 8px", borderTop: "1px solid #eef0f8", marginTop: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #0A84FF, #0055CC)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#fff", fontWeight: 700, flexShrink: 0,
            overflow: "hidden",
          }}>
            {userAvatar
              ? <img src={userAvatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#0B1120", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</p>
            <p style={{ fontSize: 10, color: "#9BA8BF", fontWeight: 500 }}>Cashier</p>
          </div>
        </div>
      </div>

      {/* ══ MAIN — PRODUCTS ══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        <div style={{
          padding: "16px 24px", background: "#fff",
          borderBottom: "1px solid #eef0f8",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>Welcome back</p>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>{shopName}</h1>
            <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 500, marginTop: 1 }}>Shop ID: {shopName.replace(/\s/g, "").toUpperCase().slice(0, 8)}</p>
          </div>
          <div style={{ position: "relative", width: 260 }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9BA8BF" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input className="search-input" placeholder="Search for items..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div style={{
          display: "flex", gap: 8, padding: "12px 24px",
          overflowX: "auto", background: "#fff",
          borderBottom: "1px solid #eef0f8", flexShrink: 0,
        }}>
          {categories.map(cat => (
            <button key={cat} className={`cat-tab${activeTab === cat ? " active" : ""}`}
              onClick={() => setActiveTab(cat)}>{cat}</button>
          ))}
        </div>

        <div style={{
          flex: 1, overflowY: "auto", padding: "16px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: 12, alignContent: "start",
        }}>
          {filtered.map(product => (
            <div key={product.product_id} className="product-card" onClick={() => addToCart(product)}>
              <div style={{
                width: "100%", aspectRatio: "1", borderRadius: 10,
                background: product.image_url ? "transparent" : "linear-gradient(135deg, #e8f0ff, #d0e4ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, marginBottom: 8, overflow: "hidden",
              }}>
                {product.image_url
                  ? <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
                  : (product.category === "Food & Beverage" ? "🛒"
                     : product.category === "Home & Garden"  ? "🏠"
                     : "📦")}
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0B1120", marginBottom: 4, lineHeight: 1.3 }}>{product.name}</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0A84FF" }}>${product.price.toFixed(2)}</p>
              {/* stock removed — no such column in the schema; add one if you need it */}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: "#9BA8BF" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>🔍</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* ══ RIGHT — ORDER PANEL ══ */}
      <div style={{
        width: 300, background: "#fff", display: "flex", flexDirection: "column",
        borderLeft: "1px solid #eef0f8", flexShrink: 0,
      }}>
        <div style={{
          padding: "16px 18px", borderBottom: "1px solid #eef0f8",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Order</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#0B1120" }}>{orderLabel || "—"}</p>
          </div>
          <button onClick={clearOrder} style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: "#fff0f0", color: "#e74c3c",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>Clear</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9BA8BF" }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>🛒</p>
              <p style={{ fontSize: 13, fontWeight: 600 }}>No items yet</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Click a product to add</p>
            </div>
          ) : cart.map(item => (
            <div key={item.product_id} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#f8faff", borderRadius: 12, padding: "10px 12px",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: item.image_url ? "transparent" : "linear-gradient(135deg, #e8f0ff, #d0e4ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, overflow: "hidden",
              }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : "🛒"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0B1120", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#0A84FF" }}>${(item.price * item.qty).toFixed(2)}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button className="qty-btn minus" onClick={() => updateQty(item.product_id, -1)}>−</button>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#0B1120", minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                <button className="qty-btn plus"  onClick={() => updateQty(item.product_id, +1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 18px", borderTop: "1px solid #eef0f8", display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            { label: "Sub Total", value: `Rs${subtotal.toFixed(2)}` },
            { label: "Discount",  value: `-Rs${discount.toFixed(2)}`, color: "#00b894" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#9BA8BF", fontWeight: 500 }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.color ?? "#0B1120" }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #eef0f8" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#0B1120" }}>Total</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#0A84FF" }}>Rs{total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ padding: "12px 18px 18px" }}>
          <button className="pay-btn" onClick={handlePay} disabled={cart.length === 0 || paying}>
            {paying ? "Processing…" : cart.length === 0 ? "Add items to order" : `Pay Now  Rs${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
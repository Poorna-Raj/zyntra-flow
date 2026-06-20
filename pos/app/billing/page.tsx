"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseAdmin = createClient(
  "https://qpkznmugehwiiewoznfy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwa3pubXVnZWh3aWlld296bmZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDMyMjQxNiwiZXhwIjoyMDk1ODk4NDE2fQ.0zoKp3UnCtroxmsBlFDStqARokm9mhvWbTIh3gToPGk"
);

// ── Types ──────────────────────────────────────────────
type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url?: string;
  stock: number;
};

type CartItem = Product & { qty: number };

// ── Fallback mock products (used only if DB table not found or empty) ──
const MOCK_PRODUCTS: Product[] = [
  { id: "1",  name: "Coca-Cola 1.5L",     price: 2.99, category: "Food & Beverage", stock: 50 },
  { id: "2",  name: "Sprite 400ml",        price: 1.49, category: "Food & Beverage", stock: 30 },
  { id: "3",  name: "Anchor Butter 200g",  price: 3.50, category: "Food & Beverage", stock: 20 },
  { id: "4",  name: "Milo 400g",           price: 4.35, category: "Food & Beverage", stock: 15 },
  { id: "5",  name: "Eggs (10 pack)",      price: 1.99, category: "Food & Beverage", stock: 40 },
  { id: "6",  name: "Bread Loaf",          price: 1.25, category: "Food & Beverage", stock: 25 },
  { id: "7",  name: "Rice 5kg",            price: 6.50, category: "Food & Beverage", stock: 60 },
  { id: "8",  name: "Sugar 1kg",           price: 1.10, category: "Food & Beverage", stock: 45 },
  { id: "9",  name: "Sunlight Soap",       price: 0.85, category: "Home & Garden",   stock: 80 },
  { id: "10", name: "Toothpaste",          price: 2.20, category: "Home & Garden",   stock: 35 },
  { id: "11", name: "Shampoo 200ml",       price: 3.75, category: "Home & Garden",   stock: 28 },
  { id: "12", name: "Notebook A4",         price: 1.80, category: "Electronics",     stock: 55 },
];

// ── Order number generator ─────────────────────────────
function genOrderNum() {
  return "#" + Math.floor(10000 + Math.random() * 90000);
}

export default function POSPage() {
  const router = useRouter();

  const [shopId,      setShopId]      = useState<string | null>(null);
  const [shopName,    setShopName]    = useState("Your Shop");
  const [userName,    setUserName]    = useState("User");
  const [userAvatar,  setUserAvatar]  = useState<string | null>(null);
  const [activeNav,   setActiveNav]   = useState("POS System");
  const [activeTab,   setActiveTab]   = useState("All Items");
  const [search,      setSearch]      = useState("");
  const [products,    setProducts]    = useState<Product[]>([]);
  const [categories,  setCategories]  = useState<string[]>(["All Items"]);
  const [cart,        setCart]        = useState<CartItem[]>([]);
  // Start empty so SSR and client render the same thing (no Math.random on server)
  const [orderNum,    setOrderNum]    = useState("");
  const [voucher,     setVoucher]     = useState("");
  const [discount,    setDiscount]    = useState(0);
  const [paying,      setPaying]      = useState(false);
  const [toast,       setToast]       = useState<{ msg: string; ok: boolean } | null>(null);

  const TAX_RATE = 0.08;

  // ── Show toast helper ──────────────────────────────
  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Load user, shop, and products on mount ─────────
  useEffect(() => {
    // Generate order number ONLY on the client to avoid SSR/client mismatch
    setOrderNum(genOrderNum());

    async function load() {
      const { data: { user } } = await supabaseAdmin.auth.getUser();
      if (!user) { router.push("/login"); return; }

      setUserName(user.user_metadata?.full_name ?? user.email ?? "User");
      setUserAvatar(user.user_metadata?.avatar_url ?? null);

      // Fetch shop
      const { data: shop } = await supabaseAdmin
        .from("shops")
        .select("id, name")
        .eq("owner_id", user.id)
        .single();

      if (shop) {
        setShopId(shop.id);
        setShopName(shop.name);
      }

      // Try common table name variants so a naming mismatch doesn't break the page
      let dbProducts: Product[] | null = null;
      for (const table of ["products", "product", "items"]) {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select("id, name, price, category, image_url, stock")
          .order("name");

        if (!error) {
          dbProducts = data;
          console.info(`Loaded products from table: "${table}"`);
          break;
        }
        console.warn(`Table "${table}" not available, trying next…`);
      }

      const list: Product[] = (dbProducts && dbProducts.length > 0)
        ? dbProducts
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
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  }

  function clearOrder() {
    setCart([]);
    setVoucher("");
    setDiscount(0);
    setOrderNum(genOrderNum());
  }

  // ── Totals ────────────────────────────────────────
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = (subtotal - discount) * TAX_RATE;
  const total    = subtotal - discount + tax;

  // ── Pay Now → save order + order_items ────────────
  async function handlePay() {
    if (cart.length === 0 || paying) return;
    setPaying(true);

    try {
      const { data: { user } } = await supabaseAdmin.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: order, error: orderErr } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number: orderNum,
          shop_id:      shopId,
          user_id:      user.id,
          subtotal:     parseFloat(subtotal.toFixed(2)),
          discount:     parseFloat(discount.toFixed(2)),
          tax:          parseFloat(tax.toFixed(2)),
          total:        parseFloat(total.toFixed(2)),
          status:       "completed",
        })
        .select("id")
        .single();

      if (orderErr) throw new Error(orderErr.message);

      const items = cart.map(item => ({
        order_id:   order.id,
        product_id: item.id,
        name:       item.name,
        price:      item.price,
        qty:        item.qty,
        line_total: parseFloat((item.price * item.qty).toFixed(2)),
      }));

      const { error: itemsErr } = await supabaseAdmin
        .from("order_items")
        .insert(items);

      if (itemsErr) throw new Error(itemsErr.message);

      showToast(`Order ${orderNum} saved! 🎉`);
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

  const navItems = ["POS System", "Dashboard", "Product", "Sales Reports", "Settings"];

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
        .voucher-input {
          flex: 1; padding: 9px 14px;
          border: 1.5px solid #e8eaf0; border-radius: 10px;
          font-family: inherit; font-size: 13px; outline: none;
          background: #fafbff; color: #0B1120;
          transition: border-color 0.15s;
        }
        .voucher-input:focus { border-color: #0A84FF; }
        .voucher-input::placeholder { color: #b0baca; }
        @keyframes slideIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: toast.ok ? "#0A84FF" : "#e74c3c",
          color: "#fff", padding: "12px 22px", borderRadius: 12,
          fontSize: 13, fontWeight: 700, zIndex: 9999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          animation: "slideIn 0.25s ease",
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
          {navItems.map(item => (
            <button key={item} className={`nav-item${activeNav === item ? " active" : ""}`}
              onClick={() => setActiveNav(item)}>
              <span style={{ fontSize: 16 }}>
                {item === "POS System"     ? "🏪"
               : item === "Dashboard"     ? "📊"
               : item === "Product"       ? "📦"
               : item === "Sales Reports" ? "📈"
               : "⚙️"}
              </span>
              {item}
            </button>
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
            <div key={product.id} className="product-card" onClick={() => addToCart(product)}>
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
              <p style={{ fontSize: 10, color: "#9BA8BF", marginTop: 2 }}>Stock: {product.stock}</p>
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
            {/* Render a dash until client-side order number is ready */}
            <p style={{ fontSize: 15, fontWeight: 800, color: "#0B1120" }}>{orderNum || "—"}</p>
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
            <div key={item.id} style={{
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
                <button className="qty-btn minus" onClick={() => updateQty(item.id, -1)}>−</button>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#0B1120", minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                <button className="qty-btn plus"  onClick={() => updateQty(item.id, +1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "10px 18px", borderTop: "1px solid #eef0f8" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7A99", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Voucher Code</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="voucher-input" placeholder="Enter code..." value={voucher} onChange={e => setVoucher(e.target.value)} />
            <button
              onClick={() => {
                if (voucher === "SAVE10") { setDiscount(subtotal * 0.1); showToast("10% discount applied!"); }
                else showToast("Invalid voucher code", false);
              }}
              style={{ padding: "9px 14px", borderRadius: 10, border: "none", background: "#0A84FF", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              Apply
            </button>
          </div>
        </div>

        <div style={{ padding: "12px 18px", borderTop: "1px solid #eef0f8", display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            { label: "Sub Total", value: `$${subtotal.toFixed(2)}` },
            { label: "Discount",  value: `-$${discount.toFixed(2)}`, color: "#00b894" },
            { label: "Tax (8%)",  value: `$${tax.toFixed(2)}` },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#9BA8BF", fontWeight: 500 }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.color ?? "#0B1120" }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #eef0f8" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#0B1120" }}>Total</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#0A84FF" }}>${total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ padding: "12px 18px 18px" }}>
          <button className="pay-btn" onClick={handlePay} disabled={cart.length === 0 || paying}>
            {paying ? "Processing…" : cart.length === 0 ? "Add items to order" : `Pay Now  $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
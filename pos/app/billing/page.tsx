"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Types ─────────────────────────────────────────────────────────────────────

type Shop = {
  shop_id: string;
  name: string;
  province: string;
  district: string;
};

type Product = {
  product_id: string;
  name: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
  shop_id: string;
  category: string;
};

type CartItem = Product & { qty: number };

// ── Fallback mock products ────────────────────────────────────────────────────

const MOCK_PRODUCTS: Product[] = [
  { product_id: "1", name: "Coca-Cola 1.5L", price: 2.99, category: "Food & Beverage", image_url: null, is_active: true, shop_id: "" },
  { product_id: "2", name: "Sprite 400ml", price: 1.49, category: "Food & Beverage", image_url: null, is_active: true, shop_id: "" },
  { product_id: "3", name: "Anchor Butter 200g", price: 3.50, category: "Food & Beverage", image_url: null, is_active: true, shop_id: "" },
  { product_id: "4", name: "Milo 400g", price: 4.35, category: "Food & Beverage", image_url: null, is_active: true, shop_id: "" },
  { product_id: "9", name: "Sunlight Soap", price: 0.85, category: "Home & Garden", image_url: null, is_active: true, shop_id: "" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function genOrderLabel() {
  return "#" + Math.floor(10000 + Math.random() * 90000);
}

async function fetchProductsForShop(shopId: string): Promise<{ list: Product[]; cats: string[] }> {
  const { data, error } = await supabase
    .from("products")
    .select("product_id, name, price, image_url, is_active, shop_id, category")
    .eq("shop_id", shopId)
    .eq("is_active", true)
    .order("name");

  if (error) console.warn("Failed to load products:", error.message);

  const list: Product[] =
    data && data.length > 0
      ? data.map((p: any) => ({
          product_id: p.product_id,
          name: p.name,
          price: p.price,
          image_url: p.image_url,
          is_active: p.is_active,
          shop_id: p.shop_id,
          category: p.category ?? "Uncategorized",
        }))
      : MOCK_PRODUCTS;

  const cats = Array.from(new Set(list.map((p) => p.category))).sort();
  return { list, cats };
}

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "POS System", href: "/billing", icon: "🏪" },
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Product", href: "/product", icon: "📦" },
  { label: "Sales Reports", href: "/salesReport", icon: "📈" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
];

// ── Pill colors for shop profile numbers ──────────────────────────────────────

const PILL_COLORS = [
  { bg: "#ffe8e8", color: "#e05050" },
  { bg: "#fff3d6", color: "#c47f00" },
  { bg: "#ddeeff", color: "#2277cc" },
  { bg: "#e2f5e8", color: "#2a9a50" },
  { bg: "#ede8ff", color: "#7048cc" },
];

// ── Main Component ────────────────────────────────────────────────────────────

export default function POSPage() {
  const router = useRouter();
  const pathname = usePathname();

  // ── State ──
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState("Your Shop");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All Items");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Items"]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderLabel, setOrderLabel] = useState("");
  const [discount] = useState(0);
  const [paying, setPaying] = useState(false);
  const [loadingProds, setLoadingProds] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Profile popup state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const TAX_RATE = 0.08;

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Initial load ──
  useEffect(() => {
    setOrderLabel(genOrderLabel());

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      setUserName(user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User");
      setUserEmail(user.email ?? "");
      setUserAvatar(user.user_metadata?.avatar_url ?? null);

      const { data: shopList, error: shopErr } = await supabase
        .from("shops")
        .select("shop_id, name, province, district")
        .eq("created_by", user.id)
        .order("created_at");

      if (shopErr || !shopList || shopList.length === 0) {
        router.push("/shopRegister");
        return;
      }

      setShops(shopList);

      const remembered = localStorage.getItem("currentShopId");
      const match = shopList.find((s) => s.shop_id === remembered);
      const chosen = match ?? shopList[0];

      setShopId(chosen.shop_id);
      setShopName(chosen.name);
      localStorage.setItem("currentShopId", chosen.shop_id);

      setLoadingProds(true);
      const { list, cats } = await fetchProductsForShop(chosen.shop_id);
      setProducts(list);
      setCategories(["All Items", ...cats]);
      setLoadingProds(false);
    }

    load();
  }, []);

  // ── Close profile popup on outside click ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Shop switcher ──
  async function selectShop(selected: Shop) {
    setProfileOpen(false);
    if (selected.shop_id === shopId) return;

    setShopId(selected.shop_id);
    setShopName(selected.name);
    localStorage.setItem("currentShopId", selected.shop_id);

    setCart([]);
    setOrderLabel(genOrderLabel());
    setActiveTab("All Items");

    setLoadingProds(true);
    const { list, cats } = await fetchProductsForShop(selected.shop_id);
    setProducts(list);
    setCategories(["All Items", ...cats]);
    setLoadingProds(false);
  }

  // ── Cart helpers ──
  function addToCart(product: Product) {
    setCart((prev) => {
      const exists = prev.find((i) => i.product_id === product.product_id);
      if (exists) return prev.map((i) => i.product_id === product.product_id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev.map((i) => i.product_id === id ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0)
    );
  }

  function clearOrder() {
    setCart([]);
    setOrderLabel(genOrderLabel());
  }

  // ── Totals ──
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax;

  // ── Pay ──
  async function handlePay() {
    if (cart.length === 0 || paying || !shopId) return;
    setPaying(true);

    try {
      const { data: sale, error: saleErr } = await supabase
        .from("sales")
        .insert({ shop_id: shopId, total_price: parseFloat(total.toFixed(2)) })
        .select("sale_id")
        .single();

      if (saleErr) throw new Error(saleErr.message);

      const items = cart.map((item) => ({
        sale_id: sale.sale_id,
        product_id: item.product_id,
        quantity: item.qty,
        unit_price: item.price,
      }));

      const { error: itemsErr } = await supabase.from("sale_items").insert(items);
      if (itemsErr) throw new Error(itemsErr.message);

      showToast(`Order ${orderLabel} saved!`);
      clearOrder();
    } catch (err: any) {
      showToast(err.message ?? "Something went wrong", false);
    } finally {
      setPaying(false);
    }
  }

  // ── Filtered products ──
  const filtered = products.filter((p) => {
    const matchCat = activeTab === "All Items" || p.category === activeTab;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f0f4ff",
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
        .qty-btn.plus { background: #0A84FF; color: #fff; }

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

        /* ── Profile trigger ── */
        .profile-trigger {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 10px; border-radius: 14px;
          cursor: pointer; border: none; background: none;
          width: 100%; text-align: left; font-family: inherit;
          transition: background 0.15s;
        }
        .profile-trigger:hover { background: #f0f4ff; }
        .profile-trigger.open { background: #eaf3ff; }

        /* ── Profile popup ── */
        .profile-popup {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 8px; right: 8px;
          background: #fff;
          border-radius: 20px;
          border: 1px solid #eef0f8;
          box-shadow: 0 -4px 32px rgba(10,30,80,0.13), 0 8px 32px rgba(10,30,80,0.10);
          overflow: hidden;
          z-index: 200;
          animation: popupIn 0.18s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes popupIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        .popup-header {
          padding: 22px 18px 16px;
          display: flex; flex-direction: column; align-items: center;
          border-bottom: 1px solid #f3f5fb;
        }

        .popup-avatar {
          width: 56px; height: 56px; border-radius: 50%;
          background: #e8f5ec;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; font-weight: 800; color: #3aaa6a;
          margin-bottom: 10px; overflow: hidden; flex-shrink: 0;
          border: 3px solid #fff;
          box-shadow: 0 0 0 2px #d4f0e0;
        }

        .popup-section-label {
          font-size: 10px; font-weight: 700; color: #9BA8BF;
          letter-spacing: 0.07em; text-transform: uppercase;
          padding: 12px 16px 6px;
        }

        .shop-profile-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 16px; cursor: pointer; border: none;
          background: none; width: 100%; text-align: left;
          font-family: inherit; transition: background 0.12s;
        }
        .shop-profile-item:hover { background: #f8faff; }
        .shop-profile-item.active { background: #eaf3ff; }

        .shop-number-pill {
          width: 26px; height: 26px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; flex-shrink: 0;
        }

        .popup-action-btn {
          display: block; width: calc(100% - 24px); margin: 6px 12px;
          padding: 11px 16px; border-radius: 12px;
          border: 1.5px solid #eef0f8; background: #fff;
          font-family: inherit; font-size: 13px; font-weight: 700;
          color: #0B1120; cursor: pointer; text-align: center;
          text-decoration: none;
          transition: background 0.12s, border-color 0.12s;
        }
        .popup-action-btn:hover { background: #f8faff; border-color: #d8e6ff; }
        .popup-action-btn.danger { color: #c0392b; border-color: #ffd6d6; }
        .popup-action-btn.danger:hover { background: #fff5f5; border-color: #f5a0a0; }
      `}</style>

      {/* Toast */}
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
        width: 260, background: "#fff", display: "flex",
        flexDirection: "column", padding: "20px 14px",
        borderRight: "1px solid #eef0f8", flexShrink: 0,
        position: "relative",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, paddingLeft: 4 }}>
          <img src="/logo new lokapos.ico" alt="logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>
            Loka<span style={{ color: "#0A84FF" }}>POS</span>
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
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

        {/* Profile trigger + popup */}
        <div ref={profileRef} style={{ position: "relative", marginTop: 8, borderTop: "1px solid #eef0f8", paddingTop: 8 }}>

          {/* ── Profile popup (renders above the trigger) ── */}
          {profileOpen && (
            <div className="profile-popup">

              {/* Header: avatar + name + email */}
              <div className="popup-header">
                <div className="popup-avatar">
                  {userAvatar
                    ? <img src={userAvatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />
                    : userName.charAt(0).toUpperCase()}
                </div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#0B1120" }}>{userName}</p>
                <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 500, marginTop: 2 }}>{userEmail}</p>
              </div>

              {/* Other shop profiles */}
              {shops.length > 0 && (
                <>
                  <p className="popup-section-label">Other Shop Profiles</p>
                  {shops.map((s, idx) => {
                    const pill = PILL_COLORS[idx % PILL_COLORS.length];
                    const isActive = s.shop_id === shopId;
                    return (
                      <button
                        key={s.shop_id}
                        className={`shop-profile-item${isActive ? " active" : ""}`}
                        onClick={() => selectShop(s)}
                      >
                        <div
                          className="shop-number-pill"
                          style={{ background: pill.bg, color: pill.color }}
                        >
                          {idx + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: 13, fontWeight: 700,
                            color: isActive ? "#0A84FF" : "#0B1120",
                            lineHeight: 1.3, wordBreak: "break-word",
                          }}>{s.name}</p>
                          <p style={{ fontSize: 11, color: "#9BA8BF", marginTop: 1 }}>
                            {s.district}, {s.province}
                          </p>
                        </div>
                        {isActive && (
                          <span style={{ fontSize: 13, color: "#0A84FF", fontWeight: 800 }}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </>
              )}

              {/* Actions */}
              <div style={{ padding: "8px 0 12px" }}>
                <Link href="/shopRegister" className="popup-action-btn" onClick={() => setProfileOpen(false)}>
                  Add shop profile
                </Link>
                <button
                  className="popup-action-btn danger"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/login");
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          )}

          {/* ── Trigger button ── */}
          <button
            className={`profile-trigger${profileOpen ? " open" : ""}`}
            onClick={() => setProfileOpen((v) => !v)}
          >
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#e8f5ec",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "#3aaa6a", fontWeight: 800, flexShrink: 0, overflow: "hidden",
              border: "2px solid #d4f0e0",
            }}>
              {userAvatar
                ? <img src={userAvatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />
                : userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0B1120", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {userName}
              </p>
              <p style={{ fontSize: 10, color: "#9BA8BF", fontWeight: 500 }}>LokaPos Lite</p>
            </div>
            <span style={{ fontSize: 10, color: "#9BA8BF" }}>{profileOpen ? "▼" : "▲"}</span>
          </button>
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          padding: "16px 24px", background: "#fff",
          borderBottom: "1px solid #eef0f8",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
              Welcome back
            </p>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.01em" }}>
              {shopName}
            </p>
            <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 500, marginTop: 2 }}>
              {shopId ? `Shop ID: ${shopId.slice(0, 8).toUpperCase()}` : "Loading..."}
            </p>
          </div>

          <div style={{ position: "relative", width: 260 }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9BA8BF" }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="search-input"
              placeholder="Search for items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div style={{
          display: "flex", gap: 8, padding: "12px 24px",
          overflowX: "auto", background: "#fff",
          borderBottom: "1px solid #eef0f8", flexShrink: 0,
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-tab${activeTab === cat ? " active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "16px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: 12, alignContent: "start",
        }}>
          {loadingProds ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: "#9BA8BF" }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>⏳</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Loading products…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: "#9BA8BF" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>🔍</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>No products found</p>
            </div>
          ) : filtered.map((product) => (
            <div key={product.product_id} className="product-card" onClick={() => addToCart(product)}>
              <div style={{
                width: "100%", aspectRatio: "1", borderRadius: 10,
                background: product.image_url ? "transparent" : "linear-gradient(135deg, #e8f0ff, #d0e4ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, marginBottom: 8, overflow: "hidden",
              }}>
                {product.image_url
                  ? <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
                  : product.category === "Food & Beverage" ? "🛒"
                  : product.category === "Home & Garden" ? "🏠"
                  : "📦"}
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0B1120", marginBottom: 4, lineHeight: 1.3 }}>{product.name}</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0A84FF" }}>Rs.{product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ ORDER PANEL ══ */}
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
            background: "#fff0f0", color: "#e74c3c", fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>Clear</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9BA8BF" }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>🛒</p>
              <p style={{ fontSize: 13, fontWeight: 600 }}>No items yet</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Click a product to add</p>
            </div>
          ) : cart.map((item) => (
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
                <p style={{ fontSize: 12, fontWeight: 800, color: "#0A84FF" }}>Rs.{(item.price * item.qty).toFixed(2)}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button className="qty-btn minus" onClick={() => updateQty(item.product_id, -1)}>−</button>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#0B1120", minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                <button className="qty-btn plus" onClick={() => updateQty(item.product_id, +1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 18px", borderTop: "1px solid #eef0f8", display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            { label: "Sub Total", value: `Rs.${subtotal.toFixed(2)}` },
            { label: "Discount", value: `-Rs.${discount.toFixed(2)}`, color: "#00b894" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#9BA8BF", fontWeight: 500 }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: (row as any).color ?? "#0B1120" }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #eef0f8" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#0B1120" }}>Total</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#0A84FF" }}>Rs.{total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ padding: "12px 18px 18px" }}>
          <button className="pay-btn" onClick={handlePay} disabled={cart.length === 0 || paying}>
            {paying ? "Processing…" : cart.length === 0 ? "Add items to order" : `Pay Now  Rs.${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Supabase Storage bucket for product images.
// Create it once in the dashboard: Storage → New bucket → "product-images"
const IMAGE_BUCKET = "product-images";

// ── Types — mirrors public.products ──────────────────────────────────
type Product = {
  product_id: string;
  name: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
  category: string;
  shop_id: string;
  created_at: string;
};

type ProductFormState = {
  product_id: string | null;
  category: string;
  name: string;
  price: string;
  image_url: string;
  is_active: boolean;
};

const EMPTY_FORM: ProductFormState = {
  product_id: null,
  category: "",
  name: "",
  price: "",
  image_url: "",
  is_active: true,
};



export default function ProductManagement() {
  // shopId is resolved at runtime from the logged-in user — no more
  // hardcoded placeholder. null = not loaded yet, undefined-ish states
  // are handled via initError below.
  const [shopId, setShopId] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "true" | "false">("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2800);
  }

  

  // ── Bootstrap: resolve the logged-in user's shop, then load data ────
  useEffect(() => {
    init();
  }, []);

 async function init() {
  setLoading(true);
  setInitError(null);

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    setInitError("You must be logged in to manage products.");
    setLoading(false);
    return;
  }

  const { data: shopList, error: shopErr } = await supabase
    .from("shops")
    .select("shop_id")
    .eq("created_by", user.id)
    .order("created_at");

  if (shopErr || !shopList || shopList.length === 0) {
    setInitError("No shop found for this account. Please create a shop before adding products.");
    setLoading(false);
    return;
  }

  // Prefer the shop selected on the POS page; fall back to the first one
  const remembered = localStorage.getItem("currentShopId");
  const match = shopList.find((s) => s.shop_id === remembered);
  const chosen = match ?? shopList[0];

  localStorage.setItem("currentShopId", chosen.shop_id);
  setShopId(chosen.shop_id);
  await loadProducts(chosen.shop_id);
  setLoading(false);
}

  async function loadProducts(id: string) {
    const { data, error } = await supabase
  .from("products")
  .select("*")
  .eq("shop_id", id)
  .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setProducts((data as Product[]) ?? []);
  }

  function Sidebar({ userName, shopName }: { userName: string; shopName: string }) {
    const router = useRouter();
    const navItems = [
      { label: "POS System",    icon: "🏪", path: "/billing" },
      { label: "Dashboard",     icon: "📊", path: "/dashboard" },
      { label: "Product",       icon: "📦", path: "/product" },
      { label: "Sales Reports", icon: "📈", path: "/sales", active: true },
      { label: "Settings",      icon: "⚙️", path: "/settings" },
    ];
  
    return (
      <aside style={{
        width: 200, background: "#fff", display: "flex", flexDirection: "column",
        borderRight: "1px solid #eef0f8", flexShrink: 0,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "20px 16px 16px", borderBottom: "1px solid #eef0f8" }}>
          <img src="/logo new lokapos.ico" alt="LokaPOS" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: "#0B1120" }}>
            Loka<span style={{ color: "#0A84FF" }}>POS</span>
          </span>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => (
            <button key={item.label} onClick={() => router.push(item.path)} style={{
              width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
              background: item.active ? "linear-gradient(135deg,#0A84FF,#0055CC)" : "none",
              color: item.active ? "#fff" : "#6B7A99",
              fontFamily: "inherit", fontSize: 13, fontWeight: item.active ? 700 : 500,
              textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              boxShadow: item.active ? "0 4px 14px rgba(10,132,255,0.25)" : "none",
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 14px", borderTop: "1px solid #eef0f8", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg,#0A84FF,#0055CC)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0,
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#0B1120", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</p>
            <p style={{ fontSize: 10, color: "#9BA8BF" }}>{shopName}</p>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); useRouter().push("/login"); }}
            title="Logout" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9BA8BF" }}>
            🚪
          </button>
        </div>
      </aside>
    );
  }


  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const stats = useMemo(() => {
    const active = products.filter((p) => p.is_active).length;
    const avgPrice = products.length
      ? products.reduce((s, p) => s + p.price, 0) / products.length
      : 0;
    const usedCategories = new Set(products.map((p) => p.category).filter(Boolean)).size;
    return {
      total: products.length,
      active,
      inactive: products.length - active,
      avgPrice,
      usedCategories,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      const matchesStatus = !statusFilter || String(p.is_active) === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  // ── Image upload (drag & drop + click to browse) ──────────────────
  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!shopId) {
      setError("No shop found for this account.");
      return;
    }
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, WEBP...).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop();
    const filePath = `${shopId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadErr) {
      setError(uploadErr.message);
      setUploading(false);
      return;
    }

    const { data: pub } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filePath);
    setForm((f) => ({ ...f, image_url: pub.publicUrl }));
    setUploading(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
  }

  // ── Modal handlers ─────────────────────────────────────────────────
  function openAddModal() {
    setForm(EMPTY_FORM);
    setError(null);
    setIsModalOpen(true);
  }

  function openEditModal(p: Product) {
    setForm({
      product_id: p.product_id,
      category: p.category,
      name: p.name,
      price: String(p.price),
      image_url: p.image_url ?? "",
      is_active: p.is_active,
    });
    setError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setForm(EMPTY_FORM);
    setError(null);
  }

 

  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!shopId) {
      setError("No shop found for this account.");
      return;
    }

    const name = form.name.trim();
    const category = form.category.trim();

    if (!name) {
      setError("Product name is required.");
      return;
    }
    if (!category) {
      setError("Category is required.");
      return;
    }

    const priceNum = Number(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        name,
        category,
        price: priceNum,
        image_url: form.image_url.trim() || null,
        is_active: form.is_active,
        shop_id: shopId,
      };

      const { error: saveErr } = form.product_id
        ? await supabase.from("products").update(payload).eq("product_id", form.product_id)
        : await supabase.from("products").insert(payload);

      if (saveErr) throw new Error(saveErr.message);

      showToast(form.product_id ? "Product updated 🎉" : "Product added 🎉");
      closeModal();
      loadProducts(shopId);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  
  async function handleDelete(product_id: string) {
    if (!shopId) return;
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const { error } = await supabase.from("products").delete().eq("product_id", product_id);
    if (error) {
      showToast(error.message, false);
      return;
    }
    showToast("Product deleted");
    loadProducts(shopId);
  }

  
  // ── Blocking states: not logged in / no shop found ──────────────────
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏬</div>
          <p style={{ fontWeight: 800, color: "#0B1120", marginBottom: 6, fontSize: 15 }}>
            Can't load products
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

        .add-btn {
          padding: 12px 20px; border: none; border-radius: 14px;
          background: linear-gradient(135deg, #0A84FF, #0055CC);
          color: #fff; font-family: inherit; font-size: 13px; font-weight: 800;
          cursor: pointer; box-shadow: 0 6px 20px rgba(10,132,255,0.30);
          display: flex; align-items: center; gap: 8px;
          transition: opacity 0.15s, transform 0.15s;
        }
        .add-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .add-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .search-input {
          width: 100%; padding: 10px 16px 10px 38px;
          border: 1.5px solid #e8eaf0; border-radius: 10px;
          font-family: inherit; font-size: 13px; outline: none;
          background: #fafbff; color: #0B1120;
          transition: border-color 0.15s;
        }
        .search-input:focus { border-color: #0A84FF; background: #fff; }
        .search-input::placeholder { color: #b0baca; }

        .filter-select {
          padding: 10px 14px; border: 1.5px solid #e8eaf0; border-radius: 10px;
          font-family: inherit; font-size: 12px; font-weight: 600;
          background: #fafbff; color: #51607a; outline: none; cursor: pointer;
          transition: border-color 0.15s;
        }
        .filter-select:focus { border-color: #0A84FF; }

        .ptable-row { transition: background 0.15s; }
        .ptable-row:hover { background: #f8faff; }

        .icon-btn {
          width: 30px; height: 30px; border-radius: 9px; border: none;
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
        }
        .icon-btn.edit { background: #eaf3ff; color: #0A84FF; }
        .icon-btn.edit:hover { background: #d8e9ff; }
        .icon-btn.del { background: #fff0f0; color: #e74c3c; }
        .icon-btn.del:hover { background: #ffe1e1; }
        .icon-btn:active { transform: scale(0.93); }

        .status-pill {
          font-size: 11px; font-weight: 700; padding: 4px 10px;
          border-radius: 99px; display: inline-block;
        }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(11,17,32,0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 999; padding: 16px; backdrop-filter: blur(2px);
        }
        .modal-card {
          background: #fff; border-radius: 20px; width: 100%; max-width: 460px;
          padding: 26px; box-shadow: 0 20px 60px rgba(10,30,80,0.25);
          max-height: 92vh; overflow-y: auto;
        }
        .field-input, .field-select {
          width: 100%; padding: 10px 14px; border: 1.5px solid #e8eaf0;
          border-radius: 10px; font-family: inherit; font-size: 13px;
          outline: none; background: #fafbff; color: #0B1120;
          transition: border-color 0.15s;
        }
        .field-input:focus, .field-select:focus { border-color: #0A84FF; background: #fff; }

        .submit-btn {
          padding: 11px 22px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #0A84FF, #0055CC);
          color: #fff; font-family: inherit; font-size: 13px; font-weight: 800;
          cursor: pointer; box-shadow: 0 6px 18px rgba(10,132,255,0.30);
          transition: opacity 0.15s, transform 0.15s;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .cancel-btn {
          padding: 11px 22px; border: 1.5px solid #e8eaf0; border-radius: 12px;
          background: #fff; color: #51607a; font-family: inherit;
          font-size: 13px; font-weight: 700; cursor: pointer;
        }
        .cancel-btn:hover { background: #f8faff; }

        .dropzone {
          border: 2px dashed #d3dcf2; border-radius: 14px;
          padding: 22px 16px; text-align: center; cursor: pointer;
          background: #fafbff; transition: border-color 0.15s, background 0.15s;
        }
        .dropzone:hover { border-color: #b9c8f0; }
        .dropzone.active { border-color: #0A84FF; background: #eaf3ff; }
        .dropzone-preview {
          width: 100%; aspect-ratio: 16/9; border-radius: 10px; overflow: hidden;
          position: relative; background: #f0f4ff;
        }
      `}</style>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: toast.ok ? "#0A84FF" : "#e74c3c",
            color: "#fff",
            padding: "12px 22px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            zIndex: 9999,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
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
              Inventory
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>
              Products
            </h1>
            <p style={{ fontSize: 12, color: "#9BA8BF", fontWeight: 500, marginTop: 2 }}>
              Manage your shop's products
            </p>
          </div>
          <button className="add-btn" onClick={openAddModal} disabled={!shopId}>
            <span style={{ fontSize: 15 }}>＋</span> Add Product
          </button>
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 12,
            marginBottom: 22,
          }}
        >
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#eaf3ff", color: "#0A84FF" }}>
              📦
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Total Products</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f9ef", color: "#1aa14a" }}>
              ✓
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Active</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>{stats.active}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f1f2f6", color: "#8b95a8" }}>
              ⏸
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Inactive</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>{stats.inactive}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff4e5", color: "#e8930a" }}>
              🏷️
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Categories Used</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>{stats.usedCategories}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3eaff", color: "#8a3ffc" }}>
              $
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600 }}>Avg. Price</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0B1120" }}>
                Rs{stats.avgPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <svg
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9BA8BF",
              }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="search-input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Table card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid #eef0f8",
            boxShadow: "0 2px 12px rgba(10,30,80,0.04)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#fafbff", borderBottom: "1px solid #eef0f8" }}>
                {["", "Name", "Category", "Price", "Status", ""].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: i === 5 ? "right" : "left",
                      padding: "13px 18px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#9BA8BF",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ padding: "48px 0", textAlign: "center", color: "#9BA8BF", fontWeight: 600 }}
                  >
                    Loading products…
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "48px 0", textAlign: "center", color: "#9BA8BF" }}>
                    <div style={{ fontSize: 30, marginBottom: 8 }}>📦</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>No products found</div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.product_id} className="ptable-row" style={{ borderBottom: "1px solid #f3f5fb" }}>
                    <td style={{ padding: "12px 18px" }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          overflow: "hidden",
                          background: p.image_url
                            ? "transparent"
                            : "linear-gradient(135deg, #e8f0ff, #d0e4ff)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                        }}
                      >
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          "📦"
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 18px", fontWeight: 700, color: "#0B1120" }}>{p.name}</td>
                    <td style={{ padding: "12px 18px", color: "#6B7A99", fontWeight: 500 }}>
                      {p.category ?? "—"}
                    </td>
                    <td style={{ padding: "12px 18px", fontWeight: 800, color: "#0A84FF" }}>
                      ${p.price.toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 18px" }}>
                      <span
                        className="status-pill"
                        style={{
                          background: p.is_active ? "#e8f9ef" : "#f1f2f6",
                          color: p.is_active ? "#1aa14a" : "#8b95a8",
                        }}
                      >
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button className="icon-btn edit" onClick={() => openEditModal(p)} title="Edit">
                          ✎
                        </button>
                        <button
                          className="icon-btn del"
                          onClick={() => handleDelete(p.product_id)}
                          title="Delete"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0B1120", marginBottom: 18 }}>
              {form.product_id ? "Edit Product" : "Add Product"}
            </h2>

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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Image dropzone */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#51607a",
                    marginBottom: 6,
                  }}
                >
                  Product Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFiles(e.target.files)}
                />
                {form.image_url ? (
                  <div className="dropzone-preview">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        border: "none",
                        background: "rgba(11,17,32,0.6)",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className={`dropzone${dragActive ? " active" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                  >
                    {uploading ? (
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#0A84FF" }}>Uploading…</p>
                    ) : (
                      <>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>🖼️</div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#0B1120" }}>
                          Drag & drop an image here
                        </p>
                        <p style={{ fontSize: 11, color: "#9BA8BF", marginTop: 2 }}>
                          or click to browse · PNG, JPG, WEBP up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#51607a",
                    marginBottom: 6,
                  }}
                >
                  Category
                </label>
                <input
                  className="field-input"
                  type="text"
                  list="category-options"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Food & Beverage"
                  required
                />
                <datalist id="category-options">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#51607a",
                    marginBottom: 6,
                  }}
                >
                  Product Name
                </label>
                <input
                  className="field-input"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#51607a",
                    marginBottom: 6,
                  }}
                >
                  Price
                </label>
                <input
                  className="field-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#51607a",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                Active
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 6 }}>
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={saving || uploading}>
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
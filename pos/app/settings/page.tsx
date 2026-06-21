"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://aosbwlhnyaifworwzqks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvc2J3bGhueWFpZndvcnd6cWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDU0MiwiZXhwIjoyMDk2NzU2NTQyfQ.ZLOBJWJuhdEnKkJb6c8l6Z7AFzPUyOQi5Z9eEkFYDqc"
);

// ── Types ─────────────────────────────────────────────────────────────────────

type Shop = {
  shop_id: string;
  name: string;
  province: string;
  district: string;
  address: string | null;
  business_type: string | null;
};

const PROVINCES = [
  "Western", "Central", "Southern", "Northern", "Eastern",
  "North Western", "North Central", "Uva", "Sabaragamuwa",
];

const BUSINESS_TYPES = ["Retail", "Restaurant", "Grocery", "Pharmacy", "Wholesale", "Other"];

const NAV_ITEMS = [
  { label: "POS System",    href: "/billing",     icon: "🏪" },
  { label: "Dashboard",     href: "/dashboard",   icon: "📊" },
  { label: "Product",       href: "/product",     icon: "📦" },
  { label: "Sales Reports", href: "/salesReport", icon: "📈" },
  { label: "Settings",      href: "/settings",    icon: "⚙️" },
];

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

const [deletingShopId, setDeletingShopId] = useState<string | null>(null);
const [confirmDeleteShop, setConfirmDeleteShop] = useState<Shop | null>(null);
const [deletingShop, setDeletingShop] = useState(false);

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  // Profile
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ msg: string; ok: boolean } | null>(null);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ msg: string; ok: boolean } | null>(null);

  // Shops
  const [shops, setShops] = useState<Shop[]>([]);
  const [editingShopId, setEditingShopId] = useState<string | null>(null);
  const [shopForm, setShopForm] = useState<Shop | null>(null);
  const [savingShop, setSavingShop] = useState(false);
  const [shopMsg, setShopMsg] = useState<{ msg: string; ok: boolean } | null>(null);

  // ── Load everything on mount ────────────────────────────────────────
  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    async function handleShopDelete() {
  if (!confirmDeleteShop) return;
  setDeletingShop(true);
  setShopMsg(null);

  // Delete all products in the shop first
  const { error: productsErr } = await supabase
    .from("products")
    .delete()
    .eq("shop_id", confirmDeleteShop.shop_id);

  if (productsErr) {
    setShopMsg({ msg: productsErr.message, ok: false });
    setDeletingShop(false);
    return;
  }

  // Then delete the shop itself
  const { error: shopErr } = await supabase
    .from("shops")
    .delete()
    .eq("shop_id", confirmDeleteShop.shop_id);

  setDeletingShop(false);

  if (shopErr) {
    setShopMsg({ msg: shopErr.message, ok: false });
    return;
  }

  setShops((prev) => prev.filter((s) => s.shop_id !== confirmDeleteShop.shop_id));
  setConfirmDeleteShop(null);
}

    setUserId(user.id);
    setEmail(user.email ?? "");

    const { data: profile } = await supabase
      .from("users")
      .select("full_name, phone")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ? String(profile.phone) : "");
    }

    const { data: shopList } = await supabase
      .from("shops")
      .select("shop_id, name, province, district, address, business_type")
      .eq("created_by", user.id)
      .order("created_at");

    setShops(shopList ?? []);
    setLoading(false);
  }

  async function handleShopDelete() {
  if (!confirmDeleteShop) return;
  setDeletingShop(true);
  setShopMsg(null);

  // Delete all products in the shop first
  const { error: productsErr } = await supabase
    .from("products")
    .delete()
    .eq("shop_id", confirmDeleteShop.shop_id);

  if (productsErr) {
    setShopMsg({ msg: productsErr.message, ok: false });
    setDeletingShop(false);
    return;
  }

  // Then delete the shop itself
  const { error: shopErr } = await supabase
    .from("shops")
    .delete()
    .eq("shop_id", confirmDeleteShop.shop_id);

  setDeletingShop(false);

  if (shopErr) {
    setShopMsg({ msg: shopErr.message, ok: false });
    return;
  }

  setShops((prev) => prev.filter((s) => s.shop_id !== confirmDeleteShop.shop_id));
  setConfirmDeleteShop(null);
}

  // ── Profile save ─────────────────────────────────────────────────────
  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSavingProfile(true);
    setProfileMsg(null);

    const { error } = await supabase
      .from("users")
      .update({ full_name: fullName.trim(), phone: phone ? Number(phone) : null })
      .eq("user_id", userId);

    setSavingProfile(false);
    setProfileMsg(
      error ? { msg: error.message, ok: false } : { msg: "Profile updated", ok: true }
    );
  }

  // ── Password change ─────────────────────────────────────────────────
  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ msg: "New password must be at least 6 characters.", ok: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ msg: "Passwords do not match.", ok: false });
      return;
    }

    setSavingPassword(true);

    // Re-authenticate with the current password first, so a logged-in
    // session can't be used to change the password without knowing it.
    const { error: reauthErr } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (reauthErr) {
      setSavingPassword(false);
      setPasswordMsg({ msg: "Current password is incorrect.", ok: false });
      return;
    }

    const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword });

    setSavingPassword(false);

    if (updateErr) {
      setPasswordMsg({ msg: updateErr.message, ok: false });
    } else {
      setPasswordMsg({ msg: "Password updated", ok: true });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  // ── Shop edit ────────────────────────────────────────────────────────
  function openShopEdit(shop: Shop) {
    setEditingShopId(shop.shop_id);
    setShopForm({ ...shop });
    setShopMsg(null);
  }

  function closeShopEdit() {
    setEditingShopId(null);
    setShopForm(null);
  }

  async function handleShopSave(e: React.FormEvent) {
    e.preventDefault();
    if (!shopForm) return;

    if (!shopForm.name.trim()) {
      setShopMsg({ msg: "Shop name is required.", ok: false });
      return;
    }

    setSavingShop(true);
    setShopMsg(null);

    const { error } = await supabase
      .from("shops")
      .update({
        name: shopForm.name.trim(),
        province: shopForm.province,
        district: shopForm.district.trim(),
        address: shopForm.address?.trim() || null,
        business_type: shopForm.business_type || null,
      })
      .eq("shop_id", shopForm.shop_id);

    setSavingShop(false);

    if (error) {
      setShopMsg({ msg: error.message, ok: false });
      return;
    }

    setShops((prev) =>
      prev.map((s) => (s.shop_id === shopForm.shop_id ? { ...shopForm } : s))
    );
    closeShopEdit();
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f4ff",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: "#9BA8BF",
          fontWeight: 600,
        }}
      >
        Loading settings…
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "#f0f4ff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
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

        .panel {
          background: #fff; border-radius: 18px; overflow: hidden;
          border: 1px solid #eef0f8; box-shadow: 0 2px 12px rgba(10,30,80,0.04);
          margin-bottom: 18px;
        }
        .panel-header { padding: 18px 22px; border-bottom: 1px solid #eef0f8; }
        .panel-title { font-size: 15px; font-weight: 800; color: #0B1120; }
        .panel-sub { font-size: 12px; color: #9BA8BF; font-weight: 500; margin-top: 2px; }
        .panel-body { padding: 20px 22px; }

        .field-label {
          font-size: 12px; font-weight: 700; color: #51607a;
          display: block; margin-bottom: 6px;
        }
        .field-input, .field-select {
          width: 100%; padding: 10px 14px; border: 1.5px solid #e8eaf0;
          border-radius: 10px; font-family: inherit; font-size: 13px;
          outline: none; background: #fafbff; color: #0B1120;
          transition: border-color 0.15s;
        }
        .field-input:focus, .field-select:focus { border-color: #0A84FF; background: #fff; }
        .field-input:disabled { color: #9BA8BF; cursor: not-allowed; }

        .save-btn {
          padding: 11px 22px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #0A84FF, #0055CC);
          color: #fff; font-family: inherit; font-size: 13px; font-weight: 800;
          cursor: pointer; box-shadow: 0 6px 18px rgba(10,132,255,0.30);
          transition: opacity 0.15s, transform 0.15s;
        }
        .save-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .ghost-btn {
          padding: 8px 16px; border: 1.5px solid #e8eaf0; border-radius: 10px;
          background: #fff; color: #51607a; font-family: inherit;
          font-size: 12px; font-weight: 700; cursor: pointer;
        }
        .ghost-btn:hover { background: #f8faff; border-color: #0A84FF; color: #0A84FF; }

        .msg-box {
          font-size: 12px; font-weight: 600; padding: 9px 14px;
          border-radius: 9px; margin-bottom: 14px;
        }
        .msg-ok { background: #e8f9ef; color: #1aa14a; }
        .msg-err { background: #fff0f0; color: #c0392b; }

        .shop-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 22px; border-bottom: 1px solid #f3f5fb;
        }
        .shop-row:last-child { border-bottom: none; }

        .icon-btn {
          width: 32px; height: 32px; border-radius: 9px; border: none;
          background: #eaf3ff; color: #0A84FF; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .icon-btn:hover { background: #d8e9ff; }
      `}</style>

      {/* ══ SIDEBAR ══ */}
      <div
        style={{
          width: 200, background: "#fff", display: "flex",
          flexDirection: "column", padding: "20px 14px",
          borderRight: "1px solid #eef0f8", flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, paddingLeft: 4 }}>
          <img src="/logo new lokapos.ico" alt="logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>
            Loka<span style={{ color: "#0A84FF" }}>POS</span>
          </span>
        </div>

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

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="nav-item"
          style={{ borderTop: "1px solid #eef0f8", marginTop: 8, paddingTop: 16 }}
        >
          <span style={{ fontSize: 16 }}>🚪</span> Logout
        </button>
      </div>

      {/* ══ MAIN ══ */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ marginBottom: 22 }}>
            <p
              style={{
                fontSize: 11, color: "#9BA8BF", fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2,
              }}
            >
              Account
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>
              Settings
            </h1>
            <p style={{ fontSize: 12, color: "#9BA8BF", fontWeight: 500, marginTop: 2 }}>
              Manage your profile, password, and shops
            </p>
          </div>

          {/* ── Profile ── */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Profile</div>
              <div className="panel-sub">Your name and contact details</div>
            </div>
            <div className="panel-body">
              {profileMsg && (
                <div className={`msg-box ${profileMsg.ok ? "msg-ok" : "msg-err"}`}>
                  {profileMsg.msg}
                </div>
              )}
              <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label className="field-label">Email</label>
                  <input className="field-input" type="email" value={email} disabled />
                </div>
                <div>
                  <label className="field-label">Full Name</label>
                  <input
                    className="field-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="field-label">Phone</label>
                  <input
                    className="field-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                  />
                </div>
                <div>
                  <button className="save-btn" type="submit" disabled={savingProfile}>
                    {savingProfile ? "Saving…" : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {confirmDeleteShop && (
  <div
    style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
    onClick={() => !deletingShop && setConfirmDeleteShop(null)}
  >
    <div
      style={{
        background: "#fff", borderRadius: 18, padding: "24px 26px",
        maxWidth: 400, width: "90%", boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        border: "1px solid #eef0f8",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "#fff0f0", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 20, flexShrink: 0,
        }}>🗑</div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#0B1120", margin: 0 }}>Delete shop?</p>
          <p style={{ fontSize: 12, color: "#9BA8BF", margin: "2px 0 0" }}>This cannot be undone.</p>
        </div>
      </div>

      <div style={{
        background: "#fff0f0", borderRadius: 10, padding: "10px 14px",
        marginBottom: 20, border: "1px solid #f5c6c6",
      }}>
        <p style={{ fontSize: 12, color: "#c0392b", margin: 0, lineHeight: 1.6 }}>
          <strong>{confirmDeleteShop.name}</strong> — {confirmDeleteShop.district}, {confirmDeleteShop.province}
          <br />All products in this shop will also be permanently deleted.
        </p>
      </div>

      {shopMsg && (
        <div className={`msg-box ${shopMsg.ok ? "msg-ok" : "msg-err"}`} style={{ marginBottom: 14 }}>
          {shopMsg.msg}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          className="ghost-btn"
          onClick={() => setConfirmDeleteShop(null)}
          disabled={deletingShop}
        >
          Cancel
        </button>
        <button
          onClick={handleShopDelete}
          disabled={deletingShop}
          style={{
            padding: "10px 18px", border: "none", borderRadius: 12,
            background: "#c0392b", color: "#fff", fontFamily: "inherit",
            fontSize: 13, fontWeight: 800, cursor: "pointer",
            opacity: deletingShop ? 0.6 : 1,
          }}
        >
          {deletingShop ? "Deleting…" : "Delete shop & products"}
        </button>
      </div>
    </div>
  </div>
)}

          {/* ── Password ── */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Password</div>
              <div className="panel-sub">Change the password used to log in</div>
            </div>
            <div className="panel-body">
              {passwordMsg && (
                <div className={`msg-box ${passwordMsg.ok ? "msg-ok" : "msg-err"}`}>
                  {passwordMsg.msg}
                </div>
              )}
              <form onSubmit={handlePasswordSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label className="field-label">Current Password</label>
                  <input
                    className="field-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label className="field-label">New Password</label>
                    <input
                      className="field-input"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="field-label">Confirm New Password</label>
                    <input
                      className="field-input"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <button className="save-btn" type="submit" disabled={savingPassword}>
                    {savingPassword ? "Updating…" : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── Shops ── */}
          <div className="panel">
            <div
              className="panel-header"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <div>
                <div className="panel-title">Your Shops</div>
                <div className="panel-sub">Edit details or add another shop</div>
              </div>
              <button className="ghost-btn" onClick={() => router.push("/shopRegister")}>
                ＋ Add Shop
              </button>
            </div>

            {shopMsg && (
              <div style={{ padding: "12px 22px 0" }}>
                <div className={`msg-box ${shopMsg.ok ? "msg-ok" : "msg-err"}`}>{shopMsg.msg}</div>
              </div>
            )}

            {shops.length === 0 ? (
              <div style={{ padding: "40px 22px", textAlign: "center", color: "#9BA8BF", fontSize: 13 }}>
                No shops yet — add one to get started.
              </div>
            ) : (
              shops.map((shop) =>
                editingShopId === shop.shop_id && shopForm ? (
                  <div key={shop.shop_id} style={{ padding: "16px 22px", borderBottom: "1px solid #f3f5fb" }}>
                    <form onSubmit={handleShopSave} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <label className="field-label">Shop Name</label>
                        <input
                          className="field-input"
                          type="text"
                          value={shopForm.name}
                          onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <label className="field-label">Province</label>
                          <select
                            className="field-select"
                            value={shopForm.province}
                            onChange={(e) => setShopForm({ ...shopForm, province: e.target.value })}
                          >
                            {PROVINCES.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label className="field-label">District</label>
                          <input
                            className="field-input"
                            type="text"
                            value={shopForm.district}
                            onChange={(e) => setShopForm({ ...shopForm, district: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="field-label">Address</label>
                        <input
                          className="field-input"
                          type="text"
                          value={shopForm.address ?? ""}
                          onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="field-label">Business Type</label>
                        <select
                          className="field-select"
                          value={shopForm.business_type ?? ""}
                          onChange={(e) => setShopForm({ ...shopForm, business_type: e.target.value })}
                        >
                          <option value="">Select</option>
                          {BUSINESS_TYPES.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button type="button" className="ghost-btn" onClick={closeShopEdit}>
                          Cancel
                        </button>
                        <button className="save-btn" type="submit" disabled={savingShop}>
                          {savingShop ? "Saving…" : "Save Shop"}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div key={shop.shop_id} className="shop-row">
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#0B1120" }}>{shop.name}</p>
                      <p style={{ fontSize: 12, color: "#9BA8BF", marginTop: 2 }}>
                        {shop.district}, {shop.province}
                        {shop.business_type ? ` · ${shop.business_type}` : ""}
                      </p>
                    </div>
                    <button className="icon-btn" onClick={() => openShopEdit(shop)} title="Edit shop">
                      ✎
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => {
                        setConfirmDeleteShop(shop);
                        setDeletingShopId(shop.shop_id);
                      }}
                      title="Delete shop"
                    >
                      🗑️
                    </button>
                    
                    
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js/dist/index.cjs";
const supabase = createClient(
  "https://aosbwlhnyaifworwzqks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvc2J3bGhueWFpZndvcnd6cWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDU0MiwiZXhwIjoyMDk2NzU2NTQyfQ.ZLOBJWJuhdEnKkJb6c8l6Z7AFzPUyOQi5Z9eEkFYDqc"
);


// ── Types ─────────────────────────────────────────────────────────────────────

interface SaleItem {
  sale_item_id: string;
  product_id:   string;
  quantity:     number;
  unit_price:   number;
  product_name: string;
  category:     string;
}

interface Sale {
  sale_id:     string;
  total_price: number;
  sold_at:     string;
  shop_id:     string;
  items:       SaleItem[];
}

type DateFilter = "today" | "week" | "month" | "all";

// ── PDF Export ────────────────────────────────────────────────────────────────

async function exportPDF(
  sales: Sale[],
  shopName: string,
  dateFilter: DateFilter,
  stats: { revenue: number; totalOrders: number; totalItems: number; avgOrder: number }
) {
  // Dynamically import jsPDF (only in browser)
  const { jsPDF } = await import("jspdf");
  const autoTable  = (await import("jspdf-autotable")).default;

  const doc   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W     = doc.internal.pageSize.getWidth();
  const now   = new Date();
  const label = { today: "Today", week: "This Week", month: "This Month", all: "All Time" }[dateFilter];

  // ── Header ──
  doc.setFillColor(10, 132, 255);
  doc.rect(0, 0, W, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("LokaPOS — Sales Report", 14, 13);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Shop: ${shopName}`, 14, 21);
  doc.text(`Period: ${label}`, 14, 27);
  doc.text(`Generated: ${now.toLocaleString()}`, W - 14, 27, { align: "right" });

  // ── Summary cards ──
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");

  const cards = [
    { label: "Total Revenue",   value: `Rs ${stats.revenue.toFixed(2)}` },
    { label: "Total Orders",    value: String(stats.totalOrders) },
    { label: "Items Sold",      value: String(stats.totalItems) },
    { label: "Avg Order Value", value: `Rs ${stats.avgOrder.toFixed(2)}` },
  ];

  const cardW = (W - 28 - 9) / 4;
  cards.forEach((card, i) => {
    const x = 14 + i * (cardW + 3);
    doc.setFillColor(240, 244, 255);
    doc.roundedRect(x, 38, cardW, 18, 2, 2, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 120);
    doc.text(card.label.toUpperCase(), x + 4, 44);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(10, 132, 255);
    doc.text(card.value, x + 4, 52);
  });

  // ── Transactions table ──
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Transactions", 14, 67);

  const tableRows = sales.map((s) => [
    `#${s.sale_id.slice(0, 8).toUpperCase()}`,
    new Date(s.sold_at).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }),
    String(s.items.reduce((a, i) => a + i.quantity, 0)),
    `Rs ${s.total_price.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 70,
    head: [["Sale ID", "Date & Time", "Items", "Total"]],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [10, 132, 255],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8, textColor: [40, 40, 60] },
    alternateRowStyles: { fillColor: [248, 250, 255] },
    columnStyles: {
      0: { cellWidth: 35, font: "courier" },
      1: { cellWidth: 65 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 35, halign: "right", fontStyle: "bold", textColor: [10, 132, 255] },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data: any) => {
      // Footer on every page
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(160, 160, 180);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}  •  LokaPOS Sales Report  •  ${shopName}`,
        W / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: "center" }
      );
    },
  });

  // ── Item breakdown (new page) ──
  if (sales.some((s) => s.items.length > 0)) {
    doc.addPage();

    doc.setFillColor(10, 132, 255);
    doc.rect(0, 0, W, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Item Breakdown", 14, 13);

    // Top products
    const productMap: Record<string, { name: string; category: string; qty: number; revenue: number }> = {};
    sales.forEach((s) =>
      s.items.forEach((i) => {
        if (!productMap[i.product_id])
          productMap[i.product_id] = { name: i.product_name, category: i.category, qty: 0, revenue: 0 };
        productMap[i.product_id].qty     += i.quantity;
        productMap[i.product_id].revenue += i.quantity * i.unit_price;
      })
    );
    const topProds = Object.values(productMap).sort((a, b) => b.revenue - a.revenue);

    autoTable(doc, {
      startY: 26,
      head: [["#", "Product", "Category", "Units Sold", "Revenue"]],
      body: topProds.map((p, i) => [
        i + 1,
        p.name,
        p.category,
        p.qty,
        `Rs ${p.revenue.toFixed(2)}`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [10, 132, 255],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 8, textColor: [40, 40, 60] },
      alternateRowStyles: { fillColor: [248, 250, 255] },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        3: { halign: "center" },
        4: { halign: "right", fontStyle: "bold", textColor: [10, 132, 255] },
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data: any) => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(160, 160, 180);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}  •  LokaPOS Sales Report  •  ${shopName}`,
          W / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: "center" }
        );
      },
    });
  }

  // ── Save ──
  const filename = `lokapos-sales-${label.toLowerCase().replace(/\s/g, "-")}-${now.toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

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

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = "#0A84FF" }: {
  icon: string; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #eef0f8", borderRadius: 14, padding: "16px 18px",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
      }}>{icon}</div>
      <div>
        <p style={{ fontSize: 11, color: "#9BA8BF", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 800, color: "#0B1120", marginTop: 2 }}>{value}</p>
        {sub && <p style={{ fontSize: 11, color: "#9BA8BF", marginTop: 2 }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
      {data.map((d) => (
        <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <p style={{ fontSize: 9, color: "#9BA8BF", fontWeight: 600 }}>
            Rs{d.value >= 1000 ? (d.value / 1000).toFixed(1) + "k" : d.value.toFixed(0)}
          </p>
          <div style={{
            width: "100%", borderRadius: "4px 4px 0 0",
            background: "linear-gradient(180deg,#0A84FF,#0055CC)",
            height: `${Math.max((d.value / max) * 90, 4)}px`,
            transition: "height 0.4s ease",
          }} />
          <p style={{ fontSize: 9, color: "#9BA8BF", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", maxWidth: "100%", textAlign: "center" }}>
            {d.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SalesReportPage() {
  const router = useRouter();

  const [sales,       setSales]       = useState<Sale[]>([]);
  const [shopName,    setShopName]    = useState("Your Shop");
  const [userName,    setUserName]    = useState("User");
  const [loading,     setLoading]     = useState(true);
  const [exporting,   setExporting]   = useState(false);
  const [dateFilter,  setDateFilter]  = useState<DateFilter>("week");
  const [search,      setSearch]      = useState("");
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [toast,       setToast]       = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Load ──

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      setUserName(user.user_metadata?.full_name ?? user.email ?? "User");

      const { data: shop } = await supabase
        .from("shops")
        .select("shop_id, name")
        .eq("created_by", user.id)
        .single();

      if (!shop) { router.push("/shopRegister"); return; }
      setShopName(shop.name);

      const { data: salesData, error } = await supabase
        .from("sales")
        .select(`
          sale_id, total_price, sold_at, shop_id,
          sale_items (
            sale_item_id, product_id, quantity, unit_price,
            products ( name, master_products ( category ) )
          )
        `)
        .eq("shop_id", shop.shop_id)
        .order("sold_at", { ascending: false });

      if (error) { showToast("Failed to load: " + error.message, false); setLoading(false); return; }

      setSales((salesData ?? []).map((s: any) => ({
        sale_id:     s.sale_id,
        total_price: s.total_price,
        sold_at:     s.sold_at,
        shop_id:     s.shop_id,
        items: (s.sale_items ?? []).map((i: any) => ({
          sale_item_id: i.sale_item_id,
          product_id:   i.product_id,
          quantity:     i.quantity,
          unit_price:   i.unit_price,
          product_name: i.products?.name ?? "Unknown",
          category:     i.products?.master_products?.category ?? "—",
        })),
      })));
      setLoading(false);
    }
    load();
  }, []);

  // ── Filter ──

  function filterByDate(sale: Sale) {
    const now = new Date(), d = new Date(sale.sold_at);
    if (dateFilter === "today")  return d.toDateString() === now.toDateString();
    if (dateFilter === "week")   { const w = new Date(now); w.setDate(now.getDate() - 7); return d >= w; }
    if (dateFilter === "month")  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return true;
  }

  const filtered = useMemo(() => sales.filter((s) => {
    if (!filterByDate(s)) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.sale_id.toLowerCase().includes(q) || s.items.some((i) => i.product_name.toLowerCase().includes(q));
    }
    return true;
  }), [sales, dateFilter, search]);

  const stats = useMemo(() => {
    const revenue     = filtered.reduce((s, x) => s + x.total_price, 0);
    const totalOrders = filtered.length;
    const totalItems  = filtered.reduce((s, x) => s + x.items.reduce((a, i) => a + i.quantity, 0), 0);
    return { revenue, totalOrders, totalItems, avgOrder: totalOrders > 0 ? revenue / totalOrders : 0 };
  }, [filtered]);

  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    filtered.forEach((s) => s.items.forEach((i) => {
      if (!map[i.product_id]) map[i.product_id] = { name: i.product_name, qty: 0, revenue: 0 };
      map[i.product_id].qty     += i.quantity;
      map[i.product_id].revenue += i.quantity * i.unit_price;
    }));
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [filtered]);

  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return {
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        value: sales.filter((s) => new Date(s.sold_at).toDateString() === d.toDateString())
                    .reduce((sum, s) => sum + s.total_price, 0),
      };
    });
  }, [sales]);

  // ── PDF handler ──

  async function handleExportPDF() {
    if (filtered.length === 0) { showToast("No sales to export.", false); return; }
    setExporting(true);
    try {
      await exportPDF(filtered, shopName, dateFilter, stats);
      showToast("PDF downloaded! 📄");
    } catch (e: any) {
      showToast("Export failed: " + e.message, false);
    } finally {
      setExporting(false);
    }
  }

  const filterBtns: { label: string; value: DateFilter }[] = [
    { label: "Today",      value: "today" },
    { label: "This Week",  value: "week" },
    { label: "This Month", value: "month" },
    { label: "All Time",   value: "all" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f0f4ff",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d0d8f0; border-radius: 99px; }
      `}</style>

      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: toast.ok ? "#0A84FF" : "#e74c3c", color: "#fff",
          padding: "12px 22px", borderRadius: 12, fontSize: 13, fontWeight: 700,
          zIndex: 9999, boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}>{toast.msg}</div>
      )}

      <Sidebar userName={userName} shopName={shopName} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f0f4ff" }}>

        {/* Top bar */}
        <div style={{
          padding: "16px 24px", background: "#fff", borderBottom: "1px solid #eef0f8",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0B1120" }}>Sales Reports</h1>
            <p style={{ fontSize: 11, color: "#9BA8BF", marginTop: 2 }}>{shopName} · Revenue & transactions</p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Date filters */}
            {filterBtns.map((b) => (
              <button key={b.value} onClick={() => setDateFilter(b.value)} style={{
                padding: "7px 14px", borderRadius: 8,
                border: "1.5px solid",
                borderColor: dateFilter === b.value ? "#0A84FF" : "#eef0f8",
                background: dateFilter === b.value ? "#0A84FF" : "#fff",
                color: dateFilter === b.value ? "#fff" : "#6B7A99",
                fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>{b.label}</button>
            ))}

            {/* PDF Export button */}
            <button onClick={handleExportPDF} disabled={exporting} style={{
              padding: "7px 16px", borderRadius: 8, border: "none",
              background: exporting ? "#9BA8BF" : "linear-gradient(135deg,#e74c3c,#c0392b)",
              color: "#fff", fontSize: 12, fontWeight: 700, cursor: exporting ? "not-allowed" : "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
              boxShadow: exporting ? "none" : "0 4px 14px rgba(231,76,60,0.30)",
              transition: "opacity 0.15s",
            }}>
              {exporting ? "⏳ Exporting…" : "📄 Export PDF"}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            <StatCard icon="💰" label="Total Revenue"    value={`Rs${stats.revenue.toFixed(2)}`}  color="#0A84FF" />
            <StatCard icon="🧾" label="Total Orders"     value={String(stats.totalOrders)}          color="#8b5cf6" sub={`${stats.totalItems} items sold`} />
            <StatCard icon="📦" label="Items Sold"       value={String(stats.totalItems)}            color="#f59e0b" />
            <StatCard icon="📊" label="Avg Order Value"  value={`Rs${stats.avgOrder.toFixed(2)}`}  color="#10b981" />
          </div>

          {/* Chart + Top products */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14 }}>
            <div style={{ background: "#fff", border: "1px solid #eef0f8", borderRadius: 14, padding: "18px 20px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0B1120", marginBottom: 16 }}>Revenue — Last 7 Days</p>
              <BarChart data={chartData} />
            </div>
            <div style={{ background: "#fff", border: "1px solid #eef0f8", borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0B1120" }}>Top Products</p>
              {topProducts.length === 0
                ? <p style={{ fontSize: 12, color: "#9BA8BF" }}>No data yet</p>
                : topProducts.map((p, i) => (
                  <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 6, background: "#e8f0ff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, color: "#0A84FF", flexShrink: 0,
                    }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#0B1120", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      <p style={{ fontSize: 10, color: "#9BA8BF" }}>{p.qty} units · Rs{p.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Transactions table */}
          <div style={{ background: "#fff", border: "1px solid #eef0f8", borderRadius: 14, overflow: "hidden" }}>
            <div style={{
              padding: "14px 20px", borderBottom: "1px solid #eef0f8",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0B1120" }}>Transactions ({filtered.length})</p>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#9BA8BF" }}>🔍</span>
                <input
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search sales or products..."
                  style={{
                    border: "1.5px solid #eef0f8", borderRadius: 10, padding: "8px 12px 8px 32px",
                    fontSize: 13, fontFamily: "inherit", background: "#fafbff",
                    color: "#0B1120", outline: "none", width: 240,
                  }}
                />
              </div>
            </div>

            {/* Column headers */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 160px 80px 100px 36px",
              padding: "10px 20px", background: "#f8faff", borderBottom: "1px solid #eef0f8",
            }}>
              {["Sale ID", "Date & Time", "Items", "Total", ""].map((h) => (
                <p key={h} style={{ fontSize: 11, fontWeight: 700, color: "#9BA8BF", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</p>
              ))}
            </div>

            <div style={{ maxHeight: 360, overflowY: "auto" }}>
              {loading ? (
                <div style={{ padding: "32px 20px", textAlign: "center", color: "#9BA8BF", fontSize: 13 }}>Loading sales…</div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#9BA8BF" }}>
                  <p style={{ fontSize: 28, marginBottom: 8 }}>🧾</p>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>No sales found</p>
                </div>
              ) : filtered.map((sale) => (
                <div key={sale.sale_id}>
                  <div
                    onClick={() => setExpanded(expanded === sale.sale_id ? null : sale.sale_id)}
                    style={{
                      display: "grid", gridTemplateColumns: "1fr 160px 80px 100px 36px",
                      padding: "12px 20px", borderBottom: "1px solid #f0f4ff",
                      cursor: "pointer", background: expanded === sale.sale_id ? "#f8faff" : "#fff",
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "#f8faff"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = expanded === sale.sale_id ? "#f8faff" : "#fff"}
                  >
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#0B1120", fontFamily: "monospace" }}>
                      #{sale.sale_id.slice(0, 8).toUpperCase()}
                    </p>
                    <p style={{ fontSize: 12, color: "#6B7A99" }}>
                      {new Date(sale.sold_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p style={{ fontSize: 12, color: "#6B7A99" }}>
                      {sale.items.reduce((s, i) => s + i.quantity, 0)} items
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#0A84FF" }}>
                      Rs{sale.total_price.toFixed(2)}
                    </p>
                    <p style={{ fontSize: 14, color: "#9BA8BF", textAlign: "center" }}>
                      {expanded === sale.sale_id ? "▲" : "▼"}
                    </p>
                  </div>

                  {expanded === sale.sale_id && (
                    <div style={{
                      background: "#f8faff", borderBottom: "1px solid #eef0f8",
                      padding: "10px 20px 14px 40px", display: "flex", flexDirection: "column", gap: 6,
                    }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "#9BA8BF", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Items</p>
                      {sale.items.map((item) => (
                        <div key={item.sale_item_id} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          background: "#fff", borderRadius: 8, padding: "8px 12px", border: "1px solid #eef0f8",
                        }}>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#0B1120" }}>{item.product_name}</p>
                            <p style={{ fontSize: 10, color: "#9BA8BF" }}>{item.category}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 12, color: "#6B7A99" }}>{item.quantity} × Rs{item.unit_price.toFixed(2)}</p>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#0A84FF" }}>Rs{(item.quantity * item.unit_price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4, paddingTop: 8, borderTop: "1px dashed #eef0f8" }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: "#0B1120" }}>
                          Total: <span style={{ color: "#0A84FF" }}>Rs{sale.total_price.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
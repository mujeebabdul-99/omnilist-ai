"use client";

import { useState, useMemo } from "react";
import {
  Plus, Search, Filter, Package, Tag, ShoppingBag,
  Store, MoreHorizontal, Pencil, Trash2, ExternalLink,
  Grid3x3, List, Sparkles, X,
} from "lucide-react";

/* ─── Types ─── */
interface Product {
  id: string;
  upc: string;
  title: string;
  brand: string;
  category: string;
  baseCost: number;
  images: string[];
  listings: { platform: "EBAY" | "SHOPIFY"; status: string }[];
  createdAt: string;
}

/* ─── Mock data ─── */
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1", upc: "194253714972",
    title: "Apple iPhone 13 Pro 128GB Graphite Unlocked",
    brand: "Apple", category: "Smartphones",
    baseCost: 380, images: [],
    listings: [{ platform: "EBAY", status: "LIVE" }],
    createdAt: "2024-10-20",
  },
  {
    id: "2", upc: "027242921641",
    title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    brand: "Sony", category: "Audio",
    baseCost: 195, images: [],
    listings: [{ platform: "EBAY", status: "DRAFT" }, { platform: "SHOPIFY", status: "LIVE" }],
    createdAt: "2024-10-18",
  },
  {
    id: "3", upc: "194252058879",
    title: "Apple MacBook Pro 14-inch M2 Pro 512GB",
    brand: "Apple", category: "Laptops",
    baseCost: 1400, images: [],
    listings: [],
    createdAt: "2024-10-15",
  },
  {
    id: "4", upc: "887276700236",
    title: "Samsung Galaxy S24 Ultra 256GB Titanium Black",
    brand: "Samsung", category: "Smartphones",
    baseCost: 850, images: [],
    listings: [{ platform: "EBAY", status: "QUEUED" }],
    createdAt: "2024-10-12",
  },
  {
    id: "5", upc: "012914899000",
    title: "Nike Air Max 90 Mens Running Shoes Size 10",
    brand: "Nike", category: "Footwear",
    baseCost: 65, images: [],
    listings: [{ platform: "SHOPIFY", status: "LIVE" }],
    createdAt: "2024-10-10",
  },
  {
    id: "6", upc: "013803268379",
    title: "PlayStation 5 Console Disc Edition",
    brand: "Sony", category: "Gaming",
    baseCost: 420, images: [],
    listings: [{ platform: "EBAY", status: "LIVE" }, { platform: "SHOPIFY", status: "LIVE" }],
    createdAt: "2024-10-08",
  },
];

const CATEGORIES = ["All", "Smartphones", "Laptops", "Audio", "Gaming", "Footwear"];

const STATUS_CFG: Record<string, { color: string; bg: string }> = {
  LIVE:       { color: "#C5E756", bg: "rgba(197,231,86,0.12)" },
  DRAFT:      { color: "#82DBF7", bg: "rgba(130,219,247,0.12)" },
  QUEUED:     { color: "#F5AF02", bg: "rgba(245,175,2,0.12)" },
  ERROR:      { color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
};

const PLATFORM_CFG = {
  EBAY:    { color: "#E53238", label: "eBay" },
  SHOPIFY: { color: "#96BF48", label: "Shopify" },
};

/* ─── Add Product Modal ─── */
function AddProductModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"scan" | "manual">("scan");
  const [upc, setUpc] = useState("");

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "480px",
          borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)",
          background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
          animation: "fadeIn 0.2s ease-out both",
        }}
      >
        {/* Modal header */}
        <div style={{ padding: "24px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#FFFFFF", margin: 0 }}>Add Product</h2>
            <p style={{ fontSize: "12px", color: "#5A6270", marginTop: "3px" }}>Import via UPC or enter details manually</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#5A6270", display: "flex" }}>
            <X style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        {/* Toggle */}
        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "4px" }}>
            {(["scan", "manual"] as const).map((s) => (
              <button key={s} onClick={() => setStep(s)} style={{
                flex: 1, padding: "8px", borderRadius: "9px", border: "none", cursor: "pointer",
                background: step === s ? "rgba(255,255,255,0.08)" : "transparent",
                color: step === s ? "#FFFFFF" : "#5A6270",
                fontSize: "12px", fontWeight: "600", fontFamily: "inherit",
                textTransform: "capitalize",
              }}>
                {s === "scan" ? "🔍 UPC / Barcode" : "✏️ Manual Entry"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "20px 24px 24px" }}>
          {step === "scan" ? (
            <div>
              <p style={{ fontSize: "12px", color: "#5A6270", marginBottom: "12px" }}>
                Enter a UPC/EAN and OmniList will auto-fetch product data
              </p>
              <input
                type="text" value={upc} onChange={(e) => setUpc(e.target.value)}
                placeholder="e.g. 194253714972"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "#FFFFFF", fontSize: "14px", fontFamily: "monospace",
                  outline: "none", boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button style={{
                  flex: 1, padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, #C5E756 0%, #A8D43E 100%)",
                  color: "#0A0D10", fontWeight: "700", fontSize: "13px", fontFamily: "inherit",
                }}>
                  Lookup UPC
                </button>
                <button onClick={onClose} style={{
                  padding: "12px 16px", borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
                  background: "transparent", color: "#6C737F", fontFamily: "inherit",
                }}>Cancel</button>
              </div>
              <div style={{
                marginTop: "16px", padding: "12px", borderRadius: "12px",
                background: "rgba(197,231,86,0.06)", border: "1px solid rgba(197,231,86,0.15)",
                display: "flex", alignItems: "flex-start", gap: "8px",
              }}>
                <Sparkles style={{ width: "13px", height: "13px", color: "#C5E756", marginTop: "1px", flexShrink: 0 }} />
                <p style={{ fontSize: "12px", color: "#8E95A0", margin: 0 }}>
                  After lookup, you can immediately generate an AI-optimized listing from the dashboard command bar
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Product Title", placeholder: "Apple iPhone 13 Pro 128GB..." },
                { label: "Brand", placeholder: "Apple" },
                { label: "UPC / EAN", placeholder: "194253714972" },
                { label: "Base Cost ($)", placeholder: "380.00" },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label style={{ fontSize: "11px", fontWeight: "700", color: "#5A6270", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "5px" }}>
                    {label}
                  </label>
                  <input placeholder={placeholder} style={{
                    width: "100%", padding: "10px 14px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#FFFFFF", fontSize: "13px", fontFamily: "inherit",
                    outline: "none", boxSizing: "border-box",
                  }} />
                </div>
              ))}
              <button style={{
                padding: "13px", borderRadius: "12px", border: "none", cursor: "pointer", marginTop: "4px",
                background: "linear-gradient(135deg, #C5E756 0%, #A8D43E 100%)",
                color: "#0A0D10", fontWeight: "700", fontSize: "13px", fontFamily: "inherit",
              }}>Add Product</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Product Card (Grid view) ─── */
function ProductCard({ product, onList }: { product: Product; onList: (p: Product) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalListings = product.listings.length;
  const liveCount = product.listings.filter((l) => l.status === "LIVE").length;

  return (
    <div style={{
      borderRadius: "18px",
      border: "1px solid rgba(255,255,255,0.06)",
      background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)",
      overflow: "hidden",
      transition: "border-color 0.2s, transform 0.2s",
      cursor: "default",
      position: "relative",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(197,231,86,0.2)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >
      {/* Image placeholder */}
      <div style={{
        height: "140px", background: "linear-gradient(135deg, #12181F 0%, #0D1217 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        position: "relative",
      }}>
        <Package style={{ width: "40px", height: "40px", color: "#2A3040" }} />
        {/* Category badge */}
        <div style={{
          position: "absolute", top: "10px", left: "10px",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
          borderRadius: "8px", padding: "3px 8px",
          fontSize: "10px", fontWeight: "700", color: "#8E95A0",
        }}>{product.category}</div>
        {/* Menu button */}
        <div style={{ position: "absolute", top: "8px", right: "8px" }}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            style={{ background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", color: "#6C737F", borderRadius: "8px", padding: "4px", display: "flex" }}
          >
            <MoreHorizontal style={{ width: "16px", height: "16px" }} />
          </button>
          {menuOpen && (
            <div style={{
              position: "absolute", top: "100%", right: 0, marginTop: "4px", zIndex: 10,
              background: "#0D1217", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px",
              padding: "6px", minWidth: "140px", boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
            }}>
              {[
                { icon: Pencil, label: "Edit", color: "#E1E4EA" },
                { icon: Sparkles, label: "Generate Listing", color: "#C5E756" },
                { icon: ExternalLink, label: "View Details", color: "#E1E4EA" },
                { icon: Trash2, label: "Delete", color: "#EF4444" },
              ].map(({ icon: Icon, label, color }) => (
                <button key={label} style={{
                  display: "flex", alignItems: "center", gap: "8px", width: "100%",
                  padding: "8px 10px", borderRadius: "8px", border: "none",
                  background: "none", cursor: "pointer", color, fontSize: "12px",
                  fontFamily: "inherit", textAlign: "left",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                >
                  <Icon style={{ width: "13px", height: "13px" }} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#FFFFFF", lineHeight: "1.4", marginBottom: "4px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.title}
        </p>
        <p style={{ fontSize: "11px", color: "#5A6270", marginBottom: "10px" }}>
          {product.brand} · UPC: {product.upc.slice(-6)}
        </p>

        {/* Price + listings */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontSize: "18px", fontWeight: "800", color: "#C5E756" }}>
            ${product.baseCost.toFixed(2)}
          </span>
          <div style={{ display: "flex", gap: "4px" }}>
            {product.listings.map((l, i) => {
              const pcfg = PLATFORM_CFG[l.platform];
              const scfg = STATUS_CFG[l.status] ?? STATUS_CFG.DRAFT;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "3px",
                  background: scfg.bg, borderRadius: "6px", padding: "3px 7px",
                }}>
                  <span style={{ fontSize: "9px", fontWeight: "700", color: pcfg.color }}>{pcfg.label}</span>
                  <span style={{ fontSize: "9px", color: scfg.color }}>·{l.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* List button */}
        <button
          onClick={() => onList(product)}
          style={{
            width: "100%", padding: "9px", borderRadius: "10px", cursor: "pointer",
            background: totalListings > 0 ? "rgba(255,255,255,0.04)" : "rgba(197,231,86,0.12)",
            border: `1px solid ${totalListings > 0 ? "rgba(255,255,255,0.06)" : "rgba(197,231,86,0.25)"}`,
            color: totalListings > 0 ? "#6C737F" : "#C5E756",
            fontSize: "12px", fontWeight: "700", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(197,231,86,0.18)"; (e.currentTarget as HTMLButtonElement).style.color = "#C5E756"; }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = totalListings > 0 ? "rgba(255,255,255,0.04)" : "rgba(197,231,86,0.12)";
            (e.currentTarget as HTMLButtonElement).style.color = totalListings > 0 ? "#6C737F" : "#C5E756";
          }}
        >
          <Sparkles style={{ width: "12px", height: "12px" }} />
          {totalListings > 0 ? `${liveCount}/${totalListings} Live · Add More` : "Generate AI Listing"}
        </button>
      </div>
    </div>
  );
}

/* ─── Product Row (List view) ─── */
function ProductRow({ product }: { product: Product }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 100px 120px 140px 100px",
      alignItems: "center", padding: "14px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      transition: "background 0.15s",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Package style={{ width: "18px", height: "18px", color: "#3A4050" }} />
        </div>
        <div>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#FFFFFF", margin: "0 0 2px", lineHeight: "1.3" }}>{product.title}</p>
          <p style={{ fontSize: "11px", color: "#5A6270", margin: 0 }}>{product.brand} · {product.upc}</p>
        </div>
      </div>
      <span style={{ fontSize: "12px", color: "#6C737F" }}>{product.category}</span>
      <span style={{ fontSize: "15px", fontWeight: "700", color: "#C5E756" }}>${product.baseCost.toFixed(2)}</span>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {product.listings.length === 0 ? (
          <span style={{ fontSize: "11px", color: "#4A5160" }}>No listings</span>
        ) : product.listings.map((l, i) => {
          const scfg = STATUS_CFG[l.status] ?? STATUS_CFG.DRAFT;
          const pcfg = PLATFORM_CFG[l.platform];
          return (
            <div key={i} style={{ background: scfg.bg, borderRadius: "6px", padding: "2px 6px", display: "flex", alignItems: "center", gap: "3px" }}>
              <span style={{ fontSize: "9px", fontWeight: "700", color: pcfg.color }}>{pcfg.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5160", display: "flex" }}>
          <Pencil style={{ width: "14px", height: "14px" }} />
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5160", display: "flex" }}>
          <MoreHorizontal style={{ width: "14px", height: "14px" }} />
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.upc.includes(search) || p.brand.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080B0E", padding: "40px 40px 80px" }}>
      {showModal && <AddProductModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.03em", margin: "0 0 6px" }}>
            Product Catalog
          </h1>
          <p style={{ fontSize: "14px", color: "#5A6270", margin: 0 }}>
            {MOCK_PRODUCTS.length} products · {MOCK_PRODUCTS.reduce((a, p) => a + p.listings.filter(l => l.status === "LIVE").length, 0)} live listings
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "11px 20px", borderRadius: "14px", border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #C5E756 0%, #A8D43E 100%)",
            color: "#0A0D10", fontWeight: "700", fontSize: "13px", fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(197,231,86,0.3)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(197,231,86,0.4)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(197,231,86,0.3)"; }}
        >
          <Plus style={{ width: "16px", height: "16px" }} />
          Add Product
        </button>
      </div>

      {/* Search + Filters + View toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "220px" }}>
          <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#4A5160" }} />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, UPC, brand…"
            style={{
              width: "100%", padding: "11px 14px 11px 40px", borderRadius: "12px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              color: "#FFFFFF", fontSize: "13px", fontFamily: "inherit",
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: "8px 14px", borderRadius: "10px", cursor: "pointer",
              background: category === cat ? "rgba(197,231,86,0.15)" : "rgba(255,255,255,0.04)",
              color: category === cat ? "#C5E756" : "#6C737F",
              fontSize: "12px", fontWeight: category === cat ? "700" : "500",
              fontFamily: "inherit",
              border: `1px solid ${category === cat ? "rgba(197,231,86,0.3)" : "rgba(255,255,255,0.06)"}`,
              transition: "all 0.15s",
            }}>{cat}</button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "3px", marginLeft: "auto" }}>
          {([["grid", Grid3x3], ["list", List]] as const).map(([mode, Icon]) => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{
              padding: "7px 10px", borderRadius: "8px", border: "none", cursor: "pointer",
              background: viewMode === mode ? "rgba(255,255,255,0.08)" : "transparent",
              color: viewMode === mode ? "#FFFFFF" : "#5A6270", display: "flex",
            }}>
              <Icon style={{ width: "15px", height: "15px" }} />
            </button>
          ))}
        </div>
      </div>

      {/* Grid view */}
      {viewMode === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onList={() => {
              // Navigate to dashboard with product context
              window.location.href = `/?product=${p.id}`;
            }} />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#4A5160" }}>
              <Package style={{ width: "40px", height: "40px", margin: "0 auto 12px", opacity: 0.4 }} />
              <p style={{ fontSize: "15px", color: "#6C737F" }}>No products match your search</p>
            </div>
          )}
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <div style={{ borderRadius: "18px", border: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)", overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 120px 140px 100px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {["Product", "Category", "Cost", "Listings", ""].map((h) => (
              <span key={h} style={{ fontSize: "10px", fontWeight: "700", color: "#4A5160", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
            ))}
          </div>
          {filtered.map((p) => <ProductRow key={p.id} product={p} />)}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#4A5160" }}>No products match your search</div>
          )}
        </div>
      )}
    </div>
  );
}

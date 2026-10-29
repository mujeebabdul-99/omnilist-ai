"use client";

import { useState, useMemo } from "react";
import {
  Search, Filter, Tag, ShoppingBag, Store,
  MoreHorizontal, ExternalLink, RefreshCw, Trash2,
  TrendingUp, Eye, Edit3, CheckCircle, Clock,
  XCircle, AlertCircle, Zap, ChevronDown, ArrowUpDown,
  Package, BarChart2,
} from "lucide-react";

/* ─── Types ─── */
type Platform = "EBAY" | "SHOPIFY";
type Status = "LIVE" | "DRAFT" | "QUEUED" | "ERROR" | "ENDED";

interface Listing {
  id: string;
  productTitle: string;
  platform: Platform;
  status: Status;
  price: number;
  views: number;
  watchers: number;
  aiScore: number;
  listedAt: string;
  category: string;
  condition: string;
  externalUrl?: string;
}

/* ─── Mock data ─── */
const MOCK_LISTINGS: Listing[] = [
  { id: "L001", productTitle: "Apple iPhone 13 Pro 128GB Graphite - Unlocked - Good Condition", platform: "EBAY", status: "LIVE", price: 450, views: 284, watchers: 12, aiScore: 95, listedAt: "2024-10-20", category: "Cell Phones", condition: "Used - Good", externalUrl: "#" },
  { id: "L002", productTitle: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones Black", platform: "SHOPIFY", status: "LIVE", price: 249, views: 97, watchers: 0, aiScore: 88, listedAt: "2024-10-18", category: "Audio", condition: "New", externalUrl: "#" },
  { id: "L003", productTitle: "Sony WH-1000XM5 Wireless Headphones Over-Ear ANC", platform: "EBAY", status: "DRAFT", price: 239, views: 0, watchers: 0, aiScore: 78, listedAt: "2024-10-18", category: "Headphones", condition: "Open box" },
  { id: "L004", productTitle: "Samsung Galaxy S24 Ultra 256GB Titanium Black Unlocked", platform: "EBAY", status: "QUEUED", price: 920, views: 0, watchers: 0, aiScore: 91, listedAt: "2024-10-15", category: "Cell Phones", condition: "Used - Like New" },
  { id: "L005", productTitle: "PlayStation 5 Console Disc Edition - Bundle", platform: "EBAY", status: "LIVE", price: 480, views: 1240, watchers: 43, aiScore: 82, listedAt: "2024-10-12", category: "Gaming", condition: "Used - Very Good", externalUrl: "#" },
  { id: "L006", productTitle: "Nike Air Max 90 Mens Shoes Size 10 White/Black", platform: "SHOPIFY", status: "LIVE", price: 95, views: 58, watchers: 0, aiScore: 74, listedAt: "2024-10-10", category: "Footwear", condition: "New", externalUrl: "#" },
  { id: "L007", productTitle: "Apple MacBook Pro 14-inch M2 Pro 512GB Space Gray", platform: "EBAY", status: "ERROR", price: 1499, views: 12, watchers: 1, aiScore: 89, listedAt: "2024-10-08", category: "Laptops", condition: "Refurbished" },
  { id: "L008", productTitle: "PlayStation 5 Controller DualSense Midnight Black", platform: "SHOPIFY", status: "ENDED", price: 69, views: 320, watchers: 0, aiScore: 76, listedAt: "2024-09-30", category: "Gaming", condition: "New" },
];

/* ─── Config ─── */
const STATUS_CFG: Record<Status, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle }> = {
  LIVE:   { label: "Live",    color: "#C5E756", bg: "rgba(197,231,86,0.1)",  border: "rgba(197,231,86,0.25)",  icon: CheckCircle },
  DRAFT:  { label: "Draft",   color: "#82DBF7", bg: "rgba(130,219,247,0.1)", border: "rgba(130,219,247,0.25)", icon: Edit3 },
  QUEUED: { label: "Queued",  color: "#F5AF02", bg: "rgba(245,175,2,0.1)",   border: "rgba(245,175,2,0.25)",   icon: Clock },
  ERROR:  { label: "Error",   color: "#EF4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",   icon: XCircle },
  ENDED:  { label: "Ended",   color: "#6C737F", bg: "rgba(108,115,127,0.1)", border: "rgba(108,115,127,0.2)", icon: AlertCircle },
};

const PLATFORM_CFG: Record<Platform, { color: string; icon: typeof ShoppingBag }> = {
  EBAY:    { color: "#E53238", icon: ShoppingBag },
  SHOPIFY: { color: "#96BF48", icon: Store },
};

const ALL_STATUSES: Status[] = ["LIVE", "DRAFT", "QUEUED", "ERROR", "ENDED"];

/* ─── Stat Card ─── */
function MiniStat({ label, value, sub, color = "#FFFFFF" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{
      flex: 1, padding: "20px 22px",
      borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)",
      background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)",
    }}>
      <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4A5160", margin: "0 0 8px" }}>{label}</p>
      <p style={{ fontSize: "24px", fontWeight: "800", color, margin: "0 0 2px", letterSpacing: "-0.03em" }}>{value}</p>
      {sub && <p style={{ fontSize: "11px", color: "#4A5160", margin: 0 }}>{sub}</p>}
    </div>
  );
}

/* ─── Row action menu ─── */
function ActionMenu({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const items = [
    { icon: Eye, label: "View on Marketplace", color: "#E1E4EA", disabled: !listing.externalUrl },
    { icon: Edit3, label: "Edit Listing", color: "#E1E4EA" },
    { icon: RefreshCw, label: "Re-optimize with AI", color: "#C5E756" },
    { icon: Zap, label: listing.status === "LIVE" ? "End Listing" : "Publish Now", color: listing.status === "LIVE" ? "#F5AF02" : "#C5E756" },
    { icon: Trash2, label: "Delete", color: "#EF4444" },
  ];
  return (
    <div
      style={{
        position: "absolute", top: "100%", right: 0, marginTop: "6px", zIndex: 20,
        background: "#0D1217", border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "14px", padding: "6px", minWidth: "190px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
        animation: "fadeIn 0.15s ease-out both",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map(({ icon: Icon, label, color, disabled }) => (
        <button key={label} disabled={!!disabled} style={{
          display: "flex", alignItems: "center", gap: "9px", width: "100%",
          padding: "9px 12px", borderRadius: "9px", border: "none",
          background: "none", cursor: disabled ? "not-allowed" : "pointer",
          color: disabled ? "#3A4050" : color, fontSize: "13px", fontFamily: "inherit",
          textAlign: "left", transition: "background 0.12s",
        }}
          onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
          onClick={onClose}
        >
          <Icon style={{ width: "14px", height: "14px", flexShrink: 0 }} />
          {label}
        </button>
      ))}
    </div>
  );
}

/* ─── Table Row ─── */
function ListingRow({ listing }: { listing: Listing }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scfg = STATUS_CFG[listing.status];
  const pcfg = PLATFORM_CFG[listing.platform];
  const StatusIcon = scfg.icon;
  const PlatformIcon = pcfg.icon;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2.8fr 110px 110px 90px 80px 80px 80px 60px",
        alignItems: "center", padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.15s", position: "relative",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
      onClick={() => setMenuOpen(false)}
    >
      {/* Title + ID */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", minWidth: 0 }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Package style={{ width: "16px", height: "16px", color: "#3A4050" }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: "13px", fontWeight: "600", color: "#FFFFFF", margin: "0 0 3px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{listing.productTitle}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", fontWeight: "600", color: "#3E4756" }}>{listing.id}</span>
            <span style={{ fontSize: "10px", color: "#3E4756" }}>·</span>
            <span style={{ fontSize: "10px", color: "#3E4756" }}>{listing.condition}</span>
          </div>
        </div>
      </div>

      {/* Platform */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <PlatformIcon style={{ width: "13px", height: "13px", color: pcfg.color }} />
        <span style={{ fontSize: "12px", fontWeight: "600", color: pcfg.color }}>{listing.platform === "EBAY" ? "eBay" : "Shopify"}</span>
      </div>

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: scfg.bg, border: `1px solid ${scfg.border}`, borderRadius: "8px", padding: "4px 10px", width: "fit-content" }}>
        <StatusIcon style={{ width: "11px", height: "11px", color: scfg.color, flexShrink: 0 }} />
        <span style={{ fontSize: "11px", fontWeight: "700", color: scfg.color }}>{scfg.label}</span>
      </div>

      {/* Price */}
      <span style={{ fontSize: "14px", fontWeight: "700", color: "#C5E756" }}>${listing.price.toFixed(2)}</span>

      {/* Views */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Eye style={{ width: "12px", height: "12px", color: "#4A5160" }} />
        <span style={{ fontSize: "12px", color: listing.views > 0 ? "#A0A6B2" : "#4A5160" }}>{listing.views > 999 ? `${(listing.views / 1000).toFixed(1)}k` : listing.views}</span>
      </div>

      {/* Watchers */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <TrendingUp style={{ width: "12px", height: "12px", color: listing.watchers > 0 ? "#F5AF02" : "#4A5160" }} />
        <span style={{ fontSize: "12px", color: listing.watchers > 0 ? "#F5AF02" : "#4A5160" }}>{listing.watchers}</span>
      </div>

      {/* AI Score */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <div style={{
          width: "32px", height: "5px", borderRadius: "3px",
          background: "rgba(255,255,255,0.06)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: "3px",
            width: `${listing.aiScore}%`,
            background: listing.aiScore >= 85 ? "#C5E756" : listing.aiScore >= 70 ? "#F5AF02" : "#EF4444",
          }} />
        </div>
        <span style={{ fontSize: "11px", color: "#5A6270" }}>{listing.aiScore}</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", position: "relative" }}>
        {listing.externalUrl && (
          <a href={listing.externalUrl} target="_blank" rel="noopener noreferrer"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5160", display: "flex", padding: "4px", marginRight: "4px", textDecoration: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink style={{ width: "14px", height: "14px" }} />
          </a>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5160", display: "flex", padding: "4px", borderRadius: "6px" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#4A5160"; }}
        >
          <MoreHorizontal style={{ width: "16px", height: "16px" }} />
        </button>
        {menuOpen && <ActionMenu listing={listing} onClose={() => setMenuOpen(false)} />}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ListingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [platformFilter, setPlatformFilter] = useState<Platform | "ALL">("ALL");

  const filtered = useMemo(() => {
    return MOCK_LISTINGS.filter((l) => {
      const matchSearch = search === "" || l.productTitle.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
      const matchPlatform = platformFilter === "ALL" || l.platform === platformFilter;
      return matchSearch && matchStatus && matchPlatform;
    });
  }, [search, statusFilter, platformFilter]);

  // Aggregate stats
  const liveCount = MOCK_LISTINGS.filter((l) => l.status === "LIVE").length;
  const totalViews = MOCK_LISTINGS.reduce((a, l) => a + l.views, 0);
  const totalWatchers = MOCK_LISTINGS.reduce((a, l) => a + l.watchers, 0);
  const avgScore = Math.round(MOCK_LISTINGS.reduce((a, l) => a + l.aiScore, 0) / MOCK_LISTINGS.length);
  const errorCount = MOCK_LISTINGS.filter((l) => l.status === "ERROR").length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080B0E", padding: "40px 40px 80px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.03em", margin: "0 0 6px" }}>
            Listings
          </h1>
          <p style={{ fontSize: "14px", color: "#5A6270", margin: 0 }}>
            {MOCK_LISTINGS.length} total · {liveCount} live across eBay & Shopify
          </p>
        </div>
        {errorCount > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 16px", borderRadius: "12px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          }}>
            <AlertCircle style={{ width: "14px", height: "14px", color: "#EF4444" }} />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#EF4444" }}>{errorCount} listing{errorCount > 1 ? "s" : ""} need attention</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "28px" }}>
        <MiniStat label="Live Listings" value={String(liveCount)} sub={`of ${MOCK_LISTINGS.length} total`} color="#C5E756" />
        <MiniStat label="Total Views" value={totalViews > 999 ? `${(totalViews / 1000).toFixed(1)}k` : String(totalViews)} sub="across all platforms" color="#82DBF7" />
        <MiniStat label="Watchers" value={String(totalWatchers)} sub="active eBay watchers" color="#F5AF02" />
        <MiniStat label="Avg AI Score" value={`${avgScore}/100`} sub="listing quality" color={avgScore >= 80 ? "#C5E756" : "#F5AF02"} />
      </div>

      {/* Filters bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "220px" }}>
          <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#4A5160" }} />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or listing ID…"
            style={{
              width: "100%", padding: "11px 14px 11px 40px", borderRadius: "12px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              color: "#FFFFFF", fontSize: "13px", fontFamily: "inherit",
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Status pills */}
        <div style={{ display: "flex", gap: "6px" }}>
          {(["ALL", ...ALL_STATUSES] as const).map((s) => {
            const active = statusFilter === s;
            const cfg = s !== "ALL" ? STATUS_CFG[s] : null;
            return (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: "8px 14px", borderRadius: "10px", cursor: "pointer",
                background: active ? (cfg ? cfg.bg : "rgba(255,255,255,0.08)") : "rgba(255,255,255,0.03)",
                color: active ? (cfg ? cfg.color : "#FFFFFF") : "#5A6270",
                fontSize: "12px", fontWeight: active ? "700" : "500", fontFamily: "inherit",
                border: `1px solid ${active ? (cfg ? cfg.border : "rgba(255,255,255,0.15)") : "rgba(255,255,255,0.06)"}`,
                transition: "all 0.15s",
              }}>{s === "ALL" ? "All" : STATUS_CFG[s].label}</button>
            );
          })}
        </div>

        {/* Platform filter */}
        <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
          {(["ALL", "EBAY", "SHOPIFY"] as const).map((p) => {
            const active = platformFilter === p;
            const cfg = p !== "ALL" ? PLATFORM_CFG[p] : null;
            return (
              <button key={p} onClick={() => setPlatformFilter(p)} style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 14px", borderRadius: "10px", cursor: "pointer",
                background: active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                color: active ? (cfg ? cfg.color : "#FFFFFF") : "#5A6270",
                fontSize: "12px", fontWeight: active ? "700" : "500", fontFamily: "inherit",
                border: `1px solid ${active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
                transition: "all 0.15s",
              }}>
                {cfg && <cfg.icon style={{ width: "12px", height: "12px" }} />}
                {p === "ALL" ? "All Platforms" : p === "EBAY" ? "eBay" : "Shopify"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: "18px", border: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)", overflow: "hidden" }}>

        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2.8fr 110px 110px 90px 80px 80px 80px 60px",
          padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}>
          {[
            { label: "Listing", icon: null },
            { label: "Platform", icon: null },
            { label: "Status", icon: null },
            { label: "Price", icon: ArrowUpDown },
            { label: "Views", icon: null },
            { label: "Watchers", icon: null },
            { label: "Score", icon: null },
            { label: "", icon: null },
          ].map(({ label, icon: Icon }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#3E4756", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
              {Icon && <Icon style={{ width: "11px", height: "11px", color: "#3E4756", cursor: "pointer" }} />}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length > 0 ? (
          filtered.map((l) => <ListingRow key={l.id} listing={l} />)
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Tag style={{ width: "36px", height: "36px", color: "#2A3040", margin: "0 auto 12px" }} />
            <p style={{ fontSize: "15px", fontWeight: "600", color: "#4A5160", margin: "0 0 4px" }}>No listings found</p>
            <p style={{ fontSize: "13px", color: "#3A4050", margin: 0 }}>Try adjusting your filters</p>
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.01)",
          }}>
            <span style={{ fontSize: "12px", color: "#3E4756" }}>
              Showing {filtered.length} of {MOCK_LISTINGS.length} listings
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {[1].map((p) => (
                <button key={p} style={{
                  width: "30px", height: "30px", borderRadius: "8px", border: "1px solid rgba(197,231,86,0.3)",
                  background: "rgba(197,231,86,0.1)", color: "#C5E756",
                  fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

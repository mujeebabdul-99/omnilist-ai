"use client";

import { useState, useEffect, useRef } from "react";
import {
  TrendingUp, DollarSign, Tag, Eye,
  ShoppingBag, Store, Sparkles, BarChart2,
  ArrowUpRight, ArrowDownRight, Calendar,
} from "lucide-react";

/* ─── Mock Data ─── */
const REVENUE_DATA = [
  { month: "May", revenue: 1240, listings: 4 },
  { month: "Jun", revenue: 1890, listings: 7 },
  { month: "Jul", revenue: 2340, listings: 11 },
  { month: "Aug", revenue: 1980, listings: 9 },
  { month: "Sep", revenue: 3120, listings: 15 },
  { month: "Oct", revenue: 2760, listings: 13 },
];

const PLATFORM_DATA = [
  { platform: "eBay", color: "#E53238", revenue: 7890, listings: 38, pct: 64 },
  { platform: "Shopify", color: "#96BF48", revenue: 4440, listings: 21, pct: 36 },
];

const TOP_LISTINGS = [
  { title: "PS5 Console Disc Edition", platform: "EBAY", views: 1240, watchers: 43, revenue: 480, trend: "up" },
  { title: "iPhone 13 Pro 128GB Graphite", platform: "EBAY", views: 284, watchers: 12, revenue: 450, trend: "up" },
  { title: "Sony WH-1000XM5 Headphones", platform: "SHOPIFY", views: 97, watchers: 0, revenue: 249, trend: "up" },
  { title: "Nike Air Max 90 Size 10", platform: "SHOPIFY", views: 58, watchers: 0, revenue: 95, trend: "down" },
];

const AI_USAGE = [
  { label: "Listings generated", value: 24, color: "#C5E756" },
  { label: "Avg AI score", value: 84, color: "#82DBF7", suffix: "/100" },
  { label: "Approved drafts", value: 18, color: "#F5AF02" },
  { label: "Auto-queued", value: 6, color: "#96BF48" },
];

const PERIODS = ["7D", "30D", "90D", "All"] as const;
type Period = typeof PERIODS[number];

/* ─── Animated counter ─── */
function AnimatedNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.round(start));
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─── KPI Card ─── */
function KpiCard({ label, value, prefix = "", suffix = "", change, changeLabel, color = "#C5E756", icon: Icon }: {
  label: string; value: number; prefix?: string; suffix?: string;
  change: number; changeLabel: string; color?: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
}) {
  const positive = change >= 0;
  return (
    <div style={{
      flex: 1, padding: "22px 24px",
      borderRadius: "18px", border: "1px solid rgba(255,255,255,0.06)",
      background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${color}30`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${color}15`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon style={{ width: "17px", height: "17px", color }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "8px", background: positive ? "rgba(197,231,86,0.08)" : "rgba(239,68,68,0.08)" }}>
          {positive
            ? <ArrowUpRight style={{ width: "12px", height: "12px", color: "#C5E756" }} />
            : <ArrowDownRight style={{ width: "12px", height: "12px", color: "#EF4444" }} />}
          <span style={{ fontSize: "11px", fontWeight: "700", color: positive ? "#C5E756" : "#EF4444" }}>
            {positive ? "+" : ""}{change}%
          </span>
        </div>
      </div>
      <p style={{ fontSize: "28px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.04em", margin: "0 0 4px" }}>
        <AnimatedNumber target={value} prefix={prefix} suffix={suffix} />
      </p>
      <p style={{ fontSize: "12px", color: "#5A6270", margin: "0 0 2px" }}>{label}</p>
      <p style={{ fontSize: "11px", color: "#3E4756", margin: 0 }}>{changeLabel}</p>
    </div>
  );
}

/* ─── Revenue bar chart (pure CSS/SVG) ─── */
function RevenueChart({ data }: { data: typeof REVENUE_DATA }) {
  const max = Math.max(...data.map((d) => d.revenue));
  const svgH = 140;
  const padX = 36;
  const padTop = 16;
  const padBot = 24;
  const chartH = svgH - padTop - padBot;
  const colW = (340 - padX * 2) / data.length;

  const points = data.map((d, i) => {
    const x = padX + i * colW + colW / 2;
    const y = padTop + chartH - (d.revenue / max) * chartH;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 340 ${svgH}`} style={{ width: "100%", height: "160px" }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C5E756" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#C5E756" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padTop + chartH * (1 - t);
          return (
            <g key={t}>
              <line x1={padX} x2={340 - padX} y1={y} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x={padX - 4} y={y + 4} textAnchor="end" fill="#3E4756" fontSize="8">
                ${(max * t / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}
        {/* Area fill */}
        <path
          d={`${pathD} L ${points[points.length - 1].x} ${svgH - padBot} L ${points[0].x} ${svgH - padBot} Z`}
          fill="url(#revGrad)"
        />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#C5E756" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Points + labels */}
        {points.map((p) => (
          <g key={p.month}>
            <circle cx={p.x} cy={p.y} r="4" fill="#C5E756" stroke="#080B0E" strokeWidth="2" />
            <text x={p.x} y={svgH - 6} textAnchor="middle" fill="#4A5160" fontSize="9">{p.month}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─── Donut chart for platform split ─── */
function PlatformDonut() {
  const r = 52, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;
  const eBayDash = (64 / 100) * circumference;
  const shopifyDash = (36 / 100) * circumference;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />
      {/* eBay arc */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E53238" strokeWidth="18"
        strokeDasharray={`${eBayDash} ${circumference - eBayDash}`}
        strokeLinecap="butt" transform={`rotate(-90 ${cx} ${cy})`} />
      {/* Shopify arc */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#96BF48" strokeWidth="18"
        strokeDasharray={`${shopifyDash} ${circumference - shopifyDash}`}
        strokeDashoffset={-(eBayDash)}
        strokeLinecap="butt" transform={`rotate(-90 ${cx} ${cy})`} />
      {/* Centre label */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="800">64%</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#5A6270" fontSize="9">eBay</text>
    </svg>
  );
}

/* ─── Main Page ─── */
export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30D");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080B0E", padding: "40px 40px 80px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.03em", margin: "0 0 6px" }}>
            Analytics
          </h1>
          <p style={{ fontSize: "14px", color: "#5A6270", margin: 0 }}>Performance overview across all connected marketplaces</p>
        </div>
        {/* Period selector */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "4px", border: "1px solid rgba(255,255,255,0.07)" }}>
          {PERIODS.map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "7px 16px", borderRadius: "9px", border: "none", cursor: "pointer",
              background: period === p ? "rgba(255,255,255,0.09)" : "transparent",
              color: period === p ? "#FFFFFF" : "#5A6270",
              fontSize: "12px", fontWeight: period === p ? "700" : "500",
              fontFamily: "inherit", transition: "all 0.15s",
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "24px" }}>
        <KpiCard label="Total Revenue" value={12330} prefix="$" change={18} changeLabel="vs last period" icon={DollarSign} color="#C5E756" />
        <KpiCard label="Live Listings" value={4} change={33} changeLabel="added this period" icon={Tag} color="#82DBF7" />
        <KpiCard label="Total Views" value={2001} change={-7} changeLabel="across all channels" icon={Eye} color="#F5AF02" />
        <KpiCard label="AI Drafts" value={24} change={100} changeLabel="generated this period" icon={Sparkles} color="#96BF48" />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "16px", marginBottom: "20px" }}>

        {/* Revenue timeline */}
        <div style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 3px" }}>Revenue Timeline</p>
              <p style={{ fontSize: "12px", color: "#4A5160", margin: 0 }}>Monthly sales across all platforms</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "22px", fontWeight: "800", color: "#C5E756", margin: 0, letterSpacing: "-0.03em" }}>$12,330</p>
              <p style={{ fontSize: "11px", color: "#4A5160", margin: 0 }}>6-month total</p>
            </div>
          </div>
          <RevenueChart data={REVENUE_DATA} />
        </div>

        {/* Platform split */}
        <div style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)", padding: "24px" }}>
          <p style={{ fontSize: "13px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 3px" }}>Platform Split</p>
          <p style={{ fontSize: "12px", color: "#4A5160", margin: "0 0 20px" }}>Revenue by marketplace</p>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <PlatformDonut />
            <div style={{ flex: 1 }}>
              {PLATFORM_DATA.map((p) => (
                <div key={p.platform} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color }} />
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#E1E4EA" }}>{p.platform}</span>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: p.color }}>{p.pct}%</span>
                  </div>
                  {/* Bar */}
                  <div style={{ height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p.pct}%`, background: p.color, borderRadius: "3px", transition: "width 1s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    <span style={{ fontSize: "10px", color: "#4A5160" }}>{p.listings} listings</span>
                    <span style={{ fontSize: "10px", color: "#4A5160" }}>${p.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Top Listings + AI Usage */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px" }}>

        {/* Top performing listings */}
        <div style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)", overflow: "hidden" }}>
          <div style={{ padding: "20px 20px 0" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 3px" }}>Top Performing Listings</p>
            <p style={{ fontSize: "12px", color: "#4A5160", margin: "0 0 16px" }}>Ranked by views & revenue</p>
          </div>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 80px 80px 60px", padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
            {["Listing", "Platform", "Views", "Revenue", "Trend"].map((h) => (
              <span key={h} style={{ fontSize: "10px", fontWeight: "700", color: "#3E4756", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
            ))}
          </div>
          {TOP_LISTINGS.map((l, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 70px 80px 80px 60px",
              alignItems: "center", padding: "13px 20px",
              borderBottom: i < TOP_LISTINGS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              transition: "background 0.15s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <div style={{
                  width: "24px", height: "24px", borderRadius: "6px", flexShrink: 0,
                  background: "rgba(197,231,86,0.1)", border: "1px solid rgba(197,231,86,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: "800", color: "#C5E756",
                }}>{i + 1}</div>
                <p style={{ fontSize: "12px", fontWeight: "600", color: "#E1E4EA", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {l.title}
                </p>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: l.platform === "EBAY" ? "#E53238" : "#96BF48" }}>
                {l.platform === "EBAY" ? "eBay" : "Shopify"}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Eye style={{ width: "11px", height: "11px", color: "#4A5160" }} />
                <span style={{ fontSize: "12px", color: "#A0A6B2" }}>{l.views.toLocaleString()}</span>
              </div>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#C5E756" }}>${l.revenue}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                {l.trend === "up"
                  ? <ArrowUpRight style={{ width: "14px", height: "14px", color: "#C5E756" }} />
                  : <ArrowDownRight style={{ width: "14px", height: "14px", color: "#EF4444" }} />}
              </div>
            </div>
          ))}
        </div>

        {/* AI Usage panel */}
        <div style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)", padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
            <Sparkles style={{ width: "15px", height: "15px", color: "#C5E756" }} />
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#FFFFFF", margin: 0 }}>AI Usage</p>
          </div>

          {AI_USAGE.map(({ label, value, color, suffix }) => (
            <div key={label} style={{ marginBottom: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "#6C737F" }}>{label}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color }}>{value}{suffix ?? ""}</span>
              </div>
              <div style={{ height: "4px", borderRadius: "3px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "3px", background: color,
                  width: `${Math.min((value / 30) * 100, 100)}%`,
                  transition: "width 1.2s ease",
                }} />
              </div>
            </div>
          ))}

          <div style={{
            marginTop: "6px", padding: "14px", borderRadius: "12px",
            background: "rgba(197,231,86,0.06)", border: "1px solid rgba(197,231,86,0.15)",
          }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#C5E756", margin: "0 0 4px" }}>75% approval rate</p>
            <p style={{ fontSize: "11px", color: "#5A6270", margin: 0 }}>18 of 24 AI drafts approved and listed</p>
          </div>

          {/* Model used */}
          <div style={{ marginTop: "14px", padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#3E4756", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 6px" }}>Active model</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {["gemini-2.5-flash", "gemini-2.5-flash-lite"].map((m) => (
                <span key={m} style={{
                  fontSize: "10px", fontWeight: "600", color: "#5A6270",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "6px", padding: "3px 7px",
                }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

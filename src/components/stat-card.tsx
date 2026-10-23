import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: LucideIcon;
  variant?: "default" | "featured";
}

export function StatCard({ label, value, subtext, icon: Icon, variant = "default" }: StatCardProps) {
  if (variant === "featured") {
    return (
      <div
        style={{
          borderRadius: "20px",
          background: "linear-gradient(135deg, #D4F469 0%, #C5E756 55%, #9DCB35 100%)",
          padding: "24px",
          boxShadow: "0 0 30px rgba(197,231,86,0.25)",
          cursor: "default",
          transition: "box-shadow 0.2s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Icon style={{ width: "18px", height: "18px", color: "#0A0D10", strokeWidth: 2.2, flexShrink: 0 }} />
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#0A0D10", letterSpacing: "0.01em" }}>
            {label}
          </span>
        </div>
        <div style={{ fontSize: "40px", fontWeight: "800", color: "#0A0D10", lineHeight: 1, letterSpacing: "-1px" }}>
          {value}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: "20px",
        border: "1px solid #1E242B",
        backgroundColor: "#12161A",
        padding: "24px",
        transition: "border-color 0.2s ease, background 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#2D3642";
        (e.currentTarget as HTMLDivElement).style.backgroundColor = "#151A20";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#1E242B";
        (e.currentTarget as HTMLDivElement).style.backgroundColor = "#12161A";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <Icon style={{ width: "17px", height: "17px", color: "#8A9099", flexShrink: 0 }} />
        <span style={{ fontSize: "13px", fontWeight: "500", color: "#C5D0DC" }}>
          {label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <span style={{ fontSize: "34px", fontWeight: "700", color: "#FFFFFF", lineHeight: 1, letterSpacing: "-0.5px" }}>
          {value}
        </span>
        {subtext && (
          <span style={{ fontSize: "13px", color: "#8A9099", fontWeight: "400" }}>{subtext}</span>
        )}
      </div>
    </div>
  );
}

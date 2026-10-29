import { FileText, ShoppingBag, ArrowLeftRight, Tag } from "lucide-react";
import type { ElementType } from "react";

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  icon: ElementType;
}

const activities: ActivityItem[] = [
  { id: "1", title: "AI generated new listing description", time: "20 minutes ago", icon: FileText },
  { id: "2", title: "Product synced to Shopify", time: "20 minutes ago", icon: ShoppingBag },
  { id: "3", title: "Product synced to Shopify", time: "20 minutes ago", icon: ArrowLeftRight },
  { id: "4", title: "Price updated for SKU123", time: "20 minutes ago", icon: Tag },
  { id: "5", title: "Price updated for SKU123", time: "20 minutes ago", icon: Tag },
];

export function RecentActivity() {
  return (
    <div
      style={{
        borderRadius: "20px",
        border: "1px solid #1E242B",
        backgroundColor: "#12161A",
        padding: "28px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        height: "100%",
      }}
    >
      <h2
        style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "#FFFFFF",
          marginBottom: "26px",
          letterSpacing: "-0.2px",
        }}
      >
        Recent activity
      </h2>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: "36px" }}>
        {/* Vertical connector line */}
        <div
          style={{
            position: "absolute",
            left: "15px",
            top: "8px",
            bottom: "8px",
            width: "1.5px",
            backgroundColor: "#1E242B",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                style={{ position: "relative", display: "flex", gap: "14px", alignItems: "flex-start" }}
                className="animate-fade-in"
              >
                {/* Node icon */}
                <div
                  style={{
                    position: "absolute",
                    left: "-36px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#141C15",
                    border: "1px solid #2B3524",
                    boxShadow: "0 0 10px rgba(197,231,86,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                >
                  <Icon style={{ width: "15px", height: "15px", color: "#C5E756", strokeWidth: 2 }} />
                </div>

                {/* Content */}
                <div style={{ paddingTop: "4px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: "#E1E4EA", lineHeight: 1.4 }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "#7A828E", marginTop: "3px" }}>
                    {item.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

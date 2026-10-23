"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  FileText,
  TrendingUp,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutGrid },
  { name: "Products", href: "/products", icon: Package },
  { name: "Listings", href: "/listings", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? "72px" : "240px",
        minWidth: collapsed ? "72px" : "240px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#0A0D10",
        borderRight: "1px solid #1C2028",
        transition: "width 0.25s ease, min-width 0.25s ease",
        flexShrink: 0,
      }}
    >
      {/* Logo Row */}
      <div
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #1C2028",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          {/* Neon circular emblem */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "2px solid #C5E756",
              boxShadow: "0 0 14px rgba(197,231,86,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#C5E756",
                boxShadow: "0 0 8px #C5E756",
              }}
            />
          </div>
          {!collapsed && (
            <span
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#FFFFFF",
                letterSpacing: "-0.3px",
                whiteSpace: "nowrap",
              }}
            >
              OmniList
            </span>
          )}
        </Link>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "transparent",
            color: "#6C737F",
            cursor: "pointer",
            flexShrink: 0,
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight style={{ width: "16px", height: "16px" }} />
          ) : (
            <ChevronsLeft style={{ width: "16px", height: "16px" }} />
          )}
        </button>
      </div>

      {/* Main Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {navigation.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "12px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                letterSpacing: "0.01em",
                backgroundColor: isActive ? "#182315" : "transparent",
                color: isActive ? "#C5E756" : "#8A9099",
                border: isActive ? "1px solid rgba(197,231,86,0.3)" : "1px solid transparent",
                boxShadow: isActive ? "0 0 16px rgba(197,231,86,0.08)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <Icon
                style={{
                  width: "18px",
                  height: "18px",
                  flexShrink: 0,
                  color: isActive ? "#C5E756" : "#6C727D",
                }}
              />
              {!collapsed && (
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div style={{ padding: "10px", borderTop: "1px solid #1C2028" }}>
        <Link
          href="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "12px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            backgroundColor: pathname === "/settings" ? "#182315" : "transparent",
            color: pathname === "/settings" ? "#C5E756" : "#8A9099",
            border: pathname === "/settings" ? "1px solid rgba(197,231,86,0.3)" : "1px solid transparent",
            transition: "all 0.15s ease",
          }}
        >
          <Settings
            style={{
              width: "18px",
              height: "18px",
              flexShrink: 0,
              color: pathname === "/settings" ? "#C5E756" : "#6C727D",
            }}
          />
          {!collapsed && (
            <span style={{ whiteSpace: "nowrap" }}>Settings</span>
          )}
        </Link>
      </div>
    </aside>
  );
}

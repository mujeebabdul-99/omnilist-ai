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
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutGrid },
  { name: "Products", href: "/products", icon: Package },
  { name: "Listings", href: "/listings", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

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

      {/* Settings & User Profile at bottom */}
      <div style={{ padding: "10px", borderTop: "1px solid #1C2028", display: "flex", flexDirection: "column", gap: "6px" }}>
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

        {user && !collapsed && (
          <div style={{
            marginTop: "4px", padding: "8px 10px", borderRadius: "10px",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
              <div style={{
                width: "26px", height: "26px", borderRadius: "8px", flexShrink: 0,
                background: "linear-gradient(135deg, #C5E756 0%, #82DBF7 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "800", color: "#0A0D10",
              }}>
                {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  margin: 0, fontSize: "12px", fontWeight: "600", color: "#FFFFFF",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {user.name || user.email.split("@")[0]}
                </p>
                <p style={{
                  margin: 0, fontSize: "10px", color: "#5A6270",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              title="Sign out"
              style={{
                background: "none", border: "none", cursor: logout.isPending ? "not-allowed" : "pointer",
                padding: "4px", color: "#6C737F", display: "flex", alignItems: "center",
                justifyContent: "center", borderRadius: "6px",
              }}
            >
              <LogOut style={{ width: "14px", height: "14px" }} />
            </button>
          </div>
        )}

        {user && collapsed && (
          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            title={`Signed in as ${user.email} (Click to sign out)`}
            style={{
              width: "100%", height: "36px", borderRadius: "10px", border: "none",
              background: "rgba(255,255,255,0.03)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: "700", color: "#C5E756",
            }}
          >
            {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
          </button>
        )}
      </div>
    </aside>
  );
}

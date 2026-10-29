"use client";

import { useState } from "react";
import {
  Link as LinkIcon, Sparkles, User, Bell, Shield,
  Check, ExternalLink, AlertCircle, ChevronRight,
  ShoppingBag, Store, Package, Zap, Key,
} from "lucide-react";

/* ─── Types ─── */
type ConnectionStatus = "connected" | "disconnected" | "error";

interface Platform {
  id: string;
  name: string;
  description: string;
  authType: string;
  color: string;
  icon: string;
  status: ConnectionStatus;
  connectedAs?: string;
  connectHref?: string;
}

/* ─── Data ─── */
const PLATFORMS: Platform[] = [
  {
    id: "ebay",
    name: "eBay",
    description: "List, manage, and sync eBay inventory via OAuth 2.0",
    authType: "OAuth 2.0",
    color: "#E53238",
    icon: "e",
    status: "disconnected",
    connectHref: "/api/ebay/auth",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Push products to your Shopify store via Admin API",
    authType: "Admin API Key",
    color: "#96BF48",
    icon: "S",
    status: "disconnected",
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "Sync listings to Amazon via Selling Partner API",
    authType: "SP-API",
    color: "#FF9900",
    icon: "A",
    status: "disconnected",
  },
  {
    id: "walmart",
    name: "Walmart",
    description: "Publish products to Walmart Marketplace",
    authType: "API Key",
    color: "#0071CE",
    icon: "W",
    status: "disconnected",
  },
];

const STATUS_CFG: Record<ConnectionStatus, { label: string; color: string; bg: string; dot: string }> = {
  connected:    { label: "Connected",    color: "#C5E756", bg: "rgba(197,231,86,0.1)",   dot: "#C5E756" },
  disconnected: { label: "Not connected", color: "#6C737F", bg: "rgba(108,115,127,0.1)", dot: "#6C737F" },
  error:        { label: "Error",         color: "#EF4444", bg: "rgba(239,68,68,0.1)",   dot: "#EF4444" },
};

/* ─── Sub-components ─── */
function SectionHeader({ icon: Icon, title, description, iconColor = "#C5E756" }: {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  title: string;
  description: string;
  iconColor?: string;
}) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "10px",
          background: `${iconColor}15`, border: `1px solid ${iconColor}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon style={{ width: "16px", height: "16px", color: iconColor }} />
        </div>
        <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.01em", margin: 0 }}>{title}</h2>
      </div>
      <p style={{ fontSize: "13px", color: "#5A6270", marginLeft: "42px" }}>{description}</p>
    </div>
  );
}

function PlatformCard({ platform }: { platform: Platform }) {
  const cfg = STATUS_CFG[platform.status];
  const isConnected = platform.status === "connected";

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 20px",
      borderRadius: "16px",
      border: isConnected ? `1px solid ${platform.color}30` : "1px solid rgba(255,255,255,0.06)",
      background: isConnected ? `${platform.color}08` : "rgba(255,255,255,0.02)",
      transition: "border-color 0.2s, background 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Logo */}
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: `${platform.color}18`, border: `1px solid ${platform.color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", fontWeight: "800", color: platform.color,
        }}>
          {platform.icon}
        </div>
        {/* Info */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF" }}>{platform.name}</span>
            <span style={{
              fontSize: "10px", fontWeight: "600", color: "#4A5160",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "6px", padding: "2px 6px",
            }}>{platform.authType}</span>
          </div>
          <p style={{ fontSize: "12px", color: "#5A6270", margin: 0 }}>{platform.description}</p>
          {platform.connectedAs && (
            <p style={{ fontSize: "11px", color: cfg.color, marginTop: "2px" }}>@{platform.connectedAs}</p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        {/* Status badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: "5px",
          background: cfg.bg, borderRadius: "20px", padding: "4px 10px",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.dot }} />
          <span style={{ fontSize: "11px", fontWeight: "600", color: cfg.color }}>{cfg.label}</span>
        </div>

        {/* Action button */}
        {isConnected ? (
          <button style={{
            padding: "7px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "600",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            color: "#EF4444", cursor: "pointer", fontFamily: "inherit",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)"; }}
          >
            Disconnect
          </button>
        ) : platform.connectHref ? (
          <a href={platform.connectHref} style={{
            padding: "7px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "700",
            background: `${platform.color}18`, border: `1px solid ${platform.color}40`,
            color: platform.color, cursor: "pointer", fontFamily: "inherit",
            textDecoration: "none", display: "flex", alignItems: "center", gap: "5px",
            transition: "background 0.15s",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = `${platform.color}30`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = `${platform.color}18`; }}
          >
            Connect
            <ExternalLink style={{ width: "11px", height: "11px" }} />
          </a>
        ) : (
          <button style={{
            padding: "7px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "700",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            color: "#6C737F", cursor: "not-allowed", fontFamily: "inherit",
          }} disabled title="Coming soon">
            Soon
          </button>
        )}
      </div>
    </div>
  );
}

function SettingRow({ label, description, children }: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 0",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div>
        <p style={{ fontSize: "13px", fontWeight: "600", color: "#E1E4EA", margin: 0 }}>{label}</p>
        {description && <p style={{ fontSize: "12px", color: "#5A6270", marginTop: "2px" }}>{description}</p>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: "44px", height: "24px", borderRadius: "12px",
        background: enabled ? "#C5E756" : "rgba(255,255,255,0.1)",
        border: "none", cursor: "pointer", position: "relative",
        transition: "background 0.2s",
      }}
    >
      <div style={{
        position: "absolute", top: "3px",
        left: enabled ? "23px" : "3px",
        width: "18px", height: "18px", borderRadius: "50%",
        background: enabled ? "#0A0D10" : "#6C737F",
        transition: "left 0.2s",
      }} />
    </button>
  );
}

/* ─── Main Page ─── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"connections" | "ai" | "account" | "notifications">("connections");
  const [notifications, setNotifications] = useState({ listingSuccess: true, jobFailed: true, priceAlerts: false, weeklyReport: true });
  const [aiSettings, setAiSettings] = useState({ temperature: 0.4, tone: "professional", autoQueue: false });

  const tabs = [
    { id: "connections", label: "Connections", icon: LinkIcon },
    { id: "ai", label: "AI Settings", icon: Sparkles },
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080B0E", padding: "40px 40px 80px" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.03em", margin: "0 0 6px" }}>
            Settings
          </h1>
          <p style={{ fontSize: "14px", color: "#5A6270", margin: 0 }}>
            Manage marketplace connections, AI preferences, and account settings
          </p>
        </div>

        {/* Tab bar */}
        <div style={{
          display: "flex", gap: "4px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", padding: "5px", marginBottom: "28px",
          width: "fit-content",
        }}>
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "9px 16px", borderRadius: "12px", border: "none", cursor: "pointer",
                  background: active ? "rgba(255,255,255,0.08)" : "transparent",
                  color: active ? "#FFFFFF" : "#5A6270",
                  fontSize: "13px", fontWeight: active ? "700" : "500",
                  fontFamily: "inherit", transition: "all 0.15s",
                }}
              >
                <Icon style={{ width: "14px", height: "14px" }} />
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Connections Tab ── */}
        {activeTab === "connections" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{
              borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)",
              background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)",
              padding: "28px",
            }}>
              <SectionHeader
                icon={LinkIcon}
                title="Marketplace Connections"
                description="Connect your seller accounts to enable AI-powered listing and inventory sync"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {PLATFORMS.map((p) => <PlatformCard key={p.id} platform={p} />)}
              </div>
            </div>

            {/* Quick-start checklist */}
            <div style={{
              borderRadius: "20px", border: "1px solid rgba(197,231,86,0.15)",
              background: "rgba(197,231,86,0.04)", padding: "24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <Zap style={{ width: "16px", height: "16px", color: "#C5E756" }} />
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#C5E756" }}>Quick-start Checklist</span>
              </div>
              {[
                { done: true,  label: "Add Gemini API key" },
                { done: false, label: "Connect eBay account via OAuth" },
                { done: false, label: "Create a MySQL database for OmniList" },
                { done: false, label: "Run your first AI listing" },
                { done: true,  label: "Approve first AI draft" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 0" }}>
                  <div style={{
                    width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                    background: item.done ? "#C5E756" : "transparent",
                    border: item.done ? "none" : "1px solid rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {item.done && <Check style={{ width: "10px", height: "10px", color: "#0A0D10" }} />}
                  </div>
                  <span style={{ fontSize: "13px", color: item.done ? "#C5E756" : "#6C737F", textDecoration: item.done ? "line-through" : "none" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AI Settings Tab ── */}
        {activeTab === "ai" && (
          <div style={{
            borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)",
            background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)",
            padding: "28px",
          }}>
            <SectionHeader icon={Sparkles} title="AI Configuration" description="Tune how Gemini generates your marketplace listings" />

            {/* Active model indicator */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px", borderRadius: "14px",
              background: "rgba(197,231,86,0.06)", border: "1px solid rgba(197,231,86,0.18)",
              marginBottom: "24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C5E756" }} />
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#FFFFFF" }}>Gemini AI — Active</span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-pro-latest"].map((m) => (
                  <span key={m} style={{
                    fontSize: "10px", fontWeight: "600", color: "#6C737F",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "6px", padding: "2px 7px",
                  }}>{m}</span>
                ))}
              </div>
            </div>

            {/* Temperature slider */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "#E1E4EA", margin: 0 }}>Creativity Temperature</p>
                  <p style={{ fontSize: "12px", color: "#5A6270", marginTop: "2px" }}>Lower = more factual, Higher = more creative copy</p>
                </div>
                <span style={{
                  fontSize: "14px", fontWeight: "700", color: "#C5E756",
                  background: "rgba(197,231,86,0.1)", border: "1px solid rgba(197,231,86,0.25)",
                  borderRadius: "8px", padding: "4px 10px",
                }}>{aiSettings.temperature.toFixed(1)}</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.1"
                value={aiSettings.temperature}
                onChange={(e) => setAiSettings((s) => ({ ...s, temperature: parseFloat(e.target.value) }))}
                style={{ width: "100%", accentColor: "#C5E756" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontSize: "10px", color: "#4A5160" }}>Precise (0.0)</span>
                <span style={{ fontSize: "10px", color: "#4A5160" }}>Creative (1.0)</span>
              </div>
            </div>

            {/* Default tone */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#E1E4EA", marginBottom: "10px" }}>Default Listing Tone</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["professional", "casual", "technical", "vintage", "luxury"].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setAiSettings((s) => ({ ...s, tone }))}
                    style={{
                      padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer",
                      background: aiSettings.tone === tone ? "#C5E756" : "rgba(255,255,255,0.05)",
                      color: aiSettings.tone === tone ? "#0A0D10" : "#8E95A0",
                      fontSize: "12px", fontWeight: "600", fontFamily: "inherit",
                      textTransform: "capitalize", transition: "all 0.15s",
                    }}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <SettingRow label="Auto-queue approved drafts" description="Skip the queue step — approve sends directly to marketplace">
              <Toggle enabled={aiSettings.autoQueue} onChange={(v) => setAiSettings((s) => ({ ...s, autoQueue: v }))} />
            </SettingRow>
          </div>
        )}

        {/* ── Account Tab ── */}
        {activeTab === "account" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)",
              background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)",
              padding: "28px",
            }}>
              <SectionHeader icon={User} title="Account" description="Your OmniList profile and subscription plan" />

              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "16px",
                  background: "linear-gradient(135deg, #C5E756 0%, #82DBF7 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", fontWeight: "800", color: "#0A0D10",
                }}>A</div>
                <div>
                  <p style={{ fontSize: "16px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 3px" }}>Abdul Mujeeb</p>
                  <p style={{ fontSize: "13px", color: "#5A6270", margin: 0 }}>demo@omnilist.ai</p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <span style={{
                    background: "rgba(197,231,86,0.12)", border: "1px solid rgba(197,231,86,0.3)",
                    borderRadius: "20px", padding: "5px 12px",
                    fontSize: "11px", fontWeight: "700", color: "#C5E756",
                  }}>FREE PLAN</span>
                </div>
              </div>

              <SettingRow label="Full name" description="Used on listings and invoices">
                <button style={{ fontSize: "12px", color: "#C5E756", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
              </SettingRow>
              <SettingRow label="Email address" description="demo@omnilist.ai">
                <button style={{ fontSize: "12px", color: "#C5E756", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Change</button>
              </SettingRow>
              <SettingRow label="Password" description="Last changed: never">
                <button style={{ fontSize: "12px", color: "#C5E756", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Update</button>
              </SettingRow>
            </div>

            {/* Plan card */}
            <div style={{
              borderRadius: "20px", border: "1px solid rgba(197,231,86,0.2)",
              background: "linear-gradient(135deg, rgba(197,231,86,0.06) 0%, rgba(130,219,247,0.04) 100%)",
              padding: "24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 4px" }}>Upgrade to Pro</p>
                  <p style={{ fontSize: "12px", color: "#6C737F" }}>Unlimited listings, multi-user, priority AI queue</p>
                </div>
                <button style={{
                  padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, #C5E756 0%, #A8D43E 100%)",
                  color: "#0A0D10", fontSize: "13px", fontWeight: "700", fontFamily: "inherit",
                }}>Upgrade →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Notifications Tab ── */}
        {activeTab === "notifications" && (
          <div style={{
            borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)",
            background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)",
            padding: "28px",
          }}>
            <SectionHeader icon={Bell} title="Notifications" description="Choose what activity triggers alerts" iconColor="#82DBF7" />

            <SettingRow label="Listing published" description="When a job successfully pushes to a marketplace">
              <Toggle enabled={notifications.listingSuccess} onChange={(v) => setNotifications((n) => ({ ...n, listingSuccess: v }))} />
            </SettingRow>
            <SettingRow label="Job failed" description="When a listing push fails after all retries">
              <Toggle enabled={notifications.jobFailed} onChange={(v) => setNotifications((n) => ({ ...n, jobFailed: v }))} />
            </SettingRow>
            <SettingRow label="Price alerts" description="Notify when competitor prices drop significantly">
              <Toggle enabled={notifications.priceAlerts} onChange={(v) => setNotifications((n) => ({ ...n, priceAlerts: v }))} />
            </SettingRow>
            <SettingRow label="Weekly performance report" description="Sunday summary of listings, revenue, and AI usage">
              <Toggle enabled={notifications.weeklyReport} onChange={(v) => setNotifications((n) => ({ ...n, weeklyReport: v }))} />
            </SettingRow>

            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4A5160" }}>
                <AlertCircle style={{ width: "13px", height: "13px" }} />
                <span style={{ fontSize: "12px" }}>Email notifications require an SMTP provider (Phase 5)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

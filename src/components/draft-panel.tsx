"use client";

import { useState } from "react";
import {
  X, Check, Edit3, Sparkles, ShoppingBag, Store,
  Tag, DollarSign, Package, Star, ChevronDown, ChevronUp, Copy, CheckCheck,
} from "lucide-react";
import { useDraftStore, type DraftListing, type Platform } from "@/stores/draft-store";

const PLATFORM_CFG: Record<Platform, { label: string; icon: typeof ShoppingBag; color: string; bg: string }> = {
  EBAY: { label: "eBay", icon: ShoppingBag, color: "#F5AF02", bg: "rgba(245,175,2,0.1)" },
  SHOPIFY: { label: "Shopify", icon: Store, color: "#96BF48", bg: "rgba(150,191,72,0.1)" },
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#C5E756" : score >= 60 ? "#F5AF02" : "#EF4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div style={{ position: "relative", width: "40px", height: "40px" }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <circle
            cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={`${(score / 100) * 100.5} 100.5`}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
          />
        </svg>
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color }}>
          {score}
        </span>
      </div>
      <span style={{ fontSize: "11px", color: "#6C737F" }}>AI Score</span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5160", padding: "2px", display: "flex" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#4A5160"; }}
    >
      {copied
        ? <CheckCheck style={{ width: "14px", height: "14px", color: "#C5E756" }} />
        : <Copy style={{ width: "14px", height: "14px" }} />}
    </button>
  );
}

function DraftCard({ draft, onApprove, onDismiss }: {
  draft: DraftListing;
  onApprove: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const cfg = PLATFORM_CFG[draft.platform];
  const PIcon = cfg.icon;
  const [expanded, setExpanded] = useState(false);
  const updateDraft = useDraftStore((s) => s.updateDraft);
  const [editTitle, setEditTitle] = useState(false);
  const [editPrice, setEditPrice] = useState(false);

  return (
    <div
      style={{
        borderRadius: "20px",
        border: `1px solid ${cfg.color}30`,
        background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)",
        overflow: "hidden",
        boxShadow: `0 0 40px ${cfg.color}10, 0 8px 32px rgba(0,0,0,0.5)`,
        animation: "fadeIn 0.35s ease-out both",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: `linear-gradient(90deg, ${cfg.color}0A 0%, transparent 60%)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: cfg.bg, border: `1px solid ${cfg.color}40`,
            borderRadius: "20px", padding: "4px 10px",
          }}>
            <PIcon style={{ width: "12px", height: "12px", color: cfg.color }} />
            <span style={{ fontSize: "11px", fontWeight: "700", color: cfg.color, letterSpacing: "0.05em" }}>{cfg.label}</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "5px",
            background: "rgba(197,231,86,0.08)", border: "1px solid rgba(197,231,86,0.2)",
            borderRadius: "20px", padding: "4px 10px",
          }}>
            <Sparkles style={{ width: "11px", height: "11px", color: "#C5E756" }} />
            <span style={{ fontSize: "11px", fontWeight: "600", color: "#C5E756" }}>AI Draft</span>
          </div>
          {draft.aiTone && (
            <span style={{ fontSize: "11px", color: "#4A5160", textTransform: "capitalize" }}>
              {draft.aiTone} tone
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {draft.aiScore !== undefined && <ScoreBadge score={draft.aiScore} />}
          <button
            onClick={() => onDismiss(draft.id)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5160", display: "flex", padding: "4px" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#4A5160"; }}
          >
            <X style={{ width: "16px", height: "16px" }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px" }}>
        {/* Title */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4A5160" }}>Title</span>
            <span style={{ fontSize: "10px", color: draft.seoTitle.length > 70 ? "#EF4444" : "#4A5160" }}>
              {draft.seoTitle.length}/80
            </span>
            <CopyButton text={draft.seoTitle} />
            <button onClick={() => setEditTitle(!editTitle)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5160", display: "flex", padding: "2px" }}>
              <Edit3 style={{ width: "12px", height: "12px" }} />
            </button>
          </div>
          {editTitle ? (
            <input
              value={draft.seoTitle}
              onChange={(e) => updateDraft(draft.id, { seoTitle: e.target.value })}
              onBlur={() => setEditTitle(false)}
              autoFocus
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", padding: "10px 12px", color: "#FFFFFF", fontSize: "15px",
                fontWeight: "600", fontFamily: "inherit", outline: "none",
              }}
            />
          ) : (
            <p style={{ fontSize: "16px", fontWeight: "700", color: "#FFFFFF", lineHeight: "1.4", letterSpacing: "-0.01em" }}>
              {draft.seoTitle}
            </p>
          )}
        </div>

        {/* Price + Condition row */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px", padding: "12px 14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <DollarSign style={{ width: "12px", height: "12px", color: "#4A5160" }} />
              <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: "#4A5160" }}>Price</span>
              <button onClick={() => setEditPrice(!editPrice)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5160", display: "flex" }}>
                <Edit3 style={{ width: "11px", height: "11px" }} />
              </button>
            </div>
            {editPrice ? (
              <input
                type="number"
                value={draft.price}
                onChange={(e) => updateDraft(draft.id, { price: parseFloat(e.target.value) || 0 })}
                onBlur={() => setEditPrice(false)}
                autoFocus
                style={{
                  width: "100%", background: "transparent", border: "none", outline: "none",
                  color: "#C5E756", fontSize: "20px", fontWeight: "700", fontFamily: "inherit",
                }}
              />
            ) : (
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#C5E756" }}>
                ${draft.price?.toFixed(2)}
              </span>
            )}
          </div>

          <div style={{
            flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px", padding: "12px 14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <Tag style={{ width: "12px", height: "12px", color: "#4A5160" }} />
              <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: "#4A5160" }}>Condition</span>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#E1E4EA" }}>{draft.condition ?? "—"}</span>
          </div>

          {draft.aiTone && (
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px", padding: "12px 14px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <Star style={{ width: "12px", height: "12px", color: "#4A5160" }} />
                <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: "#4A5160" }}>Tone</span>
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#E1E4EA", textTransform: "capitalize" }}>{draft.aiTone}</span>
            </div>
          )}
        </div>

        {/* Description (collapsible) */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "12px", padding: "14px", marginBottom: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: expanded ? "12px" : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Package style={{ width: "12px", height: "12px", color: "#4A5160" }} />
              <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: "#4A5160" }}>Description</span>
              <CopyButton text={draft.seoDescription} />
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5160", display: "flex" }}
            >
              {expanded
                ? <ChevronUp style={{ width: "15px", height: "15px" }} />
                : <ChevronDown style={{ width: "15px", height: "15px" }} />}
            </button>
          </div>
          {expanded ? (
            <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
              {draft.seoDescription}
            </p>
          ) : (
            <p style={{ fontSize: "13px", color: "#6C737F", lineHeight: "1.6", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {draft.seoDescription}
            </p>
          )}
        </div>

        {/* Item specifics */}
        {draft.itemSpecifics && Object.keys(draft.itemSpecifics).length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#4A5160", display: "block", marginBottom: "8px" }}>
              Item Specifics
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {Object.entries(draft.itemSpecifics).slice(0, 8).map(([k, v]) => (
                <div key={k} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "8px", padding: "4px 10px", fontSize: "12px",
                }}>
                  <span style={{ color: "#6C737F" }}>{k}: </span>
                  <span style={{ color: "#C5E756", fontWeight: "600" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onApprove(draft.id)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "13px", borderRadius: "14px", border: "none", cursor: "pointer",
              background: `linear-gradient(135deg, ${cfg.color} 0%, ${cfg.color}CC 100%)`,
              color: "#0A0D10", fontWeight: "700", fontSize: "14px", fontFamily: "inherit",
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: `0 4px 16px ${cfg.color}40`,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${cfg.color}50`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${cfg.color}40`; }}
          >
            <Check style={{ width: "16px", height: "16px" }} />
            Approve & Queue
          </button>
          <button
            onClick={() => onDismiss(draft.id)}
            style={{
              padding: "13px 18px", borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
              background: "rgba(255,255,255,0.03)", color: "#6C737F",
              fontSize: "13px", fontFamily: "inherit", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#EF444450"; (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "#6C737F"; }}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}

export function DraftPanel() {
  const { drafts, removeDraft, approveDraft } = useDraftStore();

  if (drafts.length === 0) return null;

  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <Sparkles style={{ width: "16px", height: "16px", color: "#C5E756" }} />
        <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.01em" }}>
          AI Drafts
        </h2>
        <span style={{
          background: "rgba(197,231,86,0.12)", border: "1px solid rgba(197,231,86,0.25)",
          borderRadius: "20px", padding: "2px 8px", fontSize: "11px", fontWeight: "700", color: "#C5E756",
        }}>
          {drafts.length}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {drafts.map((draft) => (
          <DraftCard
            key={draft.id}
            draft={draft}
            onApprove={(id) => {
              approveDraft(id);
              // TODO: POST to /api/jobs to queue the listing
            }}
            onDismiss={removeDraft}
          />
        ))}
      </div>
    </section>
  );
}

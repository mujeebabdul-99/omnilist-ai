"use client";

import { CommandInput } from "@/components/command-input";
import { DraftPanel } from "@/components/draft-panel";
import { StatCard } from "@/components/stat-card";
import { RecentActivity } from "@/components/recent-activity";
import { QuickListings } from "@/components/quick-listings";
import { useOptimize } from "@/hooks/use-optimize";
import { useDraftStore } from "@/stores/draft-store";
import type { Platform } from "@/stores/draft-store";
import {
  Package, Tag, FileText, CircleDollarSign,
  ArrowLeftRight, AlertTriangle, Sparkles, Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const { optimize, isLoading, error } = useOptimize();
  const draftCount = useDraftStore((s) => s.drafts.length);

  const handlePrompt = (prompt: string, platform: Platform) => {
    optimize({ prompt, platform });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#080B0E",
        padding: "40px 40px 60px",
        display: "flex",
        flexDirection: "column",
        gap: "36px",
      }}
    >
      {/* ── Command Center Header ── */}
      <header style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "6px" }}>
            <Sparkles style={{ width: "16px", height: "16px", color: "#C5E756" }} />
            <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C5E756" }}>
              OmniList AI
            </span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.03em", margin: 0 }}>
            Your Listing Command Center
          </h1>
          <p style={{ fontSize: "14px", color: "#4A5160", marginTop: "6px" }}>
            Type a product or intent — AI handles the rest
          </p>
        </div>

        <CommandInput onSubmit={handlePrompt} isLoading={isLoading} />

        {/* Loading state */}
        {isLoading && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            padding: "14px", borderRadius: "14px",
            background: "rgba(197,231,86,0.06)", border: "1px solid rgba(197,231,86,0.15)",
            animation: "fadeIn 0.3s ease-out both",
          }}>
            <Loader2 style={{ width: "16px", height: "16px", color: "#C5E756", animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: "13px", color: "#A0A6B2" }}>
              Gemini AI is optimizing your listing…
            </span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 16px", borderRadius: "12px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          }}>
            <AlertTriangle style={{ width: "15px", height: "15px", color: "#EF4444", flexShrink: 0 }} />
            <span style={{ fontSize: "13px", color: "#EF4444" }}>{error}</span>
          </div>
        )}
      </header>

      {/* ── AI Draft Panel (appears after generation) ── */}
      <DraftPanel />

      {/* ── Stats Grid ── */}
      <section>
        <p style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#3E4756", marginBottom: "14px" }}>
          Overview
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <StatCard label="Products" value="339" icon={Package} variant="featured" />
          <StatCard label="Live Listings" value="1" subtext="active" icon={Tag} />
          <StatCard label="AI Drafts" value={String(draftCount)} subtext="pending review" icon={FileText} />
          <StatCard label="Revenue" value="$261.99" subtext="this month" icon={CircleDollarSign} />
          <StatCard label="Queue" value="3" subtext="processing" icon={ArrowLeftRight} />
          <StatCard label="Errors" value="2" subtext="need attention" icon={AlertTriangle} />
        </div>
      </section>

      {/* ── Listings + Activity ── */}
      <section style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "22px", alignItems: "stretch" }}>
        <QuickListings />
        <RecentActivity />
      </section>
    </div>
  );
}

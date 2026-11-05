"use client";

import { useState, useRef } from "react";
import {
  Barcode, Loader2, X, CheckCircle, AlertCircle,
  Sparkles, ShoppingBag, Store, Bookmark,
} from "lucide-react";
import type { Platform } from "@/stores/draft-store";

interface UpcResult {
  upc: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  lowestPrice: number | null;
  highestPrice: number | null;
}

interface UpcScannerProps {
  onProductFound: (prompt: string) => void;
  onGenerateListing: (prompt: string, platform: Platform) => void;
}

const PLATFORMS: {
  key: Platform;
  label: string;
  icon: typeof ShoppingBag;
  color: string;
}[] = [
  { key: "EBAY", label: "eBay", icon: ShoppingBag, color: "#F5AF02" },
  { key: "SHOPIFY", label: "Shopify", icon: Store, color: "#96BF48" },
];

export function UpcScanner({ onProductFound, onGenerateListing }: UpcScannerProps) {
  const [upc, setUpc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UpcResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [condition, setCondition] = useState("");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const lookup = async () => {
    const cleaned = upc.replace(/\D/g, "");
    if (!cleaned || cleaned.length < 8) return;

    setIsLoading(true);
    setResult(null);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/upc/lookup?upc=${cleaned}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Product not found");
        return;
      }

      setResult(data);
      onProductFound(data.title);
    } catch {
      setError("Could not reach UPC service. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const buildPrompt = () => {
    if (!result) return "";
    return condition.trim() ? `${result.title}, ${condition.trim()}` : result.title;
  };

  const handleGenerate = (platform: Platform) => {
    const prompt = buildPrompt();
    if (!prompt) return;
    onGenerateListing(prompt, platform);
    setResult(null);
    setUpc("");
    setCondition("");
    setSaved(false);
  };

  const handleSave = () => setSaved(true);

  const clear = () => {
    setUpc("");
    setResult(null);
    setError(null);
    setCondition("");
    setSaved(false);
    inputRef.current?.focus();
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      {/* ── Barcode input row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: "16px",
          border: isFocused
            ? "1.5px solid rgba(197,231,86,0.5)"
            : "1.5px solid rgba(255,255,255,0.07)",
          backgroundColor: "#0D1014",
          overflow: "hidden",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: isFocused ? "0 0 20px rgba(197,231,86,0.1)" : "none",
        }}
      >
        {/* Label */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "10px 14px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          <Barcode style={{ width: "15px", height: "15px", color: "#C5E756" }} />
          <span style={{
            fontSize: "11px", fontWeight: "700",
            letterSpacing: "0.08em", textTransform: "uppercase", color: "#C5E756",
          }}>
            UPC
          </span>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={upc}
          onChange={(e) => { setUpc(e.target.value); setResult(null); setError(null); setSaved(false); }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => { if (e.key === "Enter") lookup(); }}
          placeholder="Scan or type a barcode (e.g. 190198001573)"
          disabled={isLoading}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontSize: "14px", color: "#FFFFFF", fontFamily: "inherit",
            padding: "11px 14px", letterSpacing: "0.02em",
          }}
        />

        {/* Clear */}
        {upc && !isLoading && (
          <button
            onClick={clear}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5160", padding: "0 8px", display: "flex" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#4A5160"; }}
          >
            <X style={{ width: "14px", height: "14px" }} />
          </button>
        )}

        {/* Lookup button */}
        <button
          onClick={lookup}
          disabled={isLoading || upc.replace(/\D/g, "").length < 8}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "10px 16px",
            background: upc.replace(/\D/g, "").length >= 8 && !isLoading
              ? "rgba(197,231,86,0.12)" : "rgba(255,255,255,0.03)",
            border: "none", borderLeft: "1px solid rgba(255,255,255,0.06)",
            cursor: upc.replace(/\D/g, "").length >= 8 && !isLoading ? "pointer" : "not-allowed",
            color: upc.replace(/\D/g, "").length >= 8 && !isLoading ? "#C5E756" : "#3E4756",
            fontSize: "12px", fontWeight: "700", fontFamily: "inherit",
            letterSpacing: "0.06em", transition: "all 0.2s", flexShrink: 0,
          }}
        >
          {isLoading
            ? <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} />
            : "Lookup"}
        </button>
      </div>

      {/* ── Product result card ── */}
      {result && (
        <div
          style={{
            marginTop: "12px",
            borderRadius: "18px",
            border: "1px solid rgba(197,231,86,0.18)",
            background: "linear-gradient(145deg, #0D1217 0%, #0A0E13 100%)",
            overflow: "hidden",
            animation: "fadeIn 0.25s ease-out both",
            boxShadow: "0 0 30px rgba(197,231,86,0.06)",
          }}
        >
          {/* Product info header */}
          <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <CheckCircle style={{ width: "13px", height: "13px", color: "#C5E756", flexShrink: 0 }} />
                  <span style={{
                    fontSize: "10px", fontWeight: "700",
                    letterSpacing: "0.08em", textTransform: "uppercase", color: "#C5E756",
                  }}>
                    Product Found
                  </span>
                </div>
                <p style={{ fontSize: "15px", fontWeight: "700", color: "#FFFFFF", lineHeight: "1.4", marginBottom: "4px" }}>
                  {result.title}
                </p>
                <p style={{ fontSize: "12px", color: "#6C737F" }}>
                  {[result.brand, result.category].filter(Boolean).join(" · ")}
                  {result.lowestPrice && result.highestPrice
                    ? ` · Market: $${result.lowestPrice} – $${result.highestPrice}`
                    : ""}
                </p>
              </div>

              {/* Save for later */}
              <button
                onClick={handleSave}
                title="Save to product queue"
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "6px 12px", borderRadius: "20px",
                  border: saved ? "1px solid rgba(197,231,86,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  background: saved ? "rgba(197,231,86,0.1)" : "rgba(255,255,255,0.03)",
                  color: saved ? "#C5E756" : "#6C737F",
                  cursor: "pointer", fontSize: "11px", fontWeight: "600",
                  fontFamily: "inherit", transition: "all 0.2s", flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (!saved) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(197,231,86,0.3)";
                }}
                onMouseLeave={(e) => {
                  if (!saved) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <Bookmark style={{ width: "12px", height: "12px" }} />
                {saved ? "Saved" : "Save for later"}
              </button>
            </div>
          </div>

          {/* Condition notes */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <label style={{
              display: "block", fontSize: "10px", fontWeight: "700",
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "#4A5160", marginBottom: "8px",
            }}>
              Condition Notes (optional)
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder='e.g. "cracked screen, 78% battery" or "like new, original box"'
              style={{
                width: "100%", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px",
                padding: "9px 12px", color: "#FFFFFF", fontSize: "13px",
                fontFamily: "inherit", outline: "none", boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(197,231,86,0.3)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
            />
          </div>

          {/* Generate buttons */}
          <div style={{ padding: "14px 18px", display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "#4A5160", fontWeight: "600", flexShrink: 0 }}>
              Generate for:
            </span>
            {PLATFORMS.map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => handleGenerate(key)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "8px 16px", borderRadius: "20px",
                  background: `${color}18`, border: `1px solid ${color}40`,
                  color, cursor: "pointer", fontSize: "12px",
                  fontWeight: "700", fontFamily: "inherit", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${color}30`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${color}18`; }}
              >
                <Sparkles style={{ width: "11px", height: "11px" }} />
                <Icon style={{ width: "11px", height: "11px" }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            marginTop: "10px", padding: "10px 14px", borderRadius: "12px",
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)",
            animation: "fadeIn 0.25s ease-out both",
          }}
        >
          <AlertCircle style={{ width: "14px", height: "14px", color: "#EF4444", flexShrink: 0 }} />
          <p style={{ fontSize: "13px", color: "#EF4444" }}>{error}</p>
        </div>
      )}
    </div>
  );
}

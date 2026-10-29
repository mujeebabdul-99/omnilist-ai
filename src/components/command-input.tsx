"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, ArrowRight, Loader2, ShoppingBag, Store } from "lucide-react";
import type { Platform } from "@/stores/draft-store";

interface CommandInputProps {
  onSubmit?: (prompt: string, platform: Platform) => void;
  isLoading?: boolean;
}

const SUGGESTIONS: { text: string; platform: Platform }[] = [
  { text: "List iPhone 13 Pro 128GB used good condition for $450 on eBay", platform: "EBAY" },
  { text: "Create a Shopify listing for Nike Air Max 90 size 10 new in box $120", platform: "SHOPIFY" },
  { text: "List Sony WH-1000XM5 headphones used like new $180 on eBay", platform: "EBAY" },
  { text: "Add MacBook Pro M2 2023 refurbished $899 to Shopify store", platform: "SHOPIFY" },
];

const PLATFORM_CONFIG: Record<Platform, { label: string; icon: typeof ShoppingBag; color: string }> = {
  EBAY: { label: "eBay", icon: ShoppingBag, color: "#F5AF02" },
  SHOPIFY: { label: "Shopify", icon: Store, color: "#96BF48" },
};

export function CommandInput({ onSubmit, isLoading = false }: CommandInputProps) {
  const [value, setValue] = useState("");
  const [platform, setPlatform] = useState<Platform>("EBAY");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cfg = PLATFORM_CONFIG[platform];
  const PlatformIcon = cfg.icon;

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return;
    onSubmit?.(value.trim(), platform);
    setValue("");
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "720px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0",
          borderRadius: "50px",
          border: isFocused ? `1.5px solid ${cfg.color}` : "1.5px solid rgba(255,255,255,0.1)",
          backgroundColor: "#0D1014",
          boxShadow: isFocused
            ? `0 0 32px ${cfg.color}30, 0 4px 24px rgba(0,0,0,0.5)`
            : "0 4px 24px rgba(0,0,0,0.4)",
          transition: "all 0.25s ease",
          overflow: "hidden",
        }}
      >
        {/* Platform toggle */}
        <button
          onClick={() => setPlatform((p) => (p === "EBAY" ? "SHOPIFY" : "EBAY"))}
          title={`Switch to ${platform === "EBAY" ? "Shopify" : "eBay"}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "12px 16px",
            background: "rgba(255,255,255,0.04)",
            border: "none",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            cursor: "pointer",
            color: cfg.color,
            fontSize: "12px",
            fontWeight: "600",
            fontFamily: "inherit",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            transition: "background 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
        >
          <PlatformIcon style={{ width: "14px", height: "14px" }} />
          {cfg.label}
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
          onBlur={() => { setIsFocused(false); setTimeout(() => setShowSuggestions(false), 200); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
            if (e.key === "Escape") setShowSuggestions(false);
          }}
          placeholder={`Ask OmniList AI to list on ${cfg.label}…`}
          disabled={isLoading}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "15px",
            fontWeight: "400",
            color: "#FFFFFF",
            fontFamily: "inherit",
            padding: "14px 16px",
          }}
        />

        {/* Kbd hint */}
        {!value && !isFocused && !isLoading && (
          <span style={{
            fontSize: "11px",
            color: "#4A5160",
            fontFamily: "monospace",
            padding: "0 10px",
            flexShrink: 0,
          }}>⌘K</span>
        )}

        {/* Submit / loader */}
        <div style={{ padding: "0 14px", flexShrink: 0 }}>
          {isLoading ? (
            <Loader2 style={{ width: "20px", height: "20px", color: cfg.color, animation: "spin 1s linear infinite" }} />
          ) : value.trim() ? (
            <button
              onClick={handleSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: cfg.color,
                border: "none",
                cursor: "pointer",
                transition: "transform 0.15s, opacity 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              <ArrowRight style={{ width: "17px", height: "17px", color: "#0A0D10" }} />
            </button>
          ) : (
            <Search style={{ width: "18px", height: "18px", color: "#4A5160" }} />
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && !isLoading && !value && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: 0,
            right: 0,
            zIndex: 50,
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.07)",
            backgroundColor: "#0D1217",
            padding: "8px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
            animation: "fadeIn 0.2s ease-out both",
          }}
        >
          <p style={{ padding: "6px 12px 4px", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#3E4756" }}>
            Try asking OmniList
          </p>
          {SUGGESTIONS.map((s, i) => {
            const sCfg = PLATFORM_CONFIG[s.platform];
            const SIcon = sCfg.icon;
            return (
              <button
                key={i}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setValue(s.text);
                  setPlatform(s.platform);
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "13px",
                  color: "#8E95A0",
                  fontFamily: "inherit",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#8E95A0";
                }}
              >
                <Sparkles style={{ width: "14px", height: "14px", color: sCfg.color, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>&ldquo;{s.text}&rdquo;</span>
                <span style={{
                  fontSize: "10px", fontWeight: "600", color: sCfg.color,
                  background: `${sCfg.color}18`, border: `1px solid ${sCfg.color}30`,
                  padding: "2px 8px", borderRadius: "20px", flexShrink: 0,
                }}>
                  <SIcon style={{ width: "10px", height: "10px", display: "inline", marginRight: "3px" }} />
                  {sCfg.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

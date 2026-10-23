"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, ArrowRight, Scan, Loader2 } from "lucide-react";

interface CommandInputProps {
  onSubmit?: (prompt: string) => void;
  isLoading?: boolean;
}

const suggestions = [
  "List UPC 12345 on eBay as Used - Good for $45",
  "Create a Shopify listing for iPhone 15 Pro case",
  "Optimize my last 5 eBay titles for better Cassini SEO",
  "Import product from UPC 0-78742-00101-2",
];

export function CommandInput({ onSubmit, isLoading = false }: CommandInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return;
    onSubmit?.(value.trim());
    setValue("");
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
    <div style={{ position: "relative", width: "100%", maxWidth: "640px", margin: "0 auto" }}>
      {/* Glow ring + bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          borderRadius: "50px",
          border: isFocused ? "1.5px solid #C5E756" : "1.5px solid rgba(197,231,86,0.45)",
          backgroundColor: "#0D1014",
          padding: "10px 20px",
          boxShadow: isFocused
            ? "0 0 28px rgba(197,231,86,0.28), 0 0 60px rgba(197,231,86,0.08)"
            : "0 0 18px rgba(197,231,86,0.14)",
          transition: "all 0.25s ease",
        }}
      >
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
          placeholder="Ask OmniList AI..."
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
          }}
        />

        {/* Icons right */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6C737F", display: "flex" }}
            title="Scan UPC"
          >
            <Scan style={{ width: "18px", height: "18px" }} />
          </button>

          {isLoading ? (
            <Loader2 className="animate-spin" style={{ width: "20px", height: "20px", color: "#C5E756" }} />
          ) : value.trim() ? (
            <button
              onClick={handleSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#C5E756",
                border: "none",
                cursor: "pointer",
              }}
            >
              <ArrowRight style={{ width: "16px", height: "16px", color: "#0A0D10" }} />
            </button>
          ) : (
            <Search style={{ width: "18px", height: "18px", color: "#8E95A0" }} />
          )}
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && !isLoading && !value && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: 0,
            right: 0,
            zIndex: 50,
            borderRadius: "18px",
            border: "1px solid #222933",
            backgroundColor: "#0D1014",
            padding: "10px 8px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.65)",
          }}
          className="animate-fade-in"
        >
          <p
            style={{
              padding: "6px 14px",
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6C737F",
            }}
          >
            Try asking OmniList
          </p>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={(e) => {
                e.preventDefault();
                setValue(s);
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13.5px",
                color: "#A0A6B2",
                fontFamily: "inherit",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#181E26";
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#A0A6B2";
              }}
            >
              <Sparkles style={{ width: "15px", height: "15px", color: "#C5E756", flexShrink: 0 }} />
              <span>&ldquo;{s}&rdquo;</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { Barcode, Loader2, X, CheckCircle, AlertCircle } from "lucide-react";

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
}

export function UpcScanner({ onProductFound }: UpcScannerProps) {
  const [upc, setUpc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UpcResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const lookup = async () => {
    const cleaned = upc.replace(/\D/g, "");
    if (!cleaned || cleaned.length < 8) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`/api/upc/lookup?upc=${cleaned}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Product not found");
        return;
      }

      setResult(data);

      // Build a prompt pre-filled with product data
      const parts: string[] = [];
      if (data.title) parts.push(data.title);
      if (data.brand && !data.title.toLowerCase().includes(data.brand.toLowerCase())) {
        parts.push(`by ${data.brand}`);
      }
      const prompt = parts.join(", ");
      onProductFound(prompt);
    } catch {
      setError("Could not reach UPC service. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setUpc("");
    setResult(null);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      {/* Input row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0",
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
        {/* Barcode icon label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 14px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          <Barcode style={{ width: "15px", height: "15px", color: "#C5E756" }} />
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#C5E756",
            }}
          >
            UPC
          </span>
        </div>

        {/* UPC text input */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={upc}
          onChange={(e) => {
            setUpc(e.target.value);
            setResult(null);
            setError(null);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") lookup();
          }}
          placeholder="Scan or type a barcode (e.g. 194252968147)"
          disabled={isLoading}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "14px",
            color: "#FFFFFF",
            fontFamily: "inherit",
            padding: "11px 14px",
            letterSpacing: "0.02em",
          }}
        />

        {/* Clear button */}
        {upc && !isLoading && (
          <button
            onClick={clear}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#4A5160",
              padding: "0 8px",
              display: "flex",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#4A5160";
            }}
          >
            <X style={{ width: "14px", height: "14px" }} />
          </button>
        )}

        {/* Lookup button */}
        <button
          onClick={lookup}
          disabled={isLoading || upc.replace(/\D/g, "").length < 8}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 16px",
            background:
              upc.replace(/\D/g, "").length >= 8 && !isLoading
                ? "rgba(197,231,86,0.12)"
                : "rgba(255,255,255,0.03)",
            border: "none",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            cursor:
              upc.replace(/\D/g, "").length >= 8 && !isLoading
                ? "pointer"
                : "not-allowed",
            color:
              upc.replace(/\D/g, "").length >= 8 && !isLoading
                ? "#C5E756"
                : "#3E4756",
            fontSize: "12px",
            fontWeight: "700",
            fontFamily: "inherit",
            letterSpacing: "0.06em",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {isLoading ? (
            <Loader2
              style={{
                width: "14px",
                height: "14px",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : (
            "Lookup"
          )}
        </button>
      </div>

      {/* Result pill */}
      {result && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
            padding: "10px 14px",
            borderRadius: "12px",
            background: "rgba(197,231,86,0.06)",
            border: "1px solid rgba(197,231,86,0.18)",
            animation: "fadeIn 0.25s ease-out both",
          }}
        >
          <CheckCircle
            style={{ width: "14px", height: "14px", color: "#C5E756", flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {result.title}
            </p>
            <p style={{ fontSize: "11px", color: "#6C737F", marginTop: "2px" }}>
              {[result.brand, result.category].filter(Boolean).join(" · ")}
              {result.lowestPrice && result.highestPrice
                ? ` · $${result.lowestPrice} – $${result.highestPrice}`
                : ""}
            </p>
          </div>
          <span
            style={{
              fontSize: "10px",
              color: "#C5E756",
              fontWeight: "700",
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
          >
            Pre-filled
          </span>
        </div>
      )}

      {/* Error pill */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
            padding: "10px 14px",
            borderRadius: "12px",
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.18)",
            animation: "fadeIn 0.25s ease-out both",
          }}
        >
          <AlertCircle
            style={{ width: "14px", height: "14px", color: "#EF4444", flexShrink: 0 }}
          />
          <p style={{ fontSize: "13px", color: "#EF4444" }}>{error}</p>
        </div>
      )}
    </div>
  );
}

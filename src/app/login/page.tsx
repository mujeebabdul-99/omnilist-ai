"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Loader2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#080B0E",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        width: "100%", maxWidth: "400px",
        background: "#0D1117", border: "1px solid #1A2030",
        borderRadius: "20px", padding: "40px",
        display: "flex", flexDirection: "column", gap: "28px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Sparkles style={{ width: "18px", height: "18px", color: "#C5E756" }} />
            <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C5E756" }}>
              OmniList AI
            </span>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#FFFFFF", margin: 0, letterSpacing: "-0.03em" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "13px", color: "#4A5160", margin: 0 }}>
            Sign in to your account
          </p>
        </div>

        {/* Error */}
        {login.error && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 16px", borderRadius: "12px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          }}>
            <AlertTriangle style={{ width: "14px", height: "14px", color: "#EF4444", flexShrink: 0 }} />
            <span style={{ fontSize: "13px", color: "#EF4444" }}>{login.error.message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required
              style={{
                background: "#080B0E", border: "1px solid #1A2030",
                borderRadius: "10px", padding: "12px 14px",
                fontSize: "14px", color: "#FFFFFF", outline: "none", width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{
                  background: "#080B0E", border: "1px solid #1A2030",
                  borderRadius: "10px", padding: "12px 42px 12px 14px",
                  fontSize: "14px", color: "#FFFFFF", outline: "none",
                  width: "100%", boxSizing: "border-box",
                }}
              />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: "#4A5160",
              }}>
                {showPw ? <EyeOff style={{ width: "15px", height: "15px" }} /> : <Eye style={{ width: "15px", height: "15px" }} />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={login.isPending}
            style={{
              marginTop: "6px", padding: "13px",
              background: login.isPending ? "rgba(197,231,86,0.5)" : "#C5E756",
              border: "none", borderRadius: "12px", cursor: login.isPending ? "not-allowed" : "pointer",
              fontSize: "14px", fontWeight: "700", color: "#080B0E",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {login.isPending && <Loader2 style={{ width: "15px", height: "15px", animation: "spin 1s linear infinite" }} />}
            {login.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#4A5160", margin: 0 }}>
          No account?{" "}
          <Link href="/register" style={{ color: "#C5E756", textDecoration: "none", fontWeight: "600" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

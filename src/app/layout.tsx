import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "OmniList AI — Multi-Channel Listing Command Center",
  description: "AI-powered e-commerce command center. One prompt to optimize, list, and sync inventory across eBay and Shopify.",
  keywords: ["ecommerce", "multi-channel listing", "eBay listing tool", "Shopify inventory", "AI listing optimization"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#080B0E" }}>
        <Providers>
          <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar />
            <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

"use client";

import { CommandInput } from "@/components/command-input";
import { StatCard } from "@/components/stat-card";
import { RecentActivity } from "@/components/recent-activity";
import { QuickListings } from "@/components/quick-listings";
import {
  Package,
  Tag,
  FileText,
  CircleDollarSign,
  ArrowLeftRight,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#080B0E",
        padding: "36px 40px",
        display: "flex",
        flexDirection: "column",
        gap: "36px",
        overflowY: "auto",
      }}
    >
      {/* Centered Command Bar */}
      <header>
        <CommandInput />
      </header>

      {/* 6-Card Metric Grid */}
      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "18px",
          }}
        >
          <StatCard label="Products" value="339" icon={Package} variant="featured" />
          <StatCard label="Live Listings" value="1" subtext="active listings" icon={Tag} />
          <StatCard label="AI Drafts" value="6" subtext="drafts generated" icon={FileText} />
          <StatCard label="Revenue" value="$261.99" subtext="sales" icon={CircleDollarSign} />
          <StatCard label="Queue" value="3" subtext="processing queue" icon={ArrowLeftRight} />
          <StatCard label="Errors" value="2" subtext="active issues" icon={AlertTriangle} />
        </div>
      </section>

      {/* Listings + Activity */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: "22px",
          alignItems: "stretch",
        }}
      >
        <QuickListings />
        <RecentActivity />
      </section>
    </div>
  );
}

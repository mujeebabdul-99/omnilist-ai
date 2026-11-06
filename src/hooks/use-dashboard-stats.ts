"use client";

import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  stats: {
    products: number;
    liveListings: number;
    aiDrafts: number;
    queue: number;
    errors: number;
    revenue: number;
  };
  recentListings: Array<{
    id: string;
    platform: string;
    status: string;
    seoTitle: string;
    price: number;
    product: { title: string };
    updatedAt: string;
  }>;
  recentJobs: Array<{
    id: string;
    type: string;
    status: string;
    scheduledAt: string;
    completedAt: string | null;
  }>;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to load stats");
      return res.json();
    },
    refetchInterval: 30_000, // refresh every 30 seconds
    staleTime: 15_000,
  });
}

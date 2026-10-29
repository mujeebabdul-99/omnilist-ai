"use client";

import { useMutation } from "@tanstack/react-query";
import { useDraftStore, type Platform } from "@/stores/draft-store";
import { nanoid } from "nanoid";

interface OptimizePayload {
  prompt: string;
  platform: Platform;
  productId?: string;
  upc?: string;
}

interface OptimizeResult {
  seoTitle: string;
  seoDescription: string;
  suggestedPrice: number;
  condition: string;
  categoryId: string;
  itemSpecifics: Record<string, string>;
  aiScore: number;
  aiTone: string;
  keywordsUsed: string[];
}

async function callOptimizeApi(payload: OptimizePayload): Promise<OptimizeResult> {
  const res = await fetch("/api/ai/optimize-listing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }

  const data = await res.json();
  return data.draft as OptimizeResult;
}

export function useOptimize() {
  const addDraft = useDraftStore((s) => s.addDraft);

  const mutation = useMutation({
    mutationFn: callOptimizeApi,
    onSuccess: (result, variables) => {
      addDraft({
        id: nanoid(),
        platform: variables.platform,
        seoTitle: result.seoTitle,
        seoDescription: result.seoDescription,
        price: result.suggestedPrice,
        condition: result.condition,
        categoryId: result.categoryId,
        itemSpecifics: result.itemSpecifics,
        aiScore: result.aiScore,
        aiTone: result.aiTone,
        isEditing: false,
        isApproved: false,
      });
    },
  });

  return {
    optimize: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

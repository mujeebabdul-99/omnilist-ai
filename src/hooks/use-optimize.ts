"use client";

import { useState, useCallback } from "react";
import { useDraftStore, type Platform } from "@/stores/draft-store";
import { findDemoListing } from "@/lib/demo-listings";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const optimize = useCallback(
    async (payload: OptimizePayload) => {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      // Check for a demo match first — instant result with a brief loading feel
      const demoResult = findDemoListing(payload.prompt, payload.platform);

      if (demoResult) {
        // Simulate a realistic 1.4s AI generation time
        await new Promise((r) => setTimeout(r, 1400));
        addDraft(demoResult);
        setIsSuccess(true);
        setIsLoading(false);
        return;
      }

      // No demo match — call the real Gemini API
      try {
        const result = await callOptimizeApi(payload);
        addDraft({
          id: nanoid(),
          productId: payload.productId,
          platform: payload.platform,
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
        setIsSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [addDraft]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
  }, []);

  return { optimize, isLoading, error, isSuccess, reset };
}

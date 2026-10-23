import { create } from "zustand";

export type Platform = "EBAY" | "SHOPIFY";
export type ListingStatus = "DRAFT" | "QUEUED" | "LIVE" | "ERROR" | "ENDED";

export interface DraftListing {
  id: string;
  productId?: string;
  platform: Platform;
  seoTitle: string;
  seoDescription: string;
  price: number;
  condition?: string;
  categoryId?: string;
  itemSpecifics?: Record<string, string>;
  aiScore?: number;
  aiTone?: string;

  // Raw data for comparison
  rawTitle?: string;
  rawDescription?: string;

  // UI state
  isEditing: boolean;
  isApproved: boolean;
}

interface DraftStore {
  drafts: DraftListing[];
  activeDraftId: string | null;

  // Actions
  addDraft: (draft: DraftListing) => void;
  updateDraft: (id: string, updates: Partial<DraftListing>) => void;
  removeDraft: (id: string) => void;
  setActiveDraft: (id: string | null) => void;
  approveDraft: (id: string) => void;
  clearDrafts: () => void;
}

export const useDraftStore = create<DraftStore>((set) => ({
  drafts: [],
  activeDraftId: null,

  addDraft: (draft) =>
    set((state) => ({
      drafts: [...state.drafts, draft],
      activeDraftId: draft.id,
    })),

  updateDraft: (id, updates) =>
    set((state) => ({
      drafts: state.drafts.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),

  removeDraft: (id) =>
    set((state) => ({
      drafts: state.drafts.filter((d) => d.id !== id),
      activeDraftId:
        state.activeDraftId === id ? null : state.activeDraftId,
    })),

  setActiveDraft: (id) => set({ activeDraftId: id }),

  approveDraft: (id) =>
    set((state) => ({
      drafts: state.drafts.map((d) =>
        d.id === id ? { ...d, isApproved: true, isEditing: false } : d
      ),
    })),

  clearDrafts: () => set({ drafts: [], activeDraftId: null }),
}));

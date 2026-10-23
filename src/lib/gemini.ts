import { GoogleGenAI } from "@google/genai";

function getAiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export const LISTING_SYSTEM_PROMPT = `You are an expert e-commerce SEO copywriter specializing in multi-channel marketplace listings.
Your job is to take raw product data and a seller's intent, then produce a perfectly optimized listing.

RULES:
- eBay titles: max 80 characters, keyword-rich, NO ALL CAPS, NO special chars except hyphens
- Descriptions: engaging, scannable with bullet points, include key specs
- Always return valid JSON matching the exact schema provided
- SEO score: rate 0-100 based on keyword density, title quality, completeness
- Condition must be one of: "New", "Open box", "Used - Like New", "Used - Very Good", "Used - Good", "Used - Acceptable", "For parts or not working"
- Price suggestion should be realistic based on condition and market

OUTPUT FORMAT — respond ONLY with this JSON, no markdown, no explanation:
{
  "seoTitle": "string (max 80 chars for eBay)",
  "seoDescription": "string (markdown formatted, 200-400 words)",
  "suggestedPrice": number,
  "condition": "string",
  "categoryId": "string (eBay category ID if known, else empty)",
  "itemSpecifics": { "key": "value" },
  "aiScore": number (0-100),
  "aiTone": "string (professional|casual|vintage|technical)",
  "keywordsUsed": ["array", "of", "main", "keywords"]
}`;

export interface OptimizeListingInput {
  prompt: string;
  platform: "EBAY" | "SHOPIFY";
  product?: {
    title: string;
    description?: string;
    brand?: string;
    upc?: string;
    category?: string;
    baseCost?: number;
  };
}

export interface OptimizeListingOutput {
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

export async function optimizeListing(
  input: OptimizeListingInput
): Promise<OptimizeListingOutput> {
  const userMessage = `
Platform: ${input.platform}
Seller intent: ${input.prompt}
${
  input.product
    ? `
Product data:
- Title: ${input.product.title}
- Brand: ${input.product.brand ?? "Unknown"}
- UPC: ${input.product.upc ?? "N/A"}
- Category: ${input.product.category ?? "General"}
- Base cost: ${input.product.baseCost ? `$${input.product.baseCost}` : "Unknown"}
- Description: ${input.product.description ?? "Not provided"}
`
    : "No product data provided — use the seller intent to infer product details."
}

Generate an optimized ${input.platform} listing now. Return only the JSON object.`;

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: userMessage,
    config: {
      systemInstruction: LISTING_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const text = response.text ?? "";

  try {
    return JSON.parse(text) as OptimizeListingOutput;
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${text.slice(0, 200)}`);
  }
}

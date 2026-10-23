import { NextRequest, NextResponse } from "next/server";
import { optimizeListing, type OptimizeListingInput } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      prompt: string;
      platform: "EBAY" | "SHOPIFY";
      productId?: string;
      upc?: string;
    };

    const { prompt, platform, productId, upc } = body;

    if (!prompt || !platform) {
      return NextResponse.json(
        { error: "prompt and platform are required" },
        { status: 400 }
      );
    }

    // Fetch product data from DB if productId or UPC provided
    let productData: OptimizeListingInput["product"] | undefined;

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (product) {
        productData = {
          title: product.title,
          description: product.description ?? undefined,
          brand: product.brand ?? undefined,
          upc: product.upc,
          category: product.category ?? undefined,
          baseCost: product.baseCost ? Number(product.baseCost) : undefined,
        };
      }
    } else if (upc) {
      const product = await prisma.product.findUnique({ where: { upc } });
      if (product) {
        productData = {
          title: product.title,
          description: product.description ?? undefined,
          brand: product.brand ?? undefined,
          upc: product.upc,
          category: product.category ?? undefined,
          baseCost: product.baseCost ? Number(product.baseCost) : undefined,
        };
      }
    }

    // Call Gemini AI
    const result = await optimizeListing({ prompt, platform, product: productData });

    // Return the optimized draft — client will preview and can approve to queue
    return NextResponse.json({
      success: true,
      draft: result,
      productId: productId ?? null,
    });
  } catch (err) {
    console.error("[AI] optimize-listing error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI generation failed" },
      { status: 500 }
    );
  }
}

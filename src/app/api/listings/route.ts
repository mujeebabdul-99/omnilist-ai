import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ── GET /api/listings — list marketplace listings with optional filters ─────
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") ?? undefined;
  const platform = searchParams.get("platform") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const where: Record<string, unknown> = {
    product: { userId: session.userId },
  };

  if (status) {
    where.status = status;
  }

  if (platform) {
    where.platform = platform;
  }

  if (search) {
    where.OR = [
      { seoTitle: { contains: search } },
      { product: { title: { contains: search } } },
      { product: { upc: { contains: search } } },
    ];
  }

  const listings = await prisma.marketplaceListing.findMany({
    where,
    include: {
      product: {
        select: { title: true, upc: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ listings });
}

// ── POST /api/listings — create a new marketplace listing ───────────────────
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    productId,
    platform,
    seoTitle,
    seoDescription,
    price,
    condition,
    categoryId,
    itemSpecifics,
    aiScore,
    aiTone,
    status,
  } = body as {
    productId?: string;
    platform?: string;
    seoTitle?: string;
    seoDescription?: string;
    price?: number;
    condition?: string;
    categoryId?: string;
    itemSpecifics?: unknown;
    aiScore?: number;
    aiTone?: string;
    status?: string;
  };

  // Validate required fields
  if (!productId || !platform || !seoTitle || !seoDescription || price === undefined) {
    return NextResponse.json(
      { error: "Missing required fields: productId, platform, seoTitle, seoDescription, price" },
      { status: 400 }
    );
  }

  if (typeof price !== "number" || price < 0) {
    return NextResponse.json(
      { error: "price must be a non-negative number" },
      { status: 400 }
    );
  }

  // Verify product exists and belongs to user
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.userId !== session.userId) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  const listing = await prisma.marketplaceListing.create({
    data: {
      productId,
      platform,
      seoTitle,
      seoDescription,
      price,
      condition: condition ?? null,
      categoryId: categoryId ?? null,
      itemSpecifics: itemSpecifics ?? undefined,
      aiScore: aiScore ?? null,
      aiTone: aiTone ?? null,
      status: status ?? "DRAFT",
    },
  });

  return NextResponse.json({ listing }, { status: 201 });
}

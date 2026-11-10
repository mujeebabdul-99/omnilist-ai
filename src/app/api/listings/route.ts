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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    product: { userId: session.userId },
  };

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (platform && platform !== "ALL") {
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
    status = "DRAFT",
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

  // Validate core fields
  if (!platform || !seoTitle || !seoDescription || price === undefined) {
    return NextResponse.json(
      { error: "Missing required fields: platform, seoTitle, seoDescription, price" },
      { status: 400 }
    );
  }

  if (typeof price !== "number" || price < 0) {
    return NextResponse.json(
      { error: "price must be a non-negative number" },
      { status: 400 }
    );
  }

  let targetProductId = productId;

  // If a productId was provided, verify it exists and belongs to this user
  if (targetProductId) {
    const existingProduct = await prisma.product.findUnique({
      where: { id: targetProductId },
    });
    if (!existingProduct || existingProduct.userId !== session.userId) {
      targetProductId = undefined;
    }
  }

  // If no valid productId exists, auto-create a parent Product catalog entry
  if (!targetProductId) {
    const generatedUpc = "GEN-" + Date.now().toString().slice(-10);
    const newProduct = await prisma.product.create({
      data: {
        userId: session.userId,
        upc: generatedUpc,
        title: seoTitle.slice(0, 100),
        baseCost: price,
        category: categoryId ?? "General",
        images: [],
      },
    });
    targetProductId = newProduct.id;
  }

  const normalizedStatus = typeof status === "string" ? status.toUpperCase() : "DRAFT";

  // Create the listing
  const listing = await prisma.marketplaceListing.create({
    data: {
      productId: targetProductId,
      platform: platform.toUpperCase(),
      seoTitle,
      seoDescription,
      price,
      condition: condition ?? null,
      categoryId: categoryId ?? null,
      itemSpecifics: (itemSpecifics as object) ?? undefined,
      aiScore: aiScore ?? null,
      aiTone: aiTone ?? null,
      status: normalizedStatus,
    },
  });

  // If queued, create a background Job in the queue table
  let job = null;
  if (normalizedStatus === "QUEUED") {
    job = await prisma.job.create({
      data: {
        userId: session.userId,
        type: "LISTING_PUSH",
        status: "PENDING",
        payload: {
          listingId: listing.id,
          platform: listing.platform,
          seoTitle: listing.seoTitle,
          price: Number(listing.price),
        },
      },
    });
  }

  return NextResponse.json({ listing, job }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// ── GET /api/listings/[id] — get a single listing with product data ─────────
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!listing || listing.product.userId !== session.userId) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ listing });
}

// ── PATCH /api/listings/[id] — update listing details ───────────────────────
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!listing || listing.product.userId !== session.userId) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const allowedFields = [
    "seoTitle",
    "seoDescription",
    "price",
    "condition",
    "categoryId",
    "status",
    "itemSpecifics",
  ] as const;

  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      data[field] = body[field];
    }
  }

  const updated = await prisma.marketplaceListing.update({
    where: { id },
    data,
  });

  return NextResponse.json({ listing: updated });
}

// ── DELETE /api/listings/[id] — delete listing ──────────────────────────────
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!listing || listing.product.userId !== session.userId) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  await prisma.marketplaceListing.delete({ where: { id } });

  return NextResponse.json({ success: true });
}


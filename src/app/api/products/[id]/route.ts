import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// ── GET /api/products/[id] — get a single product with all listings ─────────
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { listings: true },
  });

  if (!product || product.userId !== session.userId) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

// ── PATCH /api/products/[id] — partial update ───────────────────────────────
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify the product exists and belongs to the user
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Only allow updating known product fields
  const allowedFields = [
    "upc",
    "title",
    "description",
    "brand",
    "images",
    "baseCost",
    "weight",
    "category",
  ] as const;

  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      data[field] = body[field];
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  // If UPC is being changed, check for conflicts
  if (data.upc && data.upc !== existing.upc) {
    const conflict = await prisma.product.findUnique({
      where: { upc: data.upc as string },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "A product with this UPC already exists" },
        { status: 409 }
      );
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data,
    include: { listings: true },
  });

  return NextResponse.json({ product });
}

// ── DELETE /api/products/[id] — delete product (cascades to listings) ───────
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

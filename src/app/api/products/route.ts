import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convert Prisma objects so Decimals become numbers and Dates become ISO strings */
function serializeProduct(product: Record<string, unknown>) {
  const serialized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(product)) {
    if (value instanceof Decimal) {
      serialized[key] = value.toNumber();
    } else if (value instanceof Date) {
      serialized[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      serialized[key] = value.map((item) =>
        item && typeof item === "object" ? serializeProduct(item as Record<string, unknown>) : item
      );
    } else {
      serialized[key] = value;
    }
  }
  return serialized;
}

// ── GET /api/products — list products with optional search/filter/pagination ─
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 50)));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { userId: session.userId };

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { upc: { contains: search } },
      { brand: { contains: search } },
    ];
  }

  if (category) {
    where.category = category;
  }

  const [products, total, categoryRows] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        listings: {
          select: {
            id: true,
            platform: true,
            status: true,
            price: true,
            seoTitle: true,
            platformItemId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: { userId: session.userId },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const categories = categoryRows
    .map((r) => r.category)
    .filter((c): c is string => c !== null)
    .sort();

  const serializedProducts = products.map((p) =>
    serializeProduct(p as unknown as Record<string, unknown>)
  );

  return NextResponse.json({
    products: serializedProducts,
    total,
    page,
    limit,
    categories,
  });
}

// ── POST /api/products — create a new product ───────────────────────────────
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

  const { upc, title, description, brand, images, baseCost, weight, category } = body as {
    upc?: string;
    title?: string;
    description?: string;
    brand?: string;
    images?: unknown;
    baseCost?: number;
    weight?: number;
    category?: string;
  };

  // Validate required fields
  if (!upc || !title) {
    return NextResponse.json(
      { error: "Missing required fields: upc, title" },
      { status: 400 }
    );
  }

  const resolvedBaseCost = baseCost ?? 0;

  if (typeof resolvedBaseCost !== "number" || resolvedBaseCost < 0) {
    return NextResponse.json(
      { error: "baseCost must be a non-negative number" },
      { status: 400 }
    );
  }

  // Check for duplicate UPC
  const existing = await prisma.product.findUnique({ where: { upc } });
  if (existing) {
    return NextResponse.json(
      { error: "A product with this UPC already exists" },
      { status: 409 }
    );
  }

  const product = await prisma.product.create({
    data: {
      upc,
      title,
      description: description ?? null,
      brand: brand ?? null,
      images: images ?? [],
      baseCost: resolvedBaseCost,
      weight: weight ?? null,
      category: category ?? null,
      userId: session.userId,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ── GET /api/integrations — return connection status for current user ─────────
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      ebayToken: true,
      ebayTokenExp: true,
      shopifyToken: true,
      shopifyDomain: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isEbayConnected = Boolean(user.ebayToken);
  const isEbayExpired = user.ebayTokenExp ? new Date() > user.ebayTokenExp : false;

  return NextResponse.json({
    ebay: {
      connected: isEbayConnected && !isEbayExpired,
      expired: isEbayExpired,
      expiresAt: user.ebayTokenExp?.toISOString() ?? null,
    },
    shopify: {
      connected: Boolean(user.shopifyToken),
      domain: user.shopifyDomain,
    },
  });
}

// ── DELETE /api/integrations — disconnect a marketplace platform ─────────────
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");

  if (!platform || !["ebay", "shopify"].includes(platform.toLowerCase())) {
    return NextResponse.json({ error: "Invalid platform specified" }, { status: 400 });
  }

  if (platform.toLowerCase() === "ebay") {
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        ebayToken: null,
        ebayRefresh: null,
        ebayTokenExp: null,
      },
    });
  } else if (platform.toLowerCase() === "shopify") {
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        shopifyToken: null,
        shopifyDomain: null,
      },
    });
  }

  return NextResponse.json({ success: true, platform });
}


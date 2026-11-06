import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.userId;

  // Run all counts in parallel
  const [
    productCount,
    liveCount,
    draftCount,
    queueCount,
    errorCount,
    recentListings,
    recentJobs,
  ] = await Promise.all([
    // Total products
    prisma.product.count({ where: { userId } }),

    // Live listings
    prisma.marketplaceListing.count({
      where: { product: { userId }, status: "LIVE" },
    }),

    // AI drafts pending review
    prisma.marketplaceListing.count({
      where: { product: { userId }, status: "DRAFT" },
    }),

    // Queue (queued + processing)
    prisma.marketplaceListing.count({
      where: { product: { userId }, status: { in: ["QUEUED", "PROCESSING"] } },
    }),

    // Errors
    prisma.marketplaceListing.count({
      where: { product: { userId }, status: "ERROR" },
    }),

    // Recent listings for the quick table
    prisma.marketplaceListing.findMany({
      where: { product: { userId } },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        platform: true,
        status: true,
        seoTitle: true,
        price: true,
        product: { select: { title: true } },
        updatedAt: true,
      },
    }),

    // Recent jobs for the activity feed
    prisma.job.findMany({
      where: { userId },
      orderBy: { scheduledAt: "desc" },
      take: 8,
      select: {
        id: true,
        type: true,
        status: true,
        scheduledAt: true,
        completedAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    stats: {
      products: productCount,
      liveListings: liveCount,
      aiDrafts: draftCount,
      queue: queueCount,
      errors: errorCount,
      revenue: 0, // Will hook up to eBay/Shopify sales data later
    },
    recentListings,
    recentJobs,
  });
}

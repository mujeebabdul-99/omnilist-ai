import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publishListingToEbay } from "@/lib/ebay/inventory";
import { refreshEbayToken, tokenExpiresAt } from "@/lib/ebay/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Retrieve the listing and its associated product
  const listing = await prisma.marketplaceListing.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!listing || listing.product.userId !== session.userId) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Retrieve user to check marketplace credentials
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (listing.platform === "EBAY") {
    let accessToken = user.ebayToken;

    // Check if token needs refreshing
    const isExpired = user.ebayTokenExp ? new Date() > user.ebayTokenExp : false;
    if ((!accessToken || isExpired) && user.ebayRefresh) {
      try {
        console.log("[Publish] Refreshing eBay access token...");
        const refreshed = await refreshEbayToken(user.ebayRefresh);
        accessToken = refreshed.access_token;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            ebayToken: refreshed.access_token,
            ebayRefresh: refreshed.refresh_token,
            ebayTokenExp: tokenExpiresAt(refreshed.expires_in),
          },
        });
      } catch (refreshErr) {
        console.error("[Publish] Failed to refresh eBay token:", refreshErr);
      }
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: "eBay account not connected. Please connect your eBay account in Settings first." },
        { status: 400 }
      );
    }

    // Publish to eBay
    const result = await publishListingToEbay({
      accessToken,
      listing: {
        id: listing.id,
        seoTitle: listing.seoTitle,
        seoDescription: listing.seoDescription,
        price: Number(listing.price),
        condition: listing.condition,
        categoryId: listing.categoryId,
        itemSpecifics: listing.itemSpecifics as Record<string, string> | null,
      },
      product: {
        upc: listing.product.upc,
        title: listing.product.title,
        brand: listing.product.brand,
        images: listing.product.images,
      },
    });

    if (result.success) {
      const updatedListing = await prisma.marketplaceListing.update({
        where: { id: listing.id },
        data: {
          status: "LIVE",
          platformItemId: result.platformItemId,
          platformUrl: result.platformUrl,
          errorMessage: null,
        },
      });

      // Update any associated job
      await prisma.job.updateMany({
        where: {
          userId: session.userId,
          payload: { path: "$.listingId", equals: listing.id },
          status: { in: ["PENDING", "PROCESSING"] },
        },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        listing: updatedListing,
      });
    } else {
      // Mark listing as error
      await prisma.marketplaceListing.update({
        where: { id: listing.id },
        data: {
          status: "ERROR",
          errorMessage: result.error,
        },
      });

      return NextResponse.json(
        { error: result.error ?? "Failed to publish listing to eBay" },
        { status: 502 }
      );
    }
  } else if (listing.platform === "SHOPIFY") {
    // Shopify mock/live publish support
    const mockShopifyId = `SHP-${Date.now().toString().slice(-8)}`;
    const storeDomain = user.shopifyDomain || "myshopify.com";
    const platformUrl = `https://${storeDomain}/products/${mockShopifyId}`;

    const updatedListing = await prisma.marketplaceListing.update({
      where: { id: listing.id },
      data: {
        status: "LIVE",
        platformItemId: mockShopifyId,
        platformUrl,
        errorMessage: null,
      },
    });

    return NextResponse.json({
      success: true,
      listing: updatedListing,
    });
  }

  return NextResponse.json({ error: `Platform ${listing.platform} not supported yet` }, { status: 400 });
}

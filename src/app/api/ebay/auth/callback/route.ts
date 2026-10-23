import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, tokenExpiresAt } from "@/lib/ebay/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle user denied / eBay error
  if (error) {
    console.error("[eBay OAuth] Error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(
        `/settings?ebay_error=${encodeURIComponent(errorDescription ?? error)}`,
        req.url
      )
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/settings?ebay_error=no_code_returned", req.url)
    );
  }

  try {
    // Exchange auth code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // TODO: Replace hardcoded userId with real session user ID once auth is set up
    // For now, upsert a placeholder user so the OAuth flow can be tested
    const placeholderEmail = "demo@omnilist.ai";

    const user = await prisma.user.upsert({
      where: { email: placeholderEmail },
      update: {
        ebayToken: tokens.access_token,
        ebayRefresh: tokens.refresh_token,
        ebayTokenExp: tokenExpiresAt(tokens.expires_in),
      },
      create: {
        email: placeholderEmail,
        name: "Demo User",
        ebayToken: tokens.access_token,
        ebayRefresh: tokens.refresh_token,
        ebayTokenExp: tokenExpiresAt(tokens.expires_in),
      },
    });

    console.log(`[eBay OAuth] Tokens saved for user: ${user.id}`);

    return NextResponse.redirect(
      new URL("/settings?ebay_connected=true", req.url)
    );
  } catch (err) {
    console.error("[eBay OAuth] Callback error:", err);
    return NextResponse.redirect(
      new URL("/settings?ebay_error=token_exchange_failed", req.url)
    );
  }
}

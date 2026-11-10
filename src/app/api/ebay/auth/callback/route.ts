import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, tokenExpiresAt } from "@/lib/ebay/auth";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
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

  // Determine user ID from current session or fallback to state payload
  const session = await getSession();
  let targetUserId = session?.userId;

  if (!targetUserId && state) {
    try {
      const parsed = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
      if (parsed.userId && typeof parsed.userId === "string") {
        targetUserId = parsed.userId;
      }
    } catch {
      // ignore
    }
  }

  if (!targetUserId) {
    console.error("[eBay OAuth] No user session or state found on callback");
    return NextResponse.redirect(
      new URL("/login?from=/settings", req.url)
    );
  }

  try {
    // Exchange auth code for tokens
    const tokens = await exchangeCodeForTokens(code);

    const user = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        ebayToken: tokens.access_token,
        ebayRefresh: tokens.refresh_token,
        ebayTokenExp: tokenExpiresAt(tokens.expires_in),
      },
    });

    console.log(`[eBay OAuth] Tokens successfully saved for user: ${user.id} (${user.email})`);

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

import { NextRequest, NextResponse } from "next/server";
import { getEbayAuthUrl } from "@/lib/ebay/auth";
import { getSession } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login?from=/settings", req.url));
  }

  // Embed session.userId in state securely with a random nonce
  const statePayload = {
    userId: session.userId,
    nonce: randomBytes(8).toString("hex"),
  };
  const state = Buffer.from(JSON.stringify(statePayload)).toString("base64url");

  const authUrl = getEbayAuthUrl(state);

  return NextResponse.redirect(authUrl);
}

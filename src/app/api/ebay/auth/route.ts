import { NextResponse } from "next/server";
import { getEbayAuthUrl } from "@/lib/ebay/auth";
import { randomBytes } from "crypto";

export async function GET() {
  // Generate a random state token to prevent CSRF
  const state = randomBytes(16).toString("hex");

  // In production you'd store `state` in a signed cookie or session
  // For now we embed it in the redirect and verify it on callback
  const authUrl = getEbayAuthUrl(state);

  return NextResponse.redirect(authUrl);
}

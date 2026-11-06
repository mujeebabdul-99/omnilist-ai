import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const VERIFICATION_TOKEN = process.env.EBAY_NOTIFICATION_TOKEN ?? "omnilistebayverificationtoken2024xsecure";
const ENDPOINT_URL = `${process.env.NEXTAUTH_URL ?? "https://mediumslateblue-dinosaur-388048.hostingersite.com"}/api/ebay/notifications`;

/**
 * GET — eBay endpoint validation challenge.
 * eBay sends ?challenge_code=xxx and expects back a SHA-256 hash of
 * (challengeCode + verificationToken + endpointUrl) as JSON.
 */
export async function GET(req: NextRequest) {
  const challengeCode = req.nextUrl.searchParams.get("challenge_code");

  if (!challengeCode) {
    return NextResponse.json({ error: "Missing challenge_code" }, { status: 400 });
  }

  const hash = crypto
    .createHash("sha256")
    .update(challengeCode + VERIFICATION_TOKEN + ENDPOINT_URL)
    .digest("hex");

  return NextResponse.json({ challengeResponse: hash });
}

/**
 * POST — eBay account deletion/closure notification.
 * Acknowledge with 200. Store or action the deletion if needed.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = body?.metadata?.topic ?? "unknown";

    // Log the event (replace with DB deletion logic when ready)
    console.log("[eBay Notification]", topic, JSON.stringify(body, null, 2));

    // TODO: When database is set up, delete user data for:
    // body.notification?.data?.userId
    // body.notification?.data?.username

    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 200 }); // Always 200 to eBay
  }
}


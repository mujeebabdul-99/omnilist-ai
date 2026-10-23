// eBay OAuth 2.0 utilities
// Docs: https://developer.ebay.com/api-docs/static/oauth-authorization-code-grant.html

const EBAY_SANDBOX = process.env.EBAY_SANDBOX === "true";

const EBAY_AUTH_BASE = EBAY_SANDBOX
  ? "https://auth.sandbox.ebay.com"
  : "https://auth.ebay.com";

const EBAY_API_BASE = EBAY_SANDBOX
  ? "https://api.sandbox.ebay.com"
  : "https://api.ebay.com";

// Scopes needed for listing + selling
export const EBAY_SCOPES = [
  "https://api.ebay.com/oauth/api_scope",
  "https://api.ebay.com/oauth/api_scope/sell.inventory",
  "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.account",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
].join(" ");

export function getEbayAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.EBAY_CLIENT_ID!,
    redirect_uri: process.env.EBAY_REDIRECT_URI!,
    response_type: "code",
    scope: EBAY_SCOPES,
    state,
  });

  return `${EBAY_AUTH_BASE}/oauth2/authorize?${params.toString()}`;
}

export interface EbayTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  token_type: string;
}

export async function exchangeCodeForTokens(
  code: string
): Promise<EbayTokenResponse> {
  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${EBAY_API_BASE}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.EBAY_REDIRECT_URI!,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`eBay token exchange failed: ${error}`);
  }

  return res.json() as Promise<EbayTokenResponse>;
}

export async function refreshEbayToken(
  refreshToken: string
): Promise<EbayTokenResponse> {
  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${EBAY_API_BASE}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      scope: EBAY_SCOPES,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`eBay token refresh failed: ${error}`);
  }

  return res.json() as Promise<EbayTokenResponse>;
}

export function tokenExpiresAt(expiresIn: number): Date {
  return new Date(Date.now() + expiresIn * 1000 - 60_000); // 1 min buffer
}

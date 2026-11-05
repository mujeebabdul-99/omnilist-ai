import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const upc = req.nextUrl.searchParams.get("upc");

  if (!upc || !/^\d{8,14}$/.test(upc)) {
    return NextResponse.json({ error: "Invalid UPC — must be 8 to 14 digits" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`,
      {
        headers: {
          Accept: "application/json",
          "user-agent": "OmniList/1.0",
        },
        next: { revalidate: 86400 }, // cache for 24 hours
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `UPCitemdb returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Product not found for this UPC" }, { status: 404 });
    }

    const item = data.items[0];

    return NextResponse.json({
      upc,
      title: item.title ?? "",
      brand: item.brand ?? "",
      model: item.model ?? "",
      category: item.category ?? "",
      description: item.description ?? "",
      images: item.images ?? [],
      lowestPrice: item.lowest_recorded_price ?? null,
      highestPrice: item.highest_recorded_price ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to reach UPC lookup service" }, { status: 502 });
  }
}

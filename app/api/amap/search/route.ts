import { NextRequest, NextResponse } from "next/server";

const AMAP_KEY = process.env.AMAP_WEB_KEY;
const AMAP_SEARCH_URL = "https://restapi.amap.com/v3/place/text";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const keyword = searchParams.get("keyword");

  if (!keyword || keyword.trim().length === 0) {
    return NextResponse.json({ pois: [] });
  }

  if (!AMAP_KEY) {
    return NextResponse.json(
      { error: "Amap API key not configured" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    keywords: keyword.trim(),
    city: "深圳",
    types: "120201|120200", // 商务写字楼 | 写字楼
    offset: "10",
    page: "1",
    extensions: "all",
    key: AMAP_KEY,
  });

  try {
    const res = await fetch(`${AMAP_SEARCH_URL}?${params.toString()}`);
    const data = await res.json();

    if (data.status !== "1") {
      return NextResponse.json(
        { error: data.info || "Amap search failed" },
        { status: 502 }
      );
    }

    const pois = (data.pois || []).map(
      (poi: {
        id: string;
        name: string;
        address: string;
        adname: string;
        business_area?: string;
        location: string;
        typecode: string;
      }) => {
        const [lng, lat] = poi.location.split(",").map(Number);
        return {
          id: poi.id,
          name: poi.name,
          address: poi.address || "",
          district: poi.adname || "",
          businessArea: poi.business_area || "",
          location: poi.location,
          lng,
          lat,
          typecode: poi.typecode || "",
        };
      }
    );

    return NextResponse.json({ pois, count: data.count });
  } catch (err) {
    console.error("Amap search error:", err);
    return NextResponse.json(
      { error: "Amap search request failed" },
      { status: 502 }
    );
  }
}

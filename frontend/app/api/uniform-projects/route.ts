import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.STRAPI_INTERNAL_URL ||
  "http://localhost:1337";

/**
 * Proxy: GET /api/uniform-projects → backend /api/uniform-projects
 * This avoids CORS/mixed-content issues on Vercel deployments.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const qs = searchParams.toString();
    const url = `${BACKEND}/api/uniform-projects${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      return NextResponse.json(
        { projects: [], total: 0 },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[proxy /api/uniform-projects]", err);
    return NextResponse.json({ projects: [], total: 0 }, { status: 500 });
  }
}

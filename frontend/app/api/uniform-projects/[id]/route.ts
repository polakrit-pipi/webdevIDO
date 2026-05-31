import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.STRAPI_INTERNAL_URL ||
  "http://localhost:1337";

/**
 * Proxy: GET /api/uniform-projects/[id] → backend /api/uniform-projects/:id
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = `${BACKEND}/api/uniform-projects/${id}`;

    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      return NextResponse.json({ message: "Not found" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[proxy /api/uniform-projects/[id]]", err);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

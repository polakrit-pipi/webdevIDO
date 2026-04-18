
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function getColors() {
  try {
    const res = await fetch(`${API_URL}/api/color`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const result = await res.json();

    // result.data is the color row, .color is the JSON theme config
    return result?.data?.color ?? null;
  } catch {
    return null;
  }
}

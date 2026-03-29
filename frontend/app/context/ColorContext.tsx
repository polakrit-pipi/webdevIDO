
export async function getColors() {

  const res = await fetch(`http://localhost:1337/api/color`, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!res.ok) throw new Error("Failed to fetch colors");

  const result = await res.json();
  
  // Clean up the Strapi data structure here so your page is clean
  return result.data.color
};

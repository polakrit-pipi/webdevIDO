'use client';
import { useEffect, useState } from "react";
import Collection_Card from "../ui/collection_card";
import { useInView } from "@/lib/hooks/useInView";
import { useLanguage } from "@/app/context/LanguageContext";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface Collection {
  id: number;
  documentId: string;
  Image: { url: string } | { url: string }[] | null;
}

export default function Collection_section() {
  const { ref, isVisible } = useInView();
  const { t } = useLanguage();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/collections?populate=*`)
      .then(r => r.json())
      .then(json => {
        setCollections(json.data || []);
      })
      .catch(err => console.error("Error fetching collections:", err))
      .finally(() => setLoading(false));
  }, []);

  // Build full image URL from collection Image field
  function getImageUrl(col: Collection): string {
    const img = col.Image;
    if (!img) return '/placeholder.png';
    const raw = Array.isArray(img) ? img[0]?.url : (img as any)?.url;
    if (!raw) return '/placeholder.png';
    return raw.startsWith('http') ? raw : `${API_URL}${raw}`;
  }

  return (
    <div className={`w-full h-fit flex my-[5vw] justify-center fade-section ${isVisible ? 'fade-section-visible' : ''}`} ref={ref}>
      <div className="text-center w-full">
        <h2 className="text-[2.5vw] font-bold mb-[3vw]">{t("section.collection")}</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : collections.length === 0 ? (
          <p className="text-gray-400">No collections yet. Add some from the admin panel.</p>
        ) : (
          <div className="w-full grid grid-cols-3 gap-[1vw]" style={{ gridTemplateRows: `repeat(${Math.ceil(collections.length / 3)}, auto)` }}>
            {collections.map(col => (
              <Collection_Card key={col.id} imageUrl={getImageUrl(col)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
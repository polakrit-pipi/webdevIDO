"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";

type Suggestions = {
  keywords: string[];
  products: { id: number | string; name: string; image: string }[];
  collections: string[];
};

interface SearchProps {
  isScrolled: boolean;
}

export default function Search({ isScrolled }: SearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isLoadingSuggest, setIsLoadingSuggest] = useState(false);

  const [suggestions, setSuggestions] = useState<Suggestions>({
    keywords: [],
    products: [],
    collections: [],
  });

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Cache of all products for client-side search
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [hasFetchedProducts, setHasFetchedProducts] = useState(false);

  /* =======================
      FETCH ALL PRODUCTS ONCE
     ======================= */
  useEffect(() => {
    if (isSearchOpen && !hasFetchedProducts) {
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            `${API_URL}/api/products?populate[variants][populate]=*&populate[cat_pro][populate]=categoryPic&pagination[pageSize]=100`
          );
          const data = await res.json();
          setAllProducts(data.data || []);
          setHasFetchedProducts(true);
        } catch (err) {
          console.error("Failed to fetch products for search:", err);
        }
      };
      fetchProducts();
    }
  }, [isSearchOpen, hasFetchedProducts]);

  /* =======================
      CLIENT-SIDE SEARCH FILTER
     ======================= */
  useEffect(() => {
    if (!searchValue.trim()) {
      setIsSuggestOpen(false);
      setSuggestions({ keywords: [], products: [], collections: [] });
      return;
    }

    setIsSuggestOpen(true);
    setIsLoadingSuggest(true);

    const timer = setTimeout(() => {
      const query = searchValue.trim().toLowerCase();
      const matchedItems = allProducts.filter((p: any) =>
        p.ProductName?.toLowerCase().includes(query)
      );

      // Build keyword suggestions
      const keywords = [
        searchValue.trim(),
        ...matchedItems
          .slice(0, 2)
          .map((p: any) => p.ProductName)
          .filter((name: string) => name.toLowerCase() !== query),
      ];

      // Build product suggestions with actual images
      const products = matchedItems.slice(0, 4).map((p: any) => {
        const variant = p.variants?.[0];
        const imgData = variant?.Image || variant?.image;
        const img = Array.isArray(imgData) ? imgData[0] : imgData;
        const imageUrl = img?.url
          ? img.url.startsWith("http")
            ? img.url
            : `${API_URL}${img.url}`
          : "";
        return {
          id: p.documentId || p.id,
          name: p.ProductName,
          image: imageUrl,
        };
      });

      // Build collection suggestions from matched product categories
      const collectionSet = new Set<string>();
      matchedItems.forEach((p: any) => {
        if (p.cat_pro?.categoryName) collectionSet.add(p.cat_pro.categoryName);
      });
      const collections = Array.from(collectionSet).slice(0, 4);

      setSuggestions({ keywords, products, collections });
      setIsLoadingSuggest(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchValue, allProducts]);

  /* =======================
      CLOSE ON ROUTE CHANGE
     ======================= */
  useEffect(() => {
    setIsSearchOpen(false);
    setSearchValue("");
    setIsSuggestOpen(false);
  }, [pathname]);

  /* =======================
      BODY SCROLL LOCK
     ======================= */
  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  return (
    <>
      {/* SEARCH ICON */}
      <button
        onClick={() => setIsSearchOpen(prev => !prev)}
        className="w-[1.1vw] h-[1.1vw] relative"
      >
        <Image
          src="/search-icon.png"
          fill
          alt="search"
          className="object-contain"
        />
      </button>

      {/* SEARCH BAR */}
      <div
        className={`fixed left-0 w-full bg-white z-40
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          transform
          ${isSearchOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
          }`}
        style={{
          top: isScrolled ? "4.5vw" : "7vw",
          height: "4vw",
        }}
      >
        <div className="flex items-center h-full px-[3vw]">
          <div className="w-[1vw] h-[1vw] relative mr-[1.2vw] opacity-60">
            <Image
              src="/search-icon.png"
              fill
              alt="search"
              className="object-contain"
            />
          </div>

          {/* INPUT */}
          <input
            autoFocus
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchValue.trim()) {
                router.push(`/product?search=${encodeURIComponent(searchValue.trim())}`);
                setIsSearchOpen(false);
              }
            }}
            placeholder="SEARCH ..."
            className="flex-1 bg-transparent outline-none text-[1vw] tracking-[0.25em] uppercase"
          />

          {/* CLOSE */}
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSearchValue("");
              setIsSuggestOpen(false);
            }}
            className="ml-[1.5vw] text-[1.5vw] leading-none opacity-60 hover:opacity-100"
          >
            ×
          </button>
        </div>
      </div>

      {/* SUGGESTION PANEL */}
      {isSearchOpen && isSuggestOpen && (
        <div
          className="fixed left-0 w-full bg-white z-40 overflow-y-auto"
          style={{
            top: isScrolled ? "8.5vw" : "11vw",
            maxHeight: isScrolled
              ? "calc(100vh - 8.5vw)"
              : "calc(100vh - 11vw)",
          }}
        >
          {isLoadingSuggest ? (
            <div className="flex items-center justify-center py-[3vw]">
              <div className="w-[2vw] h-[2vw] border-2 border-gray-300 border-t-[#5F4B8B] rounded-full animate-spin" />
            </div>
          ) : suggestions.products.length === 0 && suggestions.keywords.length <= 1 ? (
            <div className="flex flex-col items-center justify-center py-[3vw] text-gray-400">
              <p className="text-[1vw]">{t("search.noResult")} &quot;{searchValue}&quot;</p>
              <p className="text-[0.8vw] mt-[0.5vw]">{t("search.tryOther")}</p>
            </div>
          ) : (
          <div className="flex px-[3vw] py-[2vw] gap-[3vw]">
            {/* KEYWORDS */}
            <div className="w-[20%]">
              <p className="text-[0.9vw] mb-[1vw] opacity-50">
                Search Suggestions
              </p>
              <div className="flex flex-col gap-[0.6vw]">
                {suggestions.keywords.map((k, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      router.push(`/product?search=${encodeURIComponent(k)}`);
                      setIsSearchOpen(false);
                    }}
                    className="bg-gray-100 rounded-full px-[1vw] py-[0.5vw] text-left text-[0.9vw] hover:bg-gray-200 transition-colors"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="w-[60%]">
              <p className="text-[0.9vw] mb-[1vw] opacity-50">Products</p>
              <div className="grid grid-cols-4 gap-[1.5vw]">
                {suggestions.products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      router.push(`/product/${p.id}`);
                      setIsSearchOpen(false);
                    }}
                    className="text-left group"
                  >
                    <div className="aspect-[3/4] bg-gray-100 mb-[0.5vw] relative overflow-hidden">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-300 text-[0.7vw]">
                          NO IMAGE
                        </div>
                      )}
                    </div>
                    <p className="text-[0.8vw] group-hover:text-[#5F4B8B] transition-colors truncate">{p.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* COLLECTIONS */}
            {suggestions.collections.length > 0 && (
            <div className="w-[20%]">
              <p className="text-[0.9vw] mb-[1vw] opacity-50">Collections</p>
              <div className="flex flex-col gap-[0.8vw]">
                {suggestions.collections.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      router.push(`/product?category=${encodeURIComponent(c)}`);
                      setIsSearchOpen(false);
                    }}
                    className="text-left text-[0.9vw] hover:text-[#5F4B8B] transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            )}
          </div>
          )}
        </div>
      )}

      {/* OVERLAY */}
      {isSearchOpen && (
        <div
          className="fixed left-0 w-full bg-black/50 z-30"
          style={{
            top: isScrolled ? "4.5vw" : "7vw",
            height: `calc(100vh - ${isScrolled ? "4.5vw" : "7vw"})`,
          }}
          onClick={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
}

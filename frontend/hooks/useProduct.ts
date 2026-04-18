import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getColors } from "@/app/context/ColorContext";
import { Product, Category } from "@/types/types";
import { WishlistItem } from "@/types/types"; // Import จากไฟล์ types


// ==========================================
// 1. CONSTANTS (No Colors)
// ==========================================
export const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const SORT_OPTIONS = [
  { label: "แนะนำ", value: "recommended" },
  { label: "ราคา: ต่ำ - สูง", value: "price_asc" },
  { label: "ราคา: สูง - ต่ำ", value: "price_desc" },
  { label: "ชื่อสินค้า A-Z", value: "name_asc" }
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

// ==========================================
// 2. UTILS
// ==========================================
export const getImageUrl = (path?: string | null) =>
  path ? (path.startsWith("http") ? path : `${API_URL}${path}`) : "/placeholder.png";

export const getProductVariantImage = (variant: any) => {
  if (!variant) return null;
  const imgData = variant.Image || variant.image;
  if (!imgData) return null;
  return Array.isArray(imgData) ? imgData[0] : imgData;
};

// ==========================================
// 3. MAIN HOOK (Data + Filter Logic)
// ==========================================
export const useProduct = () => {
  // --- STATE: Data ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bannerUrl, setBannerUrl] = useState("");
  const [colors, setColors] = useState<any>(null); // Fetched from context/db
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // --- STATE: Filters ---
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const typeParam = searchParams.get("type");
  const isSaleParam = searchParams.get("sale") === "true";
  const searchQuery = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>("recommended");

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchUserWishlist = async () => {
    const token = getToken();
    if (!token) return;

    try {
      // Fetch user data including wishlist
      const res = await fetch(`${API_URL}/api/users/me?populate[wishlists][populate]=product`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const userData = await res.json();

      // ✅ Use the numerical ID for relation creation if documentId fails
      setUserId(userData.id);
      // Note: Check if your API returns 'wishlists' or 'wishlist' based on your previous success
      setWishlistItems(userData.wishlists || []);

    } catch (err) {
      console.error("Wishlist Fetch Error:", err);
    }
  };
  // --- 4. FETCHING LOGIC ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, bannerRes] = await Promise.all([
          fetch(`${API_URL}/api/categories?populate=categoryPic`).then(r => r.json()),
          fetch(`${API_URL}/api/products?populate[variants][populate]=*&populate[cat_pro][populate]=categoryPic`).then(r => r.json()),
          fetch(`${API_URL}/api/banner?populate=*`).then(r => r.json()),
        ]);

        setCategories(catRes.data || []);
        setProducts(prodRes.data || []);

        const imageData = bannerRes.data?.Image;
        if (imageData?.url) {
          setBannerUrl(`${API_URL}${imageData.url}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }

      // Colors are optional — don't let them crash the page
      try {
        const colorRes = await getColors();
        setColors(colorRes);
      } catch {
        // Colors unavailable, that's fine
      }
    };
    fetchData();
  }, []);

  // --- 5. FILTER SYNC LOGIC ---
  useEffect(() => {
    if (categories.length > 0) {
      if (categoryParam) setSelectedCategory(categoryParam);
      else if (typeParam || isSaleParam) setSelectedCategory(null);
      else setSelectedCategory(null);
    }
  }, [categoryParam, typeParam, isSaleParam, categories]);

  // --- 6. DERIVED DATA (Memoized) ---
  const availableColors = useMemo(() => {
    const colorSet = new Set<string>();
    products?.forEach(p => p.variants?.forEach(v => { if (v.color) colorSet.add(v.color); }));
    return Array.from(colorSet);
  }, [products]);

  const recommended = useMemo(() => {
    return products.filter((product) => product.recomended === true);
  }, [products]);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    const saleCats = new Set();
    if (isSaleParam) {
      products.forEach(p => {
        if (p.variants?.some(v => (v.salePricing || 0) > 0 && (v.salePricing || 0) < v.pricing) && p.cat_pro?.categoryName) {
          saleCats.add(p.cat_pro.categoryName);
        }
      });
    }
    return categories.filter((c) =>
      (!typeParam || c.type?.toLowerCase() === typeParam.toLowerCase()) &&
      (!isSaleParam || saleCats.has(c.categoryName))
    );
  }, [categories, products, typeParam, isSaleParam]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = products.filter((product) => {
      // 0. Search Filter — if a search query is present, filter by product name
      if (searchQuery.trim()) {
        const match = product.ProductName.toLowerCase().includes(searchQuery.trim().toLowerCase());
        if (!match) return false;
      }

      // 1. Category/Type Filters (skip if search is active to show all matching results)
      if (!searchQuery.trim()) {
        if (selectedCategory) { if (product.cat_pro?.categoryName !== selectedCategory) return false; }
        else if (typeParam) { if (product.cat_pro?.type?.toLowerCase() !== typeParam.toLowerCase()) return false; }
        else if (isSaleParam) {
          const hasDiscount = product.variants?.some(v => (v.salePricing || 0) > 0 && (v.salePricing || 0) < v.pricing);
          if (!hasDiscount) return false;
        }
      }

      // 2. Attribute Filters
      if (selectedSizes.length > 0) {
        const hasSize = product.variants?.some(v => v.size && selectedSizes.some(s => s.toLowerCase() === v.size.toLowerCase()));
        if (!hasSize) return false;
      }
      if (selectedColors.length > 0) {
        const hasColor = product.variants?.some(v => v.color && selectedColors.includes(v.color));
        if (!hasColor) return false;
      }

      // 3. Price Filter
      const variant0 = product.variants?.[0];
      const currentPrice = (variant0?.salePricing && variant0.salePricing > 0 && variant0.salePricing < variant0.pricing)
        ? variant0.salePricing : (variant0?.pricing || 0);
      if (currentPrice > priceRange) return false;

      return true;
    });

    // 4. Sorting
    return result.sort((a, b) => {
      const getRealPrice = (p: Product) => {
        const v = p.variants?.[0]; if (!v) return 0;
        return (v.salePricing && v.salePricing > 0 && v.salePricing < v.pricing) ? v.salePricing : v.pricing;
      };

      if (sortBy === "price_asc") return getRealPrice(a) - getRealPrice(b);
      if (sortBy === "price_desc") return getRealPrice(b) - getRealPrice(a);
      if (sortBy === "name_asc") return a.ProductName.localeCompare(b.ProductName);
      return 0;
    });
  }, [products, selectedCategory, typeParam, isSaleParam, searchQuery, selectedSizes, selectedColors, priceRange, sortBy]);

  const handleToggleWishlist = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getToken();
    if (!token) { alert("Please login first"); return; }

    // เรายังเช็ค userId เพื่อความชัวร์ว่าโหลดข้อมูล User มาครบแล้ว
    // แต่ตอนส่งไป create ไม่ต้องส่ง userId ไปครับ
    if (!userId) {
      alert("User data loading, please wait...");
      return;
    }

    const existingItem = wishlistItems.find(item => item.product?.documentId === product.documentId);

    try {
      if (existingItem) {
        // --- DELETE (เหมือนเดิม) ---
        const res = await fetch(`http://localhost:1337/api/wishlists/${existingItem.documentId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          setWishlistItems(prev => prev.filter(item => item.documentId !== existingItem.documentId));
        }
      } else {
        // --- CREATE (แก้ไขจุดนี้) ---
        const payload = {
          data: {
            // ❌ ลบบรรทัดนี้ทิ้ง: user: currentUserId, 
            // ✅ ให้เหลือแค่ product กับ publishedAt
            product: product.id,
            publishedAt: new Date().toISOString()
          }
        };

        console.log("Sending POST:", payload);

        const res = await fetch("http://localhost:1337/api/wishlists", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("POST Error:", errorData);
          alert(`Add failed: ${errorData.error?.message || "Unknown error"}`);
          return;
        }

        if (res.ok) fetchUserWishlist();
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    }
  };

  // --- 7. RETURN ---
  return {
    // Data
    products,
    categories,
    colors,
    bannerUrl,
    isLoading,

    // Filtered Results
    filteredProducts,
    filteredCategories,
    availableColors,

    // Filter States & Setters
    selectedCategory, setSelectedCategory,
    selectedSizes, setSelectedSizes,
    selectedColors, setSelectedColors,
    priceRange, setPriceRange,
    sortBy, setSortBy,

    // URL Params (for UI titles)
    typeParam,
    isSaleParam,
    searchQuery,

    handleToggleWishlist,
    wishlistItems,
    toggleWishlist: handleToggleWishlist,

    recommended
  };
};
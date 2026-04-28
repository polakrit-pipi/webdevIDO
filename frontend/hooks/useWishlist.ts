"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WishlistItem, Product, UserProfile, CartItemPayload } from "@/types/types"; // Import จากไฟล์ types

export function useWishlist() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  useEffect(() => {
    fetchWishlist();
  }, []);

  // --- Fetch Wishlist ---
  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const query = new URLSearchParams();
      query.append("populate[wishlists][populate][product][populate][variants][populate]", "Image");
      
      const res = await fetch(`${apiUrl}/api/users/me?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("User session expired");

      const userData: UserProfile = await res.json();

      if (userData.wishlists && Array.isArray(userData.wishlists)) {
        const validWishlists = userData.wishlists
          .filter((item) => item.publishedAt !== null && item.product) 
          .filter((item, index, self) => 
              index === self.findIndex((t) => t.documentId === item.documentId)
          )
          .sort((a, b) => 
            new Date(b.added_at || "").getTime() - new Date(a.added_at || "").getTime()
          );

        setWishlistItems(validWishlists);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Remove Item ---
  const handleRemove = async (documentId: string) => {
    if (!confirm("ต้องการลบสินค้านี้ออกจากรายการที่ถูกใจ?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiUrl}/api/wishlists/${documentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setWishlistItems((prev) => prev.filter((item) => item.documentId !== documentId));
      }
    } catch (error) { console.error(error); }
  };

  // --- Add to Cart ---
  const handleAddToCart = async (product: Product) => {
    const token = localStorage.getItem("token");
    const variant = product.variants?.[0];
    
    if (!variant) {
      alert("สินค้าหมดหรือไม่พร้อมจำหน่าย");
      return;
    }

    setIsAddingToCart(product.documentId); 

    try {
      const query = new URLSearchParams();
      query.append("populate[cart][populate][items][populate]", "product"); 

      const userRes = await fetch(`${apiUrl}/api/users/me?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      
      const userData: UserProfile = await userRes.json();

      const newItem: CartItemPayload = {
        sku: variant.sku || `${product.documentId}-default`,
        quantity: 1,
        price_at_added: variant.pricing,
        product: product.documentId, 
        added_at: new Date().toISOString(),
      };

      let cartDocumentId = userData.cart?.documentId;
      let existingItems = userData.cart?.items || [];
      
      const nextItems: CartItemPayload[] = [
        ...existingItems.map((item) => {
          let productId: string | number;
          if (item.product && typeof item.product === 'object') {
             productId = (item.product as any).documentId || (item.product as any).id || "";
          } else {
             productId = (item.product as unknown) as string | number;
          }
          return {
            sku: item.sku,
            quantity: item.quantity,
            price_at_added: item.price_at_added ?? 0,
            product: productId, 
            added_at: item.added_at || new Date().toISOString()
          };
        }),
        newItem
      ];

      const endpoint = cartDocumentId ? `${apiUrl}/api/carts/${cartDocumentId}` : `${apiUrl}/api/carts`;
      const method = cartDocumentId ? "PUT" : "POST";
      const body = cartDocumentId 
        ? { data: { items: nextItems } }
        : { data: { user: userData.id, items: [newItem], publishedAt: new Date().toISOString() } };

      const res = await fetch(endpoint, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("เพิ่มลงตะกร้าเรียบร้อย!");
      } else {
        const errorData = await res.json();
        alert(`เกิดข้อผิดพลาด: ${errorData.error?.message || "Unknown Error"}`);
      }

    } catch (error) {
      console.error("Add to cart error:", error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsAddingToCart(null); 
    }
  };

  return {
    wishlistItems,
    isLoading,
    isAddingToCart,
    handleRemove,
    handleAddToCart
  };
}
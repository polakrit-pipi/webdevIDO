"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CartItem, UserProfile } from "@/types/types"; // ปรับ path ตามจริง

export const useCart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartDocId, setCartDocId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const query = new URLSearchParams();
      query.append("populate[cart][populate][items][populate][product][populate][variants][populate]", "Image");

      const userRes = await fetch(`${apiUrl}/api/users/me?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!userRes.ok) throw new Error("Failed to fetch user data");

      const userData: UserProfile = await userRes.json();
      if (userData.cart) {
        setCartDocId(userData.cart.documentId);
        setCartItems(userData.cart.items || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartOnServer = async (newItems: CartItem[]) => {
    if (!cartDocId) return;
    setIsUpdating(true);
    const token = localStorage.getItem("token");

    try {
      const payloadItems = newItems.map((item) => ({
        sku: item.sku,
        quantity: item.quantity,
        product: item.product?.documentId,
      }));

      const res = await fetch(`${apiUrl}/api/carts/${cartDocId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { items: payloadItems } }),
      });

      if (!res.ok) throw new Error("Update failed");
      setCartItems(newItems);
    } catch (error) {
      console.error("Update error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกตะกร้า");
      fetchCart(); // Revert to server state
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuantityChange = (sku: string, change: number) => {
    const updatedItems = cartItems.map((item) => {
      if (item.sku === sku) {
        const newQty = item.quantity + change;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setCartItems(updatedItems);
    updateCartOnServer(updatedItems);
  };

  const handleRemove = (sku: string) => {
    if (!confirm("ต้องการลบสินค้านี้ใช่ไหม?")) return;
    const remainingItems = cartItems.filter((item) => item.sku !== sku);
    setCartItems(remainingItems);
    updateCartOnServer(remainingItems);
  };

  // คำนวณยอดรวม (Memoized)
  const grandTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const product = item.product;
      if (!product) return sum;
      const correctVariant = product.variants?.find((v) => v.sku === item.sku);
      const price = correctVariant?.pricing || product.variants?.[0]?.pricing || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  return {
    cartItems,
    isLoading,
    isUpdating,
    grandTotal,
    handleQuantityChange,
    handleRemove,
  };
};
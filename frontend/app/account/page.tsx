"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, Transaction } from "@/types/types";
import { useLanguage } from "@/app/context/LanguageContext";

// Import Components
import ProfileHeader from "./components/ProfileHeader";
import OrderHistory from "./components/OrderHistory";
import AddressInfo from "./components/AddressInfo";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

      if (!token) {
        router.push("/register");
        return;
      }

      try {
        const userRes = await fetch(`${apiUrl}/api/users/me?populate=transactions`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!userRes.ok) {
          throw new Error("User session expired");
        }

        const userData: UserProfile = await userRes.json();
        setUser(userData);

        if (userData.transactions && Array.isArray(userData.transactions)) {
          const validOrders = userData.transactions
            .filter((order) => order.publishedAt !== null)
            .filter((order, index, self) =>
              index === self.findIndex((t) => t.documentId === order.documentId)
            )
            .sort((a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

          setOrders(validOrders);
        } else {
          setOrders([]);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="p-10 text-center font-light">{t("account.loading")}</div>
    );
    
  if (!user) return null;

  return (
    <div className="mt-[7vw] min-h-screen bg-white px-6 font-light text-[#333]">
      <div className="max-w-6xl mx-auto py-10">
        
        <ProfileHeader onLogout={handleLogout} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          <OrderHistory orders={orders} />

          <AddressInfo user={user} />
          
        </div>
      </div>
    </div>
  );
}
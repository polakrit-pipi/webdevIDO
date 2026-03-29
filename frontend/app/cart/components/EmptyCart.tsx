"use client";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

export default function EmptyCart() {
  const { t } = useLanguage();
  return (
    <div className="text-center py-20 bg-gray-50 rounded-lg">
      <p className="text-gray-500 mb-4">{t("cart.empty")}</p>
      <Link href="/product" className="inline-block bg-black text-white px-6 py-2 rounded">{t("cart.shopNow")}</Link>
    </div>
  );
}
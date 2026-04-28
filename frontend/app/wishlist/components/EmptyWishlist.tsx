"use client";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

export default function EmptyWishlist() {
  const { t } = useLanguage();
  return (
    <div className="text-center py-20">
      <p className="text-gray-400 text-lg mb-6">{t("wishlist.empty")}</p>
      <Link href="/product" className="inline-block border border-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all">{t("wishlist.shopNow")}</Link>
    </div>
  );
}
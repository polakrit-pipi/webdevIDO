"use client";
import { useWishlist } from "@/hooks/useWishlist";
import WishlistCard from "./components/WishlistCard";
import EmptyWishlist from "./components/EmptyWishlist";
import { useLanguage } from "@/app/context/LanguageContext";

export default function WishlistPage() {
  const { wishlistItems, isLoading, isAddingToCart, handleRemove, handleAddToCart } = useWishlist();
  const { t } = useLanguage();
  if (isLoading) return <div className="p-10 text-center text-gray-400 font-light">{t("wishlist.loading")}</div>;
  return (
    <div className="mt-[7vw] min-h-screen bg-white text-[#333] font-light">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-normal mb-2">{t("wishlist.title")}</h1>
          <p className="text-gray-400 text-sm">{t("wishlist.savedItems")} ({wishlistItems.length} {t("wishlist.count")})</p>
        </div>
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <WishlistCard key={item.documentId} item={item} isAddingToCart={isAddingToCart === item.product?.documentId} onRemove={handleRemove} onAddToCart={handleAddToCart} />
            ))}
          </div>
        ) : (<EmptyWishlist />)}
      </div>
    </div>
  );
}
"use client";
import { Suspense } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import { useProduct } from "@/hooks/useProduct";
import ProductCard from "@/app/product/components/features/ProductCard";
import FilterSidebar from "@/app/product/components/features/FilterSidebar";
import CategoryGrid from "@/app/product/components/features/CategoryGrid";
import { useLanguage } from "@/app/context/LanguageContext";

function ProductContent() {
  const store = useProduct();
  const { wishlistItems, toggleWishlist } = store;
  const { t } = useLanguage();

  const getPageTitle = () => {
    if (store.searchQuery) return `${t("product.search")}: "${store.searchQuery}"`;
    if (store.typeParam) return store.typeParam;
    else if (store.isSaleParam) return "SALE";
    else return "Recommend";
  };

  return (
    <div className="mt-[7vw] min-h-screen bg-white font-sans text-[#333]">
      <Navbar />
      <div className="relative w-full h-75 md:h-100 bg-gray-800 flex items-center justify-center overflow-hidden">
         {store.bannerUrl && <Image src={store.bannerUrl} alt="Banner" fill className="object-cover" unoptimized />}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <h1 className="relative z-20 text-white text-3xl md:text-5xl font-bold uppercase tracking-widest text-center px-4">{getPageTitle()}</h1>
      </div>
      <div className="container mx-auto px-4 py-8">
        <CategoryGrid categories={store.filteredCategories} selectedCategory={store.selectedCategory} onSelect={store.setSelectedCategory} />
        <div className="flex flex-col lg:flex-row gap-10">
          <FilterSidebar categories={store.categories} availableColors={store.availableColors} colorMap={store.colors} store={store} />
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
               <span className="text-sm text-gray-500">{t("product.found")} {store.filteredProducts.length} {t("product.items")}</span>
            </div>
            {store.isLoading ? (
               <div className="text-center py-20 text-gray-400 animate-pulse">{t("product.loading")}</div>
            ) : store.filteredProducts.length === 0 ? (
               <div className="text-center py-20 text-gray-400 bg-gray-50 rounded">{t("product.noMatch")}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {store.filteredProducts.map((product) => (
                  <ProductCard key={product.documentId} product={product} isWishlisted={wishlistItems.some(item => item.product?.documentId === product.documentId)} onToggleWishlist={toggleWishlist} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function MenPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductContent />
    </Suspense>
  );
}
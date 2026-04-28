"use client";
import Image from "next/image";
import Link from "next/link";
import { Product, WishlistItem } from "@/types/types";
import { useLanguage } from "@/app/context/LanguageContext";
import { useCurrency } from "@/app/context/CurrencyContext";

interface WishlistCardProps { item: WishlistItem; isAddingToCart: boolean; onRemove: (id: string) => void; onAddToCart: (product: Product) => void; }

export default function WishlistCard({ item, isAddingToCart, onRemove, onAddToCart }: WishlistCardProps) {
  const product = item.product;
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  if (!product) return null;
  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const productImageObj = firstVariant?.Image && firstVariant.Image.length > 0 ? firstVariant.Image[0] : null;
  const imageUrl = productImageObj?.url ? `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${productImageObj.url}` : "/placeholder-image.jpg";
  const price = firstVariant?.pricing || 0;
  const productName = product.ProductName || t("wishlist.unnamed");

  return (
    <div className="group relative border border-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
      <button onClick={() => onRemove(item.documentId)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors z-10">✕</button>
      <Link href={`/product/${product.documentId}`} className="block relative aspect-3/4 mb-4 overflow-hidden rounded bg-gray-50">
        <Image src={imageUrl} alt={productName} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>
      <div className="text-center">
        <Link href={`/product/${product.slug || product.documentId}`}>
          <h3 className="text-base font-normal mb-1 truncate hover:text-purple-600 transition-colors">{productName}</h3>
        </Link>
        <p className="text-lg font-medium text-black mb-4">{price > 0 ? formatPrice(price) : t("wishlist.noPrice")}</p>
        <button onClick={() => onAddToCart(product)} disabled={isAddingToCart} className={`w-full py-2 text-sm rounded transition-colors ${isAddingToCart ? "bg-gray-400 text-white cursor-not-allowed" : "bg-black text-white hover:bg-purple-600"}`}>
          {isAddingToCart ? t("wishlist.adding") : t("wishlist.addToCart")}
        </button>
      </div>
    </div>
  );
}
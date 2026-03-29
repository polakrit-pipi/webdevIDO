"use client";
import Image from "next/image";
import { CartItem } from "@/types/types";
import { useLanguage } from "@/app/context/LanguageContext";

interface CartItemRowProps { item: CartItem; isUpdating: boolean; onUpdateQty: (sku: string, change: number) => void; onRemove: (sku: string) => void; }

export default function CartItemRow({ item, isUpdating, onUpdateQty, onRemove }: CartItemRowProps) {
  const { product, sku, quantity } = item;
  const { t } = useLanguage();

  if (!product) {
    return (
      <div className="flex justify-between items-center p-4 border border-red-200 bg-red-50 rounded-lg text-red-600 mb-4">
        <div>
          <p className="font-bold text-sm">{t("cart.unavailable")}</p>
          <p className="text-xs text-red-400">{t("cart.dataLost")} (SKU: {sku || t("cart.unspecified")})</p>
        </div>
        <button onClick={() => onRemove(sku)} className="text-red-600 underline text-sm hover:text-red-800 font-bold">{t("cart.removeThis")}</button>
      </div>
    );
  }

  const variant = product.variants?.find((v) => v.sku.trim().toLowerCase() === sku.trim().toLowerCase());
  let imageObj = null;
  if (variant?.Image?.[0]) imageObj = variant.Image[0];
  else if (product.variants?.[0]?.Image?.[0]) imageObj = product.variants[0].Image[0];
  const imageUrl = imageObj?.url ? `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${imageObj.url}` : "/placeholder.jpg";
  const price = variant?.pricing || product.variants?.[0]?.pricing || 0;

  return (
    <div className="flex gap-4 border-b border-gray-100 pb-6">
      <div className="relative w-24 h-32 bg-gray-50 rounded overflow-hidden shrink-0">
        <Image src={imageUrl} alt={product.ProductName} fill className="object-cover" unoptimized />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{product.ProductName}</h3>
            <p className="text-sm text-gray-500 mt-1">SKU: {sku}</p>
          </div>
          <p className="font-semibold text-lg">{price.toLocaleString()} THB</p>
        </div>
        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center border rounded">
            <button onClick={() => onUpdateQty(sku, -1)} disabled={isUpdating || quantity <= 1} className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50">-</button>
            <span className="px-3 text-sm font-medium w-8 text-center">{quantity}</span>
            <button onClick={() => onUpdateQty(sku, 1)} disabled={isUpdating} className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50">+</button>
          </div>
          <button onClick={() => onRemove(sku)} disabled={isUpdating} className="text-red-500 text-sm hover:underline disabled:opacity-50">{t("cart.removeProduct")}</button>
        </div>
      </div>
    </div>
  );
}
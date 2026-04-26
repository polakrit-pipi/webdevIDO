"use client";
import { useCart } from "@/hooks/useCart";
import CartItemRow from "./components/CartItemRow";
import CartSummary from "./components/CartSummary";
import EmptyCart from "./components/EmptyCart";
import { useLanguage } from "@/app/context/LanguageContext";

export default function CartPage() {
  const { cartItems, isLoading, isUpdating, grandTotal, handleQuantityChange, handleRemove } = useCart();
  const { t } = useLanguage();
  if (isLoading) return <div className="p-10 text-center">{t("cart.loading")}</div>;
  return (
    <div className="mt-[7w] min-h-screen bg-white text-[#333]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-4">
          {t("cart.title")}
          {isUpdating && <span className="text-sm font-normal text-gray-400 animate-pulse">{t("cart.saving")}</span>}
        </h1>
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (<CartItemRow key={`${item.id}-${item.sku}`} item={item} isUpdating={isUpdating} onUpdateQty={handleQuantityChange} onRemove={handleRemove} />))}
            </div>
            <CartSummary grandTotal={grandTotal} isUpdating={isUpdating} />
          </div>
        ) : (<EmptyCart />)}
      </div>
    </div>
  );
}
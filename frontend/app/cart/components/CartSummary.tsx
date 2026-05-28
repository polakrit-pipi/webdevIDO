'use client';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCurrency } from '@/app/context/CurrencyContext';

interface CartSummaryProps { grandTotal: number; isUpdating: boolean; }

export default function CartSummary({ grandTotal, isUpdating }: CartSummaryProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  return (
    <div className="bg-gray-50 p-6 rounded-lg h-fit">
      <h3 className="text-xl font-semibold mb-4">{t('cart.orderSummary')}</h3>
      <div className="flex justify-between mb-2"><span>{t('cart.subtotal')}</span><span>{formatPrice(grandTotal)}</span></div>
      <div className="flex justify-between mb-4"><span>{t('cart.shipping')}</span><span>{t('cart.free')}</span></div>
      <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
        <span>{t('cart.grandTotal')}</span><span>{formatPrice(grandTotal)}</span>
      </div>
      <button
        className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:bg-gray-400"
        disabled={isUpdating || grandTotal === 0}
        onClick={() => router.push('/checkout')}
      >
        {isUpdating ? t('cart.savingBtn') : t('cart.checkout')}
      </button>
    </div>
  );
}
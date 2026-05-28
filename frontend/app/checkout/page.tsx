'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CartItem, UserProfile } from '@/types/types';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCurrency } from '@/app/context/CurrencyContext';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// ── Bank account details (แก้ตรงนี้ได้เลย) ────────────────────────────────
const BANK_INFO = {
  bankName: 'ธนาคารกสิกรไทย (KBank)',
  accountNumber: '000-0-00000-0',
  accountName: 'IDO Identity Co., Ltd.',
  qrPromptPay: null as string | null, // ใส่ URL รูป QR PromptPay ถ้ามี
};

function formatTHB(amount: number) {
  return amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // slip form state
  const [transferredAt, setTransferredAt] = useState('');
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Load cart
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    const query = new URLSearchParams();
    query.append('populate[cart][populate][items][populate][product][populate][variants][populate]', 'Image');

    fetch(`${API_URL}/api/users/me?${query}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then((userData: UserProfile) => {
        const items = userData.cart?.items || [];
        setCartItems(items);
        const total = items.reduce((sum, item) => {
          const v = item.product?.variants?.find(v => v.sku === item.sku);
          const price = v?.pricing || item.product?.variants?.[0]?.pricing || 0;
          return sum + Number(price) * item.quantity;
        }, 0);
        setGrandTotal(total);
      })
      .catch(() => router.push('/cart'))
      .finally(() => setLoading(false));
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('ไฟล์ต้องมีขนาดไม่เกิน 10 MB'); return; }
    setError('');
    setSlipFile(file);
    setSlipPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!slipFile) { setError('กรุณาแนบสลิปการโอนเงิน'); return; }
    if (!transferredAt) { setError('กรุณาระบุวันเวลาที่โอนเงิน'); return; }
    if (cartItems.length === 0) { setError('ตะกร้าสินค้าว่างเปล่า'); return; }

    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    setSubmitting(true);
    try {
      // Step 1: Upload slip image
      setUploading(true);
      const formData = new FormData();
      formData.append('file', slipFile);
      const uploadRes = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('อัปโหลดสลิปไม่สำเร็จ');
      const { url: slipUrl } = await uploadRes.json();
      setUploading(false);

      // Step 2: Create transaction
      const items = cartItems.map(item => {
        const v = item.product?.variants?.find(v => v.sku === item.sku);
        return {
          quantity: item.quantity,
          price_at_purchase: v?.pricing || 0,
          selected_sku: item.sku,
          product: item.product?.documentId,
        };
      });

      const txRes = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data: { total_summary: grandTotal, items } }),
      });
      if (!txRes.ok) throw new Error('สร้างคำสั่งซื้อไม่สำเร็จ');
      const txData = await txRes.json();
      const docId: string = txData.data?.documentId || txData.documentId;

      // Step 3: Submit slip
      const slipRes = await fetch(`${API_URL}/api/transactions/${docId}/slip`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slip_url: slipUrl, slip_transferred_at: new Date(transferredAt).toISOString() }),
      });
      if (!slipRes.ok) throw new Error('บันทึกสลิปไม่สำเร็จ');

      // Step 4: Clear cart
      await clearCart(token);

      setOrderId(docId);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  async function clearCart(token: string) {
    try {
      // Fetch cart documentId
      const me = await fetch(`${API_URL}/api/users/me?populate[cart]=*`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = await me.json();
      const cartDocId = meData.cart?.documentId;
      if (!cartDocId) return;
      await fetch(`${API_URL}/api/carts/${cartDocId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data: { items: [] } }),
      });
    } catch { /* ignore */ }
  }

  // ── Max datetime = now (can't say you transferred in the future)
  const maxDatetime = new Date().toISOString().slice(0, 16);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 animate-pulse">กำลังโหลด...</p>
    </div>
  );

  // ── Success screen
  if (step === 'success') return (
    <div className="mt-[7vh] min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ส่งสลิปสำเร็จ!</h1>
        <p className="text-gray-500 mb-2">คำสั่งซื้อของคุณกำลังรอการยืนยันจากทีมงาน</p>
        <p className="text-sm text-gray-400 mb-8">เราจะตรวจสอบสลิปและยืนยันการชำระเงินโดยเร็ว</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-500 mb-1">หมายเลขคำสั่งซื้อ</p>
          <p className="font-mono text-sm font-medium text-gray-800 break-all">{orderId}</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium"
        >
          กลับหน้าแรก
        </button>
      </div>
    </div>
  );

  // ── Checkout form
  return (
    <div className="mt-[7vh] min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ชำระเงิน</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Order Summary ─────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">สรุปคำสั่งซื้อ</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map(item => {
                  const v = item.product?.variants?.find(v => v.sku === item.sku);
                  const price = Number(v?.pricing || item.product?.variants?.[0]?.pricing || 0);
                  const imgObj = v?.Image?.[0] || item.product?.variants?.[0]?.Image?.[0];
                  const imgUrl = imgObj?.url
                    ? (imgObj.url.startsWith('http') ? imgObj.url : `${API_URL}${imgObj.url}`)
                    : '/placeholder.jpg';
                  return (
                    <div key={`${item.id}-${item.sku}`} className="flex gap-3 items-center">
                      <div className="relative w-12 h-14 bg-gray-50 rounded overflow-hidden shrink-0">
                        <Image src={imgUrl} alt={item.product?.ProductName || ''} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.product?.ProductName}</p>
                        <p className="text-xs text-gray-400">x{item.quantity} · SKU: {item.sku}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 shrink-0">฿{formatTHB(price * item.quantity)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>ค่าสินค้า</span><span>฿{formatTHB(grandTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>ค่าจัดส่ง</span><span className="text-green-600">ฟรี</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t mt-2">
                  <span>ยอดรวมที่ต้องชำระ</span>
                  <span className="text-2xl text-black">฿{formatTHB(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Bank info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">ข้อมูลบัญชีธนาคาร</h2>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ธนาคาร</span>
                  <span className="font-medium text-gray-800">{BANK_INFO.bankName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">เลขบัญชี</span>
                  <span className="font-mono font-bold text-gray-900 tracking-wider">{BANK_INFO.accountNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ชื่อบัญชี</span>
                  <span className="font-medium text-gray-800">{BANK_INFO.accountName}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                โอนเงิน <strong className="text-black text-sm">฿{formatTHB(grandTotal)}</strong> แล้วถ่ายรูปสลิปมาแนบด้านขวา
              </p>
            </div>
          </div>

          {/* ── Right: Slip Upload Form ─────────────────── */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">แนบหลักฐานการโอนเงิน</h2>

              {/* Transfer time picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันและเวลาที่โอนเงิน <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={transferredAt}
                  max={maxDatetime}
                  onChange={e => setTransferredAt(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                />
                <p className="text-xs text-gray-400 mt-1">ระบุเวลาที่ปรากฏในสลิป</p>
              </div>

              {/* Slip upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  สลิปโอนเงิน <span className="text-red-500">*</span>
                </label>
                <label
                  htmlFor="slip-upload"
                  className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-2xl cursor-pointer transition
                    ${slipPreview ? 'border-gray-200 p-2' : 'border-gray-300 hover:border-gray-400 p-8'}
                  `}
                >
                  {slipPreview ? (
                    <div className="relative w-full">
                      <img
                        src={slipPreview}
                        alt="slip preview"
                        className="w-full max-h-72 object-contain rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 rounded-xl transition flex items-center justify-center">
                        <span className="text-xs text-white bg-black/40 px-2 py-1 rounded opacity-0 hover:opacity-100 transition">
                          คลิกเพื่อเปลี่ยน
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">คลิกหรือลากไฟล์รูปสลิปมาวางที่นี่</p>
                      <p className="text-xs text-gray-400 mt-1">รองรับ JPG, PNG, WEBP (ไม่เกิน 10 MB)</p>
                    </div>
                  )}
                  <input
                    id="slip-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || cartItems.length === 0}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {uploading ? 'กำลังอัปโหลดสลิป...' : 'กำลังบันทึกคำสั่งซื้อ...'}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ยืนยันการชำระเงิน ฿{formatTHB(grandTotal)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                หลังจากส่งสลิปแล้ว ทีมงานจะตรวจสอบและยืนยันการชำระเงินภายใน 24 ชั่วโมง
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface OrderItem {
  id: number;
  selected_sku: string | null;
  quantity: number;
  price_at_purchase: number | null;
  product?: { ProductName?: string } | null;
}

interface ReturnItem {
  productName: string;
  originalSku: string;
  newSku: string;
  quantity: number;
}

interface ReturnRequestModalProps {
  orderId: number;
  documentId: string;
  orderItems: OrderItem[];
  onClose: () => void;
  onSuccess: () => void;
}

const RETURN_REASONS = [
  "สินค้าชำรุด / เสียหาย",
  "ผิดไซส์",
  "ผิดสี",
  "สินค้าไม่ตรงกับที่สั่ง",
  "อื่นๆ",
];

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function ReturnRequestModal({
  orderId,
  documentId,
  orderItems,
  onClose,
  onSuccess,
}: ReturnRequestModalProps) {
  const [returnReason, setReturnReason] = useState("");
  const [reasonDetail, setReasonDetail] = useState("");
  const [returnItems, setReturnItems] = useState<ReturnItem[]>(
    orderItems.map((item) => ({
      productName: item.product?.ProductName ?? "สินค้า",
      originalSku: item.selected_sku ?? "",
      newSku: item.selected_sku ?? "", // default = same SKU (damaged item replacement)
      quantity: item.quantity,
    }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateReturnItem(index: number, field: keyof ReturnItem, value: string | number) {
    setReturnItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!returnReason) {
      setError("กรุณาเลือกเหตุผลในการคืนสินค้า");
      return;
    }
    const invalidItem = returnItems.find((it) => !it.newSku.trim());
    if (invalidItem) {
      setError("กรุณาระบุ SKU สินค้าที่ต้องการใหม่ให้ครบทุกรายการ");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/transactions/${documentId}/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ returnReason, reasonDetail, items: returnItems }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">ขอคืน / เปลี่ยนสินค้า</h2>
            <p className="text-xs text-gray-400 mt-0.5">Order #{orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Reason selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              เหตุผลในการคืนสินค้า <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {RETURN_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    returnReason === reason
                      ? "border-black bg-black/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      returnReason === reason ? "border-black" : "border-gray-300"
                    }`}
                  >
                    {returnReason === reason && (
                      <span className="w-2 h-2 rounded-full bg-black block" />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="returnReason"
                    value={reason}
                    className="hidden"
                    onChange={() => setReturnReason(reason)}
                  />
                  <span className="text-sm text-gray-800">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Detail textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              รายละเอียดเพิ่มเติม <span className="text-gray-400 font-normal">(ไม่จำเป็น)</span>
            </label>
            <textarea
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
              placeholder="อธิบายปัญหาเพิ่มเติม เช่น ขนาดที่ต้องการ, สีที่ต้องการ..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Items to return */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              สินค้าที่ต้องการเปลี่ยน <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {returnItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        SKU เดิม: <span className="font-mono">{item.originalSku}</span>
                        {" "}× {item.quantity} ชิ้น
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* New SKU */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        SKU ที่ต้องการแทน <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.newSku}
                        onChange={(e) => updateReturnItem(idx, "newSku", e.target.value)}
                        placeholder="เช่น SKU-001-L-BLK"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">
                        ถ้าต้องการสินค้าชิ้นเดิม ใส่ SKU เดิมได้เลย
                      </p>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">จำนวน</label>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateReturnItem(idx, "quantity", Math.max(1, item.quantity - 1))}
                          className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition text-sm"
                        >
                          −
                        </button>
                        <span className="flex-1 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateReturnItem(idx, "quantity", Math.min(returnItems[idx].quantity + 1, (orderItems[idx]?.quantity ?? 99)))}
                          className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3">
            <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-700">
              ทีมงานจะตรวจสอบคำขอและติดต่อกลับภายใน 1-2 วันทำการ กรุณาส่งสินค้าเดิมคืนหลังจากได้รับการยืนยัน
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  กำลังส่งคำขอ...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ส่งคำขอคืนสินค้า
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

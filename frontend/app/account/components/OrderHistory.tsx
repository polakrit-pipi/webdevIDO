"use client";

import { useState } from "react";
import { Transaction } from "@/types/types";
import { useLanguage } from "@/app/context/LanguageContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import ReturnRequestModal from "./ReturnRequestModal";

interface OrderHistoryProps {
  orders: Transaction[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; step: number }> = {
  Pending:    { label: "รอดำเนินการ",    color: "#92400e", bg: "#fef3c7", step: 0 },
  Processing: { label: "กำลังดำเนินการ", color: "#1e40af", bg: "#dbeafe", step: 1 },
  Shipped:    { label: "จัดส่งแล้ว",      color: "#6d28d9", bg: "#ede9fe", step: 2 },
  Delivered:  { label: "ได้รับแล้ว",      color: "#065f46", bg: "#d1fae5", step: 3 },
  Cancelled:  { label: "ยกเลิก",          color: "#991b1b", bg: "#fee2e2", step: -1 },
};

const PAYMENT_CONFIG: Record<string, { label: string; color: string }> = {
  unpaid:          { label: "ยังไม่ชำระ",           color: "#6b7280" },
  slip_submitted:  { label: "รอยืนยันการชำระ",      color: "#d97706" },
  confirmed:       { label: "ยืนยันการชำระแล้ว",    color: "#059669" },
  rejected:        { label: "สลิปถูกปฏิเสธ",        color: "#dc2626" },
};

const STEPS = ["รอดำเนินการ", "กำลังดำเนินการ", "จัดส่งแล้ว", "ได้รับแล้ว"];

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const { locale, t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  // Track which order the return modal is open for
  const [returnModalOrderId, setReturnModalOrderId] = useState<number | null>(null);
  // Track which orders have been successfully returned in this session
  const [returnedOrderIds, setReturnedOrderIds] = useState<Set<number>>(new Set());

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const handleCopy = (text: string, orderId: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="lg:col-span-2">
      <h2 className="text-xl text-gray-300 border-b border-gray-200 pb-3 mb-6">
        {t("account.orderHistory")} ({orders.length})
      </h2>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.order_status] ?? STATUS_CONFIG["Pending"];
            const paymentCfg = PAYMENT_CONFIG[order.payment_status ?? "unpaid"] ?? PAYMENT_CONFIG["unpaid"];
            const isCancelled = order.order_status === "Cancelled";
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className="border border-gray-100 rounded-2xl overflow-hidden transition-all"
              >
                {/* Order header row */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t("account.orderNumber")} #{order.id}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Payment status */}
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ color: paymentCfg.color, background: paymentCfg.color + "18" }}
                    >
                      {paymentCfg.label}
                    </span>

                    {/* Order status */}
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ color: statusCfg.color, background: statusCfg.bg }}
                    >
                      {statusCfg.label}
                    </span>

                    {/* Total */}
                    <span className="text-sm font-semibold text-gray-800 hidden sm:block">
                      {order.total_summary ? formatPrice(order.total_summary) : "—"}
                    </span>

                    {/* Chevron */}
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-4 bg-gray-50">

                    {/* Progress bar (not shown for cancelled) */}
                    {!isCancelled && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          {STEPS.map((stepLabel, idx) => {
                            const done = statusCfg.step >= idx;
                            const active = statusCfg.step === idx;
                            return (
                              <div key={stepLabel} className="flex-1 flex flex-col items-center">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    done
                                      ? "bg-black text-white"
                                      : "bg-gray-200 text-gray-400"
                                  } ${active ? "ring-2 ring-black ring-offset-2" : ""}`}
                                >
                                  {done ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <span>{idx + 1}</span>
                                  )}
                                </div>
                                <p className={`text-[10px] mt-1 text-center ${done ? "text-black font-medium" : "text-gray-400"}`}>
                                  {stepLabel}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                        {/* Connector line */}
                        <div className="relative h-1 bg-gray-200 rounded-full mt-1 mx-3">
                          <div
                            className="absolute left-0 top-0 h-1 bg-black rounded-full transition-all"
                            style={{ width: `${Math.max(0, statusCfg.step) / (STEPS.length - 1) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tracking number */}
                    {order.tracking_info && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">หมายเลขติดตามสินค้า</p>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                          </svg>
                          <span className="font-mono text-sm font-semibold text-gray-800 flex-1">{order.tracking_info}</span>
                          <button
                            onClick={() => handleCopy(order.tracking_info!, order.id)}
                            className="text-xs px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-1.5 shrink-0"
                          >
                            {copiedId === order.id ? (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                คัดลอกแล้ว
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                คัดลอก
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Items list */}
                    {(order as any).items && (order as any).items.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">รายการสินค้า</p>
                        <div className="space-y-2">
                          {(order as any).items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center text-sm bg-white rounded-lg px-3 py-2 border border-gray-100">
                              <div>
                                <p className="font-medium text-gray-800">{item.product?.ProductName ?? "สินค้า"}</p>
                                <p className="text-xs text-gray-400">SKU: {item.selected_sku} × {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-gray-800">
                                ฿{Number(item.price_at_purchase ?? 0).toLocaleString("th-TH")}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Return request button — only for Delivered + payment confirmed */}
                    {order.order_status === "Delivered" &&
                      order.payment_status === "confirmed" && (
                        <div className="pt-1 border-t border-gray-200">
                          {returnedOrderIds.has(order.id) ? (
                            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-4 py-2.5 rounded-xl">
                              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              ส่งคำขอคืนสินค้าเรียบร้อยแล้ว ทีมงานจะติดต่อกลับ
                            </div>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); setReturnModalOrderId(order.id); }}
                              className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-xl py-2.5 hover:border-gray-400 hover:bg-gray-50 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 6a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              ขอคืน / เปลี่ยนสินค้า
                            </button>
                          )}
                        </div>
                      )}

                    {/* Total */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-500">ยอดรวม</p>
                      <p className="text-base font-bold text-gray-900">
                        {order.total_summary ? formatPrice(order.total_summary) : "—"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 font-light text-center py-10">
            {t("account.noOrders")}
          </p>
        )}
      </div>

      {/* Return Request Modal */}
      {returnModalOrderId !== null && (() => {
        const order = orders.find((o) => o.id === returnModalOrderId);
        if (!order) return null;
        const items = (order as any).items ?? [];
        return (
          <ReturnRequestModal
            orderId={order.id}
            documentId={order.documentId}
            orderItems={items}
            onClose={() => setReturnModalOrderId(null)}
            onSuccess={() => {
              setReturnedOrderIds((prev) => new Set(prev).add(returnModalOrderId));
              setReturnModalOrderId(null);
            }}
          />
        );
      })()}
    </div>
  );
}
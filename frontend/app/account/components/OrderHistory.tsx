"use client";

import { Transaction } from "@/types/types";
import { useLanguage } from "@/app/context/LanguageContext";

interface OrderHistoryProps {
  orders: Transaction[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const { locale, t } = useLanguage();

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="lg:col-span-2">
      <h2 className="text-xl text-gray-300 border-b border-gray-200 pb-3 mb-6">
        {t("account.orderHistory")} ({orders.length})
      </h2>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="border-b border-gray-100 pb-6 last:border-0"
            >
              <div className="flex justify-between items-baseline mb-1">
                <p className="text-lg font-normal">
                  {t("account.orderNumber")} #{order.id}
                </p>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${getStatusColor(
                    order.order_status
                  )}`}
                >
                  {order.order_status || t("account.pending")}
                </span>
              </div>

              <p className="text-gray-500 text-sm">
                {t("account.date")}: {formatDate(order.createdAt)} | {t("account.total")}:{" "}
                {order.total_summary
                  ? order.total_summary.toLocaleString()
                  : "-"}{" "}
                {t("account.baht")}
                {order.tracking_info && ` | Tracking: ${order.tracking_info}`}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 font-light text-center py-10">
            {t("account.noOrders")}
          </p>
        )}
      </div>
    </div>
  );
}
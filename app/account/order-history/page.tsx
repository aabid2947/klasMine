"use client";

import { useAuthStore } from "@/app/store/useAuthStore";
import { postRequest } from "@/app/utils/api";
import { useEffect, useState } from "react";
import OrderCard, { Order } from "@/app/account/order/OrderCard";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const payload = {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: user.user_id,
        sess_id: user.sess_id,
        page: "1",
      };

      const res = await postRequest("/billing/my-order-history", payload);

      if (res.success && res.data?.my_billings) {
        const mappedOrders: Order[] = res.data.my_billings.map(
          (billing: any, idx: number) => ({
            id: `order-${idx + 1}`,
            title: billing.subscription_plan_title,
            size: `${billing.billing_start_date} → ${billing.billing_end_date}`,
            total: parseFloat(billing.billing_amount),
            date: billing.billing_start_date,
            status: billing.status_text,
            image: "/assets/images/order-img.png", // static placeholder
          })
        );
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to see your order history</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading order history...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-6 sm:py-10 px-4">
      <div>
        <h1 className="font-medium text-[#333333] text-[28px] sm:text-[36px] md:text-[44px] mb-2">
          My Order History
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Recent Orders</p>
        <div className="space-y-3 sm:space-y-4">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <OrderCard key={index} order={order} />
            ))
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">No orders found.</p>
          )}
        </div>
      </div>
    </main>
  );
}

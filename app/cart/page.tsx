"use client";

import React, { useEffect, useState } from "react";
import { postRequest } from "@/app/utils/api";
import { useAuthStore } from "@/app/store/useAuthStore";
import OrderSummary from "../components/OrderSummary";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
interface CartItem {
  cart_id: string;
  item_name: string;
  item_quantity: string;
  item_price: string;
  item_description: string;
  total_price: string;
  image_url: string;
  currency_symbol: string;
  article_category_name: string;
  post_id?: string; // Add optional post_id field
}

interface CartResponse {
  cart_items: CartItem[];
  total_items: number;
  item_total: string;
  delivery_charge: string;
  discount: string;
  currency_symbol: string;
}
const cart = () => {
  const user = useAuthStore((s) => s.user);
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState<CartResponse | null>(null);

  // 🔹 Fetch cart data
  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    const body = {
      device: "android",
      app_version: "1.0.5",
      latitude: "28.6139",
      longitude: "77.2090",
      user_id: user.user_id,
      sess_id: user.sess_id,
    };
    try {
      const res = await postRequest("/cart", body, true); // Add withToken: true
      console.log("Cart API Response:", res);
      
      // Check if redirect is true - session expired
      if (res?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }
      
      if (res?.success && res?.data) {
        console.log("Cart Items:", res.data.cart_items);
        console.log("First cart item structure:", res.data.cart_items[0]);
        setCartData(res.data);
      } else {
        console.log("Cart fetch failed or empty:", res);
        setCartData({
          cart_items: [],
          total_items: 0,
          item_total: "0.00",
          delivery_charge: "0.00",
          discount: "0.00",
          currency_symbol: "₹",
        });
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Remove single cart item
  const handleRemoveItem = async (cart_id: string, post_id?: string) => {
    if (!user) return;
    setLoading(true);
    
    const body = {
      device: "android",
      app_version: "1.0.5",
      latitude: "28.6139",
      longitude: "77.2090",
      user_id: user.user_id,
      sess_id: user.sess_id,
      post_id: cart_id , // Use post_id if available, fallback to cart_id as both might be the same
      cart_id:cart_id
    };
    
    console.log("Remove item request body:", body);
    console.log("Available post_id:", post_id, "cart_id:", cart_id);
    
    try {
      const res = await postRequest("/cart/remove", body, true); // Add withToken: true
      console.log("Remove item API response:", res);
      
      // Check if redirect is true - session expired
      if (res?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }
      
      if (res?.success) {
        toast.success("Item removed from cart successfully!");
        await fetchCart(); // Refresh cart after removal
      } else {
        console.error("Remove item failed:", res);
        const errorMsg = res?.message || res?.error || "❌ Failed to remove item from cart";
        toast.error(errorMsg);
        
        // If the error is about missing post_id, let's try a different approach
        if (errorMsg.toLowerCase().includes('post_id') || errorMsg.toLowerCase().includes('item id')) {
          console.warn("API requires post_id. Current payload:", body);
          toast.error("Unable to remove item: missing product ID. Please refresh the page and try again.");
        }
      }
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Empty the entire cart
  const handleEmptyCart = async () => {
    if (!user) return;
    setLoading(true);
    const body = {
      device: "android",
      app_version: "1.0.5",
      latitude: "28.6139",
      longitude: "77.2090",
      user_id: user.user_id,
      sess_id: user.sess_id,
    };
    try {
      const res = await postRequest("/cart/empty", body, true); // Add withToken: true
      
      // Check if redirect is true - session expired
      if (res?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }
      
      if (res?.success) {
        toast.success("Cart cleared successfully!");
        setCartData({
          cart_items: [],
          total_items: 0,
          item_total: "0.00",
          delivery_charge: "0.00",
          discount: "0.00",
          currency_symbol: "₹",
        });
      } else {
        console.error("Empty cart failed:", res);
        toast.error(res?.message || "Failed to clear cart");
      }
    } catch (err) {
      console.error("Error emptying cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (!user) {
    router.push('/')
  }
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="mx-auto pr-0">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Cart Section */}
        <div className="flex-1 px-4 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Cart{" "}
              <span className="text-xs sm:text-sm font-normal text-gray-500">
                ({cartData?.total_items ?? 0} items)
              </span>
            </h2>
            <button 
              onClick={handleEmptyCart}
              disabled={loading || !cartData?.cart_items?.length}
              className="flex items-center gap-1 text-red-600 border border-red-300 px-3 sm:px-4 py-2 rounded-md shadow-sm hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
            >
              <img
                className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]"
                src="assets/images/icon/empty.png"
                alt="Empty Cart"
              />{" "}
              {loading ? "Clearing..." : "Empty cart"}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-sm sm:text-base">Loading cart...</div>
          ) : cartData?.cart_items?.length ? (
            cartData.cart_items.map((item) => (
              <div
                key={item.cart_id}
                className="flex flex-col sm:flex-row items-start bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 shadow-sm relative"
              >
                <img
                  src={item.image_url || "/assets/images/order-img.png"}
                  alt={item.item_name || "Product"}
                  className="w-full sm:w-[150px] md:w-[200px] h-[200px] sm:h-[100px] md:h-[128px] object-cover rounded-lg mb-3 sm:mb-0"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/images/order-img.png";
                  }}
                />
                <div className="sm:ml-3 md:ml-4 flex-1 w-full sm:pr-12">
                  <h3 className="text-base sm:text-lg font-medium mb-1">
                    {item.item_name || "Product Title"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 line-clamp-2">
                    {item.item_description || "No description available"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    Category: {item.article_category_name} • Qty: {item.item_quantity}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2">
                    <p className="text-green-600 font-semibold text-base sm:text-lg">
                      {item.currency_symbol}{item.item_price}{" "}
                      <span className="text-gray-400 text-xs sm:text-sm font-normal">
                        (each)
                      </span>
                    </p>
                    {parseInt(item.item_quantity) > 1 && (
                      <p className="text-gray-600 font-medium text-sm sm:text-base">
                        Total: {item.currency_symbol}{item.total_price}
                      </p>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    (inclusive of taxes)
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.cart_id, item.post_id)}
                  disabled={loading}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 text-red-400 hover:text-red-600 text-lg bg-red-100 p-2 sm:p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img
                    className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]"
                    src="/assets/images/icon/empty.png"
                    alt="Remove Item"
                  />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 text-sm sm:text-base">
              Your cart is empty.
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="w-full lg:w-[588px]">
          <OrderSummary 
            cartData={cartData} 
            loading={loading} 
            onPaymentSuccess={fetchCart}
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default cart;

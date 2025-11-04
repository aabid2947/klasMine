"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { postRequest } from "../utils/api";
import { toast } from "react-toastify";

// Declare Razorpay type for window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CartResponse {
  cart_items: any[];
  total_items: number;
  item_total: string;
  delivery_charge: string;
  discount: string;
  currency_symbol: string;
}

interface OrderSummaryProps {
  cartData?: CartResponse | null;
  loading?: boolean;
  onPaymentSuccess?: () => void; // Add callback for payment success
}

export default function OrderSummary({ cartData, loading = false, onPaymentSuccess }: OrderSummaryProps) {
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [showModal, setShowModal] = useState(false);
  const [autoAddress, setAutoAddress] = useState("");
  const [savedAddress, setSavedAddress] = useState("");
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address?.address_line_1 || "",
    city: user?.address?.city || "",
    state: user?.address?.state_code || "",
    pin: user?.address?.zip || "",
  });

  // Set initial address display from user data
  useEffect(() => {
    if (user?.address?.address_line_1) {
      const userAddress = `${user.address.address_line_1}, ${user.address.city || ""}, ${user.address.state_code || ""} - ${user.address.zip || ""}`;
      setSavedAddress(userAddress);
    }
  }, [user]);

  // Update form data when user data changes
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address?.address_line_1 || "",
      city: user?.address?.city || "",
      state: user?.address?.state_code || "",
      pin: user?.address?.zip || "",
    });
  }, [user]);

  useEffect(() => {
    if (showModal) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const { road, city, state, postcode, country } = data.address;
            setAutoAddress(
              `${road || ""}, ${city || ""}, ${state || ""} - ${postcode || ""}, ${country || ""}`
            );
          } catch {
            setAutoAddress("Unable to fetch location.");
          }
        },
        () => setAutoAddress("Location access denied.")
      );
    }
  }, [showModal]);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  const handleSaveAddress = async () => {
    if (!user) {
      toast.error("Please login to save address");
      return;
    }

    const { name, phone, address, city, state, pin } = formData;
    
    // Validate all fields are filled
    if (!address.trim() || !city.trim() || !pin.trim() || !state.trim()) {
      toast.error("All address fields are required.");
      return;
    }

    try {
      setIsAddressLoading(true);
      
      const updated = await postRequest("/account/update-address", {
        user_id: user.user_id,
        sess_id: user.sess_id,
        address_line_1: address,
        city,
        zip: pin,
        state_code: state,
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
      });

      if (updated?.error) {
        toast.error(updated.message || "Failed to update address");
        return;
      }

      // Update user state with new address
      setAuth({
        ...user,
        address: {
          ...user.address,
          address_line_1: address,
          city,
          zip: pin,
          state_code: state,
        },
      });

      const fullAddress = `${address}, ${city}, ${state} - ${pin}`;
      setSavedAddress(fullAddress);
      setShowModal(false);
      toast.success("Address saved successfully!");
      
    } catch (err: any) {
      toast.error(err.message || "Failed to save address");
    } finally {
      setIsAddressLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cartData) return "0.00";
    
    const itemTotal = parseFloat(cartData.item_total || "0");
    const deliveryCharge = parseFloat(cartData.delivery_charge || "0");
    const discount = parseFloat(cartData.discount || "0");
    
    const total = itemTotal + deliveryCharge - discount;
    return total.toFixed(2);
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Process payment - using OLD METHOD (postRequest from api.ts)
  const processPayment = async () => {
    if (!user) {
      toast.error("Please login to proceed with payment");
      return;
    }

    if (!savedAddress) {
      toast.error("Please add delivery address to proceed");
      return;
    }

    const totalAmount = calculateTotal();

    try {
      setIsPaymentLoading(true);
      
      const body = {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: user.user_id,
        sess_id: user.sess_id,
        total_amount: totalAmount
      };

      // OLD METHOD: Direct call using postRequest from api.ts
      const responseData = await postRequest("/payment/process", body, true);
      console.log("Payment process response:", responseData);
      
      if (responseData?.success && responseData?.data) {
        const { response: orderData, public_key, rzamount } = responseData.data;
        console.log("Order data:", orderData);
        console.log("Public key:", public_key);
        
        await initiateRazorpayPayment(orderData, public_key, totalAmount, rzamount);
      } else {
        throw new Error(responseData?.message || "Failed to process payment");
      }
    } catch (error: any) {
      console.error("Payment processing error:", error);
      toast.error(error.message || "Failed to process payment");
      setIsPaymentLoading(false);
    }
  };

  // Initiate Razorpay payment
  const initiateRazorpayPayment = async (orderData: any, publicKey: string, amount: string, rzamount: string) => {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway");
      setIsPaymentLoading(false);
      return;
    }

    var dAmount = orderData.amount * 100;
    const options = {
      key: publicKey,
      amount: dAmount, // Amount in paise
      currency: orderData.currency,
      netbanking: true,
      name: "KlassArt",
      description: "Payment for your order",
      order_id: orderData.id,
      handler: async (response: any) => {
        console.log("=== Razorpay Payment Response ===");
        console.log("Full Payment Response:", response);
        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID:", response.razorpay_order_id);
        console.log("Signature:", response.razorpay_signature);
        console.log("================================");
        await validatePayment(response, amount);
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || ""
      },
      theme: {
        color: "#8B5CF6" // Purple theme
      },
      modal: {
        ondismiss: () => {
          console.log("Payment modal dismissed");
          setIsPaymentLoading(false);
          toast.info("Payment cancelled by user");
        }
      }
    };

    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
 
  // Validate payment - using OLD METHOD (postRequest from api.ts)
  const validatePayment = async (paymentResponse: any, totalAmount: string) => {
    if (!user) {
      toast.error("User session expired");
      setIsPaymentLoading(false);
      return;
    }

    try {
      const body = {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: user.user_id,
        sess_id: user.sess_id,
        total_amount: totalAmount,
        razorpay_payment_id: paymentResponse.razorpay_payment_id || "",
        razorpay_order_id: paymentResponse.razorpay_order_id || "",
        razorpay_signature: paymentResponse.razorpay_signature || ""
      };
      console.log(body)

      // OLD METHOD: Direct call using postRequest from api.ts
      const responseData = await postRequest("/payment/validate", body, true);
      console.log("Payment validation response:", responseData);
      
      if (responseData?.success) {
        toast.success("Payment successful! Your order has been placed.");
        
        // Call the cart refresh callback if provided
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        
        // Optionally redirect to order confirmation page
        setTimeout(() => {
          window.location.href = "/account/order-history";
        }, 2000);
      } else {
        throw new Error(responseData?.message || "Payment validation failed");
      }
    } catch (error: any) {
      console.error("Payment validation error:", error);
      toast.error(error.message || "Payment validation failed");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <>
      {/* Payment Loading Overlay */}
      {isPaymentLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Processing Payment...</p>
            <p className="text-gray-500 text-sm mt-2">Please don't close this window</p>
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-gray-100 flex pt-20 justify-center px-20">
        <div className="max-w-md w-full p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm">Loading cart...</p>
            </div>
          )}

          {!loading && (!cartData || cartData.total_items === 0) && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Your cart is empty</p>
              <p className="text-gray-400 text-xs mt-2">Add items to see order summary</p>
            </div>
          )}

          {!loading && cartData && cartData.total_items > 0 && (
            <>

          <div className="border-t border-b border-gray-300 text-sm text-gray-600">
            <div className="flex justify-between py-3">
              <span>Item Total ({cartData?.total_items || 0} items)</span>
              <span className="font-medium text-gray-800">
                {cartData?.currency_symbol || '₹'}{cartData?.item_total || '0.00'}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span>Delivery Charge</span>
              <span className="font-medium text-gray-800">
                {cartData?.currency_symbol || '₹'}{cartData?.delivery_charge || '0.00'}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span>Discount</span>
              <span className="font-medium text-green-600">
                {cartData?.discount && parseFloat(cartData.discount) > 0 
                  ? `-${cartData.currency_symbol}${cartData.discount}` 
                  : `${cartData?.currency_symbol || '₹'}0.00`}
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-4 text-base font-semibold text-gray-800">
            <span>Total Pay</span>
            <span>{cartData?.currency_symbol || '₹'}{calculateTotal()}</span>
          </div>

          {cartData?.discount && parseFloat(cartData.discount) > 0 && (
            <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 text-sm font-medium text-center">
                🎉 You saved {cartData.currency_symbol}{cartData.discount}!
              </p>
            </div>
          )}

          <div className="flex flex-col items-center mt-10">
            <img src="assets/images/icon/cart-map.svg" alt="map" />
            <p className="mt-3 text-gray-700 text-sm mb-6 text-center">
              {savedAddress || "Enter your delivery address"}
            </p>
            
            {!user ? (
              <div className="text-center">
                <p className="text-red-500 text-sm mb-4">Please login to proceed with checkout</p>
                <button
                  disabled
                  className="bg-gray-400 text-white px-8 py-4 rounded-lg shadow-lg text-[18px] font-medium cursor-not-allowed"
                >
                  Login Required
                </button>
              </div>
            ) : savedAddress ? (
              <>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 text-blue-600 hover:underline text-sm"
                >
                  ✏️ Edit Address
                </button>
                <button
                  onClick={processPayment}
                  disabled={isPaymentLoading || !savedAddress}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg shadow-lg text-[18px] font-medium hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPaymentLoading ? "Processing..." : "Continue to Payment"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                disabled={isPaymentLoading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg shadow-lg text-[18px] font-medium hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPaymentLoading ? "Processing..." : "Add address to Proceed"}
              </button>
            )}
          </div>
          </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-xl relative">
            <h3 className="text-xl font-semibold mb-3">Add Delivery Address</h3>
            <p className="text-sm text-gray-600 mb-4">
              Auto Detected: <span className="font-medium">{autoAddress}</span>
            </p>

            <div className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border border-gray-300 p-2 rounded"
                disabled={isAddressLoading}
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border border-gray-300 p-2 rounded"
                disabled={isAddressLoading}
              />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full Address"
                className="w-full border border-gray-300 p-2 rounded"
                disabled={isAddressLoading}
              ></textarea>
              <div className="flex gap-3">
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full border border-gray-300 p-2 rounded"
                  disabled={isAddressLoading}
                />
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State Code"
                  className="w-full border border-gray-300 p-2 rounded"
                  disabled={isAddressLoading}
                />
              </div>
              <input
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                placeholder="PIN Code"
                className="w-full border border-gray-300 p-2 rounded"
                disabled={isAddressLoading}
              />
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={isAddressLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                disabled={
                  isAddressLoading ||
                  !formData.address.trim() ||
                  !formData.city.trim() ||
                  !formData.pin.trim() ||
                  !formData.state.trim()
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddressLoading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

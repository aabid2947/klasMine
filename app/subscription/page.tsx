"use client";

import React, { useEffect, useState } from 'react';
import { postRequest } from '@/app/utils/api';
import { useAuthStore } from '@/app/store/useAuthStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
interface SubscriptionPlan {
  subscription_plan_id: string;
  title: string;
  subscription_fee: string;
  subscription_time: string;
  subscription_time_unit: string;
  free_trial_days: string;
  status: string;
  is_deleted: string;
  modified: string;
  created: string;
  is_can_post: string;
}

interface BillingResponse {
  total_amount: string;
  subscription_plans: SubscriptionPlan[];
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface SaveBillingResponse {
  response: {
    amount: number;
    amount_due: number;
    amount_paid: number;
    attempts: number;
    created_at: number;
    currency: string;
    entity: string;
    id: string;
    notes: any[];
    offer_id: string | null;
    receipt: string;
    status: string;
  };
  public_key: string;
  subscription_plan_id: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPage() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const router = useRouter()
  // Fetch subscription plans
  const fetchSubscriptionPlans = async () => {
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
      // Use our Next.js API route instead of direct external API call
      const response = await fetch("/api/billing/start-billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      const res = await response.json();
      console.log("Billing API Response:", res);
      
      if (res?.success && res?.data) {
        setSubscriptionPlans(res.data.subscription_plans || []);
      } else {
        console.error("Failed to fetch subscription plans:", res);
        toast.error("Failed to load subscription plans");
      }
    } catch (err) {
      console.error("Error fetching subscription plans:", err);
      toast.error("Error loading subscription plans");
    } finally {
      setLoading(false);
    }
  };

  // Process subscription payment
  const processSubscriptionPayment = async (planId: string) => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }

    setPaymentProcessing(true);
    setSelectedPlan(planId);

    const body = {
      device: "android",
      app_version: "1.0.5",
      latitude: "28.6139",
      longitude: "77.2090",
      user_id: user.user_id,
      sess_id: user.sess_id,
      subscription_plan_id: planId,
    };

    try {
      console.log("Calling save-start-billing API...");
      // Use our Next.js API route instead of direct external API call
      const response = await fetch("/api/billing/save-start-billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      const responseData = await response.json();
      console.log("Save-start-billing API Response:", responseData);

      if (responseData?.success && responseData?.data) {
        const { response: razorpayOrder, public_key, subscription_plan_id } = responseData.data as SaveBillingResponse;
        
        console.log("Razorpay Order:", razorpayOrder);
        console.log("Public Key:", public_key);

        // Initialize Razorpay payment
        await initializeRazorpayPayment(razorpayOrder, public_key, subscription_plan_id);
      } else {
        console.error("Failed to create subscription order:", responseData);
        toast.error(responseData?.message || "Failed to create subscription order");
      }
    } catch (error) {
      console.error("Error processing subscription:", error);
      toast.error("Error processing subscription. Please try again.");
    } finally {
      setPaymentProcessing(false);
      setSelectedPlan(null);
    }
  };

  // Initialize Razorpay payment
  const initializeRazorpayPayment = async (razorpayOrder: any, publicKey: string, subscriptionPlanId: string) => {
    return new Promise((resolve, reject) => {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          initRazorpay();
        };
        script.onerror = () => {
          toast.error("Failed to load payment gateway");
          reject("Failed to load Razorpay");
        };
        document.body.appendChild(script);
      } else {
        initRazorpay();
      }

      function initRazorpay() {
        const options = {
          key: publicKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "KlassArt Subscription",
          description: "Subscription Payment",
          order_id: razorpayOrder.id,
          handler: async function (response: RazorpayResponse) {
            console.log("Razorpay Success Response:", response);
            await validateSubscriptionPayment(response, subscriptionPlanId);
            resolve(response);
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.phone || "",
          },
          theme: {
            color: "#5555FF",
          },
          modal: {
            ondismiss: function () {
              console.log("Razorpay modal dismissed");
              toast.info("Payment cancelled");
              reject("Payment cancelled");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    });
  };

  // Validate subscription payment
  const validateSubscriptionPayment = async (razorpayResponse: RazorpayResponse, subscriptionPlanId: string) => {
    if (!user) return;

    const body = {
      device: "android",
      app_version: "1.0.5",
      latitude: "28.6139",
      longitude: "77.2090",
      user_id: user.user_id,
      sess_id: user.sess_id,
      subscription_plan_id: subscriptionPlanId,
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };

    try {
      console.log("Validating subscription payment...");
      // Use our Next.js API route instead of direct external API call
      const response = await fetch("/api/billing/start-billing-callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      const responseData = await response.json();
      console.log("Validation API Response:", responseData);

      if (responseData?.success) {
        toast.success("Subscription activated successfully!");
        // Optionally refresh the page or redirect
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error("Payment validation failed:", responseData);
        toast.error(responseData?.message || "Payment validation failed. Please contact support.");
      }
    } catch (error) {
      console.error("Error validating payment:", error);
      toast.error("Error validating payment. Please contact support.");
    }
  };

  // Handle subscription selection
  const handleSubscribe = async (planId: string) => {
    await processSubscriptionPayment(planId);
  };

  useEffect(() => {
    fetchSubscriptionPlans();
  }, [user]);

  if (!user) {
    toast.error("Please login to subscribe");
    router.push('/')
    return (
      <div className="h-full flex items-center justify-center w-full py-20">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full" />
        <span className="ml-4 text-gray-600">Loading user…</span>
      </div>
    );
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
      <section className="bg-gray-50 py-6 sm:py-12 px-4 md:px-10 text-gray-900">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Experience AI Without Limits</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Go beyond basic AI tools with our subscription plans for high-quality image generation and customization
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 sm:py-20">
            <div className="animate-spin h-10 w-10 sm:h-12 sm:w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
            <span className="ml-4 text-gray-600 text-sm sm:text-base">Loading subscription plans...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {/* Free Plan - Static */}
            <div className="bg-white rounded-2xl shadow p-6 sm:p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex mb-4">
                  <div className="pricing-icon mr-3 sm:mr-4 flex-shrink-0">
                    <img src="/assets/images/icon/pricing-icon01.svg" alt="Free Plan" className="w-12 h-12 sm:w-16 sm:h-16" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-indigo-600 mb-1">Free Plan</h3>
                    <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Basic Access</h4>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-500 mb-4">Best for: Casual users who want to try AI-generated images with basic features.</p>
                <p className="text-2xl sm:text-3xl md:text-[40px] lg:text-[54px] font-bold mb-2 text-[#5555FF]">₹0.00 <span className="text-sm sm:text-base font-normal text-[#8C8B99]">/monthly</span></p>

                <ul className="mt-4 space-y-3 sm:space-y-4 text-sm">
                  <li className="flex items-start sm:items-center text-[14px] sm:text-[15px] md:text-[17px] text-black"><span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full p-2 mr-2 flex-shrink-0"><img src="/assets/images/icon/Check.png" alt="Check" /></span><span>Limited AI image generations</span></li>
                  <li className="flex items-start sm:items-center text-[14px] sm:text-[15px] md:text-[17px] text-black"><span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full p-2 mr-2 flex-shrink-0"><img src="/assets/images/icon/Check.png" alt="Check" /></span><span>Watermarked images</span></li>
                  <li className="flex items-start sm:items-center text-[14px] sm:text-[15px] md:text-[17px] text-black"><span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full p-2 mr-2 flex-shrink-0"><img src="/assets/images/icon/Check.png" alt="Check" /></span><span>Basic resolution output</span></li>
                  <li className="flex items-start sm:items-center text-[14px] sm:text-[15px] md:text-[17px] text-black"><span className="bg-gradient-to-r from-[#C289FF] to-[#5555FF] w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full p-2 mr-2 flex-shrink-0"><img src="/assets/images/icon/Check.png" alt="Check" /></span><span>Limited text extraction</span></li>
                </ul>
              </div>

              <button className="mt-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl py-2 sm:py-3 w-full font-medium text-sm sm:text-base hover:opacity-90 transition">
                Start for Free
              </button>
            </div>

            {/* Dynamic Subscription Plans from API */}
            {subscriptionPlans.map((plan, index) => (
              <div 
                key={plan.subscription_plan_id}
                className={`rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl relative ${
                  index === 0 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white 2xl-scale-105 top-[0px] 2xl:top-[-13px]' 
                    : 'bg-white text-gray-900 flex flex-col justify-between'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex mb-4">
                      <div className="pricing-icon mr-3 sm:mr-4 flex-shrink-0">
                        <img 
                          src={index === 0 ? "/assets/images/icon/pricing-icon02.svg" : "/assets/images/icon/pricing-icon01.svg"} 
                          alt={plan.title}
                          className="w-12 h-12 sm:w-16 sm:h-16"
                        />
                      </div>
                      <div>
                        <h3 className={`text-base sm:text-lg font-semibold mb-1 ${index === 0 ? 'text-white' : 'text-indigo-600'}`}>
                          {plan.title}
                        </h3>
                        <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                          {index === 0 ? 'Most Popular' : 'Professional Plan'}
                        </h4>
                      </div>
                    </div>
                    {index === 0 && (
                      <span className="bg-white text-purple-600 text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">Popular</span>
                    )}
                  </div>
                  
                  <p className={`text-xs sm:text-sm mb-4 ${index === 0 ? 'text-white' : 'text-gray-500'}`}>
                    {plan.free_trial_days !== "0" 
                      ? `Includes ${plan.free_trial_days} days free trial` 
                      : index === 0 
                        ? 'Content creators, designers, and users who need more flexibility.' 
                        : 'Best for: Businesses, agencies, and professionals who need AI without limits.'
                    }
                  </p>
                  
                  <p className={`text-2xl sm:text-3xl md:text-[40px] lg:text-[54px] font-bold mb-2 ${index === 0 ? 'text-white' : 'text-[#5555FF]'}`}>
                    ₹{parseFloat(plan.subscription_fee).toFixed(0)} 
                    <span className={`text-sm sm:text-base font-normal ${index === 0 ? 'text-white' : 'text-[#8C8B99]'}`}>
                      /{plan.subscription_time} {plan.subscription_time_unit}
                    </span>
                  </p>

                  <ul className="mt-4 space-y-3 sm:space-y-4 text-sm">
                    <li className={`flex items-start sm:items-center text-[14px] sm:text-[15px] md:text-[17px] ${index === 0 ? 'text-white' : 'text-black'}`}>
                      <span className={`${index === 0 ? 'bg-white' : 'bg-gradient-to-r from-[#C289FF] to-[#5555FF]'} w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full p-2 mr-2 flex-shrink-0`}>
                        <img 
                          src={index === 0 ? "/assets/images/icon/blue-Check.png" : "/assets/images/icon/Check.png"} 
                          alt="Check" 
                        />
                      </span>
                      <span>{plan.is_can_post === "1" ? "Can create and post content" : "View only access"}</span>
                    </li>
                    <li className={`flex items-start sm:items-center text-[14px] sm:text-[15px] md:text-[17px] ${index === 0 ? 'text-white' : 'text-black'}`}>
                      <span className={`${index === 0 ? 'bg-white' : 'bg-gradient-to-r from-[#C289FF] to-[#5555FF]'} w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full p-2 mr-2 flex-shrink-0`}>
                        <img 
                          src={index === 0 ? "/assets/images/icon/blue-Check.png" : "/assets/images/icon/Check.png"} 
                          alt="Check" 
                        />
                      </span>
                      <span>{index === 0 ? "High-resolution images" : "Ultra HD & 4K resolution outputs"}</span>
                    </li>
                    <li className={`flex items-start sm:items-center text-[14px] sm:text-[15px] md:text-[17px] ${index === 0 ? 'text-white' : 'text-black'}`}>
                      <span className={`${index === 0 ? 'bg-white' : 'bg-gradient-to-r from-[#C289FF] to-[#5555FF]'} w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full p-2 mr-2 flex-shrink-0`}>
                        <img 
                          src={index === 0 ? "/assets/images/icon/blue-Check.png" : "/assets/images/icon/Check.png"} 
                          alt="Check" 
                        />
                      </span>
                      <span>{index === 0 ? "No watermark on generated images" : "No limits – full commercial rights"}</span>
                    </li>
                    <li className={`flex items-start sm:items-center text-[14px] sm:text-[15px] md:text-[17px] ${index === 0 ? 'text-white' : 'text-black'}`}>
                      <span className={`${index === 0 ? 'bg-white' : 'bg-gradient-to-r from-[#C289FF] to-[#5555FF]'} w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full p-2 mr-2 flex-shrink-0`}>
                        <img 
                          src={index === 0 ? "/assets/images/icon/blue-Check.png" : "/assets/images/icon/Check.png"} 
                          alt="Check" 
                        />
                      </span>
                      <span>{index === 0 ? "Access to multiple styles" : "Enhanced product placement"}</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(plan.subscription_plan_id)}
                  disabled={loading || selectedPlan === plan.subscription_plan_id}
                  className={`mt-6 rounded-xl py-2 sm:py-3 w-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
                    index === 0 
                      ? 'bg-white text-indigo-600 hover:bg-gray-100' 
                      : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90'
                  }`}
                >
                  {selectedPlan === plan.subscription_plan_id ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

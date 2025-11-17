"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { postRequest } from "@/app/utils/api";

interface Include {
  include_id: string;
  discription: string;
  slug: string | null;
}

interface SubscriptionPlan {
  subscription_plan_id: string;
  title: string;
  sub_title: string;
  description: string;
  subscription_fee: string;
  subscription_time: string;
  subscription_time_unit: string;
  free_trial_days: string;
  total_image: string;
  image: string;
  is_popular: string;
  status: string;
  is_deleted: string;
  modified: string;
  created: string;
  is_can_post: string;
  includes: Include[];
}

export const PricingSection = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handlePlanClick = (planId?: string) => {
    router.push('/subscription');
  };

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await postRequest('/billing/start-billing', {
          device: "android",
          app_version: "1.0.5",
          latitude: "28.6139",
          longitude: "77.2090"
        });

        if (response.success) {
          setPlans(response.data.subscription_plans);
        }
      } catch (error) {
        console.error('Error fetching pricing data:', error);
        // Keep existing static data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  // Free plan as static since it's not in API
  const freePlan = {
    title: "Free Plan",
    sub_title: "Basic Access",
    description: "Best for casual users who want to try AI-generated images with basic features.",
    subscription_fee: "0.00",
    includes: [
      { discription: "Limited AI image generations" },
      { discription: "Watermarked images" },
      { discription: "Basic resolution output" },
      { discription: "Limited text extraction" }
    ],
    image: "/assets/images/icon/pricing-icon01.svg",
    is_popular: "0"
  };

  const renderPricingCard = (plan: any, index: number, isMiddle: boolean = false) => {
    const isPopular = plan.is_popular === "1";
    
    return (
      <motion.div
        key={plan.subscription_plan_id || index}
        initial={{ opacity: 0, scale: 0.28 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className={`${
          isPopular
            ? "md:transform md:-translate-y-12 bg-[linear-gradient(-120deg,_#5555FF,_#C289FF)] hover:bg-[linear-gradient(-90deg,_#C289FF,_#5555FF)] text-white"
            : "bg-white"
        } shadow-lg rounded-3xl p-8 py-12`}
      >
        <div className="flex gap-2 relative">
          <img 
            className="w-16 h-16 object-cover rounded" 
            src={plan.image?.includes('http') ? plan.image : `/assets/images/icon/pricing-icon0${index + 1}.svg`}
            alt={plan.title}
          />
          <div className="">
            <p className={`font-openSans text-[18px] font-[400] ${
              isPopular ? "text-white" : "text-[#6F6C90]"
            }`}>
              {plan.title}
            </p>
            <p className={`font-openSans text-2xl font-bold ${
              isPopular ? "text-white" : "text-gray-900"
            }`}>
              {plan.sub_title}
            </p>
          </div>
          {isPopular && (
            <div className="absolute px-8 py-2 bg-white/20 right-0 -top-5 rounded-lg">
              Popular
            </div>
          )}
        </div>
        <p className={`text-sm my-6 font-openSans leading-[26px] ${
          isPopular ? "text-gray-200" : "text-gray-500"
        }`}>
          {plan.description}
        </p>
        <p className={`font-openSans text-6xl font-black mt-4 ${
          isPopular ? "text-white" : "text-[#5555FF]"
        }`}>
          <span>
            <span className="font-dmSans">₹</span> {plan.subscription_fee}{" "}
            <span className={`text-sm font-light ${
              isPopular ? "text-white" : "text-gray-500"
            }`}>
              /monthly
            </span>
          </span>
        </p>
        <p className={`font-bold font-openSans ${
          isPopular ? "text-white" : "text-black"
        }`}>
          What's included
        </p>
        <ul className={`mt-4 text-left space-y-2 font-openSans ${
          isPopular ? "text-white" : "text-gray-600"
        }`}>
          {plan.includes?.map((include: any, idx: number) => (
            <li key={idx} className="flex items-center text-sm my-3">
              <span className={`w-[32px] h-[32px] rounded-full p-2 mr-2 ${
                isPopular 
                  ? "bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF]" 
                  : "bg-gradient-to-r from-[#C289FF] to-[#5555FF]"
              }`}>
                <img 
                  alt="Check" 
                  src={isPopular 
                    ? "/assets/images/icon/blue-Check.png" 
                    : "/assets/images/icon/Check.png"
                  } 
                />
              </span>
              {include.discription}
            </li>
          ))}
        </ul>
        <div className="text-center">
          <button 
            onClick={() => handlePlanClick(plan.subscription_plan_id)}
            className={`font-openSans rounded-2xl cursor-pointer mt-6 w-[80%] py-4 transition-all duration-300 ${
              isPopular
                ? "bg-white text-purple-900 hover:shadow-2xl"
                : "bg-[linear-gradient(-120deg,_#5555FF,_#C289FF)] hover:bg-[linear-gradient(-90deg,_#C289FF,_#5555FF)] text-white"
            }`}>
            {plan.subscription_fee === "0.00" ? "Start for Free" : "Get started"}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="pt-[60px] pb-[60px] sm:pt-[90px] sm:pb-[90px] md:pt-[120px] md:pb-[120px] bg-gradient-to-b from-blue-50 to-purple-100 px-6 ">
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.28 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          <h3 className="font-openSans text-[18px] font-semibold text-blue-600 tracking-wide">
            PRICING PLANS
          </h3>
          <h2 className="font-openSans  text-3xl sm:text-4xl md:text-[66px] font-bold text-[#333333] mt-2">
            Experience AI Without Limits
          </h2>
          <p className="font-openSans   text-[16px] font-[400] text-[#6F6C90] mt-3 max-w-2xl mx-auto">
            Go beyond basic AI tools with our Pro and Premium plans for
            high-quality <br /> image generation and customization.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64 mt-24">
            <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-lg text-gray-600">Loading pricing plans...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto relative mt-24">
            {/* Arrange plans: Free, Popular in middle, Other */}
            {(() => {
              const popularPlan = plans.find(plan => plan.is_popular === "1");
              const otherPlan = plans.find(plan => plan.is_popular === "0");
              
              return (
                <>
                  {/* Free Plan - Left */}
                  {renderPricingCard(freePlan, 0)}
                  
                  {/* Popular Plan - Middle */}
                  {popularPlan && renderPricingCard(popularPlan, 2, true)}
                  
                  {/* Other Plan - Right */}
                  {otherPlan && renderPricingCard(otherPlan, 3, false)}
                </>
              );
            })()}
          </div>
        )}
      </>
    </section>
  );
};
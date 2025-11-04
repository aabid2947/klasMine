"use client";
import { useAuthStore } from "@/app/store/useAuthStore";
import { postRequest } from "@/app/utils/api";
import { useEffect, useState } from "react";

type Plan = {
  subscription_plan_id: string;
  title: string;
  subscription_fee: string;
};

type ActivePlan = {
  subscription_plan_id: string;
  title: string;
  subscription_fee: string;
};

export default function MyPlan() {
  const user = useAuthStore((state) => state.user);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
      </div>
    );
  }

  const fetchMyPlan = async () => {
    try {
      const payload = {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: user.user_id,
        sess_id: user.sess_id,
      };

      const res = await postRequest("/billing/my-plan", payload);
      if (res.success && res.data?.active_plan_info) {
        setActivePlan(res.data.active_plan_info);
      } else {
        setActivePlan(null);
        fetchAllPlans();
      }
    } catch (err) {
      console.error("Failed to fetch my plan:", err);
    }
  };

  const fetchAllPlans = async () => {
    try {
      const payload = {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: user.user_id,
        sess_id: user.sess_id,
      };

      const res = await postRequest("/billing/start-billing", payload);
      if (res.success && res.data?.subscription_plans) {
        setPlans(res.data.subscription_plans);
      }
    } catch (err) {
      console.error("Failed to fetch all plans:", err);
    }
  };

  const activatePlan = async (planId: string) => {
    if (!user) return;
    setActivating(planId);
    try {
      const payload = {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: user.user_id,
        sess_id: user.sess_id,
        subscription_plan_id: planId,
      };

      const res = await postRequest("/billing/save-start-billing", payload);
      if (res.success) {
        await fetchMyPlan(); // refresh after activation
        setPlans([]); // hide available plans after activation
      } else {
        console.error("Activation failed:", res.message);
      }
    } catch (err) {
      console.error("Failed to activate plan:", err);
    } finally {
      setActivating(null);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchMyPlan();
      setLoading(false);
    };
    loadData();
  }, [user]);

  // If user has active plan(s), show them
  if (loading) return <p className="text-center py-12">Loading...</p>;

  if (activePlan) {
    return (
      <section className="py-6 sm:py-12 px-4 text-gray-900">
        <h2 className="text-[24px] sm:text-[28px] md:text-3xl font-bold mb-4 sm:mb-6 text-center">My Active Plan</h2>
        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">{activePlan.title}</h3>
            <p className="text-3xl sm:text-4xl font-bold">
              ₹{activePlan.subscription_fee}
              <span className="text-sm sm:text-base font-normal ml-1">/monthly</span>
            </p>
            <span className="bg-green-500 text-white text-xs px-2 py-1 mt-4 inline-block rounded-full font-medium">
              Active
            </span>
          </div>
        </div>
      </section>
    );
  }

  // Otherwise show available plans
  return (
    <section className="py-6 sm:py-12 px-4 text-gray-900">
      <h2 className="text-[24px] sm:text-[28px] md:text-3xl font-bold mb-4 sm:mb-6 text-center">Choose Your Plan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.subscription_plan_id}
            className="bg-white text-black rounded-2xl p-6 sm:p-8 shadow-xl"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{plan.title}</h3>
            <p className="text-2xl sm:text-3xl font-bold mb-4">
              ₹{plan.subscription_fee}
              <span className="text-sm sm:text-base font-normal ml-1">/monthly</span>
            </p>
            <button
              onClick={() => activatePlan(plan.subscription_plan_id)}
              disabled={activating === plan.subscription_plan_id}
              className="mt-4 rounded-xl py-2 sm:py-3 w-full font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm sm:text-base hover:opacity-90 transition disabled:opacity-50"
            >
              {activating === plan.subscription_plan_id
                ? "Activating..."
                : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

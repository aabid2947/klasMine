"use client";
import { useEffect, useState } from "react";
import StaticLayout from "./layouts/StaticLayout";
import DynamicLayout from "./layouts/DynamicLayout";
import { postRequest } from "./utils/api";
import { useAuthStore } from "./store/useAuthStore";
import pkg from "./../package.json";
import { usePathname, useRouter } from "next/navigation";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();
  const pathname = usePathname();
  
  const fetchUser = async () => {
    const user_id = localStorage.getItem("user_id");
    const sess_id = localStorage.getItem("session_id");

    if (!user_id || !sess_id) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        device: "android",
        app_version: pkg.version,
        latitude: "28.6139",
        longitude: "77.2090",
        user_id,
        sess_id,
      };

      // ✅ Pass withToken: true for protected endpoint
      const res: {
        success?: boolean;
        data?: { user?: any };
        [key: string]: any;
      } = await postRequest("/account/authorized", payload, true);

      if (res?.success && res?.data?.user) {
        setAuth(res.data.user);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("user_id");
        localStorage.removeItem("session_id");
        clearAuth();
        setIsLoggedIn(false);
        // Only redirect to home if on protected route
        if (pathname?.startsWith("/account") || pathname?.startsWith("/cart")) {
          router.push("/");
        }
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      localStorage.removeItem("user_id");
      localStorage.removeItem("session_id");
      clearAuth();
      setIsLoggedIn(false);
      // Only redirect to home if on protected route
      if (pathname?.startsWith("/account") || pathname?.startsWith("/cart")) {
        router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isLoggedIn ? (
    <DynamicLayout>{children}</DynamicLayout>
  ) : (
    <StaticLayout>{children}</StaticLayout>
  );
}

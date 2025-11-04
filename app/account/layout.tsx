"use client";

import Sidebar from "../components/AccountSidebar/Sidebar";
import { useRouter } from "next/navigation";
import React from "react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("session_id"); // example
    localStorage.removeItem("user_id"); // example
    router.push("/");
  };
  return (
    <div className="flex">
      {/* Hide sidebar on mobile (< 768px), show on tablet and up */}
      <div className="hidden md:block">
        <Sidebar handleLogout={handleLogout} />
      </div>
      <main className="flex-1 bg-white px-4 sm:px-6 md:px-8 2xl:px-20 md:border-l border-gray-300">
        {children}
      </main>
    </div>
  );
}

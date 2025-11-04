'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const AvatarDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Import Zustand store
  // @ts-ignore
  const { clearAuth } = require("../../store/useAuthStore").useAuthStore.getState();

  const handleLogout = () => {
    setShowModal(false);
    // Remove all relevant localStorage items
    localStorage.removeItem("user_id");
    localStorage.removeItem("session_id");
    localStorage.removeItem("isLoggedIn");
    // If you store other user info, clear them here as well
    clearAuth();
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold cursor-pointer"
      >
        A
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[260px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <ul>
            <li>
              <Link href="/account"  onClick={() => setIsOpen(!isOpen)} className="flex items-center px-4 py-2 hover:bg-gray-100">
                <img src="/assets/images/icon/profile.svg" alt="" className="mr-2" />
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/account/dashboard" onClick={() => setIsOpen(!isOpen)} className="flex items-center px-4 py-2 hover:bg-gray-100">
                <img src="/assets/images/icon/dashboard.svg" alt="" className="mr-2" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/account/my-plan" onClick={() => setIsOpen(!isOpen)} className="flex items-center px-4 py-2 hover:bg-gray-100">
                <img src="/assets/images/icon/myplan.svg" alt="" className="mr-2" />
                My Plan
              </Link>
            </li>
            <li>
              <Link href="/account/order-history" onClick={() => setIsOpen(!isOpen)} className="flex items-center px-4 py-2 hover:bg-gray-100">
                <img src="/assets/images/icon/orderhistory.svg" alt="" className="mr-2" />
                My Order History
              </Link>
            </li>
            <li>
              <Link href="/account/notifications" onClick={() => setIsOpen(!isOpen)} className="flex items-center px-4 py-2 hover:bg-gray-100">
                <img src="/assets/images/icon/notification.svg" alt="" className="mr-2" />
                Notification
              </Link>
            </li>
            <li>
              <Link href="/account/change-password" onClick={() => setIsOpen(!isOpen)} className="flex items-center px-4 py-2 hover:bg-gray-100">
                <img src="/assets/images/icon/changepassword.svg" alt="" className="mr-2" />
                Change Password
              </Link>
            </li>
            <li
              onClick={() => setShowModal(true)}
              className="flex items-center text-red-500 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <img src="/assets/images/icon/logout.svg" alt="" className="mr-2" />
              Logout
            </li>
          </ul>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">Logout</h2>
                <p className="mt-2 text-gray-600 text-sm">
                  Are you sure you want to logout? Once you logout you need to login again. Are you OK?
                </p>

                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 rounded-md border text-gray-500 bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600"
                  >
                    Logout!
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;

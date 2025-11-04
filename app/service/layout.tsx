'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import MenuSidebar from '../components/Sidebar/MenuSidebar';
import { useAuthStore } from '../store/useAuthStore';
import { postRequest } from '../utils/api';

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionState, setSubscriptionState] = useState<'need_setup' | 'billing_expired' | null>(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      // Check if user is null - redirect to home page
      if (!user) {
        toast.info("Redirecting...");
        setTimeout(() => {
          router.push('/');
        }, 1000);
        return;
      }

      try {
        const payload = {
          device: "android",
          app_version: "1.0.5",
          latitude: "28.6139",
          longitude: "77.2090",
          user_id: user.user_id,
          sess_id: user.sess_id
        };

        const response = await postRequest('/account/authorized', payload);

        // If redirect is true, redirect to home page
        if (response.redirect === true) {
          toast.info("Session expired. Please login again.");
          setTimeout(() => {
            router.push('/');
          }, 1000);
          return;
        }

        // Check subscription status
        const userData = response.data?.user;
        
        // If user needs setup (never subscribed)
        if (userData?.need_setup === "1") {
          setSubscriptionState('need_setup');
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // If billing has expired (was subscribed but expired)
        if (userData?.billing_expired === "1") {
          setSubscriptionState('billing_expired');
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // User is authorized to use services
        setIsAuthorized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Authorization check failed:', error);
        toast.error("Authorization check failed. Please try again.");
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    };

    checkAuthorization();
  }, [user, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Show subscription required message
  if (!isAuthorized) {
    const isNeedSetup = subscriptionState === 'need_setup';
    const isBillingExpired = subscriptionState === 'billing_expired';

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          
          {isNeedSetup && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscription Required</h2>
              <p className="text-gray-600 mb-6">
                Please subscribe to use our services.
              </p>
            </>
          )}
          
          {isBillingExpired && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscription Expired</h2>
              <p className="text-gray-600 mb-6">
                Your billing has expired. Please subscribe again to continue using our services.
              </p>
            </>
          )}
          
          <button
            onClick={() => router.push('/subscription')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            View Subscription Plans
          </button>
        </div>
      </div>
    );
  }

  // User is authorized - render normal layout
  return (
    <div className="flex">
      <div className='hidden md:block'>
        <MenuSidebar />
      </div>
      <div className="flex-1 bg-white border-l border-gray-300">{children}</div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import AuthModal from "../AuthModal";
import { postRequest } from "../../utils/api";

interface FeaturedProduct {
  post_id: string;
  name: string;
  user_name: string;
  price: string;
  image_url: string;
  description: string;
  article_category_id: string;
  article_category_name: string;
  sub_category_id: string;
  orientation_ids: (string | { orientation_id: string; orientation_name: string })[];
  currency_symbol: string;
  user_id: string;
  is_featured: number;
}

export default function ProductGrid() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [formType, setFormType] = useState<"login" | "signup" | "forgot">("login");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Fetch featured products
  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      // Get user session details
      const sess_id = localStorage.getItem("session_id") || "";
      const user_id = localStorage.getItem("user_id") || "";
      
      const res = await postRequest("/post/list", {
        page: "1",
        query: "",
        sess_id: sess_id,
        user_id: user_id
      });
      
      if (res?.success && res?.data?.posts && Array.isArray(res.data.posts)) {
        // Filter products where is_featured = 1
        const featured = res.data.posts.filter((product: FeaturedProduct) => product.is_featured == 1);
        console.log("Featured products:", featured);
        setFeaturedProducts(featured.slice(0, 4)); // Show only first 4 featured products
      } else {
        console.error("Failed to fetch featured products:", res);
        setFeaturedProducts([]);
      }
    } catch (err) {
      console.error("Error fetching featured products:", err);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const handleViewDetails = (productId: string) => {
    if (user) {
      // User is logged in, navigate to product page
      router.push(`/products/${productId}`);
    } else {
      // User is not logged in, open login modal
      setFormType("login");
      setIsAuthModalOpen(true);
    }
  };

  return (
    <section
      ref={ref}
      className="pt-[60px] pb-[60px] sm:pt-[90px] sm:pb-[90px] md:pt-[120px] md:pb-[120px] bg-[url('/assets/images/bg04.jpg')] bg-no-repeat bg-cover bg-bottom"
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-openSans text-center mb-20 text-[28px] sm:text-[36px] md:text-[48px] lg:text-[66px] font-semibold text-[#333333]"
        >
           Products that can be printed on (Klass art)
        </motion.p>

   

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-4"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.post_id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg duration-300"
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = "/assets/images/print01.jpg";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-800 font-medium text-base leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">by {product.user_name}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-green-600 font-semibold text-lg">
                        {product.currency_symbol}{product.price}
                      </span>
                      <button
                        onClick={() => handleViewDetails(product.post_id)}
                        className="text-blue-500 font-medium hover:underline inline-flex items-center transition-colors"
                      >
                        View Details
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No featured products found
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No featured products available</h3>
              <p className="text-gray-500">Featured products will appear here when available.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal 
          formType={formType}
          setFormType={setFormType}
          onClose={() => setIsAuthModalOpen(false)} 
        />
      )}
    </section>
  );
}

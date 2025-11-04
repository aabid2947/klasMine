"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiEye, FiFilter } from "react-icons/fi";
import { postRequest } from "@/app/utils/api";
import { useAuthStore } from "@/app/store/useAuthStore";

const tabs = ["All", "Active", "Sale"];

export default function DashboardHeader() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_product: 0,
    total_active_product: 0,
    total_sale_product: 0,
  });
  const user = useAuthStore((state) => state.user);
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="animate-spin h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-base sm:text-lg text-gray-600">Loading profile...</span>
      </div>
    );
  }
  const fetchData = async () => {
    try {
      const response = await postRequest("/dashboard", {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: user.user_id,
        sess_id: user.sess_id,
        page: page.toString(),
        query: searchTerm,
        orientation_ids: [],
        sub_category_id: "",
        article_category_id: "",
        price: "",
      });

      if (response.success) {
        console.log(response)
        setStats({
          total_product: response.data.total_product,
          total_active_product: response.data.total_active_product,
          total_sale_product: response.data.total_sale_product,
        });
        setProducts(response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch API Data
  useEffect(() => {
    fetchData();
  }, []);

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (activeTab === "Active") {
      return product.status_text === "Active" && matchesSearch;
    }
    if (activeTab === "Sale") {
      return product.status_text === "Sale" && matchesSearch;
    }
    return matchesSearch; // "All"
  });

  return (
    <>
      {/* Header Section */}
      <div className="min-h-[120px] sm:min-h-[150px] md:min-h-[200px] py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-6 md:px-0">
        <h1 className="font-medium text-[#333333] text-[24px] sm:text-[28px] md:text-[36px] lg:text-[44px] mb-2">
          Dashboard
        </h1>
        <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold text-[rgba(123,74,231,1)] font-['Open_Sans'] mb-1">
          Welcome Back, {user.name}!
        </p>
        <p className="text-[11px] sm:text-[12px] md:text-[14px] font-normal text-[#ADB8C9] font-['Open_Sans']">
          Here's what happening with your business today
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4 md:mt-5">
          {/* Total Products */}
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-200 flex items-center gap-3 sm:gap-4">
            <div className="bg-purple-100 rounded-full p-2.5 sm:p-3 md:p-4 flex-shrink-0">
              <Image
                src="/assets/images/icon/store.svg"
                alt="Total Products Icon"
                width={24}
                height={24}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] mb-0.5 sm:mb-1 truncate">Total Products</p>
              <p className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[34px] font-bold text-[#333333]">
                {stats.total_product}
              </p>
            </div>
          </div>

          {/* Active Products */}
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-200 flex items-center gap-3 sm:gap-4">
            <div className="bg-indigo-100 rounded-full p-2.5 sm:p-3 md:p-4 flex-shrink-0">
              <Image
                src="/assets/images/icon/analytics.svg"
                alt="Active Products Icon"
                width={24}
                height={24}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] mb-0.5 sm:mb-1 truncate">Active Products</p>
              <p className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[34px] font-bold text-[#333333]">
                {stats.total_active_product}
              </p>
            </div>
          </div>

          {/* Sale Products */}
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-200 flex items-center gap-3 sm:gap-4">
            <div className="bg-red-100 rounded-full p-2.5 sm:p-3 md:p-4 flex-shrink-0">
              <Image
                src="/assets/images/icon/date.svg"
                alt="Sale Products Icon"
                width={24}
                height={24}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] mb-0.5 sm:mb-1 truncate">Sale Products</p>
              <p className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[34px] font-bold text-[#333333]">
                {stats.total_sale_product}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-4 sm:p-6 md:p-8 pt-0">
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-200">
          {/* Tabs + Search + Filter */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex rounded-md border border-[#5054C2] overflow-hidden w-full lg:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-l border-[#5054C2] transition-all text-xs sm:text-sm md:text-base font-medium ${
                    activeTab === tab
                      ? "bg-[#5054C2] text-white"
                      : "bg-white text-gray-600 border-purple-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full lg:w-auto gap-2">
              <div className="relative w-full sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
                <input
                  type="text"
                  placeholder="Search by name, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 md:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-4 rounded-md w-full bg-[#F2F3FC] text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#5054C2]"
                />
                <svg
                  className="absolute left-2.5 sm:left-3 md:left-5 top-3 sm:top-3.5 md:top-4.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#5054C2]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  />
                </svg>
              </div>
              <button className="flex items-center justify-center px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[12px] sm:text-[14px] md:text-[16px] font-medium text-[#5054C2] bg-[#F2F3FC] rounded-md hover:bg-[#E8E9FC] whitespace-nowrap transition">
                <FiFilter className="mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-md -mx-3 sm:mx-0">
            <table className="w-full table-auto text-xs sm:text-sm text-left border-collapse min-w-[550px] sm:min-w-[600px]">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-md">
                  <th className="px-2 sm:px-3 md:px-5 py-2.5 sm:py-3 md:py-5 w-[60px] sm:w-[80px] md:w-[150px] font-medium text-[11px] sm:text-xs md:text-sm">Sr. No.</th>
                  <th className="px-2 sm:px-3 md:px-5 py-2.5 sm:py-3 md:py-5 w-[80px] sm:w-[100px] md:w-[150px] font-medium text-[11px] sm:text-xs md:text-sm">Image</th>
                  <th className="px-2 sm:px-3 md:px-5 py-2.5 sm:py-3 md:py-5 w-[150px] sm:w-[200px] md:w-[350px] font-medium text-[11px] sm:text-xs md:text-sm">
                    Product Name
                  </th>
                  <th className="px-2 sm:px-3 md:px-5 py-2.5 sm:py-3 md:py-5 font-medium text-[11px] sm:text-xs md:text-sm">Category</th>
                  <th className="px-2 sm:px-3 md:px-5 py-2.5 sm:py-3 md:py-5 font-medium text-[11px] sm:text-xs md:text-sm">Price</th>
                  <th className="px-2 sm:px-3 md:px-5 py-2.5 sm:py-3 md:py-5 font-medium text-center text-[11px] sm:text-xs md:text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 sm:px-4 py-6 sm:py-8 md:py-10 text-center text-gray-500 text-xs sm:text-sm"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((item, index) => (
                    <tr
                      key={item.post_id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[#555555] text-[11px] sm:text-xs md:text-sm">{index + 1}.</td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[#555555]">
                        <Image
                          src={item.image_url}
                          alt={`Image of ${item.image_url}`}
                          width={100}
                          height={40}
                          className="rounded object-cover w-12 sm:w-16 md:w-20 lg:w-24 h-auto"
                        />
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[#555555] text-[11px] sm:text-xs md:text-sm">
                        {item.name}
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[#555555] text-[11px] sm:text-xs md:text-sm">
                        {item.article_category_name}
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[#555555] text-[11px] sm:text-xs md:text-sm whitespace-nowrap">
                        ₹{item.price}
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[#555555] text-center">
                        <FiEye className="text-gray-600 inline-block cursor-pointer hover:text-purple-600 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-3 sm:mt-4 gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-gray-200 rounded disabled:opacity-50 text-[11px] sm:text-xs md:text-sm font-medium hover:bg-gray-300 transition active:bg-gray-400"
            >
              Prev
            </button>
            <span className="text-[11px] sm:text-xs md:text-sm text-gray-700 whitespace-nowrap font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-gray-200 rounded disabled:opacity-50 text-[11px] sm:text-xs md:text-sm font-medium hover:bg-gray-300 transition active:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

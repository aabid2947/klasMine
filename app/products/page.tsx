"use client";
import React, { useEffect, useState } from "react";
import FilterSidebar from "../components/FilterSidebar";
import Card from "../components/ProductCard";
import { postRequest } from "../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Product interface
interface Product {
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

interface FilterData {
  article_style: {
    cat_id: string;
    cat_name: string;
    sub_cat: {
      sub_category_id: string;
      name: string;
      image: string;
    }[];
  }[];
  orientations: {
    orientation_id: string;
    name: string;
    img: string;
    total_number: string;
  }[];
  allarticle: {
    [key: string]: {
      article_id: string;
      category_name: string;
      article_type: string;
      article_img: string;
      article_price: string;
      name: string;
      total_number: string;
    }[];
  };
}

const Products = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterData | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    orientation_ids: [] as string[],
    article_style_id: "",
    sub_category_id: "",
    article_type: "",
    price: "",
  });
  // 🧩 Fetch filters
  const fetchFilters = async () => {
    try {
      // Get user session details
      const sess_id = localStorage.getItem("session_id") || "";
      const user_id = localStorage.getItem("user_id") || "";
      
      const res = await postRequest("/filters/list", {
        page: "1",
        query: "",
        sess_id: sess_id,
        user_id: user_id
      });
      
      // Check if redirect is true - session expired
      if (res?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }
      
      if (res?.success && res?.data) {
        setFilters(res.data);
      }
    } catch (err) {
      console.error("Error fetching filters:", err);
    }
  };

  // 🧩 Fetch products - only fetch once, no filtering parameters
  const fetchProducts = async () => {
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
      
      // Check if redirect is true - session expired
      if (res?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }
      
      if (res?.success) {
        if (res?.data?.posts && Array.isArray(res.data.posts)) {
          console.log("Products fetched:", res.data.posts);
          // Filter out featured products (is_featured = 1) from regular marketplace
          const nonFeaturedProducts = res.data.posts.filter((product: Product) => product.is_featured != 1);
          console.log("Non-featured products:", nonFeaturedProducts);
          setAllProducts(nonFeaturedProducts);
          setFilteredProducts(nonFeaturedProducts);
        } else {
          setAllProducts([]);
          setFilteredProducts([]);
        }
      } else {
        console.error("Failed to fetch products:", res);
        setAllProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Frontend filtering function
  const applyFilters = () => {
    let filtered = [...allProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.article_category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.user_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply orientation filter - check if orientation_ids exists and has values
    if (appliedFilters.orientation_ids.length > 0) {
      filtered = filtered.filter(product => {
        // Handle case where orientation_ids might be empty array or undefined
        if (!product.orientation_ids || !Array.isArray(product.orientation_ids) || product.orientation_ids.length === 0) {
          return false;
        }
        
        // Check if orientation_ids contains objects or strings
        return product.orientation_ids.some(orientationItem => {
          // If it's an object with orientation_id property
          if (typeof orientationItem === 'object' && orientationItem.orientation_id) {
            return appliedFilters.orientation_ids.includes(orientationItem.orientation_id.toString());
          }
          // If it's just a string/number ID
          return appliedFilters.orientation_ids.includes(orientationItem.toString());
        });
      });
    }

    // Apply category filter (article_style)
    if (appliedFilters.article_style_id) {
      filtered = filtered.filter(product => 
        product.article_category_id === appliedFilters.article_style_id
      );
    }

    // Apply sub-category filter
    if (appliedFilters.sub_category_id) {
      filtered = filtered.filter(product => 
        product.sub_category_id === appliedFilters.sub_category_id
      );
    }

    // Apply article type filter
    if (appliedFilters.article_type) {
      // This would need to be added to Product interface if available in API response
      // For now, we'll skip this filter as it's not in the current product structure
    }

    // Apply price filter
    if (appliedFilters.price) {
      const priceRange = appliedFilters.price.split('-');
      if (priceRange.length === 2) {
        const [min, max] = priceRange.map(Number);
        filtered = filtered.filter(product => {
          const price = parseFloat(product.price);
          return !isNaN(price) && price >= min && price <= max;
        });
      }
    }

    console.log('Applied filters:', appliedFilters);
    console.log('Sample product orientation_ids:', allProducts.length > 0 ? allProducts[0]?.orientation_ids : 'No products');
    console.log('Filtered products:', filtered.length, 'out of', allProducts.length);
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchFilters();
    fetchProducts();
  }, []);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [allProducts, searchQuery, appliedFilters]);

  // Close mobile filter when clicking outside or pressing escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when filter is open
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  // 🧩 Handle Apply Filters
  const handleApplyFilters = (selected: {
    orientation_ids: string[];
    article_style_id: string;
    sub_category_id: string;
    article_type: string;
    price: string;
  }) => {
    setAppliedFilters(selected);
  };

  // 🧩 Handle Search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 🧩 Handle Sort
  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
    let sortedProducts = [...filteredProducts];
    
    switch (sortOption) {
      case "price-low":
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name-az":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order
        break;
    }
    
    setFilteredProducts(sortedProducts);
  };

  return (
    <div className="p-6 flex gap-6 relative">
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
      {/* Mobile Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
      
      {/* Mobile Filter Button */}
      <button
        className="xl:hidden fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-40"
        onClick={() => setIsFilterOpen(true)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* Column 1: Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
          xl:static xl:translate-x-0 xl:block xl:z-auto
        `}
      >
        <div className="flex justify-end xl:hidden">
          <button
            className="m-4 right-4 text-gray-600 hover:text-black"
            onClick={() => setIsFilterOpen(false)}
          >
            ✕
          </button>
        </div>
        {filters ? (
          <FilterSidebar filters={filters} onApply={handleApplyFilters} />
        ) : (
          <div className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Loading filters...</p>
          </div>
        )}
      </div>

      {/* Column 2: Content area */}
      <div className="flex-1 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                  Loading...
                </div>
              ) : (
                `${filteredProducts.length} Image Results`
              )}
            </h1>
            {/* Active Filters Display */}
            {(appliedFilters.orientation_ids.length > 0 || 
              appliedFilters.article_style_id || 
              appliedFilters.sub_category_id || 
              appliedFilters.article_type ||
              appliedFilters.price || 
              searchQuery) && (
              <button 
                onClick={() => {
                  setAppliedFilters({
                    orientation_ids: [],
                    article_style_id: "",
                    sub_category_id: "",
                    article_type: "",
                    price: "",
                  });
                  setSearchQuery("");
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-4 md:flex-row items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
                placeholder="Search by category, price & more"
                className="border border-gray-300 px-4 py-2 pr-10 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button 
                onClick={() => handleSearch(searchQuery)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            <select 
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-2 lg:columns-2 xl:columns-3 gap-6 space-y-6">
            {filteredProducts.map((item: Product) => (
              <Card key={item.post_id} {...item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || appliedFilters.orientation_ids.length > 0 || appliedFilters.article_style_id || appliedFilters.sub_category_id || appliedFilters.article_type || appliedFilters.price
                ? "Try adjusting your search or filters to find what you're looking for."
                : "No products are available at the moment."}
            </p>
            {(searchQuery || appliedFilters.orientation_ids.length > 0 || appliedFilters.article_style_id || appliedFilters.sub_category_id || appliedFilters.article_type || appliedFilters.price) && (
              <button
                onClick={() => {
                  setAppliedFilters({
                    orientation_ids: [],
                    article_style_id: "",
                    sub_category_id: "",
                    article_type: "",
                    price: "",
                  });
                  setSearchQuery("");
                }}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

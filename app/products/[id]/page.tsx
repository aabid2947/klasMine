"use client";
import { useAuthStore } from "@/app/store/useAuthStore";
import { postRequest } from "@/app/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface Product {
  post_id: string;
  title: string;
  author: string;
  price: string;
  image_url: string;
  description: string;
  Category: string;
}

interface ArticleStyle {
  cat_id: string;
  cat_name: string;
  sub_cat: {
    sub_category_id: string;
    name: string;
    image: string;
  }[];
}

interface Orientation {
  orientation_id: string;
  name: string;
  img: string;
  total_number: string;
}

interface FilterData {
  article_style: ArticleStyle[];
  orientations: Orientation[];
  allarticle: any[];
}

interface CustomizeResponse {
  success: boolean;
  message: string;
  genrated_img: string[];
  promt_img: string;
  post_id: number;
  price: number;
  name: string;
  description: string;
  orgientation: string;
  category: string;
  subcategory: string;
}

export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = useParams();
  const [loading, setloading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrientation, setSelectedOrientation] = useState("");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0);
  const [articleStyles, setArticleStyles] = useState<ArticleStyle[]>([]);
  const [allArticles, setAllArticles] = useState<any>({});
  const [selectedArticleType, setSelectedArticleType] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [orientations, setOrientations] = useState<Orientation[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [customizing, setCustomizing] = useState(false);
  const [customizedData, setCustomizedData] = useState<CustomizeResponse | null>(null);
  const [currentDisplayImage, setCurrentDisplayImage] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const user = useAuthStore((s) => s.user);
  const [product, setProduct] = useState<Product>({
    post_id: "",
    title: "",
    description: "",
    Category: "",
    author: "",
    price: "",
    image_url: "",
  });

  // A check for the user object is already in place, which is good.
  if (!user) {
    router.push('/')
    return (
      <div className="h-full flex items-center justify-center w-full py-20">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full" />
        <span className="ml-4 text-gray-600">Loading user…</span>
      </div>
    );
  }

  const fetchProduct = async () => {
    const body = {
      device: "android",
      app_version: "1.0.5",
      latitude: "28.6139",
      longitude: "77.2090",
      user_id: user.user_id,
      sess_id: user.sess_id,
      post_id: id,
    };
    try {
      console.log("Fetching product...");
      const res = await postRequest("/post/view", body);
      
      // Check if redirect is true - session expired
      if (res?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }
      
      console.log(res.data)
      if (res) setProduct(res.data.form_data);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  const fetchArticleStyles = async () => {
    try {
      setFiltersLoading(true);
      const body = {
        page: "1",
        query: "",
        sess_id: user.sess_id,
        user_id: user.user_id,
      };

      const res = await postRequest("/filters/list", body);
      
      // Check if redirect is true - session expired
      if (res?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }
      
      if (res?.success && res?.data) {
        if (res.data.allarticle) {
          setAllArticles(res.data.allarticle);
          // Auto-select first article type and first article
          const firstArticleType = Object.keys(res.data.allarticle)[0];
          if (firstArticleType) {
            setSelectedArticleType(firstArticleType);
            const firstArticle = res.data.allarticle[firstArticleType][0];
            if (firstArticle) {
              setSelectedArticle(firstArticle);
            }
          }
        }
        if (res.data.orientations) {
          setOrientations(res.data.orientations);
          // Set first orientation as default
          if (res.data.orientations.length > 0) {
            setSelectedOrientation(res.data.orientations[0].orientation_id);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching article styles:", err);
    } finally {
      setFiltersLoading(false);
    }
  };

  const handleCustomizeImage = async () => {
    if (!user || !selectedArticle) {
      toast.error("Please select an article first");
      return;
    }

    if (!selectedOrientation) {
      toast.error("Please select an orientation first");
      return;
    }

    setCustomizing(true);
    try {
      const body = {
        device: "android",
        app_version: "1.0.5",
        user_id: user.user_id,
        sess_id: user.sess_id,
        post_id: parseInt(id as string),
        article_id: parseInt(selectedArticle.article_id),
        size: selectedOrientation // Use the orientation_id directly
      };

      console.log("Customizing image with:", body);
      const res = await postRequest("/customimage", body);

      // Check if redirect is true - session expired
      if (res?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }

      if (res?.success) {
        setCustomizedData(res);
        // Update display image to first generated image only on initial customization
        if (res.genrated_img && res.genrated_img.length > 0) {
          setCurrentDisplayImage(res.genrated_img[0]);
        }
        // Update price
        console.log(res)
        if (res.price) {
          setCurrentPrice(res.price.toString());
        }
        toast.success("Image customized successfully!");
      } else {
        toast.error(res?.message || "Failed to customize image");
      }
    } catch (err: any) {
      console.error("Error customizing image:", err);
      toast.error(err?.message || "Failed to customize image");
    } finally {
      setCustomizing(false);
    }
  };
  useEffect(() => {
    if (user) {
      fetchProduct();
      fetchArticleStyles();
    }
  }, [id, user]);

  // Update display values when product changes or when switching between original/customized
  useEffect(() => {
    if (customizedData) {
      // Use customized price but don't override manually selected image
      setCurrentPrice(customizedData.price.toString());
      // Only set the image if no image is currently displayed or if switching from original
      if (!currentDisplayImage || currentDisplayImage === product?.image_url) {
        setCurrentDisplayImage(customizedData.genrated_img[0] || "");
      }
    } else if (product) {
      // Use original product image and price
      setCurrentDisplayImage(product.image_url);
      setCurrentPrice(product.price);
    }
  }, [product, customizedData]);
  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    setloading(true);
    
    // Calculate total amount (price * quantity)
    const unitPrice = parseFloat(currentPrice || "0");
    const totalAmount = (unitPrice * quantity).toString();
    
    const body = {
      device: "android",
      app_version: "1.0.5",
      latitude: "28.6139",
      longitude: "77.2090",
      user_id: user.user_id,
      sess_id: user.sess_id,
      post_id: id?.toString() || "",
      amount: totalAmount,
      qty: quantity.toString(),
    };

    try {
      console.log("Adding to cart:", body);
      const res = await postRequest("/cart/add", body, true); // Use withToken: true
      
      // Check if redirect is true - session expired
      if (res?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }
      
      console.log(res)

      if (res?.success) {
        toast.success("Product added to cart successfully!");

        router.push('/cart');
      } else {
        toast.error(res?.message || "Failed to add product to cart");
      }
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      toast.error(err?.message || "Failed to add product to cart");
    } finally {
      setloading(false);
    }
  };
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

      {/* FIX 1: Changed h-[calc(100vh-65px)] to min-h-[calc(100vh-65px)]
        This allows the container to grow if the content is taller than the viewport.
      */}
      <div className="min-h-[calc(100vh-65px)] bg-gray-100">
        {/* FIX 2: Added pb-16 (padding-bottom)
          This ensures there is always extra space at the bottom, above the footer.
        */}
        <div className="max-w-6xl mx-auto px-4 py-8 pb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side - Main Preview */}
          <div>
            <div className="relative rounded-xl overflow-hidden">
              {currentDisplayImage ? (
                <img
                  src={currentDisplayImage}
                  alt={customizedData?.name || product?.title || "Product Image"}
                  className="w-full h-auto rounded-xl object-cover"
                  style={{ minHeight: "400px" }}
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-gray-500">Loading image...</span>
                </div>
              )}
              
              {/* Customized Badge */}
              {customizedData && (
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✨ Customized
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-3 font-medium hover:bg-black/80 focus:outline-none focus:ring-0"
              >
                Preview
              </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl overflow-hidden relative max-w-full max-h-full shadow-xl">
                  {/* Close Button */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-2 right-2 text-white bg-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800 z-50"
                    aria-label="Close Preview"
                  >
                    ✕
                  </button>

                  {/* Modal Image */}
                  {currentDisplayImage && (
                    <img
                      src={currentDisplayImage}
                      alt={customizedData?.name || product?.title || "Product Preview"}
                      className="object-contain max-w-full max-h-[90vh]"
                      style={{ maxWidth: "800px", maxHeight: "800px" }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Generated Images or Article Styles */}
            <div className="mt-4 mx-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                {(customizedData?.genrated_img?.length ?? 0) > 0 ? "Generated Variations" : "Article Styles"}
                </p>
              {/* FIX 3: Made grid responsive.
                Was "grid-cols-4", now "grid-cols-3 sm:grid-cols-4".
                This shows 3 items on mobile and 4 on larger screens.
              */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {(customizedData?.genrated_img?.length ?? 0) > 0 ? (
                  // Show generated images
                  customizedData?.genrated_img?.map((imgUrl, index) => (
                    <div
                      key={index}
                      className={`w-full h-[80px] relative overflow-hidden border-2 rounded-md cursor-pointer transition-all ${
                        currentDisplayImage === imgUrl
                          ? "border-blue-500 ring-1 ring-blue-200"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      onClick={() => {
                        console.log("Switching to image:", imgUrl);
                        setCurrentDisplayImage(imgUrl);
                      }}
                    >
                      <img
                        src={imgUrl}
                        alt={`Generated variation ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          console.error("Generated image failed to load:", imgUrl);
                        }}
                      />
                      
                      {/* Selection indicator */}
                      {currentDisplayImage === imgUrl && (
                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}
                      
                      {/* Variation number */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 rounded-b-md">
                        <p className="text-center">Variation {index + 1}</p>
                      </div>
                    </div>
                  ))
                ) : filtersLoading ? (
                  // Loading state
                  [1, 2, 3].map((i) => ( // Changed to 3 to match grid-cols-3
                    <div
                      key={i}
                      className="w-full h-[80px] bg-gray-200 rounded-md animate-pulse"
                    />
                  ))
                ) : articleStyles.length > 0 ? (
                  // Show article styles with subcategories
                  articleStyles
                    .slice(0, 4) // Limit to 4 items
                    .map((style, styleIndex) => {
                      // For each article style, show the first subcategory image or a placeholder
                      const firstSubCat = style.sub_cat?.[0];
                      const isSelected = selectedStyleIndex === styleIndex;
                      
                      return (
                        <div
                          key={style.cat_id}
                          className={`w-full h-[80px] relative overflow-hidden border-2 rounded-md cursor-pointer transition-all ${
                            isSelected
                              ? "border-blue-500 ring-1 ring-blue-200"
                              : "border-transparent hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedStyleIndex(styleIndex)}
                        >
                          {firstSubCat?.image ? (
                            <img
                              src={firstSubCat.image}
                              alt={firstSubCat.name}
                              className="w-full h-full object-cover rounded-md"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 rounded-md flex flex-col items-center justify-center">
                              <span className="text-xs font-medium text-gray-700 text-center px-1">
                                {style.cat_name}
                              </span>
                            </div>
                          )}
                          
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                          )}
                          
                          {/* Category name overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 rounded-b-md">
                            <p className="truncate text-center">{style.cat_name}</p>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  // Fallback to product images when no article styles available
                  [1, 2, 3].map((i) => ( // Changed to 3
                    <div
                      key={i}
                      className={`w-full h-[80px] relative overflow-hidden border-2 rounded-md ${
                        i === 1
                          ? "border-blue-500"
                          : "border-transparent cursor-pointer hover:border-gray-300"
                      }`}
                    >
                      {product?.image_url ? (
                        <img
                          src={product.image_url}
                          alt={`View ${i}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-400 text-xs">{i}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              {/* Show selection info */}
              {(customizedData?.genrated_img?.length ?? 0) > 0 ? (
                <div className="mt-2 text-xs text-gray-600">
                  <p>
                    <span className="font-medium text-green-600">✨ Customized:</span> {customizedData?.genrated_img?.length} variations generated
                  </p>
                  <button
                    onClick={() => {
                      setCustomizedData(null);
                      setCurrentDisplayImage(product?.image_url || "");
                      setCurrentPrice(product?.price || "");
                    }}
                    className="mt-1 text-xs text-purple-600 hover:text-purple-800 underline"
                  >
                    Reset to original
                  </button>
                </div>
              ) : !filtersLoading && articleStyles.length > 0 ? (
                <div className="mt-2 text-xs text-gray-600">
                  <p>
                    Selected: <span className="font-medium">{articleStyles[selectedStyleIndex]?.cat_name}</span>
                    {articleStyles[selectedStyleIndex]?.sub_cat?.length > 0 && (
                      <span className="ml-2">
                        ({articleStyles[selectedStyleIndex].sub_cat.length} variations)
                      </span>
                    )}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold leading-tight">
              {customizedData?.name || product?.title || ""}
            </h2>

            {/* Description */}
            {(customizedData?.description || product?.description) && (
              <p className="text-gray-600">
                {customizedData?.description || product?.description}
              </p>
            )}

            {/* Category and Subcategory Info */}
            <div className="text-sm text-gray-500 space-y-1">
              {(customizedData?.category || product?.Category) && (
                <p>
                  <span className="font-medium">Category:</span> {customizedData?.category || product?.Category}
                </p>
              )}
              {customizedData?.subcategory && (
                <p>
                  <span className="font-medium">Style:</span> {customizedData.subcategory}
                </p>
              )}
              {customizedData?.orgientation && (
                <p>
                  <span className="font-medium">Orientation:</span> {customizedData.orgientation}
                </p>
              )}
            </div>

            {/* Orientation */}
            <div>
              <p className="mb-3 font-medium">Orientation</p>
              <div className="flex gap-2 flex-wrap">
                {filtersLoading ? (
                  // Loading state
                  [1, 2, 3].map((i) => ( // Changed to 3
                    <div
                      key={i}
                      className="px-4 py-2 bg-gray-200 rounded-md animate-pulse w-20 h-10"
                    />
                  ))
                ) : orientations.length > 0 ? (
                  // Dynamic orientations from API
                  orientations.map((orientation) => (
                    <button
                      key={orientation.orientation_id}
                      onClick={() => setSelectedOrientation(orientation.orientation_id)}
                      className={`px-4 py-2 border rounded-md transition flex items-center gap-2 ${
                        selectedOrientation === orientation.orientation_id
                          ? "border-blue-500 text-blue-600 bg-blue-50"
                          : "border-gray-300 text-gray-600 hover:border-blue-300"
                      }`}
                    >
                      {orientation.img && (
                        <img
                          src={orientation.img}
                          alt={orientation.name}
                          className="w-4 h-4 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      )}
                      {orientation.name}
                    </button>
                  ))
                ) : (
                  // Fallback if no orientations available
                  <p className="text-gray-500 text-sm">No orientations available</p>
                )}
              </div>
            </div>

            {/* Article Type */}
            <div>
              <p className="mb-2 font-medium">Article Type</p>
              <div className="space-y-3">
                {/* Article Type Selector */}
                <div className="flex gap-2 flex-wrap">
                  {filtersLoading ? (
                    // Loading state
                    [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="px-4 py-2 bg-gray-200 rounded-md animate-pulse w-20 h-10"
                      />
                    ))
                  ) : Object.keys(allArticles).length > 0 ? (
                    Object.keys(allArticles).map((articleType) => (
                      <button
                        key={articleType}
                        onClick={() => {
                          setSelectedArticleType(articleType);
                          // Auto-select first article of this type
                          const firstArticle = allArticles[articleType][0];
                          if (firstArticle) {
                            setSelectedArticle(firstArticle);
                          }
                        }}
                        className={`px-4 py-2 border rounded-md transition ${
                          selectedArticleType === articleType
                            ? 'border-purple-500 text-purple-600 bg-purple-50'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {articleType}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No article types available</p>
                  )}
                </div>

                {/* Article Grid */}
                {!filtersLoading && selectedArticleType && allArticles[selectedArticleType] && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {allArticles[selectedArticleType].map((article: any) => (
                      <div
                        key={article.article_id}
                        onClick={() => setSelectedArticle(article)}
                        className={`relative cursor-pointer border-2 rounded-md transition-all ${
                          selectedArticle?.article_id === article.article_id
                            ? 'border-purple-500 ring-2 ring-purple-200 shadow-lg'
                            : 'border-transparent hover:border-purple-300'
                        }`}
                      >
                        <div className="aspect-[4/3] relative">
                          {article.article_img ? (
                            <img
                              src={article.article_img}
                              alt={article.name}
                              className="w-full h-full object-cover rounded-md"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://placehold.co/400x300/E2E8F0/94A3B8?text=Image+Not+Found`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-gray-400 text-sm">No Image</span>
                            </div>
                          )}
                        </div>

                        {/* Selection indicator */}
                        {selectedArticle?.article_id === article.article_id && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold">
                            ✓
                          </div>
                        )}

                        {/* Article details overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-md">
                          <p className="text-white text-sm font-medium truncate">{article.name}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-white/90 text-xs">{article.category_name}</p>
                            <p className="text-white text-sm font-semibold">₹{article.article_price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

         

            {/* Price */}
            <div className="text-green-600 font-bold text-xl">
              ₹ {currentPrice || "0"}{" "}
              <span className="text-gray-500 text-sm font-normal">
                (inclusive of taxes)
              </span>
              {customizedData && (
                <div className="text-xs text-purple-600 font-normal mt-1">
                  🎨 Customized pricing
                </div>
              )}
            </div>

            {/* Quantity & Actions */}
            {/* Made this section responsive with flex-wrap */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center border rounded overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  -
                </button>
                <input
                  type="text"
                  readOnly
                  value={quantity.toString().padStart(2, "0")}
                  className="w-12 text-center py-2 border-x"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={customizedData ? () => {
                  // Clear all customization variables
                  setCustomizedData(null);
                  setCurrentDisplayImage(product?.image_url || "");
                  setCurrentPrice(product?.price || "");
                } : handleCustomizeImage}
                disabled={!customizedData && (customizing || filtersLoading)}
                className={`px-6 py-2 font-semibold rounded-md shadow-lg transition ${
                  !customizedData && (customizing || filtersLoading)
                    ? "text-gray-400 bg-gray-300 cursor-not-allowed"
                    : customizedData
                    ? "text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:opacity-90"
                    : "text-white bg-gradient-to-r from-purple-400 to-blue-500 hover:opacity-90"
                  }`}
              >
                {customizedData 
                  ? "Back to Original" 
                  : customizing 
                  ? "Customizing..." 
                  : "Customize"}
              </button>

              <button
                disabled={loading}
                type="button"
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-md shadow hover:opacity-90 transition disabled:opacity-50 flex-grow sm:flex-grow-0"
              >
                {loading ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

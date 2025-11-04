import { Lock } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { postRequest } from "../utils/api";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

interface CustomizationOptions {
  frameType: string;
  frameStyle: string;
  cupType: string;
  cupStyle: string;
  orientation: string;
  color: string;
  quantity: number;
}

interface TextToImagesProps {
  generatedImages?: string[];
  currentPostId?: string | number | null;
  onCustomizeApply?: ((article: any) => void) | null;
  customizationData?: any;
}

export default function TextToImages({
  generatedImages = [],
  currentPostId = null,
  onCustomizeApply = null,
  customizationData = null,
}: TextToImagesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [orientations, setOrientations] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOrientation, setSelectedOrientation] = useState<string>('1:1 Square');
  const [selectedColor, setSelectedColor] = useState<string>('Black');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [articles, setArticles] = useState<any>({});
  const [selectedArticleType, setSelectedArticleType] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isCustomizationCompleted, setIsCustomizationCompleted] = useState(false);
  const [customizedImages, setCustomizedImages] = useState<string[]>([]);
  const [showCustomizedImages, setShowCustomizedImages] = useState(false);
  const [customizationResponse, setCustomizationResponse] = useState<any>(null);
 
  // Debug: Log images when they change
  React.useEffect(() => {
    console.log("TextToImages received images:", {
      count: generatedImages?.length || 0,
      images: generatedImages,
      selectedImage,
      currentPostId: currentPostId
    });
  }, [generatedImages, selectedImage, currentPostId]);

  // Auto-select first image when generatedImages changes
  React.useEffect(() => {
    if (Array.isArray(generatedImages) && generatedImages.length > 0) {
      // Always set the first image as selected when new images arrive
      setSelectedImage(generatedImages[0]);
      // Reset customization state when new images are generated, unless there's customization data
      if (!customizationData) {
        setIsCustomizationCompleted(false);
      }
      console.log("Auto-selected first generated image:", generatedImages[0]);
      console.log("Total images received:", generatedImages.length);
    }
  }, [generatedImages, customizationData]);

  // Update customization status when customizationData changes
  React.useEffect(() => {
    if (customizationData) {
      setIsCustomizationCompleted(true);
      console.log("Customization completed with data:", customizationData);
    }
  }, [customizationData]);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    orientation_ids: [] as number[], // multi-select checkboxes stored here
  });

  const handleOrientationToggle = (id: number) => {
    setFormData((prev) => {
      const exists = prev.orientation_ids.includes(id);
      return {
        ...prev,
        orientation_ids: exists
          ? prev.orientation_ids.filter((oid) => oid !== id)
          : [...prev.orientation_ids, id],
      };
    });
  };

  const handleAddToCart = async () => {
    console.log("🛒 handleAddToCart called with:", {
      user: !!user,
      currentPostId,
      selectedArticle: selectedArticle?.name,
      generatedImages: generatedImages?.length
    });

    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }

    if (!currentPostId && (!generatedImages || generatedImages.length === 0)) {
      console.error("❌ No currentPostId and no generated images for cart");
      toast.error("No image generated yet. Please generate an image first.");
      return;
    }

    try {
      const unitPrice = selectedArticle?.article_price || 499;
      const totalAmount = unitPrice * quantity;

      const cartPayload = {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: user.user_id,
        sess_id: user.sess_id,
        post_id: (currentPostId?.toString() ?? "0"), // Use "0" as fallback
        amount: totalAmount,
        qty: quantity
      };

      console.log('Adding to cart with payload:', cartPayload);

      const response = await postRequest("/cart/add", cartPayload, true);

      console.log('Add to cart API response:', response);

      if (response?.success) {
        toast.success("Successfully added to cart!");
        
        // Close the customize modal
        setIsCustomizeModalOpen(false);
        
        // Clear all customization variables
        setIsCustomizationCompleted(false);
        setCustomizedImages([]);
        setShowCustomizedImages(false);
        setCustomizationResponse(null);
        setSelectedArticle(null);
        setSelectedArticleType('');
        setArticles({});
        setQuantity(1);
        setSelectedOrientation('1:1 Square');
        setSelectedColor('Black');
      } else {
        toast.error(response?.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  const handleCustomizeFromModal = async () => {
    console.log("🔧 handleCustomizeFromModal called with:", {
      user: !!user,
      currentPostId,
      selectedArticle: selectedArticle?.name,
      generatedImages: generatedImages?.length
    });

    if (!user) {
      toast.error("Please login to customize images");
      return;
    }

    // Check for post ID or fallback to generated images
    if (!currentPostId && (!generatedImages || generatedImages.length === 0)) {
      console.error("❌ No currentPostId and no generated images available");
      toast.error("No image generated yet. Please generate an image first.");
      return;
    }

    if (!selectedArticle) {
      toast.error("Please select an article to customize");
      return;
    }

    try {
      const customizePayload = {
        device: "android",
        app_version: "1.0.5",
        user_id: user.user_id,
        sess_id: user.sess_id,
        post_id: currentPostId || 0, // Use 0 as fallback if no post_id
        article_id: selectedArticle.article_id,
        size: "" // Empty as shown in the example
      };

      console.log('🚀 Calling /customimage API with payload:', customizePayload);

      const response = await postRequest("/customimage", customizePayload, true);

      console.log('Custom image API response:', response);

      if (response?.success) {
        toast.success(`Successfully applied ${selectedArticle.name} for customization!`);

        // Store customized images ONLY for modal display - don't affect main images
        if (response.genrated_img && Array.isArray(response.genrated_img)) {
          setCustomizedImages(response.genrated_img);
          console.log('Customized images set:', response);
          setShowCustomizedImages(true);
        }

        // Store the full customization response data
        setCustomizationResponse(response);

        setIsCustomizationCompleted(true); // Mark customization as completed

        // Call the parent's customize handler but DON'T update main images
        if (onCustomizeApply) {
          onCustomizeApply(response); // Pass the full response for data only
        }
      } else {
        toast.error(response?.message || "Failed to customize image");
      }
    } catch (error) {
      console.error('Error calling customimage API:', error);
      toast.error("Failed to customize image. Please try again.");
    }
  };

  const handleApplyCustomizedImages = () => {
    // Close the modal and apply the customized images
    setIsCustomizeModalOpen(false);
    // Images will be updated via the parent component
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const payload = {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: user!.user_id,
        sess_id: user!.sess_id,
        post_id: 0,
      };

      const res = await postRequest("/post/form", payload, true);

      if (res.success && res.data) {
        setCategories(res.data.article_categories || []);
        setSubCategories(res.data.sub_categories || []);
        setOrientations(res.data.orientations || []);
      }
    } catch (err) {
      console.error("Error fetching filters:", err);
      toast.error("Failed to load form data");
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await postRequest('/filters/list', {
        page: "1",
        query: "",
        sess_id: user?.sess_id || "",
        user_id: user?.user_id || ""
      });

      if (response?.success && response?.data?.allarticle) {
        console.log('Fetched articles:', response.data.allarticle);
        setOrientations(response.data.orientations);
        setArticles(response.data.allarticle);

        // Auto-select first article type and first article
        const firstArticleType = Object.keys(response.data.allarticle)[0];
        if (firstArticleType) {
          setSelectedArticleType(firstArticleType);
          const firstArticle = response.data.allarticle[firstArticleType][0];
          if (firstArticle) {
            setSelectedArticle(firstArticle);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      toast.error('Failed to load articles');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // Get the current selected or first generated image
      const imageToSave =
        selectedImage ||
        (Array.isArray(generatedImages) && generatedImages.length > 0
          ? generatedImages[0]
          : null);

      if (!imageToSave) {
        toast.error("Please generate an image first");
        setSaving(false);
        return;
      }

      // ensure integers
      const orientationArray = formData.orientation_ids.map((v) => Number(v));

      const payload = {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: user!.user_id,
        sess_id: user!.sess_id,
        post_id: 0,
        article_category_id: formData.category,
        sub_category_id: formData.subcategory,
        name: formData.productName,
        image: imageToSave, // Use the generated/selected image
        price: formData.price,
        description: formData.description,
        orientation_ids: orientationArray,
      };

      console.log("🟢 Submitting payload:", payload);

      const res = await postRequest("/post/save", payload, true);

      if (res.success) {
        toast.success("Product added successfully!");
        setIsModalOpen(false);
        setFormData({
          productName: "",
          description: "",
          category: "",
          subcategory: "",
          price: "",
          orientation_ids: [],
        });
      } else {
        toast.error(res.message || "Failed to save. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Error while saving product.");
    } finally {
      setSaving(false);
    }
  };

  // Handle user check after all hooks are initialized
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Customization Info */}


      {/* Single Generated Image Display */}
      <div className="w-full max-w-md mx-auto mb-4">
        <div className="relative mx-auto">
          <div
            className="mx-auto  w-full overflow-hidden rounded-md bg-gray-100"
     
          >
            {Array.isArray(generatedImages) && generatedImages.length > 0 ? (
              <img
                src={selectedImage || generatedImages[0]}
                alt="Generated Image"
                className="w-full h-full object-cover"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                onLoad={() => {
                  console.log(
                    "Main image loaded successfully:",
                    selectedImage || generatedImages[0]
                  );
                }}
                onError={(e) => {
                  console.error(
                    "Main image failed to load:",
                    selectedImage || generatedImages[0]
                  );
                  e.currentTarget.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBFcnJvcjwvdGV4dD48L3N2Zz4=";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  Generated image will appear here
                </span>
              </div>
            )}
          </div>

          {/* Image Info */}
          <p className="text-xs text-gray-500 mt-2 text-center">
            {Array.isArray(generatedImages) && generatedImages.length > 0
              ? `Generated Image ${generatedImages.length > 1
                ? `(${generatedImages.findIndex(
                  (img) => img === (selectedImage || generatedImages[0])
                ) + 1
                }/${generatedImages.length})`
                : ""
              }`
              : "Your generated image will appear here"}
          </p>

          {/* Preview Button */}
          {Array.isArray(generatedImages) && generatedImages.length > 0 && (
             <button
                          type="button"
                          onClick={() => {
                            setIsPreviewModalOpen(true);
                          }}
                          className="absolute bottom-5 left-0 w-full bg-black/60 w-[70%] text-white text-center py-3 font-medium hover:bg-black/80 focus:outline-none focus:ring-0"
                        >
                          Preview
                        </button>
          )}
        </div>
      </div>

      {/* Thumbnail Row */}
      <div className="w-full max-w-2xl mx-auto">
        <h3 className="text-base font-medium text-gray-800 mb-3 text-center">
          Generated Images
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 justify-items-center">
          {/* Generated Images Thumbnails - Only show actual images */}
          {Array.isArray(generatedImages) &&
            generatedImages.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative w-full aspect-square max-w-[100px] overflow-hidden cursor-pointer border-2 rounded-md transition-all ${(selectedImage === image || (!selectedImage && index === 0))
                    ? "border-blue-500 shadow-lg ring-1 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                  }`}
                onClick={() => {
                  console.log("Selected image:", image, "at index:", index);
                  setSelectedImage(image);
                }}
              >
                <img
                  src={image}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(
                      `Thumbnail ${index + 1} failed to load:`,
                      image
                    );
                    // Show a placeholder instead of breaking
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXJyb3I8L3RleHQ+PC9zdmc+";
                  }}
                />
                {(selectedImage === image || (!selectedImage && index === 0)) && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                  {index + 1}
                </div>
              </div>
            ))}

          {/* Show locked placeholders only if we have fewer than 4 images */}
          {Array.isArray(generatedImages) && generatedImages.length < 4 &&
            Array.from({
              length: 4 - generatedImages.length,
            }).map((_, index) => (
              <div
                key={`locked-${generatedImages.length + index}`}
                className="relative w-full aspect-square max-w-[100px] overflow-hidden bg-gray-200 border-2 border-dashed border-gray-300 rounded-md"
              >
                <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                  <Lock className="text-gray-400 w-5 h-5 mb-1" />
                  <span className="text-[10px] text-gray-400">Locked</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center items-center p-3 mt-4">
        {/* Conditionally show Customize or Add to Cart button */}
  
          <button
            onClick={() => {
              console.log("🎨 Customize button clicked with:", {
                generatedImages: generatedImages?.length,
                currentPostId,
                user: !!user
              });

              if (
                !Array.isArray(generatedImages) ||
                generatedImages.length === 0
              ) {
                console.error("❌ No generated images available");
                toast.error("Please generate an image first");
                return;
              }
              console.log("✅ Opening customize modal");
              setIsCustomizeModalOpen(true);
              fetchArticles(); // Fetch articles when opening customize modal
            }}
            disabled={!Array.isArray(generatedImages) || generatedImages.length === 0}
            className={`px-6 py-3 font-semibold rounded-md shadow-lg transition ${!Array.isArray(generatedImages) || generatedImages.length === 0
                ? "text-gray-400 bg-gray-300 cursor-not-allowed"
                : "text-white bg-gradient-to-r from-purple-400 to-blue-500 hover:opacity-90"
              }`}
          >
            Customize
          </button>
      

        <button
          onClick={() => {
            if (
              !Array.isArray(generatedImages) ||
              generatedImages.length === 0
            ) {
              toast.error("Please generate an image first");
              return;
            }
            setIsModalOpen(true);
          }}
          disabled={!Array.isArray(generatedImages) || generatedImages.length === 0}
          className={`px-6 py-3 font-semibold border border-blue-500 rounded-md shadow-md transition ${!Array.isArray(generatedImages) || generatedImages.length === 0
              ? "text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed"
              : "text-blue-600 bg-white hover:bg-blue-50"
            }`}
        >
          List marketplace
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-6 overflow-y-auto">
          <div className="bg-white rounded-[20px] max-w-6xl w-full my-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="">
              <div className="px-4 sm:px-6 py-4 bg-[rgba(241,242,244,1)] sticky top-0 z-10">
                {/* Heading */}
                <h2 className="text-[20px] font-semibold text-gray-900">
                  Add to Market Place
                </h2>
                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsModalOpen(false);

                    // Clear all modal state
                    setFormData({
                      productName: "",
                      description: "",
                      category: "",
                      subcategory: "",
                      price: "",
                      orientation_ids: [],
                    });
                    setSaving(false);
                    // Clear customization state
                    setIsCustomizationCompleted(false);
                    setCustomizedImages([]);
                    setShowCustomizedImages(false);
                    setCustomizationResponse(null);
                    setIsCustomizeModalOpen(false);
                  }}
                  className="absolute top-5 right-7 text-black text-2xl hover:text-gray-600 z-50"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8">
                {/* Left Image Area */}
                <div className="w-full lg:w-[45%] flex justify-center">
                  {selectedImage ||
                    (Array.isArray(generatedImages) &&
                      generatedImages.length > 0) ? (
                    <div className="w-full max-w-xs">
                      <div
                        className="aspect-square w-full overflow-hidden rounded-md bg-gray-100"
                      >
                        <img
                          src={selectedImage || generatedImages[0]}
                          alt="Generated Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(
                              "Modal image failed to load:",
                              selectedImage || generatedImages[0]
                            );
                            e.currentTarget.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBFcnJvcjwvdGV4dD48L3N2Zz4=";
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-xs">
                      <div
                        className="aspect-square w-full bg-gray-200 rounded-md flex items-center justify-center"
                      >
                        <span className="text-gray-500 text-sm sm:text-base">
                          No image generated yet
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Form Area */}
                <div className="w-full lg:w-[55%]">
                  {/* Product Name */}
                  <div className="mb-3 sm:mb-4">
                    <label className="text-gray-700 font-medium mb-1 block text-sm sm:text-base">
                      Product Name
                    </label>
                    <input
                      value={formData.productName}
                      onChange={handleChange}
                      name="productName"
                      type="text"
                      placeholder="Product Name"
                      className="w-full border border-gray-300 bg-[rgba(241,242,244,1)] rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-3 sm:mb-4">
                    <label className="text-gray-700 font-medium mb-1 block text-sm sm:text-base">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description"
                      className="w-full border border-gray-300 bg-[rgba(241,242,244,1)] rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                    ></textarea>
                  </div>

                  {/* Category & Subcategory */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-full sm:w-1/2">
                      <label className="text-gray-700 font-medium mb-1 block text-sm sm:text-base">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md bg-[rgba(241,242,244,1)] px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option>Select category</option>
                        {categories.map((cat: any) => (
                          <option
                            key={cat.article_category_id}
                            value={cat.article_category_id}
                          >
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="text-gray-700 font-medium mb-1 block text-sm sm:text-base">
                        Subcategory
                      </label>
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md bg-[rgba(241,242,244,1)] px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="">Select subcategory</option>
                        {subCategories.map((sub: any) => (
                          <option
                            key={sub.sub_category_id}
                            value={sub.sub_category_id}
                          >
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Orientation: Multi-checkboxes */}
                  <div className="mb-3 sm:mb-4">
                    <label className="text-gray-700 font-medium mb-2 sm:mb-3 block text-sm sm:text-base">
                      Orientation (select one or more)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {orientations.map((o: any) => {
                        const id = Number(o.orientation_id);
                        const checked = formData.orientation_ids.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => handleOrientationToggle(id)}
                            className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border transition-colors text-xs sm:text-sm ${checked
                                ? "bg-indigo-50 border-indigo-400 ring-1 ring-indigo-200"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              readOnly
                              className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <span className="text-gray-800">{o.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
                      Tip: you can choose multiple orientations.
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center justify-between bg-[#F2F3F6] rounded-md overflow-hidden w-full">
                    <div className="flex items-center bg-[#D9D9D9] px-3 sm:px-4 py-2 border-r border-gray-300">
                      <span className="text-[16px] sm:text-[20px] font-semibold text-gray-800">
                        ₹
                      </span>
                    </div>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      className="flex-1 px-3 sm:px-4 py-2 bg-transparent outline-none text-green-600 font-bold text-[16px] sm:text-[20px]"
                    />
                    <div className="ml-auto pr-3 sm:pr-4 text-xs sm:text-sm text-gray-500 italic">
                      (inclusive of taxes)
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 sm:gap-4 pb-6 sm:pb-8 px-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base text-indigo-500 border border-indigo-300 rounded-[6px] hover:bg-indigo-50 transition shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className={`px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-[6px] shadow-md transition ${saving
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-[#6A5BFF] to-[#9F61FF] text-white hover:from-[#5a4cfb] hover:to-[#8f51fb]"
                    }`}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customize Modal */}
      {isCustomizeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-6">
          <div className="bg-gray-100 rounded-xl w-[90vw] h-[90vh] relative overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsCustomizeModalOpen(false);
                // Reset all customization state when modal is closed
                setIsCustomizationCompleted(false);
                setCustomizedImages([]);
                setShowCustomizedImages(false);
                setCustomizationResponse(null);
                setSelectedArticle(null);
                setSelectedArticleType('');
                setArticles({});
                setQuantity(1);
                setSelectedOrientation('1:1 Square');
                setSelectedColor('Black');
              }}
              className="absolute top-4 right-4 z-50 text-gray-600 hover:text-gray-800 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="w-full h-full p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 h-full">

                {/* Left Side - Main Preview */}
                <div className="flex flex-col">
                  {showCustomizedImages ? (
                    // Show customized images after customization - retain structure
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-center text-green-600">Customized Images</h3>

                      {/* Main Customized Image Display */}
                      <div className="relative rounded-xl overflow-hidden flex-1">
                        <img
                          src={customizedImages[0] || "/assets/images/preview01.jpg"}
                          alt="Main Customized Image"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customizedImages[0]) {
                              window.open(customizedImages[0], "_blank");
                            }
                          }}
                          className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-3 font-medium hover:bg-black/80 focus:outline-none focus:ring-0"
                        >
                          Preview
                        </button>
                      </div>

                      {/* Customized Images Thumbnail Tray */}
                      {customizedImages.length > 1 && (
                        <div className="mt-4 flex gap-2 overflow-x-auto">
                          {customizedImages.map((image, index) => (
                            <div
                              key={index}
                              className={`w-[136px] h-[80px] relative overflow-hidden border-2 rounded-md cursor-pointer flex-shrink-0 ${index === 0 ? 'border-green-500' : 'border-transparent hover:border-green-300'
                                }`}
                              onClick={() => {
                                // Move clicked image to first position for main display
                                const newImages = [...customizedImages];
                                const clickedImage = newImages.splice(index, 1)[0];
                                newImages.unshift(clickedImage);
                                setCustomizedImages(newImages);
                              }}
                            >
                              <img
                                src={image}
                                alt={`Customized ${index + 1}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                              <div className="absolute bottom-1 right-1 bg-green-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                                #{index + 1}
                              </div>
                              {index === 0 && (
                                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                                  ✓
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Customization Details */}
                    
                    </div>
                  ) : (
                    // Show original preview
                    <>
                      <div className="relative rounded-xl overflow-hidden flex-1">
                        <img
                          src={selectedImage || (generatedImages && generatedImages[0]) || "/assets/images/preview01.jpg"}
                          alt="Selected Frame"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => setIsPreviewModalOpen(true)}
                          className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-3 font-medium hover:bg-black/80 focus:outline-none focus:ring-0"
                        >
                          Preview
                        </button>
                      </div>

                      {/* Thumbnail Images */}
                      <div className="mt-4 flex gap-2">
                        {Array.isArray(generatedImages) && generatedImages.slice(0, 4).map((image, i) => (
                          <div
                            key={i}
                            className={`w-[136px] h-[80px] relative overflow-hidden border-2 rounded-md cursor-pointer ${(selectedImage === image || (!selectedImage && i === 0)) ? 'border-blue-500' : 'border-transparent'
                              }`}
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={image}
                              alt={`Thumb ${i + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Right Side - Product Info */}
                <div className="space-y-6 flex flex-col">
                  <h2 className="text-2xl font-semibold leading-tight">
                    {selectedArticle ? `${selectedArticle.name} - ${selectedArticle.category_name}` : 'Black border with Flat lay of photo frame on textured surface'}
                  </h2>
                    {customizationResponse && (
                        <div className="mt-4  p-4 rounded-lg border border-green-200">

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <span className="text-gray-600 font-medium">Product Name:</span>
                                <span className="text-gray-800">{customizationResponse.name || 'N/A'}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-gray-600 font-medium">Category:</span>
                                <span className="text-gray-800">{customizationResponse.category || 'N/A'}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-gray-600 font-medium">Subcategory:</span>
                                <span className="text-gray-800">{customizationResponse.subcategory || 'N/A'}</span>
                              </div>
                              {/* <div className="flex gap-2">
                                <span className="text-gray-600 font-medium">Orientation:</span>
                                <span className="text-gray-800">{customizationResponse.orgientation || 'N/A'}</span>
                              </div> */}
                            <div className="flex gap-2">
                              <span className="text-gray-600 font-medium">Description:</span>
                              <p className="text-gray-800 mt-1">{customizationResponse.description}</p>
                            </div>
                            </div>
                           
                          </div>
                        
                        </div>
                      )}

                  {/* Orientation */}
                  <div>
                    <p className="mb-2 font-medium">Orientation</p>
                    <div className="flex gap-2 flex-wrap">
                      { ['1:1 Square', '2:3 Portrait', '3:4 Traditional', '4:3 Classic'].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedOrientation(opt)}
                          className={`px-4 py-2 border rounded-md transition ${selectedOrientation === opt
                              ? 'border-blue-500 text-blue-600 bg-blue-50'
                              : 'border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                

                  {/* Color */}
                  {/* <div>
                    <p className="mb-2 font-medium">Color</p>
                    <div className="flex gap-3">
                      {[
                        { name: 'Black', bg: 'bg-black' },
                        { name: 'Golden', bg: 'bg-yellow-500' },
                        { name: 'Brown', bg: 'bg-yellow-800' }
                      ].map((color, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedColor(color.name)}
                          className={`px-4 py-2 rounded-md text-white transition ${color.bg} ${
                            selectedColor === color.name ? 'ring-2 ring-blue-400 ring-offset-2' : 'hover:opacity-80'
                          }`}
                        >
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div> */}

                  {/* Article Selection */}
                  {!customizationResponse &&<div>
                    <p className="mb-2 font-medium">Article Type</p>
                    <div className="space-y-3">
                      {/* Article Type Selector - This is already responsive with flex-wrap */}
                      <div className="flex gap-2 flex-wrap">
                        {Object.keys(articles).map((articleType) => (
                          <button
                            key={articleType}
                            onClick={() => {
                              setSelectedArticleType(articleType);
                              // Auto-select first article of this type
                              const firstArticle = articles[articleType][0];
                              if (firstArticle) {
                                setSelectedArticle(firstArticle);
                              }
                            }}
                            className={`px-4 py-2 border rounded-md transition ${selectedArticleType === articleType
                                ? 'border-purple-500 text-purple-600 bg-purple-50'
                                : 'border-gray-300 text-gray-600 hover:border-gray-400'
                              }`}
                          >
                            {articleType}
                          </button>
                        ))}
                      </div>

                      {/* Article Grid - UPDATED FOR RESPONSIVENESS
      - grid-cols-2: Default (mobile)
      - sm:grid-cols-3: Small screens and up (tablets)
      - lg:grid-cols-4: Large screens and up (desktops)
    */}
                      {selectedArticleType && articles[selectedArticleType] && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {articles[selectedArticleType].map((article: any) => (
                            <div
                              key={article.article_id}
                              onClick={() => setSelectedArticle(article)}
                              className={`relative cursor-pointer border-2 rounded-md transition-all ${selectedArticle?.article_id === article.article_id
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
                                      // Use a more robust placeholder
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
                  </div> }
                  

                  {/* Price */}
                  <div className="text-green-600 font-bold text-xl">
                    ₹ {selectedArticle?.article_price || 499} <span className="text-gray-500 text-sm font-normal">(inclusive of taxes)</span>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">

                       
          

                      {showCustomizedImages ? (
                        // Show Add to Cart and Apply buttons after customization
                        <>
                    <div className="flex items-center border rounded overflow-hidden">
                         <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          readOnly
                          value={quantity.toString().padStart(2, '0')}
                          className="w-12 text-center py-2 border-0 focus:outline-none"
                        />
                        <button
                          onClick={() => setQuantity(q => q + 1)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                        </div>
                          <button
                            onClick={handleAddToCart}
                            disabled={!currentPostId || !user}
                            className={`px-6 py-2 rounded-md shadow transition ${!currentPostId || !user
                                ? "text-gray-400 bg-gray-300 cursor-not-allowed"
                                : "text-white bg-green-600 hover:bg-green-700"
                              }`}
                          >
                            Add to Cart
                          </button>
                        
                        </>
                      ) : (
                        // Show Customize button before customization
                        <button
                          onClick={handleCustomizeFromModal}
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-md shadow hover:opacity-90 transition"
                        >
                          Customize
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal for Customize */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl overflow-hidden relative max-w-full max-h-full shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-2 right-2 text-white bg-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800 z-50"
              aria-label="Close Preview"
            >
              ✕
            </button>

            {/* Modal Image */}
            <img
              src={selectedImage || (generatedImages && generatedImages[0]) || "/assets/images/preview01.jpg"}
              alt="Full Preview"
              className="object-contain max-w-full max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
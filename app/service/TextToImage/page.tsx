'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import ImageGeneratorOption from "../../components/Sidebar/ImageGeneratorOption";
import TextToImages from "../../components/TextToImages";
import ImageToImagerRghtSidebar from "../../components/imagetoimagerightsidebar";
import { toast, ToastContainer } from "react-toastify";
import { postRequest } from "../../utils/api";
import { useAuthStore } from "../../store/useAuthStore";
import "react-toastify/dist/ReactToastify.css";

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
}

// Type definition for filter data based on the API response
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
    article_id: string;
    category_name: string;
    article_type: string;
    article_img: string;
    article_price: string;
    name: string;
    total_number: string;
  }[];
}

export default function TextToImagePage() {
  const user = useAuthStore((state) => state.user);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [savingStates, setSavingStates] = useState<{ [key: number]: boolean }>({});
  const [filters, setFilters] = useState<FilterData | null>(null);
  const [showImageComponent, setShowImageComponent] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | number | null>(null);
  const [customizationData, setCustomizationData] = useState<any>(null);

  // Fetch filters on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Get user and session ID from localStorage or user store
        const sess_id = user?.sess_id || localStorage.getItem("session_id");
        const user_id = user?.user_id || localStorage.getItem("user_id");

        // Ensure we have the auth details before making the call
        if (!sess_id || !user_id) {
          console.error("User session not found. Cannot fetch filters.");
          return;
        }

        const body = {
          page: "1",
          query: "",
          sess_id: sess_id,
          user_id: user_id,
        };

        // Use postRequest, withToken is false (default) as auth is in the body
        const res = await postRequest("/filters/list", body);

        if (res?.success && res?.data) {
          setFilters(res.data);
        }
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };

    if (user) {
      fetchFilters();
    }
  }, [user]);

  const handleImageGenerated = (imageUrl: string, prompt: string) => {
    console.log('Single image URL received:', imageUrl);
    
    const newImage: GeneratedImage = {
      url: imageUrl,
      prompt,
      timestamp: new Date(),
    };
    
    setGeneratedImages(prev => [newImage, ...prev]); // Add new image at the beginning
    setShowImageComponent(true); // Show the image component when image is generated
  };

  const handleImagesGenerated = (imageUrls: string[], prompt: string, responseData?: any) => {
    console.log('Multiple images received:', imageUrls);
    console.log('Response data:', responseData);
    
    // Store the post_id from the response for later use with customimage API
    if (responseData?.post_id) {
      setCurrentPostId(responseData.post_id);
      console.log('Stored post_id for customization:', responseData.post_id);
    } else {
      console.log('No post_id found in responseData');
    }
    
    // Create GeneratedImage objects for each URL
    const newImages: GeneratedImage[] = imageUrls.map(url => ({
      url,
      prompt,
      timestamp: new Date(),
    }));
    
    setGeneratedImages(prev => [...newImages, ...prev]); // Add new images at the beginning
    setShowImageComponent(true); // Show the image component when images are generated
  };

  const handleSaveAsProduct = async (imageUrl: string, prompt: string, index: number) => {
    if (!user) {
      toast.error("Please login to save as product");
      return;
    }

    setSavingStates(prev => ({ ...prev, [index]: true }));

    try {
      const response = await postRequest("/post/save", {
        device: "web",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        post_id: 0, // 0 for new post
        article_category_id: "1", // Default category
        sub_category_id: "1", // Default subcategory
        name: prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt,
        image: imageUrl,
        price: "99", // Default price
        description: `AI-generated image from prompt: ${prompt}`,
        orientation_ids: ["1"], // Default orientation
      }, true);

      if (response?.success) {
        toast.success("Image saved as product successfully!");
      } else {
        toast.error(response?.message || "Failed to save as product");
      }
    } catch (error: any) {
      console.error("Error saving as product:", error);
      toast.error(error.message || "Failed to save as product");
    } finally {
      setSavingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleDownloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  const handleImageToImageGenerated = (images: string[]) => {
    console.log('ImageToImage generated images:', images);
    // You can handle the generated images here
    toast.success(`${images.length} image${images.length > 1 ? 's' : ''} generated successfully!`);
  };

  const handleOriginalImageSet = (image: string) => {
    console.log('Original image set:', image);
  };

  const handleArticleApply = async (articleOrResponse: any) => {
    // Check if this is a response object (from TextToImages modal) or an article object (from right sidebar)
    if (articleOrResponse?.success && articleOrResponse?.genrated_img) {
      // This is a response from TextToImages modal customize
      const response = articleOrResponse;
      
      console.log('Handling customize response from modal:', response);
      
      setCustomizationData(response);
      
      // DON'T update the main generated images - keep them separate
      // Customized images will only be shown within the modal
      
      // Update the currentPostId if there's a new one from customization
      if (response.post_id) {
        setCurrentPostId(response.post_id);
      }
      
      return; // Exit early for modal response
    }

    // This is an article object from the right sidebar
    const article = articleOrResponse;
    console.log('Applied article from sidebar:', article);
    console.log('Current post ID state:', currentPostId);
    console.log('User state:', user);
    
    if (!user) {
      toast.error("Please login to customize images");
      return;
    }

    if (!currentPostId) {
      console.log('currentPostId is null/undefined, cannot proceed');
      toast.error("No image generated yet. Please generate an image first.");
      return;
    }

    try {
      const customizePayload = {
        device: "android",
        app_version: "1.0.5",
        user_id: user.user_id,
        sess_id: user.sess_id,
        post_id: currentPostId,
        article_id: article.article_id,
        size: "" // Empty as shown in the example
      };

      console.log('Calling /customimage API with payload:', customizePayload);

      const response = await postRequest("/customimage", customizePayload, true);
      
      console.log('Custom image API response:', response);
      
      if (response?.success) {
        toast.success(`Successfully applied ${article.name} for customization!`);
        
        // Store the customization data but keep showing TextToImages component
        setCustomizationData(response);
        
        // Update the generated images with the new customized images
        if (response.genrated_img && Array.isArray(response.genrated_img)) {
          const newImages: GeneratedImage[] = response.genrated_img.map((url: string) => ({
            url,
            prompt: `Customized with ${article.name}`,
            timestamp: new Date(),
          }));
          setGeneratedImages(newImages);
        }
        
        // Update the currentPostId if there's a new one from customization
        if (response.post_id) {
          setCurrentPostId(response.post_id);
        }
        
        console.log('Updated images with customized results:', response.genrated_img);
      } else {
        toast.error(response?.message || "Failed to customize image");
      }
    } catch (error) {
      console.error('Error calling customimage API:', error);
      toast.error("Failed to customize image. Please try again.");
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
      
      {/* Mobile Layout - Show only ImageGeneratorOption initially, then TextToImages */}
      <div className="block xl:hidden w-full">
        {!showImageComponent ? (
          // Show only ImageGeneratorOption on mobile when no images generated
          <div className="w-full p-4">
            <ImageGeneratorOption 
              onImageGenerated={handleImageGenerated}
              onImagesGenerated={handleImagesGenerated}
              filters={filters} 
            />
          </div>
        ) : (
          // Show only TextToImages component on mobile when images are generated
          <div className="w-full p-4">
            <TextToImages
              generatedImages={generatedImages.map(img => img.url)}
              currentPostId={currentPostId}
              onCustomizeApply={handleArticleApply}
              customizationData={customizationData}
            />
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden xl:flex xl:flex-row w-full">
        {/* Left Sidebar (visible on xl+) */}
        <div className="xl:w-[380px] 2xl:w-[420px]">
          <ImageGeneratorOption 
            onImageGenerated={handleImageGenerated}
            onImagesGenerated={handleImagesGenerated}
            filters={filters} 
          />
        </div>

        {/* Center Content */}
        <div className="xl:flex-1 max-w-full min-w-0 bg-gray-100 p-3 lg:p-6 2xl:p-8">
          {!showImageComponent ? (
            // Show placeholder when no images generated
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No images generated yet</h3>
                <p className="text-gray-500">Enter a prompt on the left sidebar and click "Generate Image" to create your first AI-generated image.</p>
              </div>
            </div>
          ) : (
            // Show TextToImages component when images are generated
            <TextToImages
              generatedImages={generatedImages.map(img => img.url)}
              currentPostId={currentPostId}
              onCustomizeApply={handleArticleApply}
              customizationData={customizationData}
            />
          )}
        </div>

        {/* Right Sidebar (visible on xl+) */}
        <div className="xl:w-[380px] 2xl:w-[420px]">
          <ImageToImagerRghtSidebar onApplyArticle={handleArticleApply} />
        </div>
      </div>
    </>
  );
}

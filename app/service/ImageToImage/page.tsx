"use client";

import React, { useState, useEffect } from "react";
import ImageToImageGenerator from "@/app/components/Sidebar/ImageToImageGenerator";
import ImagesToImages from "@/app/components/ImagestoImages";
import ImageToImagerRghtSidebar from "@/app/components/imagetoimagerightsidebar";
import { useSidebarStore } from "../../store/sidebarStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postRequest } from "@/app/utils/api"; // Assuming aliased path, adjust if needed

// Type definition for your filter data based on the API response
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

export default function ImageToImage() {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterData | null>(null); // State for filters
  const [currentPostId, setCurrentPostId] = useState<string | number | null>(null);
  const [customizationData, setCustomizationData] = useState<any>(null);
  const [showImageComponent, setShowImageComponent] = useState(false);

  // Handle customize apply from ImagesToImages component
  const handleCustomizeApply = (response: any) => {
    console.log('Customization applied:', response);
    
    // Update customization data
    setCustomizationData(response);
    
    // DON'T update the main images - keep them separate
    // Only store customization data for the modal
    
    // Update post_id if provided
    if (response.post_id) {
      setCurrentPostId(response.post_id);
    }
  };

  // Handle images generated from ImageToImageGenerator
  const handleImagesGenerated = (images: string[], postId?: string | number) => {
    console.log('Images generated:', images, 'Post ID:', postId);
    setGeneratedImages(images);
    setShowImageComponent(true); // Show the image component on mobile
    if (postId) {
      setCurrentPostId(postId);
    }
    // Reset customization data when new images are generated
    setCustomizationData(null);
  };

  // Fetch filters on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Get user and session ID from localStorage
        const sess_id = localStorage.getItem("session_id");
        const user_id = localStorage.getItem("user_id");

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

    fetchFilters();
  }, []); // Empty dependency array ensures this runs once on mount

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
      
      {/* Mobile Layout */}
      <div className="block xl:hidden">
        {!showImageComponent ? (
          // Show only ImageToImageGenerator on mobile initially
          <div className="w-full p-4">
            <ImageToImageGenerator
              onImagesGenerated={handleImagesGenerated}
              onOriginalImageSet={setOriginalImage}
              filters={filters}
            />
          </div>
        ) : (
          // Show ImagesToImages component when images are generated
          <div className="w-full bg-gray-100 p-3">
            <ImagesToImages
              generatedImages={generatedImages}
              originalImage={originalImage}
              currentPostId={currentPostId}
              customizationData={customizationData}
              onCustomizeApply={handleCustomizeApply}
            />
          </div>
        )}
      </div>

      {/* Desktop Layout - Same as before */}
      <div className="hidden xl:flex xl:flex-row w-full">
        {/* Left Sidebar (visible on xl+) */}
        <div className="xl:w-[380px] 2xl:w-[420px]">
          <ImageToImageGenerator
            onImagesGenerated={handleImagesGenerated}
            onOriginalImageSet={setOriginalImage}
            filters={filters}
          />
        </div>

        {/* Center Content */}
        <div className="xl:flex-1 max-w-full min-w-0 bg-gray-100 p-6 2xl:p-8">
          <ImagesToImages
            generatedImages={generatedImages}
            originalImage={originalImage}
            currentPostId={currentPostId}
            customizationData={customizationData}
            onCustomizeApply={handleCustomizeApply}
          />
        </div>

        {/* Right Sidebar (visible on xl+) */}
        <div className="xl:w-[380px] 2xl:w-[420px]">
          <ImageToImagerRghtSidebar />
        </div>
      </div>
    </>
  );
}
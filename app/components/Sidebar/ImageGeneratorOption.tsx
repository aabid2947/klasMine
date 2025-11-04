"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles } from 'lucide-react';
import { postRequest } from "../../utils/api";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";
import pkg from "../../../package.json";

interface ImageGeneratorOptionProps {
  onImageGenerated?: (imageUrl: string, prompt: string, responseData?: any) => void;
  onImagesGenerated?: (images: string[], prompt: string, responseData?: any) => void;
  filters?: any;
}


export default function ImageGeneratorOption({ onImageGenerated, onImagesGenerated, filters }: ImageGeneratorOptionProps) {
  const user = useAuthStore((state) => state.user);
  console.log(filters)
  
  // Refs for triggers and modals
  const articleStyleTriggerRef = useRef<HTMLDivElement>(null);
  const orientationTriggerRef = useRef<HTMLDivElement>(null);
  const articleStyleModalRef = useRef<HTMLDivElement>(null); // New ref for the modal
  const orientationModalRef = useRef<HTMLDivElement>(null); // New ref for the modal
  
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [selectedArticleCategory, setSelectedArticleCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const [value, setValue] = useState(1); // Default value for number of images

  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [selectedOrientation, setSelectedOrientation] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  // Initialize selections when filters are loaded
  React.useEffect(() => {
    if (filters?.orientations && filters.orientations.length > 0 && !selectedOrientation) {
      setSelectedOrientation(filters.orientations[0].orientation_id);
    }
    if (filters?.article_style && filters.article_style.length > 0 && !selectedArticleCategory) {
      setSelectedArticleCategory(filters.article_style[0].cat_id);
      if (filters.article_style[0].sub_cat.length > 0) {
        setSelectedSubCategory(filters.article_style[0].sub_cat[0].sub_category_id);
      }
    }
  }, [filters]);

  // Handle outside clicks to close modals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close article style modal if clicked outside BOTH the trigger and the modal
      if (
        isSizeOpen &&
        articleStyleTriggerRef.current && 
        !articleStyleTriggerRef.current.contains(target) &&
        articleStyleModalRef.current && 
        !articleStyleModalRef.current.contains(target)
      ) {
        setIsSizeOpen(false);
      }
      
      // Close orientation modal if clicked outside BOTH the trigger and the modal
      if (
        isStyleOpen &&
        orientationTriggerRef.current && 
        !orientationTriggerRef.current.contains(target) &&
        orientationModalRef.current && 
        !orientationModalRef.current.contains(target)
      ) {
        setIsStyleOpen(false);
      }
    };

    // Add event listener when any modal is open
    if (isSizeOpen || isStyleOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSizeOpen, isStyleOpen]); // Dependencies are correct

  // Get selected orientation object
  const getSelectedOrientationObj = () => {
    return filters?.orientations?.find((o: any) => o.orientation_id === selectedOrientation);
  };

  // Get selected article category object
  const getSelectedArticleCategoryObj = () => {
    return filters?.article_style?.find((c: any) => c.cat_id === selectedArticleCategory);
  };

  // Get selected sub-category object
  const getSelectedSubCategoryObj = () => {
    if (!selectedArticleCategory || !selectedSubCategory || !filters?.article_style) {
      return null;
    }
    // 1. Find the parent category
    const category = filters.article_style.find((c: any) => c.cat_id === selectedArticleCategory);
    if (!category || !category.sub_cat) {
      return null;
    }
    // 2. Find the sub-category from the parent
    return category.sub_cat.find((sc: any) => sc.sub_category_id === selectedSubCategory);
  };

  const handleSelectArticleCategory = (categoryId: string, subCategoryId?: string) => {
    setSelectedArticleCategory(categoryId);
    // If a sub-category is clicked, set it and close the modal
    if (subCategoryId) {
      setSelectedSubCategory(subCategoryId);
      setIsSizeOpen(false);
    } 
    // If a main category (without sub-cats) is clicked
    else {
      // Clear the sub-category selection (in case one was selected from another category)
      setSelectedSubCategory(null);
      // Find the category to see if it has sub-cats
      const category = filters.article_style.find((c: any) => c.cat_id === categoryId);
      // If it has NO sub-cats, it's a direct selection, so close the modal
      if (category && category.sub_cat.length === 0) {
        setIsSizeOpen(false);
      }
      // If it *does* have sub-cats, the modal stays open for the user to pick one
    }
  };

  const handleSelectOrientation = (orientationId: string) => {
    if (!orientationId) return;
    setSelectedOrientation(orientationId);
    setIsStyleOpen(false);
  };

  const enhancePrompt = async () => {
    if (!user) {
      toast.error("Please login to enhance prompts");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt to enhance");
      return;
    }

    setIsEnhancing(true);
    
    try {
      // Create FormData payload instead of JSON
      const formData = new FormData();
      formData.append("device", "android");
      formData.append("app_version", "1.0.5");
      formData.append("user_id", user.user_id);
      formData.append("sess_id", user.sess_id);
      formData.append("content", prompt.trim());

      console.log("Sending enhance prompt request with FormData payload");

      // Use fetch instead of postRequest for FormData
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prompt/enhence`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      });

      const responseData = await response.json();

      // Check if redirect is true - session expired
      if (responseData?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }

      if (responseData?.success && responseData?.data) {
        console.log("Enhanced prompt response:", responseData);
        
        // Extract the enhanced prompt from the response
        // The API returns the enhanced prompt directly in responseData.data as a string
        const enhancedPrompt = responseData.data;
        
        if (enhancedPrompt && typeof enhancedPrompt === 'string') {
          setPrompt(enhancedPrompt);
          setEnabled(true); // Keep enhance toggle on after successful enhancement
          toast.success("Prompt enhanced successfully!");
        } else {
          toast.error("No enhanced prompt received");
        }
      } else {
        toast.error(responseData?.message || "Failed to enhance prompt");
      }
    } catch (error: any) {
      console.error("Error enhancing prompt:", error);
      toast.error(error.message || "Failed to enhance prompt");
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateImage = async () => {
    if (!user) {
      toast.error("Please login to generate images");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate an image");
      return;
    }

    setIsLoading(true);
    
    try {
      const payload = {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: user.user_id,
        sess_id: user.sess_id,
        prompt: prompt.trim(),
        style: selectedArticleCategory || "1", // Default to "1" if not selected
        substyle: selectedSubCategory || "1", // Default to "1" if not selected  
        size: selectedOrientation || "1", // Default to "1" if not selected
        noofimg: value.toString() // Number of images from slider (1-4)
      };

      console.log("Sending text-to-image request with payload:", payload);
      console.log("Selected filters:", {
        articleCategory: getSelectedArticleCategoryObj()?.cat_name,
        orientation: getSelectedOrientationObj()?.name,
        numberOfImages: value
      });

      const response = await postRequest("/prompt/generate", payload, true); // withToken: true for authenticated request

      // Check if redirect is true - session expired
      if (response?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }

      if (response?.success && response?.data) {
        console.log("Text-to-image API Response:", response);
        
        // Handle both single image and multiple images response
        let imageUrls = [];
        if (response.data.publicUrl) {
          // If publicUrl is an array (multiple images)
          if (Array.isArray(response.data.publicUrl)) {
            imageUrls = response.data.publicUrl;
          } else {
            // If publicUrl is a single string
            imageUrls = [response.data.publicUrl];
          }
        }
        
        const imageCount = imageUrls.length;
        toast.success(`${imageCount} image${imageCount > 1 ? 's' : ''} generated successfully!`);
        
        // Call appropriate callback function based on what's available
        if (onImagesGenerated && imageUrls.length > 0) {
          // Use the multiple images callback if available - pass full response (not just response.data)
          console.log('Passing full response to onImagesGenerated callback');
          onImagesGenerated(imageUrls, prompt.trim(), response);
        } else if (onImageGenerated && imageUrls.length > 0) {
          // Fallback to single image callback with first image
          onImageGenerated(imageUrls[0], prompt.trim(),response);
        }
        
        // Clear the prompt for next generation
        setPrompt("");
      } else {
        toast.error(response?.message || "Failed to generate image");
      }
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-65px)] text-black w-[360px] 2xl:w-[420px] p-6 border-r border-gray-300 bg-white flex">
      <div className="w-full">
        <h2 className="text-xl font-normal mb-4">Generate an Image</h2>

        <textarea
          className="w-full h-24 p-3 border border-gray-400 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading || isEnhancing}
        />

        <div className="flex items-center justify-between py-2 w-full max-w-md bg-white rounded-lg">
          {/* Left Icon + Text */}
          <div className="flex items-center gap-3">
            <div className="">
              <img className="w-[32px]" src="/assets/images/icon/enhance.svg" alt="enhance" />
            </div>
            <span className="text-lg font-medium text-gray-800">Enhance</span>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => {
              if (!enabled) {
                // User is turning on enhance - call enhancePrompt
                enhancePrompt();
              } else {
                // User is turning off enhance
                setEnabled(false);
              }
            }}
            disabled={isEnhancing}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
              enabled ? 'bg-blue-500' : 'bg-gray-200'
            } ${isEnhancing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                enabled ? 'translate-x-6' : ''
              }`}
            >
              {isEnhancing && (
                <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          </button>
        </div>

        {/* Article Style Dropdown */}
        <div 
          ref={articleStyleTriggerRef}
          onClick={() => !(isLoading || isEnhancing) && setIsSizeOpen(!isSizeOpen)} 
          className={`w-full max-w-sm flex items-center mt-4 justify-between p-3 border border-gray-300 rounded-md bg-white relative ${
            isLoading || isEnhancing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-400'
          }`}
        >
          <div className="flex">
            <label className="w-[170px] flex items-center gap-2 cursor-pointer">
              <img src="/assets/images/icon/style-list.svg" alt="orientation" />
              <span className="text-gray-700 font-medium">Article Style</span>
            </label>
            <span className="text-sm text-gray-700/50">
              #{(getSelectedSubCategoryObj()?.name || getSelectedArticleCategoryObj()?.cat_name) || 'Select Style'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isSizeOpen ? "rotate-180" : "rotate-0"}`}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path stroke="currentColor" strokeWidth="2" d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {isSizeOpen && !(isLoading || isEnhancing) && filters?.article_style && (
          <div 
            ref={articleStyleModalRef} 
            className="absolute max-w-[370px] w-full left-[590px] top-[200px] mt-2 border border-gray-300 rounded-md bg-white shadow-lg z-10 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              {filters.article_style.map((category: any) => (
                <div key={category.cat_id} className="mb-4">
                  <h4 className="text-sm font-semibold text-[16px] text-black px-2 mb-2">
                    {category.cat_name}
                  </h4>
                  {category.sub_cat.length > 0 ? (
                    <ul className="flex flex-wrap">
                      {category.sub_cat.map((subCat: any) => (
                        <li
                          key={subCat.sub_category_id}
                          className="flex w-1/2 items-center gap-2 c-select-image p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectArticleCategory(category.cat_id, subCat.sub_category_id);
                          }}
                        >
                          <input 
                            type="radio" 
                            name="articleStyle"
                            checked={selectedArticleCategory === category.cat_id && selectedSubCategory === subCat.sub_category_id}
                            onChange={() => {}}
                            className="accent-blue-500"
                          />
                          <label className="flex relative items-center gap-2 cursor-pointer w-full">
                            {subCat.image ? (
                              <img src={subCat.image} alt={subCat.name} className="w-full h-auto" />
                            ) : (
                              <div className="w-full h-16 bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">{subCat.name}</span>
                              </div>
                            )}
                            <p className="text-sm absolute bg-white/10 bottom-0 w-full backdrop-blur-sm text-center p-[4px_0px] text-white">
                              {subCat.name}
                            </p>
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    // This handles categories with NO sub-categories
                    <div 
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectArticleCategory(category.cat_id); // No sub-id passed
                      }}
                    >
                      <input 
                        type="radio" 
                        name="articleStyle"
                        // Check only against the main category
                        checked={selectedArticleCategory === category.cat_id && !selectedSubCategory}
                        onChange={() => {}}
                        className="accent-blue-500"
                      />
                      <span>{category.cat_name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orientation Dropdown */}
        <div 
          ref={orientationTriggerRef}
          onClick={() => !(isLoading || isEnhancing) && setIsStyleOpen(!isStyleOpen)} 
          className={`w-full max-w-sm flex items-center mt-4 justify-between p-3 border border-gray-300 rounded-md bg-white relative ${
            isLoading || isEnhancing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-400'
          }`}
        >
          <div className="flex">
            <label className="flex w-[170px] items-center gap-2 cursor-pointer">
             
               <img src="/assets/images/icon/square.svg" alt="article style" />
              <span className="text-gray-700 font-medium">Orientation</span>
            </label>
            <span className="text-sm text-gray-700/50">
              #{getSelectedOrientationObj()?.name || 'Select Orientation'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isStyleOpen ? "rotate-180" : "rotate-0"}`}
              viewBox="0 0 24 24"
              fill="none">
              <path stroke="currentColor" strokeWidth="2" d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* --- 🚀 START OF UI CHANGE --- */}
        {isStyleOpen && !(isLoading || isEnhancing) && filters?.orientations && (
          <div 
            ref={orientationModalRef} 
            className="absolute max-w-[370px] pt-5 w-full left-[590px] top-[200px] mt-2 border border-gray-300 rounded-md bg-white shadow-lg z-10"
          >
            <h4 className="text-sm font-semibold text-[16px] text-black px-4 mb-2">Orientations</h4>
            {/* Changed from flex-wrap to flex-col */}
            <ul className="p-2 flex flex-col gap-1">
              {filters.orientations.map((orientation: any) => (
                <li 
                  key={orientation.orientation_id} 
                  // Updated classes for list view
                  className="flex w-full items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOrientation(orientation.orientation_id);
                  }}
                >
                  <input 
                    type="radio" 
                    name="orientation"
                    checked={selectedOrientation === orientation.orientation_id}
                    onChange={() => {}}
                    className="accent-blue-500" 
                  />
                  {/* Icon */}
                  <img 
                    src={orientation.img} 
                    alt={orientation.name} 
                    className="w-5 h-5 object-contain" 
                  />
                  {/* Name */}
                  <span className="text-sm text-gray-800">{orientation.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* --- 🚀 END OF UI CHANGE --- */}

      <div className="mt-5">
        <h4 className="text-lg text-left font-normal mb-5">Image to create</h4>
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <div className="relative w-full">
            {/* Slider Input */}
            <input
              type="range"
              min="1"
              max="4"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              disabled={isLoading || isEnhancing}
              className="w-full relative cursor-pointer bg-transparentrelative z-[99999] top-[-6px] opacity-0"
            />

            {/* Custom Track */}
            <div className="absolute top-[0px] inset-0 h-2 bg-gray-300 rounded-full"></div>

            {/* Custom Handle */}
            <div
              className="absolute  left-0 translate-y-[-33px]  translate-x-[-10px] w-6 h-6 rounded-full bg-[linear-gradient(112.06deg,#C289FF_-6.95%,#5555FF_59.24%)] transition-all"
              style={{ left: `${(value - 1) * 33.3}%` }} // Adjust position dynamically
            ></div>

            {/* Number Labels */}
            <div className="flex justify-between mt-1">
              {[1, 2, 3, 4].map((num) => (
                <span key={num} className="text-sm font-medium">
                  {num}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

        {/* Generate Button */}
        <button
          onClick={generateImage}
          disabled={isLoading || isEnhancing || !prompt.trim() || !user}
          className={`mt-6 w-full py-3 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isLoading || isEnhancing || !prompt.trim() || !user
              ? "bg-gray-400 cursor-not-allowed text-gray-600"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Image
            </>
          )}
        </button>
        
        {!user && (
          <p className="mt-2 text-sm text-red-500 text-center">
            Please login to generate images
          </p>
        )}
      </div>
    </div>
  );
}
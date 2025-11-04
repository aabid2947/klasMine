"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface CustomizationOptions {
  frameType: string;
  frameStyle: string;
  cupType: string;
  cupStyle: string;
  orientation: string;
  color: string;
  quantity: number;
}

interface ImageCustomizerProps {
  selectedImage: string | null;
  onCustomizationChange: (options: CustomizationOptions) => void;
  onAddToCart: () => void;
  isLoggedIn: boolean;
  isAddingToCart?: boolean;
}

const frameOptions = [
  { id: 'frame01', name: 'Classic Frame', image: '/assets/images/frame01.jpg' },
  { id: 'frame02', name: 'Modern Frame', image: '/assets/images/frame02.jpg' },
  { id: 'frame03', name: 'Vintage Frame', image: '/assets/images/frame03.jpg' },
  { id: 'frame04', name: 'Elegant Frame', image: '/assets/images/frame04.jpg' },
];

const cupOptions = [
  { id: 'mug01', name: 'Classic Mug', image: '/assets/images/mug01.jpg' },
  { id: 'mug02', name: 'Coffee Mug', image: '/assets/images/mug02.jpg' },
  { id: 'mug03', name: 'Travel Mug', image: '/assets/images/mug03.jpg' },
  { id: 'mug04', name: 'Designer Mug', image: '/assets/images/mug04.jpg' },
];

const orientations = [
  { id: '1:1', name: '1:1 Square' },
  { id: '2:3', name: '2:3 Portrait' },
  { id: '3:4', name: '3:4 Traditional' },
  { id: '4:3', name: '4:3 Classic' },
];

const colors = [
  { id: 'black', name: 'Black', color: '#000000' },
  { id: 'white', name: 'White', color: '#FFFFFF' },
  { id: 'brown', name: 'Brown', color: '#7b4c3c' },
  { id: 'golden', name: 'Golden', color: '#FFD700' },
];

export default function ImageCustomizer({ 
  selectedImage, 
  onCustomizationChange, 
  onAddToCart, 
  isLoggedIn,
  isAddingToCart = false 
}: ImageCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'frames' | 'cups'>('frames');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  const [customization, setCustomization] = useState<CustomizationOptions>({
    frameType: frameOptions[0].id,
    frameStyle: frameOptions[0].name,
    cupType: cupOptions[0].id,
    cupStyle: cupOptions[0].name,
    orientation: orientations[0].id,
    color: colors[0].id,
    quantity: 1,
  });

  // Notify parent component of customization changes
  useEffect(() => {
    onCustomizationChange(customization);
  }, [customization, onCustomizationChange]);

  const updateCustomization = (updates: Partial<CustomizationOptions>) => {
    setCustomization(prev => ({ ...prev, ...updates }));
  };

  const getCurrentPreviewImage = () => {
    return activeTab === 'frames' 
      ? frameOptions.find(f => f.id === customization.frameType)?.image
      : cupOptions.find(c => c.id === customization.cupType)?.image;
  };

  const getCurrentPrice = () => {
    const basePrice = activeTab === 'frames' ? 499 : 299;
    return basePrice * customization.quantity;
  };

  if (!selectedImage) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Generate an image to start customizing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Product Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('frames')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'frames'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🖼️ Frames
        </button>
        <button
          onClick={() => setActiveTab('cups')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'cups'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ☕ Cups & Mugs
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Live Preview */}
        <div className="relative">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Live Preview</h3>
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
            <div className="relative w-full h-64 bg-gray-100">
              {/* Base Image */}
              <Image
                src={selectedImage}
                alt="Selected image"
                fill
                className="object-cover"
              />
              
              {/* Frame/Cup Overlay */}
              {getCurrentPreviewImage() && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={getCurrentPreviewImage()!}
                      alt={`${activeTab} preview`}
                      fill
                      className="object-contain opacity-80 mix-blend-multiply"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-2 text-sm font-medium hover:bg-black/80 focus:outline-none focus:ring-0"
            >
              Preview Full Size
            </button>
          </div>
        </div>

        {/* Product Selection */}
        {activeTab === 'frames' ? (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Choose Frame Style</h4>
            <div className="grid grid-cols-2 gap-3">
              {frameOptions.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => updateCustomization({ 
                    frameType: frame.id, 
                    frameStyle: frame.name 
                  })}
                  className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                    customization.frameType === frame.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={frame.image}
                    alt={frame.name}
                    width={120}
                    height={80}
                    className="w-full h-16 object-cover"
                  />
                  <div className="p-2 text-xs text-center font-medium">
                    {frame.name}
                  </div>
                  {customization.frameType === frame.id && (
                    <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Choose Cup Style</h4>
            <div className="grid grid-cols-2 gap-3">
              {cupOptions.map((cup) => (
                <button
                  key={cup.id}
                  onClick={() => updateCustomization({ 
                    cupType: cup.id, 
                    cupStyle: cup.name 
                  })}
                  className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                    customization.cupType === cup.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={cup.image}
                    alt={cup.name}
                    width={120}
                    height={80}
                    className="w-full h-16 object-cover"
                  />
                  <div className="p-2 text-xs text-center font-medium">
                    {cup.name}
                  </div>
                  {customization.cupType === cup.id && (
                    <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Orientation */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Orientation</h4>
          <div className="grid grid-cols-2 gap-2">
            {orientations.map((orientation) => (
              <button
                key={orientation.id}
                onClick={() => updateCustomization({ orientation: orientation.id })}
                className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                  customization.orientation === orientation.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {orientation.name}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Color</h4>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => updateCustomization({ color: color.id })}
                className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md border transition-colors ${
                  customization.color === color.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.color }}
                />
                {color.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-green-600 font-bold text-lg">
            ₹ {getCurrentPrice().toLocaleString()}
            <span className="text-gray-500 text-sm font-normal ml-2">
              (inclusive of taxes)
            </span>
          </div>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border rounded overflow-hidden">
              <button 
                onClick={() => updateCustomization({ quantity: Math.max(1, customization.quantity - 1) })}
                className="px-3 py-1 hover:bg-gray-100 text-sm"
              >
                -
              </button>
              <input 
                type="text" 
                readOnly 
                value={customization.quantity.toString().padStart(2, '0')} 
                className="w-12 text-center text-sm border-0 focus:ring-0" 
              />
              <button 
                onClick={() => updateCustomization({ quantity: customization.quantity + 1 })}
                className="px-3 py-1 hover:bg-gray-100 text-sm"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={onAddToCart}
            disabled={!isLoggedIn || isAddingToCart}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              isLoggedIn && !isAddingToCart
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm hover:from-blue-600 hover:to-indigo-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAddingToCart 
              ? 'Adding to Cart...' 
              : isLoggedIn 
                ? 'Add to Cart' 
                : 'Login to Add to Cart'
            }
          </button>
        </div>
      </div>

      {/* Full Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl overflow-hidden relative max-w-4xl max-h-[90vh] shadow-2xl">
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 z-50"
              aria-label="Close Preview"
            >
              ✕
            </button>

            <div className="relative w-full max-w-2xl h-96">
              <Image
                src={selectedImage}
                alt="Full preview"
                fill
                className="object-contain"
              />
              
              {getCurrentPreviewImage() && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={getCurrentPreviewImage()!}
                      alt={`${activeTab} preview`}
                      fill
                      className="object-contain opacity-80 mix-blend-multiply"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-600">
                {activeTab === 'frames' ? customization.frameStyle : customization.cupStyle} • 
                {orientations.find(o => o.id === customization.orientation)?.name} • 
                {colors.find(c => c.id === customization.color)?.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
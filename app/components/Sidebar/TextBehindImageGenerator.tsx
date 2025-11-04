"use client";

import React, { useState } from "react";

export default function TextBehindImageGenerator() {
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Inter");
  const fontOptions = ["Inter", "Poppins", "Roboto", "Lato", "Montserrat"];

  return (
    <div className="text-black p-6 border-r border-gray-300 bg-white w-full max-w-md">
      <h2 className="text-xl font-semibold mb-6">Generate Images</h2>

      {/* Upload Box */}
      <label className="block cursor-pointer w-full border border-[#3B82F6] rounded-lg mb-6 bg-gray-100 text-center py-8 px-4 hover:bg-gray-200 transition-colors">
        <div className="flex flex-col items-center justify-center gap-2">
          <img className="w-8" src="/assets/images/icon/upload-images.svg" alt="Upload" />
          <span className="text-gray-800 text-base font-medium">Upload image</span>
        </div>
        <input type="file" accept="image/*" className="hidden" />
      </label>

      {/* Textarea */}
      <textarea
        className="w-full h-24 px-4 py-3 border border-gray-300 rounded-md bg-gray-100 placeholder:text-gray-500 text-sm mb-6"
        placeholder="Enter text"
      />

      {/* Text Color */}
  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg mb-4">
  <span className="text-gray-900 font-medium">Text Color</span>

  <div className="flex items-center gap-3">
    <span className="text-gray-500 text-sm">{textColor}</span>
    <input
      type="color"
      value={textColor}
      onChange={(e) => setTextColor(e.target.value)}
      className="w-6 h-6 border-0 rounded-md appearance-none cursor-pointer"
    />
  </div>
</div>

      {/* Font Family */}
      <div className="w-full bg-gray-100 rounded-md px-4 py-3 mb-6 flex justify-between items-center">
        <label className="text-gray-800 font-medium">Font Family</label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="bg-transparent text-gray-600 text-sm focus:outline-none"
        >
          {fontOptions.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Sliders */}
      <Slider label="X Position" value="100" />
      <Slider label="Y Position" value="100" />
      <Slider label="Text Size" value="50%" />
      <Slider label="Font Weight" value="50%" />
      <Slider label="Letter Spacing" value="0%" />
      <Slider label="Text Opacity" value="100%" />
      <Slider label="Rotation" value="0°" />
      <Slider label="Horizontal Tilt (3D effect)" value="20%" />
      <Slider label="Horizontal Tilt (3D effect)" value="20%" />
    </div>
  );
}

// Slider Component
function Slider({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1 text-sm text-gray-700">
        <span>{label}</span>
        <span className="text-gray-500">{value}</span>
      </div>
      <input
        type="range"
        className="w-full accent-indigo-500"
        min="0"
        max="100"
      />
    </div>
  );
}

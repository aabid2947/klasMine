"use client";

import React, { useState } from "react";
import Link from "next/link";

// Props ke liye type
export type CardProps = {
  post_id: string;
  name: string;
  user_name: string;
  price: string;
  image_url: string;
  description: string;
  article_category_name: string;
  currency_symbol: string;
};

export default function ProductCard({
  post_id,
  name,
  user_name,
  price,
  image_url,
  description,
  article_category_name,
  currency_symbol,
}: CardProps) {
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden group relative hover:shadow-lg transition break-inside-avoid">
        {/* Product Image */}
        <img src={image_url} alt={name} className="w-full object-cover" />

        {/* Hover icons */}
        <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition">
          <button
            className="p-2 rounded-full cursor-pointer"
            onClick={() => {
              setModalImage(image_url);
              setShowModal(true);
            }}
          >
            <img src="/assets/images/icon/zoom-search.svg" alt="zoom" />
          </button>
          <button className="p-2 rounded-full cursor-pointer">
            <img src="/assets/images/icon/white-cart.svg" alt="Cart" />
          </button>
        </div>

        {/* Details */}
        <div className="p-4">
          <h2 className="text-sm text-gray-700 font-semibold">{name}</h2>
          <p className="text-xs text-gray-500 mt-1">By {user_name}</p>

          <div className="flex justify-between items-center mt-2">
            <p className="text-green-600 font-bold">{currency_symbol}{price}</p>

            <Link
              href={`/products/${post_id}`}
              className="text-white px-6 py-2 rounded-full text-sm hover:bg-blue-700 transition"
              style={{
                background: "linear-gradient(90deg, #3BAAFF 0%, #5556FF 100%)",
              }}
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <img src={modalImage} alt="Zoomed" className="w-full h-auto" />
            <button
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

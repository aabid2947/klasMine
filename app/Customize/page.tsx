"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { postRequest } from '../utils/api';
import { toast } from 'react-toastify';

export default function ProductPreview() {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [articles, setArticles] = useState<any>({});
  const [selectedArticleType, setSelectedArticleType] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchArticles();
    }
  }, [user]);

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

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className='h-[calc(100vh-65px)] bg-gray-100'>
      <div className="max-w-6xl mx-auto px-4 py-8  grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Main Preview */}
        <div>
          <div className="relative rounded-xl overflow-hidden">
              <Image
                src="/assets/images/preview01.jpg"
                alt="Selected Frame"
                width={600}
                height={600}
                className="rounded-xl"
              />
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
            <Image
              src="/assets/images/preview01.jpg"
              alt="Full Preview"
              width={800}
              height={800}
              className="object-contain max-w-full max-h-[90vh]"
            />
          </div>
        </div>
      )}

          {/* Thumbnail Images */}
          <div className="mt-4 flex mx-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-20 h-16 w-[136px] h-[80px] relative overflow-hidden border-2 rounded-md ${i === 1 ? 'border-blue-500' : 'border-transparent'}`}>
                <Image
                  src={`/assets/images/print${i.toString().padStart(2, '0')}.jpg`}
                  alt={`Thumb ${i}`}
                  fill
                  className="object-cover rounded-md"
                />
            </div>
            ))}
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold leading-tight">
            Black border with Flat lay of photo frame on textured surface
          </h2>

          {/* Orientation */}
          <div>
            <p className="mb-1 font-medium">Orientation</p>
            <div className="flex gap-2 flex-wrap">
              {['1:1 Square', '2:3 Portrait', '3:4 Traditional', '4:3 Classic'].map((opt, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 border rounded-md ${i === 0 ? 'border-blue-500 text-blue-600' : 'border-gray-300 text-gray-600'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Article Selection */}
          <div>
            <p className="mb-2 font-medium">Article Type</p>
            <div className="space-y-3">
              {/* Article Type Selector */}
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

              {/* Article Grid */}
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
          </div>

       

          {/* Price */}
          <div className="text-green-600 font-bold text-xl">
            ₹ {selectedArticle?.article_price || 499} <span className="text-gray-500 text-sm font-normal">(inclusive of taxes)</span>
          </div>

          {/* Quantity & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2">-</button>
              <input type="text" readOnly value={quantity.toString().padStart(2, '0')} className="w-10 text-center" />
              <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2">+</button>
            </div>

            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-md shadow">
              Add to Cart
            </button>
          </div>

          <button className="border border-blue-500 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50">
            List Market Place
          </button>
        </div>
      </div>
    </div>
  );
}
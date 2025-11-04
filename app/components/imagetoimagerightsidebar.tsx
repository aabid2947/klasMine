"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { postRequest } from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';

export interface ArticleItem {
  article_id: string;
  category_name: string;
  article_type: string;
  article_img: string;
  article_price: string;
  name: string;
  total_number: string;
}

interface ArticleStyle {
  category_id: string;
  name: string;
  img: string | null;
  total_number: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    article_style: ArticleStyle[];
    allarticle: Record<string, ArticleItem[]>;
    orientations: any[];
  };
}

interface ImageToImagerRghtSidebarProps {
  onApplyArticle?: (article: ArticleItem) => void;
}

export default function ImageToImagerRghtSidebar({ 
  onApplyArticle 
}: ImageToImagerRghtSidebarProps) {
  const [groupedArticles, setGroupedArticles] = useState<Record<string, ArticleItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await postRequest('/filters/list', {
        page: "1",
        query: "",
        sess_id: user?.sess_id || "",
        user_id: user?.user_id || ""
      });

      if (response?.success && response?.data) {
        if (response.data.allarticle) {
          console.log('Received grouped articles:', response.data.allarticle);
          setGroupedArticles(response.data.allarticle);
        }
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleSelect = (article: ArticleItem) => {
    setSelectedArticle(article);
  };

  const handleApplyArticle = () => {
    if (selectedArticle && onApplyArticle) {
      onApplyArticle(selectedArticle);
    }
  };

  // Articles are now pre-grouped by the API response
  
  if (loading) {
    return (
      <div className="mx-auto px-4 py-8 h-[calc(100vh-65px)] overflow-y-scroll">
        <h1 className="text-2xl font-semibold mb-2">Customize</h1>
        <hr className="mb-6" />
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto px-4 py-8 h-[calc(100vh-65px)] overflow-y-scroll">
        <h1 className="text-2xl font-semibold mb-2">Customize</h1>
        <hr className="mb-6" />
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchArticles}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto px-4 py-8 h-[calc(100vh-65px)] overflow-y-scroll">
      <h1 className="text-2xl font-semibold mb-2">Article</h1>
      <hr className="mb-6" />

      {/* Selection Status and Apply Button */}
   

      {/* All Articles Section */}
      <div className="mb-10">
       
        
        {Object.keys(groupedArticles).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No articles available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedArticles).map(([categoryType, articles]) => (
              <div key={categoryType} className="mb-8">
                {/* Category Subheading */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">
                    {categoryType}
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {articles.length} items
                  </span>
                </div>
                
                {/* Articles Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {articles.map((article) => (
                    <div 
                      key={article.article_id} 
                      className={`aspect-[4/3] relative w-full group cursor-pointer border-2 rounded-md transition-all ${
                        selectedArticle?.article_id === article.article_id 
                          ? 'border-purple-500 ring-2 ring-purple-200 shadow-lg' 
                          : 'border-transparent hover:border-purple-300'
                      }`}
                      onClick={() => handleArticleSelect(article)}
                    >
                      <div className="relative w-full h-full">
                        {article.article_img ? (
                          <img
                            src={article.article_img}
                            alt={article.name}
                            className="w-full h-full object-cover rounded-md shadow hover:shadow-lg transition-shadow"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/assets/images/placeholder.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>
                 
                      
                      {/* Article details overlay */}
                      {/* <div className="  p-2 rounded-b-md">
                     
                       
                          <p className="text-black text-sm font-semibold">₹{article.article_price}</p>
                    
                      </div> */}
                      
                      {/* Hover overlay with more details */}
                  
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
    </div>
  );
}

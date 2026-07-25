import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ALBUM_CATEGORIES, CategoryData } from "./albumData";
import { CategoryCard } from './CategoryCard';
import { AlbumGallery } from './AlbumGallery';
import { Services } from './../services';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY_MANAGER;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const AlbumsSection: React.FC = () => {
  const [categories, setCategories] = useState<(CategoryData & { count?: number })[]>(ALBUM_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Завантаження фотографій та підрахунок кількості з бази даних Supabase
  useEffect(() => {
    const fetchAlbumImages = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .eq('section', 'Альбоми'); // Фільтруємо тільки розділ 'Альбоми'

        if (error) throw error;

        if (data) {
          const updatedCategories = ALBUM_CATEGORIES.map((cat) => {
            const matchedImages = data
              .filter((item) => item.category === cat.title)
              .map((item) => item.image_url);

            return {
              ...cat,
              galleryImages: matchedImages.length > 0 ? matchedImages : cat.galleryImages,
              coverImage: matchedImages.length > 0 ? matchedImages[0] : cat.coverImage,
            };
          });

          setCategories(updatedCategories);
        }
      } catch (err) {
        console.error('Помилка завантаження альбомів:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumImages();
  }, []);

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setShowCalculator(false);
  };

  if (showCalculator) {
    return (
      <div className="relative">
         <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-16 pt-25">
            <button
              onClick={() => setShowCalculator(false)}
              className="text-sm font-medium text-gray-500 hover:text-black flex items-center gap-2 mb-4"
            >
              <span>←</span> Назад до альбомів
            </button>
            <h2 className="text-2xl font-bold mb-2">Калькулятор вартості</h2>
            {selectedCategory && (
              <p className="text-gray-600 mb-8">Розрахунок для: {selectedCategory.title}</p>
            )}
         </div>
         <Services />
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <AlbumGallery
        category={selectedCategory}
        onBack={handleBackToCategories}
        onOpenCalculator={() => setShowCalculator(true)}
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl h-screen mx-auto flex items-center justify-center">
        <p className="text-gray-500 text-sm tracking-widest uppercase">Завантаження альбомів...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 mt-24 min-h-screen">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">Альбоми</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto pt-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>

      {/* Велика кнопка калькулятора внизу сторінки вибору категорій */}
      <div className="flex flex-col items-center justify-center border-t border-gray-200 mt-16 pt-8 pb-8">

        <button
          onClick={() => {
            setSelectedCategory(null);
            setShowCalculator(true);
          }}
          className="w-full sm:w-auto px-10 py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:scale-[1.01]"
        >
          Розрахувати вартість альбому
        </button>
      </div>
    </div>
  );
};

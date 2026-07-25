import React, { useState } from 'react';
import { CategoryData } from './albumData';
import { PortfolioLightbox } from '../portfolio/PortfolioLightbox';

interface AlbumGalleryProps {
  category: CategoryData & { galleryImages?: string[] };
  onBack: () => void;
  onOpenCalculator: () => void;
}

// Функція розбиття масиву на колонки (Masonry сітка, як у портфоліо)
const getDistributedColumns = (items: string[], columnCount: number) => {
  const columns: string[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });
  return columns;
};

export const AlbumGallery: React.FC<AlbumGalleryProps> = ({ category, onBack, onOpenCalculator }) => {
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const images = category.galleryImages || [];

  // Форматуємо зображення для сумісності з PortfolioLightbox
  const lightboxItem = selectedImageSrc ? {
    id: 'album-img',
    title: category.title,
    image: selectedImageSrc,
    category: category.title as any
  } : null;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 mt-35 animate-fade-in">
      {/* Навігація і заголовок */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <button
            onClick={onBack}
            className="text-sm font-medium text-gray-500 hover:text-black mb-2 flex items-center gap-2 transition-colors"
          >
            <span>←</span> Назад до альбомів
          </button>
          <h2 className="text-3xl sm:text-4xl font-bold">{category.title}</h2>
        </div>

        {/* Верхня кнопка переходу до калькулятора */}
        <button
          onClick={onOpenCalculator}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium shadow-sm"
        >
          Розрахувати вартість альбому
        </button>
      </div>

      {/* Галерея зображень (Masonry сітка з ефектом наведення як у категоріях) */}
      {images.length > 0 ? (
        <>
          {/* ПК версія (3 колонки) */}
          <div className="hidden lg:grid grid-cols-3 gap-6 items-start mb-16">
            {getDistributedColumns(images, 3).map((colItems, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-6">
                {colItems.map((imgSrc, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageSrc(imgSrc)}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg bg-gray-50"
                  >
                    {/* Фонове зображення */}
                    <img
                      src={imgSrc}
                      alt={`${category.title} - фото`}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Темний градієнт знизу */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Текстовий блок у нижній частині при наведенні */}
                    <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col items-start opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white text-xl sm:text-2xl font-bold mb-1 font-serif">
                        {category.title}
                      </h3>
                      <span className="text-amber-400 font-semibold text-xs sm:text-sm tracking-wider uppercase">
                        ПЕРЕГЛЯНУТИ ФОТО
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Мобільна версія (2 колонки) */}
          <div className="grid lg:hidden grid-cols-2 gap-3 items-start mb-16">
            {getDistributedColumns(images, 2).map((colItems, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-3">
                {colItems.map((imgSrc, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageSrc(imgSrc)}
                    className="relative rounded-xl overflow-hidden cursor-pointer group shadow-md bg-gray-50"
                  >
                    {/* Фонове зображення */}
                    <img
                      src={imgSrc}
                      alt={`${category.title} - фото`}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Темний градієнт знизу */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Текстовий блок у нижній частині при наведенні */}
                    <div className="absolute bottom-0 left-0 p-3 w-full flex flex-col items-start opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white text-base font-bold mb-0.5 font-serif">
                        {category.title}
                      </h3>
                      <span className="text-amber-400 font-semibold text-[10px] tracking-wider uppercase">
                        ФОТО
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          У цій категорії поки немає робіт.
        </div>
      )}



      {/* Модальне вікно перегляду фото (Lightbox) */}
      <PortfolioLightbox
        selectedImage={lightboxItem as any}
        onClose={() => setSelectedImageSrc(null)}
      />
    </div>
  );
};

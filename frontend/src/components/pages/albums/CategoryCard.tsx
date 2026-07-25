import React from 'react';
import { CategoryData } from './albumData';

interface CategoryCardProps {
  category: CategoryData & { count?: number };
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div
      onClick={onClick}
      // Змінено висоту на горизонтальну (менша висота, ширший блок)
      className="relative h-[260px] sm:h-[320px] rounded-2xl overflow-hidden cursor-pointer group shadow-lg transition-transform duration-300 hover:scale-[1.02]"
    >
      {/* Фонове зображення */}
      <img
        src={category.coverImage}
        alt={category.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Темний градієнт знизу для читабельності тексту */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Текстовий блок у нижній частині */}
      <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col items-start">
        <h3 className="text-white text-2xl sm:text-3xl font-bold mb-1 font-serif">
          {category.title}
        </h3>
        <span className="text-amber-400 font-semibold text-sm tracking-wider uppercase">
          {category.galleryImages?.length || 0} ФОТО
        </span>
      </div>
    </div>
  );
};

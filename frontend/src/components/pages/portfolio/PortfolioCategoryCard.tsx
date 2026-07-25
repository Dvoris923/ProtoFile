import React from 'react';

interface PortfolioCategoryCardProps {
  category: string;
  count: number;
  coverImage: string | null;
  onClick: () => void;
}

export const PortfolioCategoryCard: React.FC<PortfolioCategoryCardProps> = ({
  category,
  count,
  coverImage,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      /* aspect-[3/4] робить картку повністю вертикальною */
      className="cursor-pointer border border-black/10 rounded-2xl overflow-hidden flex flex-col justify-end p-6 sm:p-8 transition-all hover:shadow-2xl aspect-[3/4] relative group"
    >
      {/* Фонове вертикальне зображення */}
      <div className="absolute inset-0 z-0">
        {coverImage ? (
          <img
            src={coverImage}
            alt={category}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* Градієнтне затемнення для кращої читабельності тексту */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90 z-10" />

      {/* Постійно видимий текст */}
      <div className="relative z-20 flex flex-col items-start gap-1">
        <h3 className="text-md sm:text-3xl font-bold text-white tracking-wide leading-tight">
          {category}
        </h3>
        <span className="text-xs sm:text-sm text-amber-300 font-semibold uppercase tracking-wider">
          {count} {count === 1 ? 'фото' : count >= 2 && count <= 4 ? 'фото' : 'фото'}
        </span>
      </div>
    </div>
  );
};

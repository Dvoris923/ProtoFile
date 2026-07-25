import React, { useState } from 'react';
import { PortfolioItem } from './portfolioData';

interface PortfolioPhotoCardProps {
  item: PortfolioItem;
  onClick: () => void;
}

export const PortfolioPhotoCard: React.FC<PortfolioPhotoCardProps> = ({ item, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl bg-gray-100 cursor-pointer break-inside-avoid mb-3 sm:mb-6 [content-visibility:auto]"
    >
      {!isLoaded && <div className="w-full aspect-[3/4] bg-gray-200 animate-pulse" />}

      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-auto object-cover rounded-xl transition-all duration-500 group-hover:scale-105 ${
          isLoaded ? 'opacity-100 block' : 'opacity-0 absolute inset-0'
        }`}
      />

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-6 pointer-events-none rounded-xl z-10">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300 font-medium">
            {item.gradeGroup ? `${item.category} • ${item.gradeGroup}` : item.category}
          </span>
        </div>
      </div>
    </div>
  );
};

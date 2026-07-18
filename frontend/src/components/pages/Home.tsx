import React from 'react';
import { Questions } from '../Questions/Questions';

export const Home: React.FC = () => {
  return (
    <div className="">
      <div className="relative min-h-screen bg-[url(/img/Hero_img.jpg)] bg-cover bg-center bg-fixed text-white flex items-center py-20 px-4 md:px-10"></div>

      <div className="h-40 flex items-center justify-center border-t-2 border-gray-200 w-[50%] mx-auto ">
        <h2 className="text-2xl md:text-3xl font-medium text-center whitespace-nowrap">
          Перегляньте моє портфоліо
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 ">
        {/* Сітка: 1 колонка на мобілках, 3 колонки на ПК. Відступи між картками відсутні (як на фото) */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5">
          {/* Картка 1: Пейзаж */}
          <div className="relative h-[600px] overflow-hidden group">
            <img
              src="/img/category1.jpg"
              alt="Пейзаж"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Затемнення внизу для кращої читаємості тексту */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8">
              <h3 className="text-white text-2xl font-light tracking-wide">
                Пейзаж
              </h3>
            </div>
          </div>

          {/* Картка 2: Дика природа */}
          <div className="relative h-[600px] overflow-hidden group">
            <img
              src="/img/category2.jpg"
              alt="Дика природа"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8">
              <h3 className="text-white text-2xl font-light tracking-wide">
                Дика природа
              </h3>
            </div>
          </div>

          {/* Картка 3: Антени (Гори) */}
          <div className="relative h-[600px] overflow-hidden group">
            <img
              src="/img/category3.jpg"
              alt="Антени"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8">
              <h3 className="text-white text-2xl font-light tracking-wide">
                Антени
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div>
        {' '}
        <Questions />
      </div>
    </div>
  );
};

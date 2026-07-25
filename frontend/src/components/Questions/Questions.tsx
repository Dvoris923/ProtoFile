import React, { useState } from 'react';
import { faqData } from './Question'; // Виправлено шлях імпорту на файл з даними

export const Questions: React.FC = () => {
  // Зберігаємо індекс відкритого питання (null, якщо все закрито)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    // Якщо клікнули на вже відкрите — закриваємо (null), інакше — відкриваємо нове
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-[url(/img/Hero_img.webp)] bg-cover bg-center bg-fixed text-white flex items-center py-20 px-4 md:px-10">
      {/* Затемняючий шар, щоб білий текст ідеально читався на фоні */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* Основний контейнер контенту */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

        {/* Ліва колонка: Заголовок (sticky робить його закріпленим при скролі уздовж блоку) */}
        <div className="md:col-span-4 pb-4 md:sticky md:top-40">
          <h2 className="text-2xl md:text-3xl font-medium text-center md:text-left whitespace-nowrap">
            Питання та відповіді
          </h2>
        </div>

        {/* Права колонка: Список питань (дані беруться з faqData) */}
        <div className="md:col-span-8 space-y-2">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="border-b border-white/60 pb-4 ">
                {/* Кнопка-питання */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left py-3 group focus:outline-none"
                >
                  <span className="text-lg md:text-xl font-light tracking-wide text-gray-300 transition-colors duration-300 cursor-pointer group-hover:text-white">
                    {item.question}
                  </span>

                  <span className="text-5xl  font-extralight ml-4 transform transition-all duration-300 select-none cursor-pointer text-gray-300 group-hover:text-white group-hover:scale-110">
                    {isOpen ? '×' : '+'}
                  </span>
                </button>

                {/* Блок з відповіддю та плавною анімацією розгортання */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out cursor-pointer group"
                  style={{
                    maxHeight: isOpen ? '300px' : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="text-sm md:text-base text-gray-300 font-light pt-2 pb-4 leading-relaxed transition-colors duration-300 hover:text-white">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// --- НАЛАШТУВАННЯ SUPABASE ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. Інтерфейси
export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Весілля та обряди' | 'Персональні зйомки та події' | 'Сімейні історії' | 'Садочки' | 'Школа';
  gradeGroup?: '4 класи' | '9-11 класи';
  image: string;
}

const MAIN_CATEGORIES = [
  'Весілля та обряди',
  'Персональні зйомки та події',
  'Сімейні історії',
  'Садочки',
  'Школа',
] as const;

// 2. Зчитування фото з локальної папки
const imageModules = import.meta.glob<{ default: string }>(
  '/src/assets/photos/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

const LOCAL_PORTFOLIO_DATA: PortfolioItem[] = Object.entries(imageModules).map(([path, module], index) => {
  const imageUrl = module.default;
  let category: PortfolioItem['category'] = 'Персональні зйомки та події';
  let gradeGroup: PortfolioItem['gradeGroup'] = undefined;

  if (path.includes('/weddings/')) category = 'Весілля та обряди';
  if (path.includes('/family/')) category = 'Сімейні історії';
  if (path.includes('/personal/')) category = 'Персональні зйомки та події';
  if (path.includes('/kindergarten/')) category = 'Садочки';
  if (path.includes('/school/')) {
    category = 'Школа';
    if (path.includes('/4-classes/')) gradeGroup = '4 класи';
    if (path.includes('/9-11-classes/')) gradeGroup = '9-11 класи';
  }

  return {
    id: `local-${index + 1}`,
    title: `Фото ${index + 1}`,
    category,
    gradeGroup,
    image: imageUrl,
  };
});

// Функція розбиття масиву на колонки (для Masonry сітки)
const getDistributedColumns = (items: PortfolioItem[], columnCount: number) => {
  const columns: PortfolioItem[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });
  return columns;
};

// 3. Картка для окремої фотографії (у галереї)
const PortfolioPhotoCard: React.FC<{ item: PortfolioItem; onClick: () => void }> = ({ item, onClick }) => {
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
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-6 pointer-events-none rounded-xl">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300 font-medium">
            {item.gradeGroup ? `${item.category} • ${item.gradeGroup}` : item.category}
          </span>
        </div>
      </div>
    </div>
  );
};

// 4. Головний компонент Портфоліо
export const Portfolios: React.FC = () => {
  // activeCategory керує тим, що ми бачимо: null = список категорій, рядок = галерея
  const [activeCategory, setActiveCategory] = useState<typeof MAIN_CATEGORIES[number] | null>(null);
  const [gradeGroup, setGradeGroup] = useState<'Всі класи' | '4 класи' | '9-11 класи'>('Всі класи');
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [dbItems, setDbItems] = useState<PortfolioItem[]>([]);

  // Підгрузка фотографій із Supabase
  useEffect(() => {
    const fetchDbPortfolio = async () => {
      try {
        const { data, error } = await supabase.from('portfolio').select('*').order('id', { ascending: false });
        if (error) return console.error('Помилка завантаження портфоліо:', error);

        if (data) {
          const formattedData: PortfolioItem[] = data.map((row: any) => {
            let category: PortfolioItem['category'] = 'Персональні зйомки та події';
            const catLower = (row.category || '').toLowerCase();

            if (catLower.includes('весілля') || catLower.includes('обряди')) category = 'Весілля та обряди';
            else if (catLower.includes('сімейні') || catLower.includes("сім'я")) category = 'Сімейні історії';
            else if (catLower.includes('садочки') || catLower.includes('садок')) category = 'Садочки';
            else if (catLower.includes('школа')) category = 'Школа';

            let gradeGroup: PortfolioItem['gradeGroup'] = undefined;
            if (category === 'Школа') {
              if (row.grade_group === '4 класи' || catLower.includes('4 клас')) gradeGroup = '4 класи';
              if (row.grade_group === '9-11 класи' || catLower.includes('9-11')) gradeGroup = '9-11 класи';
            }

            return {
              id: `db-${row.id}`,
              title: row.title || `Фото ${row.id}`,
              category,
              gradeGroup,
              image: row.image_url,
            };
          });
          setDbItems(formattedData);
        }
      } catch (err) {
        console.error('Помилка сервера:', err);
      }
    };
    fetchDbPortfolio();
  }, []);

  const allItems = useMemo(() => [...dbItems, ...LOCAL_PORTFOLIO_DATA], [dbItems]);

  // Збираємо статистику по категоріях для головної сторінки портфоліо
  const categoryStats = useMemo(() => {
    return MAIN_CATEGORIES.map(cat => {
      const items = allItems.filter(item => item.category === cat);
      return {
        title: cat,
        count: items.length,
        coverImage: items.length > 0 ? items[0].image : null // Беремо перше фото як обкладинки
      };
    });
  }, [allItems]);

  // Фільтрація фото для відкритої галереї
  const filteredItems = useMemo(() => {
    if (!activeCategory) return [];
    return allItems.filter((item) => {
      if (item.category !== activeCategory) return false;
      if (activeCategory === 'Школа' && gradeGroup !== 'Всі класи') {
        if (item.gradeGroup !== gradeGroup) return false;
      }
      return true;
    });
  }, [allItems, activeCategory, gradeGroup]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 pt-24 min-h-screen">

      {/* ПЕРШИЙ ЕКРАН: СПИСОК КАТЕГОРІЙ */}
      {!activeCategory ? (
        <div className="animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Портфоліо</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {categoryStats.map((cat) => (
              <div
                key={cat.title}
                onClick={() => {
                  setActiveCategory(cat.title);
                  setGradeGroup('Всі класи'); // скидаємо фільтр класів
                }}
                className="cursor-pointer border border-black rounded-lg overflow-hidden flex flex-col items-center justify-center p-8 bg-white hover:bg-gray-50 transition-all hover:shadow-md h-64 sm:h-72 relative group"
              >
                {/* Фонове зображення */}
                <div className="absolute inset-0 z-0">
                  {cat.coverImage ? (
                    <img
                      src={cat.coverImage}
                      alt={cat.title}
                      className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>

                {/* Основний текст картки */}
                <div className="text-center z-10 bg-white/90 px-4 py-2 rounded shadow-sm">
                  <h3 className="text-xl sm:text-2xl font-bold text-black">{cat.title}</h3>
                </div>

                {/* Блок підпису при наведенні */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-6 pointer-events-none rounded-lg z-20">
                  <div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300 font-medium">
                      Переглянути роботи • {cat.count} фото
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (

        /* ДРУГИЙ ЕКРАН: ВІДКРИТА ГАЛЕРЕЯ (Masonry) */
        <div className="animate-fade-in">
          <button
            onClick={() => setActiveCategory(null)}
            className="mb-8 flex items-center gap-2 text-sm sm:text-base font-medium text-black hover:text-white bg-gray-100 hover:bg-black transition-colors px-4 py-2 rounded-lg w-fit"
          >
            ← Назад до категорій
          </button>

          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">{activeCategory}</h2>

          {/* Підкатегорії класів (тільки для "Школа") */}
          {activeCategory === 'Школа' && (
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-10 bg-white rounded-xl w-fit mx-auto shadow-sm p-1">
              {(['Всі класи', '4 класи', '9-11 класи'] as const).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setGradeGroup(grade)}
                  className={`px-6 sm:px-8 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                    gradeGroup === grade
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          )}

          {/* Masonry сітка */}
          {filteredItems.length > 0 ? (
            <>
              {/* Для великих екранів (3 колонки) */}
              <div className="hidden lg:grid grid-cols-3 gap-6 items-start">
                {getDistributedColumns(filteredItems, 3).map((colItems, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-6">
                    {colItems.map((item) => (
                      <PortfolioPhotoCard key={item.id} item={item} onClick={() => setSelectedImage(item)} />
                    ))}
                  </div>
                ))}
              </div>

              {/* Для мобільних екранів (2 колонки) */}
              <div className="grid lg:hidden grid-cols-2 gap-3 items-start">
                {getDistributedColumns(filteredItems, 2).map((colItems, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-3">
                    {colItems.map((item) => (
                      <PortfolioPhotoCard key={item.id} item={item} onClick={() => setSelectedImage(item)} />
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
        </div>
      )}

      {/* Модальне вікно (Lightbox) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-3 text-center">
                <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                  {selectedImage.gradeGroup
                    ? `${selectedImage.category} • ${selectedImage.gradeGroup}`
                    : selectedImage.category}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

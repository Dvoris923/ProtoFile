import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Імпортуємо розбиті компоненти та дані
import { PortfolioItem, MAIN_CATEGORIES, LOCAL_PORTFOLIO_DATA } from './portfolioData';
import { PortfolioCategoryCard } from './PortfolioCategoryCard';
import { PortfolioPhotoCard } from './PortfolioPhotoCard';
import { PortfolioLightbox } from './PortfolioLightbox';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Функція розбиття масиву на колонки (для Masonry сітки)
const getDistributedColumns = (items: PortfolioItem[], columnCount: number) => {
  const columns: PortfolioItem[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });
  return columns;
};

export const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<typeof MAIN_CATEGORIES[number] | null>(null);
  const [gradeGroup, setGradeGroup] = useState<'Всі класи' | '4 класи' | '9-11 класи'>('Всі класи');
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [dbItems, setDbItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const fetchDbPortfolio = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .neq('section', 'Альбоми') // Виключаємо фото, які належать до альбомів
          .order('id', { ascending: false });

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

  const categoryStats = useMemo(() => {
    return MAIN_CATEGORIES.map(cat => {
      const items = allItems.filter(item => item.category === cat);
      return {
        title: cat,
        count: items.length,
        coverImage: items.length > 0 ? items[0].image : null
      };
    });
  }, [allItems]);

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
    <section className="max-w-6xl mx-auto px-4 py-12 pt-32 min-h-screen">

      {!activeCategory ? (
        <div className="animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">Портфоліо</h2>
          {/* Змінено grid-cols-1 на grid-cols-2 для мобільних */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {categoryStats.map((cat) => (
              <PortfolioCategoryCard
                key={cat.title}
                category={cat.title}
                title={cat.title}
                count={cat.count}
                coverImage={cat.coverImage}
                onClick={() => {
                  setActiveCategory(cat.title);
                  setGradeGroup('Всі класи');
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in pt-8">
          <button
            onClick={() => setActiveCategory(null)}
            className="mb-2 flex items-center gap-2 text-sm sm:text-base font-medium text-gray-80 shadow-sm p-4 hover:text-black bg-white transition-colors px-4 py-2 rounded-lg w-fit"
          >
            ← Назад до категорій
          </button>

          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 ">{activeCategory}</h2>

          {activeCategory === 'Школа' && (
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-10 bg-white rounded-xl w-fit mx-auto shadow-sm p-1">
              {(['Всі класи', '4 класи', '9-11 класи'] as const).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setGradeGroup(grade)}
                  className={`px-6 sm:px-8 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                    gradeGroup === grade
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-gray-100 hover:text-white'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          )}

          {filteredItems.length > 0 ? (
            <>
              {/* ПК версія */}
              <div className="hidden lg:grid grid-cols-3 gap-6 items-start">
                {getDistributedColumns(filteredItems, 3).map((colItems, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-6">
                    {colItems.map((item) => (
                      <PortfolioPhotoCard key={item.id} item={item} onClick={() => setSelectedImage(item)} />
                    ))}
                  </div>
                ))}
              </div>

              {/* Мобільна версія */}
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

      {/* Модальне вікно */}
      <PortfolioLightbox
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

    </section>
  );
};

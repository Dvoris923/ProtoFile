import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Toast } from './../Toast'; // Змініть шлях, якщо Toast лежить в іншій папці

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY_MANAGER;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

type SectionType = 'Портфоліо' | 'Альбоми';
type PortfolioCategoryType = 'Весілля та обряди' | 'Персональні зйомки та події' | 'Сімейні історії' | 'Садочки' | 'Школа';
type AlbumCategoryType = 'Шкільні альбоми' | 'Альбоми для садочків';
type CategoryType = PortfolioCategoryType | AlbumCategoryType;
type GradeGroupType = '4 класи' | '9-11 класи' | '';

const SECTIONS: SectionType[] = ['Портфоліо', 'Альбоми'];
const PORTFOLIO_CATEGORIES: PortfolioCategoryType[] = ['Весілля та обряди', 'Персональні зйомки та події', 'Сімейні історії', 'Садочки', 'Школа'];
const ALBUM_CATEGORIES: AlbumCategoryType[] = ['Шкільні альбоми', 'Альбоми для садочків'];

interface PortfolioItem {
  id: number;
  title?: string;
  section: SectionType;
  category: CategoryType;
  grade_group?: string;
  image_url: string;
  is_cover?: boolean;
}

interface SelectedImage {
  file: File;
  previewUrl: string;
}

export const PortfolioManager: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);

  // --- АВТОРИЗАЦІЯ ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // --- СТЕЙТ ПОВІДОМЛЕНЬ (TOAST) ---
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- ФОРМА ДОДАВАННЯ ---
  const [title, setTitle] = useState('');
  const [section, setSection] = useState<SectionType>('Портфоліо');
  const [category, setCategory] = useState<CategoryType>('Весілля та обряди');
  const [gradeGroup, setGradeGroup] = useState<GradeGroupType>('');
  const [isCover, setIsCover] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [loading, setLoading] = useState(false);

  // --- СТЕЙТИ ФІЛЬТРАЦІЇ ---
  const [filterSection, setFilterSection] = useState<SectionType | 'УСІ'>('УСІ');
  const [filterCategory, setFilterCategory] = useState<CategoryType | 'УСІ'>('УСІ');
  const [filterGradeGroup, setFilterGradeGroup] = useState<GradeGroupType | 'УСІ'>('УСІ');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPortfolio = async () => {
    const { data, error } = await supabase.from('portfolio').select('*').order('id', { ascending: false });
    if (!error && data) setItems(data);
  };

  useEffect(() => {
    if (isAuthenticated) fetchPortfolio();
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      showToast('Будь ласка, введіть email та пароль', 'error');
      return;
    }

    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: passwordInput });
    setAuthLoading(false);

    if (error) {
      showToast(`Помилка: ${error.message}`, 'error');
    } else {
      showToast('Вхід виконано успішно', 'success');
      setEmailInput('');
      setPasswordInput('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast('Ви вийшли з системи', 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          showToast(`Файл ${file.name} занадто великий (максимум 10 МБ)!`, 'error');
          return false;
        }
        return true;
      });

      const newImages = validFiles.map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));

      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeSelectedImage = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.secure_url || null;
    } catch (err) {
      console.error('Cloudinary error:', err);
      return null;
    }
  };

  const handleAddItems = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      showToast('Будь ласка, оберіть хоча б одну фотографію!', 'error');
      return;
    }

    setLoading(true);
    try {
      const needsGradeGroup = category === 'Школа' || category === 'Шкільні альбоми';

      if (isCover) {
        await supabase
          .from('portfolio')
          .update({ is_cover: false })
          .eq('category', category);
      }

      const uploadPromises = selectedImages.map(async (item, index) => {
        const uploadedUrl = await uploadToCloudinary(item.file);
        if (!uploadedUrl) throw new Error(`Помилка завантаження файлу: ${item.file.name}`);

        const shouldBeCover = isCover && index === 0;

        return {
          title: title || null,
          section,
          category,
          grade_group: needsGradeGroup ? gradeGroup : null,
          image_url: uploadedUrl,
          is_cover: shouldBeCover,
        };
      });

      const recordsToInsert = await Promise.all(uploadPromises);
      const { error } = await supabase.from('portfolio').insert(recordsToInsert);

      if (error) throw error;

      showToast(`Успішно завантажено ${recordsToInsert.length} фото!`, 'success');
      setTitle('');
      setSelectedImages([]);
      setGradeGroup('');
      setIsCover(false);
      fetchPortfolio();
    } catch (err: any) {
      showToast(err.message || 'Помилка при додаванні фото.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- ПЕРЕМИКАННЯ ОБКЛАДИНКИ З ПЕРЕВІРКОЮ ПОМИЛОК ---
  const handleToggleCover = async (item: PortfolioItem) => {
    const newCoverStatus = !item.is_cover;

    try {
      if (newCoverStatus) {
        const { error: resetError } = await supabase
          .from('portfolio')
          .update({ is_cover: false })
          .eq('category', item.category);

        if (resetError) throw resetError;
      }

      const { error } = await supabase
        .from('portfolio')
        .update({ is_cover: newCoverStatus })
        .eq('id', item.id);

      if (error) throw error;

      showToast(
        newCoverStatus ? '⭐ Фото встановлено як головна обкладинка!' : 'Статус обкладинки знято',
        'success'
      );
      await fetchPortfolio();
    } catch (err: any) {
      showToast('Помилка оновлення: ' + (err.message || 'Перевірте RLS політики Supabase'), 'error');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!window.confirm('Ви дійсно хочете видалити це фото?')) return;
    const { error } = await supabase.from('portfolio').delete().eq('id', id);
    if (error) {
      showToast('Не вдалося видалити фото: ' + error.message, 'error');
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
      showToast('Фото успішно видалено!', 'success');
    }
  };

  const currentCategories = section === 'Портфоліо' ? PORTFOLIO_CATEGORIES : ALBUM_CATEGORIES;

  const filterCategories = useMemo(() => {
    if (filterSection === 'Портфоліо') return PORTFOLIO_CATEGORIES;
    if (filterSection === 'Альбоми') return ALBUM_CATEGORIES;
    return [...PORTFOLIO_CATEGORIES, ...ALBUM_CATEGORIES];
  }, [filterSection]);

  // --- ФІЛЬТРАЦІЯ ТА СОРТУВАННЯ (ОБКЛАДИНКА ЗАВЖДИ ПЕРША) ---
  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchSection = filterSection === 'УСІ' || item.section === filterSection;
      const matchCategory = filterCategory === 'УСІ' || item.category === filterCategory;

      if ((filterCategory === 'Школа' || filterCategory === 'Шкільні альбоми') && filterGradeGroup !== 'УСІ') {
         return matchSection && matchCategory && item.grade_group === filterGradeGroup;
      }

      return matchSection && matchCategory && (filterGradeGroup === 'УСІ' || item.grade_group === filterGradeGroup);
    });

    // Сортуємо: головна обкладинка завжди йде першою (нагорі)
    return filtered.sort((a, b) => {
      if (a.is_cover && !b.is_cover) return -1;
      if (!a.is_cover && b.is_cover) return 1;
      return b.id - a.id; // Решта за спаданням ID (нові спочатку)
    });
  }, [items, filterSection, filterCategory, filterGradeGroup]);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Завантаження...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
        <form onSubmit={handleLogin} className="bg-[#262626] p-8 rounded shadow-md max-w-sm w-full flex flex-col gap-4">
          <h2 className="text-xl font-serif text-center text-white mb-2">Авторизація адміністратора</h2>
          <input type="email" placeholder="Email адміністратора" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="bg-[#1a1a1a] p-3 text-sm text-gray-200 border border-gray-700 focus:outline-none focus:border-gray-400" />
          <input type="password" placeholder="Пароль" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="bg-[#1a1a1a] p-3 text-sm text-gray-200 border border-gray-700 focus:outline-none focus:border-gray-400" />
          <button type="submit" disabled={authLoading} className="bg-[#34482e] text-white hover:bg-[#283823] py-3 text-xs tracking-widest uppercase transition-colors disabled:opacity-50 mt-2">
            {authLoading ? 'ВХІД...' : 'УВІЙТИ'}
          </button>
        </form>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 max-w-6xl mx-auto pt-40 relative">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-serif">Завантаження фото</h1>
        <button onClick={handleLogout} className="text-xs uppercase border border-gray-600 px-4 py-2 hover:bg-gray-800 hover:text-white transition-colors">
          Вийти з акаунта
        </button>
      </div>

      <form onSubmit={handleAddItems} className="bg-[#262626] p-6 rounded-sm mb-12 flex flex-col gap-6 items-start">
        <div className="w-full flex flex-col gap-4">
          <input type="text" placeholder="Назва для фотографій (необов'язково)" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-[#1a1a1a] p-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider">Розділ:</label>
              <select value={section} onChange={(e) => {
                  const newSection = e.target.value as SectionType;
                  setSection(newSection);
                  const firstCat = newSection === 'Портфоліо' ? PORTFOLIO_CATEGORIES[0] : ALBUM_CATEGORIES[0];
                  setCategory(firstCat);
                  if (firstCat !== 'Школа' && firstCat !== 'Шкільні альбоми') setGradeGroup('');
                }}
                className="bg-[#1a1a1a] p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gray-400">
                {SECTIONS.map((sec) => <option key={sec} value={sec}>{sec}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider">Категорія:</label>
              <select value={category} onChange={(e) => {
                  const val = e.target.value as CategoryType;
                  setCategory(val);
                  if (val !== 'Школа' && val !== 'Шкільні альбоми') setGradeGroup('');
                }}
                className="bg-[#1a1a1a] p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gray-400">
                {currentCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {(category === 'Школа' || category === 'Шкільні альбоми') && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-amber-400 uppercase tracking-wider">Підгрупа (класи):</label>
                <select value={gradeGroup} onChange={(e) => setGradeGroup(e.target.value as GradeGroupType)} className="bg-[#1a1a1a] p-3 text-sm text-amber-300 border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-400">
                  <option value="">Без підгрупи</option><option value="4 класи">4 класи</option><option value="9-11 класи">9-11 класи</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isCoverCheckbox"
              checked={isCover}
              onChange={(e) => setIsCover(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
            <label htmlFor="isCoverCheckbox" className="text-xs text-amber-300 cursor-pointer select-none font-semibold">
              ⭐ Зробити перше завантажене фото головною обкладинкою цієї категорії
            </label>
          </div>
        </div>

        <div className="w-full bg-[#1a1a1a] p-4 border border-dashed border-gray-600 rounded-sm">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="cursor-pointer group flex flex-col items-center justify-center w-24 h-24 border border-dashed border-gray-500 hover:border-white transition-colors bg-[#262626]">
              <span className="text-2xl text-gray-400 group-hover:text-white">+</span>
              <span className="text-[10px] text-gray-400 group-hover:text-white mt-1">Вибрати</span>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            {selectedImages.map((image, index) => (
              <div key={index} className="relative w-24 h-24 group">
                <img src={image.previewUrl} alt="preview" className="w-full h-full object-cover rounded-sm opacity-90 group-hover:opacity-100" />
                <button
                  type="button"
                  onClick={() => removeSelectedImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Видалити"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {selectedImages.length > 0 && (
            <div className="text-[10px] text-gray-400 uppercase mt-4 text-right">
              Обрано файлів: {selectedImages.length}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading || selectedImages.length === 0} className="bg-[#34482e] hover:bg-[#283823] text-gray-100 font-medium py-3 px-8 text-xs tracking-widest uppercase transition-colors disabled:opacity-50 w-full sm:w-auto">
          {loading ? `ЗАВАНТАЖЕННЯ... (${selectedImages.length})` : 'ЗБЕРЕГТИ ВСІ ФОТО'}
        </button>
      </form>

      {/* --- ФІЛЬТРИ --- */}
      <div className="mb-8 space-y-4">
        <h2 className="text-xl font-serif mb-4">Перегляд та фільтрація</h2>
        <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 border border-gray-200">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Розділ:</label>
            <select value={filterSection} onChange={(e) => { setFilterSection(e.target.value as SectionType | 'УСІ'); setFilterCategory('УСІ'); setFilterGradeGroup('УСІ'); }} className="bg-white border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-800 min-w-[150px]">
              <option value="УСІ">Усі розділи</option>
              {SECTIONS.map((sec) => <option key={sec} value={sec}>{sec}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Категорія:</label>
            <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value as CategoryType | 'УСІ'); setFilterGradeGroup('УСІ'); }} className="bg-white border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-800 min-w-[200px]">
              <option value="УСІ">Усі категорії</option>
              {filterCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {(filterCategory === 'Школа' || filterCategory === 'Шкільні альбоми') && (
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-[10px] text-amber-600 uppercase tracking-wider font-bold">Класи (Підгрупа):</label>
              <select value={filterGradeGroup} onChange={(e) => setFilterGradeGroup(e.target.value as GradeGroupType | 'УСІ')} className="bg-amber-50 border border-amber-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 min-w-[150px]">
                <option value="УСІ">Всі класи</option><option value="4 класи">4 класи</option><option value="9-11 класи">9-11 класи</option>
              </select>
            </div>
          )}

          <div className="ml-auto w-full sm:w-auto mt-4 sm:mt-0">
             <div className="text-sm font-medium bg-gray-800 text-white px-4 py-2 rounded-sm text-center">
               Знайдено: {filteredItems.length}
             </div>
          </div>
        </div>
      </div>

      {/* --- ГАЛЕРЕЯ (ОБКЛАДИНКА ЗАВЖДИ ПЕРША) --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-sm overflow-hidden flex flex-col relative group transition-all ${
              item.is_cover
                ? 'bg-[#262626] ring-4 ring-amber-400 shadow-2xl shadow-amber-500/30'
                : 'bg-[#262626] border border-gray-800'
            }`}
          >
            <div className="h-56 overflow-hidden relative">
              <img src={item.image_url} alt={item.title || 'Фото'} className="w-full h-full object-cover" />

              <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                <span className={`text-[9px] uppercase tracking-widest px-2 py-1 font-bold rounded shadow-sm text-white ${item.section === 'Альбоми' ? 'bg-blue-600' : 'bg-green-700'}`}>
                  {item.section}
                </span>
                {item.is_cover && (
                  <span className="text-[9px] uppercase tracking-wider px-2 py-1 font-extrabold rounded shadow-md bg-amber-400 text-black animate-pulse flex items-center gap-1">
                    ⭐ ГОЛОВНА
                  </span>
                )}
              </div>

              <button
                onClick={() => handleToggleCover(item)}
                className={`absolute top-2 right-12 px-2.5 py-1.5 rounded-md text-xs shadow-lg transition-all flex items-center gap-1 font-semibold ${
                  item.is_cover
                    ? 'bg-amber-400 text-black ring-2 ring-white scale-105'
                    : 'bg-black/80 text-gray-300 hover:bg-black hover:text-white'
                }`}
                title={item.is_cover ? 'Зняти статус обкладинки' : 'Зробити головною обкладинкою'}
              >
                {item.is_cover ? '⭐ Головна' : '☆ Обрати'}
              </button>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-md text-xs shadow-md opacity-90 transition-opacity hover:opacity-100"
                title="Видалити назавжди"
              >
                🗑️
              </button>
            </div>

            <div className="p-3">
              <p className="text-sm font-medium text-white truncate">{item.title || 'Без назви'}</p>
              <span className="text-[10px] text-amber-300 uppercase tracking-widest block mt-1">
                {item.grade_group ? `${item.category} • ${item.grade_group}` : item.category}
              </span>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && <div className="col-span-full py-10 text-center text-gray-500">Фотографій для вибраних фільтрів не знайдено.</div>}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default PortfolioManager;

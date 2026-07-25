import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Toast } from './../Toast'; // Змініть шлях, якщо Toast лежить в іншій папці

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY_MANAGER;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

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
}

export const PortfolioManager: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // --- СТЕЙТ ПОВІДОМЛЕНЬ (TOAST) ---
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [title, setTitle] = useState('');
  const [section, setSection] = useState<SectionType>('Портфоліо');
  const [category, setCategory] = useState<CategoryType>('Весілля та обряди');
  const [gradeGroup, setGradeGroup] = useState<GradeGroupType>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [filterSection, setFilterSection] = useState<SectionType | 'УСІ'>('УСІ');
  const [filterCategory, setFilterCategory] = useState<CategoryType | 'УСІ'>('УСІ');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const fetchPortfolio = async () => {
    const { data, error } = await supabase.from('portfolio').select('*').order('id', { ascending: false });
    if (!error && data) setItems(data);
  };

  useEffect(() => {
    if (isAuthenticated) fetchPortfolio();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      showToast('Вхід виконано успішно', 'success');
    } else {
      showToast('Невірний пароль!', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        showToast('Файл занадто великий (максимум 10 МБ)!', 'error');
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      showToast('Будь ласка, оберіть фотографію!', 'error');
      return;
    }

    setLoading(true);
    try {
      const uploadedUrl = await uploadToCloudinary(imageFile);
      if (!uploadedUrl) throw new Error('Помилка завантаження фото на Cloudinary');

      const needsGradeGroup = category === 'Школа' || category === 'Шкільні альбоми';
      const { error } = await supabase.from('portfolio').insert([{
        title, section, category, grade_group: needsGradeGroup ? gradeGroup : null, image_url: uploadedUrl,
      }]);

      if (error) throw error;

      showToast(`Фото успішно додано!`, 'success');
      setTitle('');
      setImageFile(null);
      setPreviewUrl(null);
      setGradeGroup('');
      fetchPortfolio();
    } catch (err) {
      showToast('Помилка при додаванні фото.', 'error');
    } finally {
      setLoading(false);
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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSection = filterSection === 'УСІ' || item.section === filterSection;
      const matchCategory = filterCategory === 'УСІ' || item.category === filterCategory;
      return matchSection && matchCategory;
    });
  }, [items, filterSection, filterCategory]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
        <form onSubmit={handleLogin} className="bg-[#262626] p-8 rounded shadow-md max-w-sm w-full flex flex-col gap-4">
          <h2 className="text-xl font-serif text-center text-white">Управління фотографіями</h2>
          <input
            type="password"
            placeholder="Пароль адміна"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="bg-[#1a1a1a] p-3 text-sm text-gray-200 border border-gray-700 focus:outline-none focus:border-gray-400"
          />
          <button type="submit" className="bg-[#34482e] text-white hover:bg-[#283823] py-3 text-xs tracking-widest uppercase transition-colors">
            Увійти
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
        <button
          onClick={() => {
            setIsAuthenticated(false);
            showToast('Ви вийшли з системи', 'success');
          }}
          className="text-xs uppercase border border-gray-600 px-4 py-2 hover:bg-gray-800 hover:text-white transition-colors"
        >
          Вийти
        </button>
      </div>

      <form onSubmit={handleAddItem} className="bg-[#262626] p-6 rounded-sm mb-12 flex flex-col md:flex-row gap-6 items-start md:items-center">
         {/* ... (Ваша існуюча розмітка форми залишається без змін) ... */}
         <div className="flex-1 w-full flex flex-col gap-4">
          <input type="text" placeholder="Назва фото (необов'язково)" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-[#1a1a1a] p-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400" />
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
          <button type="submit" disabled={loading} className="bg-[#34482e] hover:bg-[#283823] text-gray-100 font-medium py-3 px-8 text-xs tracking-widest uppercase transition-colors disabled:opacity-50 mt-2">
            {loading ? 'ЗАВАНТАЖЕННЯ...' : 'ЗБЕРЕГТИ ФОТО'}
          </button>
        </div>
        <div className="w-44 flex flex-col items-center shrink-0">
          <label className="cursor-pointer flex flex-col items-center group">
            <div className="w-36 h-36 bg-[#1a1a1a] flex items-center justify-center overflow-hidden mb-2 border border-dashed border-gray-600 group-hover:border-gray-300">
              {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400 text-center px-2">Обрати файл</span>}
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </form>

      {/* --- ФІЛЬТРИ --- */}
      <div className="mb-8 space-y-4">
        <h2 className="text-xl font-serif mb-2">Перегляд та фільтрація</h2>
        {/* ... (Ваша існуюча розмітка фільтрів) ... */}
      </div>

      {/* --- ГАЛЕРЕЯ --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-[#262626] rounded-sm overflow-hidden flex flex-col relative group">
            <div className="h-56 overflow-hidden relative">
              <img src={item.image_url} alt={item.title || 'Фото'} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2">
                <span className={`text-[9px] uppercase tracking-widest px-2 py-1 font-bold rounded shadow-sm text-white ${item.section === 'Альбоми' ? 'bg-blue-600' : 'bg-green-700'}`}>{item.section}</span>
              </div>
              <button onClick={() => handleDeleteItem(item.id)} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full text-xs shadow-md opacity-90 transition-opacity hover:opacity-100" title="Видалити назавжди">🗑️</button>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-white truncate">{item.title || 'Без назви'}</p>
              <span className="text-[10px] text-amber-300 uppercase tracking-widest block mt-1">{item.grade_group ? `${item.category} • ${item.grade_group}` : item.category}</span>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && <div className="col-span-full py-10 text-center text-gray-500">Фотографій для вибраних фільтрів не знайдено.</div>}
      </div>

      {/* Рендер Toast повідомлення */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default PortfolioManager;

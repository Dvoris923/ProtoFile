import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Toast } from './../Toast'; // Змініть шлях, якщо Toast лежить в іншій папці

// --- НАЛАШТУВАННЯ SUPABASE ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Review {
  id: number;
  name: string;
  text: string;
  image_url?: string;
}

const COOLDOWN_MINUTES = 10;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

// =================================================================
// 1. ОКРЕМИЙ КОМПОНЕНТ КАРТКИ ВІДГУКУ (ДЛЯ ОПТИМІЗАЦІЇ ТА АНІМАЦІЇ)
// =================================================================
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="break-inside-avoid mb-6 bg-zinc-100 rounded-2xl border border-zinc-200/80 shadow-md hover:shadow-lg hover:border-zinc-300 transition-all duration-300 flex flex-col overflow-hidden [content-visibility:auto]">

      {review.image_url && (
        <div className="w-full relative">
          {/* Скелетон (показується, поки фото вантажиться) */}
          {!isImageLoaded && (
            <div className="w-full aspect-[4/5] bg-zinc-200 animate-pulse" />
          )}

          {/* Саме фото з плавним проявленням */}
          <img
            src={review.image_url}
            alt={review.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsImageLoaded(true)}
            className={`w-full h-auto object-cover transition-opacity duration-500 ${
              isImageLoaded ? 'opacity-100 block' : 'opacity-0 absolute inset-0'
            }`}
          />
        </div>
      )}

      {/* Контентна частина */}
      <div className="p-6 md:p-8 flex flex-col items-center text-center">
        <span className="block text-sm md:text-base font-medium text-zinc-900 uppercase tracking-widest mb-4">
          {review.name}
        </span>
        <p className="text-sm text-zinc-700 leading-relaxed font-light whitespace-pre-wrap">
          {review.text}
        </p>
      </div>
    </div>
  );
};

// =================================================================
// 2. МОДАЛЬНЕ ВІКНО ДОДАВАННЯ ВІДГУКУ
// =================================================================
interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded: () => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewAdded,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lastReviewTime = localStorage.getItem('lastReviewTimestamp');
    if (lastReviewTime) {
      const timeSinceLastReview = Date.now() - parseInt(lastReviewTime, 10);
      if (timeSinceLastReview < COOLDOWN_MS) {
        const minutesLeft = Math.ceil((COOLDOWN_MS - timeSinceLastReview) / 60000);
        onShowToast(`Зачекайте ${minutesLeft} хв. перед відправкою нового відгуку.`, 'error');
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('reviews').insert([
        {
          name,
          text,
          is_approved: false,
        },
      ]);

      if (error) throw error;

      localStorage.setItem('lastReviewTimestamp', Date.now().toString());

      onShowToast('Дякуємо! Ваш відгук відправлено на перевірку.', 'success');
      setName('');
      setText('');
      onClose();
      onReviewAdded();
    } catch (err) {
      console.error('Помилка Supabase:', err);
      onShowToast('Не вдалося відправити відгук. Спробуйте пізніше.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white text-zinc-900 p-8 md:p-10 rounded-2xl max-w-lg w-full relative shadow-2xl">
        <button onClick={onClose} className="absolute top-5 right-5 text-zinc-400 hover:text-black text-5xl font-light">×</button>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-black">Залишити відгук</h2>
          <p className="text-sm text-zinc-500 mt-2 font-light">Поділіться своїми враженнями від фотосесії</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Ваше ім'я"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-black font-light"
          />
          <textarea
            placeholder="Ваш відгук..."
            required
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-black resize-none font-light"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-zinc-800 text-white font-medium py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? 'Відправка...' : 'Надіслати відгук'}
          </button>
        </form>
      </div>
    </div>
  );
};

// =================================================================
// 3. ГОЛОВНИЙ КОМПОНЕНТ ВІДГУКІВ
// =================================================================
export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('id', { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleShowToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  return (
    <section className="w-full min-h-screen bg-white text-zinc-900 pt-28 pb-16 px-4 md:px-8 flex flex-col items-center relative">
      <div className="max-w-4xl mx-auto text-center mb-6 md:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light mt-2 mb-6 text-black">Відгуки</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black hover:bg-zinc-800 text-white font-medium px-8 py-3.5 rounded-xl shadow-md transition-all text-sm active:scale-95"
        >
          Залишити відгук
        </button>
      </div>

      {/* Masonry-розкладка з відокремленими компонентами */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl w-full mx-auto">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewAdded={fetchReviews}
        onShowToast={handleShowToast}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </section>
  );
};

export { ReviewsSection as Reviews };

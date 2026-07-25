import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // перевірте шлях до вашого клієнта Supabase

interface Album {
  id: number;
  title: string;
  category: string;
  cover_url?: string;
}

interface AlbumPhoto {
  id: number;
  album_id: number;
  image_url: string;
}

export const AlbumManager: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);

  // Форма створення нового альбому
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumCategory, setNewAlbumCategory] = useState('Школа');

  // Форма додавання фото в обраний альбом
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Завантаження списку альбомів
  const fetchAlbums = async () => {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAlbums(data);
      if (data.length > 0 && !selectedAlbumId) {
        setSelectedAlbumId(data[0].id);
      }
    }
  };

  // 2. Завантаження фотографій для вибраного альбому
  const fetchPhotos = async (albumId: number) => {
    const { data, error } = await supabase
      .from('album_photos')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    if (selectedAlbumId) {
      fetchPhotos(selectedAlbumId);
    }
  }, [selectedAlbumId]);

  // Створення нового альбому
  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return alert('Вкажіть назву альбому');

    setLoading(true);
    const { data, error } = await supabase
      .from('albums')
      .insert([{ title: newAlbumTitle, category: newAlbumCategory }])
      .select();

    setLoading(false);

    if (error) {
      alert(`Помилка створення альбому: ${error.message}`);
    } else if (data && data.length > 0) {
      setAlbums((prev) => [data[0], ...prev]);
      setSelectedAlbumId(data[0].id);
      setNewAlbumTitle('');
    }
  };

  // Додавання фото в обраний альбом
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbumId) return alert('Оберіть альбом!');
    if (!imageUrl.trim()) return alert('Введіть посилання на фото!');

    setLoading(true);
    const { data, error } = await supabase
      .from('album_photos')
      .insert([{ album_id: selectedAlbumId, image_url: imageUrl }])
      .select();

    setLoading(false);

    if (error) {
      alert(`Помилка додавання фото: ${error.message}`);
    } else if (data && data.length > 0) {
      setPhotos((prev) => [data[0], ...prev]);
      setImageUrl('');
    }
  };

  // Видалення фото з альбому
  const handleDeletePhoto = async (photoId: number) => {
    if (!window.confirm('Видалити це фото з альбому?')) return;

    const { data, error } = await supabase
      .from('album_photos')
      .delete()
      .eq('id', photoId)
      .select();

    if (error) {
      alert(`Не вдалося видалити: ${error.message}`);
    } else if (data && data.length > 0) {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Управління Альбомами</h2>

      {/* Блок 1: Створення нового альбому */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Створити новий альбом</h3>
        <form onSubmit={handleCreateAlbum} className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Назва альбому (напр. 11-А клас 2026)"
            value={newAlbumTitle}
            onChange={(e) => setNewAlbumTitle(e.target.value)}
            className="flex-1 p-2 border rounded border-gray-300"
          />
          <select
            value={newAlbumCategory}
            onChange={(e) => setNewAlbumCategory(e.target.value)}
            className="p-2 border rounded border-gray-300"
          >
            <option value="Школа">Школа</option>
            <option value="Весілля">Весілля</option>
            <option value="Портрет">Портрет</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Збереження...' : 'Створити альбом'}
          </button>
        </form>
      </div>

      {/* Блок 2: Вибір альбому та додавання фото */}
      {albums.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">Додати фото в альбом</h3>
            <select
              value={selectedAlbumId || ''}
              onChange={(e) => setSelectedAlbumId(Number(e.target.value))}
              className="p-2 border rounded border-gray-300 bg-gray-50 font-medium"
            >
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title} ({album.category})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleAddPhoto} className="flex gap-3">
            <input
              type="text"
              placeholder="URL зображення (Cloudinary або інша URL-адреса)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 p-2 border rounded border-gray-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Додати фото
            </button>
          </form>
        </div>
      )}

      {/* Блок 3: Галерея фотографій у вибраному альбомі */}
      {selectedAlbumId && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Фотографії в альбомі ({photos.length})
          </h3>
          {photos.length === 0 ? (
            <p className="text-gray-500">В цьому альбомі поки немає фотографій.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={photo.image_url}
                    alt="Фото альбому"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full text-xs opacity-90 hover:opacity-100 transition-opacity"
                    title="Видалити фото"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlbumManager;

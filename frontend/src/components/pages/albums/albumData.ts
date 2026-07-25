export interface FormatOption {
  id: string;
  label: string;
  modifier: number;
}

export interface CoverOption {
  id: string;
  label: string;
  price: number;
}

export interface CategoryData {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  basePrice: number;
  minSpreads: number;
  spreadPrice: number;
  formats: FormatOption[];
  coverTypes: CoverOption[];
  galleryImages: string[];
}

export const ALBUM_CATEGORIES: CategoryData[] = [
  {
    id: 'school',
    title: 'Шкільні альбоми',
    subtitle: '',
    coverImage: './img/servis.webp',
    basePrice: 600,
    minSpreads: 2,
    spreadPrice: 100,
    formats: [
      { id: '20x30', label: '20 × 30 см (Вертикальний)', modifier: 1 },
      { id: '23x23', label: '23 × 23 см (Квадратний)', modifier: 1.1 },
      { id: '30x30', label: '30 × 30 см (Преміум)', modifier: 1.3 },
    ],
    coverTypes: [
      { id: 'hard', label: 'Тверда ламінована', price: 0 },
      { id: 'velvet', label: 'Велюр / Текстиль', price: 150 },
    ],
    galleryImages: [
      './img/servis.webp',
      './img/servis.webp',
      './img/servis.webp',
    ],
  },
  {
    id: 'kindergarten',
    title: 'Альбоми для садочків',
    subtitle: '',
    coverImage: './img/servis.webp',
    basePrice: 500,
    minSpreads: 2,
    spreadPrice: 80,
    formats: [
      { id: '20x20', label: '20 × 20 см (Квадрат)', modifier: 1 },
      { id: '20x30', label: '20 × 30 см (Вертикальний)', modifier: 1.15 },
    ],
    coverTypes: [
      { id: 'hard', label: 'Тверда глянцева', price: 0 },
      { id: 'soft_touch', label: 'Soft-touch покриття', price: 100 },
    ],
    galleryImages: [
     './img/servis.webp',
     './img/servis.webp',
    ],
  },
];

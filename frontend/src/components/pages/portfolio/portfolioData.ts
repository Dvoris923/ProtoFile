export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Весілля та обряди' | 'Персональні зйомки та події' | 'Сімейні історії' | 'Садочки' | 'Школа';
  gradeGroup?: '4 класи' | '9-11 класи';
  image: string;
}

export const MAIN_CATEGORIES = [
  'Весілля та обряди',
  'Персональні зйомки та події',
  'Сімейні історії',
  'Садочки',
  'Школа',
] as const;

// Зчитування фото з локальної папки
const imageModules = import.meta.glob<{ default: string }>(
  '/src/assets/photos/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

export const LOCAL_PORTFOLIO_DATA: PortfolioItem[] = Object.entries(imageModules).map(([path, module], index) => {
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

// ==========================================
// 1. КОНСТАНТИ ТА ДАНІ ДЛЯ СЕРВІСУ / КАЛЬКУЛЯТОРА
// ==========================================

export const PRODUCT_TYPES = ['Фотокниги'] as const;

export const PRINT_TYPES = [
  {
    id: 'classic',
    name: 'Економ',
    price: 200,
    isNew: false,
    description:
      'Друкується на папері 200 г/м2. Комплектується твердою фотообкладинкою, сторінки розкриваються на 180°.',
  },
  {
    id: 'digital',
    name: 'Преміум',
    price: 250,
    isNew: false,
    description:
      'Друкується на папері 200 г/м2. Між сторінками використовується додатковий картонний прошарок. Комплектується твердою фотообкладинкою, сторінки розкриваються на 180°.',
  },
] as const;

export const FORMATS = [
  { name: '20х30 см', price: 100, pricePerSpread: 80, baseFormatCost: 100 },
  { name: '23х23 см', price: 150, pricePerSpread: 90, baseFormatCost: 150 },
  { name: '30х30 см', price: 200, pricePerSpread: 100, baseFormatCost: 200 },
] as const;

export const COATINGS = [
  {
    id: 'glossy',
    name: 'Глянцеве',
    icon: '✨',
    price: 0,
    description: 'Базове покриття для фотообкладинок.',
  },
  {
    id: 'exclusive',
    name: 'Ексклюзивне',
    icon: '💎',
    price: 40,
    description:
      'Ексклюзивне покриття робить обкладинку ідеально гладкою, а на дотик нагадує оксамит. Володіє глибокою кольоропередачею.',
  },
] as const;

// ==========================================
// 2. БІЗНЕС-ЛОГІКА РОЗРАХУНКУ ЦІНИ
// ==========================================

interface CalculationParams {
  printType: string;
  format: string;
  spreads: number;
  coating: string;
  quantity: number;
}

export const calculateOrderPrice = ({
  printType,
  format,
  spreads,
  coating,
  quantity,
}: CalculationParams) => {
  // 1. Націнка за покриття
  let totalExtra = 0;
  const selectedCoating = COATINGS.find((c) => c.id === coating);
  if (selectedCoating) {
    totalExtra += selectedCoating.price;
  }

  // 2. Базова вартість альбому (Економ / Преміум)
  let baseAlbumCost = 0;
  const selectedPrint = PRINT_TYPES.find((p) => p.id === printType);
  if (selectedPrint) {
    baseAlbumCost = selectedPrint.price;
  }

  // 3. Знаходимо параметри фортованих цін
  const selectedFormat = FORMATS.find((f) => f.name === format) || FORMATS[0];
  const pricePerSpread = selectedFormat.pricePerSpread;
  const pricePerFormat = selectedFormat.baseFormatCost;

  // Розрахунок вартості одного екземпляра
  const unitPrice =
    baseAlbumCost + pricePerSpread * spreads + pricePerFormat + totalExtra;

  // Загальна вартість тиражу
  const totalPrice = unitPrice * quantity;

  return {
    unitPrice,
    totalPrice,
    pricePerSpread,
  };
};

export interface CertificateData {
  title: string;
  subtitle: string;
  image: string;
  price: string;
  description: string;
  features: string[];
}

export const defaultCertificate: CertificateData = {
  title: "Подарунковий сертифікат",
  subtitle: "Особливий подарунок",
  image: "./img/сертифікат.jpg",
  price: "від 1 700 грн",
  description: "Подаруйте рідним можливість зберегти найцінніші моменти. Сертифікат діє на фотосесію, створення персонального альбому або будь-які інші послуги студії.",
  features: [
    "Термін дії — 6 місяців з моменту покупки",
    "Красиве фірмове пакування включено",
  ],
};

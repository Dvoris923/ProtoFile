import React, { useState, useMemo } from 'react';
import {
  PRODUCT_TYPES,
  PRINT_TYPES,
  FORMATS,
  COATINGS,
  calculateOrderPrice,
} from './../../siteData'; // Перевірте шлях до файлу залежно від вашої структури папок

export const Services: React.FC = () => {
  const [productType, setProductType] = useState<string>(PRODUCT_TYPES[0]);

  const [printType, setPrintType] = useState<string>('classic');
  const [format, setFormat] = useState<string>('20х30 см');
  const [spreads, setSpreads] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [coating, setCoating] = useState<string>('glossy');

  // Стейт для відкритої підказки (зберігає id або null)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Використовуємо оптимізовану функцію розрахунку з siteData
  const { unitPrice, totalPrice, pricePerSpread } = useMemo(() => {
    return calculateOrderPrice({
      printType,
      format,
      spreads,
      coating,
      quantity,
    });
  }, [format, spreads, quantity, printType, coating]);

  return (
    <div className="max-w-7xl mx-auto p-4 text-slate-800 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ЛІВА КОЛОНКА: НАЛАШТУВАННЯ */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-3">Тип продукту</h3>
            <div className="flex flex-wrap gap-2 pb-4">
              {PRODUCT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setProductType(type)}
                  className={`px-4 py-2 border-2 rounded-md text-sm transition ${
                    productType === type
                      ? 'border-black text-black font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Підтипи фотодруку */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {PRINT_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setPrintType(type.id);
                    setActiveTooltip(null);
                  }}
                  className={`p-4 border rounded-lg flex flex-col justify-between items-stretch text-left h-40 relative transition ${
                    printType === type.id
                      ? 'border-black ring-1 ring-black'
                      : 'border-gray-200'
                  }`}
                >
                  {printType === type.id && (
                    <span className="absolute top-2 right-2 text-black text-xs">
                      ✓
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center text-gray-400 shrink-0">
                      📷
                    </div>
                    <div className="text-left flex flex-col justify-center">
                      <span className="font-semibold text-sm">{type.name}</span>
                      {type.isNew && (
                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider mb-1">
                          New
                        </span>
                      )}

                      <div className="relative inline-block mt-1">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setActiveTooltip(activeTooltip === type.id ? null : type.id);
                          }}
                          className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] font-serif text-slate-500 hover:bg-slate-200 transition select-none"
                        >
                          i
                        </button>

                        {activeTooltip === type.id && (
                          <div
                            onClick={e => e.stopPropagation()}
                            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl border border-slate-800"
                          >
                            <div className="flex justify-between items-center mb-1 pb-1 border-b border-slate-800">
                              <span className="font-bold text-slate-400">Інформація</span>
                              <button
                                type="button"
                                onClick={() => setActiveTooltip(null)}
                                className="text-slate-400 hover:text-white font-bold ml-2 text-sm p-1"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="font-normal text-slate-200 leading-relaxed">
                              {type.description}
                            </p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-semibold w-full pt-2 border-t border-gray-100 text-slate-500 flex justify-between items-center mt-auto">
                    <span>Вартість:</span>
                    <span className={printType === type.id ? 'text-black font-bold' : 'text-slate-700'}>
                      {type.price === 0 ? '0 грн' : `${type.price} грн`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Формат */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold mb-4">Формат</h3>
            <div className="flex flex-wrap gap-3">
              {FORMATS.map(f => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => setFormat(f.name)}
                  className={`w-36 h-36 p-4 border rounded-lg flex flex-col justify-between items-stretch text-center transition relative ${
                    format === f.name
                      ? 'border-black ring-1 ring-black text-black'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {format === f.name && (
                    <span className="absolute top-2 right-2 text-black text-xs">
                      ✓
                    </span>
                  )}

                  <div className="flex flex-col items-center pt-2">
                    <span className="text-2xl mb-1 text-gray-300">🖼️</span>
                    <span className="text-xs font-semibold text-slate-800">
                      {f.name}
                    </span>
                  </div>

                  <div className="text-xs font-semibold w-full pt-2 border-t border-gray-100 text-slate-500 flex justify-between items-center mt-auto">
                    <span>Вартість:</span>
                    <span className={format === f.name ? 'text-black font-bold' : 'text-slate-700'}>
                      {f.price} грн
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Покриття обкладинки */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold mb-4">Покриття обкладинки</h3>
            <div className="flex flex-wrap gap-3">
              {COATINGS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCoating(c.id);
                    setActiveTooltip(null);
                  }}
                  className={`w-full sm:w-50 p-4 border rounded-lg flex flex-col items-start justify-between transition relative text-left min-h-[100px] ${
                    coating === c.id
                      ? 'border-black ring-1 ring-black text-black'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {coating === c.id && (
                    <span className="absolute top-2 right-2 text-black text-xs">
                      ✓
                    </span>
                  )}

                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-sm text-slate-800">
                        {c.name}
                      </span>

                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setActiveTooltip(activeTooltip === c.id ? null : c.id);
                          }}
                          className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] font-serif text-slate-500 hover:bg-slate-200 transition select-none"
                        >
                          i
                        </button>

                        {activeTooltip === c.id && (
                          <div
                            onClick={e => e.stopPropagation()}
                            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl border border-slate-800"
                          >
                            <div className="flex justify-between items-center mb-1 pb-1 border-b border-slate-800">
                              <span className="font-bold text-slate-400">Інформація</span>
                              <button
                                type="button"
                                onClick={() => setActiveTooltip(null)}
                                className="text-slate-400 hover:text-white font-bold ml-2 text-sm p-1"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="font-normal text-slate-200 leading-relaxed">
                              {c.description}
                            </p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-semibold w-full pt-2 border-t border-gray-100 text-slate-500 flex justify-between items-center mt-2">
                    <span>Вартість:</span>
                    <span className={coating === c.id ? 'text-black font-bold' : 'text-slate-700'}>
                      {c.price === 0 ? '0 грн' : `${c.price} грн`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА: ПАНЕЛЬ РОЗРАХУНКУ (STICKY) */}
        <div className="lg:col-span-5 lg:sticky lg:top-4 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Розрахунок ціни</h3>
            </div>
          </div>

          {/* Таблиця розрахунку */}
          <div className="border rounded-lg overflow-hidden text-sm bg-white">
            <div className="grid grid-cols-2 p-3 font-semibold text-[11px] uppercase tracking-wider text-black border-b">
              <div className="col-span-1">Ціна</div>
              <div className="col-span-1">Кількість розворотів</div>
            </div>

            <div className="grid grid-cols-2 p-4 items-center">
              <div>
                <div className="font-bold whitespace-nowrap text-lg">
                  {totalPrice} UAH{' '}
                  <span className="text-xs font-normal text-gray-400">
                    / екз.
                  </span>
                </div>
              </div>
              <div className="mt-4 w-fit">
                {/* Лічильник розворотів */}
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
                  <button
                    type="button"
                    onClick={() => setSpreads(s => Math.max(1, s - 1))}
                    className="text-gray-500 hover:text-black font-bold text-xl px-3 py-1 bg-white border rounded shadow-sm disabled:opacity-50"
                    disabled={spreads <= 1}
                  >
                    -
                  </button>
                  <span className="font-semibold text-base w-12 text-center">
                    {spreads}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSpreads(s => Math.min(10, s + 1))}
                    className="text-gray-500 hover:text-black font-bold text-xl px-3 py-1 bg-white border rounded shadow-sm disabled:opacity-50"
                    disabled={spreads >= 10}
                  >
                    +
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Доступно від 1 до 10 розворотів
                </p>

                {/* Динамічна ціна за 1 розворот */}
                <div className="text-xs font-semibold w-full pt-2 border-t border-gray-100 text-slate-500 flex justify-between items-center mt-3">
                  <span>Ціна за 1 розворот:</span>
                  <span className="text-black font-bold ml-4">
                    {pricePerSpread} грн
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Прев'ю */}
          <div className="rounded-lg overflow-hidden relative shadow-sm border border-gray-100 h-64 bg-slate-800">
            <img
              src="./img/servis.webp"
              alt="Photo print preview"
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

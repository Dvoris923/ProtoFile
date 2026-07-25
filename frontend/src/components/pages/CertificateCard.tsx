import React, { useState } from 'react';
import { CertificateData, defaultCertificate } from './../../siteData'; // Перевірте шлях до файлу залежно від вашої структури папок

const CertificatesPage: React.FC = () => {
  const [cert] /* , setCert */ = useState<CertificateData>(defaultCertificate);

  const handleOrder = () => {
    alert("Дякуємо! Наш менеджер зв'яжеться з вами для оформлення сертифіката.");
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 pt-24 md:pt-35 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">

      {/* Головна картка сертифіката */}
      <section className="max-w-4xl mx-auto w-full bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden shadow-lg transition-all duration-300 hover:border-zinc-400 hover:shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Блок з фотографією */}
          <div className="relative overflow-hidden group min-h-[300px] md:min-h-[420px]">
            <img
              src={cert.image}
              alt={cert.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Градієнт для мобільних */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-50/80 via-transparent to-transparent md:hidden" />
          </div>

          {/* Блок з інформацією */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                {cert.subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-light tracking-wide mt-1 text-black">
                {cert.title}
              </h2>

              <p className="mt-4 text-sm text-zinc-600 leading-relaxed font-light">
                {cert.description}
              </p>

              {/* Переваги */}
              <ul className="mt-6 space-y-3">
                {cert.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-zinc-700 font-light">
                    <svg
                      className="w-4 h-4 mr-3 text-black flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Блок з ціною та кнопкою */}
            <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="block text-xs text-zinc-400 uppercase tracking-wider">Вартість</span>
                <span className="text-xl sm:text-2xl font-medium text-black">{cert.price}</span>
              </div>

              <button
                type="button"
                onClick={handleOrder}
                className="w-full sm:w-auto px-8 py-3.5 bg-black text-white hover:bg-zinc-800 font-medium text-sm rounded-xl transition-all duration-300 active:scale-95 cursor-pointer shadow-md"
              >
                Замовити сертифікат
              </button>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
};

export default CertificatesPage;

import React, { useState } from 'react';

export const Contacts: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'serheykarneyenko@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex flex-col items-center justify-center p-6 md:p-12 pt-20">
      {/* Основний контейнер, який центрує все */}
      <div className="flex flex-col items-center text-center w-full max-w-4xl">

        {/* Заголовок */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 leading-tight tracking-tight text-gray-950">
          Сергій Карнєєнко
        </h1>

        {/* Блок з телефоном та месенджерами */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-4">
          <a
            href="tel:+380931924417"
            className="text-3xl md:text-4xl font-semibold text-black hover:text-gray-700 transition-colors"
          >
            +380 93 19 24 417
          </a>

          {/* Клікабельні значки Telegram та Viber */}
          <div className="flex items-center gap-2">
            {/* Telegram */}
            <a
              href="https://t.me/+380931924417"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написати в Telegram"
              title="Telegram"
              className="group p-2 rounded-full hover:bg-black transition-all duration-300"
            >
              <img
                src="./icons/telegram.svg"
                alt="Telegram"
                className="w-7 h-7 group-hover:invert transition-all duration-300"
              />
            </a>

            {/* Viber */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написати у Viber"
              title="Viber"
              className="group p-2 rounded-full hover:bg-black transition-all duration-300"
            >
              <img
                src="./icons/viber.svg"
                alt="Viber"
                className="w-7 h-7 group-hover:invert transition-all duration-300"
              />
            </a>
          </div>
        </div>

        {/* Блок з поштою та копіюванням */}
        <div className="flex flex-col items-center justify-center mb-6 relative">
          <button
            onClick={handleCopy}
            className="text-lg md:text-4xl font-semibold text-black hover:text-gray-700 transition-colors focus:outline-none cursor-pointer text-center"
            title="Натисніть, щоб скопіювати"
          >
            {email}
          </button>

          {/* Сповіщення про успішне копіювання */}
          <div className="h-6 mt-1 flex items-center justify-center">
            {copied && (
              <span className="text-sm text-green-600 font-medium transition-opacity duration-300">
                Пошту скопійовано в буфер обміну!
              </span>
            )}
          </div>
        </div>

        {/* Контейнер для кнопок соцмереж */}
        <div className="flex flex-col gap-5 w-full max-w-sm md:max-w-md lg:max-w-lg">

          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/serhiikarnieienko_ph?igsh=cjh0YzZ0Yjl4YWI3&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-4 w-full border-2 border-black text-black py-5 rounded-md text-lg font-medium tracking-wide transition-all duration-300 hover:bg-black hover:text-white"
          >
            <img
              src="./icons/instagram.svg"
              alt="Instagram"
              className="w-7 h-7 group-hover:invert transition-all duration-300"
            />
            <span>INSTAGRAM</span>
          </a>

          {/* Facebook Button */}
          <a
            href="https://www.facebook.com/share/1BujGxCa3n/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-4 w-full border-2 border-black text-black py-5 rounded-md text-lg font-medium tracking-wide transition-all duration-300 hover:bg-black hover:text-white"
          >
            <img
              src="./icons/facebook.svg"
              alt="Facebook"
              className="w-7 h-7 group-hover:invert transition-all duration-300"
            />
            <span>FACEBOOK</span>
          </a>

        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';

export const Questions: React.FC = () => {
  // Зберігаємо індекс відкритого питання (null, якщо все закрито)
  const [openIndex, setOpenIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);

  const faqData = [
    {
      question: 'Яка вартість зйомки?',
      answer: (
        <>
          <p className="mb-1">Станом на 14 січня 2026 року:</p>
          <p className="mb-1">1800 грн - перша година зйомки</p>
          <p>900 грн - кожна наступна</p>
        </>
      ),
    },
    {
      question: 'Чи є гарантована кількість фото, які я отримаю після зйомки?',
      answer:
        'Так, зазвичай це від 50 до 100 відібраних та оброблених фотографій за годину зйомки.',
    },
    {
      question: 'Чи можу я, клієнт, обрати фото для обробки?',
      answer:
        'Звісно! Ви можете самостійно обрати найкращі кадри з превью-матеріалів, які я надішлю.',
    },
    {
      question: 'Які зйомки ви проводите?',
      answer:
        'Портретні, сімейні, студійні, вуличні, а також репортажі та контент-зйомки.',
    },
  ];

  const toggleFAQ = index => {
    // Якщо клікнули на вже відкрите — закриваємо (null), інакше — відкриваємо нове
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-[url(/img/Hero_img.jpg)] bg-cover bg-center bg-fixed text-white flex items-center py-20 px-4 md:px-10">
      {/* Затемняючий шар, щоб білий текст ідеально читався на фоні */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* Основний контейнер контенту */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Ліва колонка: Заголовок */}
        <div className="md:col-span-4 pb-4">
  <h2 className="text-2xl md:text-3xl font-medium text-center whitespace-nowrap">
    Питання та відповіді
  </h2>
</div>

        {/* Права колонка: Список питань */}
        <div className=" md:col-span-8 space-y-2">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="border-b border-white/60 pb-4 pt-2">
                {/* Кнопка-питання */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left py-3 group focus:outline-none"
                >
                  {/* Додано hover:text-white та transition для м'якої зміни кольору */}
                  <span className="text-lg md:text-xl font-light tracking-wide text-gray-300 transition-colors duration-300 cursor-pointer group-hover:text-white">
                    {item.question}
                  </span>

                  {/* Ефект наведення на іконку (збільшення або зміна кольору) */}
                  <span className="text-2xl font-extralight ml-4 transform transition-all duration-300 select-none cursor-pointer text-gray-300 group-hover:text-white group-hover:scale-110">
                    {isOpen ? '×' : '+'}
                  </span>
                </button>

                {/* Блок з відповіддю та плавною анімацією розгортання */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out cursor-pointer group"
                  style={{
                    maxHeight: isOpen ? '200px' : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                  onClick={() => toggleFAQ(index)}
                >
                  {/* Додано hover:text-white, щоб при наведенні на текст відповіді він ставав яскравішим */}
                  <div className="text-sm md:text-base text-gray-10 font-light pt-2 pb-4 leading-relaxed transition-colors duration-300 hover:text-white">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Questions } from '../Questions/Questions';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {

    const navigate = useNavigate();
  return (
    <div className="">
    <div className="relative min-h-screen bg-[url(/img/Hero_img.webp)] bg-cover bg-center md:bg-fixed text-white flex flex-col items-center justify-center text-center px-4 md:px-10">
  {/* Напівпрозорий оверлей */}
  <div className="absolute inset-0 bg-black/20"></div>

  {/* Контент */}
  <div className="relative z-10 max-w-3xl">
    <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight">
      Сергій Карнєєнко
    </h1>
    <p className="text-lg md:text-3xl font-medium leading-relaxed opacity-90">
      Фотограф із Нововолинська
    </p>
    <p className="text-lg md:text-xl font-medium leading-relaxed opacity-90">

    </p>
  </div>
</div>

      <div className="h-40 flex items-center justify-center border-t-2 border-gray-200 w-[50%] mx-auto ">
        <h2 className="text-lg md:text-2xl font-medium text-center w-fit">
          Радий вітати вас на своєму сайті
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-10 ">
        {/* Сітка: 1 колонка на мобілках, 3 колонки на ПК. Відступи між картками відсутні (як на фото) */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-y-5">
          {/* Картка 1: Пейзаж */}
          <div onClick={() => navigate('/portfolio')}
          className="relative h-[600px] overflow-hidden group">
            <img
              src="./img/category1.jpg"
              alt="Пейзаж"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Затемнення внизу для кращої читаємості тексту */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8">
              <h3 className="text-white text-2xl font-light tracking-wide">
                Портфоліо
              </h3>
            </div>
          </div>

          {/* Картка 2: Фотокниги */}
     <div  onClick={() => navigate('/services')}
      className="relative h-[600px] overflow-hidden group">
      <img
        src="./img/fotokniga.webp"
        alt="Фотокниги"
        /* Додано md:object-left-bottom */
        className="w-full h-full object-cover object-left-bottom transition-transform duration-500 group-hover:scale-105"
      />
     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8">
              <h3 className="text-white text-2xl font-light tracking-wide">
              Фотокниги
              </h3>
            </div>
    </div>

          {/* Картка 3: Антени (Гори) */}
          <div onClick={() => navigate('/reviews')}
          className="relative h-[600px] overflow-hidden group">
            <img
              src="./img/category3.jpg"
              alt="Антени"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8">
              <h3 className="text-white text-2xl font-light tracking-wide">
                Відгуки
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div>
        {' '}
        <Questions />
      </div>
    </div>
  );
};

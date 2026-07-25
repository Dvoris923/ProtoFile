import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { MobileNav } from './MobileNav/MobileNav';
import LogoWhite from './../../../public/logo2.png';
import LogoBlack from './../../../public/logo1.png';

type HeaderProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Header: React.FC<HeaderProps> = ({
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Головна', path: '/' },
    { name: 'Альбоми', path: '/services' },
    { name: 'Портфоліо', path: '/portfolio' },
    { name: 'Сертифікат', path: '/certificates' },
    { name: 'Контакти', path: '/contacts' },
    { name: 'Відгуки', path: '/reviews' },
  ];

  const isServicesPage =
    location.pathname === '/services' ||
    location.pathname === '/admin' ||
    location.pathname === '/portfolio' ||
    location.pathname === '/certificates' ||
    location.pathname === '/reviews' ||
    location.pathname === '/contacts';

  const renderHeaderContent = (isStickyContext: boolean) => {
    const isBlackTheme = isServicesPage && !isStickyContext;

    const textColorClass = isBlackTheme ? 'text-black' : 'text-white';
    const underlineClass = isBlackTheme ? 'bg-black' : 'bg-white';
    const iconColor = isBlackTheme ? 'black' : 'white';

    const currentLogo = isBlackTheme ? LogoBlack : LogoWhite;

    return (
      <>
        {/* Логотип */}
        <div
          className=" h-12  md:h-28 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src={currentLogo}
            alt="Logo"
            className=" h-full object-contain"
          />
        </div>

        {/* Навігація для десктопу */}
        <nav className="hidden lg:block">
          <ul
            className={`flex gap-8 text-lg font-light tracking-wider uppercase ${textColorClass}`}
          >
            {navLinks.map(link => (
              <li
                key={link.name}
                className="relative cursor-pointer transition-colors duration-300 group"
                onClick={() => navigate(link.path)}
              >
                {link.name}
                <span
                  className={`absolute left-0 -bottom-1 h-[1px] w-0 transition-all duration-300 group-hover:w-full ${underlineClass}`}
                ></span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Кнопка бургера */}
        <button
          className="lg:hidden flex items-center justify-center relative"
          onClick={toggleMenu}
          type="button"
          aria-label="Toggle menu"
        >
          <Menu size={32} color={iconColor} strokeWidth={2} />
        </button>
      </>
    );
  };

  const staticHeaderTextColor = isServicesPage ? 'text-black' : 'text-white';

  return (
    <>
      {/* 1. СТАТИЧНЕ МЕНЮ: на першому екрані (зараз знову ABSOLUTE) */}
      {!isMenuOpen && (
        <header
          className={`absolute top-0 left-0 w-full z-40 flex justify-between items-center px-10 py-6 bg-transparent transition-colors duration-300 ${staticHeaderTextColor}`}
        >
          {renderHeaderContent(false)}
        </header>
      )}

      {/* 2. ЛИПКЕ МЕНЮ: з'являється після 1 екрану при скролі */}
      <header
        className={`fixed top-0 left-0 w-full z-40 flex justify-between items-center px-10 py-2 bg-gray-600 shadow-md text-white transition-all duration-500 ease-in-out
          ${
            isSticky && !isMenuOpen && !isServicesPage
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : '-translate-y-full opacity-0 pointer-events-none'
          }`}
      >
        {renderHeaderContent(true)}
      </header>

      {/* 3. ШАПКА ДЛЯ ВІДКРИТОГО МЕНЮ (ідеально збігається по геометрії з першими двома) */}
     {isMenuOpen && (
  <header className="fixed top-0 left-0 w-full z-50 flex justify-end items-center px-10 py-8 md:py-14 bg-transparent">
    <button
      className="lg:hidden flex items-center justify-center relative"
      onClick={toggleMenu}
      type="button"
      aria-label="Close menu"
    >
      <X size={32} color="white" strokeWidth={2} />
    </button>
  </header>
)}

      {/* 4. МОБІЛЬНЕ МЕНЮ (Оверлей) */}
      {isMenuOpen && (
        <div className="fixed inset-0 w-full h-screen lg:hidden z-40 bg-white pt-28 px-10 overflow-y-auto">
          <MobileNav onClose={() => setIsMenuOpen(false)} />
        </div>
      )}
    </>
  );
};

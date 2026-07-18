import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Додайте цей імпорт
import Logo from './../../../public/img/Logo.jpg';
import { Menu, X } from 'lucide-react';
import { MobileNav } from './MobileNav/MobileNav';

type HaaderProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Header: React.FC<HaaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate(); // 2. Ініціалізуйте хук

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const navLinks = [
    { name: 'Головна', path: '/' },
    { name: 'Послуги', path: '/services' },
    { name: 'Портфоліо', path: '/portfolio' },
    { name: 'Контакти', path: '/contacts' },
    { name: 'Відгуки', path: '/reviews' },
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-10 py-6 text-white">
      {/* Логотип */}
      <div className="w-12 h-12 cursor-pointer" onClick={() => navigate('/')}>
        <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
      </div>

      {/* Навігація для десктопу (додайте клас hidden для мобільних) */}
      <nav className="hidden lg:block">
        <ul className="flex gap-8 text-sm font-light tracking-wider uppercase">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="cursor-pointer hover:text-gray-300 transition-colors duration-300"
              onClick={() => navigate(link.path)}
            >
              {link.name}
            </li>
          ))}
        </ul>
      </nav>

      {/* Мобільне меню */}
      {isMenuOpen && (
        <div className="fixed top-20 left-0 w-full h-screen lg:hidden z-40 bg-white">
          <MobileNav
            onClose={() => setIsMenuOpen(false)} // 3. Передаємо функцію закриття
          />
        </div>
      )}

      {/* Кнопка бургера */}
      <button
        className="lg:hidden flex items-center justify-center p-2 z-50 relative" // z-index щоб кнопка була поверх меню
        onClick={toggleMenu}
        type="button"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X size={24} color="#3D348B" strokeWidth={2} />
        ) : (
          <Menu size={24} color="white" strokeWidth={2} /> // Змінив колір на білий, щоб було видно на темному фоні
        )}
      </button>
    </header>
  );
}

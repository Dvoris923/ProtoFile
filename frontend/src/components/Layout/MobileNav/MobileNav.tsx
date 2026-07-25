import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, X } from 'lucide-react';

interface MobileNavProps {
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Головна', path: '/' },
    { name: 'Альбоми', path: '/services' },
    { name: 'Портфоліо', path: '/portfolio' },
    { name: 'Сертифікат', path: '/certificates' },
    { name: 'Контакти', path: '/contacts' },
    { name: 'Відгуки', path: '/reviews' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose(); // Закриваємо меню після переходу
  };

  return (
    // Темний фон на весь екран
    <div className="fixed inset-0 z-50 bg-[#262626] text-white p-8 flex flex-col h-screen overflow-y-auto duration-300 ease-out">
      {/* Список посилань */}
      <nav className="flex flex-col gap-8 mt-24 text-3xl font-light">
        {navLinks.map(link => (
          <button
            key={link.name}
            onClick={() => handleNavigation(link.path)}
            // Додаємо 'relative' та 'group'
            className="relative text-left  transition-colors group w-fit"
          >
            {link.name}

            {/* Лінія підкреслення */}
            <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>
        ))}
      </nav>

      {/* Соціальні мережі */}
      <div className="flex gap-4 mt-12">
        <a href="https://t.me/yourname" target="_blank" rel="noreferrer">
          <Send size={28} />
        </a>
      </div>
    </div>
  );
};

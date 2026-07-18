import React from 'react';

export const MobileNav: React.FC<HaaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">My App</h1>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        {isMenuOpen ? 'Close Menu' : 'Open Menu'}
      </button>
    </header>
  );
  }

import { Music } from 'lucide-react'; // Імпортуйте потрібні іконки

export const Footer = () => {
  return (
    <footer className="w-full py-8 px-6 md:px-10 text-gray-500 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Ліва частина: Копірайт */}
        <div className="flex items-center gap-3 text-sm">
          <span className="border border-gray-400 px-2 py-0.5 text-xs">P</span>
          <p>All content Copyright © 2026 </p>
        </div>

        {/* Права частина: Соцмережі */}
        <div className="flex items-center gap-6">

           <a
  href="https://www.facebook.com/share/1BujGxCa3n/?mibextid=wwXIfr" // Додайте своє посилання
  target="_blank"
  rel="noopener noreferrer"
  className="group flex items-center justify-center  w-full   text-gray-60  rounded-md text-lg font-medium  transition-all duration-300 "
>
  <img
    src="./icons/facebook.svg"
    alt="Instagram"
    className="w-9 h-9 opacity-60 group-hover:opacity-100 transition-all duration-300"
  />
</a>
 <a
  href="https://www.instagram.com/serhiikarnieienko_ph?igsh=cjh0YzZ0Yjl4YWI3&utm_source=qr" // Додайте своє посилання
  target="_blank"
  rel="noopener noreferrer"
  className="group flex items-center justify-center  w-full   text-gray-60  rounded-md text-lg font-medium  transition-all duration-300 "
>
  <img
    src="./icons/instagram.svg"
    alt="Instagram"
    className="w-9 h-9 opacity-60 group-hover:opacity-100 transition-all duration-300"
  />
</a>
        </div>
      </div>
    </footer>
  );
};

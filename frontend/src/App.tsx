import React, { useState } from 'react';
import styles from './App.module.scss';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Layout/header';
import { Footer } from './components/Layout/footer';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section className={styles.app}>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <div>
        <Outlet />
      </div>
      <Footer />
    </section>
  );
};

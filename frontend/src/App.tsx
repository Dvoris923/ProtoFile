import React, { useState } from 'react';
import styles from './App.module.scss';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Layout/header';
import { Footer } from './components/Layout/footer';
export const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <section className={styles.app}>
      <Header
          isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
      />


      <div>
        <Outlet />
      </div>
      <Footer />
    </section>
  );
};

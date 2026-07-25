import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { App, ScrollToTop } from './App';
import { Home } from './components/pages/Home';
import { Contacts } from './components/pages/contacts';
import { Reviews } from './components/pages/reviews';
import { PortfolioManager } from './components/pages/PortfolioManager';
import { AlbumsSection } from './components/pages/albums/AlbumsSection';
import { Portfolio } from './components/pages/portfolio/Portfolio';
import CertificateCard from './components/pages/CertificateCard';

export const Root = () => (
  <Router>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="/services" element={<AlbumsSection />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/certificates" element={<CertificateCard />} />
        <Route path="/admin" element={<PortfolioManager />} />
      </Route>
    </Routes>
  </Router>
);

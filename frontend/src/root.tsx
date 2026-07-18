import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { Home } from './components/pages/home';

export const Root = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  </Router>
);

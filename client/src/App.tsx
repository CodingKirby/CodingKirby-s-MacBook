import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import DesktopPage from './pages/DesktopPage';
import LoadingPage from './pages/LoadingPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/desktop" element={<DesktopPage />} />
      </Routes>
    </Router>
  );
};

export default App;

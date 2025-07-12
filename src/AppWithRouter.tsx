import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Import des composants
import CurrencyConverter from './CurrencyConverter';
import Dashboard from './Dashboard';
import AlertsManager from './AlertsManager';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl">💱</div>
            <span className="text-xl font-bold text-white">CurrencyPro</span>
          </Link>

          {/* Menu navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-white/20 text-white border border-white/30' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              🏠 Convertisseur
            </Link>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/dashboard') 
                  ? 'bg-white/20 text-white border border-white/30' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/alerts"
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/alerts') 
                  ? 'bg-white/20 text-white border border-white/30' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              🔔 Alertes
            </Link>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button className="text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navigation />
      <div className="pt-20"> {/* Padding pour compenser la navigation fixe */}
        <Routes>
          <Route path="/" element={<CurrencyConverter />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<AlertsManager />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

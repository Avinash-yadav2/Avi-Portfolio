import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import Portfolio Components
import LeftProfile from './components/LeftProfile';
import Hero from './components/Hero';
import RightIcons from './components/RightIcons';

// Import Admin Components
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';

//WRAPPER FOR PORTFOLIO LAYOUT

const PortfolioLayout = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.style.backgroundColor = isDark ? '#000000' : '#f0f0f0';
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-colors duration-700 ease-in-out font-sans selection:bg-lime-400 selection:text-black
      ${isDark ? 'bg-black text-white' : 'bg-gray-100 text-zinc-900'}`}>
      
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 relative">
        <div className="lg:w-auto flex-shrink-0 z-30">
           <LeftProfile isDark={isDark} />
        </div>
        <div className="flex-1 min-w-0 z-20">
           <Hero isDark={isDark} />
        </div>
        <div className="z-40">
           <RightIcons isDark={isDark} toggleTheme={toggleTheme} />
        </div>
      </div>
    </div>
  );
};

//MAIN APP COMPONENT
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route: The Portfolio */}
        <Route path="/" element={<PortfolioLayout />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
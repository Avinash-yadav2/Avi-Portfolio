// src/pages/Home.jsx
import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import Hero from '../components/sections/Hero';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { isDark } = useTheme();

  return (
    <AppLayout>
      <Hero isDark={isDark} />
    </AppLayout>
  );
};

export default Home;
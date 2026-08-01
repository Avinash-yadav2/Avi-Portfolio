// src/components/layout/AppLayout.jsx
import React from 'react';
import LeftProfile from './LeftProfile';
import RightIcons from './RightIcons';
import { useTheme } from '../../context/ThemeContext';

const AppLayout = ({ children }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className={`min-h-screen p-4 md:p-6 lg:p-8 flex justify-center w-full transition-colors duration-500
            ${isDark ? 'bg-[#050505]' : 'bg-zinc-50'}`}>
            <div className="max-w-[1600px] w-full flex flex-col lg:flex-row gap-6 relative">
                
                {/* 1. Sticky Left Profile */}
                <LeftProfile isDark={isDark} />
                
                {/* 2. Main Content (Scrollable Hero Area) */}
                <div className="flex-1 w-full lg:min-w-[60%]">
                    {children}
                </div>

                {/* 3. Right Floating Navigation & Tools */}
                <RightIcons isDark={isDark} toggleTheme={toggleTheme} />
                
            </div>
        </div>
    );
};

export default AppLayout;
import React, { useState, useEffect } from 'react';
import { Home, User, Briefcase, Send, Sun, Moon, ArrowUp } from 'lucide-react';

const RightIcons = ({ isDark, toggleTheme }) => {
  const [activeSection, setActiveSection] = useState('home');

  //SMOOTH SCROLL & ACTIVE STATE
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'work', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3; 

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  
  // Floating Glass Container
  const containerClasses = `
    fixed z-50 flex items-center justify-center p-2 rounded-2xl md:rounded-full backdrop-blur-xl border transition-all duration-500
    ${isDark 
      ? 'bg-zinc-900/60 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
      : 'bg-white/80 border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)]'}
    
    /* Mobile: Bottom Center Horizontal */
    bottom-6 left-1/2 -translate-x-1/2 flex-row gap-2 w-auto
    
    /* Desktop: Right Vertical */
    md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-8 md:translate-x-0 md:flex-col md:gap-3 md:p-3
  `;

  // Button Base Style
  const btnBase = `
    relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full 
    transition-all duration-300 group cursor-pointer overflow-hidden
  `;

  //NAV BUTTON COMPONENT
  const NavButton = ({ id, icon: Icon, label }) => {
    const isActive = activeSection === id;
    
    return (
      <button 
        onClick={() => scrollToSection(id)}
        className={`${btnBase} ${isActive ? '' : 'hover:bg-white/5'}`}
        aria-label={label}
      >
        {/* Active Glow Background */}
        <span className={`absolute inset-0 bg-[#00de51] transition-all duration-500 ease-out rounded-full
          ${isActive ? 'opacity-20 scale-100 blur-sm' : 'opacity-0 scale-50'}`} 
        />
        
        {/* Active Border Ring */}
        <span className={`absolute inset-0 border border-[#00de51]/50 rounded-full transition-all duration-500
          ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        />

        {/* Icon */}
        <Icon 
          size={20} 
          strokeWidth={isActive ? 2.5 : 2}
          className={`relative z-10 transition-all duration-300 transform
            ${isActive 
              ? 'text-[#00de51] drop-shadow-[0_0_8px_rgba(0,222,81,0.6)] scale-110' 
              : isDark ? 'text-zinc-500 group-hover:text-zinc-200' : 'text-zinc-400 group-hover:text-zinc-800'
            }`} 
        />
        
        {/* Premium Tooltip (Desktop Only) */}
        <div className={`hidden md:flex absolute right-16 items-center opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none`}>
           <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-widest uppercase whitespace-nowrap shadow-xl backdrop-blur-md
              ${isDark ? 'bg-zinc-900/90 border-zinc-700 text-white' : 'bg-white/90 border-zinc-200 text-black'}`}>
              {label}
           </div>
           {/* Arrow Tip */}
           <div className={`w-2 h-2 rotate-45 -ml-1 border-t border-r ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'}`}></div>
        </div>
      </button>
    );
  };

  return (
    <div className={containerClasses}>
      
      {/* Navigation Group */}
      <div className="flex flex-row md:flex-col gap-1 md:gap-2">
        <NavButton id="home" icon={Home} label="Home" />
        <NavButton id="about" icon={User} label="About" />
        <NavButton id="work" icon={Briefcase} label="Work" />
        <NavButton id="contact" icon={Send} label="Contact" />
      </div>

      {/* Divider */}
      <div className={`w-[1px] h-6 md:w-6 md:h-[1px] mx-2 md:mx-auto opacity-20 ${isDark ? 'bg-white' : 'bg-black'}`}></div>

      {/* Utilities Group */}
      <div className="flex flex-row md:flex-col gap-1 md:gap-2">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className={`${btnBase} hover:bg-white/10 text-zinc-400 hover:text-white`}
          aria-label="Toggle Theme"
        >
          <div className="relative transition-transform duration-500 ease-spring active:rotate-180">
            {isDark 
              ? <Sun size={20} className="hover:text-yellow-400 transition-colors" /> 
              : <Moon size={20} className="hover:text-blue-500 transition-colors" />
            }
          </div>
        </button>

        {/* Scroll To Top */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className={`${btnBase} hover:bg-white/10 text-zinc-400 hover:text-[#00de51] hidden md:flex`}
          aria-label="Scroll Top"
        >
          <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </div>

    </div>
  );
};

export default RightIcons;
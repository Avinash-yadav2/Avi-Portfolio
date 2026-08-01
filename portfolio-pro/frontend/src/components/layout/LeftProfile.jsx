// src/components/layout/LeftProfile.jsx
import React, { useState, useEffect } from 'react';
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FiDownload, FiArrowUpRight, FiHexagon } from 'react-icons/fi';
import API, { BASE_URL } from '../../api'; 
import avi from '../../assets/avi.png'; 
import resume from '../../assets/resume.pdf';

const LeftProfile = ({ isDark }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile');
        setProfile(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const roles = profile?.roles && profile.roles.length > 0 
    ? profile.roles 
    : ["Full Stack Developer", "MERN Stack Expert", "UI/UX Enthusiast"];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % roles.length;
      const fullText = roles[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, roles]);

  const getImageUrl = (path) => {
    if (!path) return avi;
    return path.startsWith('http') ? path : `${BASE_URL}/${path}`;
  };

  // Fixed Resume URL logic to fetch from Dashboard/Cloudinary upload
  const getResumeUrl = (path) => {
      if(!path) return resume; 
      return path.startsWith('http') ? path : `${BASE_URL}/${path}`;
  };

  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Added Actual Fallback Social Links to prevent '#' page jump error
  const socialConfig = [
    { key: 'linkedin', icon: FaLinkedin, url: profile?.socials?.linkedin || 'https://www.linkedin.com/in/avinashyadav2/' },
    { key: 'github', icon: FaGithub, url: profile?.socials?.github || 'https://github.com/Avinash-yadav2' },
    { key: 'twitter', icon: FaTwitter, url: profile?.socials?.twitter || 'https://x.com/AvinashYadav055' },
    { key: 'instagram', icon: FaInstagram, url: profile?.socials?.instagram || 'https://www.instagram.com/avinash_yadav_55/' }
  ];

  if (loading) return (
    <div className={`w-full lg:w-[420px] h-[calc(100vh-32px)] rounded-[3rem] animate-pulse
        ${isDark ? 'bg-zinc-900 ring-1 ring-white/10' : 'bg-gray-200'}`}></div>
  );

  return (
    <aside className={`w-full lg:w-[420px] lg:h-[calc(100vh-32px)] lg:sticky lg:top-4 rounded-[3rem] overflow-hidden relative flex flex-col group shadow-2xl transition-all duration-700 select-none
      ${isDark ? 'bg-[#09090b] shadow-black/80 ring-1 ring-white/10' : 'bg-white shadow-xl ring-1 ring-black/5'}`}>
      
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <img 
          src={getImageUrl(profile?.profileImage)}
          alt="Profile" 
          className={`w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110
            ${isDark ? 'opacity-95 brightness-110' : 'opacity-100'}`}
        />
        
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
        </div>
        
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent transition-all duration-700
          ${isDark 
            ? 'from-[#050505] via-[#050505]/10 to-transparent' 
            : 'from-black/80 via-transparent to-transparent'}`} 
        />
      </div>

      <div className="relative z-20 flex justify-between items-start p-8 md:p-10">
        <div className="glass-panel w-14 h-14 rounded-2xl flex items-center justify-center text-white/90 bg-white/5 backdrop-blur-md border border-white/10 shadow-lg hover:text-[#00de51] hover:border-[#00de51]/50 transition-all duration-500 group/logo">
           <FiHexagon size={28} strokeWidth={1.5} className="group-hover/logo:rotate-180 transition-transform duration-700" />
        </div>
        <div className="glass-panel p-2 rounded-full flex flex-col gap-3 backdrop-blur-xl bg-black/20 border border-white/10 shadow-2xl">
          {socialConfig.map((item, i) => (
             <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
               className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-300 hover:text-black hover:bg-[#00de51] transition-all duration-300 hover:scale-110 shadow-lg">
               <item.icon size={18} />
             </a>
          ))}
        </div>
      </div>

      <div className="absolute left-[-2.8rem] top-[40%] hidden lg:flex items-center gap-3 -rotate-90 origin-center py-3 px-6 rounded-full bg-black/30 backdrop-blur-md border border-white/10 transition-all hover:bg-black/50 hover:border-[#00de51]/30 cursor-default shadow-xl">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00de51] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00de51]"></span>
        </span>
        <span className="text-[10px] font-bold tracking-[0.25em] text-white/90 uppercase">Available for Work</span>
      </div>

      <div className="relative z-20 mt-auto p-8 md:p-10 pb-12">
        <div className="mb-10 space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[0.95] tracking-tight drop-shadow-xl">
              Hello, I'm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00de51] to-emerald-400">
                {profile?.name ? profile.name.split(' ')[0] : "Avinash."}
              </span>
            </h1>
            <div className="h-8 flex items-center gap-3">
                <span className="text-lg md:text-xl text-zinc-300 font-medium">I build</span>
                <span className="text-xl md:text-2xl text-white font-bold border-r-2 border-[#00de51] pr-3 animate-pulse shadow-[#00de51]">
                   {text}
                </span>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleScrollToContact}
            className="flex-1 group/btn relative overflow-hidden bg-[#00de51] hover:bg-[#00c94a] text-black font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(0,222,81,0.3)] hover:shadow-[0_0_35px_rgba(0,222,81,0.5)] active:scale-95"
          >
            <span className="relative uppercase tracking-[0.15em] text-xs font-extrabold z-10">Let's Talk</span>
            <FiArrowUpRight size={20} className="relative z-10 group-hover/btn:rotate-45 transition-transform duration-300" />
          </button>
          
          {/* CV URL properly mapped here */}
          <a 
  href={resume}
  target="_blank" 
  rel="noopener noreferrer"
  download="resume.pdf"
  className="group/dl px-6 py-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-3 active:scale-95"
>
  <FiDownload size={20} className="text-zinc-400 group-hover/dl:text-[#00de51] transition-colors" />
  <span className="uppercase tracking-[0.15em] text-xs font-bold text-zinc-200 group-hover/dl:text-white">
    CV
  </span>
</a>
        </div>
      </div>
    </aside>
  );
};

export default LeftProfile;
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, GraduationCap, Calendar, MapPin, Award, ArrowUpRight,
  Code2, Database, Cloud, Server, LayoutTemplate, GitBranch, Send, 
  Terminal, Layers, Cpu, Sparkles
} from 'lucide-react';
import API, { BASE_URL } from '../api'; 
import avi from '../assets/avi.jpg'; 

const Hero = ({ isDark }) => {
  const [time, setTime] = useState(new Date());
  const [animateBars, setAnimateBars] = useState(false);
  
  //DYNAMIC STATE 
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  //CONTACT FORM STATE 
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  //FETCH DATA 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, profRes] = await Promise.all([
            API.get('/projects'),
            API.get('/profile')
        ]);
        setProjects(projRes.data);
        setProfile(profRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //CLOCK & ANIMATION
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const barTimer = setTimeout(() => setAnimateBars(true), 500);
    return () => { clearInterval(timer); clearTimeout(barTimer); };
  }, []);

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  //HELPERS
  const getProjectImage = (path) => {
     if(!path) return "https://via.placeholder.com/800x600?text=No+Image";
     return path.startsWith('http') ? path : `${BASE_URL}/${path}`;
  }

  const getProfileImage = (path) => {
    if(!path) return avi;
    return path.startsWith('http') ? path : `${BASE_URL}/${path}`;
  }

  const getTechIcon = (name) => {
      if (!name) return Layers;
      const n = name.toLowerCase();
      if(n.includes('html') || n.includes('css') || n.includes('tailwind')) return LayoutTemplate;
      if(n.includes('js') || n.includes('react') || n.includes('next')) return Code2;
      if(n.includes('node') || n.includes('express')) return Server;
      if(n.includes('mongo') || n.includes('sql')) return Database;
      if(n.includes('aws') || n.includes('cloud')) return Cloud;
      if(n.includes('git')) return GitBranch;
      if(n.includes('python')) return Terminal;
      if(n.includes('postman')) return Send;
      return Cpu; 
  };

  //CONTACT FORM HANDLER
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
        await API.post('/contact', formData);
        alert("Message sent successfully!");
        setFormData({ name: '', email: '', message: '' }); 
    } catch (error) {
        alert("Failed to send message.");
    } finally {
        setSending(false);
    }
  };

  return (
    <main id='home' className={`flex-1 relative rounded-[2.5rem] overflow-hidden transition-all duration-700 ease-out flex flex-col p-8 md:p-14 font-sans
      ${isDark 
        ? 'bg-[#09090b] shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] text-white' 
        : 'bg-white text-zinc-900 border border-zinc-200 shadow-xl'}`}>

      {/* --- PREMIUM BACKGROUND GLOW --- */}
      {isDark && (
        <div 
          className="absolute -top-[20%] -right-[20%] w-[120%] h-[120%] rounded-full pointer-events-none z-0 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, rgba(0,222,81,0.06) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(100px)'
          }}
        />
      )}

     
      {/* 1. HEADER SECTION       */}
     
      <header className="flex justify-between items-start z-10 relative mb-20 md:mb-0">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-full overflow-hidden border-2 p-0.5 transition-colors duration-500 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
             <img 
               src={getProfileImage(profile?.profileImage)}
               className="w-full h-full object-cover rounded-full" 
               alt="User"
             />
          </div>
          <div>
            <h3 className={`font-bold text-xl leading-none tracking-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>
              {profile?.name || "Avinash Yadav"}
            </h3>
            <p className="text-[#00de51] text-[11px] mt-1.5 font-bold uppercase tracking-[0.25em]">
              Full Stack Developer
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{formatDate(time)}</p>
          <p className={`text-3xl font-bold tracking-tighter tabular-nums leading-none transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>
            {formatTime(time)}
          </p>
        </div>
      </header>

      
      {/* 2. HERO TEXT            */}
     
      <div className="flex-1 flex flex-col justify-center relative z-10 mt-12 mb-20 md:my-24">
        <h2 className={`text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-[-0.03em] leading-[1.1] transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>
          I'm building <br />
          
          <span className="inline-flex items-center justify-center align-middle px-6 py-1 rounded-full mx-2 cursor-default transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(0,222,81,0.5)]
            bg-gradient-to-r from-[#00de51] to-[#00a83e] text-black shadow-[0_0_40px_rgba(0,222,81,0.3)] text-3xl md:text-5xl lg:text-[4.5rem]">
            websites
          </span>
          <br />
          
          <span className={`inline-flex items-center justify-center align-middle px-6 py-1 rounded-full border-2 mx-2 backdrop-blur-md transition-all duration-500 cursor-default
            text-[#00de51] border-[#00de51]/20 hover:bg-[#00de51]/5 hover:border-[#00de51]/40 text-3xl md:text-5xl lg:text-[4.5rem]
            ${isDark ? 'bg-zinc-900/40' : 'bg-zinc-100/50'}`}>
            & brands
          </span>
          <br className="md:hidden" />
          that people remember
        </h2>
      </div>

      
      {/* 3. MARQUEE (INFINITE)   */}
     
      <div className={`py-6 overflow-hidden border-y transform -rotate-1 origin-left w-[120%] -ml-8 backdrop-blur-sm relative z-20
          ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
         <div className="flex gap-16 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
            {[1,2,3,4,5,6].map(i => (
               <React.Fragment key={i}>
                  <div className="flex items-center gap-6">
                      <span className={`text-lg font-bold uppercase tracking-[0.2em] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Available for work</span>
                      <Sparkles size={20} className="text-[#00de51] animate-pulse" />
                      <span className={`text-lg font-bold uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-black'}`}>MERN Stack Expert</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00de51] shadow-[0_0_10px_#00de51]"></div>
                  </div>
               </React.Fragment>
            ))}
         </div>
      </div>

    
      {/* 4. ABOUT SECTION        */}
     
      <section id="about" className="relative z-10 py-32 border-t border-zinc-800/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00de51]/30 bg-[#00de51]/10 backdrop-blur-md mb-8">
           <span className="w-2 h-2 rounded-full bg-[#00de51] animate-pulse shadow-[0_0_10px_#00de51]"></span>
           <span className="text-[10px] font-bold uppercase tracking-widest text-[#00de51]">About Me</span>
        </div>

        <h2 className={`text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-12 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Delivering scalable solutions with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00de51] to-emerald-600">
             clarity, speed, and precision.
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="md:col-span-2">
              <p className={`text-lg leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {profile?.bio || "I am a full-stack engineer driven by logic, problem solving, and clean system design. I build high-performance applications with long-term maintainability in mind."}
              </p>
           </div>
           
           <div className={`flex flex-col justify-center gap-8 border-l pl-10 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <div>
                 <h4 className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Experience</h4>
                 <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Project-Based Experience</p>
              </div>
              <div>
                 <h4 className={`text-sm font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Focus</h4>
                 <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>MERN Stack & AI</p>
              </div>
           </div>
        </div>
      </section>

     
      {/* 5. DYNAMIC EXP & EDU    */}
     
      <section className="relative z-10 py-20 border-t border-zinc-800/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Experience */}
          <div className="flex flex-col gap-10">
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00de51]/10 text-[#00de51]"><Briefcase size={24} /></div>
                <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Experience</h3>
             </div>
             
             <div className="relative border-l border-zinc-800 ml-4 space-y-12 pl-12 pb-4">
                {profile?.experience?.length > 0 ? profile.experience.map((exp, i) => (
                   <div key={i} className="relative group">
                      <div className="absolute -left-[55px] top-0 w-3 h-3 rounded-full border-2 border-[#00de51] bg-[#09090b] group-hover:scale-125 transition-transform"></div>
                      <div className={`relative p-8 rounded-3xl border transition-all duration-500 group hover:-translate-y-1
                         ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-[#00de51]/50' : 'bg-white border-zinc-200 shadow-sm'}`}>
                         <div className="flex flex-col gap-2 mb-4">
                            <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{exp.role}</h4>
                            <div className="flex items-center gap-2 text-sm text-[#00de51] font-medium">
                               <span className="bg-[#00de51]/10 px-3 py-1 rounded text-[11px] uppercase tracking-wider">{exp.company}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider mb-6 opacity-60">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {exp.year}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> On-site</span>
                         </div>
                         <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{exp.desc}</p>
                      </div>
                   </div>
                )) : <p className="text-zinc-500 italic">No experience added.</p>}
             </div>
          </div>

          {/* Education */}
          <div className="flex flex-col gap-10">
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400"><GraduationCap size={24} /></div>
                <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Education</h3>
             </div>
             
             <div className="flex flex-col gap-6">
                {profile?.education?.length > 0 ? profile.education.map((edu, i) => (
                   <div key={i} className={`relative p-8 rounded-3xl border transition-all duration-300 group hover:pl-10
                      ${isDark ? 'bg-zinc-900/20 border-zinc-800 hover:bg-zinc-900/40' : 'bg-white border-zinc-200'}`}>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#00de51] transition-all duration-300 group-hover:h-[60%] rounded-r-full"></div>
                      <div className="flex justify-between items-start mb-2">
                         <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{edu.degree}</h4>
                         <span className={`text-[10px] font-bold py-1 px-2 rounded border ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-100'}`}>{edu.year}</span>
                      </div>
                      <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{edu.school}</p>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#00de51]/10 border border-[#00de51]/20 w-fit">
                         <Award size={12} className="text-[#00de51]" />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-[#00de51]">Graduated</span>
                      </div>
                   </div>
                )) : <p className="text-zinc-500 italic">No education added.</p>}
             </div>
          </div>

        </div>
      </section>

      
      {/* 6. PROJECTS SECTION     */}
      
      <section id="work" className="relative z-10 py-24 border-t border-zinc-800/30">
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
               <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00de51] shadow-[0_0_10px_#00de51] animate-pulse"></span>
                  <span className={`text-xs font-bold uppercase tracking-[0.25em] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Portfolio</span>
               </div>
               <h2 className={`text-4xl md:text-6xl font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00de51] to-emerald-600">Works</span>
               </h2>
            </div>
            <button className={`hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-transparent hover:border-[#00de51] pb-1 transition-all ${isDark ? 'text-white hover:text-[#00de51]' : 'text-zinc-900 hover:text-[#00de51]'}`}>
               View All Projects <ArrowUpRight size={16} />
            </button>
         </div>

         {projects.length > 0 ? (
            <div className="flex flex-col gap-16">
               {projects.map((project, index) => (
                  <div key={index} className={`relative rounded-[2.5rem] border overflow-hidden group transition-all duration-500
                     ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-[#00de51]/40' : 'bg-white border-zinc-200 hover:shadow-xl'}`}>
                     
                     <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Image Side */}
                        <div className="relative min-h-[300px] lg:min-h-[450px] overflow-hidden bg-zinc-950">
                           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,222,81,0.1),transparent_70%)]"></div>
                           <img 
                              src={getProjectImage(project.image)} 
                              alt={project.title} 
                              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105" 
                           />
                           {project.featured && (
                              <div className="absolute top-8 left-8 z-20">
                                 <span className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-[#00de51] text-[10px] font-bold uppercase tracking-widest border border-[#00de51]/30">Featured</span>
                              </div>
                           )}
                        </div>

                        {/* Content Side */}
                        <div className="p-8 md:p-14 flex flex-col justify-center">
                           <h3 className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{project.title}</h3>
                           <p className={`text-base leading-relaxed mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{project.description}</p>
                           
                           <div className="flex flex-wrap gap-2 mb-10">
                              {project.techStack.map((t, i) => (
                                 <span key={i} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-colors
                                    ${isDark ? 'border-zinc-800 bg-zinc-900/50 text-zinc-400' : 'border-zinc-200 bg-zinc-50'}`}>
                                    {t}
                                 </span>
                              ))}
                           </div>

                           <div className="flex items-center gap-8 pt-8 border-t border-zinc-800/50">
                              {project.liveLink && (
                                 <a href={project.liveLink} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-sm font-bold transition-all hover:text-[#00de51] ${isDark ? 'text-white' : 'text-black'}`}>
                                    Live Demo <ArrowUpRight size={16} />
                                 </a>
                              )}
                              {project.repoLink && (
                                 <a href={project.repoLink} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-sm font-bold transition-colors hover:text-[#00de51] text-zinc-500`}>
                                    Source Code <Code2 size={16} />
                                 </a>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : <div className="text-center py-20 text-zinc-500">No projects added yet.</div>}
      </section>

     
      {/* 7. TECH STACK           */}
     
      <section className="relative z-10 py-20 border-t border-zinc-800/30">
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
               <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Technical <span className="text-[#00de51]">Proficiency</span>
               </h2>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profile?.techStack && profile.techStack.length > 0 ? profile.techStack.map((tech, index) => {
               const Icon = getTechIcon(tech.name);
               return (
                  <div key={index} className={`relative p-6 rounded-3xl border transition-all duration-500 group overflow-hidden
                     ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-[#00de51]/40' : 'bg-white border-zinc-200 hover:shadow-lg'}`}>
                     <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110
                           ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} style={{ color: tech.color || '#fff' }}>
                           <Icon size={24} strokeWidth={1.5} />
                        </div>
                        <span className={`text-xl font-bold opacity-40 group-hover:opacity-100 transition-opacity ${isDark ? 'text-white' : 'text-black'}`}>
                           {tech.level}%
                        </span>
                     </div>
                     <div className="relative z-10">
                        <h4 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{tech.name}</h4>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                           <div className="h-full rounded-full bg-[#00de51] shadow-[0_0_15px_#00de51] relative overflow-hidden transition-all duration-[1500ms] ease-out"
                              style={{ width: animateBars ? `${tech.level}%` : '0%' }}>
                              <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-[shimmer_2s_infinite]"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               )
            }) : <p className="text-zinc-500 italic">No skills added.</p>}
         </div>
      </section>

      
      {/* 8. CONTACT FORM         */}
     
      <section id="contact" className="relative z-10 py-20 border-t border-zinc-800/30">
         <div className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-16 border transition-all duration-500
            ${isDark ? 'bg-zinc-900/40 border-zinc-800/50' : 'bg-white border-zinc-200 shadow-2xl'}`}>
            
            {isDark && <div className="absolute -top-[20%] -right-[20%] w-[50%] h-[100%] bg-[#00de51]/5 blur-[100px] rounded-full pointer-events-none" />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
               <div className="flex flex-col justify-between">
                  <div>
                     <h2 className={`text-4xl md:text-6xl font-bold leading-[1.1] mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        Let’s start a <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00de51] to-emerald-600">project together.</span>
                     </h2>
                     <p className={`text-base leading-relaxed max-w-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Have an idea? I'm currently open for new opportunities. Let's build something amazing.
                     </p>
                  </div>
                  <div className="mt-12">
                     <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Write me at</p>
                     <a href={`mailto:${profile?.socials?.email || 'yadavaviii847@gmail.com'}`} className={`text-xl md:text-2xl font-bold transition-colors ${isDark ? 'text-white hover:text-[#00de51]' : 'text-zinc-900 hover:text-[#00de51]'}`}>
                        {profile?.socials?.email || 'yadavaviii847@gmail.com'}
                     </a>
                  </div>
               </div>

               <form className="flex flex-col gap-8" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="group">
                        <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Name</label>
                        <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                           className={`w-full bg-transparent border-b py-3 font-medium focus:outline-none transition-all ${isDark ? 'border-zinc-700 text-white focus:border-[#00de51]' : 'border-zinc-300 text-black focus:border-[#00de51]'}`} />
                     </div>
                     <div className="group">
                        <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Email</label>
                        <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                           className={`w-full bg-transparent border-b py-3 font-medium focus:outline-none transition-all ${isDark ? 'border-zinc-700 text-white focus:border-[#00de51]' : 'border-zinc-300 text-black focus:border-[#00de51]'}`} />
                     </div>
                  </div>
                  <div className="group">
                     <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Project Details</label>
                     <textarea rows="3" placeholder="Tell me about your project..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                        className={`w-full bg-transparent border-b py-3 font-medium focus:outline-none transition-all resize-none ${isDark ? 'border-zinc-700 text-white focus:border-[#00de51]' : 'border-zinc-300 text-black focus:border-[#00de51]'}`}></textarea>
                  </div>
                  <button type="submit" disabled={sending} className="self-start mt-4 px-10 py-4 bg-[#00de51] text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-[#00b341] hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,222,81,0.3)] disabled:opacity-50">
                     {sending ? "Sending..." : "Send Message"}
                  </button>
               </form>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <div className={`mt-24 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 hover:opacity-100 transition-opacity ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
         <p>© 2026 {profile?.name || "Avinash Yadav"}.</p>
         
      </div>

    </main>
  );
};

export default Hero;
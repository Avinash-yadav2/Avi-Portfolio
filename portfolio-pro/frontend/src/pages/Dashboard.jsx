// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api';
import { LogOut, User, Briefcase, Mail, Loader, Plus, Trash2, X, GraduationCap, Cpu } from 'lucide-react';

const Dashboard = () => {
    const { logout } = useAuth();
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    
    // Data States
    const [profile, setProfile] = useState({ 
        name: '', bio: '', roles: '[]', email: '', 
        experience: [], education: [], techStack: [] 
    });
    const [files, setFiles] = useState({ profileImage: null, resume: null });
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    
    // CRUD Forms State
    const [expForm, setExpForm] = useState({ role: '', company: '', year: '', desc: '' });
    const [eduForm, setEduForm] = useState({ degree: '', school: '', year: '' });
    const [techForm, setTechForm] = useState({ name: '', level: 80, color: '#00de51' });

    // Add Project Modal State
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '', description: '', liveLink: '', repoLink: '', techStack: '', featured: false, image: null
    });
    const [addingProject, setAddingProject] = useState(false);

    // UI States
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch Initial Data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profRes, projRes, msgRes] = await Promise.all([
                    API.get('/profile'),
                    API.get('/projects'),
                    API.get('/contact')
                ]);
                
                setProfile({
                    ...profRes.data,
                    name: profRes.data.name || '',
                    bio: profRes.data.bio || '',
                    roles: JSON.stringify(profRes.data.roles || []),
                    email: profRes.data.socials?.email || '',
                    experience: profRes.data.experience || [],
                    education: profRes.data.education || [],
                    techStack: profRes.data.techStack || []
                });
                
                setProjects(projRes.data);
                setMessages(msgRes.data);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // ==========================================
    // BASE PROFILE HANDLER
    // ==========================================
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', profile.name);
            formData.append('bio', profile.bio);
            formData.append('roles', profile.roles);
            formData.append('socials', JSON.stringify({ email: profile.email }));
            
            if (files.profileImage) formData.append('profileImage', files.profileImage);
            if (files.resume) formData.append('resume', files.resume);

            const { data } = await API.put('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Update local state with returned updated profile
            setProfile(prev => ({ ...prev, profileImage: data.profileImage, resume: data.resume }));
            alert('Base Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // SUB-DOCUMENT CRUD HANDLERS
    // ==========================================
    
    // Tech Stack
    const handleAddTech = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/profile/tech', techForm);
            setProfile(prev => ({ ...prev, techStack: data.techStack }));
            setTechForm({ name: '', level: 80, color: '#00de51' });
        } catch (error) { alert('Failed to add Tech Skill'); }
    };
    const handleDeleteTech = async (id) => {
        try {
            const { data } = await API.delete(`/profile/tech/${id}`);
            setProfile(prev => ({ ...prev, techStack: data.techStack }));
        } catch (error) { alert('Failed to delete Tech Skill'); }
    };

    // Experience
    const handleAddExperience = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/profile/experience', expForm);
            setProfile(prev => ({ ...prev, experience: data.experience }));
            setExpForm({ role: '', company: '', year: '', desc: '' });
        } catch (error) { alert('Failed to add Experience'); }
    };
    const handleDeleteExperience = async (id) => {
        try {
            const { data } = await API.delete(`/profile/experience/${id}`);
            setProfile(prev => ({ ...prev, experience: data.experience }));
        } catch (error) { alert('Failed to delete Experience'); }
    };

    // Education
    const handleAddEducation = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/profile/education', eduForm);
            setProfile(prev => ({ ...prev, education: data.education }));
            setEduForm({ degree: '', school: '', year: '' });
        } catch (error) { alert('Failed to add Education'); }
    };
    const handleDeleteEducation = async (id) => {
        try {
            const { data } = await API.delete(`/profile/education/${id}`);
            setProfile(prev => ({ ...prev, education: data.education }));
        } catch (error) { alert('Failed to delete Education'); }
    };

    // ==========================================
    // PROJECTS HANDLERS
    // ==========================================
    const handleCreateProject = async (e) => {
        e.preventDefault();
        setAddingProject(true);
        try {
            const formData = new FormData();
            formData.append('title', newProject.title);
            formData.append('description', newProject.description);
            formData.append('liveLink', newProject.liveLink);
            formData.append('repoLink', newProject.repoLink);
            formData.append('featured', newProject.featured);
            
            const techArray = newProject.techStack.split(',').map(t => t.trim()).filter(Boolean);
            formData.append('techStack', JSON.stringify(techArray));

            if (newProject.image) formData.append('image', newProject.image);

            const { data } = await API.post('/projects', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProjects([data, ...projects]);
            setShowAddProjectModal(false);
            setNewProject({ title: '', description: '', liveLink: '', repoLink: '', techStack: '', featured: false, image: null });
            alert('Project added successfully!');
        } catch (error) {
            alert('Failed to add project');
        } finally {
            setAddingProject(false);
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await API.delete(`/projects/${id}`);
            setProjects(projects.filter(p => p._id !== id));
        } catch (error) {
            alert("Failed to delete project");
        }
    };

    // ==========================================
    // RENDER UI
    // ==========================================
    if (loading) return <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505] text-white' : 'bg-zinc-50 text-black'}`}><Loader className="animate-spin text-[#00de51]" size={40} /></div>;

    const inputClasses = `w-full bg-transparent border-b py-2 focus:outline-none focus:border-[#00de51] transition-all ${isDark ? 'border-zinc-700 text-white' : 'border-zinc-300 text-black'}`;
    const labelClasses = `text-xs font-bold uppercase tracking-wider block mb-2 opacity-70 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`;
    const cardClasses = `p-8 rounded-[2rem] border shadow-xl mb-8 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'}`;

    return (
        <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-zinc-50'}`}>
            
            {/* SIDEBAR */}
            <aside className={`w-full md:w-64 p-6 border-b md:border-b-0 md:border-r ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'}`}>
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-8 h-8 bg-[#00de51] rounded-lg flex items-center justify-center text-black font-bold">A</div>
                    <h2 className={`font-bold tracking-widest uppercase text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>Workspace</h2>
                </div>

                <nav className="flex flex-col gap-2">
                    {[
                        { id: 'profile', icon: User, label: 'Profile & Info' },
                        { id: 'projects', icon: Briefcase, label: 'Projects' },
                        { id: 'messages', icon: Mail, label: 'Inbox' }
                    ].map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                                ${activeTab === tab.id 
                                    ? 'bg-[#00de51]/10 text-[#00de51] border border-[#00de51]/20' 
                                    : isDark ? 'text-zinc-500 hover:bg-zinc-900 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'}`}
                        >
                            <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                </nav>

                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 mt-auto text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all absolute md:relative bottom-6">
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto relative">
                <div className="max-w-4xl mx-auto">
                    
                    {/* ================================== */}
                    {/* PROFILE TAB (WITH MULTIPLE CARDS) */}
                    {/* ================================== */}
                    {activeTab === 'profile' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Profile & Experience</h1>
                            
                            {/* CARD 1: BASE INFO */}
                            <form onSubmit={handleProfileUpdate} className={cardClasses}>
                                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}><User size={20} className="text-[#00de51]"/> Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div><label className={labelClasses}>Display Name</label><input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className={inputClasses} /></div>
                                    <div><label className={labelClasses}>Contact Email</label><input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className={inputClasses} /></div>
                                </div>
                                <div className="mb-6">
                                    <label className={labelClasses}>Typewriter Roles (JSON Array)</label>
                                    <input type="text" value={profile.roles} onChange={e => setProfile({...profile, roles: e.target.value})} placeholder='["Developer", "Designer"]' className={inputClasses} />
                                </div>
                                <div className="mb-6">
                                    <label className={labelClasses}>Biography</label>
                                    <textarea rows="3" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className={`${inputClasses} resize-none`} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t pt-6 border-zinc-500/20">
                                    <div><label className={labelClasses}>Update Profile Image</label><input type="file" accept="image/*" onChange={e => setFiles({...files, profileImage: e.target.files[0]})} className="text-sm" /></div>
                                    <div><label className={labelClasses}>Update CV (PDF)</label><input type="file" accept=".pdf" onChange={e => setFiles({...files, resume: e.target.files[0]})} className="text-sm" /></div>
                                </div>
                                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#00de51] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-[#00c94a] transition-all text-sm">
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>

                            {/* CARD 2: TECH STACK */}
                            <div className={cardClasses}>
                                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}><Cpu size={20} className="text-[#00de51]"/> Technical Skills</h3>
                                
                                {/* List Existing Tech */}
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {profile.techStack.map((tech) => (
                                        <div key={tech._id} className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: tech.color }}></div>
                                            <span className="font-bold text-sm">{tech.name} <span className="opacity-50 text-xs ml-1">({tech.level}%)</span></span>
                                            <button onClick={() => handleDeleteTech(tech._id)} className="ml-2 text-red-500 hover:scale-110 transition-transform"><X size={16}/></button>
                                        </div>
                                    ))}
                                    {profile.techStack.length === 0 && <p className="text-sm opacity-50">No skills added yet.</p>}
                                </div>

                                {/* Add New Tech Form */}
                                <form onSubmit={handleAddTech} className={`p-4 rounded-xl border border-dashed ${isDark ? 'border-zinc-700 bg-zinc-900/50' : 'border-zinc-300 bg-zinc-50/50'}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                        <div><label className={labelClasses}>Skill Name</label><input required type="text" placeholder="e.g. React.js" value={techForm.name} onChange={e => setTechForm({...techForm, name: e.target.value})} className={inputClasses}/></div>
                                        <div>
                                            <label className={labelClasses}>Proficiency ({techForm.level}%)</label>
                                            <input type="range" min="10" max="100" step="5" value={techForm.level} onChange={e => setTechForm({...techForm, level: e.target.value})} className="w-full accent-[#00de51] h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer mt-3" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-full">
                                                <label className={labelClasses}>Color</label>
                                                <input type="color" value={techForm.color} onChange={e => setTechForm({...techForm, color: e.target.value})} className="h-10 w-full rounded cursor-pointer border-0 p-0" />
                                            </div>
                                            <button type="submit" className="px-4 py-2.5 h-10 mt-6 bg-[#00de51]/20 text-[#00de51] font-bold rounded-xl hover:bg-[#00de51] hover:text-black transition-colors whitespace-nowrap border border-[#00de51]/30">Add</button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* CARD 3: EXPERIENCE */}
                            <div className={cardClasses}>
                                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}><Briefcase size={20} className="text-[#00de51]"/> Work Experience</h3>
                                
                                <div className="space-y-4 mb-8">
                                    {profile.experience.map((exp) => (
                                        <div key={exp._id} className={`flex justify-between items-center p-4 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                                            <div>
                                                <h4 className="font-bold">{exp.role} <span className="text-[#00de51] text-xs uppercase ml-2 px-2 py-1 bg-[#00de51]/10 rounded">{exp.company}</span></h4>
                                                <p className="text-xs opacity-60 mt-1">{exp.year} • {exp.desc}</p>
                                            </div>
                                            <button onClick={() => handleDeleteExperience(exp._id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18}/></button>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleAddExperience} className={`p-4 rounded-xl border border-dashed ${isDark ? 'border-zinc-700 bg-zinc-900/50' : 'border-zinc-300 bg-zinc-50/50'}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div><label className={labelClasses}>Role</label><input required type="text" placeholder="Full Stack Dev" value={expForm.role} onChange={e => setExpForm({...expForm, role: e.target.value})} className={inputClasses}/></div>
                                        <div><label className={labelClasses}>Company</label><input required type="text" placeholder="Soul Infotech" value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} className={inputClasses}/></div>
                                        <div><label className={labelClasses}>Duration/Year</label><input required type="text" placeholder="2023 - Present" value={expForm.year} onChange={e => setExpForm({...expForm, year: e.target.value})} className={inputClasses}/></div>
                                    </div>
                                    <div className="flex gap-4 items-end">
                                        <div className="flex-1"><label className={labelClasses}>Description</label><input required type="text" placeholder="What did you do there?" value={expForm.desc} onChange={e => setExpForm({...expForm, desc: e.target.value})} className={inputClasses}/></div>
                                        <button type="submit" className="px-6 py-2 h-10 bg-[#00de51]/20 text-[#00de51] font-bold rounded-xl hover:bg-[#00de51] hover:text-black transition-colors border border-[#00de51]/30">Add</button>
                                    </div>
                                </form>
                            </div>

                            {/* CARD 4: EDUCATION */}
                            <div className={cardClasses}>
                                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}><GraduationCap size={20} className="text-[#00de51]"/> Education</h3>
                                
                                <div className="space-y-4 mb-8">
                                    {profile.education.map((edu) => (
                                        <div key={edu._id} className={`flex justify-between items-center p-4 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                                            <div>
                                                <h4 className="font-bold">{edu.degree}</h4>
                                                <p className="text-xs opacity-60 mt-1">{edu.school} • {edu.year}</p>
                                            </div>
                                            <button onClick={() => handleDeleteEducation(edu._id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18}/></button>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleAddEducation} className={`p-4 rounded-xl border border-dashed flex flex-col md:flex-row items-end gap-4 ${isDark ? 'border-zinc-700 bg-zinc-900/50' : 'border-zinc-300 bg-zinc-50/50'}`}>
                                    <div className="flex-1 w-full"><label className={labelClasses}>Degree</label><input required type="text" placeholder="BCA / MCA" value={eduForm.degree} onChange={e => setEduForm({...eduForm, degree: e.target.value})} className={inputClasses}/></div>
                                    <div className="flex-1 w-full"><label className={labelClasses}>Institution</label><input required type="text" placeholder="VBSPU University" value={eduForm.school} onChange={e => setEduForm({...eduForm, school: e.target.value})} className={inputClasses}/></div>
                                    <div className="w-full md:w-32"><label className={labelClasses}>Year</label><input required type="text" placeholder="2022-25" value={eduForm.year} onChange={e => setEduForm({...eduForm, year: e.target.value})} className={inputClasses}/></div>
                                    <button type="submit" className="px-6 py-2 h-10 w-full md:w-auto bg-[#00de51]/20 text-[#00de51] font-bold rounded-xl hover:bg-[#00de51] hover:text-black transition-colors border border-[#00de51]/30">Add</button>
                                </form>
                            </div>

                        </div>
                    )}

                    {/* ================================== */}
                    {/* PROJECTS TAB (UNTOUCHED) */}
                    {/* ================================== */}
                    {activeTab === 'projects' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-8">
                                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Manage Projects</h1>
                                <button onClick={() => setShowAddProjectModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#00de51] text-black text-sm font-bold rounded-xl hover:bg-[#00c94a] transition-all shadow-[0_0_15px_rgba(0,222,81,0.2)]"><Plus size={18} /> Add New</button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {projects.map((proj) => (
                                    <div key={proj._id} className={`flex items-center justify-between p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                                        <div className="flex items-center gap-4">
                                            <img src={proj.image} alt={proj.title} className="w-12 h-12 rounded-xl object-cover" />
                                            <div>
                                                <h3 className="font-bold">{proj.title}</h3>
                                                <p className="text-xs opacity-60">{proj.techStack?.join(' • ')}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteProject(proj._id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ================================== */}
                    {/* MESSAGES TAB (UNTOUCHED) */}
                    {/* ================================== */}
                    {activeTab === 'messages' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-black'}`}>Inbox</h1>
                            <div className="flex flex-col gap-4">
                                {messages.length === 0 ? <p className="text-zinc-500">No messages yet.</p> : messages.map((msg) => (
                                    <div key={msg._id} className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">{msg.name}</h3>
                                                <a href={`mailto:${msg.email}`} className="text-sm text-[#00de51] hover:underline">{msg.email}</a>
                                            </div>
                                            <span className="text-xs opacity-60">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed opacity-80">{msg.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* ADD PROJECT MODAL */}
            {showAddProjectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className={`w-full max-w-lg p-8 rounded-[2.5rem] border relative ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-black'}`}>
                        <button onClick={() => setShowAddProjectModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-500/10 transition-colors"><X size={20} /></button>
                        <h2 className="text-2xl font-bold mb-6">Add New Project</h2>
                        <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
                            <div><label className={labelClasses}>Project Title</label><input type="text" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className={inputClasses} /></div>
                            <div><label className={labelClasses}>Description</label><textarea rows="3" required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className={`${inputClasses} resize-none`} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClasses}>Live Demo Link</label><input type="url" value={newProject.liveLink} onChange={e => setNewProject({...newProject, liveLink: e.target.value})} className={inputClasses} /></div>
                                <div><label className={labelClasses}>Repository Link</label><input type="url" value={newProject.repoLink} onChange={e => setNewProject({...newProject, repoLink: e.target.value})} className={inputClasses} /></div>
                            </div>
                            <div><label className={labelClasses}>Tech Stack (Comma Separated)</label><input type="text" value={newProject.techStack} onChange={e => setNewProject({...newProject, techStack: e.target.value})} className={inputClasses} /></div>
                            <div className="flex items-center gap-3 py-2">
                                <input type="checkbox" id="featured" checked={newProject.featured} onChange={e => setNewProject({...newProject, featured: e.target.checked})} className="w-4 h-4 accent-[#00de51]" />
                                <label htmlFor="featured" className="text-sm font-bold cursor-pointer">Mark as Featured Project</label>
                            </div>
                            <div><label className={labelClasses}>Project Cover Image</label><input type="file" required accept="image/*" onChange={e => setNewProject({...newProject, image: e.target.files[0]})} className="text-sm mt-1" /></div>
                            <button type="submit" disabled={addingProject} className="mt-4 w-full py-4 bg-[#00de51] text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-[#00c94a] transition-all shadow-[0_0_20px_rgba(0,222,81,0.2)] disabled:opacity-50">
                                {addingProject ? "Uploading..." : "Publish Project"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
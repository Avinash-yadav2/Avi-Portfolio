import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Upload, User, Briefcase, BookOpen, Layers, Mail, Calendar } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects'); 

  // --- STATE ---
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]); // Stores Inbox Messages
  const [newProject, setNewProject] = useState({ title: '', description: '', techStack: '', liveLink: '', repoLink: '', image: null });

  // Profile State
  const [profile, setProfile] = useState({
    name: '', bio: '', roles: '', 
    linkedin: '', github: '', twitter: '', instagram: '', email: '',
    profileImage: null, resume: null,
    experience: [], 
    education: [], 
    techStack: [] 
  });

  // --- INITIAL LOAD ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/admin');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Projects, Profile, AND Messages
      const [projRes, profRes, msgRes] = await Promise.all([
          API.get('/projects'), 
          API.get('/profile'),
          API.get('/contact') // Fetch Messages
      ]);
      
      setProjects(projRes.data);
      setMessages(msgRes.data);
      
      const p = profRes.data;
      setProfile({
        ...p,
        roles: p.roles ? p.roles.join(', ') : '',
        linkedin: p.socials?.linkedin || '',
        github: p.socials?.github || '',
        twitter: p.socials?.twitter || '',
        instagram: p.socials?.instagram || '',
        email: p.socials?.email || '',
        
        experience: Array.isArray(p.experience) ? p.experience : [],
        education: Array.isArray(p.education) ? p.education : [],
        techStack: Array.isArray(p.techStack) ? p.techStack : [],
        
        profileImage: null, 
        resume: null
      });
    } catch (err) {
      console.error("Error loading data");
    }
  };

  // --- HANDLERS ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProject).forEach(key => formData.append(key, newProject[key]));
    try {
        await API.post('/projects', formData);
        alert('Project Added!');
        setNewProject({ title: '', description: '', techStack: '', liveLink: '', repoLink: '', image: null });
        fetchData();
    } catch (err) { alert('Error adding project'); }
  };

  const handleDeleteProject = async (id) => {
      if(window.confirm("Delete Project?")) {
        await API.delete(`/projects/${id}`);
        fetchData();
      }
  };

  const handleDeleteMessage = async (id) => {
      if(window.confirm("Delete this message?")) {
          try {
            await API.delete(`/contact/${id}`);
            fetchData(); // Refresh list
          } catch(err) { alert("Error deleting message"); }
      }
  };

  const handleProfileUpdate = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('bio', profile.bio);
      formData.append('roles', profile.roles);
      formData.append('linkedin', profile.linkedin);
      formData.append('github', profile.github);
      formData.append('twitter', profile.twitter);
      formData.append('instagram', profile.instagram);
      formData.append('email', profile.email);
      formData.append('experience', JSON.stringify(profile.experience));
      formData.append('education', JSON.stringify(profile.education));
      formData.append('techStack', JSON.stringify(profile.techStack));

      if(profile.profileImage) formData.append('profileImage', profile.profileImage);
      if(profile.resume) formData.append('resume', profile.resume);

      try {
          await API.post('/profile', formData); 
          alert('Saved Successfully!');
          fetchData(); 
      } catch (err) { alert('Error updating profile'); }
  };

  // --- Helpers ---
  const addItem = (field, item) => {
    setProfile({ ...profile, [field]: [...profile[field], item] });
  };
  const removeItem = (field, index) => {
    const newArray = [...profile[field]];
    newArray.splice(index, 1);
    setProfile({ ...profile, [field]: newArray });
  };
  const updateItem = (field, index, key, value) => {
    const newArray = [...profile[field]];
    newArray[index][key] = value;
    setProfile({ ...profile, [field]: newArray });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 border-r border-zinc-800 p-6 flex flex-col bg-black z-50 fixed h-full md:relative">
        <h1 className="text-2xl font-bold text-[#00de51] mb-8">Admin Panel</h1>
        <nav className="flex-1 space-y-2">
            {[
              { id: 'projects', icon: Briefcase, label: 'Projects' },
              { id: 'messages', icon: Mail, label: 'Inbox' }, // NEW TAB
              { id: 'profile', icon: User, label: 'Basic Info' },
              { id: 'resume_data', icon: BookOpen, label: 'Exp & Edu' },
              { id: 'tech', icon: Layers, label: 'Tech Stack' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-[#00de51] text-black font-bold' : 'text-zinc-400 hover:bg-zinc-900'}`}>
                <tab.icon size={20} /> 
                <span>{tab.label}</span>
                {/* Badge for Messages */}
                {tab.id === 'messages' && messages.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{messages.length}</span>
                )}
              </button>
            ))}
        </nav>
        <button onClick={() => {localStorage.removeItem('token'); navigate('/admin');}} className="flex items-center gap-2 text-red-500 hover:text-red-400 mt-4 md:mt-auto">
            <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen ml-0 md:ml-0">
        
        {/* === TAB: PROJECTS === */}
        {activeTab === 'projects' && (
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Manage Projects</h2>
                <form onSubmit={handleProjectSubmit} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-10 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="bg-black p-3 rounded border border-zinc-700 text-white" placeholder="Title" required 
                            value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                        <input className="bg-black p-3 rounded border border-zinc-700 text-white" placeholder="Tech Stack (comma separated)" required 
                            value={newProject.techStack} onChange={e => setNewProject({...newProject, techStack: e.target.value})} />
                    </div>
                    <textarea className="w-full bg-black p-3 rounded border border-zinc-700 text-white" placeholder="Description" rows="2" required
                        value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="bg-black p-3 rounded border border-zinc-700 text-white" placeholder="Live Link" 
                            value={newProject.liveLink} onChange={e => setNewProject({...newProject, liveLink: e.target.value})} />
                        <input className="bg-black p-3 rounded border border-zinc-700 text-white" placeholder="Repo Link" 
                            value={newProject.repoLink} onChange={e => setNewProject({...newProject, repoLink: e.target.value})} />
                    </div>
                    <input type="file" required onChange={e => setNewProject({...newProject, image: e.target.files[0]})} className="text-zinc-400" />
                    <button className="bg-[#00de51] text-black font-bold px-6 py-2 rounded-lg w-full">Add Project</button>
                </form>
                <div className="space-y-4">
                    {projects.map(p => (
                        <div key={p._id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                            <div className="flex items-center gap-4">
                                {p.image && <img src={p.image.startsWith('http') ? p.image : `http://localhost:5000/${p.image}`} className="w-12 h-12 object-cover rounded" />}
                                <div><h4 className="font-bold">{p.title}</h4></div>
                            </div>
                            <button onClick={() => handleDeleteProject(p._id)} className="text-zinc-500 hover:text-red-500"><Trash2 size={20} /></button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* === TAB: INBOX / MESSAGES (NEW) === */}
        {activeTab === 'messages' && (
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    Inbox <span className="text-sm bg-zinc-800 px-3 py-1 rounded-full text-zinc-400">{messages.length}</span>
                </h2>
                
                {messages.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500">No messages yet.</div>
                ) : (
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div key={msg._id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 relative group hover:border-[#00de51]/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{msg.name}</h3>
                                        <a href={`mailto:${msg.email}`} className="text-[#00de51] text-sm hover:underline">{msg.email}</a>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-zinc-500 flex items-center gap-1 justify-end">
                                            <Calendar size={12}/> {new Date(msg.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-zinc-600">{new Date(msg.date).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className="bg-black/50 p-4 rounded-lg border border-zinc-800/50 text-zinc-300 text-sm leading-relaxed">
                                    {msg.message}
                                </div>
                                <button 
                                    onClick={() => handleDeleteMessage(msg._id)}
                                    className="absolute top-14 right-6 text-zinc-600 hover:text-red-500 transition-colors bg-zinc-900 p-2 rounded-full border border-zinc-800 hover:border-red-500/50"
                                    title="Delete Message"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* === TAB: PROFILE === */}
        {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Basic Info</h2>
                <form onSubmit={handleProfileUpdate} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 space-y-6">
                    <input className="w-full bg-black p-3 rounded border border-zinc-700 text-white" placeholder="Full Name"
                        value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                    <input className="w-full bg-black p-3 rounded border border-zinc-700 text-white" placeholder="Roles (e.g. Dev, Designer)"
                        value={profile.roles} onChange={e => setProfile({...profile, roles: e.target.value})} />
                    <textarea className="w-full bg-black p-3 rounded border border-zinc-700 text-white" rows="4" placeholder="Bio"
                        value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-zinc-400">
                         <div>Photo: <input type="file" onChange={e => setProfile({...profile, profileImage: e.target.files[0]})} /></div>
                         <div>Resume: <input type="file" onChange={e => setProfile({...profile, resume: e.target.files[0]})} /></div>
                    </div>

                    <h3 className="text-lg font-bold mt-4">Social Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input className="bg-black p-3 rounded border border-zinc-700" placeholder="LinkedIn" value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} />
                        <input className="bg-black p-3 rounded border border-zinc-700" placeholder="GitHub" value={profile.github} onChange={e => setProfile({...profile, github: e.target.value})} />
                        <input className="bg-black p-3 rounded border border-zinc-700" placeholder="Twitter" value={profile.twitter} onChange={e => setProfile({...profile, twitter: e.target.value})} />
                        <input className="bg-black p-3 rounded border border-zinc-700" placeholder="Insta/YT" value={profile.instagram} onChange={e => setProfile({...profile, instagram: e.target.value})} />
                        <input className="bg-black p-3 rounded border border-zinc-700 col-span-2" placeholder="Email Address (For Contact Form)" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                    </div>
                    <button className="w-full bg-[#00de51] text-black font-bold p-4 rounded-xl mt-4">Save Profile</button>
                </form>
            </div>
        )}

        {/* === TAB: EXP & EDU === */}
        {activeTab === 'resume_data' && (
            <div className="max-w-3xl mx-auto space-y-10">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Experience</h2>
                        <button onClick={() => addItem('experience', { role: '', company: '', year: '', desc: '' })} className="bg-zinc-800 p-2 rounded hover:bg-zinc-700"><Plus size={20}/></button>
                    </div>
                    {profile.experience.map((exp, i) => (
                        <div key={i} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-4 relative group">
                            <button onClick={() => removeItem('experience', i)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <input className="bg-black p-2 rounded border border-zinc-700" placeholder="Role (e.g. Developer)" value={exp.role} onChange={e => updateItem('experience', i, 'role', e.target.value)} />
                                <input className="bg-black p-2 rounded border border-zinc-700" placeholder="Company" value={exp.company} onChange={e => updateItem('experience', i, 'company', e.target.value)} />
                            </div>
                            <input className="bg-black p-2 rounded border border-zinc-700 w-full mb-2" placeholder="Year (e.g. 2024 - Present)" value={exp.year} onChange={e => updateItem('experience', i, 'year', e.target.value)} />
                            <textarea className="bg-black p-2 rounded border border-zinc-700 w-full" rows="2" placeholder="Description" value={exp.desc} onChange={e => updateItem('experience', i, 'desc', e.target.value)} />
                        </div>
                    ))}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Education</h2>
                        <button onClick={() => addItem('education', { degree: '', school: '', year: '' })} className="bg-zinc-800 p-2 rounded hover:bg-zinc-700"><Plus size={20}/></button>
                    </div>
                    {profile.education.map((edu, i) => (
                        <div key={i} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-4 relative group">
                            <button onClick={() => removeItem('education', i)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <input className="bg-black p-2 rounded border border-zinc-700" placeholder="Degree (e.g. BCA)" value={edu.degree} onChange={e => updateItem('education', i, 'degree', e.target.value)} />
                                <input className="bg-black p-2 rounded border border-zinc-700" placeholder="School/College" value={edu.school} onChange={e => updateItem('education', i, 'school', e.target.value)} />
                            </div>
                            <input className="bg-black p-2 rounded border border-zinc-700 w-full" placeholder="Year (e.g. 2022 - 2025)" value={edu.year} onChange={e => updateItem('education', i, 'year', e.target.value)} />
                        </div>
                    ))}
                </div>
                <button onClick={handleProfileUpdate} className="w-full bg-[#00de51] text-black font-bold p-4 rounded-xl">Save All Changes</button>
            </div>
        )}

        {/* === TAB: TECH STACK === */}
        {activeTab === 'tech' && (
            <div className="max-w-3xl mx-auto">
                 <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Tech Stack</h2>
                        <button onClick={() => addItem('techStack', { name: '', level: '50', color: '#ffffff' })} className="bg-zinc-800 p-2 rounded hover:bg-zinc-700"><Plus size={20}/></button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.techStack.map((tech, i) => (
                        <div key={i} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center gap-4 relative group">
                            <button onClick={() => removeItem('techStack', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                            <input type="color" className="w-10 h-10 rounded cursor-pointer bg-transparent" value={tech.color} onChange={e => updateItem('techStack', i, 'color', e.target.value)} />
                            <div className="flex-1 space-y-2">
                                <input className="bg-black p-2 rounded border border-zinc-700 w-full text-sm" placeholder="Tech Name" value={tech.name} onChange={e => updateItem('techStack', i, 'name', e.target.value)} />
                                <div className="flex items-center gap-2">
                                    <input type="range" min="0" max="100" className="flex-1 accent-[#00de51]" value={tech.level} onChange={e => updateItem('techStack', i, 'level', e.target.value)} />
                                    <span className="text-xs text-zinc-500 w-8">{tech.level}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
                 <button onClick={handleProfileUpdate} className="w-full bg-[#00de51] text-black font-bold p-4 rounded-xl mt-6">Save Tech Stack</button>
            </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
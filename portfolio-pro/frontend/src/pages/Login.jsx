// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Lock, Mail, ArrowRight, Hexagon } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        const result = await login(email, password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-zinc-50'}`}>
            <div className={`w-full max-w-md p-8 md:p-10 rounded-[2.5rem] border backdrop-blur-xl shadow-2xl relative overflow-hidden
                ${isDark ? 'bg-zinc-900/40 border-zinc-800/50' : 'bg-white border-zinc-200'}`}>
                
                {/* Background Glow */}
                {isDark && <div className="absolute -top-[20%] -right-[20%] w-[70%] h-[70%] bg-[#00de51]/10 blur-[80px] rounded-full pointer-events-none" />}

                <div className="relative z-10 flex flex-col items-center mb-10">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#00de51]/10 border border-[#00de51]/20 text-[#00de51] mb-6">
                        <Hexagon size={32} strokeWidth={1.5} />
                    </div>
                    <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Admin Portal</h2>
                    <p className={`text-sm mt-2 font-medium uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Authorized Access Only</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                    <div className="relative group">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 size-5 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-[#00de51]' : 'text-zinc-400 group-focus-within:text-[#00de51]'}`} />
                        <input 
                            type="email" 
                            placeholder="Admin Email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-transparent border py-4 pl-12 pr-4 rounded-2xl font-medium focus:outline-none transition-all
                                ${isDark ? 'border-zinc-800 text-white focus:border-[#00de51] bg-black/20' : 'border-zinc-300 text-black focus:border-[#00de51] bg-zinc-50'}`} 
                        />
                    </div>
                    
                    <div className="relative group">
                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 size-5 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-[#00de51]' : 'text-zinc-400 group-focus-within:text-[#00de51]'}`} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-transparent border py-4 pl-12 pr-4 rounded-2xl font-medium focus:outline-none transition-all
                                ${isDark ? 'border-zinc-800 text-white focus:border-[#00de51] bg-black/20' : 'border-zinc-300 text-black focus:border-[#00de51] bg-zinc-50'}`} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-4 bg-[#00de51] text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-[#00c94a] transition-all shadow-[0_0_20px_rgba(0,222,81,0.2)] hover:shadow-[0_0_30px_rgba(0,222,81,0.4)] disabled:opacity-50"
                    >
                        {isSubmitting ? "Authenticating..." : "Secure Login"} <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
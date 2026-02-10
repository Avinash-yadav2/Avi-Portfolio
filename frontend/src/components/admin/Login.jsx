import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api'; // Ensure this path is correct
import { Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to backend
      const res = await API.post('/auth/login', { username, password });
      
      // Save token
      localStorage.setItem('token', res.data.token);
      
      // Success
      alert('Login Success!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.message || 'Invalid Credentials or Server Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white p-4">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
        <div className="flex justify-center mb-4 text-[#00de51]">
            <div className="p-4 bg-[#00de51]/10 rounded-full border border-[#00de51]/20">
                <Lock size={32} />
            </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Admin Access</h2>
        
        <input 
          type="text" placeholder="Username" required
          value={username} onChange={(e) => setUsername(e.target.value)}
          className="bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-[#00de51] outline-none transition-colors"
        />
        <input 
          type="password" placeholder="Password" required
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-[#00de51] outline-none transition-colors"
        />
        
        <button type="submit" disabled={loading} className="bg-[#00de51] text-black font-bold p-3 rounded-lg hover:bg-[#00c548] transition-colors mt-2 disabled:opacity-50">
          {loading ? 'Unlocking...' : 'Unlock Dashboard'}
        </button>
      </form>
    </div>
  );
};

export default Login;
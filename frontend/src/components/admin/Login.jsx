import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api'; // Your axios instance
import { Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { username, password });
      // Save token to LocalStorage
      localStorage.setItem('token', res.data.token);
      alert('Login Success!');
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Invalid Credentials!');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-96 flex flex-col gap-4 shadow-xl">
        <div className="flex justify-center mb-4 text-[#00de51]">
            <div className="p-4 bg-[#00de51]/10 rounded-full">
                <Lock size={32} />
            </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Admin Access</h2>
        
        <input 
          type="text" placeholder="Username" 
          value={username} onChange={(e) => setUsername(e.target.value)}
          className="bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-[#00de51] outline-none"
        />
        <input 
          type="password" placeholder="Password" 
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-[#00de51] outline-none"
        />
        
        <button type="submit" className="bg-[#00de51] text-black font-bold p-3 rounded-lg hover:bg-[#00c548] transition-colors mt-2">
          Unlock Dashboard
        </button>
      </form>
    </div>
  );
};

export default Login;
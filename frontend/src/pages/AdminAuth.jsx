import React, { useState } from 'react';
import { Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const AdminAuth = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.username, 
          password: formData.password 
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAA520] opacity-5 rounded-bl-full"></div>
        
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 border border-[#DAA520] rounded-full items-center justify-center mb-6">
            <Lock className="text-[#DAA520]" size={24} />
          </div>
          <h1 className="text-2xl font-serif text-white tracking-widest uppercase">Admin Access</h1>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em]">Alpine Architecture Studios</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 font-sans">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="text" required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-black border border-zinc-900 focus:border-[#DAA520] outline-none px-10 py-3 text-white transition-colors text-sm" 
                placeholder="admin"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="password" required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-black border border-zinc-900 focus:border-[#DAA520] outline-none px-10 py-3 text-white transition-colors text-sm" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#DAA520] text-black font-bold py-4 text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                AUTHENTICATE <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-gray-600 uppercase tracking-widest italic">
          Authorized personnel only. Sessions are logged.
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;


import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
  onLogin: (email: string, password?: string) => boolean;
  onForgot: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack, onLogin, onForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const success = onLogin(email, password);
    if (!success) {
      setError('Account not found. Please Sign Up first!');
    }
  };

  return (
    <div className="flex flex-col h-full px-8 pt-10 overflow-y-auto no-scrollbar pb-10">
      <button onClick={onBack} className="w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center mb-12">
        <ArrowLeft className="w-5 h-5 text-black" />
      </button>

      <div className="text-center mb-10">
        <h2 className="text-xl font-black text-slate-800">Study Mate</h2>
        <p className="text-xs font-bold text-slate-400 uppercase mt-1">Log in to your account</p>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border border-white/30 space-y-6 shadow-sm">
        {error && (
          <div className="bg-rose-100 border border-rose-300 text-rose-700 px-4 py-2 rounded-xl text-[10px] font-bold text-center animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 ml-1">Email</label>
          <input 
            className="w-full bg-white rounded-xl p-3 text-sm focus:outline-none shadow-inner text-black font-bold" 
            placeholder="example@mail.com" 
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 ml-1">Password</label>
          <input 
            type="password" 
            className="w-full bg-white rounded-xl p-3 text-sm focus:outline-none shadow-inner text-black font-bold" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
          />
          <button onClick={onForgot} className="text-[10px] font-bold text-slate-500 w-full text-right mt-2 active:text-slate-800">Forgot Password?</button>
        </div>

        <div className="pt-4 flex justify-center">
          <button 
            onClick={handleLogin} 
            className="bg-purple-200 border border-purple-400 text-purple-800 px-10 py-2 rounded-xl text-xs font-black shadow-sm active:scale-95 transition-transform uppercase tracking-widest"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

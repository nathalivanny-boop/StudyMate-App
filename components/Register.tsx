
import React, { useState } from 'react';
import { ArrowLeft, Award } from 'lucide-react';

interface RegisterProps {
  onBack: () => void;
  onComplete: (nickname: string, email: string, password?: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!nickname || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setStep(2);
  };

  if (step === 2) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-10 text-center space-y-8 animate-in zoom-in duration-300">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Account Created!</h2>
        <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center shadow-lg bg-white/40">
           <Award className="w-8 h-8 text-black" />
        </div>
        
        <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border border-white/30 space-y-4 shadow-sm">
          <h3 className="text-xl font-black text-slate-800">Hello {nickname || 'Nny'}</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Thank you for choosing Study Mate! We are excited to have you join our community. We hope this app helps you reach all your study goals.
          </p>
        </div>

        <button 
          onClick={() => onComplete(nickname, email, password)} 
          className="bg-black text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform"
        >
          Go To Home Page
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-8 pt-10 overflow-y-auto no-scrollbar pb-10">
      <button onClick={onBack} className="w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center mb-12">
        <ArrowLeft className="w-5 h-5 text-black" />
      </button>

      <div className="text-center mb-10">
        <h2 className="text-xl font-black text-slate-800">Study Mate</h2>
        <p className="text-xs font-bold text-slate-400 uppercase mt-1">Join the community</p>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border border-white/30 space-y-5 shadow-sm">
        {error && (
          <div className="bg-rose-100 border-2 border-rose-400 text-rose-800 px-4 py-2 rounded-xl text-[10px] font-black text-center animate-pulse">
            {error}
          </div>
        )}
        
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-600 ml-1 uppercase">Nickname</label>
          <input 
            className="w-full bg-white rounded-xl p-3 text-sm focus:outline-none shadow-inner text-black font-bold border-2 border-transparent focus:border-black" 
            placeholder="Choose a nickname" 
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setError(''); }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-600 ml-1 uppercase">Email</label>
          <input 
            className="w-full bg-white rounded-xl p-3 text-sm focus:outline-none shadow-inner text-black font-bold border-2 border-transparent focus:border-black" 
            placeholder="example@mail.com" 
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-600 ml-1 uppercase">Password</label>
          <input 
            type="password" 
            className="w-full bg-white rounded-xl p-3 text-sm focus:outline-none shadow-inner text-black font-bold border-2 border-transparent focus:border-black" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-600 ml-1 uppercase">Confirm Password</label>
          <input 
            type="password" 
            className="w-full bg-white rounded-xl p-3 text-sm focus:outline-none shadow-inner text-black font-bold border-2 border-transparent focus:border-black" 
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
          />
        </div>

        <div className="pt-4 flex justify-center">
          <button onClick={handleNext} className="bg-black text-white px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;


import React, { useState, useEffect } from 'react';
import { ArrowLeft, KeyRound, CheckCircle2, Mail, ShieldCheck, Timer, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';
import { triggerRecoveryEmail } from '../services/emailService';

interface ForgotPasswordProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
  registeredUsers: UserProfile[];
  onOpenSupport?: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onSuccess, registeredUsers, onOpenSupport }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: Success
  const [error, setError] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [userCodeInput, setUserCodeInput] = useState('');
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('60:00');

  // Timer logic for 1-hour expiration
  useEffect(() => {
    if (step === 2 && expiryTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const diff = expiryTime - now;

        if (diff <= 0) {
          setError('Code expired. Please request a new one.');
          clearInterval(interval);
          setTimeLeft('00:00');
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, expiryTime]);

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!found) {
      setError('Email not found in our records.');
    } else {
      const code = generateCode();
      const expiration = Date.now() + 3600000; // 1 hour from now
      
      setResetCode(code);
      setExpiryTime(expiration);
      
      const success = await triggerRecoveryEmail({
        to: email,
        subject: "Study Mate Account Recovery",
        nickname: found.nickname,
        token: code
      });
      
      if (success) {
        setStep(2);
        setError('');
      } else {
        setError('Service temporarily unavailable. Try again.');
      }
    }
  };

  const handleVerifyCode = () => {
    if (expiryTime && Date.now() > expiryTime) {
      setError('This code has expired.');
      return;
    }

    if (userCodeInput === resetCode) {
      setStep(3);
    } else {
      setError('Incorrect verification code.');
    }
  };

  if (step === 3) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-10 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-black text-white rounded-[40px] flex items-center justify-center shadow-xl border-4 border-white/20">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Identity Verified</h2>
          <p className="text-xs text-slate-500 font-bold leading-relaxed px-4">
            Security check passed. Your session is now authorized for password modification.
          </p>
        </div>
        <button 
          onClick={() => onSuccess(email)}
          className="bg-black text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
        >
          Reset Password
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex flex-col h-full px-8 pt-10 overflow-y-auto no-scrollbar pb-10 animate-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setStep(1)} 
          className="w-10 h-10 shrink-0 rounded-full bg-black flex items-center justify-center mb-12 shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white border-2 border-black rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShieldCheck className="text-black w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-800 uppercase">Input Token</h2>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <Timer size={12} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expires in: {timeLeft}</span>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-2 border-black space-y-6 shadow-sm">
          {error && (
            <div className={`border-2 px-4 py-2 rounded-xl text-[10px] font-bold text-center ${error.includes('expired') ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-rose-100 border-rose-300 text-rose-700'}`}>
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 ml-1 uppercase tracking-widest text-center block w-full">6-Digit Verification Code</label>
            <input 
              className="w-full bg-white rounded-2xl p-4 text-2xl text-center focus:outline-none shadow-inner text-black font-black tracking-[0.5em] border-2 border-transparent focus:border-black transition-all" 
              placeholder="000000"
              maxLength={6}
              value={userCodeInput}
              onChange={(e) => { setUserCodeInput(e.target.value); setError(''); }}
            />
          </div>

          <button 
            onClick={handleVerifyCode}
            className="w-full bg-black text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform"
          >
            Verify Identity
          </button>

          <button 
            onClick={handleSubmit}
            className="w-full flex items-center justify-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-black transition-colors"
          >
            <RefreshCw size={12} />
            <span>Resend New Code</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-8 pt-10 overflow-y-auto no-scrollbar pb-10 animate-in slide-in-from-right-4 duration-300">
      <button 
        onClick={onBack} 
        className="w-10 h-10 shrink-0 rounded-full bg-black flex items-center justify-center mb-12 shadow-md"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-white border-2 border-black rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <KeyRound className="text-black w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Security Recovery</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 max-w-[200px] mx-auto leading-relaxed">
          Verify your ownership by receiving a cryptographically secure token to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-2 border-black space-y-6 shadow-sm">
        {error && (
          <div className="bg-rose-100 border border-rose-300 text-rose-700 px-4 py-2 rounded-xl text-[10px] font-bold text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-600 ml-1 uppercase tracking-widest">Registered User Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full bg-white rounded-2xl p-4 pl-12 text-sm focus:outline-none shadow-inner text-black font-bold border-2 border-transparent focus:border-black transition-all" 
              placeholder="user@domain.com" 
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-black text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform flex items-center justify-center space-x-2"
        >
          <Mail size={16} />
          <span>Send Secure Token</span>
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

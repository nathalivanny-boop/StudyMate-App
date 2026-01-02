
import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  onBack: () => void;
  onLogout: () => void;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack, onLogout, profile, setProfile }) => {
  const [success, setSuccess] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);
  const [email, setEmail] = useState(profile.email);

  useEffect(() => {
    setNickname(profile.nickname);
    setEmail(profile.email);
  }, [profile]);

  const handleSave = () => {
    setProfile({ nickname, email });
    setSuccess(true);
  };

  if (success) {
    return (
       <div className="flex flex-col h-full items-center justify-center px-10 text-center space-y-8 pt-20">
         <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-16 border border-white/30 shadow-sm w-full">
           <h3 className="text-xl font-black text-slate-800 leading-tight">Your Profile Has Been Saved!</h3>
         </div>
         <button onClick={() => { setSuccess(false); onBack(); }} className="bg-purple-200 border border-purple-400 text-purple-800 px-8 py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform">
           Go To Home
         </button>
       </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-8 pt-4 pb-12 overflow-y-auto no-scrollbar">
      <button onClick={onBack} className="w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center mb-4 active:scale-90 transition-transform">
        <ArrowLeft className="w-5 h-5 text-black" />
      </button>

      <div className="flex flex-col items-center space-y-4 mb-8">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Edit Profile</h2>
        <div className="w-20 h-20 rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-800 shadow-sm bg-white/20">
          <UserCircle className="w-14 h-14" />
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border border-white/30 space-y-4 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 ml-1 uppercase">Nickname</label>
          <input 
            className="w-full bg-white rounded-xl p-3 text-sm focus:outline-none shadow-inner font-bold text-black" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 ml-1 uppercase">Email</label>
          <input 
            className="w-full bg-white rounded-xl p-3 text-sm focus:outline-none shadow-inner font-bold text-black" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 ml-1 uppercase">New Password</label>
          <input type="password" placeholder="••••••••" className="w-full bg-white rounded-xl p-3 text-sm focus:outline-none shadow-inner font-bold text-black" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 ml-1 uppercase">Confirm Password</label>
          <input type="password" placeholder="••••••••" className="w-full bg-white rounded-xl p-3 text-sm focus:outline-none shadow-inner font-bold text-black" />
        </div>

        <div className="h-4"></div>

        <div className="pt-4 flex flex-col space-y-4 items-center">
          <button 
            onClick={handleSave}
            className="bg-purple-200 border border-purple-400 text-purple-800 px-8 py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform uppercase tracking-widest"
          >
            Save Profile
          </button>
          <button 
            onClick={onLogout}
            className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-2 hover:text-rose-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="h-20"></div>
    </div>
  );
};

export default Profile;

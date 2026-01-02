import React from 'react';
import { UserPlus, Share2, Calendar, Github } from 'lucide-react';

interface WelcomeProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onLogin, onSignUp }) => {
  const features = [
    { icon: <UserPlus />, title: 'Find Studymate', desc: 'connect with peers' },
    { icon: <Share2 />, title: 'Share Notes', desc: 'exchange study tips' },
    { icon: <Calendar />, title: 'Study Planner', desc: 'plan your study time' },
    { icon: <Github />, title: 'Anonymous', desc: 'without revealing identity' },
  ];

  return (
    <div className="flex flex-col h-full px-8 py-12 items-center justify-between">
      <h1 className="text-2xl font-black text-slate-800 mt-8">Welcome To Study Mate</h1>
      
      <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
        {features.map((f, i) => (
          <div key={i} className="bg-white/30 backdrop-blur-md rounded-[32px] p-4 border border-white/40 flex flex-col items-center text-center space-y-2 shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center text-slate-800 border-2 border-slate-800 rounded-xl mb-1">
              {/* Added explicit any cast to React.ReactElement to resolve size prop compatibility error */}
              {React.cloneElement(f.icon as React.ReactElement<any>, { size: 28 })}
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-tight text-slate-800">{f.title}</h3>
            <p className="text-[10px] leading-tight text-slate-600 font-medium px-2">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex space-x-4 w-full max-w-sm mb-8">
        <button 
          onClick={onLogin}
          className="flex-1 bg-white/60 border border-purple-300 text-purple-800 py-2.5 rounded-lg text-sm font-bold shadow-sm"
        >
          Log In
        </button>
        <button 
          onClick={onSignUp}
          className="flex-1 bg-slate-800 text-white py-2.5 rounded-lg text-sm font-bold shadow-md"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Welcome;
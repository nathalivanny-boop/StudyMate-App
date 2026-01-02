
import React from 'react';
import { ViewMode } from '../types';
import { UserPlus, Github, Calendar, BookOpen } from 'lucide-react';

interface DashboardProps {
  setView: (view: ViewMode) => void;
  isAnonymous: boolean;
  setIsAnonymous: (val: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, isAnonymous, setIsAnonymous }) => {
  const cards = [
    { title: 'Find Studymate', label: 'Find', icon: <UserPlus />, action: () => setView(ViewMode.EXPLORE) },
    { title: 'Study Planner', label: 'Plan', icon: <Calendar />, action: () => setView(ViewMode.STUDY_PLANNER) },
    { title: 'Share Notes', label: 'Share', icon: <BookOpen />, action: () => setView(ViewMode.SHARE_NOTES) },
    { 
      title: 'Anonymous Profile', 
      label: isAnonymous ? 'On' : 'Off', 
      icon: <Github />, 
      action: () => setIsAnonymous(!isAnonymous),
      isActive: isAnonymous
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 pt-4 px-2 pb-10 overflow-y-auto no-scrollbar">
      {cards.map((c, i) => (
        <div key={i} className="bg-white/30 backdrop-blur-md rounded-[35px] p-5 border border-white/40 flex flex-col items-center text-center space-y-3 shadow-sm h-48 justify-between active:scale-95 transition-transform">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center border-2 rounded-xl mb-2 transition-colors ${c.isActive ? 'bg-slate-800 text-white border-slate-800' : 'text-slate-800 border-slate-800'}`}>
              {React.cloneElement(c.icon as React.ReactElement<any>, { size: 24 })}
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-tight text-slate-800 leading-tight">{c.title}</h3>
          </div>
          
          <button 
            onClick={c.action}
            className={`${c.isActive ? 'bg-indigo-600' : 'bg-slate-800'} text-white w-full py-1.5 rounded-xl text-[9px] font-black uppercase shadow-sm transition-colors`}
          >
            {c.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;

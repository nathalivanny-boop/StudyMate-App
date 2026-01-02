
import React from 'react';
import { ArrowLeft, MessageSquare, Users, PlusCircle } from 'lucide-react';

interface MyGroupsProps {
  onBack: () => void;
  joinedGroups: string[];
  onGroupChat: (name: string) => void;
  onExplore: () => void;
}

const MyGroups: React.FC<MyGroupsProps> = ({ onBack, joinedGroups, onGroupChat, onExplore }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 px-4 pt-2 pb-20">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack} 
          className="w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <div className="bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border-2 border-black shadow-sm flex items-center space-x-3">
           <Users className="w-5 h-5 text-black" />
           <span className="text-sm font-black text-black uppercase tracking-tight">My Group Chats</span>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-2 border-black space-y-6 shadow-sm min-h-[400px]">
        {joinedGroups.length > 0 ? (
          joinedGroups.map((g, i) => (
            <button 
              key={i} 
              onClick={() => onGroupChat(g)}
              className="w-full flex justify-between items-center p-4 bg-white/60 rounded-2xl border-2 border-black active:scale-[0.98] transition-all hover:bg-white/90"
            >
              <div className="flex flex-col items-start">
                 <span className="text-[11px] font-black text-black uppercase">{g}</span>
                 <span className="text-[9px] font-bold text-slate-500 uppercase">Tap to join discussion</span>
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-black text-white shadow-sm">
                <MessageSquare size={16} />
              </div>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
               <Users size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-black uppercase">You haven't joined any groups</p>
              <p className="text-[9px] text-slate-400 font-bold px-10 leading-relaxed">Join a study community to start sharing notes and chatting with classmates.</p>
            </div>
            <button 
              onClick={onExplore}
              className="bg-black text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md flex items-center space-x-2 active:scale-95 transition-transform"
            >
              <PlusCircle size={14} />
              <span>Explore Groups</span>
            </button>
          </div>
        )}
      </div>
      
      <p className="text-[9px] font-black text-black/20 italic uppercase text-center pt-4">Your private study communities</p>
    </div>
  );
};

export default MyGroups;

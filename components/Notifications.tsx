
import React from 'react';
import { ArrowLeft, MessageSquare, UserPlus, Check, X, Bell } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsProps {
  onBack: () => void;
  notifications: Notification[];
  onOpenChat: (sender: string) => void;
  onAccept: (name: string, id: string) => void;
  onDecline: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onBack, notifications, onOpenChat, onAccept, onDecline }) => {
  const friendRequests = notifications.filter(n => n.type === 'friend_request');
  const messages = notifications.filter(n => n.type === 'message' || !n.type);

  return (
    <div className="flex flex-col h-full px-6 pt-2 pb-20 animate-in fade-in duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={onBack} 
          className="w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <div className="bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border-2 border-black shadow-sm flex items-center space-x-2">
           <Bell size={16} className="text-black" />
           <span className="text-sm font-black text-black uppercase tracking-tighter">Notifications</span>
        </div>
      </div>

      <div className="space-y-6 overflow-y-auto no-scrollbar flex-1">
        {/* Friend Requests Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-black uppercase tracking-widest ml-4">Friend Requests ({friendRequests.length})</h3>
          <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-4 border-2 border-black shadow-sm space-y-3">
            {friendRequests.length > 0 ? (
              friendRequests.map(fr => (
                <div key={fr.id} className="bg-white p-4 rounded-[28px] border-2 border-black flex flex-col shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-black border-2 border-black shrink-0">
                        <UserPlus size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-black text-black uppercase truncate">{fr.sender}</h4>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">{fr.message}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 w-full">
                    <button 
                      onClick={() => onAccept(fr.sender, fr.id)}
                      className="flex-1 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center border-2 border-emerald-600 active:scale-95 transition-transform text-[10px] font-black uppercase tracking-widest"
                    >
                      <Check size={14} className="mr-1" />
                      Accept
                    </button>
                    <button 
                      onClick={() => onDecline(fr.id)}
                      className="flex-1 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center border-2 border-rose-600 active:scale-95 transition-transform text-[10px] font-black uppercase tracking-widest"
                    >
                      <X size={14} className="mr-1" />
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 opacity-40">
                <p className="text-[9px] font-black uppercase">No pending requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-black uppercase tracking-widest ml-4">Direct Messages</h3>
          <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-4 border-2 border-black shadow-sm space-y-3">
            {messages.length > 0 ? (
              messages.map(m => (
                <button 
                  key={m.id} 
                  onClick={() => onOpenChat(m.sender)}
                  className="w-full text-left bg-white p-4 rounded-[28px] border-2 border-black flex items-start space-x-4 active:scale-[0.98] transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shrink-0 border-2 border-black">
                    <MessageSquare size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="text-[11px] font-black text-black uppercase truncate">{m.sender}</h4>
                      <span className="text-[9px] font-bold text-slate-400">{m.time}</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-600 line-clamp-2 leading-snug">{m.message}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-10 opacity-40">
                <p className="text-[9px] font-black uppercase">Your inbox is empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

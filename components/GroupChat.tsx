
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Users, Info, X, MessageCircle, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';

interface GroupChatProps {
  onBack: () => void;
  groupName: string;
  onPrivateChat?: (name: string) => void;
}

const GroupChat: React.FC<GroupChatProps> = ({ onBack, groupName, onPrivateChat }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const groupMembers = [
    'Sheila Putri', 'Amir Hakim', 'Mira Santoso', 'Haris Pratama', 'Nia Ramadhani', 'Budi Sudarsono'
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = inputText;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text: userMsg,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    // Randomly pick a member to respond
    const responderName = groupMembers[Math.floor(Math.random() * groupMembers.length)];
    
    // Call service with history and group context
    const responseText = await getChatResponse(updatedMessages, responderName, groupName);

    const reply: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'other',
      senderName: responderName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, reply]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
      {/* Group Member Overlay */}
      {showMembers && (
        <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-md flex justify-end">
          <div className="w-3/4 bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l-2 border-black">
            <div className="p-6 border-b-2 border-black flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-black uppercase text-xs tracking-widest">Group Members</h3>
              <button onClick={() => setShowMembers(false)} className="text-black border-2 border-black rounded-full p-1">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {groupMembers.map((member, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white rounded-2xl border-2 border-black">
                  <span className="text-xs font-black text-black uppercase">{member}</span>
                  <button 
                    onClick={() => {
                      if(onPrivateChat) onPrivateChat(member);
                      setShowMembers(false);
                    }}
                    className="p-2 bg-black text-white rounded-xl active:scale-90 transition-transform"
                  >
                    <MessageCircle size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center space-x-4 p-6 shrink-0">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <div className="flex items-center space-x-3 bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border-2 border-black shadow-sm flex-1">
           <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white">
             <Users size={12} />
           </div>
           <div className="flex flex-col min-w-0 flex-1">
             <span className="text-[10px] font-black text-black uppercase tracking-tighter truncate leading-none mb-0.5">{groupName}</span>
             <span className="text-[8px] font-bold text-slate-500 uppercase leading-none">{groupMembers.length} Members</span>
           </div>
           <button onClick={() => setShowMembers(true)} className="text-black ml-2 border-2 border-black rounded-full p-0.5">
             <Info size={14} />
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar pb-4"
      >
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full opacity-30 space-y-2">
            <Users size={48} className="text-black" />
            <p className="text-[10px] font-black uppercase">The group chat is empty. Start a conversation!</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}>
            {m.sender === 'other' && m.senderName && (
              <span className="text-[9px] font-black text-black mb-1 ml-2 uppercase tracking-widest">{m.senderName}</span>
            )}
            <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-bold shadow-sm ${
              m.sender === 'me' 
                ? 'bg-black text-white rounded-br-none' 
                : 'bg-white text-black border-2 border-black rounded-bl-none'
            }`}>
              <p className="leading-relaxed">{m.text}</p>
              <span className={`block text-[8px] mt-1 opacity-60 ${m.sender === 'me' ? 'text-right text-white' : 'text-left text-black'}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-white text-black border-2 border-black p-3 rounded-2xl rounded-bl-none flex items-center space-x-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-[10px] font-black uppercase">A classmate is typing...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 shrink-0">
        <div className="bg-white/60 backdrop-blur-xl border-2 border-black rounded-[30px] p-2 flex items-center space-x-2 shadow-lg">
          <input 
            type="text"
            className="flex-1 bg-transparent px-4 py-2 text-sm font-black text-black focus:outline-none placeholder:text-slate-400"
            placeholder="Write in group..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            disabled={isTyping}
            onClick={handleSend}
            className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white active:scale-90 transition-transform shadow-md disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default GroupChat;

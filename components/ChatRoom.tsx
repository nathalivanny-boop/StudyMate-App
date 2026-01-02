
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';

interface ChatRoomProps {
  onBack: () => void;
  friendName: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ onBack, friendName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    
    // We update state first for immediate UI feedback
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    // Call service with the full history (including the message we just added)
    const responseText = await getChatResponse(updatedMessages, friendName);
    
    const reply: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'other',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, reply]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center space-x-4 p-6 shrink-0">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <div className="flex items-center space-x-3 bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border-2 border-black shadow-sm">
           <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white">
             <User size={12} />
           </div>
           <span className="text-sm font-black text-black uppercase tracking-tighter truncate max-w-[120px]">{friendName}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 space-y-4 no-scrollbar pb-4"
      >
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full opacity-30 space-y-2">
            <User size={48} className="text-black" />
            <p className="text-[10px] font-black uppercase">No messages yet. Say hi to {friendName}!</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-3xl text-xs font-bold shadow-sm ${
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
                <span className="text-[10px] font-black uppercase">{friendName} is thinking...</span>
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
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            disabled={isTyping}
            onClick={handleSend}
            className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white active:scale-90 transition-transform disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default ChatRoom;

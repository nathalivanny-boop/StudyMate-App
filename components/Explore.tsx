
import React, { useState } from 'react';
import { Search, ArrowLeft, UserPlus, Check, MessageCircle, User, MessageSquare, FileText, Clock } from 'lucide-react';

interface ExploreProps {
  onBack: () => void;
  joinedGroups: string[];
  friendsList: string[];
  setJoinedGroups: React.Dispatch<React.SetStateAction<string[]>>;
  onChat: (userName: string) => void;
  onGroupChat: (groupName: string) => void;
  onRequestFriend: (name: string) => void;
}

const Explore: React.FC<ExploreProps> = ({ onBack, joinedGroups, friendsList, setJoinedGroups, onChat, onGroupChat, onRequestFriend }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'GROUPS' | 'FRIENDS' | 'NOTES'>('GROUPS');
  const [viewingNote, setViewingNote] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  
  const groups = [
    'Cognitive Neuroscience Group',
    'Web Programming Group',
    'Cognition Design Squad',
    'HCI Group',
    'Statistics Group',
    'Psychology Therapist',
    'Algorithms 101',
    'Machine Learning Advanced',
    'Human Biology Study',
    'World History Hub'
  ];

  const availableFriends = [
    'Sheila Putri',
    'Amir Hakim',
    'Mira Santoso',
    'Haris Pratama',
    'Nia Ramadhani',
    'Budi Sudarsono',
    'Kevin Sanjaya',
    'Greysia Polii',
    'Anthony Ginting',
    'Jonatan Christie'
  ];

  const friendNotes = [
    { title: 'KMK3103 Template FYP', author: 'Sheila', code: 'KMK3103', content: "This is a detailed template for your Final Year Project reporting. Make sure to follow the referencing guidelines strictly." },
    { title: 'Matlab Tutorial for CV', author: 'Amir', code: 'KMK102', content: "Quick guide for Computer Vision in Matlab. Essential functions: imread, imshow, rgb2gray, and edge detection algorithms." },
    { title: 'Computer Graphic Chapter 2', author: 'Mira', code: 'KMK123', content: "Summary of transformations in 2D and 3D space. Includes rotation matrices, scaling factors, and translation vectors." },
    { title: 'What is Agile Summary', author: 'Haris', code: 'KMK456', content: "Agile is an iterative approach to project management and software development that helps teams deliver value to their customers faster." },
    { title: 'Psychology 101 Notes', author: 'Nia', code: 'PSY101', content: "Basics of human behavior and mental processes. Key theories include Behaviorism, Cognitive Psychology, and Psychoanalysis." }
  ];

  const filteredGroups = groups.filter(g => 
    g.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFriends = availableFriends.filter(f => 
    f.toLowerCase().includes(search.toLowerCase())
  );

  const filteredNotes = friendNotes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.author.toLowerCase().includes(search.toLowerCase())
  );

  const toggleGroup = (groupName: string) => {
    setJoinedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(item => item !== groupName) 
        : [...prev, groupName]
    );
  };

  const handleAddFriend = (name: string) => {
    if (!pendingRequests.includes(name)) {
      setPendingRequests([...pendingRequests, name]);
      onRequestFriend(name);
    }
  };

  if (viewingNote) {
    return (
      <div className="space-y-6 px-4 pt-2 pb-20 animate-in fade-in duration-300">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setViewingNote(null)} 
            className="w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center bg-black"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border-2 border-black shadow-sm">
             <span className="text-sm font-black text-black uppercase truncate max-w-[150px] inline-block">Study Note</span>
          </div>
        </div>
        
        <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-2 border-black space-y-4 shadow-sm min-h-[400px]">
          <h2 className="text-xl font-black text-black leading-tight uppercase tracking-tight">{viewingNote.title}</h2>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 inline-block px-2 py-1 rounded-md">
            {viewingNote.author} • {viewingNote.code}
          </div>
          <div className="w-full h-px bg-black/10 my-4"></div>
          <div className="overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            <p className="text-sm font-bold text-black leading-relaxed whitespace-pre-wrap">
              {viewingNote.content || "No detailed content provided for this note yet."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 px-4 pt-2 pb-20">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack} 
          className="w-10 h-10 shrink-0 rounded-full bg-black flex items-center justify-center active:scale-90 transition-transform shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-black shadow-sm flex items-center space-x-3 w-full">
          <input 
            type="text"
            className="text-sm font-black text-black flex-1 bg-transparent focus:outline-none placeholder:text-slate-400"
            placeholder={
              activeTab === 'GROUPS' ? "Find Groups" : 
              activeTab === 'FRIENDS' ? "Find Friends" : "Find Shared Notes"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="w-5 h-5 text-black" />
        </div>
      </div>

      <div className="flex bg-white/30 backdrop-blur-md p-1 rounded-2xl border-2 border-black">
        <button 
          onClick={() => setActiveTab('GROUPS')}
          className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab === 'GROUPS' ? 'bg-black text-white' : 'text-slate-600'}`}
        >
          Groups
        </button>
        <button 
          onClick={() => setActiveTab('FRIENDS')}
          className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab === 'FRIENDS' ? 'bg-black text-white' : 'text-slate-600'}`}
        >
          Friends
        </button>
        <button 
          onClick={() => setActiveTab('NOTES')}
          className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab === 'NOTES' ? 'bg-black text-white' : 'text-slate-600'}`}
        >
          Notes
        </button>
      </div>

      {/* FIXED HEIGHT RESULTS CONTAINER */}
      <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-2 border-black shadow-sm h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 no-scrollbar custom-scrollbar">
          {activeTab === 'GROUPS' && (
            filteredGroups.length > 0 ? filteredGroups.map((g, i) => (
              <div key={i} className="flex justify-between items-center py-3 group border-b border-black/5 last:border-0">
                <span className="text-[11px] font-black text-black uppercase">{g}</span>
                <div className="flex space-x-2">
                  {joinedGroups.includes(g) && (
                    <button 
                      onClick={() => onGroupChat(g)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black text-black active:bg-black active:text-white transition-all shadow-sm bg-white"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => toggleGroup(g)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all shadow-sm ${joinedGroups.includes(g) ? 'bg-emerald-500 text-white border-2 border-emerald-600' : 'text-black border-2 border-black bg-white'}`}
                  >
                    {joinedGroups.includes(g) ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center text-[10px] text-slate-400 font-black uppercase py-10">
                No study groups found...
              </div>
            )
          )}

          {activeTab === 'FRIENDS' && (
            filteredFriends.length > 0 ? filteredFriends.map((f, i) => {
              const isFriend = friendsList.includes(f);
              const isPending = pendingRequests.includes(f);
              
              return (
                <div key={i} className="flex justify-between items-center py-3 group border-b border-black/5 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white border-2 border-black">
                      <User size={14} />
                    </div>
                    <span className="text-[11px] font-black text-black uppercase">{f}</span>
                  </div>
                  <div className="flex space-x-2">
                    {isFriend ? (
                      <button 
                        onClick={() => onChat(f)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black text-black active:bg-black active:text-white transition-all shadow-sm bg-white"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        disabled={isPending}
                        onClick={() => handleAddFriend(f)}
                        className={`px-3 py-1.5 rounded-lg border-2 transition-all shadow-sm text-[9px] font-black uppercase flex items-center space-x-1 ${isPending ? 'border-slate-300 text-slate-400 bg-slate-50' : 'border-black bg-white text-black active:bg-black active:text-white'}`}
                      >
                        {isPending ? (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-[10px] text-slate-400 font-black uppercase py-10">
                No students found...
              </div>
            )
          )}

          {activeTab === 'NOTES' && (
            filteredNotes.length > 0 ? filteredNotes.map((n, i) => (
              <div key={i} className="flex justify-between items-center py-3 group border-b border-black/5 last:border-0">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-black shrink-0" />
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-black uppercase truncate max-w-[120px]">{n.title}</span>
                     <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{n.author} • {n.code}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingNote(n)}
                  className="bg-black text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase shadow-sm active:scale-90 transition-transform"
                >
                  Get
                </button>
              </div>
            )) : (
              <div className="text-center text-[10px] text-slate-400 font-black uppercase py-10">
                No notes found...
              </div>
            )
          )}
        </div>

        <div className="text-[11px] font-black text-black/20 italic pt-6 uppercase text-center border-t border-black/5 mt-auto">
          Scroll to see more results
        </div>
      </div>
    </div>
  );
};

export default Explore;

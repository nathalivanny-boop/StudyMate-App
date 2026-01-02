
import React, { useState } from 'react';
import { Note, ViewMode } from '../types';
import { Plus, ArrowLeft, Image as ImageIcon, FileText, Users } from 'lucide-react';

interface ShareNotesProps {
  notes: Note[];
  setNotes: (notes: Note[] | ((prev: Note[]) => Note[])) => void;
  onBack: () => void;
  setView: (view: ViewMode) => void;
  friendsList: string[];
}

const ShareNotes: React.FC<ShareNotesProps> = ({ notes, setNotes, onBack, setView, friendsList }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // States for new note
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  const [viewingNote, setViewingNote] = useState<Note | null>(null);

  // This acts as a mock "global" database of community notes
  const communityNotes = [
    { 
      author: 'Sheila Putri', 
      title: 'UX Design Frameworks', 
      code: 'KMK3323',
      content: 'A comprehensive guide to UX frameworks including Agile UX, Lean UX, and Design Thinking. Key phases: Empathize, Define, Ideate, Prototype, Test.'
    },
    { 
      author: 'Amir Hakim', 
      title: 'Matlab Tutorial for Computer Vision', 
      code: 'KMK3103',
      content: 'Steps to initialize computer vision toolbox in Matlab. 1. Load image using imread(). 2. Convert to grayscale with rgb2gray(). 3. Apply edge detection using edge().'
    },
    { 
      author: 'Mira Santoso', 
      title: 'Intro To Cognitive Science Chapter 2', 
      code: 'KMK123',
      content: 'Mental representations and computational models. Discusses the analogy of the mind as a computer. Topics: Neurons, Artificial Intelligence, and Linguistics.'
    },
    { 
      author: 'Haris Pratama', 
      title: 'Agile Methodology Summary', 
      code: 'KMK456',
      content: 'Focuses on iterative development, customer feedback, and rapid releases. SCRUM, Kanban, and XP are the main frameworks discussed.'
    },
    { 
      author: 'Nia Ramadhani', 
      title: 'Psychology 101 Notes', 
      code: 'PSY101',
      content: 'Basics of human behavior and mental processes. Key theories include Behaviorism, Cognitive Psychology, and Psychoanalysis.'
    }
  ];

  // Only show notes from authors that are in the user's friends list
  const filteredFriendsNotes = communityNotes.filter(n => friendsList.includes(n.author));

  const handleUpload = () => {
    if (!noteTitle.trim()) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      author: 'Me',
      subject: 'My Notes',
      createdAt: new Date().toISOString(),
      tags: []
    };
    
    setNotes(prev => [newNote, ...prev]);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-10 text-center space-y-8 pt-20">
        <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-16 border-2 border-black shadow-sm w-full">
          <h3 className="text-xl font-black text-black uppercase leading-tight">Notes Uploaded!</h3>
        </div>
        <button 
          onClick={() => { setSuccess(false); setIsUploading(false); setNoteContent(''); setNoteTitle(''); }}
          className="bg-black text-white px-8 py-2 rounded-lg text-xs font-black shadow-md active:scale-95 transition-transform uppercase tracking-widest"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (viewingNote) {
    return (
      <div className="space-y-6 px-4 pt-2 pb-20 no-scrollbar overflow-y-auto animate-in fade-in duration-300">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setViewingNote(null)} 
            className="w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <div className="bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border-2 border-black shadow-sm">
             <span className="text-sm font-black text-black uppercase truncate max-w-[150px] inline-block">Study Note</span>
          </div>
        </div>
        
        <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-2 border-black space-y-4 shadow-sm min-h-[400px]">
          <h2 className="text-xl font-black text-black leading-tight">{viewingNote.title}</h2>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 inline-block px-2 py-1 rounded-md">
            {viewingNote.author} • {viewingNote.subject}
          </div>
          <div className="w-full h-px bg-black/10 my-4"></div>
          <p className="text-sm font-bold text-black leading-relaxed whitespace-pre-wrap">
            {viewingNote.content || "No detailed content provided for this note yet."}
          </p>
        </div>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div className="space-y-6 px-4 pt-2 pb-20 animate-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center space-x-4">
             <button 
               onClick={() => setIsUploading(false)} 
               className="w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center"
             >
               <ArrowLeft className="w-5 h-5 text-black" />
             </button>
             <div className="bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border-2 border-black shadow-sm flex items-center">
                <span className="text-sm font-black text-black uppercase">Post Note</span>
             </div>
           </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-2 border-black space-y-6 shadow-sm min-h-[500px] flex flex-col">
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Title</label>
             <input 
               type="text"
               className="font-black text-black bg-white rounded-xl p-4 text-sm focus:outline-none w-full border-2 border-black shadow-inner"
               value={noteTitle}
               onChange={(e) => setNoteTitle(e.target.value)}
               placeholder="Enter note title..."
             />
           </div>

           <div className="space-y-2 flex-1 flex flex-col">
             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Content</label>
             <div className="flex-1 rounded-2xl flex flex-col overflow-hidden bg-white p-4 border-2 border-black shadow-inner">
               <textarea 
                 className="flex-1 bg-transparent w-full resize-none text-sm font-bold text-black focus:outline-none"
                 placeholder="Write your study notes here..."
                 value={noteContent}
                 onChange={(e) => setNoteContent(e.target.value)}
               />
             </div>
           </div>
           
           <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 border-2 border-black p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <ImageIcon size={18} className="text-black" />
                <span className="text-[10px] font-black uppercase">Add Image</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 border-2 border-black p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <Plus size={18} className="text-black" />
                <span className="text-[10px] font-black uppercase">Attach File</span>
              </button>
           </div>

           <button 
             onClick={handleUpload}
             className="bg-black text-white w-full py-4 rounded-xl text-xs font-black shadow-md active:scale-95 transition-transform uppercase tracking-widest"
           >
             Post To Community
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 pt-2 pb-20 no-scrollbar overflow-y-auto h-full">
       <div className="flex justify-between items-center">
         <div className="flex items-center space-x-4">
           <button 
             onClick={onBack} 
             className="w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center"
           >
             <ArrowLeft className="w-5 h-5 text-black" />
           </button>
           <div className="bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border-2 border-black shadow-sm">
              <span className="text-sm font-black text-black uppercase tracking-tight">Share Notes</span>
           </div>
         </div>
       </div>

       {/* My Notes Section */}
       <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-2 border-black space-y-6 shadow-sm">
          <h3 className="font-black text-black uppercase tracking-widest text-xs">My Notes</h3>
          <div className="space-y-4">
            {notes.length > 0 ? notes.map((n) => (
              <div key={n.id} className="bg-white p-5 rounded-2xl border-2 border-black shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 mt-0.5 text-black" />
                  <div className="space-y-2 flex-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{n.subject}</span>
                    <p className="text-[11px] font-black text-black line-clamp-2 uppercase">{n.title}</p>
                    <button 
                      onClick={() => setViewingNote(n)}
                      className="bg-black text-white px-6 py-1 rounded-lg text-[9px] font-black uppercase shadow-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white/60 p-5 rounded-2xl border-2 border-black border-dashed flex flex-col items-center text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase">You haven't posted any notes yet</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsUploading(true)}
            className="w-full bg-black text-white py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center space-x-2 active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Note</span>
          </button>
       </div>

       {/* Friend's Notes Section */}
       <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-2 border-black space-y-6 shadow-sm">
          <h3 className="font-black text-black uppercase tracking-widest text-xs">Friend's Library</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
            {filteredFriendsNotes.length > 0 ? filteredFriendsNotes.map((n, i) => (
               <div key={i} className="bg-white p-5 rounded-2xl border-2 border-black shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform">
                 <div className="flex items-start space-x-3">
                   <FileText className="w-5 h-5 mt-0.5 text-black shrink-0" />
                   <div className="space-y-1">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{n.author}</span>
                     <p className="text-[11px] font-black text-black line-clamp-2 uppercase leading-snug">{n.title}</p>
                     <button 
                      onClick={() => setViewingNote({ id: i.toString(), title: n.title, author: n.author, subject: n.code, content: n.content, createdAt: '', tags: [] })}
                      className="bg-black text-white px-6 py-1 rounded-lg text-[9px] font-black uppercase shadow-sm mt-1"
                    >
                      View Note
                    </button>
                   </div>
                 </div>
              </div>
            )) : (
              <div className="bg-white/60 p-10 rounded-[30px] border-2 border-black border-dashed flex flex-col items-center text-center space-y-3">
                <Users className="w-8 h-8 text-slate-300" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase">No friends' notes available</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase px-4 leading-relaxed">Add friends in "Find Studymate" to see their shared study material!</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center pt-2">
             <button 
               onClick={() => setView(ViewMode.EXPLORE)}
               className="bg-black text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase shadow-md active:scale-95 tracking-widest flex items-center space-x-2"
             >
               <Plus className="w-4 h-4" />
               <span>Find More Friends</span>
             </button>
          </div>
       </div>
    </div>
  );
};

export default ShareNotes;

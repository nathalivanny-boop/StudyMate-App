
import React, { useState } from 'react';
import { Note } from '../types';
import { X, Save, FileText, Hash, Check } from 'lucide-react';

interface AddNoteProps {
  onAdd: (note: Note) => void;
}

const AddNote: React.FC<AddNoteProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !subject) return;

    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      subject,
      author: 'Alex Chen',
      createdAt: new Date().toISOString(),
      tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    };

    onAdd(newNote);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
          <Check className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Note Shared!</h2>
        <p className="text-slate-500 max-w-[240px]">Your contribution helps other students succeed. +50 Study Points earned!</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">New Note</h2>
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <FileText className="w-6 h-6" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
          <input 
            type="text" 
            placeholder="e.g. Thermodynamics Lecture 4" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
              required
            >
              <option value="">Select...</option>
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="History">History</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Economics">Economics</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tags</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="physics, heat" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 pl-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Notes Content</label>
          <textarea 
            rows={8}
            placeholder="Type or paste your study notes here..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2 active:scale-95 transition-all"
        >
          <Save className="w-5 h-5" />
          <span>Share with Community</span>
        </button>
      </form>
    </div>
  );
};

export default AddNote;

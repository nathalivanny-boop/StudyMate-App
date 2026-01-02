
import React, { useState } from 'react';
import { Note, QuizQuestion } from '../types';
import { summarizeNote, generateQuiz } from '../services/geminiService';
import { Sparkles, Brain, FileText, ChevronLeft, Send, CheckCircle2, RotateCcw, Loader2, X, ArrowLeft } from 'lucide-react';

interface StudyRoomProps {
  notes: Note[];
  onBack: () => void;
}

const StudyRoom: React.FC<StudyRoomProps> = ({ notes, onBack }) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeMode, setActiveMode] = useState<'SELECT' | 'MENU' | 'SUMMARY' | 'QUIZ'>('SELECT');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSummarize = async () => {
    if (!selectedNote) return;
    setLoading(true);
    setActiveMode('SUMMARY');
    const result = await summarizeNote(selectedNote.content);
    setSummary(result);
    setLoading(false);
  };

  const handleGenerateQuiz = async () => {
    if (!selectedNote) return;
    setLoading(true);
    setActiveMode('QUIZ');
    const result = await generateQuiz(selectedNote.content);
    setQuiz(result);
    setQuizScore(0);
    setCurrentQuizIndex(0);
    setQuizCompleted(false);
    setLoading(false);
  };

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    
    if (idx === quiz[currentQuizIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuizIndex < quiz.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1500);
  };

  if (activeMode === 'SELECT') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 pb-20">
        <div className="flex items-center space-x-4 mb-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <div className="bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border-2 border-black shadow-sm flex items-center space-x-2">
             <Sparkles size={16} className="text-black" />
             <span className="text-sm font-black text-black uppercase tracking-tight">AI Study Room</span>
          </div>
        </div>

        <div className="text-center px-4 mb-6">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Select your notes to begin AI processing</p>
        </div>

        <div className="space-y-3">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => { setSelectedNote(note); setActiveMode('MENU'); }}
              className="w-full bg-white/60 p-5 rounded-[30px] border-2 border-black shadow-sm flex items-center space-x-4 text-left hover:bg-white transition-all active:scale-95"
            >
              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-black text-black truncate uppercase text-xs">{note.title}</h4>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-tight">{note.subject}</p>
              </div>
            </button>
          ))}
          {notes.length === 0 && (
            <div className="text-center py-16 bg-white/30 border-2 border-dashed border-black rounded-[40px]">
              <p className="text-black font-black uppercase text-[10px] px-10">Add some notes in 'Share Notes' first to use AI tools!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeMode === 'MENU') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button 
          onClick={() => setActiveMode('SELECT')}
          className="flex items-center space-x-2 text-black font-black uppercase text-[10px] tracking-widest"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to selection</span>
        </button>

        <div className="bg-white/40 backdrop-blur-md p-8 rounded-[45px] shadow-lg border-2 border-black text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-black uppercase leading-tight">{selectedNote?.title}</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{selectedNote?.subject}</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={handleSummarize}
              className="bg-black text-white p-6 rounded-[35px] flex flex-col items-center space-y-3 shadow-xl active:scale-95 transition-all"
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-center">
                <span className="block font-black uppercase text-xs">Quick Summary</span>
                <span className="text-[8px] text-slate-300 uppercase font-bold">AI-generated key points</span>
              </div>
            </button>

            <button 
              onClick={handleGenerateQuiz}
              className="bg-white text-black p-6 rounded-[35px] border-2 border-black flex flex-col items-center space-y-3 shadow-xl active:scale-95 transition-all"
            >
              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div className="text-center">
                <span className="block font-black uppercase text-xs">Smart Quiz</span>
                <span className="text-[8px] text-slate-500 uppercase font-bold">Test your knowledge</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeMode === 'SUMMARY') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center">
          <button onClick={() => setActiveMode('MENU')} className="p-2 -ml-2 text-black">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h3 className="text-sm font-black text-black uppercase tracking-widest">AI Summary</h3>
          <div className="w-10"></div>
        </div>

        {loading ? (
          <div className="flex flex-col h-[400px] items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-black animate-spin" />
            <p className="text-black font-black uppercase text-[10px] animate-pulse">Gemini is analyzing...</p>
          </div>
        ) : (
          <div className="bg-white/60 p-8 rounded-[40px] shadow-lg border-2 border-black leading-relaxed whitespace-pre-line text-black font-bold text-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
               <Sparkles size={40} />
            </div>
            {summary}
            <div className="mt-8 pt-6 border-t border-black/10 flex justify-between">
              <button className="flex items-center space-x-2 text-black font-black text-[10px] uppercase">
                <Send className="w-4 h-4" />
                <span>Save Note</span>
              </button>
              <button onClick={handleSummarize} className="text-black">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeMode === 'QUIZ') {
    if (loading) {
      return (
        <div className="flex flex-col h-[400px] items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-black animate-spin" />
          <p className="text-black font-black uppercase text-[10px] animate-pulse">Designing your test...</p>
        </div>
      );
    }

    if (quizCompleted) {
      return (
        <div className="flex flex-col items-center justify-center space-y-8 text-center py-10 animate-in zoom-in">
          <div className="w-24 h-24 bg-black text-white rounded-[40px] flex items-center justify-center shadow-2xl border-2 border-black">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Nice Work!</h2>
            <p className="text-xs text-slate-500 font-black uppercase">You scored {quizScore} / {quiz.length}</p>
          </div>
          <div className="w-full bg-black/10 rounded-full h-3 max-w-[200px] overflow-hidden border-2 border-black/10">
            <div className="bg-black h-full transition-all duration-1000" style={{ width: `${(quizScore/quiz.length)*100}%` }}></div>
          </div>
          <button 
            onClick={() => setActiveMode('MENU')}
            className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-transform"
          >
            Back to Study Menu
          </button>
        </div>
      );
    }

    const currentQuestion = quiz[currentQuizIndex];
    if (!currentQuestion) return null;

    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center">
          <div className="text-[10px] font-black text-black uppercase tracking-widest">Question {currentQuizIndex + 1} / {quiz.length}</div>
          <button onClick={() => setActiveMode('MENU')} className="text-black"><X className="w-5 h-5" /></button>
        </div>

        <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden border border-black/5">
          <div className="bg-black h-full transition-all duration-500" style={{ width: `${((currentQuizIndex + 1) / quiz.length) * 100}%` }}></div>
        </div>

        <h3 className="text-lg font-black text-black leading-snug uppercase tracking-tight">{currentQuestion.question}</h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let style = "bg-white/60 border-2 border-black text-black hover:bg-white";
            if (selectedOption === idx) {
              style = idx === currentQuestion.correctAnswer 
                ? "bg-emerald-500 text-white border-black shadow-lg" 
                : "bg-rose-500 text-white border-black";
            } else if (selectedOption !== null && idx === currentQuestion.correctAnswer) {
              style = "bg-emerald-500 text-white border-black";
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-5 rounded-[28px] border-2 shadow-sm text-left font-black text-xs transition-all active:scale-95 flex items-center justify-between ${style}`}
              >
                <span>{option}</span>
                {selectedOption !== null && idx === currentQuestion.correctAnswer && <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />}
                {selectedOption === idx && idx !== currentQuestion.correctAnswer && <X className="w-5 h-5 text-white shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default StudyRoom;

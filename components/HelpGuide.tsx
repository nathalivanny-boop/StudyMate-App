
import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Calendar, BookOpen, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

interface HelpGuideProps {
  onBack: () => void;
}

const HelpGuide: React.FC<HelpGuideProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to StudyMate",
      desc: "Your all-in-one companion to ace your exams and connect with classmates. Let's show you around!",
      icon: <CheckCircle className="w-12 h-12 text-black" />,
      color: "bg-purple-100"
    },
    {
      title: "Find Your Crew",
      desc: "Use the 'Find Studymate' feature to search for classmates. Send a friend request and wait for them to accept to start chatting privately!",
      icon: <UserPlus className="w-12 h-12 text-black" />,
      color: "bg-blue-100"
    },
    {
      title: "Plan Your Success",
      desc: "The 'Study Planner' helps you organize your schedule. Add your classes and set daily focus tasks to stay productive.",
      icon: <Calendar className="w-12 h-12 text-black" />,
      color: "bg-emerald-100"
    },
    {
      title: "Knowledge Exchange",
      desc: "Upload your notes to 'Share Notes' for others to see, or browse your friends' libraries to find extra material.",
      icon: <BookOpen className="w-12 h-12 text-black" />,
      color: "bg-rose-100"
    }
  ];

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onBack();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="flex flex-col h-full px-8 pt-10 pb-10 animate-in fade-in duration-500">
      <button 
        onClick={onBack} 
        className="w-10 h-10 shrink-0 rounded-full bg-black flex items-center justify-center mb-12 shadow-lg active:scale-90 transition-transform"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        <div className={`w-24 h-24 ${step.color} border-2 border-black rounded-[30px] flex items-center justify-center shadow-lg animate-bounce`}>
           {step.icon}
        </div>

        <div className="space-y-4 max-w-xs">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{step.title}</h2>
          <p className="text-sm text-slate-600 font-bold leading-relaxed">
            {step.desc}
          </p>
        </div>

        <div className="flex space-x-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-black' : 'w-2 bg-black/20'}`} />
          ))}
        </div>
      </div>

      <div className="flex space-x-4 mt-8">
        {currentStep > 0 && (
          <button 
            onClick={prev}
            className="flex-1 border-2 border-black py-4 rounded-2xl flex items-center justify-center bg-white active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} className="text-black" />
          </button>
        )}
        <button 
          onClick={next}
          className="flex-[2] bg-black text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2 active:scale-95 transition-transform shadow-lg"
        >
          <span>{currentStep === steps.length - 1 ? "Get Started" : "Next Step"}</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default HelpGuide;

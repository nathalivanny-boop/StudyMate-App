
import React, { useState, useEffect } from 'react';
import { Plus, Check, Circle, ArrowLeft, X, Trash2 } from 'lucide-react';
import { Task, ScheduleItem } from '../types';

interface StudyPlannerProps {
  onBack: () => void;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ onBack }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('study-mate-tasks');
    const savedSched = localStorage.getItem('study-mate-schedule');
    
    // No default samples for new users
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSched) setSchedule(JSON.parse(savedSched));
  }, []);

  useEffect(() => {
    localStorage.setItem('study-mate-tasks', JSON.stringify(tasks));
    localStorage.setItem('study-mate-schedule', JSON.stringify(schedule));
  }, [tasks, schedule]);

  const [newTaskText, setNewTaskText] = useState('');
  const [newSchedTitle, setNewSchedTitle] = useState('');
  const [newSchedTime, setNewSchedTime] = useState('');
  const [showAddSched, setShowAddSched] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const addSchedule = () => {
    if (!newSchedTitle.trim()) return;
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      title: newSchedTitle,
      time: newSchedTime || 'TBD'
    };
    setSchedule([...schedule, newItem]);
    setNewSchedTitle('');
    setNewSchedTime('');
    setShowAddSched(false);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const deleteSchedule = (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 px-4 pt-2 pb-20 overflow-y-auto no-scrollbar">
       <div className="flex items-center space-x-4">
         <button 
           onClick={onBack} 
           className="w-10 h-10 shrink-0 rounded-full border-2 border-black flex items-center justify-center active:scale-90 transition-transform"
         >
           <ArrowLeft className="w-5 h-5 text-black" />
         </button>
         <div className="bg-white/40 backdrop-blur-md px-6 py-2 rounded-full border-2 border-black shadow-sm flex items-center space-x-3">
            <span className="text-sm font-black text-black uppercase tracking-tight">Study Planner</span>
            <Plus className="w-5 h-5 text-black border-2 border-black rounded-full" />
         </div>
       </div>

       {/* My Schedule */}
       <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-2 border-black space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
             <h3 className="font-black text-black uppercase text-sm tracking-widest">My Schedule</h3>
             <button onClick={() => setShowAddSched(!showAddSched)} className="w-7 h-7 border-2 border-black rounded-full flex items-center justify-center active:scale-90 bg-white">
                <Plus size={16} className="text-black" />
             </button>
          </div>
          
          {showAddSched && (
            <div className="bg-white p-4 rounded-2xl border-2 border-black space-y-3 animate-in slide-in-from-top-2">
              <input 
                placeholder="Class/Event title"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-lg px-3 py-2 text-xs focus:outline-none shadow-inner text-black font-bold"
                value={newSchedTitle}
                onChange={(e) => setNewSchedTitle(e.target.value)}
              />
              <input 
                placeholder="Time (e.g. 10am-12pm)"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-lg px-3 py-2 text-xs focus:outline-none shadow-inner text-black font-bold"
                value={newSchedTime}
                onChange={(e) => setNewSchedTime(e.target.value)}
              />
              <button 
                onClick={addSchedule}
                className="w-full bg-black text-white py-2 rounded-lg text-[10px] font-black uppercase"
              >
                Add Entry
              </button>
            </div>
          )}
          
          <div className="space-y-4">
             {schedule.length > 0 ? schedule.map(item => (
               <div key={item.id} className="flex items-start justify-between group">
                  <div className="flex items-start space-x-3">
                    <Circle className="w-4 h-4 mt-1 shrink-0 text-black" />
                    <div className="text-[11px] font-bold text-black leading-relaxed">
                       {item.day}<br/>
                       <span className="text-slate-600 font-black uppercase">{item.title}</span><br/>
                       <span className="text-slate-500 font-medium italic">({item.time})</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteSchedule(item.id)}
                    className="p-2 text-rose-500 active:scale-75 transition-transform"
                  >
                    <Trash2 size={16} />
                  </button>
               </div>
             )) : (
               <p className="text-[10px] font-bold text-slate-400 uppercase text-center italic py-4">No schedule planned. Tap '+' to add your classes!</p>
             )}
          </div>
       </div>

       {/* Daily Focus */}
       <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border-2 border-black space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
             <h3 className="font-black text-black uppercase text-sm tracking-widest">Daily Focus</h3>
             <div className="w-5 h-5 border-2 border-black rounded-full flex items-center justify-center p-0.5">
               <Check size={12} className="text-black" />
             </div>
          </div>

          <div className="flex space-x-2">
            <input 
              className="flex-1 bg-white border-2 border-black rounded-xl px-4 py-2 text-xs focus:outline-none shadow-inner font-bold text-black"
              placeholder="Add new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button 
              onClick={addTask}
              className="bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-transform shrink-0"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
             {tasks.length > 0 ? tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between group bg-white/30 p-2 rounded-xl">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center space-x-4 flex-1 text-left"
                  >
                    <div className={`w-5 h-5 rounded-lg border-2 border-black flex items-center justify-center transition-colors shrink-0 ${task.completed ? 'bg-black text-white' : 'bg-white'}`}>
                      {task.completed && <Check size={12} />}
                    </div>
                    <span className={`text-[11px] font-bold text-black ${task.completed ? 'line-through opacity-40' : ''}`}>{task.text}</span>
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    className="text-rose-500 p-2 active:scale-75 transition-transform"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
             )) : (
               <p className="text-[10px] font-bold text-slate-400 uppercase text-center italic py-4">Your to-do list is empty. Add a focus task above!</p>
             )}
          </div>
       </div>
    </div>
  );
};

export default StudyPlanner;

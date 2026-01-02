
import React, { useState, useEffect } from 'react';
import { 
  Bell,
  User,
  Home,
  Users,
  HelpCircle
} from 'lucide-react';
import { ViewMode, Note, UserProfile, Notification } from './types';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import StudyPlanner from './components/StudyPlanner';
import ShareNotes from './components/ShareNotes';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import ChatRoom from './components/ChatRoom';
import GroupChat from './components/GroupChat';
import ForgotPassword from './components/ForgotPassword';
import MyGroups from './components/MyGroups';
import HelpGuide from './components/HelpGuide';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.WELCOME);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({ nickname: 'New User', email: '', friends: [] });
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [activeGroupName, setActiveGroupName] = useState<string | null>(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('study-mate-notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    
    const savedProfile = localStorage.getItem('study-mate-profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setUserProfile({ ...parsed, friends: parsed.friends || [] });
    }
    
    const savedGroups = localStorage.getItem('study-mate-groups');
    if (savedGroups) setJoinedGroups(JSON.parse(savedGroups));

    const savedUsers = localStorage.getItem('study-mate-registered-users');
    if (savedUsers) setRegisteredUsers(JSON.parse(savedUsers));
  }, []);

  const saveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('study-mate-profile', JSON.stringify(updatedProfile));
  };

  const handleRegister = (nickname: string, email: string, password?: string) => {
    const newUser = { nickname, email, password, friends: [] };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('study-mate-registered-users', JSON.stringify(updatedUsers));
    saveProfile(newUser);
    setIsLoggedIn(true);
    setView(ViewMode.DASHBOARD);
  };

  const handleLoginAttempt = (email: string, password?: string): boolean => {
    const found = registeredUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    if (found) {
      saveProfile({ ...found, friends: found.friends || [] });
      setIsLoggedIn(true);
      setView(ViewMode.DASHBOARD);
      return true;
    }
    return false;
  };

  const handleRecoverySuccess = (email: string) => {
    const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      saveProfile({ ...found, friends: found.friends || [] });
      setIsLoggedIn(true);
      setView(ViewMode.DASHBOARD);
    }
  };

  const handleRequestFriend = (name: string) => {
    setTimeout(() => {
      const newNotif: Notification = {
        id: Date.now().toString(),
        sender: name,
        message: 'wants to be your friend',
        time: 'Just now',
        type: 'friend_request'
      };
      setNotifications(prev => [newNotif, ...prev]);
      setHasUnreadNotifications(true);
    }, 2000);
  };

  const handleAcceptFriend = (name: string, notificationId: string) => {
    const updatedFriends = [...(userProfile.friends || []), name];
    saveProfile({ ...userProfile, friends: updatedFriends });
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleDeclineFriend = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleBack = () => {
    if (view === ViewMode.LOGIN || view === ViewMode.REGISTER || view === ViewMode.FORGOT_PASSWORD) {
      setView(ViewMode.WELCOME);
    } else if (view === ViewMode.CHAT_ROOM) {
      setView(ViewMode.NOTIFICATIONS);
    } else if (view === ViewMode.GROUP_CHAT) {
      setView(ViewMode.MY_GROUPS);
    } else if (view === ViewMode.MY_GROUPS || view === ViewMode.HELP) {
      setView(ViewMode.DASHBOARD);
    } else {
      setView(ViewMode.DASHBOARD);
    }
  };

  const openChat = (userName: string) => {
    setActiveChatUser(userName);
    setView(ViewMode.CHAT_ROOM);
  };

  const renderContent = () => {
    switch (view) {
      case ViewMode.WELCOME: return <Welcome onLogin={() => setView(ViewMode.LOGIN)} onSignUp={() => setView(ViewMode.REGISTER)} />;
      case ViewMode.LOGIN: return <Login onBack={handleBack} onLogin={handleLoginAttempt} onForgot={() => setView(ViewMode.FORGOT_PASSWORD)} />;
      case ViewMode.REGISTER: return <Register onBack={handleBack} onComplete={handleRegister} />;
      case ViewMode.FORGOT_PASSWORD: return <ForgotPassword onBack={handleBack} registeredUsers={registeredUsers} onSuccess={handleRecoverySuccess} onOpenSupport={() => { window.location.href = "mailto:support@studymate.ai?subject=StudyMate%20Support%20Request"; }} />;
      case ViewMode.DASHBOARD: return <Dashboard setView={setView} isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />;
      case ViewMode.HELP: return <HelpGuide onBack={handleBack} />;
      case ViewMode.EXPLORE: return (
        <Explore 
          onBack={handleBack} 
          joinedGroups={joinedGroups} 
          friendsList={userProfile.friends || []}
          setJoinedGroups={(newGroups) => {
            if (typeof newGroups === 'function') {
              setJoinedGroups(prev => {
                const updated = (newGroups as any)(prev);
                localStorage.setItem('study-mate-groups', JSON.stringify(updated));
                return updated;
              });
            } else {
              setJoinedGroups(newGroups as string[]);
              localStorage.setItem('study-mate-groups', JSON.stringify(newGroups));
            }
          }}
          onChat={openChat}
          onGroupChat={(name) => { setActiveGroupName(name); setView(ViewMode.GROUP_CHAT); }}
          onRequestFriend={handleRequestFriend}
        />
      );
      case ViewMode.MY_GROUPS: return <MyGroups onBack={handleBack} joinedGroups={joinedGroups} onGroupChat={(name) => { setActiveGroupName(name); setView(ViewMode.GROUP_CHAT); }} onExplore={() => setView(ViewMode.EXPLORE)} />;
      case ViewMode.STUDY_PLANNER: return <StudyPlanner onBack={handleBack} />;
      case ViewMode.SHARE_NOTES: return <ShareNotes notes={notes} friendsList={userProfile.friends || []} setNotes={(newNotes) => { if (typeof newNotes === 'function') { setNotes(prev => { const updated = (newNotes as any)(prev); localStorage.setItem('study-mate-notes', JSON.stringify(updated)); return updated; }); } else { setNotes(newNotes as Note[]); localStorage.setItem('study-mate-notes', JSON.stringify(newNotes)); } }} onBack={handleBack} setView={setView} />;
      case ViewMode.PROFILE: return <Profile onBack={handleBack} onLogout={() => {setIsLoggedIn(false); setView(ViewMode.WELCOME);}} profile={userProfile} setProfile={(p) => saveProfile(p)} />;
      case ViewMode.NOTIFICATIONS: return <Notifications onBack={handleBack} notifications={notifications} onOpenChat={openChat} onAccept={handleAcceptFriend} onDecline={handleDeclineFriend} />;
      case ViewMode.CHAT_ROOM: return <ChatRoom onBack={handleBack} friendName={activeChatUser || 'Friend'} />;
      case ViewMode.GROUP_CHAT: return <GroupChat onBack={handleBack} groupName={activeGroupName || 'Study Group'} onPrivateChat={openChat} />;
      default: return <Welcome onLogin={() => setView(ViewMode.LOGIN)} onSignUp={() => setView(ViewMode.REGISTER)} />;
    }
  };

  const showNav = isLoggedIn && ![ViewMode.WELCOME, ViewMode.LOGIN, ViewMode.REGISTER, ViewMode.CHAT_ROOM, ViewMode.GROUP_CHAT, ViewMode.FORGOT_PASSWORD, ViewMode.HELP].includes(view);
  const showHelpButton = isLoggedIn && view !== ViewMode.HELP;

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden select-none bg-[#f0d9eb] w-full">
      {showNav && (
        <header className="px-6 py-6 flex justify-between items-center bg-transparent shrink-0">
          <div className="bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full border-2 border-black shadow-sm">
            <span className="text-sm font-extrabold text-black tracking-tight uppercase">{isAnonymous ? 'Anonymous' : 'Study Mate'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => { setHasUnreadNotifications(false); setView(ViewMode.NOTIFICATIONS); }} className="text-black relative">
              <Bell className="w-6 h-6" />
              {(hasUnreadNotifications || notifications.length > 0) && <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>}
            </button>
            <button onClick={() => setView(ViewMode.PROFILE)} className="text-black"><User className="w-6 h-6" /></button>
          </div>
        </header>
      )}
      
      <main className={`flex-1 overflow-y-auto no-scrollbar ${!showNav ? 'h-full' : 'pb-24 px-6'}`}>{renderContent()}</main>

      {showHelpButton && (
        <button 
          onClick={() => setView(ViewMode.HELP)}
          className="fixed bottom-24 right-6 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 active:scale-90 transition-transform z-40"
          title="App Guide"
        >
          <HelpCircle size={24} />
        </button>
      )}

      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-transparent flex justify-center items-center pb-4 safe-area-bottom pointer-events-none">
          <div className="bg-white/80 backdrop-blur-xl border-2 border-black rounded-[30px] w-[90%] max-w-md h-16 flex justify-around items-center px-8 shadow-lg pointer-events-auto">
            <button onClick={() => setView(ViewMode.DASHBOARD)} className={`flex flex-col items-center ${view === ViewMode.DASHBOARD ? 'text-black' : 'text-slate-400'}`}>
              <Home className="w-6 h-6" /><span className="text-[10px] font-black mt-0.5 uppercase tracking-widest">HOME</span>
            </button>
            <button onClick={() => setView(ViewMode.MY_GROUPS)} className={`flex flex-col items-center ${view === ViewMode.MY_GROUPS ? 'text-black' : 'text-slate-400'}`}>
              <Users className="w-6 h-6" /><span className="text-[10px] font-black mt-0.5 uppercase tracking-widest">GROUP</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;

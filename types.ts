
export interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  subject: string;
  createdAt: string;
  tags: string[];
}

export enum ViewMode {
  WELCOME = 'WELCOME',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  EXPLORE = 'EXPLORE',
  MY_GROUPS = 'MY_GROUPS',
  STUDY_PLANNER = 'STUDY_PLANNER',
  SHARE_NOTES = 'SHARE_NOTES',
  PROFILE = 'PROFILE',
  NOTIFICATIONS = 'NOTIFICATIONS',
  CHAT_ROOM = 'CHAT_ROOM',
  GROUP_CHAT = 'GROUP_CHAT',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  HELP = 'HELP'
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface ScheduleItem {
  id: string;
  day: string;
  title: string;
  time: string;
}

export interface UserProfile {
  nickname: string;
  email: string;
  password?: string;
  friends?: string[];
}

export interface Notification {
  id: string;
  sender: string;
  message: string;
  time: string;
  read?: boolean;
  type?: 'message' | 'friend_request';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'other';
  senderName?: string;
  timestamp: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

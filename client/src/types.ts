export type Sender = 'bot' | 'user';

export interface Message {
  id: string;
  content: string;
  sender: Sender;
  timestamp: string;
} 
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface BusinessInfo {
  name: string;
  description: string;
  hours: {
    [key: string]: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  policies: {
    [key: string]: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
} 
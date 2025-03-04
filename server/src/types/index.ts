export interface MenuItem {
  name: string;
  description: string;
  price: number;
  options?: string[];
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Contact {
  phone: string;
  email: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface Menu {
  categories: MenuCategory[];
}

export interface Policies {
  wifi: string;
  seating: string;
  laptop: string;
  pets: string;
  parking: string;
  reservations: string;
  [key: string]: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SpecialFeatures {
  roasting: string;
  events: string;
  sustainability: string;
  [key: string]: string;
}

export interface BusinessInfo {
  name: string;
  description: string;
  hours: {
    [key: string]: string;
  };
  location: Location;
  contact: Contact;
  menu: Menu;
  policies: Policies;
  amenities: string[];
  faqs: FAQ[];
  specialFeatures: SpecialFeatures;
}

// Chat related types
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
export interface Freelancer {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  hourlyRate: number;
  rating: number;
  availability: 'immediate' | 'within_week' | 'within_month';
  platform: 'fiverr';
  location: string;
  description: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface SearchFilters {
  minRate: number;
  maxRate: number;
  minRating: number;
  immediateAvailability: boolean;
  location: string;
}

export interface SearchIntent {
  skills: string[];
  location: string;
  maxBudget?: number;
  needsImmediate: boolean;
  limit?: number;
  originalQuery: string;
}

export interface Message {
  type: 'user' | 'assistant' | 'attachments' | 'stats';
  content: string;
  attachments?: Attachment[];
  freelancers?: Freelancer[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
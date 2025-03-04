import { create } from 'zustand';
import { Message } from '../types';

interface ChatMetrics {
  messageCount: number;
  responseTimes: number[];
  averageResponseTime: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  metrics: ChatMetrics;
  addMessage: (message: Message) => void;
  updateMessageContent: (id: string, content: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateResponseTime: (responseTime: number) => void;
  updateTokenUsage: (promptTokens: number, completionTokens: number) => void;
  clearMessages: () => void;
}

const useStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    },
  ],
  isLoading: false,
  error: null,
  metrics: {
    messageCount: 1,
    responseTimes: [],
    averageResponseTime: 0,
    totalTokens: 0,
    promptTokens: 0,
    completionTokens: 0,
  },

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      error: null,
      metrics: {
        ...state.metrics,
        messageCount: state.metrics.messageCount + 1,
      },
    })),

  updateMessageContent: (id: string, content: string) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg
      ),
    })),

  setLoading: (isLoading) => set(() => ({ isLoading })),

  setError: (error) => set(() => ({ error, isLoading: false })),

  updateResponseTime: (responseTime) =>
    set((state) => {
      const newResponseTimes = [...state.metrics.responseTimes, responseTime];
      const averageResponseTime =
        newResponseTimes.reduce((a, b) => a + b, 0) / newResponseTimes.length;

      return {
        ...state,
        metrics: {
          ...state.metrics,
          responseTimes: newResponseTimes,
          averageResponseTime,
        },
      };
    }),

  updateTokenUsage: (promptTokens, completionTokens) =>
    set((state) => {
      const newPromptTokens = state.metrics.promptTokens + promptTokens;
      const newCompletionTokens = state.metrics.completionTokens + completionTokens;
      return {
        ...state,
        metrics: {
          ...state.metrics,
          promptTokens: newPromptTokens,
          completionTokens: newCompletionTokens,
          totalTokens: newPromptTokens + newCompletionTokens,
        },
      };
    }),

  clearMessages: () =>
    set(() => ({
      messages: [
        {
          id: '1',
          content: 'Hello! How can I help you today?',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        },
      ],
      error: null,
      metrics: {
        messageCount: 1,
        responseTimes: [],
        averageResponseTime: 0,
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
      },
    })),
}));

export default useStore; 
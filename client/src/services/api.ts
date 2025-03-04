import axios from 'axios';
import { Message } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessage = async (message: string): Promise<Message> => {
  try {
    const response = await api.post('/chat/message', { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getConversationHistory = async (): Promise<Message[]> => {
  try {
    const response = await api.get('/chat/history');
    return response.data.history;
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  }
};

export default api; 
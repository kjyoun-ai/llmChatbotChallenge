import { createChatCompletion, LLMResponse } from './llmService';
import { getWeather } from './weatherService';
import { getLocation } from './locationService';

export async function handleMessage(message: string): Promise<LLMResponse> {
  if (!message) {
    throw new Error('Message cannot be empty');
  }

  if (message.length > 1000) {
    throw new Error('Message is too long');
  }

  try {
    const response = await createChatCompletion(message, false);
    
    if (typeof response === 'object' && 'content' in response) {
      return response;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error processing message');
  }
} 
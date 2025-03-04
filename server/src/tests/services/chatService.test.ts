import { describe, it, expect, jest } from '@jest/globals';
import { createChatCompletion } from '../../services/llmService';
import { handleMessage } from '../../services/chatService';

// Mock the LLM service
jest.mock('../../services/llmService', () => ({
  createChatCompletion: jest.fn().mockImplementation((...args: any[]) => {
    const [message] = args;
    if (message === 'Test message') {
      throw new Error('LLM service error');
    }
    return {
      content: 'We are open Monday to Friday from 7 AM to 7 PM.',
      metrics: {
        responseTime: 1000,
        tokenUsage: {
          prompt: 50,
          completion: 30
        }
      }
    };
  })
}));

describe('Chat Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('handleMessage', () => {
    it('should process a message and return a response', async () => {
      const mockMessage = 'What are your hours?';
      const mockResponse = {
        content: 'We are open Monday to Friday from 7 AM to 7 PM.',
        metrics: {
          responseTime: 1000,
          tokenUsage: {
            prompt: 50,
            completion: 30
          }
        }
      };

      const result = await handleMessage(mockMessage);

      expect(result).toEqual(mockResponse);
      expect(createChatCompletion).toHaveBeenCalledWith(mockMessage, false);
    });

    it('should handle errors gracefully', async () => {
      const mockMessage = 'Test message';

      await expect(handleMessage(mockMessage)).rejects.toThrow('LLM service error');
    });

    it('should handle empty messages', async () => {
      const mockMessage = '';

      await expect(handleMessage(mockMessage)).rejects.toThrow('Message cannot be empty');
    });

    it('should handle long messages', async () => {
      const mockMessage = 'a'.repeat(1001); // Message longer than 1000 characters

      await expect(handleMessage(mockMessage)).rejects.toThrow('Message is too long');
    });
  });
}); 
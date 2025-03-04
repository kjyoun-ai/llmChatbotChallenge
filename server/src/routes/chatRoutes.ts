import express, { Request, Response } from 'express';
import { apiKeyAuth } from '../middleware/auth';
import { logChat, logError } from '../services/loggerService';
import { LLMService } from '../services/llmService';

const router = express.Router();
const llmService = LLMService.getInstance();

// Apply API key authentication to all chat routes
router.use(apiKeyAuth);

// Send message to LLM and get response
router.post('/message', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid message format');
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const llmResponse = await llmService.processMessage(message, res);
    const responseTime = (Date.now() - startTime) / 1000; // Convert to seconds

    // Log the successful interaction
    logChat({
      message,
      response: llmResponse.content,
      responseTime,
      timestamp: new Date()
    });
    
    // Send the final metrics
    res.write(`data: ${JSON.stringify({
      done: true,
      metrics: {
        responseTime,
        tokenUsage: llmResponse.metrics.tokenUsage
      }
    })}\n\n`);

    res.end();
  } catch (error) {
    const errorTime = (Date.now() - startTime) / 1000;
    
    logError({
      error: error as Error,
      context: {
        route: '/message',
        requestBody: req.body
      },
      timestamp: new Date()
    });

    // Send error as SSE
    res.write(`data: ${JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to process your message',
      metrics: {
        responseTime: errorTime
      }
    })}\n\n`);
    res.end();
  }
});

// Get conversation history
router.get('/history', (req: Request, res: Response) => {
  try {
    // This will be implemented later with conversation storage
    res.status(200).json({
      history: [],
      metrics: {
        totalMessages: 0,
        averageResponseTime: 0
      }
    });
  } catch (error) {
    logError({
      error: error as Error,
      context: {
        route: '/history'
      },
      timestamp: new Date()
    });

    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch conversation history'
    });
  }
});

export default router; 
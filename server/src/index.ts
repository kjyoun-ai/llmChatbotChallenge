import * as dotenv from 'dotenv';
import path from 'path';

// Log the current directory and .env path
console.log('Current directory:', __dirname);
const envPath = path.resolve(__dirname, '../.env');
console.log('.env path:', envPath);

// Load environment variables from .env file
const result = dotenv.config({ path: envPath });
console.log('dotenv result:', result);

// Log environment variables for debugging
console.log('Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('API_KEY:', process.env.API_KEY);
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not Set');

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { chatLimiter } from './middleware/rateLimiter';
import chatRoutes from './routes/chatRoutes';
import logger, { logError } from './services/loggerService';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Apply rate limiting to chat routes
app.use('/api/chat', chatLimiter);

// API routes
app.use('/api/chat', chatRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logError({
    error: err,
    context: {
      path: req.path,
      method: req.method,
      body: req.body
    },
    timestamp: new Date()
  });

  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message
  });
});

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!require('fs').existsSync(logsDir)) {
  require('fs').mkdirSync(logsDir);
}

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

export default app; 
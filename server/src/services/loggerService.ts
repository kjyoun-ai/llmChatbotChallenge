import winston from 'winston';
import path from 'path';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/chat.log')
    })
  ]
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export interface ChatLog {
  userId?: string;
  message: string;
  response: string;
  responseTime: number;
  timestamp: Date;
}

export interface ErrorLog {
  error: Error;
  context?: any;
  timestamp: Date;
}

export const logChat = (chatLog: ChatLog) => {
  logger.info('Chat Interaction', chatLog);
};

export const logError = (errorLog: ErrorLog) => {
  logger.error('Error', errorLog);
};

export default logger; 
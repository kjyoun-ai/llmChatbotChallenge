import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // LLM configuration (to be determined)
  llm: {
    provider: process.env.LLM_PROVIDER || 'openai',
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  
  // Public API configuration (to be determined)
  publicApis: {
    weather: {
      apiKey: process.env.WEATHER_API_KEY || '',
      baseUrl: process.env.WEATHER_API_URL || '',
    },
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export default config; 
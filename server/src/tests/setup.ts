// Mock environment variables
process.env.PORT = '3001';
process.env.NODE_ENV = 'test';
process.env.API_KEY = 'test_api_key';
process.env.OPENAI_API_KEY = 'test_openai_key';
process.env.OPENWEATHERMAP_API_KEY = 'test_weather_key';
process.env.GOOGLE_MAPS_API_KEY = 'test_maps_key';

// Mock axios
jest.mock('axios');

// Mock OpenAI
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }))
})); 
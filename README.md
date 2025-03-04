# LLM Chatbot for Boon Boona Coffee

A modern chatbot application that uses OpenAI's GPT model to answer questions about Boon Boona Coffee, featuring real-time weather updates and location information.

## Live Business Information
- **Business Name**: Boon Boona Coffee
- **Website**: [https://www.boonboonacoffee.com/](https://www.boonboonacoffee.com/)
- **Location**: Seattle, WA

## Features
- 💬 Real-time chat interface with streaming responses
- 🎨 Modern Material UI design with custom theme
- 🌡️ Integration with OpenWeatherMap API for local weather information
- 📍 Google Maps integration for location services
- 📊 Real-time metrics tracking (response time, token usage)
- 🔄 State management with Zustand
- 🚀 Server-side streaming for instant responses
- 🛡️ Secure API key handling through backend proxy

## Tech Stack
- **Frontend**: React 19 with TypeScript
- **UI Framework**: Material UI v6
- **State Management**: Zustand
- **Backend**: Node.js with Express
- **LLM Provider**: OpenAI GPT
- **APIs**: OpenWeatherMap, Google Maps
- **Logging**: Winston

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- API keys for:
  - OpenAI
  - OpenWeatherMap
  - Google Maps

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd llmchatbotChallenge
\`\`\`

2. Install dependencies for both frontend and backend:
\`\`\`bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
\`\`\`

3. Set up environment variables:

Create a \`.env\` file in the server directory with the following variables:
\`\`\`
PORT=3001
NODE_ENV=development
API_KEY=your_api_key
OPENAI_API_KEY=your_openai_api_key
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
\`\`\`

Create a \`.env\` file in the client directory:
\`\`\`
REACT_APP_BACKEND_URL=http://localhost:3001
REACT_APP_API_KEY=your_api_key
\`\`\`

### Running the Application

1. Start the backend server:
\`\`\`bash
cd server
npm run dev
\`\`\`

2. Start the frontend application:
\`\`\`bash
cd client
npm start
\`\`\`

The application will be available at \`http://localhost:3000\`

## Testing

### Backend Tests
Run the backend tests:
\`\`\`bash
cd server
npm test
\`\`\`

### Frontend Tests
Run the frontend tests:
\`\`\`bash
cd client
npm test
\`\`\`

## Architecture

### Frontend Architecture
- **Components**: Modular React components with Material UI
- **State Management**: Zustand store for chat messages and metrics
- **API Integration**: Axios for backend communication
- **Streaming**: Server-Sent Events (SSE) for real-time updates

### Backend Architecture
- **Express Server**: RESTful API endpoints
- **Middleware**: Authentication, rate limiting, error handling
- **LLM Integration**: OpenAI API with streaming support
- **External APIs**: Weather and location services
- **Logging**: Winston for error and access logging

## API Endpoints

### Chat Endpoints
- `POST /api/chat/message`: Send a message to the chatbot
- `GET /api/metrics`: Get chat metrics
- `GET /api/health`: Health check endpoint

### External API Integrations
- `GET /api/weather`: Get local weather information
- `GET /api/location`: Get business location details

## Development Process

This project was developed with the assistance of AI tools:
- **Cursor**: Used for code completion and refactoring
- **ChatGPT**: Assisted with architectural decisions and debugging
- **GitHub Copilot**: Helped with code implementation

## Error Handling
- Frontend error boundaries for component-level errors
- Backend error middleware for API errors
- Graceful degradation for API failures
- User-friendly error messages in chat interface

## Metrics & Logging
- Response time tracking
- Token usage monitoring
- Error rate tracking
- User interaction logging
- API call logging

## Future Improvements
- Add user authentication
- Implement conversation history persistence
- Add more public API integrations
- Enhance metrics visualization
- Add support for more LLM providers

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details. 
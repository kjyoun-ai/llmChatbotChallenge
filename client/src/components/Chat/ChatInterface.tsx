import React, { useState } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message } from '../../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message to the list
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // TODO: Send message to backend and get response
    // This will be implemented in Phase 5
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'This is a placeholder response. The chatbot will be integrated in Phase 5.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          height: '80vh', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          marginTop: 4,
        }}
      >
        <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">Business Chatbot</Typography>
        </Box>
        
        <MessageList messages={messages} />
        
        <MessageInput onSendMessage={handleSendMessage} />
      </Paper>
    </Container>
  );
};

export default ChatInterface; 
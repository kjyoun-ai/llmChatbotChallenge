import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Paper } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import MetricsDisplay from './MetricsDisplay';
import useStore from '../../store/chatStore';
import { Message, Sender } from '../../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const API_KEY = process.env.REACT_APP_API_KEY || 'your_api_key_here';

const Chat: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    addMessage, 
    setLoading, 
    setError, 
    updateResponseTime,
    updateTokenUsage,
    updateMessageContent 
  } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user' as Sender,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the bot');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('No response stream available');
      }

      // Create a bot message that we'll update as we receive chunks
      const botMessage: Message = {
        id: Date.now().toString(),
        content: '',
        sender: 'bot' as Sender,
        timestamp: new Date().toISOString(),
      };
      addMessage(botMessage);

      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(5));
              console.log('Received SSE data:', data);

              if (data.error) {
                setError(data.error);
                break;
              }

              if (data.content) {
                // Update the bot's message content
                fullContent += data.content;
                console.log('Updated content:', fullContent);
                updateMessageContent(botMessage.id, fullContent);
              }

              if (data.done) {
                // Make sure we have the final content
                if (!fullContent && data.content) {
                  fullContent = data.content;
                  updateMessageContent(botMessage.id, fullContent);
                }
                
                // Update metrics when stream is complete
                if (data.metrics?.responseTime) {
                  updateResponseTime(data.metrics.responseTime);
                }
                if (data.metrics?.tokenUsage) {
                  const { prompt, completion } = data.metrics.tokenUsage;
                  console.log('Updating token usage:', { prompt, completion });
                  if (typeof prompt === 'number' && typeof completion === 'number') {
                    updateTokenUsage(prompt, completion);
                  }
                }
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e, 'Line:', line);
              setError('Error processing bot response');
            }
          }
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        height: '100vh',
        py: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MetricsDisplay />
      <Paper
        elevation={3}
        sx={{
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}15`,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            backgroundColor: 'background.paper',
            backgroundImage: (theme) =>
              `linear-gradient(${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'action.hover',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'action.selected',
            },
          }}
        >
          <MessageList messages={messages} />
          <div ref={messagesEndRef} />
        </Box>
        {isLoading && <TypingIndicator />}
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </Paper>
    </Container>
  );
};

export default Chat; 
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Message } from '../../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        mb: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          backgroundColor: isBot ? 'white' : 'primary.light',
          color: isBot ? 'text.primary' : 'white',
          maxWidth: '70%',
          borderRadius: isBot ? '4px 16px 16px 4px' : '16px 4px 4px 16px',
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Typography variant="caption" color={isBot ? 'text.secondary' : 'inherit'} sx={{ opacity: 0.7 }}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Paper>
    </Box>
  );
};

export default MessageItem; 
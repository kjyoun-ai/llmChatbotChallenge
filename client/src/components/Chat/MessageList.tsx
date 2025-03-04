import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Message as MessageType } from '../../types';
import { SmartToy, Person } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const theme = useTheme();
  const isBot = message.sender === 'bot';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        mb: 2,
        flexDirection: isBot ? 'row' : 'row-reverse',
      }}
    >
      <Avatar
        sx={{
          bgcolor: isBot ? 'primary.main' : 'secondary.main',
          width: 40,
          height: 40,
        }}
      >
        {isBot ? <SmartToy /> : <Person />}
      </Avatar>
      <Box
        sx={{
          maxWidth: '70%',
          minWidth: '20%',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 10,
            [isBot ? 'left' : 'right']: -8,
            borderStyle: 'solid',
            borderWidth: '8px 8px 8px 0',
            borderColor: `transparent ${isBot ? theme.palette.grey[100] : theme.palette.primary.main} transparent transparent`,
            transform: isBot ? 'none' : 'rotate(180deg)',
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: isBot ? theme.palette.grey[100] : theme.palette.primary.main,
            color: isBot ? 'text.primary' : 'primary.contrastText',
            borderRadius: 2,
            px: 2,
            py: 1.5,
            wordBreak: 'break-word',
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            mt: 0.5,
            textAlign: isBot ? 'left' : 'right',
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

interface MessageListProps {
  messages: MessageType[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 2,
      }}
    >
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </Box>
  );
};

export default MessageList; 
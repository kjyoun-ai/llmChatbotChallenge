import React from 'react';
import { Box, keyframes } from '@mui/material';

const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
`;

const TypingIndicator: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        p: 2,
        maxWidth: 100,
        borderRadius: 2,
        backgroundColor: (theme) => theme.palette.grey[100],
        m: 2,
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            backgroundColor: (theme) => theme.palette.grey[500],
            borderRadius: '50%',
            animation: `${bounce} 1s infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </Box>
  );
};

export default TypingIndicator; 
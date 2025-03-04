import React from 'react';
import { Box, Paper, Typography, Divider, Tooltip } from '@mui/material';
import useStore from '../../store/chatStore';
import { QueryStats, Timer, Token } from '@mui/icons-material';

const MetricsDisplay: React.FC = () => {
  const { metrics } = useStore();
  const { 
    messageCount, 
    averageResponseTime,
    totalTokens,
    promptTokens,
    completionTokens
  } = metrics;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        padding: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        minWidth: 200,
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <QueryStats fontSize="small" />
        Chat Metrics
      </Typography>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Messages:
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {messageCount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timer fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Avg. Response:
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {averageResponseTime.toFixed(2)}s
          </Typography>
        </Box>

        <Divider sx={{ my: 0.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Token fontSize="small" color="action" />
          <Tooltip title="Total tokens used in the conversation">
            <Typography variant="body2" color="text.secondary">
              Total Tokens:
            </Typography>
          </Tooltip>
          <Typography variant="body1" fontWeight="medium">
            {totalTokens}
          </Typography>
        </Box>

        <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Prompt:
            </Typography>
            <Typography variant="body2">
              {promptTokens}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Completion:
            </Typography>
            <Typography variant="body2">
              {completionTokens}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MetricsDisplay; 
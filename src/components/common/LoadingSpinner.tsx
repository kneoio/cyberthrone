import React from 'react';
import { Box, CircularProgress, Typography, Stack } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '200px', 
        width: '100%' 
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={sizeMap[size]} />
        <Typography variant="body2" color="text.secondary">{message}</Typography>
      </Stack>
    </Box>
  );
};

export default LoadingSpinner;

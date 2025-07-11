import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Box, Typography, Stack } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '400px',
            p: 3
          }}
        >
          <Stack spacing={3} alignItems="center">
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />
            <Typography variant="h4" color="error">Something went wrong</Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button variant="contained" onClick={this.handleReset}>
              Try Again
            </Button>
          </Stack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

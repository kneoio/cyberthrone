import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, People, Person } from '@mui/icons-material';
import { useKeycloak } from '../../hooks/useKeycloak';
import LoginButton from '../auth/LoginButton';
import LogoutButton from '../auth/LogoutButton';
import { ROUTES, APP_NAME } from '../../utils/constants';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username } = useKeycloak();

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ fontWeight: 'bold', cursor: 'pointer', flexGrow: 0 }}
          onClick={() => navigate(ROUTES.HOME)}
        >
          🏛️ {APP_NAME}
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            color="inherit"
            onClick={() => navigate(ROUTES.HOME)}
            startIcon={<Home />}
          >
            Home
          </Button>
          
          <Button
            color="inherit"
            onClick={() => navigate(ROUTES.DICTATORS)}
            startIcon={<People />}
          >
            Dictators
          </Button>
          
          {isAuthenticated && (
            <Button
              color="inherit"
              onClick={() => navigate(ROUTES.PROFILE)}
              startIcon={<Person />}
            >
              My Profile
            </Button>
          )}
          
          {isAuthenticated ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1">Hello, {username}!</Typography>
              <LogoutButton />
            </Stack>
          ) : (
            <LoginButton />
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

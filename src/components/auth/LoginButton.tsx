import React from 'react';
import { Button } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useKeycloak } from '../../hooks/useKeycloak';

const LoginButton: React.FC = () => {
  const { login } = useKeycloak();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={login}
      startIcon={<LoginIcon />}
    >
      Login
    </Button>
  );
};

export default LoginButton;

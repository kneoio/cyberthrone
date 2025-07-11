import React from 'react';
import { Button } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useKeycloak } from '../../hooks/useKeycloak';

const LogoutButton: React.FC = () => {
  const { logout } = useKeycloak();

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={logout}
      startIcon={<LogoutIcon />}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;

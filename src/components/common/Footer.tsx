import React from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';
import { APP_NAME } from '../../utils/constants';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ textAlign: 'center', py: 3, px: 2, mt: 'auto' }}>
      <Stack spacing={1}>
        <Divider />
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} {APP_NAME}. Built with React, TypeScript, and Material UI.
        </Typography>
        <Typography variant="caption" color="text.secondary">
          🏛️ Manage your dictator profiles and achievements with style!
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;

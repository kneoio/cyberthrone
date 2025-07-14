import React from 'react';
import { Box, Divider, Stack } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ textAlign: 'center', py: 3, px: 2, mt: 'auto' }}>
      <Stack spacing={1}>
        <Divider />

      </Stack>
    </Box>
  );
};

export default Footer;

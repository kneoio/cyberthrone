import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Button,
  Stack
} from '@mui/material';
import { 
  People,
  Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '../../hooks/useKeycloak';
import { ROUTES } from '../../utils/constants';

const SIDEBAR_WIDTH = 240;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useKeycloak();

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          top: '64px', // Below header
          height: 'calc(100vh - 64px)',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          📁 Dictators
        </Typography>
        
        <Stack spacing={1}>
          <Button
            variant="outlined"
            startIcon={<People />}
            fullWidth
            onClick={() => handleNavigation(ROUTES.DICTATORS)}
            sx={{ justifyContent: 'flex-start' }}
          >
            Browse All
          </Button>
          

        </Stack>
        
        <Divider sx={{ my: 2 }} />
        
        <List dense>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation(ROUTES.DICTATORS)}>
              <ListItemIcon>
                <People fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="All Dictators" 
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
          
          {isAuthenticated && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation(ROUTES.PROFILE)}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="My Profile" 
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

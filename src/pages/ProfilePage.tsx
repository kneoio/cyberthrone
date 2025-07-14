import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Dictator } from '../types/dictator';
import { useKeycloak } from '../hooks/useKeycloak';
import { ROUTES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username } = useKeycloak();
  const [dictator, setDictator] = useState<Dictator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !username) {
      navigate(ROUTES.HOME);
      return;
    }

    const createProfileFromJWT = () => {
      setLoading(true);
      
      const mockDictator: Dictator = {
        id: 1,
        username: username,
        name: username,
        country: 'Unknown',
        yearsInPower: `${new Date().getFullYear()}-Present`,
        description: 'Profile created from JWT token',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        achievements: []
      };
      
      setDictator(mockDictator);
      setLoading(false);
    };

    createProfileFromJWT();
  }, [isAuthenticated, username, navigate]);



  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  if (!dictator) {
    return (
      <Container maxWidth="md" sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h6">
          No profile found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            My Profile
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" component="h2" gutterBottom>
                  {dictator.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  @{dictator.username}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default ProfilePage;

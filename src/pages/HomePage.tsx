import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { People, Add, EmojiEvents } from '@mui/icons-material';
import { Dictator } from '../types/dictator';
import { publicApi } from '../services/api';
import { useKeycloak } from '../hooks/useKeycloak';
import { ROUTES, APP_NAME, APP_DESCRIPTION } from '../utils/constants';
import DictatorCard from '../components/dictators/DictatorCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LoginButton from '../components/auth/LoginButton';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useKeycloak();
  const [featuredDictators, setFeaturedDictators] = useState<Dictator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedDictators = async () => {
      try {
        const dictators = await publicApi.getDictators();
        // Show first 3 dictators as featured
        setFeaturedDictators(dictators.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured dictators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDictators();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={6}>
        {/* Hero Section */}
        <Box textAlign="center" py={8}>
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            🏛️ {APP_NAME}
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6, mb: 4 }}
          >
            {APP_DESCRIPTION}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<People />}
              onClick={() => navigate(ROUTES.DICTATORS)}
            >
              Browse Dictators
            </Button>
            {isAuthenticated ? (
              <Button
                variant="outlined"
                size="large"
                startIcon={<Add />}
                onClick={() => navigate(ROUTES.CREATE_PROFILE)}
              >
                Create Profile
              </Button>
            ) : (
              <LoginButton />
            )}
          </Stack>
        </Box>

        <Divider />

        {/* Featured Dictators Section */}
        <Box textAlign="center">
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Featured Dictators
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Discover some of the most notable dictators and their achievements
          </Typography>

          {loading ? (
            <LoadingSpinner message="Loading featured dictators..." />
          ) : (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {featuredDictators.map((dictator) => (
                  <Grid item xs={12} sm={6} md={4} key={dictator.id}>
                    <DictatorCard dictator={dictator} />
                  </Grid>
                ))}
              </Grid>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(ROUTES.DICTATORS)}
              >
                View All Dictators
              </Button>
            </>
          )}
        </Box>

        <Divider />

        {/* Features Section */}
        <Box textAlign="center">
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            What You Can Do
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: 200, '&:hover': { boxShadow: 4 } }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <People sx={{ fontSize: 48, color: '#18a058', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Browse Dictators
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Explore profiles and learn about different dictators from history
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: 200, '&:hover': { boxShadow: 4 } }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Add sx={{ fontSize: 48, color: '#2080f0', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Create Profile
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Build your own dictator profile with custom information
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: 200, '&:hover': { boxShadow: 4 } }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <EmojiEvents sx={{ fontSize: 48, color: '#f0a020', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Manage Achievements
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add and manage achievements for your dictator profile
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
};

export default HomePage;

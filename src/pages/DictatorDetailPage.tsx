import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  Divider,
  Stack,
  Container
} from '@mui/material';
import { ArrowBack, Edit, CalendarToday, Person, LocationOn, EmojiEvents } from '@mui/icons-material';
import { Dictator } from '../types/dictator';
import { publicApi } from '../services/api';
import { useKeycloak } from '../hooks/useKeycloak';
import { formatDate, formatYearsInPower } from '../utils/helpers';
import AchievementList from '../components/achievements/AchievementList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DictatorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, username } = useKeycloak();
  const [dictator, setDictator] = useState<Dictator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwner = isAuthenticated && username && dictator?.username === username;

  useEffect(() => {
    const fetchDictator = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await publicApi.getDictatorById(parseInt(id));
        setDictator(data);
      } catch (error) {
        console.error('Failed to fetch dictator:', error);
        setError('Failed to load dictator details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDictator();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    navigate(`/profile`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading dictator details..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Stack spacing={3} alignItems="center">
          <Alert severity="error">
            {error}
          </Alert>
          <Button variant="outlined" onClick={handleGoBack}>
            Go Back
          </Button>
        </Stack>
      </Container>
    );
  }

  if (!dictator) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Stack spacing={3} alignItems="center">
          <Alert severity="warning">
            Dictator not found
          </Alert>
          <Button variant="outlined" onClick={handleGoBack}>
            Go Back
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
          >
            Back
          </Button>
          
          {isOwner && (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {/* Dictator Profile Card */}
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={1}>
                  <Typography variant="h3" component="h1" fontWeight="bold">
                    {dictator.name}
                  </Typography>
                  <Chip 
                    label={`@${dictator.username}`} 
                    color="primary" 
                    size="medium"
                  />
                </Stack>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <EmojiEvents sx={{ fontSize: 32, color: '#f0a020' }} />
                  <Typography variant="h5" fontWeight="bold">
                    {dictator.achievements.length} Achievements
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn color="action" />
                  <Typography variant="body1" fontWeight="bold">Country:</Typography>
                  <Chip label={dictator.country} color="success" size="medium" />
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarToday color="action" />
                  <Typography variant="body1" fontWeight="bold">Years in Power:</Typography>
                  <Typography variant="body1">{formatYearsInPower(dictator.yearsInPower)}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <Person color="action" />
                  <Typography variant="body1" fontWeight="bold">Profile Created:</Typography>
                  <Typography variant="body1">{formatDate(dictator.createdAt)}</Typography>
                </Box>
              </Stack>

              <Divider />

              <Stack spacing={1}>
                <Typography variant="h6" fontWeight="bold">Description</Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {dictator.description}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Achievements */}
        <AchievementList achievements={dictator.achievements} />
      </Stack>
    </Container>
  );
};

export default DictatorDetailPage;

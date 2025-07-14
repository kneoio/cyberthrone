import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Container
} from '@mui/material';
import { Edit, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Dictator, Achievement, CreateAchievementRequest } from '../types/dictator';
import { publicApi, protectedApi } from '../services/api';
import { useKeycloak } from '../hooks/useKeycloak';
import { ROUTES } from '../utils/constants';
import AchievementList from '../components/achievements/AchievementList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username } = useKeycloak();
  const [dictator, setDictator] = useState<Dictator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [achievementForm, setAchievementForm] = useState<CreateAchievementRequest>({
    title: '',
    description: '',
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (!isAuthenticated || !username) {
      navigate(ROUTES.HOME);
      return;
    }

    // Create a mock dictator profile from JWT data since there's no backend endpoint
    const createProfileFromJWT = () => {
      setLoading(true);
      setError(null);
      
      // Create a basic profile using JWT username
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

  const handleAddAchievement = () => {
    setEditingAchievement(null);
    setAchievementForm({
      title: '',
      description: '',
      year: new Date().getFullYear(),
    });
    setShowAchievementModal(true);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setAchievementForm({
      title: achievement.title,
      description: achievement.description,
      year: achievement.year,
    });
    setShowAchievementModal(true);
  };

  const handleSaveAchievement = async () => {
    try {
      if (editingAchievement) {
        // Update existing achievement
        await protectedApi.updateAchievement(editingAchievement.id, achievementForm);
      } else {
        // Create new achievement
        if (dictator?.id) {
          await protectedApi.createAchievement(dictator.id, achievementForm);
        }
      }
      
      // Refresh the profile data
      if (username) {
        const allDictators = await publicApi.getDictators();
        const updatedData = allDictators.find(d => d.username === username);
        if (updatedData) {
          setDictator(updatedData);
        }
      }
      
      setShowAchievementModal(false);
    } catch (error) {
      console.error('Failed to save achievement:', error);
      setError('Failed to save achievement. Please try again.');
    }
  };

  const handleDeleteAchievement = async (achievementId: number) => {
    try {
      await protectedApi.deleteAchievement(achievementId);
      
      // Refresh the profile data
      if (username) {
        const allDictators = await publicApi.getDictators();
        const updatedData = allDictators.find(d => d.username === username);
        if (updatedData) {
          setDictator(updatedData);
        }
      }
    } catch (error) {
      console.error('Failed to delete achievement:', error);
      setError('Failed to delete achievement. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 5, textAlign: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <Alert severity="error">
            {error}
          </Alert>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Stack>
      </Container>
    );
  }

  if (!dictator) {
    return (
      <Container maxWidth="md" sx={{ py: 5, textAlign: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <Alert severity="info">
            You don't have a dictator profile yet. Create one to get started!
          </Alert>
          <Button variant="contained" onClick={() => navigate(ROUTES.CREATE_PROFILE)}>
            Create Dictator
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              My Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your dictator profile and achievements
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(ROUTES.CREATE_PROFILE)}
          >
            Edit Profile
          </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Profile Card */}
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

              <Stack spacing={1}>
                <Typography variant="body1">
                  <strong>Country:</strong> {dictator.country}
                </Typography>
                <Typography variant="body1">
                  <strong>Years in Power:</strong> {dictator.yearsInPower}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong> {dictator.description}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Achievements */}
        <AchievementList
          achievements={dictator.achievements}
          showActions={true}
          onAddAchievement={handleAddAchievement}
          onEditAchievement={handleEditAchievement}
          onDeleteAchievement={handleDeleteAchievement}
        />

        {/* Achievement Modal */}
        <Dialog
          open={showAchievementModal}
          onClose={() => setShowAchievementModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Title"
                value={achievementForm.title}
                onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                placeholder="Enter achievement title"
                required
                fullWidth
              />
              
              <TextField
                label="Description"
                value={achievementForm.description}
                onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                placeholder="Describe the achievement"
                multiline
                rows={4}
                required
                fullWidth
              />
              
              <TextField
                label="Year"
                type="number"
                value={achievementForm.year}
                onChange={(e) => setAchievementForm({ ...achievementForm, year: parseInt(e.target.value) || new Date().getFullYear() })}
                placeholder="Enter year"
                inputProps={{
                  min: 1900,
                  max: new Date().getFullYear()
                }}
                required
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAchievementModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAchievement} variant="contained" startIcon={<Save />}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
};

export default ProfilePage;

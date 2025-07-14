import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  TextField,
  Stack,
  Container
} from '@mui/material';
import { ArrowBack, Save, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CreateDictatorRequest } from '../types/dictator';
import { protectedApi } from '../services/api';
import { useKeycloak } from '../hooks/useKeycloak';
import { ROUTES } from '../utils/constants';
import { validateUsername, validateYearsInPower } from '../utils/helpers';

const CreateProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username, isLoading } = useKeycloak();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateDictatorRequest>({
    username: '',
    name: '',
    country: '',
    description: '',
    yearsInPower: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateDictatorRequest, string>>>({});

  useEffect(() => {
    if (!isAuthenticated || !username || isLoading) {
      if (!isLoading && !isAuthenticated) {
        navigate(ROUTES.HOME);
      }
      return;
    }

    // Force reset form to ensure no username pre-filling
    console.log('Resetting form - ensuring empty username');
    setFormData({
      username: '',
      name: '',
      country: '',
      description: '',
      yearsInPower: '',
    });
  }, [isAuthenticated, username, isLoading, navigate]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CreateDictatorRequest, string>> = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      errors.username = 'Username must be 3-20 characters, alphanumeric and underscores only';
    }

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!formData.yearsInPower.trim()) {
      errors.yearsInPower = 'Years in power is required';
    } else if (!validateYearsInPower(formData.yearsInPower)) {
      errors.yearsInPower = 'Format: YYYY-YYYY or YYYY-present';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Debug: Log the form data being sent
      console.log('Form data being sent:', formData);
      console.log('Username in form:', formData.username);

      // Create new profile (no ID in formData)
      await protectedApi.createOrUpdateDictator(formData);

      // Navigate back to dictators list to see the new profile
      navigate(ROUTES.DICTATORS);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleInputChange = (field: keyof CreateDictatorRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Create Dictator
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Set up your dictator profile
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
          >
            Back
          </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Profile Form */}
        <Card>
          <CardContent>
            <Stack spacing={3}>


              <Stack spacing={2}>
                <TextField
                  label="Username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter your username"
                  disabled={false} // Users can set their own username
                  required
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                  fullWidth
                />

                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your dictator name"
                  required
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  fullWidth
                />

                <TextField
                  label="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Enter your country"
                  required
                  error={!!formErrors.country}
                  helperText={formErrors.country}
                  fullWidth
                />

                <TextField
                  label="Years in Power"
                  value={formData.yearsInPower}
                  onChange={(e) => handleInputChange('yearsInPower', e.target.value)}
                  placeholder="e.g., 2000-2010 or 2000-present"
                  required
                  error={!!formErrors.yearsInPower}
                  helperText={formErrors.yearsInPower}
                  fullWidth
                />

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your dictator persona, achievements, and leadership style..."
                  multiline
                  rows={6}
                  required
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  fullWidth
                />
              </Stack>

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={handleGoBack}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  disabled={loading}
                  startIcon={<Save />}
                  onClick={handleSubmit}
                >
                  Create Dictator
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default CreateProfilePage;

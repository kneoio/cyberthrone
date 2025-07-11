import React, { useEffect, useState } from 'react';
import { NSpace, NText, NButton, NCard, NAlert, NForm, NFormItem, NInput } from '@naive-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Save, Person } from '@vicons/ionicons5';
import { CreateDictatorRequest, Dictator } from '../types/dictator';
import { publicApi, protectedApi } from '../services/api';
import { useKeycloak } from '../hooks/useKeycloak';
import { ROUTES } from '../utils/constants';
import { validateUsername, validateYearsInPower } from '../utils/helpers';

const CreateProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username } = useKeycloak();
  const [existingDictator, setExistingDictator] = useState<Dictator | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<CreateDictatorRequest>({
    username: '',
    name: '',
    country: '',
    description: '',
    yearsInPower: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateDictatorRequest, string>>>({});

  useEffect(() => {
    if (!isAuthenticated || !username) {
      navigate(ROUTES.HOME);
      return;
    }

    // Check if user already has a profile
    const checkExistingProfile = async () => {
      try {
        const data = await publicApi.getDictatorByUsername(username);
        setExistingDictator(data);
        setIsEditing(true);
        
        // Pre-populate form with existing data
        setFormData({
          username: data.username,
          name: data.name,
          country: data.country,
          description: data.description,
          yearsInPower: data.yearsInPower,
        });
      } catch (error) {
        // No existing profile, start fresh
        setFormData(prev => ({ ...prev, username: username || '' }));
      }
    };

    checkExistingProfile();
  }, [isAuthenticated, username, navigate]);

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

      if (isEditing && existingDictator) {
        // Update existing profile
        await protectedApi.updateDictator(existingDictator.id, formData);
      } else {
        // Create new profile
        await protectedApi.createDictator(formData);
      }

      // Navigate to profile page
      navigate(ROUTES.PROFILE);
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
    <NSpace vertical size="large" style={{ padding: '24px 0' }}>
      {/* Header */}
      <NSpace align="center" justify="space-between">
        <NSpace vertical>
          <NText style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {isEditing ? 'Edit Profile' : 'Create Profile'}
          </NText>
          <NText depth="2">
            {isEditing ? 'Update your dictator profile information' : 'Set up your dictator profile'}
          </NText>
        </NSpace>
        
        <NButton
          type="default"
          renderIcon={() => <ArrowBack />}
          onClick={handleGoBack}
        >
          Back
        </NButton>
      </NSpace>

      {/* Error Message */}
      {error && (
        <NAlert type="error" title="Error" closable onClose={() => setError(null)}>
          {error}
        </NAlert>
      )}

      {/* Profile Form */}
      <NCard>
        <NSpace vertical size="large">
          <NSpace align="center">
            <Person style={{ fontSize: '24px' }} />
            <NText style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Profile Information
            </NText>
          </NSpace>

          <NForm>
            <NFormItem 
              label="Username" 
              required
              feedback={formErrors.username}
              validationStatus={formErrors.username ? 'error' : undefined}
            >
              <NInput
                value={formData.username}
                onUpdateValue={(value) => handleInputChange('username', value)}
                placeholder="Enter your username"
                disabled={isEditing} // Can't change username when editing
              />
            </NFormItem>

            <NFormItem 
              label="Name" 
              required
              feedback={formErrors.name}
              validationStatus={formErrors.name ? 'error' : undefined}
            >
              <NInput
                value={formData.name}
                onUpdateValue={(value) => handleInputChange('name', value)}
                placeholder="Enter your dictator name"
              />
            </NFormItem>

            <NFormItem 
              label="Country" 
              required
              feedback={formErrors.country}
              validationStatus={formErrors.country ? 'error' : undefined}
            >
              <NInput
                value={formData.country}
                onUpdateValue={(value) => handleInputChange('country', value)}
                placeholder="Enter your country"
              />
            </NFormItem>

            <NFormItem 
              label="Years in Power" 
              required
              feedback={formErrors.yearsInPower}
              validationStatus={formErrors.yearsInPower ? 'error' : undefined}
            >
              <NInput
                value={formData.yearsInPower}
                onUpdateValue={(value) => handleInputChange('yearsInPower', value)}
                placeholder="e.g., 2000-2010 or 2000-present"
              />
            </NFormItem>

            <NFormItem 
              label="Description" 
              required
              feedback={formErrors.description}
              validationStatus={formErrors.description ? 'error' : undefined}
            >
              <NInput
                type="textarea"
                value={formData.description}
                onUpdateValue={(value) => handleInputChange('description', value)}
                placeholder="Describe your dictator persona, achievements, and leadership style..."
                rows={6}
              />
            </NFormItem>
          </NForm>

          <NSpace justify="end">
            <NButton onClick={handleGoBack}>
              Cancel
            </NButton>
            <NButton
              type="primary"
              loading={loading}
              renderIcon={() => <Save />}
              onClick={handleSubmit}
            >
              {isEditing ? 'Update Profile' : 'Create Profile'}
            </NButton>
          </NSpace>
        </NSpace>
      </NCard>
    </NSpace>
  );
};

export default CreateProfilePage;

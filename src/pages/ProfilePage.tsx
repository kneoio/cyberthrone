import React, { useEffect, useState } from 'react';
import { NSpace, NText, NButton, NCard, NAlert, NModal, NForm, NFormItem, NInput, NInputNumber } from '@naive-ui/react';
import { useNavigate } from 'react-router-dom';
import { Add, Edit, Save, Trash } from '@vicons/ionicons5';
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

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await publicApi.getDictatorByUsername(username);
        setDictator(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        if (error instanceof Error && error.message.includes('404')) {
          // User doesn't have a profile yet
          navigate(ROUTES.CREATE_PROFILE);
        } else {
          setError('Failed to load your profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
        await protectedApi.createAchievement(achievementForm);
      }
      
      // Refresh the profile data
      if (username) {
        const updatedData = await publicApi.getDictatorByUsername(username);
        setDictator(updatedData);
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
        const updatedData = await publicApi.getDictatorByUsername(username);
        setDictator(updatedData);
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
      <NSpace vertical align="center" style={{ padding: '40px 0' }}>
        <NAlert type="error" title="Error">
          {error}
        </NAlert>
        <NButton onClick={() => window.location.reload()}>Retry</NButton>
      </NSpace>
    );
  }

  if (!dictator) {
    return (
      <NSpace vertical align="center" style={{ padding: '40px 0' }}>
        <NAlert type="info" title="No Profile Found">
          You don't have a dictator profile yet. Create one to get started!
        </NAlert>
        <NButton type="primary" onClick={() => navigate(ROUTES.CREATE_PROFILE)}>
          Create Profile
        </NButton>
      </NSpace>
    );
  }

  return (
    <NSpace vertical size="large" style={{ padding: '24px 0' }}>
      {/* Header */}
      <NSpace align="center" justify="space-between">
        <NSpace vertical>
          <NText style={{ fontSize: '32px', fontWeight: 'bold' }}>
            My Profile
          </NText>
          <NText depth="2">
            Manage your dictator profile and achievements
          </NText>
        </NSpace>
        
        <NButton
          type="primary"
          renderIcon={() => <Edit />}
          onClick={() => navigate(ROUTES.CREATE_PROFILE)}
        >
          Edit Profile
        </NButton>
      </NSpace>

      {/* Error Message */}
      {error && (
        <NAlert type="error" title="Error" closable onClose={() => setError(null)}>
          {error}
        </NAlert>
      )}

      {/* Profile Card */}
      <NCard>
        <NSpace vertical size="large">
          <NSpace align="center" justify="space-between">
            <NSpace vertical>
              <NText style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {dictator.name}
              </NText>
              <NText depth="2">@{dictator.username}</NText>
            </NSpace>
          </NSpace>

          <NSpace vertical size="medium">
            <NText><strong>Country:</strong> {dictator.country}</NText>
            <NText><strong>Years in Power:</strong> {dictator.yearsInPower}</NText>
            <NText><strong>Description:</strong> {dictator.description}</NText>
          </NSpace>
        </NSpace>
      </NCard>

      {/* Achievements */}
      <AchievementList
        achievements={dictator.achievements}
        showActions={true}
        onAddAchievement={handleAddAchievement}
        onEditAchievement={handleEditAchievement}
        onDeleteAchievement={handleDeleteAchievement}
      />

      {/* Achievement Modal */}
      <NModal
        show={showAchievementModal}
        onUpdateShow={setShowAchievementModal}
        preset="dialog"
        title={editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
        positiveText="Save"
        negativeText="Cancel"
        onPositiveClick={handleSaveAchievement}
      >
        <NForm>
          <NFormItem label="Title" required>
            <NInput
              value={achievementForm.title}
              onUpdateValue={(value) => setAchievementForm({ ...achievementForm, title: value })}
              placeholder="Enter achievement title"
            />
          </NFormItem>
          
          <NFormItem label="Description" required>
            <NInput
              type="textarea"
              value={achievementForm.description}
              onUpdateValue={(value) => setAchievementForm({ ...achievementForm, description: value })}
              placeholder="Describe the achievement"
              rows={4}
            />
          </NFormItem>
          
          <NFormItem label="Year" required>
            <NInputNumber
              value={achievementForm.year}
              onUpdateValue={(value) => setAchievementForm({ ...achievementForm, year: value || new Date().getFullYear() })}
              placeholder="Enter year"
              min={1900}
              max={new Date().getFullYear()}
            />
          </NFormItem>
        </NForm>
      </NModal>
    </NSpace>
  );
};

export default ProfilePage;

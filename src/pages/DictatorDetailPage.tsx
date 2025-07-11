import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NSpace, NText, NButton, NCard, NTag, NAlert, NDivider } from '@naive-ui/react';
import { ArrowBack, Edit, Calendar, Person, Location, Trophy } from '@vicons/ionicons5';
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
      <NSpace vertical align="center" style={{ padding: '40px 0' }}>
        <NAlert type="error" title="Error">
          {error}
        </NAlert>
        <NButton onClick={handleGoBack}>Go Back</NButton>
      </NSpace>
    );
  }

  if (!dictator) {
    return (
      <NSpace vertical align="center" style={{ padding: '40px 0' }}>
        <NAlert type="warning" title="Not Found">
          Dictator not found
        </NAlert>
        <NButton onClick={handleGoBack}>Go Back</NButton>
      </NSpace>
    );
  }

  return (
    <NSpace vertical size="large" style={{ padding: '24px 0' }}>
      {/* Header */}
      <NSpace align="center" justify="space-between">
        <NButton
          type="default"
          renderIcon={() => <ArrowBack />}
          onClick={handleGoBack}
        >
          Back
        </NButton>
        
        {isOwner && (
          <NButton
            type="primary"
            renderIcon={() => <Edit />}
            onClick={handleEditProfile}
          >
            Edit Profile
          </NButton>
        )}
      </NSpace>

      {/* Dictator Profile Card */}
      <NCard>
        <NSpace vertical size="large">
          <NSpace align="center" justify="space-between">
            <NSpace vertical>
              <NText style={{ fontSize: '36px', fontWeight: 'bold' }}>
                {dictator.name}
              </NText>
              <NTag type="info" size="large">
                @{dictator.username}
              </NTag>
            </NSpace>
            
            <NSpace align="center">
              <Trophy style={{ fontSize: '32px', color: '#f0a020' }} />
              <NText style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {dictator.achievements.length} Achievements
              </NText>
            </NSpace>
          </NSpace>

          <NSpace vertical size="medium">
            <NSpace align="center">
              <Location />
              <NText strong>Country: </NText>
              <NTag type="success" size="large">{dictator.country}</NTag>
            </NSpace>
            
            <NSpace align="center">
              <Calendar />
              <NText strong>Years in Power: </NText>
              <NText>{formatYearsInPower(dictator.yearsInPower)}</NText>
            </NSpace>
            
            <NSpace align="center">
              <Person />
              <NText strong>Profile Created: </NText>
              <NText>{formatDate(dictator.createdAt)}</NText>
            </NSpace>
          </NSpace>

          <NDivider />

          <NSpace vertical>
            <NText strong style={{ fontSize: '18px' }}>Description</NText>
            <NText style={{ lineHeight: '1.6' }}>{dictator.description}</NText>
          </NSpace>
        </NSpace>
      </NCard>

      {/* Achievements */}
      <AchievementList achievements={dictator.achievements} />
    </NSpace>
  );
};

export default DictatorDetailPage;

import React, { useEffect, useState } from 'react';
import { NSpace, NText, NButton, NAlert } from '@naive-ui/react';
import { useNavigate } from 'react-router-dom';
import { Add, Refresh } from '@vicons/ionicons5';
import { Dictator } from '../types/dictator';
import { publicApi } from '../services/api';
import { useKeycloak } from '../hooks/useKeycloak';
import { ROUTES } from '../utils/constants';
import DictatorList from '../components/dictators/DictatorList';

const DictatorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useKeycloak();
  const [dictators, setDictators] = useState<Dictator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDictators = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await publicApi.getDictators();
      setDictators(data);
    } catch (error) {
      console.error('Failed to fetch dictators:', error);
      setError('Failed to load dictators. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDictators();
  }, []);

  const handleCreateProfile = () => {
    navigate(ROUTES.CREATE_PROFILE);
  };

  const handleRefresh = () => {
    fetchDictators();
  };

  return (
    <NSpace vertical size="large" style={{ padding: '24px 0' }}>
      {/* Header */}
      <NSpace align="center" justify="space-between">
        <NSpace vertical>
          <NText style={{ fontSize: '32px', fontWeight: 'bold' }}>
            All Dictators
          </NText>
          <NText depth="2">
            Browse and explore dictator profiles and their achievements
          </NText>
        </NSpace>
        
        <NSpace>
          <NButton
            type="default"
            renderIcon={() => <Refresh />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </NButton>
          
          {isAuthenticated && (
            <NButton
              type="primary"
              renderIcon={() => <Add />}
              onClick={handleCreateProfile}
            >
              Create Profile
            </NButton>
          )}
        </NSpace>
      </NSpace>

      {/* Error Message */}
      {error && (
        <NAlert type="error" title="Error" closable onClose={() => setError(null)}>
          {error}
        </NAlert>
      )}

      {/* Dictators List */}
      <DictatorList dictators={dictators} loading={loading} />
    </NSpace>
  );
};

export default DictatorsPage;

import React, { useEffect, useState } from 'react';
import { NSpace, NText, NButton, NCard, NGrid, NGridItem, NDivider } from '@naive-ui/react';
import { useNavigate } from 'react-router-dom';
import { People, Add, Trophy } from '@vicons/ionicons5';
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
    <NSpace vertical size="large" style={{ padding: '40px 0' }}>
      {/* Hero Section */}
      <NSpace vertical align="center" style={{ textAlign: 'center', padding: '60px 0' }}>
        <NText style={{ fontSize: '48px', fontWeight: 'bold', background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🏛️ {APP_NAME}
        </NText>
        <NText style={{ fontSize: '20px', maxWidth: '600px', lineHeight: '1.6' }} depth="2">
          {APP_DESCRIPTION}
        </NText>
        <NSpace size="large" style={{ marginTop: '30px' }}>
          <NButton
            type="primary"
            size="large"
            renderIcon={() => <People />}
            onClick={() => navigate(ROUTES.DICTATORS)}
          >
            Browse Dictators
          </NButton>
          {isAuthenticated ? (
            <NButton
              type="default"
              size="large"
              renderIcon={() => <Add />}
              onClick={() => navigate(ROUTES.CREATE_PROFILE)}
            >
              Create Profile
            </NButton>
          ) : (
            <LoginButton />
          )}
        </NSpace>
      </NSpace>

      <NDivider />

      {/* Featured Dictators Section */}
      <NSpace vertical align="center" style={{ padding: '40px 0' }}>
        <NText style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center' }}>
          Featured Dictators
        </NText>
        <NText style={{ fontSize: '16px', textAlign: 'center' }} depth="2">
          Discover some of the most notable dictators and their achievements
        </NText>

        {loading ? (
          <LoadingSpinner message="Loading featured dictators..." />
        ) : (
          <NGrid
            xGap="24"
            yGap="24"
            cols="1 s:2 m:3"
            responsive="screen"
            style={{ width: '100%', maxWidth: '1200px' }}
          >
            {featuredDictators.map((dictator) => (
              <NGridItem key={dictator.id}>
                <DictatorCard dictator={dictator} />
              </NGridItem>
            ))}
          </NGrid>
        )}

        <NButton
          type="default"
          size="large"
          onClick={() => navigate(ROUTES.DICTATORS)}
        >
          View All Dictators
        </NButton>
      </NSpace>

      <NDivider />

      {/* Features Section */}
      <NSpace vertical align="center" style={{ padding: '40px 0' }}>
        <NText style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center' }}>
          What You Can Do
        </NText>
        
        <NGrid
          xGap="24"
          yGap="24"
          cols="1 s:2 m:3"
          responsive="screen"
          style={{ width: '100%', maxWidth: '1000px' }}
        >
          <NGridItem>
            <NCard hoverable style={{ height: '200px', textAlign: 'center' }}>
              <NSpace vertical align="center" justify="center" style={{ height: '100%' }}>
                <People style={{ fontSize: '48px', color: '#18a058' }} />
                <NText strong>Browse Dictators</NText>
                <NText depth="2">
                  Explore profiles and learn about different dictators from history
                </NText>
              </NSpace>
            </NCard>
          </NGridItem>
          
          <NGridItem>
            <NCard hoverable style={{ height: '200px', textAlign: 'center' }}>
              <NSpace vertical align="center" justify="center" style={{ height: '100%' }}>
                <Add style={{ fontSize: '48px', color: '#2080f0' }} />
                <NText strong>Create Profile</NText>
                <NText depth="2">
                  Build your own dictator profile with custom information
                </NText>
              </NSpace>
            </NCard>
          </NGridItem>
          
          <NGridItem>
            <NCard hoverable style={{ height: '200px', textAlign: 'center' }}>
              <NSpace vertical align="center" justify="center" style={{ height: '100%' }}>
                <Trophy style={{ fontSize: '48px', color: '#f0a020' }} />
                <NText strong>Manage Achievements</NText>
                <NText depth="2">
                  Add and manage achievements for your dictator profile
                </NText>
              </NSpace>
            </NCard>
          </NGridItem>
        </NGrid>
      </NSpace>
    </NSpace>
  );
};

export default HomePage;

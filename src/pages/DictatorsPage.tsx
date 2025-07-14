import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Stack, Alert, Button } from '@mui/material';
import { Refresh, Add } from '@mui/icons-material';
import { Dictator } from '../types/dictator';
import { publicApi } from '../services/api';
import { useKeycloak } from '../hooks/useKeycloak';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import DictatorList from '../components/dictators/DictatorList';

const DictatorsPage: React.FC = () => {
  const { isAuthenticated } = useKeycloak();
  const navigate = useNavigate();
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

  const handleRefresh = () => {
    fetchDictators();
  };

  const handleCreate = () => {
    navigate(ROUTES.CREATE_PROFILE);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              All Dictators
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse and explore dictator profiles and their achievements
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            {isAuthenticated && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreate}
              >
                Create
              </Button>
            )}
          </Stack>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <DictatorList dictators={dictators} loading={loading} />
      </Stack>
    </Container>
  );
};

export default DictatorsPage;

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Dictator } from '../../types/dictator';
import { truncateText, formatYearsInPower, getTotalAchievements } from '../../utils/helpers';
import { useKeycloak } from '../../contexts/KeycloakContext';
import { protectedApi } from '../../services/api';

interface DictatorCardProps {
  dictator: Dictator;
}

const DictatorCard: React.FC<DictatorCardProps> = ({ dictator }) => {
  const navigate = useNavigate();
  const { username, isAuthenticated } = useKeycloak();

  const handleViewDetails = () => {
    navigate(`/dictators/${dictator.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${dictator.name}?`)) {
      try {
        await protectedApi.deleteDictator(dictator.id);
        // Refresh the page or trigger a re-fetch
        window.location.reload();
      } catch (error: any) {
        console.error('Failed to delete dictator:', error);
        if (error.response?.status === 401) {
          alert('401 Unauthorized: You are not authorized to delete this dictator.');
        } else {
          alert('Failed to delete dictator. Please try again.');
        }
      }
    }
  };

  // Check if current user owns this dictator
  const isOwner = isAuthenticated && username === dictator.username;
  
  // Debug ownership
  console.log('Delete button debug:', {
    isAuthenticated,
    username,
    dictatorUsername: dictator.username,
    isOwner
  });

  return (
    <Card
      sx={{ 
        height: '320px', 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
      onClick={handleViewDetails}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="h3" fontWeight="bold">
              {dictator.name}
            </Typography>
            <Chip 
              label={`@${dictator.username}`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              {formatYearsInPower(dictator.yearsInPower)}
            </Typography>
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" fontWeight="bold">Country:</Typography>
            <Chip label={dictator.country} size="small" color="success" />
          </Stack>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ lineHeight: 1.5, flexGrow: 1 }}
          >
            {truncateText(dictator.description, 120)}
          </Typography>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">
                {getTotalAchievements(dictator)} Achievements
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                size="small"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
              >
                View Details
              </Button>
              
              <Button
                color="error"
                size="small"
                variant="outlined"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DictatorCard;

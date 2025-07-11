import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Achievement } from '../../types/dictator';
import { getAchievementsByYear } from '../../utils/helpers';
import AchievementCard from './AchievementCard';

interface AchievementListProps {
  achievements: Achievement[];
  showActions?: boolean;
  onAddAchievement?: () => void;
  onEditAchievement?: (achievement: Achievement) => void;
  onDeleteAchievement?: (achievementId: number) => void;
}

const AchievementList: React.FC<AchievementListProps> = ({
  achievements,
  showActions = false,
  onAddAchievement,
  onEditAchievement,
  onDeleteAchievement,
}) => {
  const sortedAchievements = getAchievementsByYear(achievements);

  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Achievements ({achievements.length})
        </Typography>
        
        {showActions && onAddAchievement && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddAchievement}
          >
            Add Achievement
          </Button>
        )}
      </Box>

      {sortedAchievements.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No achievements yet
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {sortedAchievements.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <AchievementCard
                achievement={achievement}
                showActions={showActions}
                onEdit={onEditAchievement}
                onDelete={onDeleteAchievement}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default AchievementList;

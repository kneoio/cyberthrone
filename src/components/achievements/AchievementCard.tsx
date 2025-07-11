import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  Stack
} from '@mui/material';
import { CalendarToday, EmojiEvents, Edit, Delete } from '@mui/icons-material';
import { Achievement } from '../../types/dictator';
import { formatDate } from '../../utils/helpers';

interface AchievementCardProps {
  achievement: Achievement;
  showActions?: boolean;
  onEdit?: (achievement: Achievement) => void;
  onDelete?: (achievementId: number) => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(achievement);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(achievement.id);
    }
  };

  return (
    <Card sx={{ height: 200, display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 4 } }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={2} sx={{ height: '100%' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <EmojiEvents color="primary" />
              <Typography variant="h6" fontWeight="bold">
                {achievement.title}
              </Typography>
            </Box>
            <Chip 
              label={achievement.year} 
              color="primary" 
              size="small" 
            />
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ lineHeight: 1.5, flex: 1, overflow: 'hidden' }}
          >
            {achievement.description}
          </Typography>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={0.5}>
              <CalendarToday sx={{ fontSize: 16 }} color="action" />
              <Typography variant="caption" color="text.secondary">
                Added {formatDate(achievement.createdAt)}
              </Typography>
            </Box>
            
            {showActions && (
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;

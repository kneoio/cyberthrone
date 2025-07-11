import React from 'react';
import { Card, CardContent, Typography, Button, Chip, Stack, Box, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, CalendarToday, EmojiEvents } from '@mui/icons-material';
import { Dictator } from '../../types/dictator';
import { truncateText, formatYearsInPower, getTotalAchievements } from '../../utils/helpers';

interface DictatorCardProps {
  dictator: Dictator;
}

const DictatorCard: React.FC<DictatorCardProps> = ({ dictator }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/dictators/${dictator.id}`);
  };

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
            <CalendarToday fontSize="small" />
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
              <EmojiEvents fontSize="small" />
              <Badge badgeContent={getTotalAchievements(dictator)} color="primary">
                <Typography variant="body2">Achievements</Typography>
              </Badge>
            </Stack>
            
            <Button
              variant="contained"
              size="small"
              startIcon={<Visibility />}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleViewDetails();
              }}
            >
              View Details
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DictatorCard;

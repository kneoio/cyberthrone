import React from 'react';
import { NCard, NText, NSpace, NTag, NButton } from '@naive-ui/react';
import { Calendar, Trophy, Create, Trash } from '@vicons/ionicons5';
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
    <NCard hoverable style={{ height: '200px' }}>
      <NSpace vertical size="medium">
        <NSpace align="center" justify="space-between">
          <NSpace align="center">
            <Trophy />
            <NText strong style={{ fontSize: '16px' }}>
              {achievement.title}
            </NText>
          </NSpace>
          <NTag type="info" size="small">
            {achievement.year}
          </NTag>
        </NSpace>
        
        <NText depth="2" style={{ lineHeight: '1.5', flex: 1 }}>
          {achievement.description}
        </NText>
        
        <NSpace align="center" justify="space-between">
          <NSpace align="center">
            <Calendar />
            <NText depth="3" style={{ fontSize: '12px' }}>
              Added {formatDate(achievement.createdAt)}
            </NText>
          </NSpace>
          
          {showActions && (
            <NSpace>
              <NButton
                size="small"
                type="primary"
                renderIcon={() => <Create />}
                onClick={handleEdit}
              >
                Edit
              </NButton>
              <NButton
                size="small"
                type="error"
                renderIcon={() => <Trash />}
                onClick={handleDelete}
              >
                Delete
              </NButton>
            </NSpace>
          )}
        </NSpace>
      </NSpace>
    </NCard>
  );
};

export default AchievementCard;

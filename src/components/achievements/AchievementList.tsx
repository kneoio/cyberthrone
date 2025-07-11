import React from 'react';
import { NGrid, NGridItem, NEmpty, NSpace, NText, NButton } from '@naive-ui/react';
import { Add } from '@vicons/ionicons5';
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
    <NSpace vertical size="large">
      <NSpace align="center" justify="space-between">
        <NText strong style={{ fontSize: '18px' }}>
          Achievements ({achievements.length})
        </NText>
        
        {showActions && onAddAchievement && (
          <NButton
            type="primary"
            renderIcon={() => <Add />}
            onClick={onAddAchievement}
          >
            Add Achievement
          </NButton>
        )}
      </NSpace>

      {sortedAchievements.length === 0 ? (
        <NEmpty description="No achievements yet" />
      ) : (
        <NGrid
          xGap="16"
          yGap="16"
          cols="1 s:2 m:3"
          responsive="screen"
        >
          {sortedAchievements.map((achievement) => (
            <NGridItem key={achievement.id}>
              <AchievementCard
                achievement={achievement}
                showActions={showActions}
                onEdit={onEditAchievement}
                onDelete={onDeleteAchievement}
              />
            </NGridItem>
          ))}
        </NGrid>
      )}
    </NSpace>
  );
};

export default AchievementList;

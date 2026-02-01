import CoachFlexCard from './CoachFlexCard';
import WeeklyActivityChallenge from './WeeklyActivityChallenge';
import ActivityFactCard from './ActivityFactCard';
import ActivityLogBadges from './ActivityLogBadges';
import AdPlaceholder from './AdPlaceholder';

interface ActivityLogRightColumnProps {
  step?: 'activity' | 'duration' | 'mood';
  activitySelected?: boolean;
}

export default function ActivityLogRightColumn({ 
  step = 'activity', 
  activitySelected = false 
}: ActivityLogRightColumnProps) {
  return (
    <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">
      <CoachFlexCard step={step} activitySelected={activitySelected} />
      <WeeklyActivityChallenge />
      <ActivityFactCard />
      <ActivityLogBadges />
      <AdPlaceholder />
    </div>
  );
}

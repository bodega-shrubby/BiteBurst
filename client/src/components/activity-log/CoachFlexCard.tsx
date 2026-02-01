import LessonMascot from '@/components/LessonMascot';

interface CoachFlexCardProps {
  step?: 'activity' | 'duration' | 'mood';
  activitySelected?: boolean;
}

const MESSAGES: Record<string, string> = {
  'activity': "Ready to move? Let's log your activity!",
  'duration': "Nice choice! How long did you do it?",
  'mood': "Almost done! How did it feel?"
};

const TIPS: Record<string, string> = {
  'activity': "Every minute of movement counts! Log your activities to track your progress.",
  'duration': "Even 5 minutes of activity helps build healthy habits!",
  'mood': "Tracking how you feel helps you learn what activities you enjoy most!"
};

export default function CoachFlexCard({ step = 'activity', activitySelected = false }: CoachFlexCardProps) {
  const message = activitySelected && step === 'activity'
    ? "Great pick! Now let's add the details! 💪"
    : MESSAGES[step];
  const tip = TIPS[step];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <LessonMascot
        type="topic"
        topicMascot="dancestar"
        message={message}
        size="md"
      />

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 font-medium">Coach Flex's Tip</p>
        <p className="text-sm text-gray-700 mt-1">{tip}</p>
      </div>
    </div>
  );
}

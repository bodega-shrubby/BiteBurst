import professorBloopImage from '@assets/Mascots/ProfessorBloop.png';
import appleBuddyImage from '@assets/Mascots/AppleBuddy.png';
import captainCarrotImage from '@assets/Mascots/CaptainCarrot.png';
import hydroHeroImage from '@assets/Mascots/HydroHero.png';
import coachFlexImage from '@assets/Mascots/CoachFlex.png';
import brainyBoltImage from '@assets/Mascots/BrainyBolt.png';
import snackTwinsImage from '@assets/Mascots/SnackTwins.png';
import danceStarImage from '@assets/Mascots/DanceStar.png';

interface LessonMascotProps {
  type?: 'professor' | 'topic';
  topicMascot?: 'apple' | 'carrot' | 'hydration' | 'fitness' | 'brain' | 'snacks' | 'dancestar';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'inline' | 'sidebar' | 'floating';
}

const mascotImages: Record<string, string> = {
  professor: professorBloopImage,
  apple: appleBuddyImage,
  carrot: captainCarrotImage,
  hydration: hydroHeroImage,
  fitness: coachFlexImage,
  brain: brainyBoltImage,
  snacks: snackTwinsImage,
  dancestar: danceStarImage,
};

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

const positionClasses = {
  inline: '',
  sidebar: 'sticky top-24',
  floating: 'fixed bottom-4 right-4 z-30',
};

export default function LessonMascot({
  type = 'professor',
  topicMascot,
  message,
  size = 'md',
  position = 'inline',
}: LessonMascotProps) {
  const mascotSrc = type === 'topic' && topicMascot
    ? mascotImages[topicMascot]
    : mascotImages.professor;

  return (
    <div className={`flex items-start space-x-3 ${positionClasses[position]}`}>
      <div className={`${sizeClasses[size]} flex-shrink-0 animate-mascot-float`}>
        <img
          src={mascotSrc}
          alt="Lesson Guide"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      {message && (
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 max-w-xs animate-bubble-appear">
          <p className="text-sm text-gray-700">{message}</p>
        </div>
      )}
    </div>
  );
}

export function getTopicMascot(topicId: string): 'apple' | 'carrot' | 'hydration' | 'fitness' | 'brain' | 'snacks' | undefined {
  const topicMap: Record<string, 'apple' | 'carrot' | 'hydration' | 'fitness' | 'brain' | 'snacks'> = {
    'fruits': 'apple',
    'vegetables': 'carrot',
    'veggies': 'carrot',
    'hydration': 'hydration',
    'water': 'hydration',
    'sports': 'fitness',
    'exercise': 'fitness',
    'fitness': 'fitness',
    'brain': 'brain',
    'focus': 'brain',
    'learning': 'brain',
    'snacks': 'snacks',
    'food': 'snacks',
  };
  
  return topicMap[topicId.toLowerCase()];
}

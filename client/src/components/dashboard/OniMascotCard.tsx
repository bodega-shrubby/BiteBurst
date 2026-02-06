import oniImage from '@assets/Mascots/Oni_the_orange.png';

interface OniMascotCardProps {
  message?: string;
  userName?: string;
}

export default function OniMascotCard({ message, userName }: OniMascotCardProps) {
  const defaultMessages = [
    `Great job logging your breakfast! Keep it up!`,
    `You're doing amazing today, ${userName || 'champ'}!`,
    `Ready to crush your goals today?`,
    `Let's make today healthy and fun!`,
  ];

  const displayMessage = message || defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex items-center gap-4">
      <div className="w-[90px] h-[90px] flex-shrink-0">
        <img
          src={oniImage}
          alt="Oni the Orange"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-base text-orange-500">Oni the Orange</h3>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          {displayMessage}
        </p>
      </div>
    </div>
  );
}

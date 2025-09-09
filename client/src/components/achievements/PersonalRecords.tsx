import { Flame, Trophy } from 'lucide-react';
import type { PersonalRecords as PersonalRecordsType } from '@/utils/badges';

interface PersonalRecordsProps {
  records: PersonalRecordsType;
}

const recordsData = [
  {
    key: 'longestStreak' as keyof PersonalRecordsType,
    title: 'Longest Streak',
    icon: '🔥',
    color: 'from-red-500 to-orange-500',
  },
  {
    key: 'dailyXpBest' as keyof PersonalRecordsType,
    title: 'Daily Most XP',
    icon: '🏆',
    color: 'from-yellow-500 to-orange-500',
  },
];

export default function PersonalRecords({ records }: PersonalRecordsProps) {
  return (
    <div className="bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-yellow-400" />
          Personal Records
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {recordsData.map((record) => {
            const value = records[record.key] || 0;
            
            return (
              <div 
                key={record.key}
                className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-4 text-center border border-gray-600"
              >
                {/* Background icon with glow effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="text-6xl">{record.icon}</div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 space-y-2">
                  <div className="text-2xl">{record.icon}</div>
                  
                  <div className={`text-3xl font-bold bg-gradient-to-r ${record.color} bg-clip-text text-transparent`}>
                    {value.toLocaleString()}
                  </div>
                  
                  <div className="text-sm text-gray-300 font-medium">
                    {record.title}
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-2 right-2 opacity-20">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute bottom-2 left-2 opacity-20">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { TIME_PERIODS, getRecommendedTimePeriod } from '@/constants/activity-data';

interface TimePeriodScreenProps {
  onSelect: (period: 'morning' | 'afternoon' | 'evening' | 'anytime') => void;
}

export default function TimePeriodScreen({ onSelect }: TimePeriodScreenProps) {
  const [, setLocation] = useLocation();
  const recommendedPeriod = getRecommendedTimePeriod();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-white"
    >
      <header className="bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-6 text-white">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => setLocation('/dashboard')}
            className="mb-4 p-2 hover:bg-white/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h1 className="text-3xl font-black mb-2">Log Activity 🏃</h1>
          <p className="text-blue-100 text-sm">When were you active?</p>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {TIME_PERIODS.map((period) => {
            const isRecommended = period.id === recommendedPeriod;
            
            return (
              <button
                key={period.id}
                onClick={() => onSelect(period.id)}
                className={`
                  relative p-6 rounded-2xl border-2
                  bg-gradient-to-br ${period.color}
                  ${period.borderColor}
                  hover:scale-105 hover:shadow-xl hover:-translate-y-1
                  active:scale-95
                  transition-all duration-200
                  min-h-[180px]
                  flex flex-col items-center justify-center
                  overflow-hidden
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                
                {isRecommended && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    Right now!
                  </div>
                )}
                
                <span className="text-6xl mb-3">{period.emoji}</span>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {period.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-2">
                  {period.timeRange}
                </p>
                
                <p className="text-xs text-gray-500 text-center">
                  {period.motivation}
                </p>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">Not sure when?</p>
          <button
            onClick={() => onSelect('anytime')}
            className="text-blue-600 font-semibold text-sm hover:text-blue-700 underline"
          >
            Just log activity without time →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

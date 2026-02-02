import { useLocation } from 'wouter';

interface SuccessSidebarProps {
  isActivity?: boolean;
}

export default function SuccessSidebar({ isActivity = false }: SuccessSidebarProps) {
  const [, setLocation] = useLocation();
  
  const activeColor = isActivity 
    ? 'bg-blue-50 text-blue-500 border-2 border-blue-200' 
    : 'bg-orange-50 text-orange-500 border-2 border-orange-200';

  return (
    <aside className="w-[200px] bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">🍊</span>
          <span className="text-xl font-bold text-orange-500">BiteBurst</span>
        </div>
      </div>

      <nav className="p-3 space-y-2 flex-1">
        <button 
          onClick={() => setLocation('/lessons')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">📚</span>
          <span className="text-sm font-medium">Lessons</span>
        </button>
        
        <button 
          onClick={() => setLocation('/leaderboard')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">🏆</span>
          <span className="text-sm font-medium">Champs</span>
        </button>
        
        <button 
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl ${activeColor} transition-colors`}
        >
          <span className="text-xl">➕</span>
          <span className="text-sm font-bold">LOG</span>
        </button>
        
        <button 
          onClick={() => setLocation('/settings/profile')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">👤</span>
          <span className="text-sm font-medium">Profile</span>
        </button>
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button 
          onClick={() => setLocation('/settings')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">⚙️</span>
          <span className="text-sm font-medium">More</span>
        </button>
      </div>
    </aside>
  );
}

import { useState, useRef, useEffect } from 'react';

export type TabId = 'records' | 'stickers';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

const tabs: Tab[] = [
  { id: 'records', label: 'Personal Records', icon: '🏆' },
  { id: 'stickers', label: 'Stickers', icon: '🏅' }
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabListRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!tabListRef.current?.contains(e.target as Node)) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : tabs.length - 1;
          setFocusedIndex(prevIndex);
          onTabChange(tabs[prevIndex].id);
          break;
        
        case 'ArrowRight':
          e.preventDefault();
          const nextIndex = focusedIndex < tabs.length - 1 ? focusedIndex + 1 : 0;
          setFocusedIndex(nextIndex);
          onTabChange(tabs[nextIndex].id);
          break;
        
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          onTabChange(tabs[0].id);
          break;
        
        case 'End':
          e.preventDefault();
          setFocusedIndex(tabs.length - 1);
          onTabChange(tabs[tabs.length - 1].id);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, onTabChange]);

  // Set initial focus
  useEffect(() => {
    if (focusedIndex === -1) {
      setFocusedIndex(activeIndex);
    }
  }, [activeIndex, focusedIndex]);

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label="Achievement categories"
      className="flex bg-gray-100 rounded-xl p-1 mb-6"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        const isFocused = index === focusedIndex;
        
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
            tabIndex={isActive ? 0 : -1}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200
              min-h-[48px] text-sm
              ${isActive 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }
              ${isFocused ? 'ring-2 ring-orange-500 ring-offset-2' : ''}
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
            `}
            onClick={() => {
              onTabChange(tab.id);
              setFocusedIndex(index);
            }}
            onFocus={() => setFocusedIndex(index)}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
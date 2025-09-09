interface BadgeFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'All', label: 'All', emoji: '🏆' },
  { id: 'Streak', label: 'Streak', emoji: '🔥' },
  { id: 'Food', label: 'Food', emoji: '🍎' },
  { id: 'Water', label: 'Water', emoji: '💧' },
  { id: 'Activity', label: 'Activity', emoji: '⚽' },
  { id: 'Combo', label: 'Combo', emoji: '⚡' },
  { id: 'Records', label: 'Records', emoji: '👑' },
];

export default function BadgeFilters({ selectedCategory, onCategoryChange }: BadgeFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            flex-shrink-0 flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
            min-h-[44px] min-w-[44px]
            ${selectedCategory === category.id
              ? 'bg-orange-100 text-orange-800 border-2 border-orange-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
          `}
          aria-label={`Filter by ${category.label}`}
        >
          <span className="text-base">{category.emoji}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
}
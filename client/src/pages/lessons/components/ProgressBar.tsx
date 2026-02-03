interface ProgressBarProps {
  progress: number; // 0 to 100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div 
        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      />
    </div>
  );
}

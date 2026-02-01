export default function WeeklyActivityChallenge() {
  return (
    <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-5 text-white shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">🎯 WEEKLY CHALLENGE</span>
        <span className="text-xs opacity-80">5 days left</span>
      </div>
      <h3 className="font-bold text-lg">Move 150 Minutes</h3>
      <p className="text-sm text-green-100 mt-1">Stay active all week!</p>
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1 opacity-80">
          <span>Progress</span>
          <span>0/150 min</span>
        </div>
        <div className="bg-white/20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full" style={{ width: '0%' }} />
        </div>
      </div>
    </div>
  );
}

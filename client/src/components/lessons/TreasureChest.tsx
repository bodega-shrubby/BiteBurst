interface TreasureChestProps {
  x: number;
  y: number;
  isLocked?: boolean;
  size?: number;
}

export default function TreasureChest({ x, y, isLocked = true, size = 68 }: TreasureChestProps) {
  const halfSize = size / 2;
  
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: x - halfSize,
        top: y - halfSize,
        width: size,
        height: size,
      }}
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <img 
          src="/images/treasure-chest.png"
          alt={isLocked ? "Locked treasure chest" : "Unlocked treasure chest"}
          className="w-full h-full object-contain transition-all duration-300"
          style={{
            filter: isLocked 
              ? 'grayscale(100%) drop-shadow(0 4px 6px rgba(0,0,0,0.1))' 
              : 'grayscale(0%) drop-shadow(0 4px 8px rgba(251,191,36,0.4))',
            opacity: isLocked ? 0.8 : 1,
          }}
        />
        
        {!isLocked && (
          <>
            <span 
              className="absolute -top-1 -right-1 text-yellow-400 animate-pulse"
              style={{ fontSize: '14px' }}
            >
              ✨
            </span>
            <span 
              className="absolute -top-2 -left-1 text-yellow-300 animate-pulse"
              style={{ fontSize: '10px', animationDelay: '0.3s' }}
            >
              ✨
            </span>
          </>
        )}
      </div>
    </div>
  );
}

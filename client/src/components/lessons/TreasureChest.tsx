import chestImage from '@assets/treasure_chest_1769687520313.jpg';

interface TreasureChestProps {
  x: number;
  y: number;
  isLocked?: boolean;
}

export default function TreasureChest({ x, y, isLocked = true }: TreasureChestProps) {
  return (
    <div
      className="absolute flex flex-col items-center pointer-events-none z-5"
      style={{
        left: x - 32,
        top: y - 26,
      }}
    >
      <img 
        src={chestImage} 
        alt="Treasure chest" 
        className={`w-16 h-auto ${isLocked ? 'grayscale opacity-60' : ''}`}
        style={{
          filter: isLocked ? 'grayscale(100%) brightness(1.1)' : 'none',
        }}
      />
    </div>
  );
}

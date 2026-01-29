interface TreasureChestProps {
  x: number;
  y: number;
}

export default function TreasureChest({ x, y }: TreasureChestProps) {
  return (
    <div
      className="absolute flex flex-col items-center pointer-events-none z-5"
      style={{
        left: x - 28,
        top: y - 24,
      }}
    >
      <div className="relative w-14 h-12">
        <div 
          className="absolute bottom-0 w-full h-8 rounded-md border-2 border-white"
          style={{
            background: 'linear-gradient(180deg, #D1D5DB 0%, #9CA3AF 100%)',
            boxShadow: '0 3px 0 0 #6B7280, 0 5px 10px rgba(0,0,0,0.1)',
          }}
        >
          <div 
            className="absolute -top-3 left-0 right-0 h-5 rounded-t-md border-2 border-white border-b-0"
            style={{
              background: 'linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 100%)',
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-gray-400"
            style={{ background: '#9CA3AF' }}
          />
        </div>
      </div>
    </div>
  );
}

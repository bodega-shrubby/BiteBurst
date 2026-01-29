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
        top: y - 28,
      }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center border-4 border-gray-200"
        style={{
          background: 'linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 100%)',
          boxShadow: '0 4px 0 -1px #9CA3AF, 0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <svg
          className="w-7 h-7 text-gray-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M5 4h14a2 2 0 012 2v3a2 2 0 01-2 2h-1v7a2 2 0 01-2 2H8a2 2 0 01-2-2v-7H5a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v3h14V6H5zm3 5v7h8v-7H8z" />
          <path d="M10 13h4v2h-4z" />
        </svg>
      </div>
    </div>
  );
}

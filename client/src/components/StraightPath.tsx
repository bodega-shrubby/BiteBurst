interface StraightPathProps {
  startY: number;
  endY: number;
  containerWidth: number;
}

export default function StraightPath({ startY, endY, containerWidth }: StraightPathProps) {
  const centerX = containerWidth / 2;
  const height = endY - startY;

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      width={containerWidth}
      height={height + 200}
      style={{ top: startY }}
    >
      {/* Simple straight line */}
      <line
        x1={centerX}
        y1={0}
        x2={centerX}
        y2={height}
        stroke="#E5E7EB"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
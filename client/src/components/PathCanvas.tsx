import { useMemo } from 'react';

type NodePosition = { x: number; y: number; side: 'left' | 'right' | 'center' };

interface PathCanvasProps {
  nodePositions: NodePosition[];
  containerWidth: number;
  height: number;
}

function makeStraightPath(positions: NodePosition[]): string {
  // Create straight vertical path connecting centered nodes
  if (positions.length < 2) return '';
  
  const d = [`M ${positions[0].x} ${positions[0].y}`];
  
  for (let i = 1; i < positions.length; i++) {
    const curr = positions[i];
    d.push(`L ${curr.x} ${curr.y}`);
  }
  
  return d.join(' ');
}

export default function PathCanvas({ nodePositions, containerWidth, height }: PathCanvasProps) {
  const pathData = useMemo(() => makeStraightPath(nodePositions), [nodePositions]);

  return (
    <svg
      width={containerWidth}
      height={height}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ zIndex: 0 }}
      viewBox={`0 0 ${containerWidth} ${height}`}
      aria-hidden="true"
    >
      {/* Faint trailing highlight overlay */}
      <path
        d={pathData}
        stroke="rgba(255,122,0,0.08)"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Main straight path */}
      <path
        d={pathData}
        stroke="#E2E6EB"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
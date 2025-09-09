import { useMemo } from 'react';

type NodePosition = { x: number; y: number; side: 'left' | 'right' };

interface PathCanvasProps {
  nodePositions: NodePosition[];
  containerWidth: number;
  height: number;
}

function makeZigZagPath(positions: NodePosition[]): string {
  // Create zig-zag path connecting actual node centers
  if (positions.length < 2) return '';
  
  const d = [`M ${positions[0].x} ${positions[0].y}`];
  
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];
    
    // Add smooth curves between nodes for zig-zag effect
    const midY = (prev.y + curr.y) / 2;
    d.push(`C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`);
  }
  
  return d.join(' ');
}

export default function PathCanvas({ nodePositions, containerWidth, height }: PathCanvasProps) {
  const pathData = useMemo(() => makeZigZagPath(nodePositions), [nodePositions]);

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
      
      {/* Main zig-zag path */}
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
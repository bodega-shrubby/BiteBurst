import { useMemo } from 'react';

type Point = { x: number; y: number };

interface PathCanvasProps {
  points: Point[];
  width: number;
  height: number;
}

function makeSmoothPath(points: Point[]): string {
  // Use cubic Beziers between midpoints for smoothness
  if (points.length < 2) return '';
  const d = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cx = (p0.x + p1.x) / 2;
    d.push(`C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`);
  }
  return d.join(' ');
}

export default function PathCanvas({ points, width, height }: PathCanvasProps) {
  const pathData = useMemo(() => makeSmoothPath(points), [points]);

  return (
    <svg
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
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
      
      {/* Main path */}
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
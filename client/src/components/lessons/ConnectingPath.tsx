import { useMemo, useState, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface ConnectingPathProps {
  nodePositions: Point[];
  completedCount: number;
}

export default function ConnectingPath({ nodePositions, completedCount }: ConnectingPathProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const pathData = useMemo(() => {
    if (nodePositions.length < 2) return '';
    
    const points = nodePositions;
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      const midY = (prev.y + curr.y) / 2;
      
      path += ` Q ${prev.x} ${midY}, ${(prev.x + curr.x) / 2} ${midY}`;
      path += ` Q ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  }, [nodePositions]);

  const viewBox = useMemo(() => {
    if (nodePositions.length === 0) return '0 0 100 100';
    
    const minX = Math.min(...nodePositions.map(p => p.x)) - 50;
    const maxX = Math.max(...nodePositions.map(p => p.x)) + 50;
    const minY = Math.min(...nodePositions.map(p => p.y)) - 50;
    const maxY = Math.max(...nodePositions.map(p => p.y)) + 50;
    
    return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  }, [nodePositions]);

  const pathLength = useMemo(() => {
    if (nodePositions.length < 2) return 0;
    let length = 0;
    for (let i = 1; i < nodePositions.length; i++) {
      const prev = nodePositions[i - 1];
      const curr = nodePositions[i];
      length += Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)) * 1.5;
    }
    return length;
  }, [nodePositions]);

  const progressPercent = nodePositions.length > 1 
    ? completedCount / (nodePositions.length - 1) 
    : 0;

  if (nodePositions.length < 2) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-0"
      style={{ overflow: 'visible', width: '100%', height: '100%' }}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF8E3C" />
          <stop offset="50%" stopColor="#FF6A00" />
          <stop offset="100%" stopColor="#E55A00" />
        </linearGradient>
        <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <path
        d={pathData}
        stroke="#d1d5db"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="opacity-50"
      />
      
      <path
        d={pathData}
        stroke="#e5e7eb"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {completedCount > 0 && (
        <path
          d={pathData}
          stroke="url(#progressGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - progressPercent)}
          className="transition-all duration-1000 ease-out"
          filter="url(#pathGlow)"
        />
      )}
      
      {!prefersReducedMotion && completedCount > 0 && progressPercent < 1 && (
        <circle
          cx={nodePositions[Math.min(completedCount, nodePositions.length - 1)]?.x || 0}
          cy={nodePositions[Math.min(completedCount, nodePositions.length - 1)]?.y || 0}
          r="8"
          fill="#FF6A00"
          className="animate-pulse"
        >
          <animate
            attributeName="r"
            values="6;10;6"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
}

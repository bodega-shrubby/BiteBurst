import { useMemo, useState, useEffect } from 'react';

interface CurvySpineProps {
  progress: number;
  nodeCount: number;
}

export default function CurvySpine({ progress, nodeCount }: CurvySpineProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  const svgHeight = Math.max(600, nodeCount * 140 + 180);
  const svgWidth = 160;
  
  const spinePath = useMemo(() => {
    const startY = 60;
    const endY = svgHeight - 100;
    const centerX = svgWidth / 2;
    const amplitude = 140;
    
    const pathData = `
      M ${centerX} ${startY}
      C ${centerX + amplitude * 2.2} ${startY + 160} 
        ${centerX - amplitude * 1.6} ${startY + 320}
        ${centerX} ${startY + 480}
      C ${centerX + amplitude * 2} ${startY + 640}
        ${centerX - amplitude * 1.4} ${startY + 800}
        ${centerX} ${startY + 960}
      C ${centerX + amplitude * 1.8} ${startY + 1120}
        ${centerX - amplitude * 1.2} ${startY + 1280}
        ${centerX} ${endY}
    `;
    
    return pathData.trim();
  }, [svgHeight, svgWidth]);

  const pathLength = useMemo(() => {
    return svgHeight * 1.3;
  }, [svgHeight]);

  const progressOffset = pathLength * (1 - progress);

  return (
    <svg
      className="absolute pointer-events-none z-0"
      style={{ 
        left: 'calc(50% - 80px)',
        top: '80px',
        width: svgWidth,
        height: svgHeight 
      }}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
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
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <path
        d={spinePath}
        stroke="#d1d5db"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="opacity-40"
      />
      
      <path
        d={spinePath}
        stroke="#e5e7eb"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="opacity-80"
      />
      
      <path
        d={spinePath}
        stroke="url(#progressGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={pathLength}
        strokeDashoffset={progressOffset}
        className="transition-all duration-1000 ease-out"
        filter="url(#pathGlow)"
      />
      
      {!prefersReducedMotion && progress > 0 && [0, 1, 2].map(i => (
        <circle
          key={i}
          r="4"
          fill="#FFF"
          style={{
            offsetPath: `path('${spinePath}')`,
            offsetDistance: `${Math.max(0, (progress * 100) - (i * 15))}%`,
            filter: 'drop-shadow(0 0 4px rgba(255, 142, 60, 0.8))',
          }}
        >
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="1.5s"
            repeatCount="indefinite"
            begin={`${i}s`}
          />
        </circle>
      ))}
      
      {!prefersReducedMotion && progress > 0 && progress < 1 && (
        <circle
          r="6"
          fill="#FF6A00"
          style={{
            offsetPath: `path('${spinePath}')`,
            offsetDistance: `${progress * 100}%`,
          }}
        >
          <animate
            attributeName="r"
            values="5;8;5"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      
      {prefersReducedMotion && progress > 0 && progress < 1 && (
        <circle
          r="6"
          fill="#FF6A00"
          style={{
            offsetPath: `path('${spinePath}')`,
            offsetDistance: `${progress * 100}%`,
          }}
        />
      )}
    </svg>
  );
}

export function sampleSpinePoint(t: number, nodeCount: number): { x: number; y: number } {
  const svgHeight = Math.max(600, nodeCount * 140 + 180);
  const svgWidth = 160;
  const centerX = svgWidth / 2;
  const amplitude = 140;
  const startY = 60;
  
  if (t <= 0.33) {
    const localT = t / 0.33;
    const y = startY + localT * 480;
    const x = centerX + Math.sin(localT * Math.PI) * amplitude * 1.6;
    return { x, y };
  } else if (t <= 0.66) {
    const localT = (t - 0.33) / 0.33;
    const y = startY + 480 + localT * 480;
    const x = centerX - Math.sin(localT * Math.PI) * amplitude * 1.4;
    return { x, y };
  } else {
    const localT = (t - 0.66) / 0.34;
    const endY = svgHeight - 100;
    const y = startY + 960 + localT * (endY - (startY + 960));
    const x = centerX + Math.sin(localT * Math.PI) * amplitude * 1.2;
    return { x, y };
  }
}

import { useMemo } from 'react';

interface CurvySpineProps {
  progress: number; // 0-1, how far along the path progress should extend
  nodeCount: number; // Number of lessons to determine spine height
}

export default function CurvySpine({ progress, nodeCount }: CurvySpineProps) {
  // Calculate SVG height based on number of nodes - reduced spacing
  const svgHeight = Math.max(500, nodeCount * 120 + 150);
  const svgWidth = 120;
  
  // Create the S-curve path using cubic Bézier curves
  const spinePath = useMemo(() => {
    const startY = 60;
    const endY = svgHeight - 100;
    const centerX = svgWidth / 2;
    const amplitude = 100; // How far left/right the curve goes
    
    // Create S-curve that winds through multiple control points
    const pathData = `
      M ${centerX} ${startY}
      C ${centerX + amplitude * 2} ${startY + 140} 
        ${centerX - amplitude * 1.4} ${startY + 280}
        ${centerX} ${startY + 420}
      C ${centerX + amplitude * 1.8} ${startY + 560}
        ${centerX - amplitude * 1.2} ${startY + 700}
        ${centerX} ${startY + 840}
      C ${centerX + amplitude * 1.5} ${startY + 980}
        ${centerX - amplitude} ${startY + 1120}
        ${centerX} ${endY}
    `;
    
    return pathData.trim();
  }, [svgHeight, svgWidth]);

  // Calculate path length for progress animation
  const pathLength = useMemo(() => {
    // Approximate path length for strokeDasharray calculation
    // This is a rough calculation - in production you'd measure the actual path
    return svgHeight * 1.2;
  }, [svgHeight]);

  // Calculate stroke dash offset for progress animation
  const progressOffset = pathLength * (1 - progress);

  return (
    <svg
      className="absolute pointer-events-none z-0"
      style={{ 
        left: 'calc(50% - 60px)',
        top: '80px',
        width: svgWidth,
        height: svgHeight 
      }}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Base spine - light gray background */}
      <path
        d={spinePath}
        stroke="#e5e7eb"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="opacity-60"
      />
      
      {/* Progress spine - bright orange overlay */}
      <path
        d={spinePath}
        stroke="var(--bb-orange)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={pathLength}
        strokeDashoffset={progressOffset}
        className="opacity-80 transition-all duration-1000 ease-out"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(255, 122, 0, 0.3))'
        }}
      />
    </svg>
  );
}

// Helper function to sample points along the S-curve for node positioning
export function sampleSpinePoint(t: number, nodeCount: number): { x: number; y: number } {
  // t should be between 0 and 1, representing position along the curve
  const svgHeight = Math.max(500, nodeCount * 120 + 150);
  const svgWidth = 120;
  const centerX = svgWidth / 2;
  const amplitude = 100;
  const startY = 60;
  
  // Sample the cubic Bézier curve at parameter t
  // This approximates the curve defined in spinePath
  if (t <= 0.33) {
    // First curve segment
    const localT = t / 0.33;
    const y = startY + localT * 420;
    const x = centerX + Math.sin(localT * Math.PI) * amplitude * 1.4;
    return { x, y };
  } else if (t <= 0.66) {
    // Second curve segment  
    const localT = (t - 0.33) / 0.33;
    const y = startY + 420 + localT * 420;
    const x = centerX - Math.sin(localT * Math.PI) * amplitude * 1.2;
    return { x, y };
  } else {
    // Final curve segment
    const localT = (t - 0.66) / 0.34;
    const y = startY + 840 + localT * (svgHeight - 100 - (startY + 840));
    const x = centerX + Math.sin(localT * Math.PI) * amplitude;
    return { x, y };
  }
}
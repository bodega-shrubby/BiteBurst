import { useMemo } from 'react';
import { sampleSpinePoint } from './CurvySpine';

interface Decoration {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

const FOOD_EMOJIS = ['🍎', '🥕', '🥦', '🍇', '🍌', '🫐', '🍓', '🥬', '🍊', '🍋', '🥝', '🍑', '🥒', '🍒'];

interface PathDecorationsProps {
  nodeCount: number;
}

export default function PathDecorations({ nodeCount }: PathDecorationsProps) {
  const decorations = useMemo(() => {
    const items: Decoration[] = [];
    
    for (let i = 0; i < nodeCount - 1; i++) {
      const numDecorations = 2 + Math.floor(Math.random() * 2);
      
      for (let j = 0; j < numDecorations; j++) {
        const tStart = i / nodeCount;
        const tEnd = (i + 1) / nodeCount;
        const t = tStart + ((j + 0.5) / numDecorations) * (tEnd - tStart);
        
        const point = sampleSpinePoint(t, nodeCount);
        
        const offsetDirection = (i + j) % 2 === 0 ? 1 : -1;
        const offsetAmount = 50 + Math.random() * 40;
        
        items.push({
          id: i * 10 + j,
          emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
          x: point.x + (offsetDirection * offsetAmount),
          y: point.y,
          size: 20 + Math.random() * 12,
          opacity: 0.25 + Math.random() * 0.2,
          delay: Math.random() * 2,
        });
      }
    }
    
    return items;
  }, [nodeCount]);

  return (
    <div 
      className="absolute pointer-events-none z-0" 
      style={{ 
        left: 'calc(50% - 80px)',
        top: '80px',
      }}
      aria-hidden="true"
    >
      {decorations.map((dec) => (
        <div
          key={dec.id}
          className="absolute animate-float"
          style={{
            left: dec.x,
            top: dec.y,
            fontSize: dec.size,
            opacity: dec.opacity,
            animationDelay: `${dec.delay}s`,
            animationDuration: `${3 + Math.random()}s`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {dec.emoji}
        </div>
      ))}
    </div>
  );
}

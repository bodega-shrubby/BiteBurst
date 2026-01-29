import { useMemo } from 'react';

interface Point {
  x: number;
  y: number;
}

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
  nodePositions: Point[];
}

export default function PathDecorations({ nodePositions }: PathDecorationsProps) {
  const decorations = useMemo(() => {
    if (nodePositions.length < 2) return [];
    
    const items: Decoration[] = [];
    
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const curr = nodePositions[i];
      const next = nodePositions[i + 1];
      
      const midY = (curr.y + next.y) / 2;
      const midX = (curr.x + next.x) / 2;
      
      const offsetX = curr.x < next.x ? -45 : 45;
      
      items.push({
        id: i,
        emoji: FOOD_EMOJIS[i % FOOD_EMOJIS.length],
        x: midX + offsetX + (Math.random() * 20 - 10),
        y: midY + (Math.random() * 20 - 10),
        size: 22 + Math.random() * 8,
        opacity: 0.3 + Math.random() * 0.15,
        delay: i * 0.2,
      });
    }
    
    return items;
  }, [nodePositions]);

  if (decorations.length === 0) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0" 
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

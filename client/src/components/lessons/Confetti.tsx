import { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  color: string;
  shape: string;
  velocity: { x: number; y: number };
  spiralOffset: number;
}

const FRUIT_EMOJIS = ['🍎', '🥕', '🍌', '🥦', '🍇', '⭐', '✨', '🍊', '🫐', '🍓'];
const BRAND_COLORS = ['#FF6B6B', '#FF8E3C', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#FF6B9D'];

export default function Confetti({ show, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    if (!show) {
      setPieces([]);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      onComplete?.();
      return;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 3;
    
    const newPieces: ConfettiPiece[] = Array.from({ length: 70 }, (_, i) => {
      const angle = (i / 70) * Math.PI * 2;
      const speed = 5 + Math.random() * 8;
      const isEmoji = Math.random() > 0.4;
      
      return {
        id: i,
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 40,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        scale: isEmoji ? 0.7 + Math.random() * 0.6 : 0.4 + Math.random() * 0.4,
        color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
        shape: isEmoji 
          ? FRUIT_EMOJIS[Math.floor(Math.random() * FRUIT_EMOJIS.length)]
          : ['●', '★', '♦', '✦'][Math.floor(Math.random() * 4)],
        velocity: {
          x: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
          y: Math.sin(angle) * speed - 5 - Math.random() * 5,
        },
        spiralOffset: Math.random() * Math.PI * 2,
      };
    });
    
    setPieces(newPieces);
    
    let frame = 0;
    const gravity = 0.15;
    const friction = 0.99;
    
    const animate = () => {
      frame++;
      
      setPieces(prev => prev.map(piece => {
        const spiral = Math.sin(frame * 0.05 + piece.spiralOffset) * 0.5;
        
        return {
          ...piece,
          x: piece.x + piece.velocity.x + spiral,
          y: piece.y + piece.velocity.y,
          rotation: piece.rotation + piece.rotationSpeed,
          velocity: {
            x: piece.velocity.x * friction,
            y: piece.velocity.y + gravity,
          },
        };
      }));
      
      if (frame < 180) {
        requestAnimationFrame(animate);
      } else {
        setPieces([]);
        onComplete?.();
      }
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [show, onComplete]);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute will-change-transform"
          style={{
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            color: piece.color,
            fontSize: '24px',
            textShadow: piece.shape.length > 1 ? 'none' : `0 2px 4px ${piece.color}40`,
          }}
        >
          {piece.shape}
        </div>
      ))}
    </div>
  );
}

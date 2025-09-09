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
  scale: number;
  color: string;
  velocityX: number;
  velocityY: number;
  emoji: string;
}

const confettiEmojis = ['🎉', '🎊', '⭐', '✨', '🏆', '🎯', '💫'];
const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

export default function Confetti({ show, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!show) {
      setPieces([]);
      return;
    }

    // Generate confetti pieces
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -50,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.8 + 0.5,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * 3 + 2,
        emoji: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)]
      });
    }
    setPieces(newPieces);

    // Animation loop
    let animationId: number;
    const animate = () => {
      setPieces(prev => 
        prev.map(piece => ({
          ...piece,
          x: piece.x + piece.velocityX,
          y: piece.y + piece.velocityY,
          rotation: piece.rotation + 2,
          velocityY: piece.velocityY + 0.1 // Gravity
        })).filter(piece => piece.y < window.innerHeight + 100)
      );
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Auto cleanup after 4 seconds
    const cleanup = setTimeout(() => {
      cancelAnimationFrame(animationId);
      setPieces([]);
      onComplete?.();
    }, 4000);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(cleanup);
    };
  }, [show, onComplete]);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute text-2xl select-none"
          style={{
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            color: piece.color,
            fontSize: Math.random() > 0.5 ? '20px' : '16px',
            transition: 'none'
          }}
        >
          {piece.emoji}
        </div>
      ))}
    </div>
  );
}
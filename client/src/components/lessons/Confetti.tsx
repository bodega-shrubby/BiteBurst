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
  shape: string;
}

export default function Confetti({ show, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    if (!show) {
      setPieces([]);
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Just show a simple fade effect instead of confetti
      onComplete?.();
      return;
    }

    // Generate confetti pieces
    const colors = ['#FF6A00', '#FFB800', '#00B8FF', '#00FF88', '#FF4081'];
    const shapes = ['●', '▲', '■', '★', '♦'];
    
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.8 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    }));
    
    setPieces(newPieces);
    
    // Auto cleanup after animation
    const timeout = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [show, onComplete]);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            color: piece.color,
            fontSize: '20px',
            animationDuration: `${Math.random() * 2 + 2}s`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationFillMode: 'forwards'
          }}
        >
          {piece.shape}
        </div>
      ))}
    </div>
  );
}
import { useState } from 'react';

interface FloatingMascotProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'left' | 'right' | 'center';
  className?: string;
  onClick?: () => void;
  showSpeechBubble?: boolean;
  speechText?: string;
}

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-48 h-48',
  xl: 'w-64 h-64',
};

export default function FloatingMascot({
  src,
  alt,
  size = 'lg',
  className = '',
  onClick,
  showSpeechBubble = false,
  speechText = '',
}: FloatingMascotProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showSpeechBubble && speechText && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl px-4 py-2 shadow-lg border border-gray-200 whitespace-nowrap z-10 animate-bubble-appear">
          <p className="text-sm font-medium text-gray-800">{speechText}</p>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45" />
        </div>
      )}

      <div
        className={`
          ${sizeClasses[size]}
          animate-mascot-float
          cursor-pointer
          transition-transform duration-300
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}
        onClick={onClick}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </div>

      <div
        className={`
          absolute bottom-0 left-1/2 transform -translate-x-1/2
          bg-black/10 rounded-full blur-md
          animate-shadow-float
          ${size === 'xl' ? 'w-32 h-4' : size === 'lg' ? 'w-24 h-3' : 'w-16 h-2'}
        `}
      />
    </div>
  );
}

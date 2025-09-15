interface CharacterAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CharacterAvatar({ size = 'lg', className = '' }: CharacterAvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24', 
    lg: 'w-40 h-40'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full"
        data-testid="character-avatar"
      >
        {/* Background circle */}
        <circle cx="80" cy="80" r="78" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2"/>
        
        {/* Character body/shoulders */}
        <path 
          d="M30 140 Q30 120 50 120 L110 120 Q130 120 130 140 L130 160 L30 160 Z" 
          fill="#A855F7"
        />
        
        {/* Head/face */}
        <circle cx="80" cy="65" r="35" fill="#FFD1A1"/>
        
        {/* Hair */}
        <path 
          d="M45 45 Q45 25 65 25 L95 25 Q115 25 115 45 L115 65 Q115 75 105 75 L55 75 Q45 75 45 65 Z" 
          fill="#1F2937"
        />
        
        {/* Hair strands for texture */}
        <path 
          d="M50 30 Q60 28 70 30 Q80 28 90 30 Q100 28 110 30" 
          stroke="#374151" 
          strokeWidth="2" 
          fill="none"
        />
        
        {/* Eyes */}
        <circle cx="70" cy="60" r="4" fill="white"/>
        <circle cx="90" cy="60" r="4" fill="white"/>
        <circle cx="70" cy="60" r="2" fill="#1F2937"/>
        <circle cx="90" cy="60" r="2" fill="#1F2937"/>
        
        {/* Eyebrows */}
        <path d="M65 52 Q70 50 75 52" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
        <path d="M85 52 Q90 50 95 52" stroke="#1F2937" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Nose */}
        <circle cx="80" cy="68" r="1" fill="#FFB380"/>
        
        {/* Mouth */}
        <path d="M75 75 Q80 78 85 75" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none"/>
        
        {/* Neck */}
        <rect x="75" y="95" width="10" height="15" fill="#FFD1A1"/>
      </svg>
    </div>
  );
}
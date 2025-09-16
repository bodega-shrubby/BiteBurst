import { useState } from 'react';

export interface QuizOption {
  id: string;
  emoji: string;
  text: string;
  isCorrect: boolean;
}

interface QuizPillsProps {
  prompt: string;
  options: QuizOption[];
  onAnswer: (optionId: string, isCorrect: boolean) => void;
  disabled?: boolean;
}

export default function QuizPills({ 
  prompt, 
  options, 
  onAnswer, 
  disabled = false 
}: QuizPillsProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleOptionClick = (option: QuizOption) => {
    if (disabled || selectedOption) return;
    
    setSelectedOption(option.id);
    
    if (option.isCorrect) {
      setFeedback('correct');
      // Show correct feedback and callback
      setTimeout(() => onAnswer(option.id, true), 300);
    } else {
      setFeedback('incorrect');
      // Show shake animation and hint
      setTimeout(() => onAnswer(option.id, false), 600);
    }
  };

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {prompt}
        </h2>
        <p className="text-sm text-gray-600">
          Tap the best answer
        </p>
      </div>
      
      {/* Options */}
      <div 
        role="radiogroup" 
        aria-label="Quiz options"
        className="space-y-3"
      >
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          const showCorrect = isSelected && feedback === 'correct';
          const showIncorrect = isSelected && feedback === 'incorrect';
          
          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              disabled={disabled || !!selectedOption}
              role="radio"
              aria-checked={isSelected}
              aria-describedby={isSelected ? `feedback-${option.id}` : undefined}
              className={`
                w-full p-4 rounded-2xl border-2 font-medium text-left
                transition-all duration-300 transform
                flex items-center space-x-3
                ${!selectedOption && !disabled
                  ? 'hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:scale-95'
                  : ''
                }
                ${showCorrect 
                  ? 'bg-green-100 border-green-400 text-green-800' 
                  : showIncorrect
                  ? 'bg-red-100 border-red-400 text-red-800 animate-shake'
                  : isSelected
                  ? 'bg-gray-100 border-gray-400'
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }
                ${disabled || selectedOption ? 'cursor-default' : 'cursor-pointer'}
              `}
              style={{ minHeight: '60px' }}
            >
              <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
                {option.emoji}
              </span>
              <span className="flex-1 text-base">
                {option.text}
              </span>
              
              {/* Visual feedback indicators */}
              {showCorrect && (
                <span className="flex-shrink-0 text-green-600" aria-hidden="true">
                  ✓
                </span>
              )}
              {showIncorrect && (
                <span className="flex-shrink-0 text-red-600" aria-hidden="true">
                  ✗
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Feedback messages */}
      {feedback === 'incorrect' && (
        <div 
          id={`feedback-${selectedOption}`}
          className="text-center text-sm text-red-600 animate-in fade-in duration-300"
          role="alert"
          aria-live="polite"
        >
          Try one with fiber and natural energy!
        </div>
      )}
    </div>
  );
}
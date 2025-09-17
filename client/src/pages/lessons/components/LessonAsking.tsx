import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import captainCarrotImage from '@assets/Mascots/CaptainCarrot.png';

interface LessonStep {
  id: string;
  stepNumber: number;
  questionType: 'multiple-choice' | 'true-false' | 'matching';
  question: string;
  content: {
    options?: Array<{ id: string; text: string; emoji?: string; correct?: boolean }>;
    correctAnswer?: string | boolean;
    feedback?: string;
    matchingPairs?: Array<{ left: string; right: string }>;
  };
  xpReward: number;
  mascotAction?: string;
}

interface LessonAskingProps {
  step: LessonStep;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onCheck: () => void;
  isSubmitting: boolean;
  canCheck: boolean;
}

export default function LessonAsking({
  step,
  selectedAnswer,
  onAnswerSelect,
  onCheck,
  isSubmitting,
  canCheck
}: LessonAskingProps) {
  // Matching game state
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  
  // Auto-update answer when matching is complete
  useEffect(() => {
    if (step.questionType === 'matching' && step.content.matchingPairs) {
      const pairs = step.content.matchingPairs;
      const allMatched = Object.keys(matches).length === pairs.length;
      const correctMatches = pairs.every(pair => matches[pair.left] === pair.right);
      
      if (allMatched && correctMatches && selectedAnswer !== 'matching-complete') {
        onAnswerSelect('matching-complete');
      } else if ((!allMatched || !correctMatches) && selectedAnswer === 'matching-complete') {
        onAnswerSelect('');
      }
    }
  }, [matches, step.questionType, step.content.matchingPairs, selectedAnswer, onAnswerSelect]);
  
  const renderMultipleChoice = () => {
    if (!step.content.options) return null;
    
    return (
      <div className="space-y-3">
        {step.content.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswerSelect(option.id)}
            disabled={isSubmitting}
            className={`
              w-full p-4 rounded-2xl border-2 text-left transition-all duration-200
              ${selectedAnswer === option.id
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-25'
              }
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            data-testid={`option-${option.id}`}
          >
            <div className="flex items-center space-x-3">
              {option.emoji && (
                <span className="text-2xl" role="img" aria-hidden="true">
                  {option.emoji}
                </span>
              )}
              <span className="text-lg font-medium text-gray-900">
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderTrueFalse = () => {
    const options = [
      { id: 'true', text: 'True', emoji: '✅' },
      { id: 'false', text: 'False', emoji: '❌' }
    ];

    return (
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswerSelect(option.id)}
            disabled={isSubmitting}
            className={`
              w-full p-4 rounded-2xl border-2 text-left transition-all duration-200
              ${selectedAnswer === option.id
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-25'
              }
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            data-testid={`option-${option.id}`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl" role="img" aria-hidden="true">
                {option.emoji}
              </span>
              <span className="text-lg font-medium text-gray-900">
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderMatching = () => {
    if (!step.content.matchingPairs) return null;
    
    const pairs = step.content.matchingPairs;
    const leftItems = pairs.map(p => p.left);
    const rightItems = pairs.map(p => p.right);
    
    // Check if all matches are complete and correct
    const allMatched = Object.keys(matches).length === pairs.length;
    const correctMatches = pairs.every(pair => matches[pair.left] === pair.right);
    
    const handleDragStart = (e: React.DragEvent, item: string) => {
      setDraggedItem(item);
      e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };
    
    const handleDrop = (e: React.DragEvent, targetZone: string) => {
      e.preventDefault();
      if (draggedItem) {
        setMatches(prev => ({
          ...prev,
          [draggedItem]: targetZone
        }));
        setDraggedItem(null);
      }
    };
    
    const handleRemoveMatch = (leftItem: string) => {
      setMatches(prev => {
        const newMatches = { ...prev };
        delete newMatches[leftItem];
        return newMatches;
      });
    };
    
    return (
      <div className="space-y-6">
        {/* Instructions */}
        <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          Drag each food to match it with its benefit!
        </div>
        
        {/* Draggable Food Items */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 text-center">Foods:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {leftItems.map((item) => (
              <div
                key={item}
                draggable={!matches[item]}
                onDragStart={(e) => handleDragStart(e, item)}
                className={`
                  p-3 rounded-xl border-2 cursor-move transition-all
                  ${matches[item] 
                    ? 'bg-green-100 border-green-300 opacity-60' 
                    : 'bg-white border-orange-200 hover:border-orange-400 hover:shadow-md'
                  }
                  ${draggedItem === item ? 'opacity-50' : ''}
                `}
                data-testid={`drag-item-${item.replace(/[^a-zA-Z0-9]/g, '-')}`}
              >
                <span className="text-sm font-medium">{item}</span>
                {matches[item] && (
                  <button
                    onClick={() => handleRemoveMatch(item)}
                    className="ml-2 text-xs text-red-500 hover:text-red-700"
                    data-testid={`remove-match-${item.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Drop Zones */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 text-center">Benefits:</h3>
          <div className="space-y-2">
            {rightItems.map((zone) => {
              const matchedFood = Object.keys(matches).find(food => matches[food] === zone);
              return (
                <div
                  key={zone}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, zone)}
                  className={`
                    p-4 rounded-xl border-2 border-dashed min-h-[60px] 
                    flex items-center justify-center text-center transition-all
                    ${matchedFood 
                      ? 'bg-green-50 border-green-400 border-solid' 
                      : 'bg-gray-50 border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                    }
                  `}
                  data-testid={`drop-zone-${zone.replace(/[^a-zA-Z0-9]/g, '-')}`}
                >
                  {matchedFood ? (
                    <div className="text-sm">
                      <div className="font-medium text-green-800">{matchedFood}</div>
                      <div className="text-green-600">→ {zone}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">{zone}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="text-center text-sm text-gray-600">
          {Object.keys(matches).length} of {pairs.length} matched
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Captain Carrot Mascot */}
      <div className="flex justify-center">
        <img 
          src={captainCarrotImage} 
          alt="Captain Carrot Mascot" 
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* Question */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          {step.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {step.questionType === 'multiple-choice' && renderMultipleChoice()}
        {step.questionType === 'true-false' && renderTrueFalse()}
        {step.questionType === 'matching' && renderMatching()}
      </div>

      {/* Check Button */}
      <div className="pt-4">
        <Button
          onClick={onCheck}
          disabled={!canCheck || isSubmitting}
          className={`
            w-full h-12 text-base font-bold uppercase tracking-wider
            ${canCheck && !isSubmitting
              ? 'bg-[#FF6A00] hover:bg-[#E55A00] text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          data-testid="check-button"
        >
          {isSubmitting ? 'Checking...' : 'Check'}
        </Button>
      </div>
    </div>
  );
}
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import captainCarrotImage from '@assets/Mascots/CaptainCarrot.png';
import brainyBoltImage from '@assets/Mascots/BrainyBolt.png';
import oniTheOrangeImage from '@assets/Mascots/Oni_the_orange.png';
import oniCelebrateImage from '@assets/Mascots/Oni_celebrate.png';
import oniHintImage from '@assets/Mascots/Oni_hint.png';
import oniOopsImage from '@assets/Mascots/Oni_oops.png';
import oniProudImage from '@assets/Mascots/Oni_proud.png';
import oniGrooveImage from '@assets/Mascots/Oni_groove.png';
import oniLoveImage from '@assets/Mascots/Oni_love.png';
import oniSadImage from '@assets/Mascots/Oni_sad.png';

interface LessonStep {
  id: string;
  stepNumber: number;
  questionType: 'multiple-choice' | 'true-false' | 'matching' | 'label-reading' | 'ordering' | 'tap-pair' | 'fill-blank';
  question: string;
  content: {
    options?: Array<{ id: string; text: string; emoji?: string; correct?: boolean }>;
    correctAnswer?: string | boolean;
    correctPair?: string[];
    feedback?: string | { success?: string; hint_after_2?: string; motivating_fail?: string };
    matchingPairs?: Array<{ left: string; right: string }>;
    labelOptions?: Array<{ id: string; name: string; sugar: string; fiber: string; protein: string; correct?: boolean }>;
    orderingItems?: Array<{ id: string; text: string; correctOrder: number }>;
  };
  xpReward: number;
  mascotAction?: string;
}

// Map mascot action strings to images
const getMascotImage = (mascotAction?: string, lessonId?: string): string => {
  if (mascotAction) {
    switch (mascotAction) {
      case 'oni_celebrate': return oniCelebrateImage;
      case 'oni_groove': return oniGrooveImage;
      case 'oni_hint': return oniHintImage;
      case 'oni_love': return oniLoveImage;
      case 'oni_oops': return oniOopsImage;
      case 'oni_proud': return oniProudImage;
      case 'oni_sad': return oniSadImage;
      default: break;
    }
  }
  // Fallback to legacy mascots or default Oni
  if (lessonId === 'brainfuel-for-school') return brainyBoltImage;
  if (lessonId === 'fuel-for-football') return captainCarrotImage;
  return oniTheOrangeImage;
};

interface BannerProps {
  variant: 'tryAgain';
  text: string;
}

interface LessonAskingProps {
  step: LessonStep;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onCheck: () => void;
  isSubmitting: boolean;
  canCheck: boolean;
  banner?: BannerProps;
  lessonId?: string;
}

export default function LessonAsking({
  step,
  selectedAnswer,
  onAnswerSelect,
  onCheck,
  isSubmitting,
  canCheck,
  banner,
  lessonId
}: LessonAskingProps) {
  // DEBUG: Log received banner prop
  console.log('DEBUG LessonAsking - received banner prop:', banner);
  
  // Matching game state
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [shuffledLeftItems, setShuffledLeftItems] = useState<string[]>([]);
  const [shuffledRightItems, setShuffledRightItems] = useState<string[]>([]);
  
  // Ordering game state
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [draggedOrderItem, setDraggedOrderItem] = useState<string | null>(null);
  
  // Mobile touch support state
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedOrderItem, setSelectedOrderItem] = useState<string | null>(null);
  
  // Auto-update answer when matching slots are filled (send real data for backend validation)
  useEffect(() => {
    if (step.questionType === 'matching' && step.content.matchingPairs) {
      const pairs = step.content.matchingPairs;
      const allMatched = Object.keys(matches).length === pairs.length;
      
      if (allMatched) {
        // Always send actual matches data, let backend validate correctness
        const matchesJson = JSON.stringify(matches);
        if (selectedAnswer !== matchesJson) {
          onAnswerSelect(matchesJson);
        }
      } else {
        // Not all slots filled - clear selection
        if (selectedAnswer && selectedAnswer.startsWith('{')) {
          onAnswerSelect('');
        }
      }
    }
  }, [matches, step.questionType, step.content.matchingPairs, selectedAnswer, onAnswerSelect]);
  
  // Initialize shuffled matching items on step change
  useEffect(() => {
    if (step.questionType === 'matching' && step.content.matchingPairs) {
      const pairs = step.content.matchingPairs;
      
      // Fisher-Yates shuffle for left items
      const leftItems = [...pairs.map(p => p.left)];
      for (let i = leftItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [leftItems[i], leftItems[j]] = [leftItems[j], leftItems[i]];
      }
      
      // Fisher-Yates shuffle for right items  
      const rightItems = [...pairs.map(p => p.right)];
      for (let i = rightItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rightItems[i], rightItems[j]] = [rightItems[j], rightItems[i]];
      }
      
      setShuffledLeftItems(leftItems);
      setShuffledRightItems(rightItems);
      setMatches({}); // Clear any previous matches
      onAnswerSelect(''); // Clear any previous answer
    }
  }, [step.id, step.questionType]);
  
  // Initialize shuffled ordering items on step change
  useEffect(() => {
    if (step.questionType === 'ordering' && step.content.orderingItems) {
      const items = step.content.orderingItems;
      // Fisher-Yates shuffle
      const shuffledIds = [...items.map(item => item.id)];
      for (let i = shuffledIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
      }
      setOrderedItems(shuffledIds);
      onAnswerSelect(''); // Clear any previous answer
    }
  }, [step.id, step.questionType]);
  
  // Auto-update answer when all ordering items are placed (send real data for backend validation)
  useEffect(() => {
    if (step.questionType === 'ordering' && step.content.orderingItems && orderedItems.length > 0) {
      const items = step.content.orderingItems;
      const allPlaced = orderedItems.length === items.length;
      
      if (allPlaced) {
        // Always send actual order data, let backend validate correctness
        const orderJson = JSON.stringify(orderedItems);
        if (selectedAnswer !== orderJson) {
          onAnswerSelect(orderJson);
        }
      } else {
        // Not all items placed - clear selection
        if (selectedAnswer && selectedAnswer.startsWith('[')) {
          onAnswerSelect('');
        }
      }
    }
  }, [orderedItems, step.questionType, step.content.orderingItems, selectedAnswer, onAnswerSelect]);
  
  // Reset mobile touch selections on step change to prevent state leakage
  useEffect(() => {
    setSelectedItem(null);
    setSelectedOrderItem(null);
  }, [step.id]);
  
  // Note: Answer selection moved to handleOrderDrop to prevent render loops
  
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
    // Use shuffled arrays instead of direct mapping
    const leftItems = shuffledLeftItems.length > 0 ? shuffledLeftItems : pairs.map(p => p.left);
    const rightItems = shuffledRightItems.length > 0 ? shuffledRightItems : pairs.map(p => p.right);
    
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
    
    // Mobile touch handlers for matching
    const handleItemTouch = (item: string) => {
      if (matches[item]) return; // Already matched
      
      if (selectedItem === item) {
        // Deselect if same item touched again
        setSelectedItem(null);
      } else {
        // Select this item
        setSelectedItem(item);
      }
    };
    
    const handleZoneTouch = (zone: string) => {
      // Safety check: only match if selectedItem exists and is in current leftItems
      if (selectedItem && !matches[selectedItem] && leftItems.includes(selectedItem)) {
        // Match selected item to this zone
        setMatches(prev => ({ ...prev, [selectedItem]: zone }));
        setSelectedItem(null);
      }
    };
    
    return (
      <div className="space-y-6">
        {/* Instructions */}
        <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          Drag or tap each food, then tap its benefit!
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
                onClick={() => handleItemTouch(item)}
                className={`
                  p-3 rounded-xl border-2 transition-all
                  ${matches[item] 
                    ? 'bg-green-100 border-green-300 opacity-60' 
                    : selectedItem === item
                      ? 'bg-blue-100 border-blue-400 shadow-lg cursor-pointer'
                      : 'bg-white border-orange-200 hover:border-orange-400 hover:shadow-md cursor-pointer md:cursor-move'
                  }
                  ${draggedItem === item ? 'opacity-50' : ''}
                `}
                data-testid={`drag-item-${item.replace(/[^a-zA-Z0-9]/g, '-')}`}
              >
                <span className="text-sm font-medium">{item}</span>
                {selectedItem === item && !matches[item] && (
                  <span className="ml-2 text-xs text-blue-600 font-medium">Selected - tap a benefit!</span>
                )}
                {matches[item] && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMatch(item);
                    }}
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
                  onClick={() => handleZoneTouch(zone)}
                  className={`
                    p-4 rounded-xl border-2 border-dashed min-h-[60px] 
                    flex items-center justify-center text-center transition-all
                    ${matchedFood 
                      ? 'bg-green-50 border-green-400 border-solid' 
                      : selectedItem && !matchedFood
                        ? 'bg-blue-50 border-blue-400 hover:bg-blue-100 cursor-pointer'
                        : 'bg-gray-50 border-gray-300 hover:border-orange-400 hover:bg-orange-50 cursor-pointer'
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
        <div className="text-center text-sm">
          {allMatched && correctMatches ? (
            <div className="text-green-600 font-medium">✅ All matches correct!</div>
          ) : allMatched && !correctMatches ? (
            <div className="text-red-600 font-medium">❌ Some matches are wrong - try again!</div>
          ) : (
            <div className="text-gray-600">{Object.keys(matches).length} of {pairs.length} matched</div>
          )}
        </div>
      </div>
    );
  };
  
  const renderLabelReading = () => {
    if (!step.content.labelOptions) return null;
    
    return (
      <div className="space-y-4">
        {/* Instructions */}
        <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          Compare the nutrition labels and choose the better option!
        </div>
        
        {/* Label Options */}
        <div className="space-y-3">
          {step.content.labelOptions.map((label) => (
            <button
              key={label.id}
              onClick={() => onAnswerSelect(label.id)}
              disabled={isSubmitting}
              className={`
                w-full p-4 rounded-2xl border-2 text-left transition-all duration-200
                ${selectedAnswer === label.id
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-25'
                }
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              data-testid={`label-option-${label.id}`}
            >
              <div className="space-y-2">
                <div className="font-bold text-lg text-gray-900">{label.name}</div>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Sugar:</span>
                    <span className="font-medium">{label.sugar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fiber:</span>
                    <span className="font-medium">{label.fiber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein:</span>
                    <span className="font-medium">{label.protein}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  const renderOrdering = () => {
    if (!step.content.orderingItems) return null;
    
    const items = step.content.orderingItems;
    
    // Items are now initialized via useEffect with shuffling
    
    const handleOrderDragStart = (e: React.DragEvent, itemId: string) => {
      setDraggedOrderItem(itemId);
      e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleOrderDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };
    
    const handleOrderDrop = (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      if (draggedOrderItem) {
        const draggedIndex = orderedItems.indexOf(draggedOrderItem);
        const newOrder = [...orderedItems];
        
        // Remove item from current position
        newOrder.splice(draggedIndex, 1);
        // Insert at new position
        newOrder.splice(targetIndex, 0, draggedOrderItem);
        
        setOrderedItems(newOrder);
        setDraggedOrderItem(null);
        // Don't auto-select answer here - let the useEffect handle validation
      }
    };
    
    // Mobile touch handlers for ordering
    const handleOrderItemTouch = (itemId: string) => {
      if (selectedOrderItem === itemId) {
        // Deselect if same item touched again
        setSelectedOrderItem(null);
      } else {
        // Select this item
        setSelectedOrderItem(itemId);
      }
    };
    
    const handleOrderPositionTouch = (targetIndex: number) => {
      if (selectedOrderItem) {
        const draggedIndex = orderedItems.indexOf(selectedOrderItem);
        // Safety check: only proceed if item exists in current order
        if (draggedIndex === -1) return;
        
        const newOrder = [...orderedItems];
        
        // Remove item from current position
        newOrder.splice(draggedIndex, 1);
        // Insert at new position
        newOrder.splice(targetIndex, 0, selectedOrderItem);
        
        setOrderedItems(newOrder);
        setSelectedOrderItem(null);
      }
    };
    
    return (
      <div className="space-y-4">
        {/* Instructions */}
        <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          Drag or tap items to put them in the correct order!
        </div>
        
        {/* Ordering List */}
        <div className="space-y-2">
          {orderedItems.map((itemId, index) => {
            const item = items.find(i => i.id === itemId);
            if (!item) return null;
            
            const isCorrectPosition = item.correctOrder === index + 1;
            
            return (
              <div
                key={itemId}
                draggable
                onDragStart={(e) => handleOrderDragStart(e, itemId)}
                onDragOver={handleOrderDragOver}
                onDrop={(e) => handleOrderDrop(e, index)}
                onClick={() => {
                  if (selectedOrderItem && selectedOrderItem !== itemId) {
                    handleOrderPositionTouch(index);
                  } else {
                    handleOrderItemTouch(itemId);
                  }
                }}
                className={`
                  p-4 rounded-xl border-2 transition-all cursor-pointer md:cursor-move
                  ${draggedOrderItem === itemId ? 'opacity-50' : ''}
                  ${selectedOrderItem === itemId ? 'bg-blue-100 border-blue-400 shadow-lg' : ''}
                  ${selectedOrderItem && selectedOrderItem !== itemId ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100' : ''}
                  ${isCorrectPosition && orderedItems.length === items.length
                    ? 'bg-green-50 border-green-300'
                    : selectedOrderItem === itemId || (selectedOrderItem && selectedOrderItem !== itemId)
                      ? '' : 'bg-white border-gray-200 hover:border-orange-200'
                  }
                `}
                data-testid={`order-item-${itemId}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.text}</span>
                  {selectedOrderItem === itemId && (
                    <span className="text-xs text-blue-600 font-medium ml-auto">Selected - tap position!</span>
                  )}
                  {selectedOrderItem && selectedOrderItem !== itemId && (
                    <span className="text-xs text-yellow-600 font-medium ml-auto">Tap to move here</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress Indicator */}
        <div className="text-center text-sm">
          {(() => {
            const allPlaced = orderedItems.length === items.length;
            const allCorrect = orderedItems.every((itemId, index) => {
              const item = items.find(i => i.id === itemId);
              return item && item.correctOrder === index + 1;
            });
            
            if (allPlaced && allCorrect) {
              return <div className="text-green-600 font-medium">✅ Perfect order!</div>;
            } else if (allPlaced && !allCorrect) {
              return <div className="text-red-600 font-medium">❌ Wrong order - try rearranging!</div>;
            } else {
              return <div className="text-gray-600">Keep arranging...</div>;
            }
          })()} 
        </div>
      </div>
    );
  };

  // Render tap-pair question type - select 2 matching items from options
  const renderTapPair = () => {
    if (!step.content.options) return null;
    
    // Track which items are selected (up to 2) - stored as JSON array
    let selectedItems: string[] = [];
    try {
      if (selectedAnswer && selectedAnswer.startsWith('[')) {
        selectedItems = JSON.parse(selectedAnswer);
      }
    } catch (e) {
      selectedItems = [];
    }
    
    const handleItemTap = (itemId: string) => {
      if (isSubmitting) return;
      
      if (selectedItems.includes(itemId)) {
        // Deselect if already selected
        const newItems = selectedItems.filter(id => id !== itemId);
        onAnswerSelect(JSON.stringify(newItems));
      } else if (selectedItems.length < 2) {
        // Add to selection (max 2)
        const newItems = [...selectedItems, itemId];
        onAnswerSelect(JSON.stringify(newItems));
      } else {
        // Replace the first selection
        const newItems = [selectedItems[1], itemId];
        onAnswerSelect(JSON.stringify(newItems));
      }
    };
    
    return (
      <div className="space-y-4">
        <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          Tap 2 items that go together!
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {step.content.options.map((option) => {
            const isSelected = selectedItems.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => handleItemTap(option.id)}
                disabled={isSubmitting}
                className={`
                  p-4 rounded-2xl border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-orange-400 bg-orange-50 ring-2 ring-orange-200'
                    : 'border-gray-200 bg-white hover:border-orange-200'
                  }
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                `}
                data-testid={`option-${option.id}`}
              >
                <div className="flex flex-col items-center space-y-2">
                  {option.emoji && (
                    <span className="text-3xl" role="img" aria-hidden="true">
                      {option.emoji}
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-900 text-center">
                    {option.text}
                  </span>
                  {isSelected && (
                    <span className="text-xs text-orange-600 font-bold">Selected ✓</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="text-center text-sm text-gray-500">
          {(!selectedAnswer || selectedItems.length === 0) && "Tap the first item"}
          {selectedItems.length === 1 && "Now tap the matching item"}
          {selectedItems.length >= 2 && "Ready to check!"}
        </div>
      </div>
    );
  };

  // Render fill-blank question type - select word to complete sentence
  const renderFillBlank = () => {
    if (!step.content.options) return null;
    
    return (
      <div className="space-y-4">
        {/* Show the question with blank indicator */}
        <div className="bg-gray-50 p-4 rounded-xl text-center">
          <p className="text-lg text-gray-800 leading-relaxed">
            {step.question.includes('______') 
              ? step.question.replace('______', selectedAnswer ? `[${step.content.options.find(o => o.id === selectedAnswer)?.text || '___'}]` : '______')
              : step.question
            }
          </p>
        </div>
        
        <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          Choose the word that fits!
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {step.content.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswerSelect(option.id)}
              disabled={isSubmitting}
              className={`
                px-6 py-3 rounded-full border-2 transition-all duration-200
                ${selectedAnswer === option.id
                  ? 'border-orange-400 bg-orange-50 ring-2 ring-orange-200'
                  : 'border-gray-200 bg-white hover:border-orange-200'
                }
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
              `}
              data-testid={`option-${option.id}`}
            >
              <span className="text-base font-medium text-gray-900">
                {option.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Try Again Banner */}
      {banner && banner.variant === 'tryAgain' && (
        <div 
          className="p-4 rounded-2xl border border-red-200"
          style={{ backgroundColor: '#FDEBEC' }}
          role="alert"
          aria-live="assertive"
          data-testid="try-again-banner"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle 
              className="w-5 h-5 mt-0.5 flex-shrink-0" 
              style={{ color: '#9B1C1C' }} 
              aria-hidden="true" 
            />
            <div className="flex-1">
              <p 
                className="font-medium text-sm leading-relaxed" 
                style={{ color: '#9B1C1C' }}
              >
                {banner.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mascot - dynamic based on mascotAction or lesson */}
      <div className="flex justify-center">
        <img 
          src={getMascotImage(step.mascotAction, lessonId)} 
          alt="Lesson Mascot" 
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
        {step.questionType === 'label-reading' && renderLabelReading()}
        {step.questionType === 'ordering' && renderOrdering()}
        {step.questionType === 'tap-pair' && renderTapPair()}
        {step.questionType === 'fill-blank' && renderFillBlank()}
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
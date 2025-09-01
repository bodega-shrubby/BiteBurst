import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeft, Camera, MessageSquare, Smile } from 'lucide-react';
import mascotImage from '@assets/9ef8e8fe-158e-4518-bd1c-1325863aebca_1756365757940.png';

interface EmojiItem {
  emoji: string;
  label: string;
  category: string;
}

const EMOJI_CATALOG: EmojiItem[] = [
  // Fruits
  { emoji: '🍎', label: 'Apple', category: 'fruits' },
  { emoji: '🍌', label: 'Banana', category: 'fruits' },
  { emoji: '🍇', label: 'Grapes', category: 'fruits' },
  { emoji: '🍓', label: 'Strawberry', category: 'fruits' },
  { emoji: '🍊', label: 'Orange', category: 'fruits' },
  { emoji: '🫐', label: 'Blueberries', category: 'fruits' },
  { emoji: '🍉', label: 'Watermelon', category: 'fruits' },
  { emoji: '🍍', label: 'Pineapple', category: 'fruits' },
  
  // Vegetables
  { emoji: '🥦', label: 'Broccoli', category: 'vegetables' },
  { emoji: '🥕', label: 'Carrot', category: 'vegetables' },
  { emoji: '🥒', label: 'Cucumber', category: 'vegetables' },
  { emoji: '🍅', label: 'Tomato', category: 'vegetables' },
  { emoji: '🥬', label: 'Lettuce', category: 'vegetables' },
  { emoji: '🧅', label: 'Onion', category: 'vegetables' },
  { emoji: '🌽', label: 'Corn', category: 'vegetables' },
  { emoji: '🥔', label: 'Potato', category: 'vegetables' },
  
  // Grains
  { emoji: '🍞', label: 'Bread', category: 'grains' },
  { emoji: '🥨', label: 'Pretzel', category: 'grains' },
  { emoji: '🍚', label: 'Rice', category: 'grains' },
  { emoji: '🍝', label: 'Pasta', category: 'grains' },
  { emoji: '🥞', label: 'Pancakes', category: 'grains' },
  { emoji: '🥖', label: 'Baguette', category: 'grains' },
  
  // Protein
  { emoji: '🍳', label: 'Egg', category: 'protein' },
  { emoji: '🐟', label: 'Fish', category: 'protein' },
  { emoji: '🍗', label: 'Chicken', category: 'protein' },
  { emoji: '🥜', label: 'Nuts', category: 'protein' },
  { emoji: '🧀', label: 'Cheese', category: 'protein' },
  { emoji: '🫘', label: 'Beans', category: 'protein' },
  
  // Drinks
  { emoji: '💧', label: 'Water', category: 'drinks' },
  { emoji: '🥛', label: 'Milk', category: 'drinks' },
  { emoji: '🧃', label: 'Juice', category: 'drinks' },
  { emoji: '🥤', label: 'Soda', category: 'drinks' },
];

type InputMethod = 'emoji' | 'text' | 'photo' | null;

interface LogState {
  method: InputMethod;
  content: string | string[] | null;
  selectedEmojis: string[];
  textInput: string;
  photoFile: File | null;
  photoPreview: string | null;
}

export default function FoodLog() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [state, setState] = useState<LogState>({
    method: null,
    content: null,
    selectedEmojis: [],
    textInput: '',
    photoFile: null,
    photoPreview: null,
  });

  const logMutation = useMutation({
    mutationFn: async (logData: any) => {
      const response = await apiRequest('POST', '/api/logs', logData);
      return response.json();
    },
    onSuccess: (data) => {
      // Store log data for feedback screen
      localStorage.setItem('lastLogData', JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      setLocation('/feedback');
    },
    onError: (error) => {
      console.error('Log submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your meal. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const selectMethod = (method: InputMethod) => {
    setState(prev => ({
      ...prev,
      method,
      content: null,
      selectedEmojis: [],
      textInput: '',
      photoFile: null,
      photoPreview: null,
    }));
  };

  const toggleEmoji = (emoji: string) => {
    setState(prev => {
      const newEmojis = prev.selectedEmojis.includes(emoji)
        ? prev.selectedEmojis.filter(e => e !== emoji)
        : [...prev.selectedEmojis, emoji];
      
      return {
        ...prev,
        selectedEmojis: newEmojis,
        content: newEmojis.length > 0 ? newEmojis : null,
      };
    });
  };

  const removeEmoji = (emoji: string) => {
    setState(prev => {
      const newEmojis = prev.selectedEmojis.filter(e => e !== emoji);
      return {
        ...prev,
        selectedEmojis: newEmojis,
        content: newEmojis.length > 0 ? newEmojis : null,
      };
    });
  };

  const handleTextChange = (value: string) => {
    if (value.length <= 160) {
      setState(prev => ({
        ...prev,
        textInput: value,
        content: value.trim().length >= 2 ? value.trim() : null,
      }));
    }
  };

  const handlePhotoChange = async (file: File) => {
    if (!file) return;

    // Validate file size (1.5MB)
    if (file.size > 1.5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 1.5MB',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Convert to base64 and compress
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const base64 = await new Promise<string>((resolve) => {
        img.onload = () => {
          // Calculate new dimensions (max 1280px on long edge)
          const maxSize = 1280;
          let { width, height } = img;
          
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to target ~256KB
          let quality = 0.8;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          
          while (dataUrl.length > 256 * 1024 && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          
          resolve(dataUrl);
        };
        
        img.src = URL.createObjectURL(file);
      });

      setState(prev => ({
        ...prev,
        photoFile: file,
        photoPreview: base64,
        content: base64,
      }));
    } catch (error) {
      console.error('Photo processing error:', error);
      toast({
        title: 'Error processing photo',
        description: 'Please try a different image',
        variant: 'destructive',
      });
    }
  };

  const editSelection = () => {
    setState(prev => ({
      ...prev,
      content: null,
    }));
  };

  const submitLog = async () => {
    if (!user || !state.method || !state.content) return;

    const logData = {
      userId: user.id,
      type: 'food',
      entryMethod: state.method,
      content: state.method === 'emoji' 
        ? { emojis: state.selectedEmojis }
        : state.method === 'text'
        ? { description: state.textInput }
        : { photoCaption: 'user provided photo' },
      timestamp: new Date().toISOString(),
    };

    logMutation.mutate(logData);
  };

  const hasContent = !!state.content;
  const showPreview = hasContent && state.method;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-[#FF6A00] text-white p-4 flex items-center justify-between z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/dashboard')}
          className="text-white hover:bg-white/20 p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">LOG YOUR MEAL</h1>
          <img 
            src={mascotImage} 
            alt="BiteBurst mascot" 
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </div>
        
        <div className="w-8" /> {/* Spacer for centering */}
      </header>

      <div className="p-4 space-y-6">
        {/* Input Method Selection */}
        {!state.method && (
          <section className="space-y-4">
            <h2 className="text-center text-gray-600 text-sm">Choose how to log your meal</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <Card 
                className="cursor-pointer transition-all hover:scale-105 border-2 hover:border-[#FF6A00]"
                onClick={() => selectMethod('emoji')}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2 flex justify-center gap-1">
                    {EMOJI_CATALOG.slice(0, 6).map(item => item.emoji).join(' ')}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Smile className="text-[#FF6A00]" size={20} />
                    <span className="font-medium">Emojis</span>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer transition-all hover:scale-105 border-2 hover:border-[#FF6A00]"
                onClick={() => selectMethod('text')}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MessageSquare className="text-[#FF6A00]" size={24} />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-medium">Text</span>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer transition-all hover:scale-105 border-2 hover:border-[#FF6A00]"
                onClick={() => selectMethod('photo')}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Camera className="text-[#FF6A00]" size={24} />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-medium">Photo</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Emoji Panel */}
        {state.method === 'emoji' && !showPreview && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Pick food emojis</h2>
              <Button variant="ghost" size="sm" onClick={() => selectMethod(null)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-6 gap-3">
              {EMOJI_CATALOG.map((item) => (
                <button
                  key={item.emoji}
                  onClick={() => toggleEmoji(item.emoji)}
                  className={`
                    text-2xl p-3 rounded-xl border-2 transition-all
                    ${state.selectedEmojis.includes(item.emoji)
                      ? 'border-[#FF6A00] bg-orange-50 scale-110' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  title={item.label}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
            
            {state.selectedEmojis.length > 0 && (
              <div className="text-center text-sm text-gray-600">
                Tap again to remove • {state.selectedEmojis.length} selected
              </div>
            )}
          </section>
        )}

        {/* Text Panel */}
        {state.method === 'text' && !showPreview && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Type what you ate</h2>
              <Button variant="ghost" size="sm" onClick={() => selectMethod(null)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Textarea
                value={state.textInput}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="e.g., apple, yogurt, toast"
                className="min-h-[120px] text-base border-2 focus:border-[#FF6A00] rounded-xl"
                maxLength={160}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tip: keep it simple</span>
                <span>{state.textInput.length}/160</span>
              </div>
            </div>
          </section>
        )}

        {/* Photo Panel */}
        {state.method === 'photo' && !showPreview && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Take or upload a photo</h2>
              <Button variant="ghost" size="sm" onClick={() => selectMethod(null)}>
                <X size={16} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoChange(file);
                }}
                className="border-2 border-dashed border-[#FF6A00] rounded-xl p-4 text-center"
              />
              
              {state.photoPreview && (
                <div className="space-y-2">
                  <img
                    src={state.photoPreview}
                    alt="Food photo preview"
                    className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <p className="text-sm text-gray-600 text-center">
                    Photo ready! Images are processed locally for privacy.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Preview Section */}
        {showPreview && (
          <section className="space-y-4">
            <h2 className="font-medium text-center">Your selection</h2>
            
            <Card className="border-2 border-[#FF6A00]">
              <CardContent className="p-4">
                {state.method === 'emoji' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {state.selectedEmojis.map((emoji, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-lg px-3 py-1 bg-orange-50 hover:bg-orange-100 cursor-pointer"
                          onClick={() => removeEmoji(emoji)}
                        >
                          {emoji}
                          <X size={12} className="ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {state.method === 'text' && (
                  <p className="text-base">{state.textInput}</p>
                )}
                
                {state.method === 'photo' && state.photoPreview && (
                  <img
                    src={state.photoPreview}
                    alt="Selected food photo"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={editSelection}
                className="text-[#FF6A00] underline"
              >
                Edit selection
              </Button>
            </div>
          </section>
        )}

        {/* Submit Button */}
        <div className="sticky bottom-4 pt-4">
          <Button
            onClick={submitLog}
            disabled={!hasContent || logMutation.isPending}
            className="w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white py-4 text-lg font-bold rounded-xl disabled:opacity-50"
          >
            {logMutation.isPending ? 'SAVING...' : 'LOG MEAL'}
          </Button>
        </div>
      </div>
    </div>
  );
}
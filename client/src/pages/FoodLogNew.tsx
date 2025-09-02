import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import foodEmojis from '@/config/food-emojis.json';
import '../styles/tokens.css';
import mascotImage from '@assets/9ef8e8fe-158e-4518-bd1c-1325863aebca_1756365757940.png';

type InputMethod = 'emoji' | 'text' | 'photo';

interface LogState {
  method: InputMethod;
  selectedEmojis: string[];
  textInput: string;
  photoFile: File | null;
  photoPreview: string | null;
}

// Haptic feedback helper
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
};

// Photo compression utility
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const maxSize = 1280;
      const { width, height } = img;
      
      let newWidth = width;
      let newHeight = height;
      
      if (width > height && width > maxSize) {
        newWidth = maxSize;
        newHeight = (height * maxSize) / width;
      } else if (height > maxSize) {
        newHeight = maxSize;
        newWidth = (width * maxSize) / height;
      }
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob((blob) => {
        if (blob && blob.size <= 256 * 1024) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        } else {
          // If still too large, reduce quality
          canvas.toBlob((smallerBlob) => {
            if (smallerBlob) {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(smallerBlob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          }, 'image/jpeg', 0.7);
        }
      }, 'image/jpeg', 0.8);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export default function FoodLog() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [state, setState] = useState<LogState>({
    method: 'emoji',
    selectedEmojis: [],
    textInput: '',
    photoFile: null,
    photoPreview: null,
  });

  // Auto-focus textarea when switching to text method
  useEffect(() => {
    if (state.method === 'text' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [state.method]);

  // Flatten all emojis from config, excluding already selected ones
  const allEmojis = useMemo(() => 
    foodEmojis.categories.flatMap(category => 
      category.emojis.map(item => ({
        emoji: item.emoji,
        name: item.name,
        healthy: item.healthy,
        category: category.name
      }))
    ).filter(item => !state.selectedEmojis.includes(item.emoji))
  , [state.selectedEmojis]);

  // Check if current state has valid content
  const hasValidContent = () => {
    switch (state.method) {
      case 'emoji':
        return state.selectedEmojis.length > 0;
      case 'text':
        return state.textInput.trim().length >= 2;
      case 'photo':
        return state.photoFile !== null;
      default:
        return false;
    }
  };

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let content: any = {};
      
      switch (state.method) {
        case 'emoji':
          content = { emojis: state.selectedEmojis };
          break;
        case 'text':
          content = { text: state.textInput.trim() };
          break;
        case 'photo':
          if (state.photoPreview) {
            content = { photo: state.photoPreview };
          }
          break;
      }

      return await apiRequest('/api/logs', {
        method: 'POST',
        body: {
          userId: user.id,
          type: 'food',
          entryMethod: state.method,
          content,
          timestamp: new Date().toISOString()
        }
      });
    },
    onSuccess: (data) => {
      triggerHaptic();
      
      // Store log data for feedback page
      if (data && typeof data === 'object' && 'id' in data) {
        localStorage.setItem('lastLogData', JSON.stringify(data));
      }
      
      // Navigate immediately to success page for confetti animation
      const successUrl = `/success?logId=${data?.id || 'temp'}&xp=${(data as any)?.xpAwarded || 0}`;
      setLocation(successUrl);
    },
    onError: (error: any) => {
      toast({
        title: "Oops!",
        description: error.message || "Something went wrong. Try again!",
        variant: "destructive",
      });
    },
  });

  // Method selection handlers
  const selectMethod = (method: InputMethod) => {
    triggerHaptic();
    setState(prev => ({ ...prev, method }));
  };

  // Emoji selection handlers
  const toggleEmoji = (emoji: string) => {
    triggerHaptic();
    setState(prev => ({
      ...prev,
      selectedEmojis: prev.selectedEmojis.includes(emoji)
        ? prev.selectedEmojis.filter(e => e !== emoji)
        : [...prev.selectedEmojis, emoji]
    }));
  };

  const removeEmojiChip = (emoji: string) => {
    triggerHaptic();
    setState(prev => ({
      ...prev,
      selectedEmojis: prev.selectedEmojis.filter(e => e !== emoji)
    }));
  };

  const clearEmojis = () => {
    triggerHaptic();
    setState(prev => ({ ...prev, selectedEmojis: [] }));
  };

  // Text input handlers
  const handleTextChange = (value: string) => {
    // Strip emojis in text mode - simplified approach
    const textOnly = value.replace(/[^\w\s.,!?]/g, '');
    setState(prev => ({ ...prev, textInput: textOnly.slice(0, 160) }));
  };

  // Photo handlers
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (before compression)
    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const compressedDataUrl = await compressImage(file);
      setState(prev => ({
        ...prev,
        photoFile: file,
        photoPreview: compressedDataUrl
      }));
      triggerHaptic();
    } catch (error) {
      toast({
        title: "Image processing failed",
        description: "Please try a different image",
        variant: "destructive",
      });
    }
  };

  const removePhoto = () => {
    setState(prev => ({
      ...prev,
      photoFile: null,
      photoPreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    triggerHaptic();
  };

  const handleSubmit = () => {
    if (hasValidContent()) {
      triggerHaptic();
      submitMutation.mutate();
    }
  };

  return (
    <div className="bb-container">
      {/* Header */}
      <header className="bb-appbar">
        <button 
          className="bb-back" 
          onClick={() => setLocation('/')}
          aria-label="Back to dashboard"
        >
          ←
        </button>
        <h1>Log your meal</h1>
        <img src={mascotImage} alt="BiteBurst mascot" className="bb-mascot" />
      </header>

      {/* Intro */}
      <p className="bb-helper">Choose how you want to log</p>

      {/* Method Selection */}
      <section className="bb-methods" role="tablist">
        <button
          id="optEmoji"
          className={`bb-card-select ${state.method === 'emoji' ? 'is-active' : ''}`}
          onClick={() => selectMethod('emoji')}
          role="tab"
          aria-selected={state.method === 'emoji'}
          aria-controls="panelEmoji"
        >
          <div className="bb-emoji-peek">🍎 🥦 🍞 🧃</div>
          <span>Emojis</span>
        </button>
        
        <button
          id="optText"
          className={`bb-card-select ${state.method === 'text' ? 'is-active' : ''}`}
          onClick={() => selectMethod('text')}
          role="tab"
          aria-selected={state.method === 'text'}
          aria-controls="panelText"
        >
          <div className="bb-icon">💬</div>
          <span>Text</span>
        </button>
        
        <button
          id="optPhoto"
          className={`bb-card-select ${state.method === 'photo' ? 'is-active' : ''}`}
          onClick={() => selectMethod('photo')}
          role="tab"
          aria-selected={state.method === 'photo'}
          aria-controls="panelPhoto"
        >
          <div className="bb-icon">📷</div>
          <span>Photo</span>
        </button>
      </section>

      {/* Emoji Panel */}
      <section 
        id="panelEmoji" 
        className="bb-panel" 
        hidden={state.method !== 'emoji'}
        role="tabpanel"
        aria-labelledby="optEmoji"
      >
        <h2 className="bb-section">Pick food emojis</h2>
        <div className="bb-emoji-grid" role="listbox" aria-label="Food emojis">
          {allEmojis.map((item, index) => (
            <button
              key={index}
              className={`bb-emoji-tile ${state.selectedEmojis.includes(item.emoji) ? 'selected' : ''}`}
              onClick={() => toggleEmoji(item.emoji)}
              aria-pressed={state.selectedEmojis.includes(item.emoji)}
              title={item.name}
              role="option"
              aria-selected={state.selectedEmojis.includes(item.emoji)}
            >
              {item.emoji}
            </button>
          ))}
        </div>
        
        {/* Selection Shelf */}
        <div 
          id="emojiShelf" 
          className="bb-shelf" 
          hidden={state.selectedEmojis.length === 0}
          aria-live="polite"
        >
          <div id="emojiChips" className="bb-chips">
            {state.selectedEmojis.map((emoji, index) => (
              <div key={index} className="bb-chip">
                {emoji}
                <button
                  className="bb-chip-remove"
                  onClick={() => removeEmojiChip(emoji)}
                  aria-label={`Remove ${emoji}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button id="emojiClear" className="bb-link-sm" onClick={clearEmojis}>
            Clear
          </button>
        </div>
      </section>

      {/* Text Panel */}
      <section 
        id="panelText" 
        className="bb-panel" 
        hidden={state.method !== 'text'}
        role="tabpanel"
        aria-labelledby="optText"
      >
        <h2 className="bb-section">Type what you ate</h2>
        <div className="bb-field">
          <textarea
            ref={textareaRef}
            id="mealText"
            value={state.textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            maxLength={160}
            placeholder="e.g., apple, yogurt, toast"
            aria-describedby="charCount textHint"
          />
          <div className="bb-meta">
            <span id="charCount">{state.textInput.length}</span>/160
          </div>
        </div>
        {state.textInput.length > 0 && state.textInput.length < 2 && (
          <p className="bb-error">Please add at least 2 characters</p>
        )}
        <p id="textHint" className="bb-hint">Tip: keep it simple.</p>
      </section>

      {/* Photo Panel */}
      <section 
        id="panelPhoto" 
        className="bb-panel" 
        hidden={state.method !== 'photo'}
        role="tabpanel"
        aria-labelledby="optPhoto"
      >
        <h2 className="bb-section">Take or upload a photo</h2>
        
        {!state.photoPreview ? (
          <label className="bb-drop" htmlFor="mealPhoto">
            📸 Tap to choose a photo
          </label>
        ) : (
          <div className="bb-photo" aria-live="polite">
            <img src={state.photoPreview} alt="Selected meal" />
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <button
                onClick={removePhoto}
                className="bb-link-sm"
                style={{ color: '#dc2626' }}
              >
                Remove photo
              </button>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          id="mealPhoto"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          hidden
        />
        
        <p className="bb-hint">Photos are processed locally and safely stored.</p>
      </section>

      {/* Sticky Action Bar */}
      <footer className={`bb-cta-bar ${hasValidContent() ? 'visible' : ''}`}>
        <button
          id="btnSubmit"
          className="bb-cta"
          disabled={!hasValidContent() || submitMutation.isPending}
          onClick={handleSubmit}
        >
          <span>{submitMutation.isPending ? 'Logging meal...' : 'Log meal'}</span>
        </button>
      </footer>

      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: '-10000px' }}>
        {state.method === 'emoji' && state.selectedEmojis.length > 0 && 
          `Selected ${state.selectedEmojis.length} food${state.selectedEmojis.length > 1 ? 's' : ''}`
        }
        {state.method === 'text' && state.textInput.length >= 2 && 
          'Text input ready to submit'
        }
        {state.method === 'photo' && state.photoPreview && 
          'Photo selected and ready to submit'
        }
      </div>
    </div>
  );
}
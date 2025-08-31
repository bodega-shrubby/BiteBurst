import { useState } from "react";
import { X, Camera } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'food' | 'activity';
  initialEmoji?: string;
}

export default function QuickLogModal({ isOpen, onClose, type, initialEmoji }: QuickLogModalProps) {
  const [content, setContent] = useState(initialEmoji || '');
  const [entryMethod, setEntryMethod] = useState<'emoji' | 'text' | 'photo'>('emoji');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const quickLogMutation = useMutation({
    mutationFn: async (data: { type: string; content: any; entryMethod: string }) => {
      return apiRequest('/api/dashboard/quick-log', 'POST', data);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Great job!",
        description: `${response.feedback} (+${response.xpAwarded} XP)`,
      });
      onClose();
      setContent('');
    },
    onError: (error) => {
      toast({
        title: "Oops!",
        description: "Failed to log entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const logData = {
      type,
      content: entryMethod === 'photo' ? { photo: content } : { description: content },
      entryMethod,
    };

    quickLogMutation.mutate(logData);
  };

  if (!isOpen) return null;

  const foodEmojis = ['🍎', '🥦', '🍞', '🧃', '🥗', '🍌', '🥕', '🍓', '🥜', '🐟', '🍳', '🥛'];
  const activityEmojis = ['⚽', '🧘', '🏃', '🎯', '🏊', '🚴', '🏋️', '🤸', '🧗', '🏸', '🏀', '🎾'];
  
  const emojis = type === 'food' ? foodEmojis : activityEmojis;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#FF6A00]">
            Log {type === 'food' ? 'Food' : 'Activity'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Entry Method Toggle */}
          <div className="flex space-x-2">
            {[
              { method: 'emoji' as const, label: '😊 Emoji' },
              { method: 'text' as const, label: '✍️ Text' },
              { method: 'photo' as const, label: '📷 Photo' },
            ].map((option) => (
              <button
                key={option.method}
                onClick={() => setEntryMethod(option.method)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  entryMethod === option.method
                    ? 'bg-[#FF6A00] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {entryMethod === 'emoji' && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Quick select:</p>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setContent(emoji)}
                      className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl transition-colors ${
                        content === emoji
                          ? 'border-[#FF6A00] bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Or type your own..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent"
                />
              </div>
            )}

            {entryMethod === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What did you {type === 'food' ? 'eat' : 'do'}?
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={type === 'food' 
                    ? "e.g., Apple slices with peanut butter" 
                    : "e.g., 20 minute bike ride"
                  }
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent resize-none"
                />
              </div>
            )}

            {entryMethod === 'photo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Take a photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">Photo upload coming soon!</p>
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="For now, describe what you see..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!content.trim() || quickLogMutation.isPending}
              className="w-full bg-[#FF6A00] text-white py-4 rounded-xl font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {quickLogMutation.isPending ? 'Logging...' : 'Log Entry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
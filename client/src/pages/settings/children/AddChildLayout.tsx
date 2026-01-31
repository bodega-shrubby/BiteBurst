import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

interface AddChildLayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  onBack?: () => void;
}

export default function AddChildLayout({ children, step, totalSteps, onBack }: AddChildLayoutProps) {
  const [, setLocation] = useLocation();
  
  const progress = (step / totalSteps) * 100;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
            Step {step} of {totalSteps}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {children}
      </div>
    </div>
  );
}

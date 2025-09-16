interface SuccessStripProps {
  message: string;
  onContinue: () => void;
  show: boolean;
}

export default function SuccessStrip({ message, onContinue, show }: SuccessStripProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-48 left-0 right-0 z-30 animate-in slide-in-from-bottom duration-500">
      <div className="bg-green-500 text-white px-6 py-4 mx-4 rounded-t-2xl shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl" role="img" aria-hidden="true">✓</span>
            <div>
              <div className="font-semibold">Nice!</div>
              <div className="text-sm opacity-90">{message}</div>
            </div>
          </div>
          
          <button
            onClick={onContinue}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full font-semibold transition-colors"
            aria-label="Continue to next step"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

export default function PasswordStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validatePassword = (pass: string, confirm: string) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pass)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    if (pass !== confirm) {
      return "Passwords do not match";
    }
    return "";
  };

  useEffect(() => {
    const errorMessage = validatePassword(password, confirmPassword);
    setError(errorMessage);
    setIsValid(!errorMessage && password.length > 0 && confirmPassword.length > 0);
  }, [password, confirmPassword]);

  const handleNext = () => {
    if (isValid) {
      updateProfile({ password });
      setLocation("/profile/consent");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleNext();
    }
  };

  return (
    <OnboardingLayout step={10} totalSteps={12}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Title */}
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            Create a password
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed">
            Choose a strong password to keep your BiteBurst account secure.
          </p>

          {/* Password Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full px-4 py-4 pr-12 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                  style={{ height: '56px' }}
                  aria-describedby={error ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-4 pr-12 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                  style={{ height: '56px' }}
                  aria-describedby={error ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {isValid && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {error && (
              <p 
                id="password-error"
                className="text-red-500 text-sm"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Password must include:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-600' : ''}`}>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${password.length >= 8 ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {password.length >= 8 && <span className="text-white text-xs">✓</span>}
                </span>
                At least 8 characters
              </li>
              <li className={`flex items-center gap-2 ${/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) ? 'text-green-600' : ''}`}>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) && <span className="text-white text-xs">✓</span>}
                </span>
                One uppercase, one lowercase, and one number
              </li>
            </ul>
          </div>
        </div>

        {/* Next Button - Fixed at Bottom */}
        <div className="mt-auto pb-6 flex justify-center">
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="max-w-[366px] w-full text-white h-12 text-base font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: isValid ? '#FF6A00' : '#9CA3AF',
              borderRadius: '13px'
            }}
          >
            Next
          </Button>
        </div>

      </div>
    </OnboardingLayout>
  );
}
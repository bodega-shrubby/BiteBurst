import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

export default function ParentAccountStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [email, setEmail] = useState(profile.parentEmail || "");
  const [password, setPassword] = useState(profile.password || "");
  const [consent, setConsent] = useState(profile.hasParentConsent || false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Please enter a valid email address";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password must be at least 6 characters";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  useEffect(() => {
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    }
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  }, [email, password, touched]);

  const isFormValid = !validateEmail(email) && !validatePassword(password) && consent;

  const handleNext = () => {
    setTouched({ email: true, password: true });
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError || !consent) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    updateProfile({
      parentEmail: email.trim(),
      email: email.trim(),
      password,
      hasParentConsent: consent,
    });
    setLocation("/profile/name");
  };

  return (
    <OnboardingLayout step={2} totalSteps={11}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-2xl leading-tight text-gray-800">
            Let's create your account
          </h1>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Parent/Guardian Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                placeholder="parent@email.com"
                className={`w-full px-4 py-3 text-base border-2 rounded-xl focus:outline-none transition-colors duration-200 ${
                  touched.email && errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-orange-500"
                }`}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  placeholder="Min. 6 characters"
                  className={`w-full px-4 py-3 pr-12 text-base border-2 rounded-xl focus:outline-none transition-colors duration-200 ${
                    touched.password && errors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-orange-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
                className="mt-1 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <label htmlFor="consent" className="text-sm text-gray-600 leading-snug">
                I am the parent/guardian and give consent for my child to use BiteBurst
              </label>
            </div>

            {!consent && touched.email && touched.password && (
              <p className="text-red-500 text-sm">Please confirm you are the parent/guardian</p>
            )}
          </div>

          <p className="text-xs text-gray-500">
            We'll use this email to keep your child's account safe and send important updates
          </p>
        </div>

        <div className="mt-auto pb-6 space-y-4">
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full text-white h-12 text-base font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isFormValid ? "#FF6A00" : "#9CA3AF",
              borderRadius: "13px",
            }}
          >
            Next
          </Button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}

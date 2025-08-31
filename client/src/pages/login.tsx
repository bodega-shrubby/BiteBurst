import { Button } from "@/components/ui/button";
import mascotImage from "@assets/ChatGPT Image Jun 20, 2025 at 04_16_09 PM_1750421779759.png";

export default function Login() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <img 
            src={mascotImage} 
            alt="BiteBurst Mascot" 
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Sign in to your BiteBurst account</p>
        </div>

        {/* Direct to Onboarding */}
        <div className="space-y-4">
          <Button
            onClick={() => window.location.href = '/start'}
            className="w-full text-white font-bold text-lg rounded-full transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#FF6A00' }}
          >
            Get Started with BiteBurst
          </Button>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Create your profile and start your healthy eating journey!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
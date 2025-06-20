import { Button } from "@/components/ui/button";
import mascotImage from "@assets/ChatGPT Image Jun 20, 2025 at 04_16_09 PM_1750421779759.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-8 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          
          {/* 1. Logo Row */}
          <div className="flex items-center justify-center mb-12">
            <img 
              src={mascotImage} 
              alt="BiteBurst Mascot" 
              className="w-24 h-24 mr-6"
            />
            <h1 className="text-6xl font-bold text-orange-500" style={{ color: '#FF6A00' }}>
              BiteBurst
            </h1>
          </div>

          {/* 2. Headline */}
          <h2 className="text-3xl font-bold text-black text-center mb-6 leading-tight">
            The fun, gamified way to eat better and move more!
          </h2>

          {/* 3. Subheading */}
          <p className="text-lg font-medium text-black text-center mb-12 max-w-2xl mx-auto leading-relaxed">
            BiteBurst helps kids and teens learn what to eat, how to stay active, and how food fuels their goals.
          </p>

          {/* 4. Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              className="bg-orange-500 hover:bg-orange-600 hover:shadow-lg text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-200"
              style={{ backgroundColor: '#FF6A00' }}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-gray-300 text-black hover:bg-gray-50 hover:shadow-md px-8 py-3 text-lg font-medium rounded-full bg-white transition-all duration-200"
            >
              I already have an account
            </Button>
          </div>

          {/* 5. Visual Row */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Left: Mascot */}
            <div className="flex-shrink-0">
              <img 
                src={mascotImage} 
                alt="BiteBurst Mascot" 
                className="w-32 h-32 animate-float"
              />
            </div>

            {/* Right: Kids activities with sparkles */}
            <div className="relative flex-1 max-w-md">
              {/* Decorative sparkles */}
              <div className="absolute -top-4 left-4 text-yellow-400 text-2xl animate-pulse">
                ✨
              </div>
              <div className="absolute -top-2 right-8 text-orange-400 font-bold text-xl">
                XP
              </div>
              <div className="absolute bottom-4 left-8 text-yellow-400 text-lg animate-pulse">
                ✨
              </div>
              <div className="absolute bottom-8 right-4 text-yellow-400 text-2xl animate-pulse">
                ✨
              </div>

              {/* Illustration placeholder for kids dancing/running/eating */}
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">🏃‍♂️ 🍎 💃</div>
                <p className="text-lg font-semibold text-gray-700">
                  Kids staying active and eating healthy!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
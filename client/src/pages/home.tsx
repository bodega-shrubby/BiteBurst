import { Button } from "@/components/ui/button";
import mascotImage from "@assets/ChatGPT Image Jun 20, 2025 at 04_16_09 PM_1750421779759.png";
import biteBurstTextImage from "@assets/F2D3D9CF-D739-4DA8-ACEC-83E301F2A76E_1750932035557.png";
import runningBoyImage from "@assets/CA2D19FD-6214-4459-B44F-C0503B8D0086_1750932028300.png";
import girlYellowHoodieImage from "@assets/48172ADF-566D-40CF-AA66-3DD0D4B182D8_1750932044380.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section - Exact recreation of provided design */}
      <section className="min-h-screen flex flex-col justify-center items-center px-8 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          
          {/* Logo Row - Responsive sizing */}
          <div className="flex items-center justify-center mb-8 sm:mb-12 -space-x-2">
            <img 
              src={mascotImage} 
              alt="BiteBurst Mascot" 
              className="w-40 h-40 sm:w-48 md:w-56 lg:w-64 object-contain"
            />
            <img 
              src={biteBurstTextImage} 
              alt="BiteBurst" 
              className="h-32 sm:h-40 md:h-48 lg:h-56 object-contain"
            />
          </div>

          {/* Headline */}
          <h2 className="text-4xl font-bold text-black text-center mb-6 leading-tight max-w-4xl mx-auto">
            The fun, gamified way to eat better and move more!
          </h2>

          {/* Subheading */}
          <p className="text-lg font-medium text-black text-center mb-16 max-w-3xl mx-auto leading-relaxed">
            BiteBurst helps kids and teens learn what to eat, how to stay active, and how food fuels their goals.
          </p>

          {/* Character Scene - From attached design */}
          <div className="relative mb-16 h-80 sm:h-96">
            
            {/* Background elements */}
            {/* Sun (top left) */}
            <div className="absolute top-4 left-8 sm:left-16">
              <div className="w-12 h-12 bg-yellow-400 rounded-full relative">
                {/* Sun rays */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-yellow-400"></div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-yellow-400"></div>
                <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-3 h-0.5 bg-yellow-400"></div>
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-3 h-0.5 bg-yellow-400"></div>
                <div className="absolute -top-3 -left-3 w-0.5 h-2 bg-yellow-400 transform rotate-45"></div>
                <div className="absolute -top-3 -right-3 w-0.5 h-2 bg-yellow-400 transform -rotate-45"></div>
                <div className="absolute -bottom-3 -left-3 w-0.5 h-2 bg-yellow-400 transform -rotate-45"></div>
                <div className="absolute -bottom-3 -right-3 w-0.5 h-2 bg-yellow-400 transform rotate-45"></div>
              </div>
            </div>

            {/* Yellow stars */}
            <div className="absolute top-8 left-1/3">
              <div className="star-sparkle text-yellow-400 text-2xl">✦</div>
            </div>
            <div className="absolute top-6 right-1/4">
              <div className="star-sparkle text-yellow-400 text-xl">✦</div>
            </div>
            <div className="absolute top-12 right-1/3">
              <div className="star-sparkle text-yellow-400 text-sm">✦</div>
            </div>

            {/* XP text with stars */}
            <div className="absolute top-4 right-8 sm:right-16">
              <span className="text-yellow-500 font-bold text-2xl sm:text-3xl">XP</span>
            </div>

            {/* Floating green apple */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 bg-green-500 rounded-full relative shadow-lg animate-float-delayed">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-green-700 rounded-full"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-x-0.5 w-1 h-0.5 bg-green-600 rounded-full transform rotate-45"></div>
                <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-green-300 rounded-full opacity-60"></div>
              </div>
            </div>

            {/* Characters positioned horizontally */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-end space-x-4 sm:space-x-8">
              
              {/* 1. Orange slice mascot (waving) */}
              <div className="relative">
                <img 
                  src={mascotImage} 
                  alt="BiteBurst Mascot" 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain animate-float"
                />
              </div>

              {/* 2. Girl in yellow hoodie (lunging pose) */}
              <div className="relative">
                <img 
                  src={girlYellowHoodieImage} 
                  alt="Girl in Yellow Hoodie" 
                  className="h-20 sm:h-24 object-contain"
                />
              </div>

              {/* 3. Running boy in orange shirt */}
              <div className="relative">
                <img 
                  src={runningBoyImage} 
                  alt="Running Boy" 
                  className="h-20 sm:h-24 object-contain"
                />
              </div>

              {/* 4. Girl with dark hair eating fruit (far right) */}
              <div className="relative">
                <div className="w-16 h-20 sm:w-18 sm:h-24 relative">
                  {/* Head */}
                  <div className="w-12 h-12 bg-yellow-100 rounded-full relative">
                    {/* Long dark hair */}
                    <div className="absolute -top-0.5 -left-0.5 w-13 h-7 bg-gray-900 rounded-t-3xl"></div>
                    <div className="absolute top-1 -left-0.5 w-3 h-12 bg-gray-900 rounded-full"></div>
                    <div className="absolute top-1 -right-0.5 w-3 h-12 bg-gray-900 rounded-full"></div>
                    
                    {/* Eyes */}
                    <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    
                    {/* Smile */}
                    <div className="absolute top-6 left-3 w-6 h-1 border-b-2 border-black rounded-b-full"></div>
                  </div>
                  
                  {/* Red/coral top */}
                  <div className="absolute top-8 left-1 w-10 h-7 bg-red-400 rounded-lg"></div>
                  
                  {/* Arms */}
                  <div className="absolute top-10 -left-1 w-3 h-6 bg-yellow-100 rounded-full"></div>
                  <div className="absolute top-9 right-1 w-3 h-6 bg-yellow-100 rounded-full"></div>
                  
                  {/* Yellow fruit being held */}
                  <div className="absolute top-7 right-2 w-2 h-3 bg-yellow-400 rounded-full"></div>
                  
                  {/* Blue jeans */}
                  <div className="absolute top-14 left-2 w-3 h-12 bg-blue-600 rounded-full"></div>
                  <div className="absolute top-14 right-2 w-3 h-12 bg-blue-600 rounded-full"></div>
                  
                  {/* Blue shoes */}
                  <div className="absolute bottom-0 left-1 w-5 h-2 bg-blue-800 rounded"></div>
                  <div className="absolute bottom-0 right-1 w-5 h-2 bg-blue-800 rounded"></div>
                </div>
              </div>
            </div>

            {/* Floating red apple */}
            <div className="absolute bottom-20 right-12 sm:right-20">
              <div className="w-8 h-8 bg-red-500 rounded-full relative shadow-lg animate-float">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-green-700 rounded-full"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-x-0.5 w-1 h-0.5 bg-green-600 rounded-full transform rotate-45"></div>
                <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-red-300 rounded-full opacity-60"></div>
              </div>
            </div>

          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="hover:shadow-lg text-white px-10 py-4 text-lg font-semibold rounded-full transition-all duration-200"
              style={{ backgroundColor: '#FF6A00' }}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-gray-300 text-black hover:bg-gray-50 hover:shadow-md px-10 py-4 text-lg font-medium rounded-full bg-white transition-all duration-200"
            >
              I already have an account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
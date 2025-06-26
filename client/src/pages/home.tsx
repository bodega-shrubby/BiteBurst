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
          
          {/* Logo Row - Left aligned */}
          <div className="flex items-center justify-center mb-12">
            <img 
              src={mascotImage} 
              alt="BiteBurst Mascot" 
              className="w-16 h-16 mr-4 object-contain"
            />
            <img 
              src={biteBurstTextImage} 
              alt="BiteBurst" 
              className="h-12 object-contain"
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

          {/* Character Scene - Exact positioning from design */}
          <div className="relative mb-16 h-64">
            
            {/* Decorative Elements */}
            {/* Left sparkle */}
            <div className="absolute top-4 left-16">
              <div className="star-sparkle text-yellow-400 text-2xl">✦</div>
            </div>
            
            {/* Top center star */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              <div className="star-sparkle text-yellow-400 text-3xl">✦</div>
            </div>
            
            {/* XP text with small stars */}
            <div className="absolute top-4 right-20">
              <span className="text-yellow-500 font-bold text-2xl">XP</span>
              <div className="flex space-x-1 mt-1">
                <div className="star-sparkle text-yellow-400 text-sm">✦</div>
                <div className="star-sparkle text-yellow-400 text-xs">✦</div>
              </div>
            </div>
            
            {/* Bottom right sparkles */}
            <div className="absolute bottom-8 right-32">
              <div className="star-sparkle text-yellow-400 text-xl">✦</div>
            </div>
            
            <div className="absolute bottom-12 left-32">
              <div className="star-sparkle text-yellow-400 text-lg">✦</div>
            </div>

            {/* Characters positioned horizontally across the scene */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end space-x-6">
              
              {/* 1. Orange slice mascot (left) */}
              <div className="relative">
                <img 
                  src={mascotImage} 
                  alt="BiteBurst Mascot" 
                  className="w-12 h-12 object-contain animate-float"
                />
              </div>

              {/* 2. Girl in yellow hoodie (lunging pose) */}
              <div className="relative">
                <img 
                  src={girlYellowHoodieImage} 
                  alt="Girl in Yellow Hoodie" 
                  className="h-20 object-contain"
                />
              </div>

              {/* 3. Green apple (floating center) */}
              <div className="relative">
                <div className="w-10 h-10 bg-green-500 rounded-full relative shadow-lg animate-float-delayed">
                  {/* Apple stem */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-1.5 bg-green-700 rounded-full"></div>
                  {/* Apple leaf */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-x-1 w-1.5 h-0.5 bg-green-600 rounded-full transform rotate-45"></div>
                  {/* Apple highlight */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-green-300 rounded-full opacity-60"></div>
                </div>
              </div>

              {/* 4. Running boy in orange shirt */}
              <div className="relative">
                <img 
                  src={runningBoyImage} 
                  alt="Running Boy" 
                  className="h-20 object-contain"
                />
              </div>

              {/* 5. Red apple (right of characters) */}
              <div className="relative">
                <div className="w-8 h-8 bg-red-500 rounded-full relative shadow-lg animate-float">
                  {/* Apple stem */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-green-700 rounded-full"></div>
                  {/* Apple leaf */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-x-0.5 w-1 h-0.5 bg-green-600 rounded-full transform rotate-45"></div>
                  {/* Apple highlight */}
                  <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-red-300 rounded-full opacity-60"></div>
                </div>
              </div>

              {/* 6. Girl with dark hair eating fruit (far right) */}
              <div className="relative">
                <div className="w-14 h-20 relative">
                  {/* Head */}
                  <div className="w-10 h-10 bg-yellow-100 rounded-full relative">
                    {/* Long dark hair */}
                    <div className="absolute -top-0.5 -left-0.5 w-11 h-6 bg-gray-900 rounded-t-3xl"></div>
                    <div className="absolute top-1 -left-0.5 w-2.5 h-10 bg-gray-900 rounded-full"></div>
                    <div className="absolute top-1 -right-0.5 w-2.5 h-10 bg-gray-900 rounded-full"></div>
                    
                    {/* Eyes */}
                    <div className="absolute top-2.5 left-1.5 w-1 h-1 bg-black rounded-full"></div>
                    <div className="absolute top-2.5 right-1.5 w-1 h-1 bg-black rounded-full"></div>
                    
                    {/* Small smile */}
                    <div className="absolute top-5 left-3 w-4 h-1 border-b border-black rounded-b-full"></div>
                  </div>
                  
                  {/* Pink/coral top */}
                  <div className="absolute top-7 left-0.5 w-9 h-6 bg-red-400 rounded-lg"></div>
                  
                  {/* Arms - one holding yellow fruit */}
                  <div className="absolute top-8 -left-1.5 w-2.5 h-5 bg-yellow-100 rounded-full"></div>
                  <div className="absolute top-8 right-0 w-2.5 h-5 bg-yellow-100 rounded-full"></div>
                  
                  {/* Yellow fruit being held/eaten */}
                  <div className="absolute top-6 right-1 w-1.5 h-2.5 bg-yellow-400 rounded-full"></div>
                  
                  {/* Blue jeans */}
                  <div className="absolute top-12 left-1.5 w-2.5 h-10 bg-blue-600 rounded-full"></div>
                  <div className="absolute top-12 right-1.5 w-2.5 h-10 bg-blue-600 rounded-full"></div>
                  
                  {/* Belt */}
                  <div className="absolute top-12 left-0.5 w-9 h-0.5 bg-blue-800 rounded"></div>
                  
                  {/* Blue shoes */}
                  <div className="absolute bottom-0 left-0.5 w-4 h-1.5 bg-blue-800 rounded"></div>
                  <div className="absolute bottom-0 right-0.5 w-4 h-1.5 bg-blue-800 rounded"></div>
                </div>
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
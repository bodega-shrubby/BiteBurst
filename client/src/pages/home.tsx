import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section - Exact match to your design */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Logo and Brand Name */}
          <div className="flex items-center justify-center mb-12">
            {/* Orange slice mascot - exact match to your design */}
            <div className="w-24 h-24 relative mr-6">
              {/* Orange slice body - semicircle with gradient */}
              <div className="w-20 h-10 bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-t-full relative border-b-4 border-orange-600">
                {/* Orange segments - radiating lines */}
                <div className="absolute bottom-0 left-2 w-0.5 h-8 bg-orange-600 transform rotate-12 origin-bottom"></div>
                <div className="absolute bottom-0 left-4 w-0.5 h-9 bg-orange-600 transform rotate-6 origin-bottom"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-10 bg-orange-600 transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-4 w-0.5 h-9 bg-orange-600 transform -rotate-6 origin-bottom"></div>
                <div className="absolute bottom-0 right-2 w-0.5 h-8 bg-orange-600 transform -rotate-12 origin-bottom"></div>
                
                {/* White rind at top */}
                <div className="absolute top-0 w-full h-1.5 bg-white rounded-t-full border-t-2 border-orange-600"></div>
                
                {/* Eyes - white ovals with black pupils */}
                <div className="absolute top-2 left-3 w-3 h-4 bg-white rounded-full border border-orange-600"></div>
                <div className="absolute top-2 right-3 w-3 h-4 bg-white rounded-full border border-orange-600"></div>
                <div className="absolute top-3 left-4 w-1.5 h-2 bg-black rounded-full"></div>
                <div className="absolute top-3 right-4 w-1.5 h-2 bg-black rounded-full"></div>
                
                {/* Happy curved mouth */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-5 h-2 border-b-3 border-black rounded-b-full bg-red-400"></div>
              </div>
              
              {/* Waving arms */}
              <div className="absolute top-3 -left-3 w-1.5 h-6 bg-orange-500 rounded-full transform -rotate-45"></div>
              <div className="absolute top-3 -right-3 w-1.5 h-6 bg-orange-500 rounded-full transform rotate-45"></div>
              
              {/* Running legs */}
              <div className="absolute -bottom-2 left-6 w-1.5 h-5 bg-orange-500 rounded-full transform rotate-12"></div>
              <div className="absolute -bottom-2 right-6 w-1.5 h-5 bg-orange-500 rounded-full transform -rotate-12"></div>
            </div>
            
            <h1 className="text-7xl font-bold text-orange-500">BiteBurst</h1>
          </div>

          {/* Main Headline */}
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 max-w-5xl mx-auto leading-tight">
            The fun, gamified way to eat better<br />
            and move more!
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-gray-700 mb-16 max-w-4xl mx-auto">
            BiteBurst helps kids and teens learn what to eat, how to stay active, and how food fuels their goals.
          </p>

          {/* Character Scene - 5 elements in exact positions */}
          <div className="flex justify-center items-end space-x-8 mb-16 relative">
            
            {/* Decorative sparkles */}
            <div className="absolute top-0 left-16 text-yellow-400 text-3xl">
              <div className="relative">
                <div className="absolute top-0 left-0 w-1 h-6 bg-yellow-400 rounded"></div>
                <div className="absolute top-2 left-2 w-6 h-1 bg-yellow-400 rounded"></div>
                <div className="absolute top-1 left-1 w-4 h-1 bg-yellow-400 rounded transform rotate-45"></div>
                <div className="absolute top-1 left-1 w-4 h-1 bg-yellow-400 rounded transform -rotate-45"></div>
              </div>
            </div>
            
            <div className="absolute top-8 right-32 text-yellow-400 text-2xl">
              <div className="relative">
                <div className="w-4 h-4 bg-yellow-400 transform rotate-45"></div>
                <div className="absolute top-1 left-1 w-2 h-2 bg-white"></div>
              </div>
            </div>
            
            <div className="absolute top-12 left-1/2 text-yellow-400 text-xl transform -translate-x-1/2">
              <div className="relative">
                <div className="w-3 h-3 bg-yellow-400 transform rotate-45"></div>
                <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white"></div>
              </div>
            </div>

            {/* XP text with sparkles */}
            <div className="absolute top-4 right-16 flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-500">XP</span>
              <div className="flex space-x-1 mt-1">
                <div className="w-2 h-2 bg-yellow-400 transform rotate-45"></div>
                <div className="w-1.5 h-1.5 bg-yellow-400 transform rotate-45"></div>
              </div>
            </div>

            {/* 1. Orange slice mascot on far left */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-8 bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-t-full relative border-b-2 border-orange-600">
                {/* Orange segments */}
                <div className="absolute bottom-0 left-1 w-px h-6 bg-orange-600 transform rotate-15 origin-bottom"></div>
                <div className="absolute bottom-0 left-3 w-px h-7 bg-orange-600 transform rotate-8 origin-bottom"></div>
                <div className="absolute bottom-0 left-1/2 w-px h-8 bg-orange-600 transform -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-3 w-px h-7 bg-orange-600 transform -rotate-8 origin-bottom"></div>
                <div className="absolute bottom-0 right-1 w-px h-6 bg-orange-600 transform -rotate-15 origin-bottom"></div>
                
                {/* White rind */}
                <div className="absolute top-0 w-full h-1 bg-white rounded-t-full border-t border-orange-600"></div>
                
                {/* Eyes */}
                <div className="absolute top-1 left-2 w-2.5 h-3 bg-white rounded-full border border-orange-600"></div>
                <div className="absolute top-1 right-2 w-2.5 h-3 bg-white rounded-full border border-orange-600"></div>
                <div className="absolute top-2 left-3 w-1 h-1.5 bg-black rounded-full"></div>
                <div className="absolute top-2 right-3 w-1 h-1.5 bg-black rounded-full"></div>
                
                {/* Happy mouth */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-1.5 border-b-2 border-black rounded-b-full bg-red-400"></div>
                
                {/* Waving arms */}
                <div className="absolute top-2 -left-2 w-1 h-4 bg-orange-500 rounded-full transform -rotate-30"></div>
                <div className="absolute top-2 -right-2 w-1 h-4 bg-orange-500 rounded-full transform rotate-30"></div>
                
                {/* Running legs */}
                <div className="absolute -bottom-2 left-4 w-1 h-4 bg-orange-500 rounded-full transform rotate-15"></div>
                <div className="absolute -bottom-2 right-4 w-1 h-4 bg-orange-500 rounded-full transform -rotate-15"></div>
              </div>
            </div>

            {/* 2. Girl with brown hair in yellow hoodie - kneeling/lunging pose */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                {/* Head */}
                <div className="w-16 h-20 bg-pink-200 rounded-t-full relative">
                  {/* Brown hair */}
                  <div className="absolute -top-2 w-full h-8 bg-amber-800 rounded-t-full"></div>
                  <div className="absolute -top-1 left-2 w-12 h-6 bg-amber-700 rounded-t-full"></div>
                  
                  {/* Eyes */}
                  <div className="absolute top-4 left-3 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-4 right-3 w-2 h-2 bg-black rounded-full"></div>
                  
                  {/* Happy mouth */}
                  <div className="absolute top-8 left-5 w-6 h-3 border-b-2 border-black rounded-b-full"></div>
                  
                  {/* Yellow hoodie */}
                  <div className="absolute bottom-0 w-full h-12 bg-yellow-500 rounded-b-lg"></div>
                </div>
                
                {/* Arms - one waving */}
                <div className="absolute top-12 -left-3 w-4 h-3 bg-pink-200 rounded transform -rotate-45"></div>
                <div className="absolute top-12 -right-3 w-4 h-3 bg-pink-200 rounded transform rotate-45"></div>
                
                {/* Legs in lunging position - purple pants */}
                <div className="absolute -bottom-2 left-2 w-4 h-8 bg-purple-600 rounded transform rotate-15"></div>
                <div className="absolute -bottom-4 right-1 w-4 h-6 bg-purple-600 rounded transform -rotate-30"></div>
                
                {/* Blue shoes */}
                <div className="absolute -bottom-6 left-1 w-6 h-3 bg-blue-500 rounded"></div>
                <div className="absolute -bottom-7 right-0 w-6 h-3 bg-blue-500 rounded transform rotate-15"></div>
              </div>
            </div>

            {/* 3. Green apple floating in center */}
            <div className="animate-float">
              <div className="w-14 h-14 bg-green-500 rounded-full relative shadow-lg">
                {/* Apple stem */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-green-700 rounded-full"></div>
                {/* Apple leaf */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-x-1 w-3 h-2 bg-green-600 rounded-full transform rotate-45"></div>
                {/* Apple highlight */}
                <div className="absolute top-2 left-3 w-4 h-4 bg-green-300 rounded-full opacity-60"></div>
              </div>
            </div>

            {/* 4. Boy with dark skin in orange shirt - running/jumping */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                {/* Head */}
                <div className="w-16 h-20 bg-amber-900 rounded-t-full relative">
                  {/* Dark curly hair */}
                  <div className="absolute -top-2 w-full h-8 bg-amber-950 rounded-t-full"></div>
                  <div className="absolute -top-1 left-1 w-3 h-4 bg-amber-950 rounded-full"></div>
                  <div className="absolute -top-1 right-1 w-3 h-4 bg-amber-950 rounded-full"></div>
                  <div className="absolute top-0 left-3 w-4 h-5 bg-amber-950 rounded-full"></div>
                  <div className="absolute top-0 right-3 w-4 h-5 bg-amber-950 rounded-full"></div>
                  
                  {/* Eyes */}
                  <div className="absolute top-4 left-3 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-4 right-3 w-2 h-2 bg-black rounded-full"></div>
                  
                  {/* Big smile */}
                  <div className="absolute top-8 left-4 w-8 h-4 border-b-3 border-black rounded-b-full"></div>
                  
                  {/* Orange shirt */}
                  <div className="absolute bottom-0 w-full h-12 bg-orange-500 rounded-b-lg"></div>
                </div>
                
                {/* Arms in running position */}
                <div className="absolute top-12 -left-4 w-4 h-3 bg-amber-900 rounded transform -rotate-30"></div>
                <div className="absolute top-12 -right-4 w-4 h-3 bg-amber-900 rounded transform rotate-45"></div>
                
                {/* Legs in running position - dark pants */}
                <div className="absolute -bottom-2 left-3 w-4 h-8 bg-gray-800 rounded transform rotate-30"></div>
                <div className="absolute -bottom-4 right-2 w-4 h-6 bg-gray-800 rounded transform -rotate-15"></div>
                
                {/* Blue shoes */}
                <div className="absolute -bottom-6 left-2 w-6 h-3 bg-blue-600 rounded transform rotate-15"></div>
                <div className="absolute -bottom-7 right-1 w-6 h-3 bg-blue-600 rounded"></div>
              </div>
            </div>

            {/* 5. Girl with dark hair in pink/red top - standing */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                {/* Head */}
                <div className="w-16 h-20 bg-yellow-200 rounded-t-full relative">
                  {/* Long dark hair */}
                  <div className="absolute -top-2 w-full h-8 bg-gray-900 rounded-t-full"></div>
                  <div className="absolute top-2 left-0 w-4 h-16 bg-gray-900 rounded-full"></div>
                  <div className="absolute top-2 right-0 w-4 h-16 bg-gray-900 rounded-full"></div>
                  
                  {/* Eyes */}
                  <div className="absolute top-4 left-3 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-4 right-3 w-2 h-2 bg-black rounded-full"></div>
                  
                  {/* Mouth */}
                  <div className="absolute top-8 left-6 w-4 h-2 border-b border-black rounded-b-full"></div>
                  
                  {/* Pink/red top */}
                  <div className="absolute bottom-0 w-full h-12 bg-red-400 rounded-b-lg"></div>
                </div>
                
                {/* Arms - one holding something */}
                <div className="absolute top-12 -left-3 w-4 h-3 bg-yellow-200 rounded"></div>
                <div className="absolute top-12 -right-3 w-4 h-3 bg-yellow-200 rounded"></div>
                
                {/* Something being held (yellow item) */}
                <div className="absolute top-8 -right-6 w-3 h-4 bg-yellow-400 rounded-full"></div>
                
                {/* Legs - blue jeans/pants */}
                <div className="absolute -bottom-2 left-3 w-4 h-12 bg-blue-600 rounded"></div>
                <div className="absolute -bottom-2 right-3 w-4 h-12 bg-blue-600 rounded"></div>
                
                {/* Blue shoes */}
                <div className="absolute -bottom-14 left-2 w-6 h-3 bg-blue-800 rounded"></div>
                <div className="absolute -bottom-14 right-2 w-6 h-3 bg-blue-800 rounded"></div>
                
                {/* Belt */}
                <div className="absolute -bottom-3 left-2 w-12 h-1 bg-blue-800 rounded"></div>
              </div>
            </div>

            {/* Red apple on the right */}
            <div className="animate-float-delayed">
              <div className="w-12 h-12 bg-red-500 rounded-full relative shadow-lg">
                {/* Apple stem */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-green-700 rounded-full"></div>
                {/* Apple leaf */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-x-1 w-2 h-1 bg-green-600 rounded-full transform rotate-45"></div>
                {/* Apple highlight */}
                <div className="absolute top-1 left-2 w-3 h-3 bg-red-300 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 text-lg font-bold rounded-full shadow-lg border-none">
              Get Started
            </Button>
            <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-4 text-lg font-medium rounded-full bg-white">
              I already have an account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
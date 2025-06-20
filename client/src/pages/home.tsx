import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section - Exact match to design */}
      <section className="min-h-screen flex flex-col justify-center items-center px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Logo and Brand Name */}
          <div className="flex items-center justify-center mb-16">
            {/* Orange slice mascot */}
            <div className="relative mr-8">
              {/* Orange slice semicircle body */}
              <div className="w-20 h-10 relative">
                {/* Main orange body */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-t-full border-b-4 border-orange-600"></div>
                
                {/* White rind at top */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-white rounded-t-full border-2 border-orange-600 border-b-0"></div>
                
                {/* Orange segments - vertical lines */}
                <div className="absolute bottom-0 left-3 w-0.5 h-8 bg-orange-600"></div>
                <div className="absolute bottom-0 left-6 w-0.5 h-9 bg-orange-600"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-10 bg-orange-600"></div>
                <div className="absolute bottom-0 right-6 w-0.5 h-9 bg-orange-600"></div>
                <div className="absolute bottom-0 right-3 w-0.5 h-8 bg-orange-600"></div>
                
                {/* Eyes - white ovals with black pupils */}
                <div className="absolute top-2 left-3 w-3 h-4 bg-white rounded-full border border-orange-600"></div>
                <div className="absolute top-2 right-3 w-3 h-4 bg-white rounded-full border border-orange-600"></div>
                <div className="absolute top-3 left-4 w-1.5 h-2.5 bg-black rounded-full"></div>
                <div className="absolute top-3 right-4 w-1.5 h-2.5 bg-black rounded-full"></div>
                
                {/* Happy mouth */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-red-500 rounded-full"></div>
              </div>
              
              {/* Waving arms */}
              <div className="absolute top-2 -left-4 w-2 h-6 bg-orange-500 rounded-full transform -rotate-45"></div>
              <div className="absolute top-2 -right-4 w-2 h-6 bg-orange-500 rounded-full transform rotate-45"></div>
              
              {/* Running legs */}
              <div className="absolute -bottom-3 left-6 w-2 h-6 bg-orange-500 rounded-full transform rotate-15"></div>
              <div className="absolute -bottom-3 right-6 w-2 h-6 bg-orange-500 rounded-full transform -rotate-15"></div>
            </div>
            
            <h1 className="text-8xl font-black text-orange-500">BiteBurst</h1>
          </div>

          {/* Main Headline */}
          <h2 className="text-6xl font-black text-gray-900 mb-8 max-w-6xl mx-auto leading-tight">
            The fun, gamified way to eat better and move more!
          </h2>

          {/* Subtitle */}
          <p className="text-2xl text-gray-700 mb-20 max-w-5xl mx-auto leading-relaxed">
            BiteBurst helps kids and teens learn what to eat, how to stay active, and how food fuels their goals.
          </p>

          {/* Character Scene */}
          <div className="relative mb-20 h-80">
            {/* Sparkles */}
            <div className="absolute top-4 left-1/4 w-8 h-8">
              <div className="absolute inset-0 bg-yellow-400 transform rotate-45"></div>
              <div className="absolute top-2 left-2 w-4 h-4 bg-white transform rotate-45"></div>
            </div>
            
            <div className="absolute top-12 right-1/4 w-6 h-6">
              <div className="absolute inset-0 bg-yellow-400 transform rotate-45"></div>
              <div className="absolute top-1 left-1 w-4 h-4 bg-white transform rotate-45"></div>
            </div>
            
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-4">
              <div className="absolute inset-0 bg-yellow-400 transform rotate-45"></div>
            </div>

            {/* XP text */}
            <div className="absolute top-4 right-1/3 text-yellow-500 font-black text-3xl">
              XP
            </div>
            <div className="absolute top-12 right-1/3 w-3 h-3 bg-yellow-400 transform rotate-45"></div>
            <div className="absolute top-12 right-1/3 translate-x-4 w-2 h-2 bg-yellow-400 transform rotate-45"></div>

            {/* Characters positioned horizontally */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end space-x-12">
              
              {/* 1. Orange slice mascot - smaller version */}
              <div className="relative">
                <div className="w-12 h-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-t-full border-b-2 border-orange-600"></div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white rounded-t-full border border-orange-600 border-b-0"></div>
                  <div className="absolute bottom-0 left-2 w-px h-5 bg-orange-600"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-6 bg-orange-600"></div>
                  <div className="absolute bottom-0 right-2 w-px h-5 bg-orange-600"></div>
                  <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full border border-orange-600"></div>
                  <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full border border-orange-600"></div>
                  <div className="absolute top-1.5 left-2.5 w-1 h-1 bg-black rounded-full"></div>
                  <div className="absolute top-1.5 right-2.5 w-1 h-1 bg-black rounded-full"></div>
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-500 rounded-full"></div>
                </div>
                <div className="absolute top-1 -left-2 w-1 h-4 bg-orange-500 rounded-full transform -rotate-30"></div>
                <div className="absolute top-1 -right-2 w-1 h-4 bg-orange-500 rounded-full transform rotate-30"></div>
                <div className="absolute -bottom-2 left-3 w-1 h-4 bg-orange-500 rounded-full transform rotate-15"></div>
                <div className="absolute -bottom-2 right-3 w-1 h-4 bg-orange-500 rounded-full transform -rotate-15"></div>
              </div>

              {/* 2. Girl in yellow hoodie - lunging */}
              <div className="relative">
                <div className="w-16 h-20 relative">
                  {/* Head */}
                  <div className="w-12 h-12 bg-pink-100 rounded-full relative">
                    {/* Brown hair */}
                    <div className="absolute -top-1 -left-1 w-14 h-8 bg-amber-800 rounded-t-3xl"></div>
                    {/* Eyes */}
                    <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    {/* Smile */}
                    <div className="absolute top-6 left-3 w-6 h-2 border-b-2 border-black rounded-b-full"></div>
                  </div>
                  
                  {/* Yellow hoodie body */}
                  <div className="absolute top-8 left-1 w-10 h-8 bg-yellow-500 rounded-lg"></div>
                  
                  {/* Arms */}
                  <div className="absolute top-10 -left-2 w-3 h-6 bg-pink-100 rounded-full transform -rotate-45"></div>
                  <div className="absolute top-10 right-0 w-3 h-6 bg-pink-100 rounded-full transform rotate-30"></div>
                  
                  {/* Legs in lunging position - purple pants */}
                  <div className="absolute top-14 left-2 w-3 h-10 bg-purple-600 rounded-full transform rotate-30"></div>
                  <div className="absolute top-16 right-2 w-3 h-8 bg-purple-600 rounded-full transform -rotate-45"></div>
                  
                  {/* Blue shoes */}
                  <div className="absolute bottom-2 left-0 w-5 h-2 bg-blue-500 rounded transform rotate-15"></div>
                  <div className="absolute bottom-0 right-0 w-5 h-2 bg-blue-500 rounded transform rotate-30"></div>
                </div>
              </div>

              {/* 3. Green apple */}
              <div className="w-10 h-10 bg-green-500 rounded-full relative shadow-lg">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-green-700 rounded-full"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-x-1 w-2 h-1 bg-green-600 rounded-full transform rotate-45"></div>
                <div className="absolute top-2 left-2 w-3 h-3 bg-green-300 rounded-full opacity-60"></div>
              </div>

              {/* 4. Boy in orange shirt - running */}
              <div className="relative">
                <div className="w-16 h-20 relative">
                  {/* Head */}
                  <div className="w-12 h-12 bg-amber-900 rounded-full relative">
                    {/* Dark curly hair */}
                    <div className="absolute -top-1 -left-1 w-14 h-8 bg-amber-950 rounded-t-3xl"></div>
                    <div className="absolute -top-0.5 left-1 w-3 h-3 bg-amber-950 rounded-full"></div>
                    <div className="absolute -top-0.5 right-1 w-3 h-3 bg-amber-950 rounded-full"></div>
                    <div className="absolute top-0 left-3 w-3 h-4 bg-amber-950 rounded-full"></div>
                    <div className="absolute top-0 right-3 w-3 h-4 bg-amber-950 rounded-full"></div>
                    {/* Eyes */}
                    <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    {/* Big smile */}
                    <div className="absolute top-6 left-2 w-8 h-3 border-b-3 border-black rounded-b-full"></div>
                  </div>
                  
                  {/* Orange shirt */}
                  <div className="absolute top-8 left-1 w-10 h-8 bg-orange-500 rounded-lg"></div>
                  
                  {/* Arms in running position */}
                  <div className="absolute top-10 -left-2 w-3 h-6 bg-amber-900 rounded-full transform -rotate-30"></div>
                  <div className="absolute top-10 right-0 w-3 h-6 bg-amber-900 rounded-full transform rotate-45"></div>
                  
                  {/* Legs running - dark pants */}
                  <div className="absolute top-14 left-3 w-3 h-10 bg-gray-800 rounded-full transform rotate-30"></div>
                  <div className="absolute top-16 right-3 w-3 h-8 bg-gray-800 rounded-full transform -rotate-15"></div>
                  
                  {/* Blue shoes */}
                  <div className="absolute bottom-2 left-2 w-5 h-2 bg-blue-600 rounded transform rotate-15"></div>
                  <div className="absolute bottom-0 right-2 w-5 h-2 bg-blue-600 rounded"></div>
                </div>
              </div>

              {/* 5. Girl with dark hair - standing */}
              <div className="relative">
                <div className="w-16 h-24 relative">
                  {/* Head */}
                  <div className="w-12 h-12 bg-yellow-100 rounded-full relative">
                    {/* Long dark hair */}
                    <div className="absolute -top-1 -left-1 w-14 h-8 bg-gray-900 rounded-t-3xl"></div>
                    <div className="absolute top-1 -left-0.5 w-3 h-12 bg-gray-900 rounded-full"></div>
                    <div className="absolute top-1 -right-0.5 w-3 h-12 bg-gray-900 rounded-full"></div>
                    {/* Eyes */}
                    <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    {/* Mouth */}
                    <div className="absolute top-6 left-4 w-4 h-1 border-b border-black rounded-b-full"></div>
                  </div>
                  
                  {/* Pink/red top */}
                  <div className="absolute top-8 left-1 w-10 h-8 bg-red-400 rounded-lg"></div>
                  
                  {/* Arms */}
                  <div className="absolute top-10 -left-2 w-3 h-6 bg-yellow-100 rounded-full"></div>
                  <div className="absolute top-10 right-0 w-3 h-6 bg-yellow-100 rounded-full"></div>
                  
                  {/* Yellow item being held */}
                  <div className="absolute top-8 right-2 w-2 h-3 bg-yellow-400 rounded-full"></div>
                  
                  {/* Blue jeans */}
                  <div className="absolute top-14 left-2 w-3 h-12 bg-blue-600 rounded-full"></div>
                  <div className="absolute top-14 right-2 w-3 h-12 bg-blue-600 rounded-full"></div>
                  
                  {/* Belt */}
                  <div className="absolute top-15 left-1 w-10 h-1 bg-blue-800 rounded"></div>
                  
                  {/* Blue shoes */}
                  <div className="absolute bottom-0 left-1 w-5 h-2 bg-blue-800 rounded"></div>
                  <div className="absolute bottom-0 right-1 w-5 h-2 bg-blue-800 rounded"></div>
                </div>
              </div>

              {/* Red apple on far right */}
              <div className="w-8 h-8 bg-red-500 rounded-full relative shadow-lg">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1.5 bg-green-700 rounded-full"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-x-1 w-1.5 h-1 bg-green-600 rounded-full transform rotate-45"></div>
                <div className="absolute top-1 left-1.5 w-2 h-2 bg-red-300 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-xl font-bold rounded-full shadow-lg border-none min-w-64">
              Get Started
            </Button>
            <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-12 py-4 text-xl font-medium rounded-full bg-white min-w-64">
              I already have an account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
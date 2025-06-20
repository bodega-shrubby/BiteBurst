import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section - Exact match to your uploaded design */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo and Title */}
          <div className="flex items-center justify-center mb-12">
            {/* Orange slice mascot waving */}
            <div className="w-20 h-20 relative mr-4 animate-bounce">
              {/* Orange slice body */}
              <div className="w-20 h-10 bg-orange-500 rounded-t-full relative overflow-hidden">
                {/* Orange segments */}
                <div className="absolute top-0 left-2 w-0 h-8 border-l-2 border-orange-400"></div>
                <div className="absolute top-0 left-6 w-0 h-8 border-l-2 border-orange-400"></div>
                <div className="absolute top-0 left-10 w-0 h-8 border-l-2 border-orange-400"></div>
                <div className="absolute top-0 left-14 w-0 h-8 border-l-2 border-orange-400"></div>
                {/* Orange peel */}
                <div className="absolute top-0 w-full h-2 bg-orange-600 rounded-t-full"></div>
              </div>
              
              {/* Eyes */}
              <div className="absolute top-2 left-4 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute top-2 right-4 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute top-3 left-5 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute top-3 right-5 w-1 h-1 bg-black rounded-full"></div>
              
              {/* Happy mouth */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-black rounded-b-full"></div>
              
              {/* Arms waving */}
              <div className="absolute top-3 -left-4 w-2 h-6 bg-orange-500 rounded-full transform -rotate-45"></div>
              <div className="absolute top-3 -right-4 w-2 h-6 bg-orange-500 rounded-full transform rotate-45"></div>
              
              {/* Legs */}
              <div className="absolute -bottom-4 left-6 w-2 h-6 bg-orange-500 rounded-full"></div>
              <div className="absolute -bottom-4 right-6 w-2 h-6 bg-orange-500 rounded-full"></div>
            </div>
            
            <h1 className="text-6xl font-bold text-orange-500">BiteBurst</h1>
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 max-w-4xl mx-auto leading-tight">
            The fun, gamified way to eat better<br />
            and move more!
          </h2>

          <p className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto">
            BiteBurst helps kids and teens learn what to eat, how to stay active, and how food fuels their goals.
          </p>

          {/* Character lineup with sparkles and food items */}
          <div className="flex justify-center items-end space-x-8 mb-16 relative">
            {/* Sparkles */}
            <div className="absolute top-0 left-20 text-yellow-400 text-2xl animate-pulse">✨</div>
            <div className="absolute top-10 right-20 text-yellow-400 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
            <div className="absolute top-5 left-1/2 text-yellow-400 text-lg animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
            
            {/* Orange mascot on left */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-8 bg-orange-500 rounded-t-full relative">
                <div className="absolute top-0 left-1 w-0 h-6 border-l border-orange-400"></div>
                <div className="absolute top-0 left-4 w-0 h-6 border-l border-orange-400"></div>
                <div className="absolute top-0 left-7 w-0 h-6 border-l border-orange-400"></div>
                <div className="absolute top-0 left-10 w-0 h-6 border-l border-orange-400"></div>
                <div className="absolute top-0 w-full h-1 bg-orange-600 rounded-t-full"></div>
                <div className="absolute top-1 left-3 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute top-1 right-3 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute top-2 left-4 w-0.5 h-0.5 bg-black rounded-full"></div>
                <div className="absolute top-2 right-4 w-0.5 h-0.5 bg-black rounded-full"></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b border-black rounded-b-full"></div>
                <div className="absolute top-2 -left-3 w-1 h-4 bg-orange-500 rounded-full transform -rotate-45"></div>
                <div className="absolute top-2 -right-3 w-1 h-4 bg-orange-500 rounded-full transform rotate-45"></div>
                <div className="absolute -bottom-3 left-4 w-1 h-4 bg-orange-500 rounded-full"></div>
                <div className="absolute -bottom-3 right-4 w-1 h-4 bg-orange-500 rounded-full"></div>
              </div>
            </div>

            {/* Girl with blonde hair */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="w-16 h-20 bg-pink-200 rounded-t-full relative">
                  <div className="absolute -top-1 w-full h-6 bg-yellow-600 rounded-t-full"></div>
                  <div className="absolute top-4 left-3 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-4 right-3 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-8 left-4 w-8 h-4 border-b-2 border-black rounded-b-full"></div>
                  <div className="absolute bottom-0 w-full h-10 bg-yellow-500 rounded-b-lg"></div>
                </div>
                <div className="absolute top-10 -left-3 w-4 h-3 bg-pink-200 rounded transform -rotate-45"></div>
                <div className="absolute top-10 -right-3 w-4 h-3 bg-pink-200 rounded transform rotate-45"></div>
                <div className="absolute -bottom-3 left-3 w-3 h-6 bg-purple-500 rounded"></div>
                <div className="absolute -bottom-3 right-3 w-3 h-6 bg-purple-500 rounded"></div>
                <div className="absolute -bottom-6 left-2 w-5 h-3 bg-blue-500 rounded"></div>
                <div className="absolute -bottom-6 right-2 w-5 h-3 bg-blue-500 rounded"></div>
              </div>
            </div>

            {/* Green apple floating */}
            <div className="animate-float">
              <div className="w-12 h-12 bg-green-500 rounded-full relative">
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-green-700 rounded-full"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-1 bg-green-600 rounded-full"></div>
              </div>
            </div>

            {/* Boy with dark skin */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="w-16 h-20 bg-orange-800 rounded-t-full relative">
                  <div className="absolute -top-1 w-full h-6 bg-black rounded-t-full"></div>
                  <div className="absolute top-4 left-3 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-4 right-3 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-8 left-4 w-8 h-4 border-b-2 border-black rounded-b-full"></div>
                  <div className="absolute bottom-0 w-full h-10 bg-orange-500 rounded-b-lg"></div>
                </div>
                <div className="absolute top-10 -left-3 w-4 h-3 bg-orange-800 rounded transform -rotate-45"></div>
                <div className="absolute top-10 -right-3 w-4 h-3 bg-orange-800 rounded transform rotate-45"></div>
                <div className="absolute -bottom-3 left-3 w-3 h-6 bg-blue-600 rounded"></div>
                <div className="absolute -bottom-3 right-3 w-3 h-6 bg-blue-600 rounded"></div>
                <div className="absolute -bottom-6 left-2 w-5 h-3 bg-blue-800 rounded"></div>
                <div className="absolute -bottom-6 right-2 w-5 h-3 bg-blue-800 rounded"></div>
              </div>
            </div>

            {/* XP sparkles */}
            <div className="flex flex-col items-center animate-float-delayed">
              <span className="text-yellow-500 font-bold text-lg">XP</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            {/* Girl with dark hair */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="w-16 h-20 bg-yellow-200 rounded-t-full relative">
                  <div className="absolute -top-1 w-full h-6 bg-black rounded-t-full"></div>
                  <div className="absolute top-4 left-3 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-4 right-3 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-8 left-4 w-8 h-4 border-b-2 border-black rounded-b-full"></div>
                  <div className="absolute bottom-0 w-full h-10 bg-red-500 rounded-b-lg"></div>
                </div>
                <div className="absolute top-10 -left-3 w-4 h-3 bg-yellow-200 rounded transform -rotate-45"></div>
                <div className="absolute top-10 -right-3 w-4 h-3 bg-yellow-200 rounded transform rotate-45"></div>
                <div className="absolute -bottom-3 left-3 w-3 h-6 bg-blue-500 rounded"></div>
                <div className="absolute -bottom-3 right-3 w-3 h-6 bg-blue-500 rounded"></div>
                <div className="absolute -bottom-6 left-2 w-5 h-3 bg-blue-600 rounded"></div>
                <div className="absolute -bottom-6 right-2 w-5 h-3 bg-blue-600 rounded"></div>
              </div>
            </div>

            {/* Red apple */}
            <div className="animate-float">
              <div className="w-12 h-12 bg-red-500 rounded-full relative">
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-green-700 rounded-full"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-1 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-bold rounded-full shadow-lg">
              Get Started
            </Button>
            <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-medium rounded-full">
              I already have an account
            </Button>
          </div>
        </div>
      </section>

      {/* Tap, snap, go Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
              Tap, snap, go
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Log what you eat with bubbles, or a quick photo. Select your activity and get instant feedback on how food helps your body.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left side - Food bubbles grid */}
            <div>
              <div className="grid grid-cols-2 gap-6">
                {/* Apple */}
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-200">
                  <div className="w-12 h-12 bg-red-500 rounded-full relative">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-green-700 rounded-full"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-1 bg-green-600 rounded-full"></div>
                  </div>
                </div>
                
                {/* Broccoli */}
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-200">
                  <div className="w-8 h-12 bg-green-500 rounded-t-full relative">
                    <div className="absolute bottom-0 w-2 h-4 bg-green-700 rounded mx-auto left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
                
                {/* Bread */}
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-200">
                  <div className="w-10 h-8 bg-yellow-600 rounded-lg relative">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-800 rounded-full"></div>
                    <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-800 rounded-full"></div>
                    <div className="absolute bottom-1 left-3 w-1 h-1 bg-yellow-800 rounded-full"></div>
                  </div>
                </div>
                
                {/* Juice */}
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-200">
                  <div className="w-6 h-10 bg-orange-500 rounded-lg relative">
                    <div className="absolute top-0 w-full h-6 bg-orange-400 rounded-t-lg"></div>
                  </div>
                </div>
              </div>
              
              {/* Activity icons */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                {/* Soccer */}
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-200 border-4 border-gray-200">
                  <div className="w-12 h-12 bg-white border-4 border-black rounded-full relative">
                    <div className="absolute top-1 left-1 w-3 h-3 border-2 border-black rounded-full"></div>
                    <div className="absolute top-1 right-1 w-3 h-3 border-2 border-black rounded-full"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 border-2 border-black rounded-full"></div>
                  </div>
                </div>
                
                {/* Running */}
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-200">
                  <div className="text-orange-600 text-2xl">🏃</div>
                </div>
                
                {/* Target/Focus */}
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-200">
                  <div className="w-12 h-12 border-4 border-red-500 rounded-full relative">
                    <div className="absolute inset-2 border-2 border-red-500 rounded-full"></div>
                    <div className="absolute inset-4 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                
                {/* Meditation */}
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-200">
                  <div className="w-8 h-10 bg-blue-500 rounded-t-full relative">
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rounded-full"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-2 border-b-2 border-black rounded-b-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Phone with orange mascot */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Phone */}
                <div className="w-64 h-96 bg-orange-500 rounded-3xl p-4 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-2xl p-4 relative">
                    {/* Camera icon */}
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-white rounded-full relative">
                          <div className="absolute inset-2 bg-blue-500 rounded-full"></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Photo of watermelon slices */}
                    <div className="bg-blue-100 rounded-lg p-4 mb-4">
                      <div className="flex justify-center space-x-2">
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="absolute inset-1 bg-red-500 rounded-full"></div>
                          <div className="absolute top-2 left-3 w-1 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-2 right-3 w-1 h-1 bg-black rounded-full"></div>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="absolute inset-1 bg-red-500 rounded-full"></div>
                          <div className="absolute top-2 left-3 w-1 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-2 right-3 w-1 h-1 bg-black rounded-full"></div>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                          <div className="absolute inset-1 bg-red-500 rounded-full"></div>
                          <div className="absolute top-2 left-3 w-1 h-1 bg-black rounded-full"></div>
                          <div className="absolute top-2 right-3 w-1 h-1 bg-black rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Orange mascot attached to phone */}
                <div className="absolute -bottom-4 -right-4">
                  <div className="w-16 h-8 bg-orange-500 rounded-t-full relative">
                    <div className="absolute top-0 left-1 w-0 h-6 border-l border-orange-400"></div>
                    <div className="absolute top-0 left-3 w-0 h-6 border-l border-orange-400"></div>
                    <div className="absolute top-0 left-5 w-0 h-6 border-l border-orange-400"></div>
                    <div className="absolute top-0 left-7 w-0 h-6 border-l border-orange-400"></div>
                    <div className="absolute top-0 w-full h-1 bg-orange-600 rounded-t-full"></div>
                    <div className="absolute top-1 left-3 w-2 h-2 bg-white rounded-full"></div>
                    <div className="absolute top-1 right-3 w-2 h-2 bg-white rounded-full"></div>
                    <div className="absolute top-2 left-4 w-0.5 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-2 right-4 w-0.5 h-0.5 bg-black rounded-full"></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b border-black rounded-b-full"></div>
                    <div className="absolute top-2 -left-3 w-1 h-4 bg-orange-500 rounded-full transform -rotate-45"></div>
                    <div className="absolute top-2 -right-3 w-1 h-4 bg-orange-500 rounded-full transform rotate-45"></div>
                    <div className="absolute -bottom-3 left-4 w-1 h-4 bg-orange-500 rounded-full"></div>
                    <div className="absolute -bottom-3 right-4 w-1 h-4 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* XP Section - Healthy is the new high score */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
            Healthy is the<br />new high score.
          </h2>
          
          <p className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto">
            Every time you log a meal or workout, you earn XP. Keep your streak alive and unlock cool badges. Your mascot will cheer you on!
          </p>

          {/* XP Progress visualization */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-6">
              <span className="text-5xl font-bold text-gray-900">25</span>
              <div className="w-80 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 h-6 rounded-full transition-all duration-1000 ease-out w-4/5"></div>
              </div>
              <span className="text-3xl text-gray-500 font-bold">30</span>
              <div className="text-4xl">🔥</div>
            </div>
          </div>

          {/* Celebrating orange mascot */}
          <div className="mb-12">
            <div className="inline-block relative">
              {/* Main orange body */}
              <div className="w-32 h-16 bg-orange-500 rounded-t-full relative animate-bounce">
                {/* Orange segments */}
                <div className="absolute top-0 left-4 w-0 h-12 border-l-2 border-orange-400"></div>
                <div className="absolute top-0 left-8 w-0 h-12 border-l-2 border-orange-400"></div>
                <div className="absolute top-0 left-12 w-0 h-12 border-l-2 border-orange-400"></div>
                <div className="absolute top-0 left-16 w-0 h-12 border-l-2 border-orange-400"></div>
                <div className="absolute top-0 left-20 w-0 h-12 border-l-2 border-orange-400"></div>
                <div className="absolute top-0 left-24 w-0 h-12 border-l-2 border-orange-400"></div>
                
                {/* Orange peel */}
                <div className="absolute top-0 w-full h-3 bg-orange-600 rounded-t-full"></div>
                
                {/* Eyes */}
                <div className="absolute top-3 left-6 w-4 h-4 bg-white rounded-full"></div>
                <div className="absolute top-3 right-6 w-4 h-4 bg-white rounded-full"></div>
                <div className="absolute top-4 left-7 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute top-4 right-7 w-2 h-2 bg-black rounded-full"></div>
                
                {/* Happy mouth */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-4 border-b-3 border-black rounded-b-full"></div>
                
                {/* Thumbs up */}
                <div className="absolute top-2 -right-8 w-3 h-6 bg-orange-500 rounded-full transform rotate-12"></div>
                <div className="absolute top-1 -right-9 w-4 h-3 bg-orange-500 rounded-full"></div>
                
                {/* Arms */}
                <div className="absolute top-6 -left-8 w-8 h-2 bg-orange-500 rounded-full"></div>
                <div className="absolute top-6 -right-8 w-8 h-2 bg-orange-500 rounded-full"></div>
                
                {/* Legs with rocket flames */}
                <div className="absolute -bottom-2 left-10 w-2 h-6 bg-orange-500 rounded-full"></div>
                <div className="absolute -bottom-2 right-10 w-2 h-6 bg-orange-500 rounded-full"></div>
                
                {/* Rocket flames */}
                <div className="absolute -bottom-4 left-9 w-4 h-3 bg-yellow-400 rounded-b-full"></div>
                <div className="absolute -bottom-4 right-9 w-4 h-3 bg-yellow-400 rounded-b-full"></div>
                <div className="absolute -bottom-6 left-8 w-6 h-2 bg-red-500 rounded-b-full"></div>
                <div className="absolute -bottom-6 right-8 w-6 h-2 bg-red-500 rounded-b-full"></div>
                
                {/* Blue shoes */}
                <div className="absolute -bottom-3 left-6 w-6 h-4 bg-blue-500 rounded-full"></div>
                <div className="absolute -bottom-3 right-6 w-6 h-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Achievement badges */}
          <div className="flex justify-center space-x-8 mb-12">
            {/* Star badge */}
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-200 shadow-lg">
              <div className="w-8 h-8 bg-yellow-600 star-shape relative">
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs">★</div>
              </div>
            </div>
            
            {/* Apple badge */}
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200 shadow-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full relative">
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-green-700 rounded-full"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-1 bg-green-600 rounded-full"></div>
              </div>
            </div>
            
            {/* Carrot badge */}
            <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200 shadow-lg">
              <div className="w-2 h-8 bg-orange-500 rounded-full relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* BiteBurst logo */}
          <div className="flex items-center justify-center">
            <div className="w-8 h-4 bg-orange-500 rounded-t-full relative mr-3">
              <div className="absolute top-0 left-1 w-0 h-3 border-l border-orange-400"></div>
              <div className="absolute top-0 left-2 w-0 h-3 border-l border-orange-400"></div>
              <div className="absolute top-0 left-3 w-0 h-3 border-l border-orange-400"></div>
              <div className="absolute top-0 w-full h-0.5 bg-orange-600 rounded-t-full"></div>
            </div>
            <span className="text-2xl font-bold text-orange-500">BiteBurst</span>
          </div>
        </div>
      </section>
    </div>
  );
}
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section - Exact match to Image 7 Design */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo and Title */}
          <div className="flex items-center justify-center mb-12">
            <div className="w-16 h-16 bg-orange-500 rounded-full relative mr-4">
              <div className="absolute inset-2 bg-orange-400 rounded-full"></div>
              <div className="absolute top-3 left-3 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute top-4 left-4 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute top-4 right-4 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-black rounded-b-full"></div>
            </div>
            <h1 className="text-6xl font-bold text-orange-500">BiteBurst</h1>
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 max-w-4xl mx-auto">
            The fun, gamified way to eat better and move more!
          </h2>

          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
            BiteBurst makes building healthy habits fun for kids aged 6-14. Track your meals, earn XP, unlock badges, and get personalized AI feedback that helps you grow stronger, smarter, and more energetic!
          </p>

          {/* Character lineup - exactly like Image 7 */}
          <div className="flex justify-center items-end space-x-8 mb-16">
            {/* Child 1 - Blonde girl */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="w-20 h-28 bg-pink-300 rounded-t-full relative">
                  <div className="absolute -top-2 w-full h-8 bg-yellow-500 rounded-t-full"></div>
                  <div className="absolute top-6 left-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-6 right-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute bottom-0 w-full h-12 bg-purple-500 rounded-b-lg"></div>
                </div>
                <div className="absolute -bottom-4 left-3 w-4 h-8 bg-blue-500 rounded"></div>
                <div className="absolute -bottom-4 right-3 w-4 h-8 bg-blue-500 rounded"></div>
              </div>
            </div>

            {/* Orange slice mascot - center and larger */}
            <div className="transform hover:scale-110 transition-all duration-300 animate-bounce">
              <div className="w-24 h-24 bg-orange-500 rounded-full relative">
                <div className="absolute inset-2 bg-orange-400 rounded-full"></div>
                <div className="absolute top-4 left-4 w-4 h-4 bg-white rounded-full"></div>
                <div className="absolute top-4 right-4 w-4 h-4 bg-white rounded-full"></div>
                <div className="absolute top-5 left-5 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute top-5 right-5 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-8 h-4 border-b-3 border-black rounded-b-full"></div>
                {/* Arms */}
                <div className="absolute top-8 -left-6 w-8 h-2 bg-orange-500 rounded-full"></div>
                <div className="absolute top-8 -right-6 w-8 h-2 bg-orange-500 rounded-full"></div>
                {/* Legs */}
                <div className="absolute -bottom-2 left-8 w-2 h-6 bg-orange-500 rounded-full"></div>
                <div className="absolute -bottom-2 right-8 w-2 h-6 bg-orange-500 rounded-full"></div>
              </div>
            </div>

            {/* Child 2 - Dark-skinned boy */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="w-20 h-28 bg-orange-700 rounded-t-full relative">
                  <div className="absolute -top-2 w-full h-8 bg-black rounded-t-full"></div>
                  <div className="absolute top-6 left-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-6 right-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute bottom-0 w-full h-12 bg-green-500 rounded-b-lg"></div>
                </div>
                <div className="absolute -bottom-4 left-3 w-4 h-8 bg-gray-600 rounded"></div>
                <div className="absolute -bottom-4 right-3 w-4 h-8 bg-gray-600 rounded"></div>
              </div>
            </div>

            {/* Child 3 - Asian girl */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="w-20 h-28 bg-yellow-200 rounded-t-full relative">
                  <div className="absolute -top-2 w-full h-8 bg-black rounded-t-full"></div>
                  <div className="absolute top-6 left-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-6 right-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute bottom-0 w-full h-12 bg-red-500 rounded-b-lg"></div>
                </div>
                <div className="absolute -bottom-4 left-3 w-4 h-8 bg-black rounded"></div>
                <div className="absolute -bottom-4 right-3 w-4 h-8 bg-black rounded"></div>
              </div>
            </div>
          </div>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-xl font-bold rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg">
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Scientific Backing Section - Image 2 Design */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-block animate-bounce mb-4">
              <div className="w-20 h-20 bg-orange-500 rounded-full relative">
                <div className="absolute inset-2 bg-orange-400 rounded-full"></div>
                <div className="absolute top-4 left-4 w-3 h-3 bg-white rounded-full"></div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-white rounded-full"></div>
                <div className="absolute top-5 left-5 w-1 h-1 bg-black rounded-full"></div>
                <div className="absolute top-5 right-5 w-1 h-1 bg-black rounded-full"></div>
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-black rounded-b-full"></div>
                {/* Arms */}
                <div className="absolute top-6 -left-4 w-6 h-1.5 bg-orange-500 rounded-full"></div>
                <div className="absolute top-6 -right-4 w-6 h-1.5 bg-orange-500 rounded-full"></div>
                {/* Legs */}
                <div className="absolute -bottom-1 left-6 w-1.5 h-4 bg-orange-500 rounded-full"></div>
                <div className="absolute -bottom-1 right-6 w-1.5 h-4 bg-orange-500 rounded-full"></div>
              </div>
            </div>
            <h2 className="text-5xl font-bold text-orange-500 mb-4">BiteBurst</h2>
          </div>

          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-green-500">Backed by science,</span><br />
            <span className="text-gray-900">built for fun.</span>
          </h3>

          <p className="text-2xl text-orange-500 font-bold mb-6">
            Designed with experts. Loved by kids.
          </p>

          <p className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto">
            BiteBurst combines real health science, positive coaching, and playful design to help you build habits that last.
          </p>

          {/* Illustration with scientist, mascot, and kid */}
          <div className="flex justify-center items-center space-x-12">
            {/* Scientist with glasses and lab coat */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="w-24 h-32 bg-pink-200 rounded-t-full relative">
                  <div className="absolute -top-2 w-full h-8 bg-blue-800 rounded-t-full"></div>
                  <div className="absolute top-8 left-2 w-20 h-12 border-4 border-blue-400 rounded-full bg-transparent"></div>
                  <div className="absolute top-10 left-4 w-6 h-6 border-2 border-blue-400 rounded-full bg-transparent"></div>
                  <div className="absolute top-10 right-4 w-6 h-6 border-2 border-blue-400 rounded-full bg-transparent"></div>
                  <div className="absolute top-12 left-6 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-12 right-6 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute bottom-0 w-full h-16 bg-white rounded-b-lg border-2 border-blue-300"></div>
                </div>
                <div className="absolute top-16 -left-4 w-6 h-4 bg-pink-200 rounded transform -rotate-45"></div>
                <div className="absolute top-16 -right-4 w-6 h-4 bg-pink-200 rounded transform rotate-45"></div>
                <div className="absolute -bottom-4 left-6 w-4 h-8 bg-blue-600 rounded"></div>
                <div className="absolute -bottom-4 right-6 w-4 h-8 bg-blue-600 rounded"></div>
              </div>
            </div>

            {/* Orange slice mascot with thumbs up */}
            <div className="animate-wiggle">
              <div className="w-20 h-20 bg-orange-500 rounded-full relative">
                <div className="absolute inset-2 bg-orange-400 rounded-full"></div>
                <div className="absolute top-4 left-4 w-3 h-3 bg-white rounded-full"></div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-white rounded-full"></div>
                <div className="absolute top-5 left-5 w-1 h-1 bg-black rounded-full"></div>
                <div className="absolute top-5 right-5 w-1 h-1 bg-black rounded-full"></div>
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-black rounded-b-full"></div>
                {/* Thumbs up gestures */}
                <div className="absolute top-4 -left-8 w-2 h-4 bg-orange-500 rounded transform rotate-12"></div>
                <div className="absolute top-2 -left-9 w-3 h-2 bg-orange-500 rounded-full"></div>
                <div className="absolute top-4 -right-8 w-2 h-4 bg-orange-500 rounded transform -rotate-12"></div>
                <div className="absolute top-2 -right-9 w-3 h-2 bg-orange-500 rounded-full"></div>
                {/* Legs */}
                <div className="absolute -bottom-1 left-6 w-1.5 h-4 bg-orange-500 rounded-full"></div>
                <div className="absolute -bottom-1 right-6 w-1.5 h-4 bg-orange-500 rounded-full"></div>
              </div>
            </div>

            {/* Happy child */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="w-24 h-32 bg-orange-400 rounded-t-full relative">
                  <div className="absolute -top-2 w-full h-8 bg-orange-800 rounded-t-full"></div>
                  <div className="absolute top-8 left-6 w-3 h-3 bg-black rounded-full"></div>
                  <div className="absolute top-8 right-6 w-3 h-3 bg-black rounded-full"></div>
                  <div className="absolute top-16 left-6 w-12 h-6 border-b-4 border-black rounded-b-full"></div>
                  <div className="absolute bottom-0 w-full h-16 bg-orange-500 rounded-b-lg"></div>
                </div>
                <div className="absolute top-16 -left-4 w-6 h-4 bg-orange-400 rounded transform -rotate-45"></div>
                <div className="absolute top-16 -right-4 w-6 h-4 bg-orange-400 rounded transform rotate-45"></div>
                <div className="absolute -bottom-4 left-6 w-4 h-8 bg-blue-600 rounded"></div>
                <div className="absolute -bottom-4 right-6 w-4 h-8 bg-blue-600 rounded"></div>
              </div>
            </div>
          </div>

          {/* Science icons floating */}
          <div className="flex justify-center mt-12 space-x-16">
            <span className="text-4xl animate-float">🍊</span>
            <span className="text-4xl animate-float-delayed">🧪</span>
          </div>
        </div>
      </section>

      {/* AI Section - Healthy habits, powered by AI */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
              Healthy habits,<br />powered by AI.
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Get personalized feedback that's designed for your age, goals, and interests. Our AI explains the "why" behind healthy choices in a way that's fun and easy to understand.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left side - Eye Scanner visual */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Eye scanner circle */}
                <div className="w-80 h-80 border-4 border-blue-400 rounded-full relative animate-pulse">
                  <div className="absolute inset-8 border-2 border-blue-300 rounded-full"></div>
                  <div className="absolute inset-16 border-2 border-blue-200 rounded-full"></div>
                  
                  {/* Central eye */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-blue-500 rounded-full relative">
                      <div className="absolute inset-2 bg-white rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-800 rounded-full"></div>
                      <div className="absolute top-2 left-6 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Scanning lines */}
                  <div className="absolute top-0 left-1/2 w-0.5 h-full bg-blue-400 animate-ping"></div>
                  <div className="absolute left-0 top-1/2 h-0.5 w-full bg-blue-400 animate-ping"></div>
                </div>

                {/* Food items being scanned */}
                <div className="absolute -top-8 -left-8 animate-float">
                  <span className="text-4xl">🍎</span>
                </div>
                <div className="absolute -top-8 -right-8 animate-float-delayed">
                  <span className="text-4xl">🥦</span>
                </div>
                <div className="absolute -bottom-8 -left-8 animate-float">
                  <span className="text-4xl">🥕</span>
                </div>
                <div className="absolute -bottom-8 -right-8 animate-float-delayed">
                  <span className="text-4xl">🥛</span>
                </div>
              </div>
            </div>

            {/* Right side - AI Feedback Display */}
            <div>
              <div className="bg-blue-50 border-4 border-blue-200 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-full relative mr-4">
                    <div className="absolute inset-2 bg-blue-400 rounded-full"></div>
                    <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
                    <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b border-white rounded-b-full"></div>
                  </div>
                  <h4 className="text-2xl font-bold text-blue-800">AI Coach</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
                    <p className="font-bold text-green-700 mb-2">Great choice! 🍎</p>
                    <p className="text-gray-700">Apples have fiber that helps your body feel full and gives you steady energy for school!</p>
                    <div className="mt-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">+5 XP</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
                    <p className="font-bold text-blue-700 mb-2">Nice work! 🥦</p>
                    <p className="text-gray-700">Broccoli is like tiny trees that help your brain think better. Perfect for focusing on homework!</p>
                    <div className="mt-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">+3 XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Logging Section - Tap, snap, go */}
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

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Emoji bubbles */}
            <div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-red-100 hover:bg-red-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🍎
                </div>
                <div className="bg-green-100 hover:bg-green-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🥦
                </div>
                <div className="bg-yellow-100 hover:bg-yellow-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🍌
                </div>
                <div className="bg-orange-100 hover:bg-orange-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🥕
                </div>
                <div className="bg-purple-100 hover:bg-purple-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🍇
                </div>
                <div className="bg-blue-100 hover:bg-blue-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🥛
                </div>
              </div>
              
              <p className="text-lg font-bold text-gray-900 mb-4">Quick & Easy Logging</p>
              <p className="text-gray-700">Just tap the food you ate! Our smart system recognizes hundreds of foods and gives you instant feedback.</p>
            </div>

            {/* Right side - Phone mockup with watermelon */}
            <div className="flex justify-center">
              <div className="bg-gray-900 p-2 rounded-3xl shadow-2xl">
                <div className="bg-white rounded-2xl p-6 w-80 h-96 relative overflow-hidden">
                  {/* Phone header */}
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-bold text-gray-900">Today's Log</h4>
                    <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                  </div>
                  
                  {/* Watermelon showcase - exactly like the image */}
                  <div className="text-center mb-6">
                    <div className="inline-block relative">
                      <span className="text-8xl animate-bounce">🍉</span>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">+7</span>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mt-2">Watermelon</p>
                    <p className="text-sm text-gray-600">Perfect for hydration!</p>
                  </div>
                  
                  {/* Activity buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg text-center transition-colors">
                      <span className="text-2xl block mb-1">⚽</span>
                      <span className="text-xs font-bold">Sports</span>
                    </button>
                    <button className="bg-green-100 hover:bg-green-200 p-3 rounded-lg text-center transition-colors">
                      <span className="text-2xl block mb-1">🧘</span>
                      <span className="text-xs font-bold">Calm</span>
                    </button>
                  </div>
                </div>

                {/* Mascot attached to phone */}
                <div className="absolute -bottom-8 -right-8 animate-bounce">
                  <div className="w-20 h-20 bg-orange-500 rounded-full relative">
                    <div className="absolute inset-1 bg-orange-400 rounded-full"></div>
                    <div className="absolute top-3 left-3 w-3 h-3 bg-white rounded-full"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full"></div>
                    <div className="absolute top-4 left-4 w-1 h-1 bg-black rounded-full"></div>
                    <div className="absolute top-4 right-4 w-1 h-1 bg-black rounded-full"></div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-black rounded-b-full"></div>
                    {/* Arms */}
                    <div className="absolute top-6 -left-4 w-6 h-1.5 bg-orange-500 rounded-full"></div>
                    <div className="absolute top-6 -right-4 w-6 h-1.5 bg-orange-500 rounded-full"></div>
                    {/* Legs */}
                    <div className="absolute -bottom-1 left-6 w-1.5 h-4 bg-orange-500 rounded-full"></div>
                    <div className="absolute -bottom-1 right-6 w-1.5 h-4 bg-orange-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* XP Rewards Section - Image 4 Design */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
            Healthy is the<br />new high score.
          </h2>
          
          <p className="text-xl text-gray-700 mb-16 max-w-3xl mx-auto">
            Every time you log a meal or workout, you earn XP. Keep your streak alive and unlock cool badges. Your mascot will cheer you on!
          </p>

          {/* XP Progress Bar - exactly like Image 4 */}
          <div className="flex items-center justify-between mb-4 max-w-md mx-auto">
            <span className="text-4xl font-bold text-gray-900">25</span>
            <div className="flex items-center space-x-4">
              <div className="w-64 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 h-8 rounded-full transition-all duration-1000 ease-out" style={{ width: '83%' }}></div>
              </div>
              <span className="text-2xl text-gray-500 font-bold">30</span>
            </div>
            <div className="text-4xl animate-bounce">🔥</div>
          </div>

          {/* Mascot celebration - exactly like Image 4 */}
          <div className="mb-12">
            <div className="inline-block relative">
              <div className="w-32 h-32 bg-orange-500 rounded-full relative animate-bounce">
                <div className="absolute inset-2 bg-orange-400 rounded-full"></div>
                
                {/* Eyes */}
                <div className="absolute top-6 left-6 w-6 h-6 bg-white rounded-full"></div>
                <div className="absolute top-6 right-6 w-6 h-6 bg-white rounded-full"></div>
                <div className="absolute top-8 left-8 w-2 h-2 bg-black rounded-full"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-black rounded-full"></div>
                
                {/* Big smile */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-6 border-b-4 border-black rounded-b-full"></div>
                
                {/* Thumbs up gesture */}
                <div className="absolute top-4 -right-8 w-4 h-8 bg-orange-500 rounded transform rotate-12"></div>
                <div className="absolute top-2 -right-9 w-6 h-4 bg-orange-500 rounded-full"></div>
                
                {/* Arms */}
                <div className="absolute top-12 -left-8 w-12 h-3 bg-orange-500 rounded-full"></div>
                <div className="absolute top-12 -right-8 w-12 h-3 bg-orange-500 rounded-full"></div>
                
                {/* Legs with rocket flames */}
                <div className="absolute -bottom-2 left-10 w-3 h-8 bg-orange-500 rounded-full"></div>
                <div className="absolute -bottom-2 right-10 w-3 h-8 bg-orange-500 rounded-full"></div>
                
                {/* Rocket flames */}
                <div className="absolute -bottom-6 left-9 w-5 h-4 bg-yellow-400 rounded-b-full"></div>
                <div className="absolute -bottom-6 right-9 w-5 h-4 bg-yellow-400 rounded-b-full"></div>
                <div className="absolute -bottom-8 left-8 w-7 h-3 bg-red-500 rounded-b-full"></div>
                <div className="absolute -bottom-8 right-8 w-7 h-3 bg-red-500 rounded-b-full"></div>
                
                {/* Blue shoes */}
                <div className="absolute -bottom-4 left-6 w-8 h-6 bg-blue-500 rounded-full"></div>
                <div className="absolute -bottom-4 right-6 w-8 h-6 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Badges - exactly like Image 4 */}
          <div className="flex justify-center space-x-8 mb-12">
            {/* Star badge */}
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-200 shadow-lg">
              <span className="text-3xl">⭐</span>
            </div>
            
            {/* Apple badge */}
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200 shadow-lg">
              <span className="text-3xl">🍎</span>
            </div>
            
            {/* Carrot badge */}
            <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200 shadow-lg">
              <span className="text-3xl">🥕</span>
            </div>
          </div>

          {/* BiteBurst logo */}
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full relative mr-3">
              <div className="absolute inset-1 bg-orange-400 rounded-full"></div>
              <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b border-black rounded-b-full"></div>
            </div>
            <span className="text-2xl font-bold text-orange-500">BiteBurst</span>
          </div>
        </div>
      </section>

      {/* CTA Section - Image 1 Design */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden">
        {/* Animated background sparkles */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-yellow-200 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-10 right-10 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-yellow-200 rounded-full animate-ping" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            READY TO BURST<br />WITH HEALTH?
          </h2>
          
          <p className="text-xl text-white mb-12 opacity-90">
            Join thousands of kids building healthy habits with BiteBurst.
          </p>

          {/* Treasure chest with animated items - exactly like Image 1 */}
          <div className="mb-12 relative">
            <div className="inline-block relative">
              {/* Treasure chest */}
              <div className="w-32 h-24 bg-yellow-600 rounded-lg relative mx-auto shadow-2xl">
                <div className="absolute top-0 w-full h-6 bg-yellow-700 rounded-t-lg"></div>
                <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-900 rounded-full"></div>
                <div className="absolute top-6 left-8 w-16 h-12 bg-yellow-500 rounded"></div>
                <div className="absolute top-4 left-12 w-8 h-2 bg-yellow-800 rounded"></div>
              </div>
              
              {/* Animated items floating out */}
              <div className="absolute -top-8 left-2 animate-float">
                <span className="text-3xl">🍎</span>
              </div>
              <div className="absolute -top-6 right-2 animate-float-delayed">
                <span className="text-3xl">🥦</span>
              </div>
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 animate-float">
                <span className="text-2xl">🥕</span>
              </div>
              <div className="absolute -top-4 left-6 animate-float-delayed">
                <span className="text-2xl">🥛</span>
              </div>
              <div className="absolute -top-8 right-6 animate-float">
                <span className="text-2xl">⚽</span>
              </div>
              <div className="absolute -top-6 left-12 animate-float-delayed">
                <span className="text-xl font-bold text-yellow-300">XP</span>
              </div>
              <div className="absolute -top-4 right-12 animate-float">
                <span className="text-2xl">🏃‍♂️</span>
              </div>
            </div>
          </div>

          <Button className="bg-white text-orange-500 hover:bg-orange-50 px-12 py-4 text-xl font-bold rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg">
            LET'S GO!
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-500 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* About Us */}
            <div>
              <h3 className="text-2xl font-bold mb-6">About Us</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">Our Mission</a></li>
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">How it Works</a></li>
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">For Parents</a></li>
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">Research</a></li>
              </ul>
            </div>

            {/* Help and Support */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Help and Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">Getting Started</a></li>
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">FAQ</a></li>
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">Safety</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Social</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">TikTok</a></li>
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">Instagram</a></li>
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">YouTube</a></li>
                <li><a href="#" className="hover:text-orange-200 transition-colors duration-200">Blog</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-orange-400 mt-12 pt-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-white rounded-full relative mr-3">
                <div className="absolute inset-1 bg-orange-500 rounded-full"></div>
                <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-1.5 border-b border-white rounded-b-full"></div>
              </div>
              <span className="text-xl font-bold">BiteBurst</span>
            </div>
            <p className="text-orange-200">
              © 2025 BiteBurst. Making healthy habits fun for kids everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
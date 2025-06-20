import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Image 7 Design */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo and Mascot */}
          <div className="flex items-center justify-center mb-8">
            <div className="animate-bounce mr-6">
              {/* Orange slice mascot with arms and legs */}
              <svg width="120" height="120" viewBox="0 0 200 200" className="drop-shadow-lg">
                {/* Orange slice body */}
                <path d="M100 30 C140 30 170 70 170 100 C170 130 140 170 100 170 C60 170 30 130 30 100 C30 70 60 30 100 30 Z" fill="#FF6B35"/>
                <path d="M100 40 C130 40 155 75 155 100 C155 125 130 160 100 160 C70 160 45 125 45 100 C45 75 70 40 100 40 Z" fill="#FFA500"/>
                
                {/* Orange segments */}
                <path d="M100 50 L100 150 M85 60 L115 140 M115 60 L85 140" stroke="#FF6B35" strokeWidth="3"/>
                
                {/* Eyes */}
                <circle cx="85" cy="90" r="12" fill="white"/>
                <circle cx="115" cy="90" r="12" fill="white"/>
                <circle cx="85" cy="90" r="6" fill="black"/>
                <circle cx="115" cy="90" r="6" fill="black"/>
                
                {/* Smile */}
                <path d="M75 115 Q100 135 125 115" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round"/>
                
                {/* Arms */}
                <rect x="20" y="95" width="25" height="8" fill="#FF6B35" rx="4"/>
                <rect x="155" y="95" width="25" height="8" fill="#FF6B35" rx="4"/>
                
                {/* Legs */}
                <rect x="85" y="170" width="8" height="20" fill="#FF6B35" rx="4"/>
                <rect x="107" y="170" width="8" height="20" fill="#FF6B35" rx="4"/>
                
                {/* Hands waving */}
                <circle cx="32" cy="85" r="8" fill="#FF6B35"/>
                <circle cx="168" cy="85" r="8" fill="#FF6B35"/>
                
                {/* Feet */}
                <ellipse cx="89" cy="195" rx="12" ry="6" fill="#FF6B35"/>
                <ellipse cx="111" cy="195" rx="12" ry="6" fill="#FF6B35"/>
              </svg>
            </div>
            <h1 className="text-7xl font-bold text-orange-500">BiteBurst</h1>
          </div>

          {/* Main Tagline */}
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            The fun, gamified way to eat better<br />and move more!
          </h2>

          {/* Subtitle */}
          <p className="text-2xl text-gray-700 mb-16 max-w-4xl mx-auto">
            BiteBurst helps kids and teens learn what to eat, how to stay active, and how food fuels their goals.
          </p>

          {/* Diverse Children Characters - Following exact design */}
          <div className="flex justify-center items-center space-x-12 mb-16">
            {/* Orange slice mascot (left) */}
            <div className="animate-wiggle">
              <svg width="80" height="80" viewBox="0 0 120 120">
                <path d="M60 15 C85 15 105 40 105 60 C105 80 85 105 60 105 C35 105 15 80 15 60 C15 40 35 15 60 15 Z" fill="#FF6B35"/>
                <circle cx="50" cy="50" r="6" fill="white"/>
                <circle cx="70" cy="50" r="6" fill="white"/>
                <circle cx="50" cy="50" r="3" fill="black"/>
                <circle cx="70" cy="50" r="3" fill="black"/>
                <path d="M45 70 Q60 80 75 70" stroke="black" strokeWidth="2" fill="none"/>
                <rect x="10" y="55" width="15" height="5" fill="#FF6B35" rx="2"/>
                <rect x="95" y="55" width="15" height="5" fill="#FF6B35" rx="2"/>
                <rect x="55" y="105" width="5" height="12" fill="#FF6B35" rx="2"/>
                <rect x="65" y="105" width="5" height="12" fill="#FF6B35" rx="2"/>
              </svg>
            </div>

            {/* Girl in yellow (exercising) */}
            <div className="transform hover:scale-110 hover:-translate-y-3 transition-all duration-300 cursor-pointer">
              <div className="relative">
                {/* Body */}
                <div className="w-20 h-28 bg-yellow-400 rounded-t-full relative">
                  {/* Hair */}
                  <div className="absolute -top-2 w-full h-8 bg-yellow-600 rounded-t-full"></div>
                  {/* Eyes */}
                  <div className="absolute top-6 left-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-6 right-4 w-2 h-2 bg-black rounded-full"></div>
                  {/* Mouth */}
                  <div className="absolute top-10 left-6 w-1 h-1 bg-pink-400 rounded-full"></div>
                  {/* Shirt */}
                  <div className="absolute bottom-0 w-full h-12 bg-purple-500 rounded-b-lg"></div>
                </div>
                {/* Legs */}
                <div className="absolute -bottom-3 left-3 w-4 h-8 bg-blue-500 rounded"></div>
                <div className="absolute -bottom-3 right-3 w-4 h-8 bg-blue-500 rounded"></div>
                {/* Arms in motion */}
                <div className="absolute top-12 -left-2 w-3 h-6 bg-yellow-400 rounded transform -rotate-45"></div>
                <div className="absolute top-12 -right-2 w-3 h-6 bg-yellow-400 rounded transform rotate-45"></div>
              </div>
            </div>

            {/* Green apple */}
            <div className="animate-bounce">
              <span className="text-6xl">🍎</span>
            </div>

            {/* Boy in orange (running) */}
            <div className="transform hover:scale-110 hover:-translate-y-3 transition-all duration-300 cursor-pointer">
              <div className="relative">
                {/* Body */}
                <div className="w-20 h-28 bg-orange-600 rounded-t-full relative">
                  {/* Hair */}
                  <div className="absolute -top-2 w-full h-8 bg-orange-800 rounded-t-full"></div>
                  {/* Eyes */}
                  <div className="absolute top-6 left-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-6 right-4 w-2 h-2 bg-black rounded-full"></div>
                  {/* Smile */}
                  <div className="absolute top-10 left-6 w-1 h-1 bg-pink-400 rounded-full"></div>
                  {/* Shirt */}
                  <div className="absolute bottom-0 w-full h-12 bg-orange-500 rounded-b-lg"></div>
                </div>
                {/* Legs */}
                <div className="absolute -bottom-3 left-3 w-4 h-8 bg-blue-600 rounded"></div>
                <div className="absolute -bottom-3 right-3 w-4 h-8 bg-blue-600 rounded"></div>
                {/* Arms */}
                <div className="absolute top-12 -left-2 w-3 h-6 bg-orange-600 rounded"></div>
                <div className="absolute top-12 -right-2 w-3 h-6 bg-orange-600 rounded"></div>
              </div>
            </div>

            {/* Red apple */}
            <div className="animate-float">
              <span className="text-6xl">🍎</span>
            </div>

            {/* Girl in coral (with drink) */}
            <div className="transform hover:scale-110 hover:-translate-y-3 transition-all duration-300 cursor-pointer">
              <div className="relative">
                {/* Body */}
                <div className="w-20 h-28 bg-blue-900 rounded-t-full relative">
                  {/* Hair */}
                  <div className="absolute -top-2 w-full h-8 bg-blue-800 rounded-t-full"></div>
                  {/* Eyes */}
                  <div className="absolute top-6 left-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-6 right-4 w-2 h-2 bg-black rounded-full"></div>
                  {/* Mouth */}
                  <div className="absolute top-10 left-6 w-1 h-1 bg-pink-400 rounded-full"></div>
                  {/* Shirt */}
                  <div className="absolute bottom-0 w-full h-12 bg-coral-500 rounded-b-lg"></div>
                </div>
                {/* Legs */}
                <div className="absolute -bottom-3 left-3 w-4 h-8 bg-blue-700 rounded"></div>
                <div className="absolute -bottom-3 right-3 w-4 h-8 bg-blue-700 rounded"></div>
                {/* Arms */}
                <div className="absolute top-12 -left-2 w-3 h-6 bg-blue-900 rounded"></div>
                <div className="absolute top-12 -right-2 w-3 h-6 bg-blue-900 rounded transform -rotate-12"></div>
              </div>
            </div>
          </div>

          {/* XP text floating */}
          <div className="absolute top-32 right-32 text-orange-500 text-2xl font-bold animate-bounce">
            XP
          </div>

          {/* Floating stars */}
          <div className="absolute top-24 left-24 text-yellow-400 text-3xl animate-float">⭐</div>
          <div className="absolute top-48 right-48 text-yellow-400 text-2xl animate-float-delayed">⭐</div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-xl rounded-full font-bold transform hover:scale-105 transition-all duration-200 shadow-lg">
              Get Started
            </Button>
            <Button variant="outline" className="border-2 border-gray-300 text-gray-700 px-12 py-4 text-xl rounded-full font-bold hover:border-orange-500 hover:text-orange-500 transform hover:scale-105 transition-all duration-200">
              I already have an account
            </Button>
          </div>
        </div>
      </section>

      {/* Scientific Backing Section - Image 2 Design */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-block animate-bounce mb-4">
              <svg width="80" height="80" viewBox="0 0 120 120">
                <path d="M60 15 C85 15 105 40 105 60 C105 80 85 105 60 105 C35 105 15 80 15 60 C15 40 35 15 60 15 Z" fill="#FF6B35"/>
                <circle cx="50" cy="50" r="8" fill="white"/>
                <circle cx="70" cy="50" r="8" fill="white"/>
                <circle cx="50" cy="50" r="4" fill="black"/>
                <circle cx="70" cy="50" r="4" fill="black"/>
                <path d="M45 70 Q60 82 75 70" stroke="black" strokeWidth="3" fill="none"/>
                <rect x="10" y="55" width="20" height="6" fill="#FF6B35" rx="3"/>
                <rect x="90" y="55" width="20" height="6" fill="#FF6B35" rx="3"/>
                <rect x="55" y="105" width="6" height="15" fill="#FF6B35" rx="3"/>
                <rect x="65" y="105" width="6" height="15" fill="#FF6B35" rx="3"/>
              </svg>
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

          {/* Illustration with scientist, mascot, and kid - Following Image 2 design */}
          <div className="flex justify-center items-center space-x-12">
            {/* Scientist with glasses and lab coat */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                {/* Head */}
                <div className="w-24 h-32 bg-pink-200 rounded-t-full relative">
                  {/* Hair */}
                  <div className="absolute -top-2 w-full h-8 bg-blue-800 rounded-t-full"></div>
                  {/* Glasses */}
                  <div className="absolute top-8 left-2 w-20 h-12 border-4 border-blue-400 rounded-full bg-transparent"></div>
                  <div className="absolute top-10 left-4 w-6 h-6 border-2 border-blue-400 rounded-full bg-transparent"></div>
                  <div className="absolute top-10 right-4 w-6 h-6 border-2 border-blue-400 rounded-full bg-transparent"></div>
                  {/* Eyes behind glasses */}
                  <div className="absolute top-12 left-6 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-12 right-6 w-2 h-2 bg-black rounded-full"></div>
                  {/* Smile */}
                  <div className="absolute top-20 left-8 w-1 h-1 bg-pink-600 rounded-full"></div>
                  {/* Lab coat */}
                  <div className="absolute bottom-0 w-full h-16 bg-white rounded-b-lg border-2 border-blue-300"></div>
                </div>
                {/* Arms pointing */}
                <div className="absolute top-16 -left-4 w-6 h-4 bg-pink-200 rounded transform -rotate-45"></div>
                <div className="absolute top-16 -right-4 w-6 h-4 bg-pink-200 rounded transform rotate-45"></div>
                {/* Legs */}
                <div className="absolute -bottom-4 left-6 w-4 h-8 bg-blue-600 rounded"></div>
                <div className="absolute -bottom-4 right-6 w-4 h-8 bg-blue-600 rounded"></div>
              </div>
            </div>

            {/* Orange slice mascot with thumbs up */}
            <div className="animate-wiggle">
              <svg width="80" height="80" viewBox="0 0 120 120">
                <path d="M60 15 C85 15 105 40 105 60 C105 80 85 105 60 105 C35 105 15 80 15 60 C15 40 35 15 60 15 Z" fill="#FF6B35"/>
                <circle cx="50" cy="50" r="8" fill="white"/>
                <circle cx="70" cy="50" r="8" fill="white"/>
                <circle cx="50" cy="50" r="4" fill="black"/>
                <circle cx="70" cy="50" r="4" fill="black"/>
                <path d="M45 70 Q60 82 75 70" stroke="black" strokeWidth="3" fill="none"/>
                {/* Thumbs up gesture */}
                <rect x="110" y="45" width="8" height="15" fill="#FF6B35" rx="4"/>
                <circle cx="114" cy="40" r="6" fill="#FF6B35"/>
                <rect x="5" y="45" width="8" height="15" fill="#FF6B35" rx="4"/>
                <circle cx="9" cy="40" r="6" fill="#FF6B35"/>
                {/* Legs */}
                <rect x="55" y="105" width="6" height="15" fill="#FF6B35" rx="3"/>
                <rect x="65" y="105" width="6" height="15" fill="#FF6B35" rx="3"/>
              </svg>
            </div>

            {/* Happy child */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                {/* Head */}
                <div className="w-24 h-32 bg-orange-400 rounded-t-full relative">
                  {/* Hair */}
                  <div className="absolute -top-2 w-full h-8 bg-orange-800 rounded-t-full"></div>
                  {/* Eyes */}
                  <div className="absolute top-8 left-6 w-3 h-3 bg-black rounded-full"></div>
                  <div className="absolute top-8 right-6 w-3 h-3 bg-black rounded-full"></div>
                  {/* Big smile */}
                  <path className="absolute top-16 left-6" d="M0,0 Q6,8 12,0" stroke="black" strokeWidth="2" fill="none"/>
                  {/* T-shirt */}
                  <div className="absolute bottom-0 w-full h-16 bg-orange-500 rounded-b-lg"></div>
                </div>
                {/* Arms raised in celebration */}
                <div className="absolute top-16 -left-4 w-6 h-4 bg-orange-400 rounded transform -rotate-45"></div>
                <div className="absolute top-16 -right-4 w-6 h-4 bg-orange-400 rounded transform rotate-45"></div>
                {/* Legs */}
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

      {/* Goal Selection Section - Image 3 Design */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
              Pick your goals.<br />BiteBurst adapts.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div>
              {/* Goal Pills - exactly as shown in Image 3 */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3">
                  <span>⚡</span> Energy
                </div>
                <div className="bg-blue-400 text-black px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3">
                  <span>🧠</span> Focus
                </div>
                <div className="bg-orange-400 text-black px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3">
                  <span>💪</span> Strength
                </div>
              </div>

              <div className="space-y-6 mb-12">
                <p className="text-2xl font-bold text-gray-900">
                  Want more energy?<br />
                  Focus in school?<br />
                  Get stronger?
                </p>
                <p className="text-xl text-gray-700">
                  BiteBurst helps you choose your goal and gives you custom feedback every day.
                </p>
              </div>

              {/* Characters from Image 3 */}
              <div className="flex items-end space-x-8">
                {/* Girl with hockey stick for Energy */}
                <div className="transform hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <div className="w-20 h-28 bg-yellow-400 rounded-t-full relative">
                      <div className="absolute -top-2 w-full h-8 bg-yellow-600 rounded-t-full"></div>
                      <div className="absolute top-6 left-4 w-2 h-2 bg-black rounded-full"></div>
                      <div className="absolute top-6 right-4 w-2 h-2 bg-black rounded-full"></div>
                      <div className="absolute bottom-0 w-full h-12 bg-green-500 rounded-b-lg"></div>
                    </div>
                    <div className="absolute -bottom-4 left-3 w-4 h-8 bg-blue-500 rounded"></div>
                    <div className="absolute -bottom-4 right-3 w-4 h-8 bg-blue-500 rounded"></div>
                    {/* Hockey stick */}
                    <div className="absolute top-16 -right-6 w-2 h-16 bg-yellow-600 rounded transform rotate-12"></div>
                  </div>
                </div>

                {/* Baseball (not pause button) */}
                <div className="w-12 h-12 bg-white border-4 border-red-500 rounded-full flex items-center justify-center relative">
                  <div className="w-1 h-8 bg-red-500 rounded transform rotate-45"></div>
                  <div className="w-8 h-1 bg-red-500 rounded absolute"></div>
                </div>
              </div>
            </div>

            {/* Right side - Phone Mockup exactly like Image 3 */}
            <div className="flex justify-center">
              <div className="bg-gray-100 p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="bg-white rounded-2xl p-6 w-80 h-96">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Select a goal</h4>
                  
                  <div className="space-y-3 mb-6">
                    <div className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-center flex items-center justify-center gap-2">
                      <span>⚡</span> Energy
                    </div>
                    <div className="bg-blue-400 text-black px-6 py-3 rounded-full font-bold text-center flex items-center justify-center gap-2">
                      <span>🧠</span> Focus
                    </div>
                  </div>
                  
                  <h5 className="font-bold text-gray-900 mb-3">Today's Feedback</h5>
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                    <p className="font-bold text-yellow-800 mb-1">Great choice!</p>
                    <p className="text-yellow-700 mb-1">Eating well can boost your energy ⚡</p>
                    <p className="text-yellow-700">Keep it up!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section with mascot doing strength exercise and reading kid */}
          <div className="flex justify-center items-center space-x-16 mt-16">
            {/* Mascot doing pull-ups for Strength */}
            <div className="animate-bounce">
              <svg width="80" height="80" viewBox="0 0 120 120">
                <path d="M60 15 C85 15 105 40 105 60 C105 80 85 105 60 105 C35 105 15 80 15 60 C15 40 35 15 60 15 Z" fill="#FF6B35"/>
                <circle cx="50" cy="50" r="8" fill="white"/>
                <circle cx="70" cy="50" r="8" fill="white"/>
                <circle cx="50" cy="50" r="4" fill="black"/>
                <circle cx="70" cy="50" r="4" fill="black"/>
                <path d="M45 70 Q60 82 75 70" stroke="black" strokeWidth="3" fill="none"/>
                {/* Pull-up bar */}
                <rect x="20" y="10" width="80" height="4" fill="#8B4513" rx="2"/>
                {/* Arms reaching up */}
                <rect x="45" y="15" width="6" height="20" fill="#FF6B35" rx="3"/>
                <rect x="69" y="15" width="6" height="20" fill="#FF6B35" rx="3"/>
                {/* Hands gripping bar */}
                <circle cx="48" cy="12" r="4" fill="#FF6B35"/>
                <circle cx="72" cy="12" r="4" fill="#FF6B35"/>
                {/* Legs */}
                <rect x="55" y="105" width="6" height="15" fill="#FF6B35" rx="3"/>
                <rect x="65" y="105" width="6" height="15" fill="#FF6B35" rx="3"/>
              </svg>
            </div>

            {/* Child reading for Focus */}
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="w-20 h-28 bg-blue-800 rounded-t-full relative">
                  <div className="absolute -top-2 w-full h-8 bg-blue-900 rounded-t-full"></div>
                  <div className="absolute top-6 left-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-6 right-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute bottom-0 w-full h-12 bg-yellow-500 rounded-b-lg"></div>
                </div>
                <div className="absolute -bottom-4 left-3 w-4 h-8 bg-blue-600 rounded"></div>
                <div className="absolute -bottom-4 right-3 w-4 h-8 bg-blue-600 rounded"></div>
                {/* Book */}
                <div className="absolute top-18 left-6 w-8 h-6 bg-green-500 rounded transform -rotate-12"></div>
              </div>
              <div className="text-center mt-2">
                <span className="text-2xl">📖</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Logging Section */}
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
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Food emojis */}
                <div className="bg-red-100 hover:bg-red-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🍎
                </div>
                <div className="bg-green-100 hover:bg-green-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🥦
                </div>
                <div className="bg-yellow-100 hover:bg-yellow-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🍞
                </div>
                <div className="bg-orange-100 hover:bg-orange-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🥤
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Activity emojis */}
                <div className="bg-blue-100 hover:bg-blue-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  ⚽
                </div>
                <div className="bg-purple-100 hover:bg-purple-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🧘
                </div>
                <div className="bg-pink-100 hover:bg-pink-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🏃
                </div>
                <div className="bg-indigo-100 hover:bg-indigo-200 rounded-full w-20 h-20 flex items-center justify-center text-3xl cursor-pointer transform hover:scale-110 transition-all duration-200">
                  🎯
                </div>
              </div>
            </div>

            {/* Right side - Phone with photo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-orange-500 p-6 rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="bg-white rounded-2xl p-4 w-64 h-80">
                    <div className="bg-blue-500 text-white p-3 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-3xl">📷</span>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-4 flex items-center justify-center h-32">
                      <span className="text-4xl">🍉</span>
                    </div>
                  </div>
                </div>
                
                {/* Animated mascot */}
                <div className="absolute -bottom-4 -right-4 animate-bounce">
                  <svg width="50" height="50" viewBox="0 0 100 100">
                    <path d="M50 10 L85 25 L85 75 L50 90 L15 75 L15 25 Z" fill="#FF6B35" />
                    <circle cx="35" cy="40" r="6" fill="white" />
                    <circle cx="65" cy="40" r="6" fill="white" />
                    <path d="M30 60 Q50 70 70 60" stroke="black" strokeWidth="2" fill="none" />
                    <rect x="20" y="75" width="10" height="15" fill="#FF6B35" rx="2" />
                    <rect x="70" y="75" width="10" height="15" fill="#FF6B35" rx="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* XP Rewards Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
            Healthy is the<br />new high score.
          </h2>
          
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Every time you log a meal or workout, you earn XP. Keep your streak alive and unlock cool badges. Your mascot will cheer you on!
          </p>

          {/* XP Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-gray-900">25</span>
              <span className="text-lg text-gray-500">30</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 h-6 rounded-full transition-all duration-1000 ease-out" style={{ width: '83%' }}></div>
              <div className="absolute right-2 top-1 text-white font-bold text-sm">🔥</div>
            </div>
          </div>

          {/* Mascot celebration */}
          <div className="mb-8">
            <div className="animate-bounce">
              <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto">
                <path d="M50 10 L85 25 L85 75 L50 90 L15 75 L15 25 Z" fill="#FF6B35" />
                <circle cx="35" cy="40" r="8" fill="white" />
                <circle cx="65" cy="40" r="8" fill="white" />
                <circle cx="35" cy="40" r="4" fill="black" />
                <circle cx="65" cy="40" r="4" fill="black" />
                <path d="M30 60 Q50 75 70 60" stroke="black" strokeWidth="3" fill="none" />
                <rect x="40" y="85" width="8" height="12" fill="#FF6B35" rx="2" />
                <rect x="52" y="85" width="8" height="12" fill="#FF6B35" rx="2" />
                <rect x="20" y="75" width="12" height="8" fill="#FF6B35" rx="2" />
                <rect x="68" y="75" width="12" height="8" fill="#FF6B35" rx="2" />
              </svg>
            </div>
          </div>

          {/* Badges */}
          <div className="flex justify-center space-x-6">
            <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center text-2xl text-white transform hover:scale-110 transition-all duration-200">
              🍎
            </div>
            <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center text-2xl text-white transform hover:scale-110 transition-all duration-200">
              🥕
            </div>
            <div className="bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center text-2xl transform hover:scale-110 transition-all duration-200">
              ⭐
            </div>
          </div>

          <div className="mt-8">
            <p className="text-lg font-bold text-orange-500">BiteBurst</p>
          </div>
        </div>
      </section>

      {/* AI Feedback Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-block animate-bounce mb-4">
              <svg width="60" height="60" viewBox="0 0 100 100">
                <path d="M50 10 L85 25 L85 75 L50 90 L15 75 L15 25 Z" fill="#FF6B35" />
                <circle cx="35" cy="40" r="6" fill="white" />
                <circle cx="65" cy="40" r="6" fill="white" />
                <circle cx="35" cy="40" r="3" fill="black" />
                <circle cx="65" cy="40" r="3" fill="black" />
                <path d="M30 60 Q50 70 70 60" stroke="black" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-orange-500 mb-4">BiteBurst</h2>
          </div>

          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Healthy habits, powered by AI.
          </h3>

          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
            BiteBurst uses AI to give smart, age-friendly feedback on food and movement. Learn how your meals help you in school, sports, and life.
          </p>

          {/* Illustration */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            {/* AI Eye */}
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Food plate */}
            <div className="relative">
              <div className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center">
                <div className="flex space-x-1">
                  <span className="text-sm">🥦</span>
                  <span className="text-sm">🥕</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 text-yellow-500 animate-ping">⭐</div>
            </div>

            {/* Kids */}
            <div className="flex space-x-2">
              <div className="w-12 h-16 bg-yellow-600 rounded-t-full relative">
                <div className="absolute top-2 left-2 w-1 h-1 bg-black rounded-full"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-black rounded-full"></div>
                <div className="absolute bottom-0 w-full h-4 bg-yellow-500 rounded-b-lg"></div>
              </div>
              <div className="w-12 h-16 bg-pink-400 rounded-t-full relative">
                <div className="absolute top-2 left-2 w-1 h-1 bg-black rounded-full"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-black rounded-full"></div>
                <div className="absolute bottom-0 w-full h-4 bg-pink-500 rounded-b-lg"></div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="flex justify-center items-center space-x-4">
            <span className="text-orange-500 text-2xl">XP</span>
            <div className="w-32 bg-gray-200 rounded-full h-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <span className="text-gray-700 font-bold">75</span>
          </div>

          {/* Sports icons */}
          <div className="flex justify-center space-x-6 mt-8">
            <span className="text-3xl animate-bounce">⚽</span>
            <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🏀</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden">
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
          
          <p className="text-xl text-orange-100 mb-12">
            Join thousands of kids building healthy habits with BiteBurst.
          </p>

          {/* Treasure chest with animated items */}
          <div className="mb-12 relative">
            <div className="inline-block relative">
              {/* Treasure chest */}
              <div className="w-32 h-24 bg-yellow-600 rounded-lg relative mx-auto">
                <div className="absolute top-0 w-full h-6 bg-yellow-700 rounded-t-lg"></div>
                <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-900 rounded-full"></div>
                <div className="absolute top-6 left-8 w-16 h-12 bg-yellow-500 rounded"></div>
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
              <svg width="40" height="40" viewBox="0 0 100 100" className="mr-3">
                <path d="M50 10 L85 25 L85 75 L50 90 L15 75 L15 25 Z" fill="white" />
                <circle cx="35" cy="40" r="6" fill="#FF6B35" />
                <circle cx="65" cy="40" r="6" fill="#FF6B35" />
                <path d="M30 60 Q50 70 70 60" stroke="#FF6B35" strokeWidth="2" fill="none" />
              </svg>
              <span className="text-2xl font-bold">BiteBurst</span>
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
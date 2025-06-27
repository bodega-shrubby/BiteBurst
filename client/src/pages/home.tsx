import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import mascotImage from "@assets/ChatGPT Image Jun 20, 2025 at 04_16_09 PM_1750421779759.png";
import biteBurstTextImage from "@assets/F2D3D9CF-D739-4DA8-ACEC-83E301F2A76E_1750932035557.png";
import runningBoyImage from "@assets/CA2D19FD-6214-4459-B44F-C0503B8D0086_1750932028300.png";
import girlYellowHoodieImage from "@assets/48172ADF-566D-40CF-AA66-3DD0D4B182D8_1750932044380.png";
import characterSceneImage from "@assets/Image 5_1750934217849_1750935387889.png";
import aiIllustrationImage from "@assets/38a70918-95a7-4033-9c54-734dc6b18369_1751018825929.png";
import tapSnapGoImage from "@assets/f4c590ab-4c94-4bfa-b845-e8013e86f062_1751019859501.png";
import gamificationImage from "@assets/cb62b801-17ce-4eff-81cc-0184f4408c2e_1751020235628.png";

export default function Home() {
  const aiSectionAnimation = useScrollAnimation();
  const tapSnapGoAnimation = useScrollAnimation();
  const gamificationAnimation = useScrollAnimation();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section - Exact recreation of provided design */}
      <section className="min-h-screen flex flex-col justify-center items-center px-8 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          
          {/* Logo Row - Responsive sizing */}
          <div className="flex items-center justify-center mb-8 sm:mb-12 -space-x-4">
            <img 
              src={mascotImage} 
              alt="BiteBurst Mascot" 
              className="w-40 h-40 sm:w-48 md:w-56 lg:w-64 object-contain"
            />
            <img 
              src={biteBurstTextImage} 
              alt="BiteBurst" 
              className="h-44 sm:h-52 md:h-60 lg:h-72 object-contain"
            />
          </div>

          {/* Headline */}
          <h2 className="text-black text-center mb-6 max-w-4xl mx-auto font-extrabold text-[36px]">
            The fun, gamified way to eat better and move more!
          </h2>

          {/* Subheading */}
          <p className="text-lg font-medium text-black text-center mb-16 max-w-3xl mx-auto leading-relaxed">
            BiteBurst helps kids and teens learn what to eat, how to stay active, and how food fuels their goals.
          </p>

          {/* Character Scene - Using your PNG */}
          <div className="relative mb-16 flex justify-center">
            <img 
              src={characterSceneImage} 
              alt="BiteBurst Character Scene" 
              className="w-full max-w-4xl h-auto object-contain"
            />
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

      {/* Section 2 - AI-Powered Habits */}
      <section ref={aiSectionAnimation.ref} className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content - First on mobile, right on desktop */}
            <div className={`text-center lg:text-left order-1 lg:order-2 scroll-fade-in ${aiSectionAnimation.isVisible ? 'visible' : ''}`}>
              {/* Main Headline */}
              <h2 className="mb-6 font-extrabold text-[36px] leading-tight" style={{ color: '#FF6A00' }}>
                Healthy habits, powered by AI.
              </h2>

              {/* Description Text */}
              <p className="text-lg font-medium text-black leading-relaxed">
                BiteBurst uses AI to give smart, age-friendly feedback on food and movement. Learn how your meals help you in school, sports, and life.
              </p>
            </div>

            {/* Illustration - Second on mobile, left on desktop */}
            <div className={`flex justify-center lg:justify-start order-2 lg:order-1 scroll-fade-in-delayed ${aiSectionAnimation.isVisible ? 'visible' : ''}`}>
              <img 
                src={aiIllustrationImage} 
                alt="AI-powered feedback illustration" 
                className="w-full max-w-lg h-auto object-contain"
              />
            </div>

          </div>

        </div>
      </section>

      {/* Section 3 - Tap, Snap, Go */}
      <section ref={tapSnapGoAnimation.ref} className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content - Left side */}
            <div className={`text-center lg:text-left scroll-fade-in ${tapSnapGoAnimation.isVisible ? 'visible' : ''}`}>
              {/* Main Headline */}
              <h2 className="mb-6 font-extrabold text-[36px] leading-tight" style={{ color: '#FF6A00' }}>
                Tap, Snap, Go
              </h2>

              {/* Description Text */}
              <p className="text-lg font-medium text-black leading-relaxed">
                Log what you eat with bubbles, emojis, or a quick photo. Select your activity and get instant feedback on how food helps your body.
              </p>
            </div>

            {/* Image - Right side */}
            <div className={`flex justify-center lg:justify-end scroll-fade-in-delayed ${tapSnapGoAnimation.isVisible ? 'visible' : ''}`}>
              <img 
                src={tapSnapGoImage} 
                alt="Tap, Snap, Go food logging illustration" 
                className="w-full max-w-lg h-auto object-contain"
              />
            </div>

          </div>

        </div>
      </section>

      {/* Section 4 - Gamification */}
      <section ref={gamificationAnimation.ref} className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Image - Left side on desktop, second on mobile */}
            <div className={`flex justify-center lg:justify-start order-2 lg:order-1 scroll-fade-in-delayed ${gamificationAnimation.isVisible ? 'visible' : ''}`}>
              <img 
                src={gamificationImage} 
                alt="Gamification with XP, badges and mascot" 
                className="w-full max-w-lg h-auto object-contain"
              />
            </div>

            {/* Text Content - Right side on desktop, first on mobile */}
            <div className={`text-center lg:text-left order-1 lg:order-2 scroll-fade-in ${gamificationAnimation.isVisible ? 'visible' : ''}`}>
              {/* Main Headline */}
              <h2 className="mb-6 font-extrabold text-[36px] leading-tight" style={{ color: '#FF6A00' }}>
                Healthy is the new high score
              </h2>

              {/* Description Text */}
              <p className="text-lg font-medium text-black leading-relaxed">
                Every time you log a meal or workout, you earn XP. Keep your streak alive and unlock cool badges. Your mascot will cheer you on!
              </p>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
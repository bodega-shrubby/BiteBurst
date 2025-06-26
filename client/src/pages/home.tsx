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
          <div className="flex items-center justify-center mb-8 sm:mb-12">
            <img 
              src={mascotImage} 
              alt="BiteBurst Mascot" 
              className="w-20 h-20 sm:w-24 md:w-28 lg:w-32 -mr-1 object-contain"
            />
            <img 
              src={biteBurstTextImage} 
              alt="BiteBurst" 
              className="h-16 sm:h-20 md:h-24 lg:h-28 object-contain"
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

          {/* New section - to be replaced with attached content */}
          <div className="relative mb-16 h-64 flex items-center justify-center">
            <div className="text-center text-gray-400">
              [Section removed - please describe what should be here from your attached image]
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
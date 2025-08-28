import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to BiteBurst
          </h1>
          <p className="text-lg text-gray-600">
            A fun way for kids to build healthy eating and movement habits!
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => window.location.href = '/api/login'}
            className="w-full text-white font-bold text-lg rounded-full py-6"
            style={{ backgroundColor: '#FF6A00' }}
          >
            Log In
          </Button>
          
          <Button
            onClick={() => window.location.href = '/start'}
            variant="outline"
            className="w-full font-bold text-lg rounded-full py-6 border-2"
            style={{ 
              borderColor: '#FF6A00',
              color: '#FF6A00'
            }}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}
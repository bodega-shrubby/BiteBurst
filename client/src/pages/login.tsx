import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface LoginResponse {
  success: boolean;
  sessionId: string;
  user: {
    id: number;
    username: string;
    displayName: string;
    email: string;
    ageBracket: string;
    goal: string;
    avatar: string;
    xp: number;
    streak: number;
    badges: string[];
  };
}

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store session ID
        localStorage.setItem("sessionId", data.sessionId);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        console.log("Login successful:", data.user);
        
        // Redirect to dashboard
        setLocation("/dashboard");
      } else {
        if (data.onboardingRequired) {
          setError("Please complete your profile setup first.");
        } else {
          setError(data.error || "Login failed");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Welcome Back!</CardTitle>
          <p className="text-gray-600">Sign in to continue your BiteBurst journey</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
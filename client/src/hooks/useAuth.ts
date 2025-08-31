import { useState, useEffect } from "react";

interface User {
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
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionId = localStorage.getItem("sessionId");
      const storedUser = localStorage.getItem("user");

      if (sessionId && storedUser) {
        try {
          // Verify session with server
          const response = await fetch("/api/auth/me", {
            headers: {
              "x-session-id": sessionId,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Session invalid, clear local storage
            localStorage.removeItem("sessionId");
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          // On network error, use stored user data
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem("sessionId");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData: User, sessionId: string) => {
    setUser(userData);
    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    const sessionId = localStorage.getItem("sessionId");
    
    if (sessionId) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "x-session-id": sessionId,
          },
        });
      } catch (error) {
        console.error("Logout request failed:", error);
      }
    }

    setUser(null);
    localStorage.removeItem("sessionId");
    localStorage.removeItem("user");
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
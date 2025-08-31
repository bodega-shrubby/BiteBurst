// Auth hook disabled - authentication system removed
export function useAuth() {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  };
}
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isSubscribed: boolean;
  unlockedTemplates: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        // In a real app, this would be an API call to validate the session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll simulate a successful login
      const mockUser: User = {
        id: 'user-123',
        email,
        name: email.split('@')[0],
        isSubscribed: localStorage.getItem('hasActiveSubscription') === 'true',
        unlockedTemplates: JSON.parse(localStorage.getItem('unlockedTemplates') || '[]'),
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Failed to login. Please try again.' };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we'll simulate a successful signup
      const mockUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        isSubscribed: false,
        unlockedTemplates: [],
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, error: 'Failed to sign up. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Don't clear unlockedTemplates to persist them between sessions
  };

  const refreshUser = async () => {
    // In a real app, this would refresh the user data from the server
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Update subscription status from localStorage
      userData.isSubscribed = localStorage.getItem('hasActiveSubscription') === 'true';
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return {
    user: context.user,
    isLoading: context.isLoading,
    login: context.login,
    logout: context.logout,
    signup: context.signup,
    refreshUser: context.refreshUser,
  };
}

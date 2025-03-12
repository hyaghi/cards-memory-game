
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  accessToken: string;
}

interface GoogleAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: () => void;
  signOut: () => void;
}

const GoogleAuthContext = createContext<GoogleAuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  signIn: () => {},
  signOut: () => {},
});

export const GoogleAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock authentication for demo purposes
  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('googleUser');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem('googleUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  const signIn = () => {
    setIsLoading(true);
    setError(null);
    
    // Mock authentication process
    setTimeout(() => {
      try {
        // Create mock user
        const mockUser: User = {
          id: 'user123',
          email: 'user@example.com',
          displayName: 'Demo User',
          photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
          accessToken: 'mock-token-' + Math.random().toString(36).substring(2),
        };
        
        // Store in localStorage
        localStorage.setItem('googleUser', JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${mockUser.displayName}!`,
        });
      } catch (e) {
        console.error('Authentication error', e);
        setError('Failed to authenticate with Google');
        
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Could not sign in with Google. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const signOut = () => {
    setIsLoading(true);
    
    // Mock sign out process
    setTimeout(() => {
      localStorage.removeItem('googleUser');
      setUser(null);
      setIsLoading(false);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    }, 500);
  };

  return (
    <GoogleAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        signIn,
        signOut,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = () => useContext(GoogleAuthContext);

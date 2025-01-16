import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  AuthError,
  AuthErrorCodes
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface User {
  id: string;
  email: string | null;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthError = (error: AuthError) => {
    // Log detailed error information
    console.error('Authentication error:', {
      code: error.code,
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    // Check if auth is properly initialized
    if (!auth.app) {
      console.error('Firebase Auth not properly initialized');
      throw new Error('Authentication service not initialized');
    }

    // Rethrow the error to be handled by the UI
    throw error;
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user) {
        throw new Error('No user data returned from signup');
      }

      await updateProfile(userCredential.user, { 
        displayName: name 
      });

      setUser({
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: name
      });
    } catch (error) {
      if (error instanceof Error) {
        handleAuthError(error as AuthError);
      } else {
        console.error('Unknown error during signup:', error);
        throw new Error('An unexpected error occurred during signup');
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Validate inputs before attempting login
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user) {
        throw new Error('No user data returned from login');
      }

      setUser({
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName
      });
    } catch (error) {
      if (error instanceof Error) {
        handleAuthError(error as AuthError);
      } else {
        console.error('Unknown error during login:', error);
        throw new Error('An unexpected error occurred during login');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
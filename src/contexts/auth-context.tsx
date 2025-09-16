"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  careerAspirations?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Check for existing session on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    
    // Only access localStorage after component mounts
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('skillvoyager_user');
      console.log('Loading saved user from localStorage:', savedUser);
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log('Parsed user data:', parsedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('skillvoyager_user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call - In real app, this would be an actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Only proceed if we're on the client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return false;
    }
    
    // Get users from localStorage (simulating a database)
    const users = JSON.parse(localStorage.getItem('skillvoyager_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar
      };
      
      console.log('Login successful, setting user session:', userSession);
      setUser(userSession);
      localStorage.setItem('skillvoyager_user', JSON.stringify(userSession));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Only proceed if we're on the client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return false;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('skillvoyager_users') || '[]');
    
    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      setIsLoading(false);
      return false; // User already exists
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In real app, this would be hashed
      avatar: `https://picsum.photos/100/100?random=${Date.now()}`
    };
    
    console.log('Creating new user during signup:', newUser);
    
    // Save to "database"
    users.push(newUser);
    localStorage.setItem('skillvoyager_users', JSON.stringify(users));
    console.log('Updated users array after signup:', users);
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skillvoyager_user');
    }
    router.push('/auth/login');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user && typeof window !== 'undefined') {
      const updatedUser = { ...user, ...updates };
      console.log('Updating user profile:', updatedUser);
      setUser(updatedUser);
      localStorage.setItem('skillvoyager_user', JSON.stringify(updatedUser));
      
      // Also update in users array
      const users = JSON.parse(localStorage.getItem('skillvoyager_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('skillvoyager_users', JSON.stringify(users));
        console.log('Updated users array:', users);
      }
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route wrapper
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
"use client";

import { useAuth } from '@/contexts/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Define public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/signup', '/salary-negotiation'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!user && !isPublicRoute) {
        // Redirect to login if not authenticated and trying to access protected route
        router.push('/auth/login');
      } else if (user && isPublicRoute) {
        // Redirect to dashboard if authenticated and trying to access auth pages
        router.push('/');
      }
    }
  }, [user, isLoading, isPublicRoute, router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages without sidebar for non-authenticated users
  if (!user && isPublicRoute) {
    return <>{children}</>;
  }

  // Show protected content for authenticated users
  if (user && !isPublicRoute) {
    return <>{children}</>;
  }

  // Fallback - should not reach here due to useEffect redirects
  return null;
}
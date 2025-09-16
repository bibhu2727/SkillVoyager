"use client";

import { useAuth } from '@/contexts/auth-context';
import { userProfile } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clearAuthData, debugAuthState } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DebugAuthPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleClearAuth = () => {
    clearAuthData();
    router.refresh();
  };

  const handleDebugAuth = () => {
    debugAuthState();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Authentication Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current User (from Auth Context)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Static User Profile (from data.ts)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(userProfile, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LocalStorage Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>skillvoyager_user:</strong>
                <pre className="bg-gray-100 p-2 rounded text-xs mt-1">
                  {mounted && typeof window !== 'undefined' ? localStorage.getItem('skillvoyager_user') || 'null' : 'Loading...'}
                </pre>
              </div>
              <div>
                <strong>skillvoyager_users:</strong>
                <pre className="bg-gray-100 p-2 rounded text-xs mt-1 max-h-32 overflow-auto">
                  {mounted && typeof window !== 'undefined' ? localStorage.getItem('skillvoyager_users') || 'null' : 'Loading...'}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleDebugAuth} variant="outline" className="w-full">
              Log Debug Info to Console
            </Button>
            <Button onClick={handleClearAuth} variant="destructive" className="w-full">
              Clear All Auth Data
            </Button>
            <Button onClick={logout} variant="secondary" className="w-full">
              Logout Current User
            </Button>
            <Button onClick={() => router.push('/auth/login')} variant="default" className="w-full">
              Go to Login
            </Button>
            <Button onClick={() => router.push('/auth/signup')} variant="default" className="w-full">
              Go to Signup
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Display Name Logic Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>user?.name:</strong> {user?.name || 'undefined'}</p>
            <p><strong>userProfile.name:</strong> {userProfile.name}</p>
            <p><strong>Final displayName:</strong> {user?.name && user.name.trim() ? user.name : userProfile.name}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
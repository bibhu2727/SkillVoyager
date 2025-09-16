"use client";

import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { MobileNav } from "./mobile-nav";
import { AuthWrapper } from "./auth-wrapper";
import { AppFooter } from "@/components/ui/app-footer";
import { useAuth } from '@/contexts/auth-context';
import { usePathname } from 'next/navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  
  // Define public routes that don't need sidebar
  const publicRoutes = ['/auth/login', '/auth/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  return (
    <AuthWrapper>
      {user && !isPublicRoute ? (
        <>
          {/* Mobile Navigation */}
          <MobileNav />
          
          {/* Desktop Sidebar */}
          <SidebarProvider>
            <Sidebar collapsible="icon" className="hidden md:flex">
              <SidebarNav />
            </Sidebar>
            <SidebarInset className="md:ml-0">
              <div className="md:pl-0 min-h-screen flex flex-col">
                <main className="flex-1">
                  {children}
                </main>
                <AppFooter />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </>
      ) : (
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <AppFooter />
        </div>
      )}
    </AuthWrapper>
  );
}

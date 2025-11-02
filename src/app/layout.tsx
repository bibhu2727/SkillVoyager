import type { Metadata, Viewport } from 'next';
import './globals.css';
// Initialize environment configuration early
import '@/lib/env';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { CookieConsentWrapper } from '@/components/ui/cookie-consent-wrapper';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  title: 'SkillVoyager - AI-Powered Career Navigator',
  description: 'Your AI-powered career navigator for interview preparation, skill development, and career growth',
  keywords: ['career', 'interview', 'AI', 'skills', 'job preparation', 'professional development'],
  authors: [{ name: 'SkillVoyager Team' }],
  creator: 'SkillVoyager',
  publisher: 'SkillVoyager',
  metadataBase: new URL(config.baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SkillVoyager - AI-Powered Career Navigator',
    description: 'Your AI-powered career navigator for interview preparation, skill development, and career growth',
    url: config.baseUrl,
    siteName: 'SkillVoyager',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillVoyager - AI-Powered Career Navigator',
    description: 'Your AI-powered career navigator for interview preparation, skill development, and career growth',
  },
  robots: {
    index: config.isProduction,
    follow: config.isProduction,
    googleBot: {
      index: config.isProduction,
      follow: config.isProduction,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <ThemeProvider defaultTheme="system" storageKey="skillvoyager-ui-theme">
          <AuthProvider>
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster />
            <CookieConsentWrapper />
            {config.analytics.vercelAnalyticsId && <Analytics />}
            {config.analytics.speedInsightsId && <SpeedInsights />}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

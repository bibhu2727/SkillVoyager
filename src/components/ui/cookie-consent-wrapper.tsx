"use client";

import { CookieConsent } from './cookie-consent';

export function CookieConsentWrapper() {
  const handleAccept = () => {
    console.log('User accepted cookies and entered the webapp!');
    // You can add additional logic here like analytics tracking, etc.
  };

  return <CookieConsent onAccept={handleAccept} />;
}
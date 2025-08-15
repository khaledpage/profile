export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
  timestamp: number;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_EXPIRY_DAYS = 365;

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) return null;
    
    const parsed = JSON.parse(consent);
    // Check if consent is still valid (not expired)
    const expiryTime = parsed.timestamp + (COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    if (Date.now() > expiryTime) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
}

export function setCookieConsent(consent: Omit<CookieConsent, 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  
  const consentWithTimestamp: CookieConsent = {
    ...consent,
    timestamp: Date.now()
  };
  
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentWithTimestamp));
}

export function hasUserGivenConsent(): boolean {
  const consent = getCookieConsent();
  return consent !== null;
}

export function canSavePreferences(): boolean {
  const consent = getCookieConsent();
  // Allow saving preferences if user has given consent and specifically allowed preferences
  return consent !== null && consent.preferences === true;
}

export function revokeCookieConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COOKIE_CONSENT_KEY);
}

export function shouldShowCookieBanner(): boolean {
  return !hasUserGivenConsent();
}

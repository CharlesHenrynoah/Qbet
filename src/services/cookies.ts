interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
}

export function setCookie(name: string, value: string, days: number = 365): void {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export function saveCookiePreferences(preferences: CookiePreferences): void {
  setCookie('cookiePreferences', JSON.stringify(preferences));
}

export function getCookiePreferences(): CookiePreferences | null {
  const preferences = getCookie('cookiePreferences');
  if (preferences) {
    try {
      return JSON.parse(preferences);
    } catch {
      return null;
    }
  }
  return null;
}
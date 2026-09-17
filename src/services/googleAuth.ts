// Google Identity Services (GIS) & OAuth Helper Service

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
  sub?: string;
}

const CLIENT_ID_STORAGE_KEY = 'SIBA_GOOGLE_CLIENT_ID';

export function getGoogleClientId(): string {
  const stored = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
  if (stored && stored.trim()) {
    return stored.trim();
  }
  return ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string) || '';
}

export function saveGoogleClientId(clientId: string): void {
  if (clientId && clientId.trim()) {
    localStorage.setItem(CLIENT_ID_STORAGE_KEY, clientId.trim());
  } else {
    localStorage.removeItem(CLIENT_ID_STORAGE_KEY);
  }
}

/**
 * Decode standard Google JWT credential (ID Token)
 */
export function parseJwt(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT token', e);
    return null;
  }
}

/**
 * Fetch profile details from Google UserInfo endpoint using OAuth Access Token
 */
export async function fetchGoogleProfile(accessToken: string): Promise<GoogleUserProfile> {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Google API returned status: ${res.status}`);
  }

  const data = await res.json();
  return {
    email: data.email,
    name: data.name || data.given_name || data.email,
    picture: data.picture,
    sub: data.sub,
  };
}

/**
 * Check if Google Identity Services script is loaded in window
 */
export function isGoogleGsiAvailable(): boolean {
  return typeof window !== 'undefined' && !!(window as any).google?.accounts;
}

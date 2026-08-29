/**
 * MVP token storage.
 *
 * SECURITY NOTE (tracked hardening item): localStorage is readable by any
 * script on the page, so it is exposed to XSS. The production upgrade path is:
 *   - refresh token  -> httpOnly, Secure, SameSite=Strict cookie (never JS-readable)
 *   - access token   -> in-memory only (module scope / React context), short-lived
 * This MVP keeps the flow functional across reloads; it must be migrated before
 * any production launch. No other secret ever touches the browser.
 */

const ACCESS_KEY = 'credipass.access_token';
const REFRESH_KEY = 'credipass.refresh_token';

export const tokens = {
  getAccess(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(ACCESS_KEY);
  },
  getRefresh(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(REFRESH_KEY);
  },
  set(accessToken: string, refreshToken: string): void {
    window.localStorage.setItem(ACCESS_KEY, accessToken);
    window.localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear(): void {
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};

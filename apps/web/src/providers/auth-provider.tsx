'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, type AuthUserDto, type LoginRequest, type RegisterRequest } from '@/lib/api';
import { tokens } from '@/lib/tokens';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: AuthUserDto | null;
  status: AuthStatus;
  login: (input: LoginRequest) => Promise<AuthUserDto>;
  register: (input: RegisterRequest) => Promise<AuthUserDto>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Auth state comes from GET /me (blueprint rule), never from decoding the JWT.
 * On mount: hydrate from a stored access token, then refresh if needed.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const access = tokens.getAccess();
      if (!access) {
        if (!cancelled) setStatus('unauthenticated');
        return;
      }

      try {
        const me = await api.me(access);
        if (!cancelled) {
          setUser(me);
          setStatus('authenticated');
        }
      } catch {
        const refresh = tokens.getRefresh();
        if (refresh) {
          try {
            const res = await api.refresh({ refreshToken: refresh });
            tokens.set(res.accessToken, res.refreshToken);
            const me = await api.me(res.accessToken);
            if (!cancelled) {
              setUser(me);
              setStatus('authenticated');
            }
            return;
          } catch {
            // refresh failed — clear and fall through to unauthenticated
          }
        }
        tokens.clear();
        if (!cancelled) {
          setUser(null);
          setStatus('unauthenticated');
        }
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (input: LoginRequest) => {
    const res = await api.login(input);
    tokens.set(res.accessToken, res.refreshToken);
    setUser(res.user);
    setStatus('authenticated');
    return res.user;
  }, []);

  const register = useCallback(async (input: RegisterRequest) => {
    const res = await api.register(input);
    tokens.set(res.accessToken, res.refreshToken);
    setUser(res.user);
    setStatus('authenticated');
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    const access = tokens.getAccess();
    if (access) {
      try {
        await api.logout(access);
      } catch {
        // ignore network errors on logout; local state still clears
      }
    }
    tokens.clear();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

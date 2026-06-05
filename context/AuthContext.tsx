// context/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { apiClient } from '@/services/apiClient';
import { useRouter } from 'next/navigation';

// --- TYPES ---
interface AuthData {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  userEmail: string | null;
}

interface AuthContextType {
  auth: AuthData;
  isLoading: boolean;
  login: (data: {
    token: string;
    refreshToken: string;
    userId: string;
    email: string;
  }) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
}

// --- CONSTANTS & UTILS ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'agaram_auth_data';

const EMPTY_AUTH: AuthData = {
  userId: null,
  accessToken: null,
  refreshToken: null,
  userEmail: null,
};

const logDebug = (msg: string, data?: unknown) => {
  if (process.env.NODE_ENV === 'development') {
  }
};

// Lightweight cookie flag so Next.js middleware can detect auth state
const AUTH_COOKIE_NAME = 'agaram_logged_in';

const setAuthCookie = () => {
  if (typeof document === 'undefined') return;
  // Set a session-scoped cookie (no expiry = cleared when browser closes)
  // SameSite=Lax for security, path=/ for middleware visibility
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; SameSite=Lax`;
};

const removeAuthCookie = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
};

const StorageHelper = {
  set: (data: AuthData) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
      setAuthCookie();
    } catch (e) {
      logDebug('LocalStorage Save Failed', e);
    }
  },
  get: (): AuthData | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      logDebug('LocalStorage Parse Failed', e);
      return null;
    }
  },
  remove: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      removeAuthCookie();
    } catch {
      /* ignore */
    }
  },
};

// --- PROVIDER ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthData>(EMPTY_AUTH);
  const [isLoading, setIsLoading] = useState(true);

  // Use refs for values needed in callbacks to avoid stale closures
  const authRef = useRef(auth);
  authRef.current = auth;

  const isRefreshingRef = useRef(false);
  // Store the pending refresh promise so concurrent callers share the same request
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  // 1. LOAD SESSION ON MOUNT
  useEffect(() => {
    const savedData = StorageHelper.get();
    if (savedData?.accessToken) {
      setAuth(savedData);
      setAuthCookie(); // Ensure middleware cookie is in sync
      logDebug('Session restored from storage');
    } else {
      removeAuthCookie(); // Clean up stale cookie if no session
      logDebug('No active session found');
    }
    setIsLoading(false);
  }, []);

  // 2. LOGIN
  const login = useCallback(
    (data: { token: string; refreshToken: string; userId: string; email: string }) => {
      const authData: AuthData = {
        userId: data.userId,
        accessToken: data.token,
        refreshToken: data.refreshToken,
        userEmail: data.email,
      };
      setAuth(authData);
      StorageHelper.set(authData);
      logDebug('User Logged In');
    },
    [],
  );

  // 3. LOGOUT - uses ref to avoid stale closure over `auth`
  const logout = useCallback(async () => {
    const current = authRef.current;

    // Clear state immediately
    setAuth(EMPTY_AUTH);
    StorageHelper.remove();

    // Notify server (fire and forget)
    if (current.refreshToken && current.userEmail) {
      try {
        await apiClient.revokeToken({
          email: current.userEmail,
          token: current.refreshToken,
        });
        logDebug('Server Token Revoked');
      } catch (error) {
        logDebug('Server Revoke Failed (Ignored)', error);
      }
    }

    router.replace('/login');
  }, [router]);

  // 4. REFRESH SESSION - deduplicates concurrent refresh calls
  const refreshSession = useCallback(async (): Promise<string | null> => {
    // If a refresh is already in-flight, return the same promise
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const current = authRef.current;
    if (!current.accessToken || !current.refreshToken) {
      return null;
    }

    isRefreshingRef.current = true;

    const doRefresh = async (): Promise<string | null> => {
      try {
        logDebug('Attempting Token Refresh...');
        const response = await apiClient.refreshToken({
          accessToken: current.accessToken!,
          refreshToken: current.refreshToken!,
        });

        if (response.success && response.token) {
          const newAuthData: AuthData = {
            userId: current.userId,
            userEmail: current.userEmail,
            accessToken: response.token.token,
            refreshToken: response.token.refreshToken.token,
          };

          setAuth(newAuthData);
          StorageHelper.set(newAuthData);
          logDebug('Token Refreshed Successfully');
          return response.token.token;
        }

        logDebug('Refresh Failed: API returned false');
        await logout();
        return null;
      } catch (error) {
        logDebug('Refresh Failed: Network/Server Error', error);
        await logout();
        return null;
      } finally {
        isRefreshingRef.current = false;
        refreshPromiseRef.current = null;
      }
    };

    refreshPromiseRef.current = doRefresh();
    return refreshPromiseRef.current;
  }, [logout]);

  return (
    <AuthContext.Provider value={{ auth, isLoading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
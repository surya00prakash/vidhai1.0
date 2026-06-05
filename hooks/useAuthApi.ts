// hooks/useAuthApi.ts
import { useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useAuthApi = () => {
  const { auth, refreshSession, logout } = useAuth();

  // Keep a ref to the latest token so the retry always uses the fresh value
  const tokenRef = useRef(auth.accessToken);
  tokenRef.current = auth.accessToken;

  const authenticatedFetch = useCallback(
    async <T>(apiCall: (token: string) => Promise<T>): Promise<T> => {
      const currentToken = tokenRef.current;

      if (!currentToken) {
        throw new Error('No access token available');
      }

      try {
        return await apiCall(currentToken);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '';

        const isUnauthorized =
          errorMessage.includes('401') ||
          errorMessage.toLowerCase().includes('unauthorized') ||
          errorMessage.includes('Invalid token');

        if (isUnauthorized) {
          try {
            // refreshSession now returns the new token string directly,
            // and deduplicates concurrent calls automatically
            const newToken = await refreshSession();

            if (newToken) {
              return await apiCall(newToken);
            }
          } catch (refreshError) {
          }

          logout();
          throw new Error('Session expired. Please login again.');
        }

        throw error;
      }
    },
    [refreshSession, logout],
  );

  return authenticatedFetch;
};
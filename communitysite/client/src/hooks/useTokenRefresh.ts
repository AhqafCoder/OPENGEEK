'use client';

import { useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { setAuthToken, isTokenStale, getTokenAge } from '@/lib/token-manager';

export function useTokenRefresh() {
  const { getToken, isSignedIn } = useAuth();

  const refreshToken = useCallback(async (force = false) => {
    if (!isSignedIn) return null;

    try {
      // Only refresh if token is stale or forced
      if (force || isTokenStale()) {
        console.log(`Refreshing token (age: ${getTokenAge()}s, forced: ${force})`);
        const token = await getToken({ skipCache: true });
        
        if (token) {
          setAuthToken(token);
          console.log('Token refreshed successfully');
          return token;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }, [getToken, isSignedIn]);

  const ensureFreshToken = useCallback(async () => {
    if (!isSignedIn) return false;

    try {
      if (isTokenStale()) {
        const token = await refreshToken(true);
        return !!token;
      }
      return true;
    } catch (error) {
      console.error('Failed to ensure fresh token:', error);
      return false;
    }
  }, [refreshToken, isSignedIn]);

  return {
    refreshToken,
    ensureFreshToken,
    isTokenStale,
    getTokenAge
  };
}
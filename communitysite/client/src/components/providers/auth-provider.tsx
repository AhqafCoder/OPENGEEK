'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { setAuthToken, clearAuthToken } from '@/lib/token-manager';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout | null = null;

    const updateToken = async (skipCache = false) => {
      if (isSignedIn) {
        try {
          // Use skipCache to get fresh token when needed
          const token = await getToken({ skipCache });
          
          if (token) {
            setAuthToken(token);
            console.log('Token updated successfully', skipCache ? '(fresh)' : '(cached)');
          } else {
            clearAuthToken();
          }
        } catch (error) {
          console.error('Error getting token:', error);
          clearAuthToken();
        }
      } else {
        clearAuthToken();
      }
    };

    const startTokenRefresh = () => {
      // Initial token fetch
      updateToken();

      // Set up proactive token refresh every 45 seconds
      refreshInterval = setInterval(() => {
        if (isSignedIn) {
          console.log('Proactively refreshing token...');
          updateToken(true); // Skip cache to get fresh token
        }
      }, 45000); // 45 seconds
    };

    const stopTokenRefresh = () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }
    };

    if (isSignedIn) {
      startTokenRefresh();
    } else {
      stopTokenRefresh();
    }

    // Listen for manual token refresh requests
    const handleTokenRefresh = () => {
      console.log('Manual token refresh requested');
      updateToken(true);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('token-refresh-needed', handleTokenRefresh);
    }

    return () => {
      stopTokenRefresh();
      if (typeof window !== 'undefined') {
        window.removeEventListener('token-refresh-needed', handleTokenRefresh);
      }
    };
  }, [isSignedIn, getToken]);

  return <>{children}</>;
}
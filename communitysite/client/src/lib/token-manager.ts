// Enhanced token manager for Clerk authentication with refresh tracking
let tokenCache: string | null = null;
let tokenTimestamp: number = 0;

export const setAuthToken = (token: string | null) => {
  tokenCache = token;
  tokenTimestamp = Date.now();
};

export const getAuthToken = (): string | null => {
  return tokenCache;
};

export const clearAuthToken = () => {
  tokenCache = null;
  tokenTimestamp = 0;
};

// Check if token is older than 30 seconds (might need refresh soon)
export const isTokenStale = (): boolean => {
  if (!tokenCache || !tokenTimestamp) return true;
  const age = Date.now() - tokenTimestamp;
  return age > 30000; // 30 seconds
};

// Get token age in seconds
export const getTokenAge = (): number => {
  if (!tokenTimestamp) return Infinity;
  return Math.floor((Date.now() - tokenTimestamp) / 1000);
};

// Request a fresh token manually
export const requestFreshToken = () => {
  if (typeof window !== 'undefined') {
    console.log('Manually requesting fresh token...');
    window.dispatchEvent(new CustomEvent('token-refresh-needed'));
  }
};
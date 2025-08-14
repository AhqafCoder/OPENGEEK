'use client';

import { useEffect, useState } from 'react';
import { getTokenAge, isTokenStale } from '@/lib/token-manager';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';

interface TokenStatusProps {
  show?: boolean;
}

export function TokenStatus({ show = false }: TokenStatusProps) {
  const [age, setAge] = useState(0);
  const [stale, setStale] = useState(false);
  const { refreshToken } = useTokenRefresh();

  useEffect(() => {
    if (!show) return;

    const updateStatus = () => {
      setAge(getTokenAge());
      setStale(isTokenStale());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${stale ? 'bg-red-500' : 'bg-green-500'}`} />
        <span>Token: {age}s {stale ? '(stale)' : '(fresh)'}</span>
        <button
          onClick={() => refreshToken(true)}
          className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
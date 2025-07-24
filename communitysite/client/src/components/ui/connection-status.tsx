'use client';

import { useState, useEffect } from 'react';
import { Badge } from './badge';
import { Wifi, WifiOff } from 'lucide-react';
import api from '@/lib/api';

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const response = await api.get('/health');
      setIsConnected(response.status === 200);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return null; // Don't show anything while initial check is happening
  }

  return (
    <Badge
      variant={isConnected ? 'default' : 'destructive'}
      className={`fixed bottom-4 right-4 z-50 ${
        isConnected 
          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
          : 'bg-red-500/20 text-red-400 border-red-500/30'
      } ${isChecking ? 'animate-pulse' : ''}`}
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3 mr-1" />
          API Connected
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 mr-1" />
          API Offline
        </>
      )}
    </Badge>
  );
}
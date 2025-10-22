import { checkBackendHealth, type HealthCheckResult } from '@/utils/healthCheck';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const [health, setHealth] = useState<HealthCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      setIsLoading(true);
      try {
        const result = await checkBackendHealth();
        setHealth(result);
      } catch (error) {
        console.error('Health check failed:', error);
        setHealth({
          isOnline: false,
          error: 'Failed to check backend status',
          backendUrl: '',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
    
    // Проверяем каждые 30 секунд
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <Wifi className="h-4 w-4 animate-pulse" />
        <span className="text-sm">Проверка подключения...</span>
      </div>
    );
  }

  if (!health) {
    return null;
  }

  const statusColor = health.isOnline ? 'text-green-600' : 'text-red-600';
  const StatusIcon = health.isOnline ? CheckCircle : AlertCircle;
  const ConnectIcon = health.isOnline ? Wifi : WifiOff;

  return (
    <div className={`flex items-center gap-2 ${statusColor} ${className}`}>
      <ConnectIcon className="h-4 w-4" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-3 w-3" />
          <span className="text-sm font-medium">
            {health.isOnline ? 'Подключено' : 'Нет подключения'}
          </span>
          {health.latency && (
            <span className="text-xs text-gray-500">
              ({health.latency}ms)
            </span>
          )}
        </div>
        
        {showDetails && (
          <div className="text-xs text-gray-500 mt-1">
            <div>Backend: {health.backendUrl}</div>
            {health.error && (
              <div className="text-red-500 mt-1">
                Ошибка: {health.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;
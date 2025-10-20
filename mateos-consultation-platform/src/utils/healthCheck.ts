// Утилиты для проверки состояния бэкенда
import { config } from '@/config';

export interface HealthCheckResult {
  isOnline: boolean;
  latency?: number;
  error?: string;
  backendUrl: string;
}

/**
 * Проверяет доступность бэкенда
 */
export async function checkBackendHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const backendUrl = config.api.baseUrl;
  
  try {
    console.log('🔍 Checking backend health at:', backendUrl);
    
    // Пробуем простой GET запрос к health endpoint или корню API
    const healthUrls = [
      `${backendUrl}/health`,
      `${backendUrl}/api/health`, 
      `${backendUrl}/ping`,
      backendUrl, // Просто базовый URL
    ];
    
    let lastError: Error | null = null;
    
    for (const url of healthUrls) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
        });
        
        const latency = Date.now() - startTime;
        console.log(`✅ Backend responded from ${url} in ${latency}ms (status: ${response.status})`);
        
        return {
          isOnline: true,
          latency,
          backendUrl,
        };
      } catch (error) {
        console.log(`❌ Failed to reach ${url}:`, error);
        lastError = error as Error;
        continue;
      }
    }
    
    return {
      isOnline: false,
      error: lastError?.message || 'No health endpoints responded',
      backendUrl,
    };
    
  } catch (error) {
    const latency = Date.now() - startTime;
    console.error('❌ Backend health check failed:', error);
    
    return {
      isOnline: false,
      latency,
      error: error instanceof Error ? error.message : 'Unknown error',
      backendUrl,
    };
  }
}

/**
 * Проверяет CORS настройки
 */
export async function checkCorsSupport(): Promise<boolean> {
  try {
    const response = await fetch(config.api.baseUrl, {
      method: 'OPTIONS',
      mode: 'cors',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('❌ CORS check failed:', error);
    return false;
  }
}

/**
 * Выводит детальную диагностику подключения
 */
export async function diagnoseConnection(): Promise<void> {
  console.log('🔍 Starting connection diagnosis...');
  console.log('📍 Frontend URL:', window.location.origin);
  console.log('📍 Backend URL:', config.api.baseUrl);
  
  const healthResult = await checkBackendHealth();
  const corsSupported = await checkCorsSupport();
  
  console.log('📊 Diagnosis Results:');
  console.log('  Backend Online:', healthResult.isOnline);
  console.log('  Latency:', healthResult.latency || 'N/A', 'ms');
  console.log('  CORS Support:', corsSupported);
  console.log('  Error:', healthResult.error || 'None');
  
  if (!healthResult.isOnline) {
    console.warn('⚠️ Recommendations:');
    console.warn('  1. Check if backend server is running');
    console.warn('  2. Verify backend URL in .env.development');
    console.warn('  3. Check firewall/network settings');
    console.warn('  4. Verify CORS configuration on backend');
  }
}
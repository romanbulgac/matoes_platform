/**
 * Device Information Service
 * Provides comprehensive device fingerprinting and tracking capabilities
 * 
 * @module deviceInfo
 */

// Extend Navigator type for device memory API
declare global {
  interface Navigator {
    deviceMemory?: number;
  }
}

export interface DeviceInfoDto {
  deviceId: string;
  deviceName: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  platform: string;
  browser: string;
  browserVersion: string;
  operatingSystem?: string;
  operatingSystemVersion?: string;
  screenResolution: string;
  timeZone: string;
  language: string;
}

export class DeviceInfoService {
  /**
   * Generates a unique device ID based on browser and system characteristics
   * Uses multiple signals to create a stable identifier
   * 
   * IMPROVEMENT: Checks localStorage first for existing deviceId to maintain stability
   */
  static generateDeviceId(): string {
    // 🔧 FIX: Проверяем localStorage сначала
    const storedDeviceId = localStorage.getItem('mateos_device_id');
    if (storedDeviceId) {
      console.log('📱 Using stored device ID:', storedDeviceId);
      return storedDeviceId;
    }

    // Генерируем новый ID только если нет сохраненного
    console.log('📱 Generating new device ID...');
    const canvas = this.getCanvasFingerprint();
    const webgl = this.getWebGLFingerprint();
    
    // 🔧 FIX: Убираем изменяемые параметры для стабильности
    // Не используем: timezone offset (может меняться), audio fingerprint (нестабильный)
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width,
      screen.height,
      canvas,
      webgl,
      navigator.hardwareConcurrency || 0,
      (navigator as Navigator).deviceMemory || 0,
    ].join('|');

    const deviceId = this.hashString(components);
    
    // 🔧 FIX: Сохраняем в localStorage для последующего использования
    localStorage.setItem('mateos_device_id', deviceId);
    console.log('📱 New device ID generated and stored:', deviceId);
    
    return deviceId;
  }

  /**
   * Gets a user-friendly device name based on browser and OS
   */
  static getDeviceName(): string {
    const browser = this.getBrowser();
    const os = this.getPlatform();
    const deviceType = this.getDeviceType();

    return `${browser} pe ${os} (${deviceType})`;
  }

  /**
   * Determines device type based on screen size and user agent
   */
  static getDeviceType(): 'Mobile' | 'Desktop' | 'Tablet' {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
    const isTablet = /tablet|ipad|playbook|silk/i.test(ua) || 
                     (isMobile && window.innerWidth > 768);

    if (isTablet) return 'Tablet';
    if (isMobile) return 'Mobile';
    return 'Desktop';
  }

  /**
   * Gets operating system name
   */
  static getPlatform(): string {
    const ua = navigator.userAgent;
    
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    
    return 'Unknown';
  }

  /**
   * Gets operating system version
   */
  static getOperatingSystemVersion(): string {
    const ua = navigator.userAgent;
    let version = 'Unknown';
    
    // Windows version detection
    if (ua.includes('Windows NT 10.0')) version = '10';
    else if (ua.includes('Windows NT 6.3')) version = '8.1';
    else if (ua.includes('Windows NT 6.2')) version = '8';
    else if (ua.includes('Windows NT 6.1')) version = '7';
    // macOS version detection
    else if (ua.includes('Mac OS X')) {
      const match = ua.match(/Mac OS X ([\d_]+)/);
      if (match) version = match[1].replace(/_/g, '.');
    }
    // Android version detection
    else if (ua.includes('Android')) {
      const match = ua.match(/Android ([\d.]+)/);
      if (match) version = match[1];
    }
    // iOS version detection
    else if (ua.includes('OS ')) {
      const match = ua.match(/OS ([\d_]+)/);
      if (match) version = match[1].replace(/_/g, '.');
    }
    
    return version;
  }

  /**
   * Gets browser name and version
   */
  static getBrowser(): string {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    
    if (ua.includes('Firefox')) {
      browser = 'Firefox';
    } else if (ua.includes('Opera') || ua.includes('OPR')) {
      browser = 'Opera';
    } else if (ua.includes('Edg')) {
      browser = 'Edge';
    } else if (ua.includes('Chrome')) {
      browser = 'Chrome';
    } else if (ua.includes('Safari')) {
      browser = 'Safari';
    }
    
    return browser;
  }

  /**
   * Gets browser version
   */
  static getBrowserVersion(): string {
    const ua = navigator.userAgent;
    const match = ua.match(/(firefox|chrome|safari|opera|edg|opr)[\\/\s](\d+)/i);
    return match ? match[2] : 'Unknown';
  }

  /**
   * Gets complete device information as a DTO
   */
  static getAllDeviceInfo(): DeviceInfoDto {
    const platform = this.getPlatform();
    return {
      deviceId: this.generateDeviceId(),
      deviceName: this.getDeviceName(),
      deviceType: this.getDeviceType(),
      platform: platform,
      browser: this.getBrowser(),
      browserVersion: this.getBrowserVersion(),
      operatingSystem: platform,
      operatingSystemVersion: this.getOperatingSystemVersion(),
      screenResolution: `${screen.width}x${screen.height}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    };
  }

  // ========== Private Helper Methods ==========

  /**
   * Creates canvas fingerprint for device identification
   */
  private static getCanvasFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      canvas.width = 200;
      canvas.height = 50;

      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Mateos Platform', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Security', 4, 17);

      return canvas.toDataURL();
    } catch {
      return '';
    }
  }

  /**
   * Creates WebGL fingerprint
   */
  private static getWebGLFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return '';

      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return '';

      const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

      return `${vendor}~${renderer}`;
    } catch {
      return '';
    }
  }

  /**
   * Creates audio fingerprint
   */
  private static getAudioFingerprint(): string {
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return '';

      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const analyser = context.createAnalyser();
      const gainNode = context.createGain();
      
      gainNode.gain.value = 0; // Mute
      oscillator.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.start(0);
      
      const data = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(data);
      
      oscillator.stop();
      context.close();
      
      return data.slice(0, 30).join(',');
    } catch {
      return '';
    }
  }

  /**
   * Creates fonts fingerprint
   */
  private static getFontsFingerprint(): string {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testFonts = [
      'Arial', 'Verdana', 'Times New Roman', 'Courier New',
      'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS'
    ];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const results: string[] = [];

    testFonts.forEach(font => {
      baseFonts.forEach(baseFont => {
        ctx.font = `72px ${font}, ${baseFont}`;
        const width = ctx.measureText('mmmmmmmmmmlli').width;
        results.push(`${font}:${width}`);
      });
    });

    return this.hashString(results.join('|'));
  }

  /**
   * Simple hash function for generating consistent IDs
   */
  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to hex and ensure it's always positive
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}

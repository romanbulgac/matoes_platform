/**
 * Device Info Test Utility
 * Use this to test and verify device fingerprinting
 * 
 * Usage in browser console:
 * import { testDeviceInfo } from '@/utils/testDeviceInfo';
 * testDeviceInfo();
 */

import { DeviceInfoService } from './deviceInfo';

export function testDeviceInfo() {
  console.group('🔍 Device Information Test');
  
  try {
    console.time('Device Fingerprinting');
    
    const deviceInfo = DeviceInfoService.getAllDeviceInfo();
    
    console.timeEnd('Device Fingerprinting');
    
    console.log('📱 Device Type:', deviceInfo.deviceType);
    console.log('💻 Platform:', deviceInfo.platform);
    console.log('🌐 Browser:', `${deviceInfo.browser} ${deviceInfo.browserVersion}`);
    console.log('🆔 Device ID:', deviceInfo.deviceId);
    console.log('📛 Device name:', deviceInfo.deviceName);
    console.log('📺 Screen Resolution:', deviceInfo.screenResolution);
    console.log('🌍 Timezone:', deviceInfo.timeZone);
    console.log('🗣️ Language:', deviceInfo.language);
    
    console.log('\n📦 Full Device Info Object:', deviceInfo);
    
    // Test ID stability
    console.log('\n🔒 Testing Device ID Stability...');
    const id1 = DeviceInfoService.generateDeviceId();
    const id2 = DeviceInfoService.generateDeviceId();
    const id3 = DeviceInfoService.generateDeviceId();
    
    const isStable = id1 === id2 && id2 === id3;
    console.log('Device ID 1:', id1);
    console.log('Device ID 2:', id2);
    console.log('Device ID 3:', id3);
    console.log(isStable ? '✅ Device ID is stable' : '❌ Device ID is NOT stable');
    
    console.groupEnd();
    
    return deviceInfo;
  } catch (error) {
    console.error('❌ Error testing device info:', error);
    console.groupEnd();
    throw error;
  }
}

// Auto-run in development
if (import.meta.env.DEV) {
  console.log('💡 Device Info utilities loaded. Call testDeviceInfo() to test.');
}

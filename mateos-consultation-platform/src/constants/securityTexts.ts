/**
 * Security-related text constants in Romanian
 * All user-facing security messages and labels
 * 
 * @module constants/securityTexts
 */

export const SECURITY_TEXTS = {
  // Device Status
  newDevice: 'Dispozitiv nou',
  trustedDevice: 'Dispozitiv de încredere',
  suspiciousDevice: 'Dispozitiv suspect',
  currentDevice: 'Dispozitiv curent',

  // Session Management
  activeSessions: 'Sesiuni active',
  sessionRevoked: 'Sesiunea a fost închisă',
  revokeSession: 'Închide sesiunea',
  revokeAllOther: 'Închide toate celelalte',
  trustDevice: 'Marchează ca fiind de încredere',
  untrustedDevice: 'Elimină încrederea',

  // Security Settings
  securitySettings: 'Setări de securitate',
  securityPage: 'Securitate',
  changePassword: 'Schimbă parola',
  twoFactorAuth: 'Autentificare în doi pași',
  loginAlerts: 'Alerte de conectare',
  deviceManagement: 'Gestionare dispozitive',

  // Notifications
  newDeviceLogin: 'Conectare de pe dispozitiv nou',
  suspiciousActivity: 'Activitate suspectă detectată',
  passwordChanged: 'Parola a fost schimbată',
  sessionExpired: 'Sesiunea a expirat',
  
  // Alert Messages
  newDeviceDetected: 'Dispozitiv nou detectat',
  verifyemail: 'Verificați emailul pentru confirmare',
  deviceVerified: 'Dispozitivul a fost verificat',
  sessionRevokedSuccess: 'Sesiunea a fost închisă cu succes',
  allSessionsRevoked: 'Toate sesiunile au fost închise',
  deviceTrustedSuccess: 'Dispozitivul este acum de încredere',
  
  // Security Statistics
  totalDevices: 'Total dispozitive',
  trustedDevices: 'Dispozitive de încredere',
  recentLogins: 'Conectări recente',
  failedAttempts: 'Tentative eșuate',
  lastActivity: 'Ultima activitate',
  createdAt: 'Creat la',
  
  // Actions
  view: 'Vizualizează',
  revoke: 'Revocă',
  trust: 'Acordă încredere',
  verify: 'Verifică',
  dismiss: 'Închide',
  learnMore: 'Află mai multe',
  
  // Device Types
  desktop: 'Desktop',
  mobile: 'Mobil',
  tablet: 'Tabletă',
  
  // Platforms
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
  android: 'Android',
  ios: 'iOS',
  
  // Browsers
  chrome: 'Chrome',
  firefox: 'Firefox',
  safari: 'Safari',
  edge: 'Edge',
  opera: 'Opera',
  
  // Error Messages
  sessionNotFound: 'Sesiunea nu a fost găsită',
  deviceNotFound: 'Dispozitivul nu a fost găsit',
  invalidVerificationCode: 'Cod de verificare invalid',
  tooManyAttempts: 'Prea multe încercări. Încercați din nou mai târziu',
  
  // Confirmation Messages
  confirmRevokeSession: 'Sigur doriți să închideți această sesiune?',
  confirmRevokeAllSessions: 'Sigur doriți să închideți toate celelalte sesiuni?',
  confirmTrustDevice: 'Sigur doriți să marcați acest dispozitiv ca fiind de încredere?',
  
  // Warnings
  warningNewDevice: 'Conectare detectată de pe un dispozitiv necunoscut',
  warningSuspiciousActivity: 'Am detectat activitate suspectă pe contul tău',
  warningMultipleDevices: 'Contul tău este conectat pe mai multe dispozitive',
  warningUnverifiedDevice: 'Acest dispozitiv nu este verificat',
  
  // Success Messages
  successDeviceVerified: 'Dispozitivul a fost verificat cu succes',
  successSessionRevoked: 'Sesiunea a fost închisă cu succes',
  successDeviceTrusted: 'Dispozitivul este acum marcat ca fiind de încredere',
  successPasswordChanged: 'Parola a fost schimbată cu succes',
  
  // Info Messages
  infoFirstTimeLogin: 'Aceasta este prima ta conectare de pe acest dispozitiv',
  infoDeviceWillExpire: 'Încrederea acordată acestui dispozitiv va expira în',
  infoSessionExpiresSoon: 'Sesiunea ta va expira în curând',
  
  // Time Units
  seconds: 'secunde',
  minutes: 'minute',
  hours: 'ore',
  days: 'zile',
  ago: 'în urmă',
  
  // Security Levels
  low: 'Scăzut',
  medium: 'Mediu',
  high: 'Ridicat',
  critical: 'Critic',
} as const;

export type SecurityTextKey = keyof typeof SECURITY_TEXTS;

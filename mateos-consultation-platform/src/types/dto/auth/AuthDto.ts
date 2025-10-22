import { UserDto } from '../user/UserDto';

/**
 * DTO pentru cererea de autentificare
 */
export interface LoginRequestDto {
  /** Adresa de email */
  email: string;
  /** Parola */
  password: string;
  
  // Informații despre dispozitiv pentru urmărirea sesiunii
  /** ID unic generat de client */
  deviceId?: string;
  /** Nume prietenos ca "iPhone 12" sau "Chrome pe Windows" */
  deviceName?: string;
  /** Tipul dispozitivului: "Mobile", "Desktop", "Tablet" */
  deviceType?: string;
  /** Platforma: "Windows", "macOS", "Android", "iOS" */
  platform?: string;
  /** Browser-ul: "Chrome", "Safari", "Firefox" */
  browser?: string;
  /** Versiunea browser-ului */
  browserVersion?: string;
  /** Sistemul de operare */
  operatingSystem?: string;
  /** Versiunea sistemului de operare */
  operatingSystemVersion?: string;
  /** Rezoluția ecranului */
  screenResolution?: string;
  /** Fusul orar */
  timeZone?: string;
  /** Limba */
  language?: string;
  
  // Context suplimentar de securitate
  /** Utilizatorul dorește să își amintească dispozitivul */
  rememberDevice?: boolean;
}

/**
 * DTO pentru rezultatul autentificării
 */
export interface AuthenticationResultDto {
  /** Dacă autentificarea a reușit */
  isSuccess: boolean;
  /** Token JWT */
  token?: string;
  /** Token de refresh */
  refreshToken?: string;
  /** Mesajul de eroare */
  errorMessage?: string;
  /** Informații despre utilizator */
  user?: UserDto;
  
  // Informații despre sesiune
  /** ID-ul sesiunii create */
  sessionId?: string;
  /** Dacă este un dispozitiv nou */
  isNewDevice?: boolean;
  /** Numele dispozitivului folosit pentru autentificare */
  deviceName?: string;
  /** Dacă necesită verificarea dispozitivului */
  requiresDeviceVerification?: boolean;
  
  // Informații de securitate
  /** Ora ultimei autentificări */
  lastLoginTime?: string;
  /** Dispozitivul ultimei autentificări */
  lastLoginDevice?: string;
  /** Numărul de sesiuni active */
  activeSessionsCount?: number;
}
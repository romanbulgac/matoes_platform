/* eslint-disable react-refresh/only-export-components */
import { convertUserDtoToUser } from '@/lib/converters';
import { AuthService } from '@/services/authService';
import { UserService } from '@/services/userService';
import { SessionDto, User, UserRole } from '@/types';
import { DeviceInfoService } from '@/utils/deviceInfo';
import { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  currentSession: SessionDto | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberDevice?: boolean) => Promise<SessionDto | null>;
  register: (userData: RegisterData) => Promise<SessionDto | null>;
  logout: () => void;
  setCurrentSession: (session: SessionDto | null) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  phoneNumber?: string;
  hasAcceptedPrivacyPolicy: boolean;
  hasAcceptedTerms: boolean;
  hasAcceptedMarketing?: boolean;
  hasAcceptedCookies?: boolean;
  hasAcceptedAttendanceTracking?: boolean;
  hasAcceptedPaymentTracking?: boolean;
  hasAcceptedGroupPlacement?: boolean;
  hasAcceptedScheduleTracking?: boolean;
  studentName?: string;
  parentName?: string;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_SESSION'; payload: SessionDto | null }
  | { type: 'CLEAR_USER' };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  currentSession: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'SET_SESSION':
      return {
        ...state,
        currentSession: action.payload,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        currentSession: null,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let isInitializing = false;
    
    // Verificăm prezența token-ului la încărcare
    const initializeAuth = async () => {
      // Защита от множественных вызовов
      if (isInitializing) {
        console.log('🔄 Auth initialization already in progress, skipping...');
        return;
      }
      
      isInitializing = true;
      console.log('🚀 Starting auth initialization...');
      
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Спочатку спробуємо зробити refresh token, якщо основний токен застарів
          console.log('🔍 Checking token validity...');
          
          // Получаем актуальную информацию о пользователе из API
          const userProfile = await UserService.getProfile();
          const user = convertUserDtoToUser(userProfile);
          
          dispatch({ type: 'SET_USER', payload: user });
          
          // Обновляем сохраненную информацию о пользователе
          localStorage.setItem('user', JSON.stringify(user));
          
          // 🔧 NEW: Восстанавливаем информацию о сессии
          const session = AuthService.getCurrentSession();
          if (session) {
            dispatch({ type: 'SET_SESSION', payload: session });
            console.log('✅ Session restored:', session);
          }
          
          console.log('✅ User restored from API:', user);
          
          // Пока отключим SignalR
          // notificationService.connect(user.id);
        } catch (error) {
          console.error('❌ Eroare la restaurarea utilizatorului:', error);
          // Если ошибка связана с аутентификацией (401) - очищаем токены
          if (error instanceof Error && error.message.includes('Authentication expired')) {
            console.warn('🔐 Token expired, clearing auth data');
            localStorage.removeItem('authToken');
            // 🔐 SECURITY: refreshToken este acum în HttpOnly cookie (gestionat de backend)
            localStorage.removeItem('user');
            localStorage.removeItem('currentSession');
          } else if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('CORS'))) {
            console.warn('⚠️ Network error during auth restoration, keeping tokens');
            // При сетевых ошибках пытаемся использовать кешированные данные пользователя
            const cachedUser = localStorage.getItem('user');
            if (cachedUser) {
              try {
                const user = JSON.parse(cachedUser);
                dispatch({ type: 'SET_USER', payload: user });
                console.log('✅ Using cached user data during network error');
              } catch {
                console.error('❌ Failed to parse cached user data');
              }
            }
          } else {
            console.error('❌ Unexpected error during auth restoration:', error);
            localStorage.removeItem('authToken');
            // 🔐 SECURITY: refreshToken este acum în HttpOnly cookie (gestionat de backend)
            localStorage.removeItem('user');
            localStorage.removeItem('currentSession');
          }
        }
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
      isInitializing = false;
      console.log('🏁 Auth initialization completed');
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string, rememberDevice = false) => {
    try {
      // 🧹 Спочатку очищаємо всі старі токени перед новим логіном
      console.log('🧹 Cleaning old tokens before new login...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('currentSession');
      AuthService.clearSession();
      
      // Також викликаємо logout на backend, щоб очистити HttpOnly cookie
      try {
        await AuthService.logout();
      } catch (error) {
        // Ігноруємо помилки logout перед логіном (можливо, користувач вже розлогінений)
        console.log('⚠️ Logout before login failed (expected if not logged in):', error);
      }
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // 🔧 Colectăm informații despre dispozitiv
      const deviceInfo = DeviceInfoService.getAllDeviceInfo();
      console.log('📱 Device info collected:', deviceInfo);
      
      // 🔧 Apelam API pentru login cu informații despre dispozitiv
      const response = await AuthService.loginWithDeviceInfo(
        { email, password },
        deviceInfo,
        rememberDevice
      );
      
      console.log('✅ Login response:', response);
      
      // Verificăm dacă răspunsul conține success și e false
      if (response.success === false) {
        throw new Error(response.message || 'Eroare la autentificare');
      }
      
      // Verificăm dacă avem token
      if (!response.token) {
        throw new Error('Răspuns invalid de la server: lipsă token');
      }
      
      // Extragem datele din răspunsul API
      const { token, user: userDto, session } = response;
      
      console.log('🔑 Token primit:', token ? 'Da' : 'Nu');
      console.log('👤 User from response:', userDto);
      console.log('📱 Session from response:', session);
      
      // 🔐 SECURITY: Salvăm doar access token în localStorage
      // Refresh token este acum în HttpOnly cookie (backend îl setează automat)
      localStorage.setItem('authToken', token);
      
      // Folosim datele utilizatorului din răspunsul login
      const user = convertUserDtoToUser(userDto);
      console.log('✅ Converted user:', user);
      
      // Salvăm utilizatorul în localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: 'SET_USER', payload: user });
      
      // 🔧 Processăm informațiile despre sesiune
      if (session) {
        dispatch({ type: 'SET_SESSION', payload: session });
        
        // 🔔 Afișăm notificare pentru dispozitiv nou
        if (session.isNewDevice) {
          console.log('🔔 Dispozitiv nou detectat:', {
            deviceName: session.deviceName,
            deviceType: session.deviceType,
            browser: session.browser,
            platform: session.platform,
          });
          // TODO: Arată utilizatorului notificare prin NotificationService
          // NotificationService.showSecurityAlert('newDevice', session);
        }
      }
      
      // Dezactivăm SignalR pentru moment
      // await notificationService.connect(user.id);
      
      // 🔧 Returnam session pentru procesare în pagina de login
      return session || null;
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Îmbunătățire a tratării erorilor
      let errorMessage = 'Eroare la autentificare';
      
      if (error instanceof Error) {
        const apiError = error as Error & { status?: number; data?: { message?: string; success?: boolean } };
        
        if (apiError.status === 401 || apiError.data?.success === false) {
          errorMessage = apiError.data?.message || 'Email sau parolă incorectă';
        } else if (apiError.status === 500) {
          errorMessage = 'Eroare de server. Încercați mai târziu.';
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }
      
      // Curățăm token-urile la eroare
      localStorage.removeItem('authToken');
      // 🔐 SECURITY: Nu mai ștergem refreshToken din localStorage (este în cookie)
      localStorage.removeItem('user');
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Creăm eroare cu mesaj clar
      const userFriendlyError = new Error(errorMessage);
      throw userFriendlyError;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // 🔧 Colectăm informații despre dispozitiv
      const deviceInfo = DeviceInfoService.getAllDeviceInfo();
      console.log('📱 Device info collected for registration:', deviceInfo);
      
      // Convertăm rolul în formatul corect pentru API
      const convertedRole = userData.role === 'student' ? 'Student' : 
                           userData.role === 'teacher' ? 'Teacher' :
                           userData.role === 'admin' ? 'Administrator' :
                           userData.role;

      // Obținem User Agent pentru consent tracking
      const consentUserAgent = navigator.userAgent;
      const consentIPAddress = 'client'; // IP-ul va fi determinat pe server

      // 🔧 Apelăm API pentru înregistrare cu informații despre dispozitiv și consimțăminte GDPR
      const response = await AuthService.registerWithDeviceInfo(
        {
          role: convertedRole as string,
          name: userData.firstname,
          surname: userData.lastname,
          email: userData.email,
          password: userData.password,
          phoneNumber: userData.phoneNumber,
          hasAcceptedPrivacyPolicy: userData.hasAcceptedPrivacyPolicy,
          hasAcceptedTerms: userData.hasAcceptedTerms,
          hasAcceptedMarketing: userData.hasAcceptedMarketing,
          hasAcceptedCookies: userData.hasAcceptedCookies,
          hasAcceptedAttendanceTracking: userData.hasAcceptedAttendanceTracking,
          hasAcceptedPaymentTracking: userData.hasAcceptedPaymentTracking,
          hasAcceptedGroupPlacement: userData.hasAcceptedGroupPlacement,
          hasAcceptedScheduleTracking: userData.hasAcceptedScheduleTracking,
          studentName: userData.studentName,
          parentName: userData.parentName,
          consentTimestamp: new Date().toISOString(),
          consentIPAddress,
          consentUserAgent,
        },
        deviceInfo
      );
      
      console.log('✅ Register response:', response);
      
      // ⚠️ ВАЖНО: RegisterResponse НЕ содержит success/message/session согласно документации!
      // Проверяем только наличие token
      if (!response.token) {
        throw new Error('Răspuns invalid de la server: lipsă token');
      }
      
      // Extragem datele din răspunsul API
      const { token, refreshToken, user: userDto } = response;
      
      console.log('🔑 Register Token primit:', token ? 'Da' : 'Nu');
      console.log('👤 User from register response:', userDto);
      
      // 🔐 SECURITY: Salvăm doar access token în localStorage
      // Refresh token este acum în HttpOnly cookie (backend îl setează automat)
      localStorage.setItem('authToken', token);
      
      // 🔐 SECURITY: Nu mai salvăm refreshToken în localStorage
      // Backend-ul îl setează automat în HttpOnly cookie la register
      if (refreshToken) {
        console.log('⚠️ RefreshToken primit în response (backward compatibility), dar nu îl salvăm - folosim cookie');
      }
      
      // Convertăm UserDto în User
      const user = convertUserDtoToUser(userDto);
      
      // Salvăm utilizatorul în localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: 'SET_USER', payload: user });
      
      console.log('✅ Înregistrare reușită pentru:', user.email);
      
      // Dezactivăm SignalR pentru moment
      // await notificationService.connect(user.id);
      
      // Register nu returnează session conform documentației
      return null;
    } catch (error) {
      console.error('❌ Register error:', error);
      
      // Îmbunătățirea tratării erorilor
      let errorMessage = 'Eroare la înregistrare';
      
      if (error instanceof Error) {
        const apiError = error as Error & { 
          status?: number; 
          data?: { 
            message?: string; 
            errors?: Record<string, string[]>;
          } 
        };
        
        if (apiError.status === 400) {
          // Erori de validare - parseaza errors object
          if (apiError.data?.errors) {
            const errorMessages = Object.values(apiError.data.errors).flat();
            errorMessage = errorMessages.join(', ');
          } else if (apiError.data?.message) {
            errorMessage = apiError.data.message;
          } else {
            errorMessage = 'Date invalide. Verifică toate câmpurile.';
          }
        } else if (apiError.status === 409) {
          errorMessage = 'Email-ul este deja înregistrat.';
        } else if (apiError.status === 500) {
          errorMessage = 'Eroare de server. Încercați mai târziu.';
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }
      
      // Curățăm token-urile la eroare
      localStorage.removeItem('authToken');
      // 🔐 SECURITY: refreshToken este acum în HttpOnly cookie (gestionat de backend)
      localStorage.removeItem('user');
      localStorage.removeItem('currentSession');
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Creăm eroare cu mesaj clar
      const userFriendlyError = new Error(errorMessage);
      throw userFriendlyError;
    }
  };

  const logout = async () => {
    try {
      // 🔐 SECURITY: Nu mai citim refreshToken din localStorage
      // Backend-ul îl va citi automat din HttpOnly cookie
      // Apelăm endpoint-ul de logout care va clear-ui cookie-ul
      await AuthService.logout();
    } catch (error) {
      console.error('Ошибка при logout:', error);
    }
    
    // Очищаем сессию
    AuthService.clearSession();
    
    // Очищаем локальное хранилище
    localStorage.removeItem('authToken');
    // 🔐 SECURITY: refreshToken este acum în HttpOnly cookie (gestionat de backend)
    localStorage.removeItem('user');
    localStorage.removeItem('currentSession');
    
    dispatch({ type: 'CLEAR_USER' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    setCurrentSession: (session) => dispatch({ type: 'SET_SESSION', payload: session }), // 🔧 NEW
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

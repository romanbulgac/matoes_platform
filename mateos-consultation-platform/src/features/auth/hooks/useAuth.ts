import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, UserEntity } from '@/shared';
import { authService } from '../services/authService';
import { LoginForm, RegisterForm } from '@/types';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, setUser, setGlobalLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const clearUser = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const login = useCallback(async (credentials: LoginForm) => {
    try {
      setGlobalLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      const userEntity = UserEntity.fromApiResponse(response.data.user);
      
      setUser(response.data.user);
      navigate('/dashboard');
      
      return { success: true, user: userEntity };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la autentificare';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setGlobalLoading(false);
    }
  }, [navigate, setUser, setGlobalLoading]);

  const register = useCallback(async (userData: RegisterForm) => {
    try {
      setGlobalLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      const userEntity = UserEntity.fromApiResponse(response.data.user);
      
      setUser(response.data.user);
      navigate('/dashboard');
      
      return { success: true, user: userEntity };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la înregistrare';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setGlobalLoading(false);
    }
  }, [navigate, setUser, setGlobalLoading]);

  const logout = useCallback(async () => {
    try {
      setGlobalLoading(true);
      await authService.logout();
      clearUser();
      navigate('/auth/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      // Even if logout fails, clear local state
      clearUser();
      navigate('/auth/login');
    } finally {
      setGlobalLoading(false);
    }
  }, [navigate, clearUser, setGlobalLoading]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      setUser(response.data.user);
      return true;
    } catch (err) {
      clearUser();
      navigate('/auth/login');
      return false;
    }
  }, [setUser, clearUser, navigate]);

  const updateProfile = useCallback(async (profileData: Partial<UserEntity>) => {
    try {
      setGlobalLoading(true);
      setError(null);
      
      const response = await authService.updateProfile(profileData);
      setUser(response.data.user);
      
      return { success: true, user: response.data.user };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la actualizarea profilului';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setGlobalLoading(false);
    }
  }, [setUser, setGlobalLoading]);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    try {
      setGlobalLoading(true);
      setError(null);
      
      await authService.changePassword(oldPassword, newPassword);
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la schimbarea parolei';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setGlobalLoading(false);
    }
  }, [setGlobalLoading]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setGlobalLoading(true);
      setError(null);
      
      await authService.resetPassword(email);
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la resetarea parolei';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setGlobalLoading(false);
    }
  }, [setGlobalLoading]);

  const confirmResetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      setGlobalLoading(true);
      setError(null);
      
      await authService.confirmResetPassword(token, newPassword);
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Eroare la confirmarea parolei';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setGlobalLoading(false);
    }
  }, [setGlobalLoading]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Return auth state and actions
  return {
    // State
    user: user ? UserEntity.fromApiResponse(user) : null,
    isAuthenticated: !!user,
    isLoading: useAppStore.getState().globalLoading,
    error,

    // Actions
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    resetPassword,
    confirmResetPassword,
    clearError,
  };
};

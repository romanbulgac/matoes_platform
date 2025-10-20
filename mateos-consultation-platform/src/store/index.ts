import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

// Глобальное состояние приложения
interface AppState {
  // UI состояние
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  notifications: Notification[];
  
  // Пользователь
  user: User | null;
  isAuthenticated: boolean;
  
  // Загрузка
  globalLoading: boolean;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  setUser: (user: User | null) => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    persist(
      immer((set, _get) => ({
        // Initial state
        theme: 'system',
        sidebarCollapsed: false,
        notifications: [],
        user: null,
        isAuthenticated: false,
        globalLoading: false,

        // Actions
        setTheme: (theme) => set((state) => {
          state.theme = theme;
        }),

        toggleSidebar: () => set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        }),

        addNotification: (notification) => set((state) => {
          state.notifications.unshift({
            ...notification,
            id: Date.now().toString(),
            timestamp: Date.now(),
            read: false,
          });
          
          // Ограничиваем количество уведомлений
          if (state.notifications.length > 50) {
            state.notifications = state.notifications.slice(0, 50);
          }
        }),

        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id);
        }),

        markNotificationAsRead: (id) => set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          if (notification) {
            notification.read = true;
          }
        }),

        clearAllNotifications: () => set((state) => {
          state.notifications = [];
        }),

        setUser: (user) => set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
        }),

        setGlobalLoading: (loading) => set((state) => {
          state.globalLoading = loading;
        }),
      })),
      {
        name: 'mateos-app-storage',
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          // Не сохраняем уведомления и загрузку
        }),
      }
    )
  )
);

// Selectors для оптимизации re-renders
export const useTheme = () => useAppStore((state) => state.theme);
export const useUser = () => useAppStore((state) => state.user);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUnreadNotificationsCount = () => 
  useAppStore((state) => state.notifications.filter(n => !n.read).length);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);
export const useGlobalLoading = () => useAppStore((state) => state.globalLoading);

// Subscribe to theme changes for system theme handling
useAppStore.subscribe(
  (state) => state.theme,
  (theme) => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = () => {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      };
      
      updateTheme();
      mediaQuery.addEventListener('change', updateTheme);
      
      return () => mediaQuery.removeEventListener('change', updateTheme);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      return undefined;
    }
  }
);

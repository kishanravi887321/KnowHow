/**
 * UI state management using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, Notification, User, SystemStatus } from '@/types/ui';
import { MOCK_SYSTEM_STATUS, MOCK_NOTIFICATIONS, MOCK_USER } from '@/data/mockData';

interface UIState {
  // Theme
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Sidebar / panels
  rightPanelOpen: boolean;
  rightPanelWidth: number;
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
  setRightPanelWidth: (width: number) => void;

  // Layer panel
  layerPanelOpen: boolean;
  toggleLayerPanel: () => void;
  setLayerPanelOpen: (open: boolean) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserPreferences: (prefs: Partial<User['preferences']>) => void;

  // System status
  systemStatus: SystemStatus;
  setSystemStatus: (status: Partial<SystemStatus>) => void;

  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Modals
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;

  // Toasts
  toasts: Array<{ id: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>;
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const INITIAL_THEME: Theme = 'dark';

function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: INITIAL_THEME,
      resolvedTheme: getResolvedTheme(INITIAL_THEME),
      setTheme: (theme) => {
        const resolved = getResolvedTheme(theme);
        document.documentElement.classList.toggle('dark', resolved === 'dark');
        set({ theme, resolvedTheme: resolved });
      },
      toggleTheme: () => {
        const { theme } = get();
        const themes: Theme[] = ['light', 'dark', 'system'];
        const next = themes[(themes.indexOf(theme) + 1) % themes.length];
        get().setTheme(next);
      },

      rightPanelOpen: true,
      rightPanelWidth: 380,
      toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
      setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
      setRightPanelWidth: (width) => set({ rightPanelWidth: Math.max(300, Math.min(600, width)) }),

      layerPanelOpen: false,
      toggleLayerPanel: () => set((state) => ({ layerPanelOpen: !state.layerPanelOpen })),
      setLayerPanelOpen: (open) => set({ layerPanelOpen: open }),

      notifications: MOCK_NOTIFICATIONS,
      unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
      addNotification: (notification) =>
        set((state) => {
          const newNotif: Notification = {
            ...notification,
            id: `notif-${Date.now()}`,
            timestamp: new Date().toISOString(),
            read: false,
          };
          return {
            notifications: [newNotif, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          };
        }),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: state.notifications.find((n) => n.id === id)?.read
            ? state.unreadCount
            : Math.max(0, state.unreadCount - 1),
        })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

      user: MOCK_USER,
      setUser: (user) => set({ user }),
      updateUserPreferences: (prefs) =>
        set((state) => ({
          user: state.user ? { ...state.user, preferences: { ...state.user.preferences, ...prefs } } : null,
        })),

      systemStatus: MOCK_SYSTEM_STATUS,
      setSystemStatus: (status) =>
        set((state) => ({ systemStatus: { ...state.systemStatus, ...status } })),

      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      activeModal: null,
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),

      toasts: [],
      addToast: (message, type = 'info') =>
        set((state) => ({
          toasts: [...state.toasts, { id: `toast-${Date.now()}`, message, type }],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        rightPanelOpen: state.rightPanelOpen,
        rightPanelWidth: state.rightPanelWidth,
        layerPanelOpen: state.layerPanelOpen,
      }),
    }
  )
);

// Selector hooks
export const useTheme = () => useUIStore((state) => ({ theme: state.theme, resolvedTheme: state.resolvedTheme }));
export const useRightPanel = () => useUIStore((state) => ({
  open: state.rightPanelOpen,
  width: state.rightPanelWidth,
  toggle: state.toggleRightPanel,
  setOpen: state.setRightPanelOpen,
  setWidth: state.setRightPanelWidth,
}));
export const useLayerPanel = () => useUIStore((state) => ({
  open: state.layerPanelOpen,
  toggle: state.toggleLayerPanel,
  setOpen: state.setLayerPanelOpen,
}));
export const useNotifications = () => useUIStore((state) => ({
  notifications: state.notifications,
  unreadCount: state.unreadCount,
  add: state.addNotification,
  markRead: state.markNotificationRead,
  markAllRead: state.markAllNotificationsRead,
  remove: state.removeNotification,
  clear: state.clearNotifications,
}));
export const useUser = () => useUIStore((state) => state.user);
export const useSystemStatus = () => useUIStore((state) => state.systemStatus);
export const useGlobalLoading = () => useUIStore((state) => state.globalLoading);
export const useModal = () => useUIStore((state) => ({
  activeModal: state.activeModal,
  open: state.openModal,
  close: state.closeModal,
}));
export const useToasts = () => useUIStore((state) => state.toasts);
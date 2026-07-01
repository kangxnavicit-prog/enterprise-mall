// Enterprise Mall - Global Notification Store (Zustand)
// Manages global toast/notification state across all pages

import { create } from 'zustand';

interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (type: NotificationItem['type'], message: string) => void;
  removeNotification: (id: string) => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyWarning: (message: string) => void;
  notifyInfo: (message: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (type: NotificationItem['type'], message: string) => {
    const id: string = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const notification: NotificationItem = { id, type, message };

    set((state) => ({ notifications: [...state.notifications, notification] }));

    // Auto-remove after 3 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 3000);
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  notifySuccess: (message: string) => {
    const id: string = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    set((state) => ({ notifications: [...state.notifications, { id, type: 'success', message }] }));
    setTimeout(() => {
      set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }));
    }, 3000);
  },

  notifyError: (message: string) => {
    const id: string = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    set((state) => ({ notifications: [...state.notifications, { id, type: 'error', message }] }));
    setTimeout(() => {
      set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }));
    }, 3000);
  },

  notifyWarning: (message: string) => {
    const id: string = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    set((state) => ({ notifications: [...state.notifications, { id, type: 'warning', message }] }));
    setTimeout(() => {
      set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }));
    }, 3000);
  },

  notifyInfo: (message: string) => {
    const id: string = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    set((state) => ({ notifications: [...state.notifications, { id, type: 'info', message }] }));
    setTimeout(() => {
      set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }));
    }, 3000);
  },
}));

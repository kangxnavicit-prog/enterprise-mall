// Enterprise Mall - useNotification Hook
// Proxy to the global notification Zustand store for convenient access

import { useNotificationStore } from '../stores/notificationStore';

export function useNotification() {
  const store = useNotificationStore();

  return {
    notifications: store.notifications,
    addNotification: store.addNotification,
    removeNotification: store.removeNotification,
    notifySuccess: store.notifySuccess,
    notifyError: store.notifyError,
    notifyWarning: store.notifyWarning,
    notifyInfo: store.notifyInfo,
  };
}

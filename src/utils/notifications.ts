/**
 * Simple notification system for user feedback
 */

import { createSignal } from 'solid-js';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

const [notifications, setNotifications] = createSignal<Notification[]>([]);

export function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) {
  const id = `notification-${Date.now()}-${Math.random()}`;
  const notification: Notification = { id, message, type, duration };
  
  setNotifications(prev => [...prev, notification]);
  
  if (duration > 0) {
    setTimeout(() => {
      dismissNotification(id);
    }, duration);
  }
  
  return id;
}

export function dismissNotification(id: string) {
  setNotifications(prev => prev.filter(n => n.id !== id));
}

export function getNotifications() {
  return notifications;
}

// Convenience functions
export const showError = (message: string, duration?: number) => showNotification(message, 'error', duration);
export const showSuccess = (message: string, duration?: number) => showNotification(message, 'success', duration);
export const showInfo = (message: string, duration?: number) => showNotification(message, 'info', duration);

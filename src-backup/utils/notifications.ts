/**
 * Notification system for user feedback
 * - Errors go to persistent ErrorPanel
 * - Success/Info messages show as temporary toasts
 */

import { createSignal } from 'solid-js';
import { addError } from '../stores/errorStore';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info';
  duration?: number;
}

const [notifications, setNotifications] = createSignal<Notification[]>([]);

export function showNotification(message: string, type: 'success' | 'info' = 'info', duration = 4000) {
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
/**
 * Show an error in the persistent error panel
 * @param message - Error message to display
 * @param error - Optional error object for stack trace
 * @param context - Optional context about where the error occurred
 */
export const showError = (message: string, error?: Error | unknown, context?: string) => {
  return addError(message, error, context);
};

export const showSuccess = (message: string, duration?: number) => showNotification(message, 'success', duration);
export const showInfo = (message: string, duration?: number) => showNotification(message, 'info', duration);

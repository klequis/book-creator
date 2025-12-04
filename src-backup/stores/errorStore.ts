/**
 * Error store for persistent error tracking
 */

import { createSignal } from 'solid-js';

export interface ErrorEntry {
  id: string;
  message: string;
  timestamp: Date;
  stack?: string;
  context?: string; // Additional context about where the error occurred
}

const [errors, setErrors] = createSignal<ErrorEntry[]>([]);
const [isErrorPanelOpen, setIsErrorPanelOpen] = createSignal(false);

/**
 * Add an error to the error panel
 */
export function addError(message: string, error?: Error | unknown, context?: string) {
  const id = `error-${Date.now()}-${Math.random()}`;
  
  const errorEntry: ErrorEntry = {
    id,
    message,
    timestamp: new Date(),
    context,
  };

  // Extract stack trace if available
  if (error instanceof Error && error.stack) {
    errorEntry.stack = error.stack;
  }

  setErrors(prev => [...prev, errorEntry]);
  setIsErrorPanelOpen(true); // Auto-open panel when error occurs
  
  return id;
}

/**
 * Clear a specific error by ID
 */
export function clearError(id: string) {
  setErrors(prev => prev.filter(e => e.id !== id));
}

/**
 * Clear all errors
 */
export function clearAllErrors() {
  setErrors([]);
}

/**
 * Get all errors
 */
export function getErrors() {
  return errors;
}

/**
 * Check if error panel is open
 */
export function getIsErrorPanelOpen() {
  return isErrorPanelOpen;
}

/**
 * Set error panel open state
 */
export function setErrorPanelOpen(open: boolean) {
  setIsErrorPanelOpen(open);
}

/**
 * Close error panel (only if no errors)
 */
export function closeErrorPanel() {
  setIsErrorPanelOpen(false);
}

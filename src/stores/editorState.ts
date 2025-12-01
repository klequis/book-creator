/**
 * Editor state tracking for unsaved changes
 */

import { createSignal } from 'solid-js';

const [currentFilePath, setCurrentFilePath] = createSignal<string | null>(null);
const [hasUnsavedChanges, setHasUnsavedChanges] = createSignal(false);
let saveCallback: (() => Promise<void>) | null = null;

export const editorState = {
  getCurrentFilePath: () => currentFilePath(),
  setCurrentFilePath,
  
  getHasUnsavedChanges: () => hasUnsavedChanges(),
  setHasUnsavedChanges,
  
  registerSaveCallback: (callback: () => Promise<void>) => {
    saveCallback = callback;
  },
  
  unregisterSaveCallback: () => {
    saveCallback = null;
  },
  
  async saveCurrentFile(): Promise<boolean> {
    if (!saveCallback) {
      console.log('[EditorState] No save callback registered');
      return true; // No editor open, nothing to save
    }
    
    if (!hasUnsavedChanges()) {
      console.log('[EditorState] No unsaved changes');
      return true; // Nothing to save
    }
    
    try {
      console.log('[EditorState] Saving current file...');
      await saveCallback();
      return true;
    } catch (error) {
      console.error('[EditorState] Failed to save:', error);
      return false;
    }
  }
};

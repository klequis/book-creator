import { getCurrentWindow, LogicalPosition, LogicalSize } from '@tauri-apps/api/window';
import { load } from '@tauri-apps/plugin-store';

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function saveWindowState() {
  try {
    const window = getCurrentWindow();
    const position = await window.outerPosition();
    const size = await window.outerSize();
    
    const state: WindowState = {
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height
    };
    
    const store = await load('settings.json');
    await store.set('windowState', state);
    await store.save();
    
    console.log('Window state saved:', state);
  } catch (error) {
    console.error('Failed to save window state:', error);
  }
}

export async function restoreWindowState() {
  try {
    const store = await load('settings.json');
    const state = await store.get<WindowState>('windowState');
    
    if (state) {
      const window = getCurrentWindow();
      await window.setPosition(new LogicalPosition(state.x, state.y));
      await window.setSize(new LogicalSize(state.width, state.height));
      console.log('Window state restored:', state);
    }
  } catch (error) {
    console.error('Failed to restore window state:', error);
  }
}

export function setupWindowStateListeners() {
  let saveTimeout: number;
  
  const window = getCurrentWindow();
  
  // Save on resize (debounced)
  window.listen('tauri://resize', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveWindowState(), 500);
  });
  
  // Save on move (debounced)
  window.listen('tauri://move', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveWindowState(), 500);
  });
  
  // Save immediately on close
  window.listen('tauri://close-requested', () => {
    saveWindowState();
  });
}

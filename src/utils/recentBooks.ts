/**
 * Recent books tracking with persistent storage
 */

import { load } from '@tauri-apps/plugin-store';

export interface RecentBook {
  path: string;
  lastOpened: number;
}

const MAX_RECENT_BOOKS = 5;
const STORE_KEY = 'recentBooks';

let storeInstance: Awaited<ReturnType<typeof load>> | null = null;

async function getStore() {
  if (!storeInstance) {
    storeInstance = await load('settings.json');
  }
  return storeInstance;
}

export async function getRecentBooks(): Promise<RecentBook[]> {
  const store = await getStore();
  const books = await store.get<RecentBook[]>(STORE_KEY);
  return books || [];
}

export async function addRecentBook(path: string): Promise<void> {
  const store = await getStore();
  const books = await getRecentBooks();
  
  // Remove existing entry if present
  const filtered = books.filter(book => book.path !== path);
  
  // Add new entry at the front
  const updated: RecentBook[] = [
    { path, lastOpened: Date.now() },
    ...filtered
  ].slice(0, MAX_RECENT_BOOKS);
  
  await store.set(STORE_KEY, updated);
  await store.save();
}

export async function removeRecentBook(path: string): Promise<void> {
  const store = await getStore();
  const books = await getRecentBooks();
  const filtered = books.filter(book => book.path !== path);
  
  await store.set(STORE_KEY, filtered);
  await store.save();
}

export async function clearRecentBooks(): Promise<void> {
  const store = await getStore();
  await store.set(STORE_KEY, []);
  await store.save();
}

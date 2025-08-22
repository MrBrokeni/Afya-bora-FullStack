import { getCurrentUser } from './firebase';

export function getOrCreateUserId(): string {
  if (typeof window === 'undefined') {
    return 'server';
  }
  
  const currentUser = getCurrentUser();
  if (currentUser) {
    return currentUser.uid;
  }
  
  // Fallback for unauthenticated users (should not happen in protected routes)
  const storageKey = 'afyaBoraUserId';
  let userId = window.localStorage.getItem(storageKey);
  if (!userId) {
    if (window.crypto && 'randomUUID' in window.crypto) {
      userId = (window.crypto as Crypto).randomUUID();
    } else {
      userId = `temp_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    }
    window.localStorage.setItem(storageKey, userId);
  }
  return userId;
}

// This function is no longer needed as we use email authentication
export async function ensureAnonymousAuth(): Promise<void> {
  // No-op for email authentication
  return;
}



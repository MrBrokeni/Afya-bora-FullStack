export function getOrCreateUserId(): string {
  if (typeof window === 'undefined') {
    return 'server';
  }
  const storageKey = 'afyaBoraUserId';
  let userId = window.localStorage.getItem(storageKey);
  if (!userId) {
    if (window.crypto && 'randomUUID' in window.crypto) {
      userId = (window.crypto as Crypto).randomUUID();
    } else {
      userId = `anon_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    }
    window.localStorage.setItem(storageKey, userId);
  }
  return userId;
}

export async function ensureAnonymousAuth(): Promise<void> {
  if (typeof window === 'undefined') return;
  const { auth } = await import('@/lib/firebase');
  const { onAuthStateChanged, signInAnonymously } = await import('firebase/auth');
  await new Promise<void>((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          await signInAnonymously(auth);
        }
        unsub();
        resolve();
      } catch (e) {
        unsub();
        reject(e);
      }
    });
  });
}



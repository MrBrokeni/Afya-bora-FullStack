import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDkFaKknZMe4l2AAqt5KWwb8wsJGmN-6TY",
    authDomain: "afya-bora-411b1.firebaseapp.com",
    projectId: "afya-bora-411b1",
    storageBucket: "afya-bora-411b1.firebasestorage.app",
    messagingSenderId: "673266736624",
    appId: "1:673266736624:web:a0b046fd2867c68f2f1135"
    // Removed measurementId to prevent OpenTelemetry dependency issues on Vercel
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig, {
  // Explicitly disable performance monitoring to prevent OpenTelemetry dependencies
  performance: false
});

export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  // Helps in environments where streaming connections are blocked by proxies/AV
  experimentalAutoDetectLongPolling: true,
});
export const auth = getAuth(app);

// Authentication functions
export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signUpUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};



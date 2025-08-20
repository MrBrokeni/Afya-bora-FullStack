import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDkFaKknZMe4l2AAqt5KWwb8wsJGmN-6TY",
    authDomain: "afya-bora-411b1.firebaseapp.com",
    projectId: "afya-bora-411b1",
    storageBucket: "afya-bora-411b1.firebasestorage.app",
    messagingSenderId: "673266736624",
    appId: "1:673266736624:web:a0b046fd2867c68f2f1135",
    measurementId: "G-MPT1RK10RJ"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  // Helps in environments where streaming connections are blocked by proxies/AV
  experimentalAutoDetectLongPolling: true,
});
export const auth = getAuth(app);



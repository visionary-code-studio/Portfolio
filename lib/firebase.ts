import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyCTaXYVE9cMQXZ3ui_HWj-V4P-CgE5pznc",
  authDomain: "visionary-code-studio.firebaseapp.com",
  projectId: "visionary-code-studio",
  storageBucket: "visionary-code-studio.firebasestorage.app",
  messagingSenderId: "193653012914",
  appId: "1:193653012914:web:03a2fa2d6b973eae354cab"
};

// Safe initialization for Next.js (avoids duplicate app initialization in SSR / HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export default app;

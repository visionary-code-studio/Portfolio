import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Pushes live portfolio content updates to Firebase Cloud Firestore.
 * This guarantees real-time synchronization across smartphones, iOS, Android,
 * and external visitor browsers globally.
 */
export async function pushContentToCloud(data: any): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db) {
      return { success: false, error: 'Firestore not initialized' };
    }
    const cleanPayload = {
      ...data,
      _updatedAt: Date.now(),
      _userEdited: true,
    };
    await setDoc(doc(db, 'portfolio', 'content'), cleanPayload, { merge: true });
    return { success: true };
  } catch (err: any) {
    console.warn('Firestore cloud sync notice (Check Firestore rules in Firebase Console):', err?.message);
    return { success: false, error: err?.message };
  }
}

/**
 * Subscribes to real-time portfolio content updates from Firebase Firestore.
 * Automatically notifies when new presentations, certificates, or services are published.
 */
export function subscribeToCloudContent(onUpdate: (data: any) => void): () => void {
  try {
    if (!db) return () => {};
    const unsub = onSnapshot(
      doc(db, 'portfolio', 'content'),
      (snap) => {
        if (snap.exists()) {
          const cloudData = snap.data();
          if (cloudData && cloudData._updatedAt) {
            onUpdate(cloudData);
          }
        }
      },
      (err) => {
        console.warn('Firestore cloud stream note (falling back to server API):', err?.message);
      }
    );
    return unsub;
  } catch {
    return () => {};
  }
}

/**
 * One-time fetch of latest portfolio content from Cloud Firestore.
 */
export async function fetchContentFromCloud(): Promise<any | null> {
  try {
    if (!db) return null;
    const snap = await getDoc(doc(db, 'portfolio', 'content'));
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err: any) {
    console.warn('Firestore one-time fetch note:', err?.message);
    return null;
  }
}

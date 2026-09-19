/**
 * Client-Side Persistence, Large File IndexedDB Storage (100MB+),
 * and Multi-Tab Live Sync for Vaibhav Portfolio
 */

const STORAGE_KEY = 'vaibhav_portfolio_content_backup';
const SYNC_CHANNEL_NAME = 'vaibhav_portfolio_sync';
const DB_NAME = 'vaibhav_portfolio_assets_db';
const STORE_NAME = 'uploaded_documents';

// Open IndexedDB for large files (PPT, PDF, PPTX up to 100MB+)
export function openFilesDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Store a large document (Blob, File, or Data URL) in IndexedDB
export async function storeDocumentInDb(id: string, fileOrData: Blob | File | string, name: string): Promise<string> {
  try {
    const db = await openFilesDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = {
        id,
        name,
        data: fileOrData,
        updatedAt: Date.now(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(id);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not store in IndexedDB:', err);
    return id;
  }
}

// Retrieve a document from IndexedDB and return an Object URL
export async function getDocumentUrlFromDb(id: string): Promise<string | null> {
  try {
    const db = await openFilesDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result && req.result.data) {
          if (req.result.data instanceof Blob) {
            resolve(URL.createObjectURL(req.result.data));
          } else if (typeof req.result.data === 'string') {
            resolve(req.result.data);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

// Broadcast channel singleton for instant cross-tab sync
let channel: BroadcastChannel | null = null;
function getChannel(): BroadcastChannel | null {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    if (!channel) {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    }
    return channel;
  }
  return null;
}

// Save portfolio content locally and broadcast live changes to the portfolio
export function savePortfolioContentLocally(data: any) {
  if (typeof window === 'undefined') return;

  const taggedData = {
    ...data,
    _userEdited: true,
    _updatedAt: Date.now(),
  };

  try {
    // Sanitize any large inline base64 data to avoid 5MB localStorage limits
    const sanitized = {
      ...taggedData,
      presentations: taggedData.presentations?.map((p: any) => ({
        ...p,
        file: typeof p.file === 'string' && p.file.startsWith('data:') && p.file.length > 50000 ? (p.preview || '') : p.file,
      })),
      certifications: taggedData.certifications?.map((c: any) => ({
        ...c,
        file: typeof c.file === 'string' && c.file.startsWith('data:') && c.file.length > 50000 ? (c.preview || '') : c.file,
      })),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.warn('LocalStorage save notice:', e);
  }

  // Broadcast to other tabs (e.g. from /admin to /)
  const ch = getChannel();
  if (ch) {
    try {
      ch.postMessage({ type: 'PORTFOLIO_CONTENT_UPDATED', data: taggedData });
    } catch (e) {
      console.warn('Broadcast channel notice:', e);
    }
  }
}

// Load portfolio content prioritizing user edits
export function loadPortfolioContentLocally(fallback: any) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return { ...fallback, ...parsed };
    }
  } catch (e) {
    console.warn('Error reading local portfolio data:', e);
  }
  return fallback;
}

// Subscribe to real-time updates from admin actions in other tabs
export function subscribeToPortfolioSync(onUpdate: (data: any) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const ch = getChannel();
  const handleChannelMsg = (event: MessageEvent) => {
    if (event.data && event.data.type === 'PORTFOLIO_CONTENT_UPDATED' && event.data.data) {
      onUpdate(event.data.data);
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed) onUpdate(parsed);
      } catch (e) {}
    }
  };

  if (ch) {
    ch.addEventListener('message', handleChannelMsg);
  }
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    if (ch) ch.removeEventListener('message', handleChannelMsg);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

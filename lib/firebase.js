import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const PUB = path.join(ROOT_DIR, 'public');

let firestoreDb = null;
let firebaseInitialized = false;

const DEFAULT_CONFIG = {
  projectId: "moonlit-lock-m9v0l",
  appId: "1:900558776623:web:59b0ea9dbfb52cab4419da",
  apiKey: "AIzaSyCchfqvddQP9wONxQrgNCfPUFqvze-9i8g",
  authDomain: "moonlit-lock-m9v0l.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-remixremixlovesh-91de6225-410b-4926-ac56-4a9cd8eca0fc",
  storageBucket: "moonlit-lock-m9v0l.firebasestorage.app",
  messagingSenderId: "900558776623"
};

export function initFirebase() {
  if (firebaseInitialized) return firestoreDb;
  try {
    let config = null;
    const searchPaths = [
      path.join(ROOT_DIR, 'firebase-applet-config.json'),
      path.join(process.cwd(), 'firebase-applet-config.json'),
      '/var/task/firebase-applet-config.json'
    ];

    for (const p of searchPaths) {
      try {
        if (fs.existsSync(p)) {
          config = JSON.parse(fs.readFileSync(p, 'utf8'));
          if (config && config.projectId) break;
        }
      } catch {}
    }

    if (!config || !config.projectId) {
      if (process.env.FIREBASE_PROJECT_ID) {
        config = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || '(default)',
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          appId: process.env.FIREBASE_APP_ID,
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
        };
      } else {
        config = DEFAULT_CONFIG;
      }
    }

    const firebaseConfig = {
      apiKey: config.apiKey || DEFAULT_CONFIG.apiKey,
      authDomain: config.authDomain || DEFAULT_CONFIG.authDomain,
      projectId: config.projectId || DEFAULT_CONFIG.projectId,
      storageBucket: config.storageBucket || DEFAULT_CONFIG.storageBucket,
      messagingSenderId: config.messagingSenderId || DEFAULT_CONFIG.messagingSenderId,
      appId: config.appId || DEFAULT_CONFIG.appId
    };

    const app = initializeApp(firebaseConfig);
    const dbId = config.firestoreDatabaseId || DEFAULT_CONFIG.firestoreDatabaseId || '(default)';
    firestoreDb = getFirestore(app, dbId);
    firebaseInitialized = true;
    console.log('[Firebase] Cloud Firestore successfully initialized (DB:', dbId, ')');
    return firestoreDb;
  } catch (err) {
    console.error('[Firebase] Initialization error:', err);
    return null;
  }
}

const CLOUD_SYNC_DOC = 'app_state';
const CLOUD_SYNC_COLLECTION = 'store_data';

// Helper: Save in-memory uploaded image to Cloud Firestore documents to survive all container restarts
const CHUNK_SIZE = 500 * 1024; // 500KB safe chunk size per document

export async function saveImageToCloud(fileName, base64Data) {
  const db = initFirebase();
  if (!db || !fileName || !base64Data) return;
  try {
    const cleanId = fileName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const mainDocRef = doc(db, 'uploaded_images', cleanId);
    
    if (base64Data.length <= CHUNK_SIZE) {
      await setDoc(mainDocRef, {
        fileName,
        data: base64Data,
        isChunked: false,
        chunkCount: 1,
        createdAt: new Date().toISOString()
      });
    } else {
      const chunks = [];
      for (let i = 0; i < base64Data.length; i += CHUNK_SIZE) {
        chunks.push(base64Data.slice(i, i + CHUNK_SIZE));
      }
      
      // Save chunks in parallel
      await Promise.all(chunks.map((chunk, idx) => {
        const partRef = doc(db, 'uploaded_images', `${cleanId}_part_${idx}`);
        return setDoc(partRef, {
          fileName,
          chunkIndex: idx,
          chunkData: chunk,
          createdAt: new Date().toISOString()
        });
      }));

      await setDoc(mainDocRef, {
        fileName,
        isChunked: true,
        chunkCount: chunks.length,
        createdAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error('[Firebase] Error uploading image to cloud:', err);
  }
}

export async function getImageFromCloud(fileName) {
  const db = initFirebase();
  if (!db || !fileName) return null;
  try {
    const cleanId = fileName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const mainDocRef = doc(db, 'uploaded_images', cleanId);
    const snap = await getDoc(mainDocRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    if (!data) return null;
    if (!data.isChunked) {
      return data.data || null;
    }
    const count = data.chunkCount || 1;
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(getDoc(doc(db, 'uploaded_images', `${cleanId}_part_${i}`)));
    }
    const snaps = await Promise.all(promises);
    let full = '';
    for (const s of snaps) {
      if (s.exists()) full += (s.data().chunkData || '');
    }
    return full || null;
  } catch (err) {
    console.error('[Firebase] Error retrieving image from cloud:', err);
  }
  return null;
}

export async function loadFromCloudFirestore() {
  const db = initFirebase();
  if (!db) return null;
  try {
    const docRef = doc(db, CLOUD_SYNC_COLLECTION, CLOUD_SYNC_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data) {
        if (!data.isChunked && data.payload) {
          const parsed = JSON.parse(data.payload);
          console.log(`[Firebase] Loaded cloud database state with ${parsed.products?.length || 0} products & ${parsed.orders?.length || 0} orders.`);
          return parsed;
        } else if (data.isChunked) {
          const count = data.chunkCount || 1;
          const promises = [];
          for (let i = 0; i < count; i++) {
            promises.push(getDoc(doc(db, CLOUD_SYNC_COLLECTION, `${CLOUD_SYNC_DOC}_part_${i}`)));
          }
          const snaps = await Promise.all(promises);
          let fullPayload = '';
          for (const s of snaps) {
            if (s.exists()) fullPayload += (s.data().chunkData || '');
          }
          if (fullPayload) {
            const parsed = JSON.parse(fullPayload);
            console.log(`[Firebase] Loaded chunked cloud database state with ${parsed.products?.length || 0} products & ${parsed.orders?.length || 0} orders.`);
            return parsed;
          }
        }
      }
    }
  } catch (err) {
    console.error('[Firebase] Error loading state from cloud:', err);
  }
  return null;
}

export async function saveToCloudFirestore(fullDbState) {
  const db = initFirebase();
  if (!db || !fullDbState) return;
  try {
    const docRef = doc(db, CLOUD_SYNC_COLLECTION, CLOUD_SYNC_DOC);
    const jsonPayload = JSON.stringify(fullDbState);
    if (jsonPayload.length <= 600000) {
      await setDoc(docRef, {
        payload: jsonPayload,
        isChunked: false,
        updatedAt: new Date().toISOString(),
        productCount: fullDbState.products ? fullDbState.products.length : 0,
        orderCount: fullDbState.orders ? fullDbState.orders.length : 0
      });
    } else {
      const CHUNK_LEN = 500000;
      const chunks = [];
      for (let i = 0; i < jsonPayload.length; i += CHUNK_LEN) {
        chunks.push(jsonPayload.slice(i, i + CHUNK_LEN));
      }
      await Promise.all(chunks.map((chunk, idx) => {
        const partRef = doc(db, CLOUD_SYNC_COLLECTION, `${CLOUD_SYNC_DOC}_part_${idx}`);
        return setDoc(partRef, {
          chunkIndex: idx,
          chunkData: chunk,
          updatedAt: new Date().toISOString()
        });
      }));
      await setDoc(docRef, {
        isChunked: true,
        chunkCount: chunks.length,
        updatedAt: new Date().toISOString(),
        productCount: fullDbState.products ? fullDbState.products.length : 0,
        orderCount: fullDbState.orders ? fullDbState.orders.length : 0
      });
    }
    console.log('[Firebase] Cloud Firestore database snapshot saved directly.');
  } catch (err) {
    console.error('[Firebase] Cloud Firestore save error:', err);
  }
}

let syncTimeout = null;
let currentSavePromise = null;
let pendingDbState = null;

export function flushPendingSave() {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
  if (pendingDbState) {
    const stateToSave = pendingDbState;
    pendingDbState = null;
    currentSavePromise = saveToCloudFirestore(stateToSave).then(() => {
      currentSavePromise = null;
    }).catch(err => {
      console.error('[Firebase] Error in flushPendingSave:', err);
      currentSavePromise = null;
    });
    return currentSavePromise;
  }
  return currentSavePromise || Promise.resolve();
}

export function scheduleCloudFirestoreSave(fullDbState) {
  const db = initFirebase();
  if (!db) return;
  pendingDbState = fullDbState;
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    flushPendingSave();
  }, 100);
}

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

export function initFirebase() {
  if (firebaseInitialized) return firestoreDb;
  try {
    const configPath = path.join(ROOT_DIR, 'firebase-applet-config.json');
    if (!fs.existsSync(configPath)) {
      return null;
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (!config.projectId) return null;

    const firebaseConfig = {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    };

    const app = initializeApp(firebaseConfig);
    const dbId = config.firestoreDatabaseId || '(default)';
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
export async function saveImageToCloud(fileName, base64Data) {
  const db = initFirebase();
  if (!db || !fileName || !base64Data) return;
  try {
    const imgDocRef = doc(db, 'uploaded_images', fileName.replace(/[^a-zA-Z0-9_-]/g, '_'));
    await setDoc(imgDocRef, {
      fileName,
      data: base64Data,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Firebase] Error uploading image to cloud:', err);
  }
}

export async function getImageFromCloud(fileName) {
  const db = initFirebase();
  if (!db || !fileName) return null;
  try {
    const imgDocRef = doc(db, 'uploaded_images', fileName.replace(/[^a-zA-Z0-9_-]/g, '_'));
    const snap = await getDoc(imgDocRef);
    if (snap.exists()) {
      return snap.data().data || null;
    }
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
      if (data && data.payload) {
        const parsed = JSON.parse(data.payload);
        console.log(`[Firebase] Loaded cloud database state with ${parsed.products?.length || 0} products & ${parsed.orders?.length || 0} orders.`);
        return parsed;
      }
    }
  } catch (err) {
    console.error('[Firebase] Error loading state from cloud:', err);
  }
  return null;
}

let syncTimeout = null;
export function scheduleCloudFirestoreSave(fullDbState) {
  const db = initFirebase();
  if (!db) return;
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    try {
      const docRef = doc(db, CLOUD_SYNC_COLLECTION, CLOUD_SYNC_DOC);
      const jsonPayload = JSON.stringify(fullDbState);
      await setDoc(docRef, {
        payload: jsonPayload,
        updatedAt: new Date().toISOString(),
        productCount: fullDbState.products ? fullDbState.products.length : 0,
        orderCount: fullDbState.orders ? fullDbState.orders.length : 0
      });
      console.log('[Firebase] Cloud Firestore database snapshot saved successfully.');
    } catch (err) {
      console.error('[Firebase] Cloud Firestore save error:', err);
    }
  }, 120);
}

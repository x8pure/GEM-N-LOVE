import { initializeApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, setLogLevel } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const PUB = path.join(ROOT_DIR, 'public');

let firestoreDb = null;
let firebaseInitialized = false;
let lastSavedCloudHash = '';

function computeStateHash(state) {
  if (!state || typeof state !== 'object') return '';
  const core = {
    products: state.products || [],
    categories: state.categories || [],
    orders: state.orders || [],
    posSales: state.posSales || [],
    coupons: state.coupons || [],
    reviews: state.reviews || [],
    users: (state.users || []).map(u => ({ id: u.id, email: u.email, role: u.role })),
    settings: state.settings || {},
    newsletterLen: (state.newsletter || []).length,
    contactLen: (state.contact || []).length
  };
  return crypto.createHash('sha256').update(JSON.stringify(core)).digest('hex');
}

// Silence benign internal gRPC / RPC stream disconnect notices in Node.js
try {
  setLogLevel('silent');
} catch {}

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
    try {
      firestoreDb = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        ignoreUndefinedProperties: true
      }, dbId);
    } catch {
      firestoreDb = getFirestore(app, dbId);
    }
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
          lastSavedCloudHash = computeStateHash(parsed);
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
            lastSavedCloudHash = computeStateHash(parsed);
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
  if (!Array.isArray(fullDbState.products) || fullDbState.products.length === 0) {
    console.warn('[Firebase] Aborted saving to cloud: products array is empty or invalid.');
    return;
  }
  const stateHash = computeStateHash(fullDbState);
  if (stateHash && stateHash === lastSavedCloudHash) {
    console.log('[Firebase] Cloud Firestore save skipped: Database state has not changed.');
    return;
  }
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
    lastSavedCloudHash = stateHash;
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
  }, 1000);
}

/* ================= DEDICATED ATOMIC FIRESTORE ENTITIES ================= */

/**
 * Saves 3D wheel product IDs to dedicated Firestore document: app_settings/wheel
 */
export async function saveWheelSettingsToCloud(ids) {
  const db = initFirebase();
  if (!db) return;
  try {
    const cleanIds = Array.isArray(ids) ? ids.filter(Boolean).map(String) : [];
    await setDoc(doc(db, 'app_settings', 'wheel'), {
      ids: cleanIds,
      updatedAt: new Date().toISOString()
    });
    console.log(`[Firebase] Dedicated wheel settings saved (${cleanIds.length} items):`, cleanIds);
  } catch (err) {
    console.error('[Firebase] Error saving wheel settings to cloud:', err);
  }
}

/**
 * Loads 3D wheel product IDs from dedicated Firestore document: app_settings/wheel
 */
export async function loadWheelSettingsFromCloud() {
  const db = initFirebase();
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'app_settings', 'wheel'));
    if (snap.exists()) {
      const data = snap.data();
      if (data && Array.isArray(data.ids)) {
        return data.ids;
      }
    }
  } catch (err) {
    console.error('[Firebase] Error loading wheel settings from cloud:', err);
  }
  return null;
}

/**
 * Saves store settings directly to dedicated Firestore document: app_settings/general
 */
export async function saveSettingsToCloud(settings) {
  const db = initFirebase();
  if (!db || !settings || typeof settings !== 'object') return;
  try {
    const clean = { ...settings };
    clean.updatedAt = new Date().toISOString();
    await setDoc(doc(db, 'app_settings', 'general'), clean, { merge: true });
    console.log('[Firebase] Dedicated store settings saved to app_settings/general');
  } catch (err) {
    console.error('[Firebase] Error saving store settings to cloud:', err);
  }
}

/**
 * Loads store settings from dedicated Firestore document: app_settings/general
 */
export async function loadSettingsFromCloud() {
  const db = initFirebase();
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'app_settings', 'general'));
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data === 'object') {
        return data;
      }
    }
  } catch (err) {
    console.error('[Firebase] Error loading store settings from cloud:', err);
  }
  return null;
}

/**
 * Saves next order sequence number to dedicated Firestore document: app_settings/order_seq
 */
export async function saveOrderSeqToCloud(seq) {
  const db = initFirebase();
  if (!db || typeof seq !== 'number') return;
  try {
    await setDoc(doc(db, 'app_settings', 'order_seq'), {
      seq,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firebase] Dedicated order sequence saved: ${seq}`);
  } catch (err) {
    console.error('[Firebase] Error saving order sequence to cloud:', err);
  }
}

/**
 * Loads order sequence number from dedicated Firestore document: app_settings/order_seq
 */
export async function loadOrderSeqFromCloud() {
  const db = initFirebase();
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'app_settings', 'order_seq'));
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data.seq === 'number') {
        return data.seq;
      }
    }
  } catch (err) {
    console.error('[Firebase] Error loading order sequence from cloud:', err);
  }
  return null;
}

/**
 * Saves a single physical POS sale record directly to Firestore collection: pos_sales/{saleId}
 */
export async function savePosSaleToCloud(sale) {
  const db = initFirebase();
  if (!db || !sale || !sale.id) return;
  try {
    await setDoc(doc(db, 'pos_sales', String(sale.id)), sale);
    console.log(`[Firebase] Dedicated POS sale saved to pos_sales/${sale.id}`);
  } catch (err) {
    console.error('[Firebase] Error saving POS sale to cloud:', err);
  }
}

/**
 * Deletes a single physical POS sale record from Firestore collection: pos_sales/{saleId}
 */
export async function deletePosSaleFromCloud(saleId) {
  const db = initFirebase();
  if (!db || !saleId) return;
  try {
    await deleteDoc(doc(db, 'pos_sales', String(saleId)));
    console.log(`[Firebase] Dedicated POS sale deleted from pos_sales/${saleId}`);
  } catch (err) {
    console.error('[Firebase] Error deleting POS sale from cloud:', err);
  }
}

/**
 * Loads all physical POS sales directly from Firestore collection: pos_sales
 */
export async function loadPosSalesFromCloud() {
  const db = initFirebase();
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, 'pos_sales'));
    const list = [];
    snap.forEach((d) => {
      const s = d.data();
      if (s && s.id) list.push(s);
    });
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return list;
  } catch (err) {
    console.error('[Firebase] Error loading POS sales from cloud:', err);
    return [];
  }
}

/* ================= ATOMIC ENTITIES: ORDERS ================= */

/**
 * Saves or updates a single order in Firestore collection: orders/{orderId}
 */
export async function saveOrderToCloud(order) {
  const db = initFirebase();
  if (!db || !order || !order.id) return;
  try {
    await setDoc(doc(db, 'orders', String(order.id)), order);
    console.log(`[Firebase] Atomic Order saved: orders/${order.id}`);
  } catch (err) {
    console.error('[Firebase] Error saving order to cloud:', err);
  }
}

/**
 * Deletes a single order from Firestore collection: orders/{orderId}
 */
export async function deleteOrderFromCloud(orderId) {
  const db = initFirebase();
  if (!db || !orderId) return;
  try {
    await deleteDoc(doc(db, 'orders', String(orderId)));
    console.log(`[Firebase] Atomic Order deleted: orders/${orderId}`);
  } catch (err) {
    console.error('[Firebase] Error deleting order from cloud:', err);
  }
}

/**
 * Loads all orders from Firestore collection: orders
 */
export async function loadOrdersFromCloud() {
  const db = initFirebase();
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, 'orders'));
    const list = [];
    snap.forEach((d) => {
      const o = d.data();
      if (o && o.id) list.push(o);
    });
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return list;
  } catch (err) {
    console.error('[Firebase] Error loading orders from cloud:', err);
    return [];
  }
}

/* ================= ATOMIC ENTITIES: PRODUCTS ================= */

/**
 * Saves or updates a single product in Firestore collection: products/{productId}
 */
export async function saveProductToCloud(product) {
  const db = initFirebase();
  if (!db || !product || !product.id) return;
  try {
    await setDoc(doc(db, 'products', String(product.id)), product);
    console.log(`[Firebase] Atomic Product saved: products/${product.id} (${product.name})`);
  } catch (err) {
    console.error('[Firebase] Error saving product to cloud:', err);
  }
}

/**
 * Deletes a single product from Firestore collection: products/{productId}
 */
export async function deleteProductFromCloud(productId) {
  const db = initFirebase();
  if (!db || !productId) return;
  try {
    await deleteDoc(doc(db, 'products', String(productId)));
    console.log(`[Firebase] Atomic Product deleted: products/${productId}`);
  } catch (err) {
    console.error('[Firebase] Error deleting product from cloud:', err);
  }
}

/**
 * Loads all individual products from Firestore collection: products
 */
export async function loadProductsFromCloud() {
  const db = initFirebase();
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, 'products'));
    const list = [];
    snap.forEach((d) => {
      const p = d.data();
      if (p && p.id) list.push(p);
    });
    return list;
  } catch (err) {
    console.error('[Firebase] Error loading products from cloud:', err);
    return [];
  }
}

/* ================= ATOMIC ENTITIES: CATEGORIES ================= */

/**
 * Saves or updates a single category in Firestore collection: categories/{categoryId}
 */
export async function saveCategoryToCloud(category) {
  const db = initFirebase();
  if (!db || !category || !category.id) return;
  try {
    await setDoc(doc(db, 'categories', String(category.id)), category);
    console.log(`[Firebase] Atomic Category saved: categories/${category.id} (${category.name})`);
  } catch (err) {
    console.error('[Firebase] Error saving category to cloud:', err);
  }
}

/**
 * Deletes a single category from Firestore collection: categories/{categoryId}
 */
export async function deleteCategoryFromCloud(categoryId) {
  const db = initFirebase();
  if (!db || !categoryId) return;
  try {
    await deleteDoc(doc(db, 'categories', String(categoryId)));
    console.log(`[Firebase] Atomic Category deleted: categories/${categoryId}`);
  } catch (err) {
    console.error('[Firebase] Error deleting category from cloud:', err);
  }
}

/**
 * Loads all individual categories from Firestore collection: categories
 */
export async function loadCategoriesFromCloud() {
  const db = initFirebase();
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, 'categories'));
    const list = [];
    snap.forEach((d) => {
      const c = d.data();
      if (c && c.id) list.push(c);
    });
    return list;
  } catch (err) {
    console.error('[Firebase] Error loading categories from cloud:', err);
    return [];
  }
}


import 'dotenv/config';
import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { load, save, saveLocal, uid, nextId, hashPassword, setMemoryDb, saveAsync } from './lib/db.js';
import seed, { getSvgForSlug } from './lib/seed.js';
import {
  loadFromCloudFirestore,
  saveImageToCloud,
  getImageFromCloud,
  initFirebase,
  flushPendingSave,
  saveToCloudFirestore,
  saveSettingsToCloud,
  loadSettingsFromCloud,
  saveOrderSeqToCloud,
  loadOrderSeqFromCloud,
  saveWheelSettingsToCloud,
  loadWheelSettingsFromCloud,
  savePosSaleToCloud,
  deletePosSaleFromCloud,
  loadPosSalesFromCloud,
  saveOrderToCloud,
  deleteOrderFromCloud,
  loadOrdersFromCloud,
  saveProductToCloud,
  deleteProductFromCloud,
  loadProductsFromCloud,
  saveCategoryToCloud,
  deleteCategoryFromCloud,
  loadCategoriesFromCloud,
  uploadToFirebaseStorage
} from './lib/firebase.js';
import { put } from '@vercel/blob';
import { OAuth2Client } from 'google-auth-library';
import { GoogleGenAI, Type } from '@google/genai';
import { GUIDES } from './data/guides.ts';
import { CITIES, CityLanding, ESKISEHIR_STORE } from './data/cities.ts';
import { SHIPPING_REGIONS, PACKAGING_STEPS, SHIPPING_FAQS } from './data/shipping.ts';
import { getPrivacyPolicyHtml, getTermsOfServiceHtml } from './data/legal.ts';
import {
  COMMERCE_CONFIG,
  getProductShippingDetailsSchema,
  getMerchantReturnPolicySchema
} from './config/commerce.ts';

const isProd = process.env.NODE_ENV === 'production';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '56701005174-t1n68p29hirorldv6dis76rmij721c1t.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const ROOT = __dirname;
const PUB = path.join(ROOT, 'public');
const DATA = path.join(ROOT, 'data');
const SESSIONS_FILE = path.join(DATA, 'sessions.json');

let db = load();

export const VERCEL_BLOB_MIGRATION_MAP: Record<string, string> = {
  '/uploads/imgc9d944cf081f.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imgc9d944cf081f-uL8MbP8sR1jI0TEzQ2SIe8qnzM6k9B.webp',
  '/uploads/img9e07bc4135e6.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img9e07bc4135e6-ZApEFSfDKEnw4tcVkrAax5GjoDeI1X.webp',
  '/uploads/img47ff3f704382.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img47ff3f704382-Fag7qlNWju3AOleIdjGwy1pU0qw0hi.webp',
  '/uploads/img7cd0b0c96ffb.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img7cd0b0c96ffb-bySgzjlvTQ4O0QHS6rYIjgHibnRFeX.webp',
  '/uploads/imga4a8234f1ff3.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imga4a8234f1ff3-1cIvy5HtAtF4AbNYCEfMtsqJTyByIq.webp',
  '/uploads/imgd267384deafd.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imgd267384deafd-EK1yln74sdenFffR8Bjh8E9xT4UJzT.webp',
  '/uploads/img580b51ebddd4.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img580b51ebddd4-ngxTvl6pEtRLRrXJF3NmDNp5ENq9Wv.webp',
  '/uploads/img05c9213f3af4.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img05c9213f3af4-uFdXrC8EuukfdBIz6s2Gc4CKTHm7nP.webp',
  '/uploads/img0d2d99cdf9f2.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img0d2d99cdf9f2-wwk2otwKqQGTc4gujkR48IWoLOSorv.webp',
  '/uploads/imge27f6d0f3c12.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imge27f6d0f3c12-1RDdiu3NxUIwb0HJuFzQC8eIfQqjhk.webp',
  '/uploads/imgcffcb0f80585.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imgcffcb0f80585-K4yqkb6Tca0t6rGgccSQsTudpyqdOf.webp',
  '/uploads/img57661690c1b7.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img57661690c1b7-9hqmW5U0YigkohdTjGunjce8ll02G4.webp',
  '/uploads/img24e5e9f1e07b.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img24e5e9f1e07b-QDb9Og4zBIU6c5qR76PmsSZOOCOzcQ.webp',
  '/uploads/img4d97de58afe0.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img4d97de58afe0-4IKZng2n1RNz0Yci1XwcmAEclKqnTh.webp',
  '/uploads/imgbde43a3310b1.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imgbde43a3310b1-ybFKIqoJ1IRVukxzKodkT2ZjQvdJFk.webp',
  '/uploads/img3e89ecf65246.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img3e89ecf65246-ng3r5zC3q5YJjLI7s96n8Pd7OgKM4g.webp',
  '/uploads/img51c6e719d7cf.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img51c6e719d7cf-gsGPw3Qtq8IazLRM1LvFzFbohKfGiQ.webp',
  '/uploads/img5a716bb89f3d.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img5a716bb89f3d-KTAzNQcUam9oFOk92Eiuk6xXY73D0i.webp',
  '/uploads/imgf66cae282e4f.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imgf66cae282e4f-z46RIEbEEbKCj2Us4lxlp1Ln8nTIaa.webp',
  '/uploads/img9094ecffb649.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img9094ecffb649-DdMBcdWNOqrs4T3l9hIHQWy4ksZjd6.webp',
  '/uploads/img0f13810957bc.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img0f13810957bc-UxPtsxASkdYhucThuuoAK9OthzNhmE.webp',
  '/uploads/imga88427766ac5.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imga88427766ac5-IlgfKxf9v0sHc5a4eZa9UGtbJfCls7.webp',
  '/uploads/imgd205c8e4789e.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imgd205c8e4789e-DNtHb45UldiAood9B3eXb3IFx5VR83.webp',
  '/uploads/img839c1727c525.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img839c1727c525-uGCnWxV4HaOZAPDxfhvyWPFTD2LQ7d.webp',
  '/uploads/imgdac473d15cd3.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imgdac473d15cd3-GsYOWZsCmqADWKtP0uM39az0OyKHik.webp',
  '/uploads/imgb5b1547874ab.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imgb5b1547874ab-1sVx4fv8bQtqxXgRGfYcjiF9TA1WDz.webp',
  '/uploads/img5b3c2434087e.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img5b3c2434087e-b8vPBfaEpMCLscH8sElAXMKTPtIR7J.webp',
  '/uploads/imgd4f555a7cc9b.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imgd4f555a7cc9b-BszgpmCX0rH8Nd8ymEocRMZYLx2r0F.webp',
  '/uploads/img730cb989f5cb.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img730cb989f5cb-no3PzYSG4HiS4QcgZ8Ye6hT3OYq1Xc.webp',
  '/uploads/img82504226320c.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img82504226320c-T4EN2dhByWzUyRWvfUz3hFbQ6a9v96.webp',
  '/uploads/imga0e4ec0c2889.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/imga0e4ec0c2889-KGBmxrcCur1Xmv5eBpra0auwy6ahQA.webp',
  '/uploads/img29ddf6f3cd5d.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img29ddf6f3cd5d-mDR3E7TvMZGTRcNxvVEnyApAMqYkrn.webp',
  '/uploads/img78ce17680b4a.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img78ce17680b4a-jJjKet2OzRtXmlsdf7CI7rkIM0uXfm.webp',
  '/uploads/img9df218458020.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img9df218458020-cHC9d0A6yx4kbCjfMm5DMViVv5cfm6.webp',
  '/uploads/img359aae873747.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img359aae873747-597fLn4V7imeE3UxPaacIckPDJKwAV.webp',
  '/uploads/img09f5ce6898cd.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img09f5ce6898cd-LOhWwXrV0dksF7Jo2LZhOjKiK7L32e.webp',
  '/uploads/img77c9e20d7328.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img77c9e20d7328-FAG7MrrHgAZRkIqwwkS8uyfpfXwW10.webp',
  '/uploads/imgda56448ed613.webp': 'https://2nmwpzma3o8ywodf.public.blob.vercel-storage.com/uploads/img82504226320c-T4EN2dhByWzUyRWvfUz3hFbQ6a9v96.webp'
};

function ensureBlobUrls(targetDb: any): boolean {
  if (!targetDb) return false;
  let changed = false;
  if (Array.isArray(targetDb.products)) {
    for (const p of targetDb.products) {
      if (p.image && VERCEL_BLOB_MIGRATION_MAP[p.image]) {
        p.image = VERCEL_BLOB_MIGRATION_MAP[p.image];
        changed = true;
      }
      if (Array.isArray(p.images)) {
        p.images = p.images.map((img: string) => {
          if (VERCEL_BLOB_MIGRATION_MAP[img]) {
            changed = true;
            return VERCEL_BLOB_MIGRATION_MAP[img];
          }
          return img;
        });
      }
    }
  }
  if (Array.isArray(targetDb.categories)) {
    for (const c of targetDb.categories) {
      if (c.image && VERCEL_BLOB_MIGRATION_MAP[c.image]) {
        c.image = VERCEL_BLOB_MIGRATION_MAP[c.image];
        changed = true;
      }
    }
  }
  return changed;
}

// Ensure in-memory db starts with pure URLs
// (Firebase Storage URLs are authoritative and permanent)

const DEFAULT_ADMIN_EMAILS = [
  'x8pure@gmail.com',
  'cemal.ulas@gmail.com',
  'admin@loveshop.com.tr',
  'admin@loveshop.tr',
  'info@loveshop.com.tr',
  'support@loveshop.com.tr'
];
const ENV_ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
const ADMIN_EMAILS: string[] = Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...ENV_ADMIN_EMAILS]));

function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  let clean = String(email).trim().toLowerCase();
  if (clean === 'cemal.ulas@gmail') clean = 'cemal.ulas@gmail.com';
  return ADMIN_EMAILS.includes(clean);
}

let lastCloudSyncTime = 0;
let isSyncing = false;
let syncPromise: Promise<void> | null = null;
let initialSyncDone = false;

export async function syncWithCloud(force = false): Promise<void> {
  if (isSyncing && syncPromise) {
    if (force) {
      await syncPromise;
    } else {
      return syncPromise;
    }
  }
  isSyncing = true;
  syncPromise = (async () => {
    try {
      initFirebase();
      const localDb = load();
      const cloudState = await loadFromCloudFirestore();
      
      if (cloudState && Array.isArray(cloudState.products) && cloudState.products.length > 0) {
        // Keep any existing items in memory before replacing with cloud state
        const inMemProds = Array.isArray(db?.products) ? db.products : [];
        const inMemCats = Array.isArray(db?.categories) ? db.categories : [];
        const inMemOrders = Array.isArray(db?.orders) ? db.orders : [];

        setMemoryDb(cloudState, true);
        db = load();

        // Preserve and merge in-memory products/categories/orders so nothing in flight gets wiped
        if (inMemProds.length > 0) {
          const prodMap = new Map();
          (db.products || []).forEach((p: any) => p && p.id && prodMap.set(p.id, p));
          inMemProds.forEach((p: any) => {
            if (!p || !p.id) return;
            if (!prodMap.has(p.id)) {
              prodMap.set(p.id, p);
            } else {
              const existing = prodMap.get(p.id);
              if (existing.image && existing.image.startsWith('http') && p.image && !p.image.startsWith('http')) {
                // keep existing cloud blob URL
              } else if (p.image && p.image.startsWith('http')) {
                existing.image = p.image;
              }
            }
          });
          db.products = Array.from(prodMap.values());
        }
        if (inMemCats.length > 0) {
          const catMap = new Map();
          (db.categories || []).forEach((c: any) => c && c.id && catMap.set(c.id, c));
          inMemCats.forEach((c: any) => {
            if (!c || !c.id) return;
            if (!catMap.has(c.id)) {
              catMap.set(c.id, c);
            } else {
              const existing = catMap.get(c.id);
              if (existing.image && existing.image.startsWith('http') && c.image && !c.image.startsWith('http')) {
                // keep existing cloud blob URL
              } else if (c.image && c.image.startsWith('http')) {
                existing.image = c.image;
              }
            }
          });
          db.categories = Array.from(catMap.values());
        }
        let changed = false;
        if (ensureBlobUrls(db)) {
          changed = true;
        }
        if (inMemOrders.length > 0) {
          const orderMap = new Map();
          (db.orders || []).forEach((o: any) => o && o.id && orderMap.set(o.id, o));
          inMemOrders.forEach((o: any) => o && o.id && orderMap.set(o.id, o));
          db.orders = Array.from(orderMap.values()).sort((a: any, b: any) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
        }
        if (Array.isArray(db.categories)) {
          db.categories.forEach((c: any) => {
            if (c.slug === 'erkekler' || c.name === 'Erkek Sağlık') { c.name = 'Erkek Cinsel Sağlık'; changed = true; }
            if (c.slug === 'erkek-ve-kadinlar' || c.name === 'Anal Ürünler') { c.slug = 'anal-urunler'; c.name = 'Anal Ürünler'; changed = true; }
          });
        }
        if (Array.isArray(db.products)) {
          db.products.forEach((p: any) => {
            if (p.category === 'erkekler' || p.categoryName === 'Erkek Sağlık') { p.categoryName = 'Erkek Cinsel Sağlık'; changed = true; }
            if (p.category === 'erkek-ve-kadinlar' || p.categoryName === 'Anal Ürünler') { p.category = 'anal-urunler'; p.categoryName = 'Anal Ürünler'; changed = true; }
          });
        }
        if (changed) { saveLocal(); }

        // Sync dedicated Firestore general store settings (READ ONLY - never write during sync)
        try {
          const cloudSettings = await loadSettingsFromCloud();
          if (cloudSettings && typeof cloudSettings === 'object' && Object.keys(cloudSettings).length > 0) {
            if (!db.settings) db.settings = {};
            const curWheel = db.settings.wheelIds;
            Object.assign(db.settings, cloudSettings);
            if (curWheel && (!cloudSettings.wheelIds || !cloudSettings.wheelIds.length)) {
              db.settings.wheelIds = curWheel;
            }
          }
        } catch (e) {
          console.error('[Server] Dedicated store settings sync error:', e);
        }

        // Sync dedicated Firestore wheel settings (READ ONLY - never write during sync)
        try {
          const cloudWheel = await loadWheelSettingsFromCloud();
          if (Array.isArray(cloudWheel) && cloudWheel.length > 0) {
            if (!db.settings) db.settings = {};
            db.settings.wheelIds = cloudWheel;
          }
        } catch (e) {
          console.error('[Server] Dedicated wheel settings sync error:', e);
        }

        // Sync dedicated Firestore POS sales (READ ONLY - never write during sync)
        try {
          const cloudPosSales = await loadPosSalesFromCloud();
          if (Array.isArray(cloudPosSales) && cloudPosSales.length > 0) {
            const posMap = new Map();
            cloudPosSales.forEach((s: any) => s && s.id && posMap.set(s.id, s));
            (db.posSales || []).forEach((s: any) => {
              if (s && s.id && !posMap.has(s.id)) {
                posMap.set(s.id, s);
              }
            });
            db.posSales = Array.from(posMap.values()).sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          }
        } catch (e) {
          console.error('[Server] Dedicated POS sales sync error:', e);
        }

        // Sync atomic Firestore Orders (Never overwrite newer orders across instances)
        try {
          const cloudOrders = await loadOrdersFromCloud();
          if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
            const orderMap = new Map();
            // Start with local/cloudState orders
            (db.orders || []).forEach((o: any) => o && o.id && orderMap.set(o.id, o));
            // Overlay dedicated orders (always authoritative)
            cloudOrders.forEach((o: any) => o && o.id && orderMap.set(o.id, o));
            db.orders = Array.from(orderMap.values()).sort((a: any, b: any) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
          }
        } catch (e) {
          console.error('[Server] Dedicated orders sync error:', e);
        }

        // Sync dedicated Firestore order sequence & sync with existing order IDs
        try {
          const cloudSeq = await loadOrderSeqFromCloud();
          let maxExistingOrderNum = 1000;
          (db.orders || []).forEach((o: any) => {
            if (o && o.id) {
              const m = String(o.id).match(/LS-(\d+)/i);
              if (m) {
                const n = parseInt(m[1], 10);
                if (!isNaN(n) && n > maxExistingOrderNum) maxExistingOrderNum = n;
              }
            }
          });
          if (!db.meta) db.meta = { createdAt: new Date().toISOString(), seq: { product: 0, order: 0, pos: 0 } };
          if (!db.meta.seq) db.meta.seq = { product: 0, order: 0, pos: 0 };
          const baseSeq = Math.max(db.meta.seq.order || 0, maxExistingOrderNum - 1000);
          db.meta.seq.order = typeof cloudSeq === 'number' ? Math.max(baseSeq, cloudSeq) : baseSeq;
        } catch (e) {
          console.error('[Server] Dedicated order sequence sync error:', e);
        }

        // Sync atomic Firestore Products
        try {
          const cloudProducts = await loadProductsFromCloud();
          if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
            const prodMap = new Map();
            (db.products || []).forEach((p: any) => p && p.id && prodMap.set(p.id, p));
            cloudProducts.forEach((p: any) => p && p.id && prodMap.set(p.id, p));
            db.products = Array.from(prodMap.values());
          }
        } catch (e) {
          console.error('[Server] Dedicated products sync error:', e);
        }

        // Sync atomic Firestore Categories
        try {
          const cloudCategories = await loadCategoriesFromCloud();
          if (Array.isArray(cloudCategories) && cloudCategories.length > 0) {
            const catMap = new Map();
            (db.categories || []).forEach((c: any) => c && c.id && catMap.set(c.id, c));
            cloudCategories.forEach((c: any) => c && c.id && catMap.set(c.id, c));
            db.categories = Array.from(catMap.values());
          }
        } catch (e) {
          console.error('[Server] Dedicated categories sync error:', e);
        }

        saveLocal();
        lastCloudSyncTime = Date.now();
        initialSyncDone = true;
        console.log(`[Server] Synced with Cloud Firestore: ${db.products.length} products, ${db.categories?.length || 0} categories, ${db.orders?.length || 0} orders, ${db.posSales?.length || 0} POS sales.`);
      } else if (localDb && Array.isArray(localDb.products) && localDb.products.length > 0) {
        // Sync dedicated Firestore wheel, pos sales, orders, products, and categories even when localDb is primary
        try {
          const cloudWheel = await loadWheelSettingsFromCloud();
          if (Array.isArray(cloudWheel) && cloudWheel.length > 0) {
            if (!db.settings) db.settings = {};
            db.settings.wheelIds = cloudWheel;
          }
          const cloudPos = await loadPosSalesFromCloud();
          if (Array.isArray(cloudPos) && cloudPos.length > 0) {
            db.posSales = cloudPos;
          }
          const cloudOrders = await loadOrdersFromCloud();
          if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
            const orderMap = new Map();
            (db.orders || []).forEach((o: any) => o && o.id && orderMap.set(o.id, o));
            cloudOrders.forEach((o: any) => o && o.id && orderMap.set(o.id, o));
            db.orders = Array.from(orderMap.values()).sort((a: any, b: any) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
          }
          const cloudProducts = await loadProductsFromCloud();
          if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
            const prodMap = new Map();
            (db.products || []).forEach((p: any) => p && p.id && prodMap.set(p.id, p));
            cloudProducts.forEach((p: any) => p && p.id && prodMap.set(p.id, p));
            db.products = Array.from(prodMap.values());
          }
          const cloudCategories = await loadCategoriesFromCloud();
          if (Array.isArray(cloudCategories) && cloudCategories.length > 0) {
            const catMap = new Map();
            (db.categories || []).forEach((c: any) => c && c.id && catMap.set(c.id, c));
            cloudCategories.forEach((c: any) => c && c.id && catMap.set(c.id, c));
            db.categories = Array.from(catMap.values());
          }
        } catch {}
        saveLocal();
        lastCloudSyncTime = Date.now();
        initialSyncDone = true;
      }
    } catch (err) {
      console.error('[Server] Cloud sync error:', err);
    } finally {
      isSyncing = false;
    }
  })();
  return syncPromise;
}

export async function ensureCloudDatabaseReady(force = false) {
  const now = Date.now();
  if (initialSyncDone && !force && (now - lastCloudSyncTime < 30000)) {
    return;
  }
  if (!initialSyncDone || force) {
    try {
      await Promise.race([
        syncWithCloud(true),
        new Promise((resolve) => setTimeout(resolve, 2500))
      ]);
      initialSyncDone = true;
    } catch (e) {
      console.error('[Server] ensureCloudDatabaseReady error:', e);
    }
  } else if (now - lastCloudSyncTime >= 30000) {
    // Non-blocking periodic background sync
    syncWithCloud(false).catch(() => {});
  }
}

// Initial startup cloud synchronization (non-blocking for Vercel cold-starts)
syncWithCloud(true).then(() => {
  if (Array.isArray(db.users)) {
    let userFixed = false;
    for (const u of db.users) {
      const shouldBeAdmin = isAdminEmail(u.email);
      if (shouldBeAdmin && u.role !== 'admin') {
        u.role = 'admin';
        userFixed = true;
      }
    }
    if (userFixed) { saveLocal(); }
  }

  if (db.settings) {
    const targetAddr = 'İsmet İnönü-1 Cd. No:52/2 (İsmet İnönü Tramvay Durağı Karşısı, Watsons & Yves Rocher Yanı), Ilgaz İş Hanı Kat:1 Daire:2, 26170 Tepebaşı/Eskişehir';
    if (!db.settings.address || !db.settings.address.includes('Tramvay') || db.settings.address.includes('No:19')) {
      db.settings.address = targetAddr;
      db.settings.mapsQuery = encodeURIComponent('Love Sex Shop Eskişehir Erotik Shop');
      saveLocal();
    }
  }
}).catch((err) => {
  console.error('[Server] Startup cloud sync failed:', err);
});

let sessions: Record<string, any> = {};
try { sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8')); } catch { sessions = {}; }
function persistSessions() {
  try {
    fs.mkdirSync(DATA, { recursive: true });
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (e) {}
}

const hash = hashPassword;
const now = () => Date.now();

/* ---------------- token & auth engine ---------------- */
const DEFAULT_AUTH_SECRET = 'a9f4e2b8c7103d56e8912f4b03c817d295e0a61483f912c5b704e62a1d8f90c3';
const AUTH_SECRET = process.env.AUTH_SECRET || DEFAULT_AUTH_SECRET;
if (!process.env.AUTH_SECRET) {
  console.warn('[AUTH] Warning: AUTH_SECRET environment variable is missing. Using fallback secret to prevent server crash.');
}
function createAuthToken(userId: string, role: string, tokenVersion = 1): string {
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const payload = `${userId}:${role}:${tokenVersion}:${exp}`;
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

function verifyAuthToken(tokenStr: string): { userId: string; role: string; tokenVersion: number } | null {
  try {
    if (!tokenStr || typeof tokenStr !== 'string') return null;
    const raw = Buffer.from(tokenStr, 'base64url').toString('utf8');
    const parts = raw.split(':');
    let userId = '', role = '', versionStr = '1', expStr = '', sig = '';
    if (parts.length === 5) {
      [userId, role, versionStr, expStr, sig] = parts;
    } else if (parts.length === 4) {
      [userId, role, expStr, sig] = parts;
      versionStr = '1';
    } else {
      return null;
    }
    const exp = parseInt(expStr, 10);
    const tokenVersion = parseInt(versionStr, 10) || 1;
    if (isNaN(exp) || Date.now() > exp) return null;
    const expectedPayload = parts.length === 5 ? `${userId}:${role}:${versionStr}:${expStr}` : `${userId}:${role}:${expStr}`;
    const expected = crypto.createHmac('sha256', AUTH_SECRET).update(expectedPayload).digest('hex');
    if (sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return { userId, role, tokenVersion };
    }
  } catch (e) {}
  return null;
}

/* ---------------- utils ---------------- */
async function json(res: http.ServerResponse, code: number, obj: any) {
  try { await flushPendingSave(); } catch (e) {}
  const body = JSON.stringify(obj);
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.end(body);
}

function readBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks: Buffer[] = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > 35 * 1024 * 1024) { reject(new Error('BODY_TOO_LARGE')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(new Error('BAD_JSON')); }
    });
    req.on('error', reject);
  });
}

function getSid(req: http.IncomingMessage) {
  const h = req.headers['x-ls-sid'];
  if (h && typeof h === 'string' && h.trim()) return h.trim();
  const c = req.headers.cookie || '';
  const m = c.match(/ls_sid=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
function setSidCookie(res: http.ServerResponse, sid: string) {
  res.setHeader('Set-Cookie', `ls_sid=${sid}; Path=/; SameSite=Lax; HttpOnly${isProd ? '; Secure' : ''}; Max-Age=${60 * 60 * 24 * 30}`);
  res.setHeader('x-ls-sid', sid);
}
function clearSidCookie(res: http.ServerResponse) {
  res.setHeader('Set-Cookie', [
    `ls_sid=; Path=/; SameSite=Lax; HttpOnly${isProd ? '; Secure' : ''}; Max-Age=0`,
    `ls_token=; Path=/; SameSite=Lax; HttpOnly${isProd ? '; Secure' : ''}; Max-Age=0`,
    `ls_auth_token=; Path=/; SameSite=Lax; HttpOnly${isProd ? '; Secure' : ''}; Max-Age=0`
  ]);
  res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}
function getSession(req: http.IncomingMessage, res?: http.ServerResponse) {
  let sid = getSid(req);
  if (!sid) {
    sid = 'sid_' + crypto.randomBytes(16).toString('hex');
  }
  if (!sessions[sid]) {
    sessions[sid] = { createdAt: now(), userId: null, cart: [], coupon: null, lastGuestEmail: null };
    persistSessions();
  }
  if (res) setSidCookie(res, sid);
  return sessions[sid];
}

function getAuthUser(req: http.IncomingMessage, sess?: any) {
  let user: any = null;
  const authHeader = req.headers['authorization'] || '';
  const tokenHeader = req.headers['x-ls-token'] || req.headers['x-auth-token'] || '';
  const cookieToken = getCookieValue(req, 'ls_token') || getCookieValue(req, 'ls_auth_token');
  const bearer = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const tokenStr = bearer || (typeof tokenHeader === 'string' ? tokenHeader.trim() : '') || cookieToken || '';
  if (tokenStr) {
    const payload = verifyAuthToken(tokenStr);
    if (payload && payload.userId) {
      const found = db.users.find((x: any) => x.id === payload.userId) || null;
      if (found) {
        const userVersion = found.tokenVersion || 1;
        if ((payload.tokenVersion || 1) === userVersion) {
          user = found;
          if (sess) { sess.userId = user.id; }
        }
      }
    }
  }
  if (!user && sess && sess.userId) {
    user = db.users.find((x: any) => x.id === sess.userId) || null;
  }
  if (user) {
    if (isAdminEmail(user.email) && user.role !== 'admin') {
      user.role = 'admin';
      saveLocal();
    }
  }
  return user;
}

function getUser(sess: any, req?: http.IncomingMessage) {
  if (req) return getAuthUser(req, sess);
  if (!sess || !sess.userId) return null;
  return db.users.find((u: any) => u.id === sess.userId) || null;
}
function requireAdmin(req: http.IncomingMessage, res: http.ServerResponse) {
  const sess = getSession(req, res);
  const u = getAuthUser(req, sess);
  if (!u || !isAdminEmail(u.email)) return null;
  u.role = 'admin';
  return u;
}
function sendError(res: http.ServerResponse, code: number, msg: string) { return json(res, code, { ok: false, error: msg }); }
const esc = (s: any) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
const fmt = (n: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);
const stars = (r: number) => '★'.repeat(Math.round(r || 0)) + '☆'.repeat(5 - Math.round(r || 0));

const catAuthLimiter = new Map<string, { count: number; reset: number }>();
function rateLimited(req: http.IncomingMessage, key: string, max: number, windowMs: number) {
  const ip = req.socket.remoteAddress || 'x';
  const k = ip + ':' + key;
  const t = now();
  const item = catAuthLimiter.get(k) || { count: 0, reset: t + windowMs };
  if (t > item.reset) { item.count = 0; item.reset = t + windowMs; }
  item.count++;
  catAuthLimiter.set(k, item);
  return item.count > max;
}

/* ---------------- i18n ---------------- */
function getCookieValue(req: http.IncomingMessage, name: string) {
  const c = req.headers.cookie || '';
  const m = c.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

const STR: Record<string, Record<string, string>> = {
  tr: {
    'age.title': '18 Yaşından Büyük müsünüz?',
    'age.legal': 'Türk Ceza Kanunu\'nun 226. maddesi uyarınca 18 yaşından küçüklerin bu siteyi gezmeleri ve alışveriş yapmaları yasaktır. Web sitemiz T.C.K\'nın 226. maddesi D bendinde yer alan müstehcen ürünlerin satışına mahsus alışveriş yeri kapsamındadır.',
    'age.yes': '18+ Olduğumu Onaylıyorum',
    'age.no': 'Çıkış Yap',
    'age.small': 'Gizliliğin bizim için önemli — yaş bilgisi yalnızca bu tarayıcıda saklanır.',
    'nav.home': 'Anasayfa', 'nav.shop': 'Mağaza', 'nav.about': 'Hakkımızda', 'nav.contact': 'İletişim', 'nav.account': 'Hesabım',
    'nav.delivery': 'Eskişehir 2h Kurye',
    'nav.admin': 'Admin Panel', 'nav.cart': 'Sepet', 'nav.menu': 'Menü', 'nav.login': 'Giriş', 'nav.search': 'Ürün Ara', 'nav.search_short': 'Ara',
    'qs.ph': 'Ürün, kategori veya özellik ara...', 'qs.popular': 'Popüler Aramalar', 'qs.empty': 'Aramanızla eşleşen ürün bulunamadı.', 'qs.close': 'Kapat',
    'foot.desc': ' Erotik & Seks Shop — Eskişehir ve tüm Türkiye geneline %100 gizli paketleme, güvenli ödeme ve orijinal ürün güvencesiyle hizmet veren seçkin yetişkin mağazası.',
    'foot.h.shop': 'Mağaza', 'foot.all': 'Tüm Ürünler',
    'foot.about': 'Hakkımızda', 'foot.discreet': 'Gizli Paketleme', 'foot.returns': 'İade Politikası',
    'foot.contact': 'İletişim',
    'foot.rights': ' — 18+ içerik. Tüm hakları saklıdır.',
    'foot.pay.wa': 'WhatsApp Sipariş', 'foot.pay.shop': 'Mağazada Ödeme', 'foot.pay.discreet': 'Gizli Paketleme',
    'hero.eyebrow': '✦ 18+ · Gizli Paketleme · Anonim Ödeme',
    'hero.h1': 'Tutkunuz için<br><em class="em-rose">zarif &amp; gizli</em> bir dünya.',
    'hero.p': 'Kişisel zevklerinize adanmış, <strong>yargısız</strong> ve özgür bir alan. Vücut dostu materyallerle üretilmiş premium tasarımlar; <strong>mutlak gizlilik</strong> prensibi, özenli paketleme ve anonim teslimat güvencesiyle kapınıza geliyor.',
    'hero.cta.shop': 'Mağazayı Keşfet →', 'hero.cta.why': 'Neden Biz?',
    'hero.stat1': 'Özenle seçili ürün', 'hero.stat2': '%100', 'hero.stat2.label': 'Gizli paketleme', 'hero.stat3': '4.8', 'hero.stat3.label': 'Ortalama puan',
    'hero.stat4': '~2 Saat', 'hero.stat4.label': 'Eskişehir İçi Kurye',
    'mq.1': 'GİZLİ PAKETLEME', 'mq.2': 'KAPIDA ÖDEME', 'mq.3': 'VÜCUT DOSTU', 'mq.4': 'AYNI GÜN KARGO', 'mq.5': '18+ YETKİN YAŞAM', 'mq.6': 'ANONİM ALIŞVERİŞ',
    'sec.cats.eb': 'Kategoriler', 'sec.cats.h2': 'Kendi <em class="em-rose">ritmini</em> bul',
    'sec.cats.p': 'Merak ettiğin her şey, saygılı bir dille ve özenle seçilmiş {n}-i aşkın ürünle.',
    'sec.cats.link': 'Katalog →', 'cats.products': 'ÜRÜN', 'bento.explore': 'Keşfet →',
    'bcta.kicker': 'Kataloğun tamamı', 'bcta.h3': 'Tüm Kategoriler', 'bcta.count': '{cats} KATEGORİ · {prods} ÜRÜN',
    'sec.feat.eb': 'Öne Çıkanlar', 'sec.feat.h2': 'Bu ayın <em class="em-rose">favorileri</em>', 'sec.feat.link': 'Hepsini Gör →',
    'banner.eb': 'Love Shop Güvencesi',
    'banner.h2': 'Her kargo, açılmamış bir <em class="em-rose">sır</em> gibi gelir. İçeriği yalnızca sen bilirsin.',
    'banner.p': 'Dış pakette logo yok, ürün adı yok, mağaza ibaresi yok. Kart ekstrenizde nötr kurumsal unvan yer alır. Kargo görevlisi bile içeriği bilmez.',
    'banner.btn': 'Gizlilik Standartlarımız',
    'sec.new.eb': 'Yeni Gelenler', 'sec.new.h2': 'Taze <em class="em-rose">taze</em>', 'sec.new.link': 'Yenilikler →',
    'f1.t': '%100 Gizli Paketleme', 'f1.p': 'Düz kutu, logosuz, içerik bilgisi dışarıdan asla anlaşılmaz.',
    'f2.t': 'Eskişehir 2 Saatte Teslimat', 'f2.p': 'Eskişehir içi özel kurye ile ~2 saatte kapınızda; Türkiye geneli aynı gün kargo.',
    'f3.t': 'Anonim Güvenli Ödeme', 'f3.p': '256-bit SSL koruması; ekstrede nötr kurumsal unvan yer alır.',
    'f4.t': 'Vücut Dostu & Orijinal', 'f4.p': 'CE belgeli, medikal standartlara uygun %100 orijinal ve faturalı ürünler.',
    'sec.rev.eb': 'Misafirlerimiz', 'sec.rev.h2': 'Kapı kapalı, <em class="em-rose">memnuniyet</em> açık', 'sec.rev.empty': 'İlk yorum sizden gelsin.',
    'nl.eb': 'Kulüp Love', 'nl.h2': 'İlk siparişe %10 <em class="em-rose">indirim</em>',
    'nl.p': 'Bültene katıl; yeniliklerden, gizli indirimlerden ilk sen haberdar ol. Spam yok, söz.',
    'nl.ph': 'e-posta adresin', 'nl.btn': 'Katıl',
    'badge.new': 'Yeni', 'badge.hot': 'Çok Satan', 'badge.sale': 'İndirim', 'quickadd': 'Sepete Ekle', 'quickview': 'Hızlı Bakış',
    'curator.trigger': 'Sana Özel Deneyim Bulucu',
    'curator.title': 'Kişisel Deneyim & Hediye Küratörü',
    'curator.sub': 'Sadece 2 soruda arzularına ve ritmine en uygun özel seçkiyi keşfet.',
    'curator.bundle': 'Paket Olarak Sepete Ekle (%15 İndirimli)',
    'shop.crumb.home': 'Anasayfa', 'shop.title': 'Mağaza',
    'shop.desc': '{n} özenle seçilmiş ürün — hepsi vücut dostu, hepsi sessiz kargoda.',
    'shop.count': '{n} ürün',
    'shop.search': 'Ürün ara…', 'shop.cat': 'Kategori', 'shop.all': 'Tümü',
    'shop.sort.def': 'Sırala: Önerilen', 'shop.sort.new': 'En Yeniler', 'shop.sort.asc': 'Fiyat: Düşükten Yükseğe',
    'shop.sort.desc': 'Fiyat: Yüksekten Düşüğe', 'shop.sort.rate': 'En Yüksek Puan',
    'rv.title': 'Yorum Yaz', 'rv.rating': 'Puanın', 'rv.comment': 'Yorumun (en az 10 karakter)', 'rv.ph': 'Deneyimini paylaş…',
    'rv.submit': 'Gönder', 'rv.note': 'Yorumlar onay sonrası yayınlanır ·', 'rv.back': 'Ürüne dön',
    'cart.title': 'Sepetim', 'cart.crumb': 'Sepet',
    'checkout.title': 'Ödeme', 'checkout.crumb': 'Ödeme',
    'login.title': 'Tekrar hoş geldin', 'login.sub': 'Hesabına giriş yap, siparişlerini takip et.',
    'login.email': 'E-posta', 'login.pass': 'Şifre', 'login.btn': 'Giriş Yap', 'login.alt': 'Hesabın yok mu?', 'login.altLink': 'Kayıt ol',
    'auth.or': 'veya e-posta ile',
    'auth.google.login': 'Google ile Giriş Yap',
    'auth.google.reg': 'Google ile Kayıt Ol',
    'auth.google.sec': 'Google ile Hızlı & Güvenli Giriş',
    'reg.title': 'Aramıza katıl', 'reg.sub': 'Üye ol, sipariş takibi ve özel indirimlerden faydalan.',
    'reg.name': 'Ad Soyad', 'reg.email': 'E-posta', 'reg.pass': 'Şifre', 'reg.pass2': 'Şifre (Tekrar)',
    'reg.age': '18 yaşından büyük olduğumu onaylıyorum. Gizlilik politikasını okudum.',
    'reg.btn': 'Hesap Oluştur', 'reg.alt': 'Zaten üye misin?', 'reg.altLink': 'Giriş yap',
    'account.title': 'Hesabım', 'profile.title': 'Profilim',
    'about.eb': 'Hikayemiz',
    'about.h1': 'Utancı geride bıraktık. <br class="about-br"><em class="em-rose">Keyfi</em> öne aldık.',
    'about.p1': 'Love Shop, 2012 yılından bu yana 14 yıldır Eskişehir İsmet İnönü Caddesi’ndeki aynı fiziksel mağazasında kesintisiz hizmet veriyor. Yeri ve muhatabı belirsiz internet satıcılarının aksine; her gün kapısı açık, fiziki varlığı ve kurumsal sorumluluğu somut olan gerçek bir işletmeyiz.',
    'about.p2': 'Bugüne dek 5.000\'i aşkın müşterimize paketleme standartlarımızdan tek bir ödün vermeden, %100 gizlilik ve mahremiyet esasıyla ulaştık. Bizim için bedenini tanımak, keyfini keşfetmek ve cinsel sağlığına özen göstermek bir tabu veya lüks değil; en doğal insani hak.',
    'about.p3': '14 yıllık perakende tecrübemizi, CE sertifikalı vücut dostu ürün seçkimizi ve koşulsuz gizlilik ilkemizi; modern, saygın ve gururla gezilebilir bir alışveriş deneyimiyle buluşturuyoruz.',
    'about.priv.h': 'Tam Gizlilik Taahhüdü',
    'about.priv.p': 'Alışverişinizin ilk adımından teslimat anına kadar tüm süreç mahremiyet standartlarımızla korunur:',
    'about.priv.list': '• <b>İsimsiz & Nötr Paketleme:</b> Düz korumalı kutu. Üzerinde logo, ürün adı veya mağaza ibaresi yer almaz.<br>• <b>Gizli Kargo İrsaliyesi:</b> Kargo etiketinde ürün içeriği belirtilmez; gönderici bilgisi yasal zorunluluklar gereği nötr ticari unvanla düzenlenir.<br>• <b>Finansal Gizlilik:</b> Kredi kartı ekstrenizde mağaza adı veya yetişkin ürün detayı görünmez; ödeme altyapısının güvenli kurumsal tahsilat kaydı yer alır.<br>• <b>Veri Güvenliği:</b> Bilgileriniz 256-bit SSL şifreleme ile korunur. Yalnızca siparişinizin teslimi için kullanılır; asla reklam ağları veya üçüncü taraflarla paylaşılmaz.',
    'about.ret.h': 'İade & Değişim Güvencesi',
    'about.ret.p': 'T.C. Tüketici Mevzuatı ve kişisel hijyen regülasyonları uyarınca, ambalajı/güvenlik bandı açılmış ve kullanılmış ürünlerde hijyen sebebiyle cayma hakkı bulunmamaktadır. Ancak:',
    'about.ret.list': '• <b>Kutudan Arızalı / Hasarlı Çıkma Güvencesi:</b> Siparişiniz kargodan hasarlı veya çalışmaz durumda çıkarsa, teslimat anında koşulsuz birebir sıfırıyla değiştirilir.<br>• <b>Yanlış Ürün Telafisi:</b> Eksik veya hatalı gönderilen tüm ürünler derhal ücretsiz olarak yenisiyle tamamlanır.<br>• <b>Orijinal ve Güvenlik Bantlı Ürünler:</b> Güvenlik şeridi açılmamış ve ambalajı bozulmamış kozmetik veya aksesuarlarda 14 gün içinde iade imkanı mevcuttur.',
    'about.val.h': 'Değerlerimiz',
    'about.v1.t': 'Saygı', 'about.v1.p': 'Yargılayan tek bir satır bile yok. Her zevk, her beden, her merak buraya ait.',
    'about.v2.t': 'Güvenlik', 'about.v2.p': 'CE belgesiz, fitalatlı, malzemesi belirsiz hiçbir ürün raflarımıza giremez.',
    'about.v3.t': 'Kapsayıcılık', 'about.v3.p': 'Ürün dilimiz ve görsellerimiz tüm cinsiyetlere ve tüm ilişkilere açık.',
    'about.cta.h': 'Sorun mu var? Yargısız dinliyoruz.', 'about.cta.btn': 'İletişime Geç',
    'contact.eb': 'Bize Yaz', 'contact.h1': 'Merhaba demenin yargısız yolu',
    'contact.p': 'Sorularınız anonim kalabilir; adınızı yazmak zorunda değilsiniz. WhatsApp\'tan 7/24, mağazamızdan birebir destek.',
    'contact.wa.t': 'WhatsApp Sipariş', 'contact.wa.s': 'Gizlilik esaslı, yargısız iletişim',
    'contact.store.t': 'Mağaza Adresimiz', 'contact.phone.t': 'Telefon & Destek', 'contact.phone.s': '09:00–22:00 arası',
    'contact.map.h': 'Kolay Yol Tarifi & Belirgin Noktalar',
    'contact.map.p': 'İsmet İnönü-1 Caddesi üzerinde, <b>İsmet İnönü Tramvay Durağı\'nın tam karşısındayız</b>. Binamızın alt girişinde <b>Yves Rocher</b> mağazası ve <b>Shakespeare Coffee & Bistro</b> arka kapısı (girişte büyük yeşil Shakespeare tabelası) yer alır. Yanımızda <b>Watsons</b> mağazası bulunmaktadır. Ilgaz İş Hanı Kat:1 Daire:2 adresimize rahatça ve tam gizlilikle gelebilirsiniz.',
    'contact.map.btn': 'Google Haritalar\'da Yol Tarifi Al →', 'contact.wa.btn': 'WhatsApp\'tan Konum İste',
    'contact.form.h': 'Form ile yaz', 'contact.form.name': 'İsim (opsiyonel)', 'contact.form.name.ph': 'İsterseniz boş bırakın',
    'contact.form.email': 'E-posta', 'contact.form.email.ph': 'yanıt için',
    'contact.form.msg': 'Mesajın', 'contact.form.msg.ph': 'Merak ettiğin her şey…', 'contact.form.btn': 'Gönder',
    '404.h': '404 — Bu sayfayı biz de arıyoruz', '404.p': 'Ama kaybolmuş bir şeyler bulabilirsin:', '404.home': 'Anasayfa', '404.shop': 'Mağaza',
    'thanks.total': 'Tutar:', 'thanks.continue': 'Alışverişe Devam',
    'thanks.h.pickup': 'Siparişin hazır!', 'thanks.h.ship': 'Neredeyse bitti!',
    'thanks.p.pickup': 'Ürünlerini <b>Ilgaz İş Hanı Kat:1 Daire:2</b> adresindeki mağazamızda ayırdık. Gelmeden önce WhatsApp\'tan yazarsanız stok teyidi yapabiliriz.',
    'thanks.p.ship': 'Ödeme/kargo onayı için siparişini <b>WhatsApp üzerinden</b> bize iletmen gerekiyor. Aşağıdaki buton sipariş özetinizle hazır bir mesaj açar — sadece "Gönder"e basmak yeterli.',
    'thanks.wa.pickup': 'WhatsApp\'tan Stok Teyidi Al', 'thanks.wa.ship': 'Siparişi WhatsApp\'a Gönder',
    'thanks.account': 'Sipariş detayları <a href="/hesap" style="color:var(--rose);font-weight:600">Hesabım</a>\'da saklı.'
  },
  en: {
    'age.title': 'Are You Over 18?',
    'age.legal': 'Per Article 226 of the Turkish Penal Code, persons under 18 are prohibited from browsing this site or making purchases.',
    'age.yes': 'I Confirm I am 18+',
    'age.no': 'Exit',
    'age.small': 'Your privacy matters — age verification is stored only in this browser.',
    'nav.home': 'Home', 'nav.shop': 'Shop', 'nav.about': 'About', 'nav.contact': 'Contact', 'nav.account': 'My Account',
    'nav.delivery': 'Eskişehir 2h Courier',
    'nav.admin': 'Admin Panel', 'nav.cart': 'Cart', 'nav.menu': 'Menu', 'nav.login': 'Sign in', 'nav.search': 'Search Products', 'nav.search_short': 'Search',
    'qs.ph': 'Search products, categories or features...', 'qs.popular': 'Popular Searches', 'qs.empty': 'No products matched your search.', 'qs.close': 'Close',
    'foot.desc': ' — know your body, discover your pleasure. A respect & privacy-first online store with a 2026 design language.',
    'foot.h.shop': 'Shop', 'foot.all': 'All Products',
    'foot.about': 'About Us', 'foot.discreet': 'Discreet Packaging', 'foot.returns': 'Return Policy',
    'foot.contact': 'Contact',
    'foot.rights': ' — 18+ content. All rights reserved.',
    'foot.pay.wa': 'WhatsApp Orders', 'foot.pay.shop': 'Pay in Store', 'foot.pay.discreet': 'Discreet Packaging',
    'hero.eyebrow': '18+ · Discreet Packaging · Anonymous Payment',
    'hero.h1': 'Pleasure is yours.<br><em class="em-rose">Explore. Feel. Live.</em>',
    'hero.p': 'Body-safe, award-winning designs; delivered to your door with total privacy, judgement-free and fast. The finest way to shop, with 2026\'s best web experience.',
    'hero.cta.shop': 'Explore the Shop →', 'hero.cta.why': 'Why Us?',
    'hero.stat1': 'Curated products', 'hero.stat2': '100%', 'hero.stat2.label': 'Discreet packaging', 'hero.stat3': '4.8', 'hero.stat3.label': 'Average rating',
    'hero.stat4': '~2 Hours', 'hero.stat4.label': 'Eskişehir Express Courier',
    'mq.1': 'DISCREET PACKAGING', 'mq.2': 'PAY AT DOOR', 'mq.3': 'BODY SAFE', 'mq.4': 'SAME-DAY SHIPPING', 'mq.5': '18+ ADULT WELLNESS', 'mq.6': 'ANONYMOUS SHOPPING',
    'sec.cats.eb': 'Categories', 'sec.cats.h2': 'Find your own <em class="em-rose">rhythm</em>',
    'sec.cats.p': 'Everything you\'re curious about, spoken in a respectful voice, with over {n} carefully curated products.',
    'sec.cats.link': 'Catalog →', 'cats.products': 'PRODUCTS', 'bento.explore': 'Explore →',
    'bcta.kicker': 'The full catalog', 'bcta.h3': 'All Categories', 'bcta.count': '{cats} CATEGORIES · {prods} PRODUCTS',
    'sec.feat.eb': 'Featured', 'sec.feat.h2': 'This month\'s <em class="em-rose">favorites</em>', 'sec.feat.link': 'See All →',
    'banner.eb': 'The Love Shop Promise',
    'banner.h2': 'Every parcel arrives like an unopened <em class="em-rose">secret</em>. Only you know what\'s inside.',
    'banner.p': 'No logo on the outer box, no product name, no store name. Your card statement shows a neutral corporate descriptor. Even the courier never knows.',
    'banner.btn': 'Our Privacy Standards',
    'sec.new.eb': 'New Arrivals', 'sec.new.h2': 'Fresh <em class="em-rose">in</em>', 'sec.new.link': 'What\'s New →',
    'f1.t': '100% Discreet Packaging', 'f1.p': 'Plain box, no logo, contents never guessable from outside.',
    'f2.t': 'Eskişehir 2h Express Courier', 'f2.p': 'Direct private courier in ~2 hours in Eskişehir; same-day dispatch across Turkey.',
    'f3.t': 'Anonymous & Secure Payment', 'f3.p': '256-bit SSL protection; neutral corporate descriptor on statements.',
    'f4.t': 'Body-Safe & Certified', 'f4.p': 'Every product is CE-certified, hypoallergenic premium original material.',
    'sec.rev.eb': 'Our Guests', 'sec.rev.h2': 'Door closed, <em class="em-rose">satisfaction</em> open', 'sec.rev.empty': 'Be the first to review.',
    'nl.eb': 'Club Love', 'nl.h2': '10% off your <em class="em-rose">first order</em>',
    'nl.p': 'Join the list; hear about novelties and secret sales first. No spam, promise.',
    'nl.ph': 'your e-mail address', 'nl.btn': 'Join',
    'badge.new': 'New', 'badge.hot': 'Best Seller', 'badge.sale': 'Sale', 'quickadd': 'Add to Cart', 'quickview': 'Quick View',
    'curator.trigger': 'Curated Mood Finder',
    'curator.title': 'Personal Experience & Gift Curator',
    'curator.sub': 'Discover the perfect pieces tailored to your rhythm in just 2 questions.',
    'curator.bundle': 'Add Curated Bundle to Cart (15% Off)',
    'shop.crumb.home': 'Home', 'shop.title': 'Shop',
    'shop.desc': '{n} carefully curated products — all body-safe, all shipped silently.',
    'shop.count': '{n} products',
    'shop.search': 'Search products…', 'shop.cat': 'Category', 'shop.all': 'All',
    'shop.sort.def': 'Sort: Recommended', 'shop.sort.new': 'Newest First', 'shop.sort.asc': 'Price: Low to High',
    'shop.sort.desc': 'Price: High to Low', 'shop.sort.rate': 'Highest Rated',
    'rv.title': 'Write a Review', 'rv.rating': 'Your rating', 'rv.comment': 'Your review (min. 10 characters)', 'rv.ph': 'Share your experience…',
    'rv.submit': 'Submit', 'rv.note': 'Reviews are published after approval ·', 'rv.back': 'Back to product',
    'cart.title': 'My Cart', 'cart.crumb': 'Cart',
    'checkout.title': 'Checkout', 'checkout.crumb': 'Checkout',
    'login.title': 'Welcome back', 'login.sub': 'Sign in to your account and track your orders.',
    'login.email': 'E-mail', 'login.pass': 'Password', 'login.btn': 'Sign In', 'login.alt': 'No account yet?', 'login.altLink': 'Register',
    'auth.or': 'or with email',
    'auth.google.login': 'Continue with Google',
    'auth.google.reg': 'Sign up with Google',
    'auth.google.sec': 'Fast & secure one-click sign in with Google',
    'reg.title': 'Join us', 'reg.sub': 'Become a member to track orders and enjoy exclusive discounts.',
    'reg.name': 'Full Name', 'reg.email': 'E-mail', 'reg.pass': 'Password', 'reg.pass2': 'Password (Again)',
    'reg.age': 'I confirm I am over 18. I have read the privacy policy.',
    'reg.btn': 'Create Account', 'reg.alt': 'Already a member?', 'reg.altLink': 'Sign in',
    'account.title': 'My Account', 'profile.title': 'My Profile',
    'about.eb': 'Our Story',
    'about.h1': 'We left the shame behind. <br class="about-br">We put <em class="em-rose">pleasure</em> first.',
    'about.p1': 'Since 2012, Love Shop has been welcoming visitors and shipping orders continuously from the exact same physical store on İsmet İnönü Street in Eskişehir for 14 years. Unlike faceless online sellers with no verifiable address, we are a tangible establishment with an open door and real accountability.',
    'about.p2': 'To date, we have delivered over 5,000 orders with 100% discretion and zero compromise on our packaging standards. We believe exploring pleasure, understanding one\'s body, and prioritizing sexual wellness is not a taboo, but a fundamental right.',
    'about.p3': 'We combine our 14 years of hands-on retail expertise and certified body-safe catalog with a respectful, modern, and stigma-free shopping experience.',
    'about.priv.h': 'Complete Discretion Commitment',
    'about.priv.p': 'From the moment you browse to final delivery, your experience is shielded by our privacy protocol:',
    'about.priv.list': '• <b>Anonymous & Plain Packaging:</b> Plain protected box. No logo, no store name, no product hint.<br>• <b>Discreet Shipping Waybill:</b> Product names never appear on courier labels; sender info uses a compliant neutral commercial entity.<br>• <b>Billing Privacy:</b> Your bank statement displays a neutral payment gateway descriptor without any product references.<br>• <b>Data Protection:</b> 256-bit SSL encrypted. Used solely for order fulfillment; never shared with ad networks or third parties.',
    'about.ret.h': 'Returns & Replacement Policy',
    'about.ret.p': 'Under consumer protection laws and sanitary hygiene standards, opened or used intimate personal items cannot be returned. However:',
    'about.ret.list': '• <b>Dead on Arrival / Transit Damage:</b> If an item arrives non-functioning or damaged from transit, it is promptly replaced with a brand-new unit.<br>• <b>Fulfillment Accuracy:</b> Any incorrect or missing item is immediately and freely corrected.<br>• <b>Factory Sealed Products:</b> Unopened items with intact security tamper seals can be returned within 14 days.',
    'about.val.h': 'Our Values',
    'about.v1.t': 'Respect', 'about.v1.p': 'Every taste and body belongs here.',
    'about.v2.t': 'Safety', 'about.v2.p': 'CE-certified body-safe materials only.',
    'about.v3.t': 'Inclusivity', 'about.v3.p': 'Open to all identities and preferences.',
    'about.cta.h': 'Having questions? We listen without judgement.', 'about.cta.btn': 'Get in Touch',
    'contact.eb': 'Write to Us', 'contact.h1': 'The judgement-free way to say hello',
    'contact.p': 'Your questions can stay anonymous. 24/7 via WhatsApp, or in person at our store.',
    'contact.wa.t': 'WhatsApp Orders', 'contact.wa.s': 'Privacy-first, judgement-free contact',
    'contact.store.t': 'Our Store', 'contact.phone.t': 'Phone', 'contact.phone.s': 'between 09:00–22:00',
    'contact.map.h': 'How to find us',
    'contact.map.p': 'On Doktorlar Street, next to Watsons Store, Ilgaz Business Center.',
    'contact.map.btn': 'Open in Google Maps →', 'contact.wa.btn': 'Ask on WhatsApp',
    'contact.form.h': 'Write via form', 'contact.form.name': 'Name (optional)', 'contact.form.name.ph': 'Leave blank if you prefer',
    'contact.form.email': 'E-mail', 'contact.form.email.ph': 'so we can reply',
    'contact.form.msg': 'Your message', 'contact.form.msg.ph': 'Anything you\'re curious about…', 'contact.form.btn': 'Send',
    '404.h': '404 — Page not found', '404.p': 'Let\'s head back:', '404.home': 'Home', '404.shop': 'Shop',
    'thanks.total': 'Amount:', 'thanks.continue': 'Continue Shopping',
    'thanks.h.pickup': 'Your order is ready!', 'thanks.h.ship': 'Almost done!',
    'thanks.p.pickup': 'We set your items aside at our store.',
    'thanks.p.ship': 'To confirm payment/shipping, please forward your order to us via WhatsApp.',
    'thanks.wa.pickup': 'Confirm Stock on WhatsApp', 'thanks.wa.ship': 'Send Order to WhatsApp',
    'thanks.account': 'Order details are saved in <a href="/hesap" style="color:var(--rose);font-weight:600">My Account</a>.'
  }
};

function makeT(lang: string) {
  const d = STR[lang] || STR.tr;
  return (k: string, vars?: Record<string, any>) => {
    let s = d[k] !== undefined ? d[k] : (STR.tr[k] !== undefined ? STR.tr[k] : k);
    if (vars) for (const v in vars) s = s.split('{' + v + '}').join(String(vars[v]));
    return s;
  };
}

function pageCtx(req: http.IncomingMessage, res?: http.ServerResponse) {
  const lang = getCookieValue(req, 'ls_lang') === 'en' ? 'en' : 'tr';
  const theme = getCookieValue(req, 'ls_theme') === 'dark' ? 'dark' : 'light';
  const sess = getSession(req, res);
  const cartCount = (sess && Array.isArray(sess.cart)) ? sess.cart.reduce((a: number, i: any) => a + (parseInt(i.qty, 10) || 1), 0) : 0;
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse|pagespeed|pingdom|gtmetrix|headless/i.test(ua);
  return { lang, theme, t: makeT(lang), num: (n: number) => n.toLocaleString(lang === 'en' ? 'en-US' : 'tr-TR'), cartCount, isBot };
}

const ERR: Record<string, Record<string, string>> = {
  tr: {
    'err.rate': 'Çok fazla deneme, 1 dakika bekleyin.',
    'err.email': 'Geçerli bir e-posta girin.',
    'err.pass6': 'Şifre en az 6 karakter olmalı.',
    'err.emailUsed': 'Bu e-posta zaten kayıtlı.',
    'err.badLogin': 'E-posta veya şifre hatalı.',
    'err.notFound404': 'Endpoint bulunamadı.',
    'err.noUser': 'Giriş yapmalısın.',
    'err.noProd': 'Ürün bulunamadı.',
    'err.noStock': 'Bu ürün tükendi.',
    'err.notInCart': 'Sepette bu ürün yok.',
    'err.couponNone': 'Kupon bulunamadı.',
    'err.couponOff': 'Bu kupon artık aktif değil.',
    'err.couponMin': 'Bu kupon için en az {min} sepette olmalı.',
    'err.emptyCart': 'Sepet boş.',
    'err.namePhone': 'Ad soyad ve telefon zorunludur.',
    'err.address': 'Kargo için adres ve şehir zorunludur.',
    'err.noOrder': 'Sipariş bulunamadı.',
    'err.orderForbid': 'Bu siparişi göremezsin.',
    'err.revShort': 'Yorum en az 10 karakter olmalı.',
    'err.reviewNeedUser': 'Yorum yapmak için giriş yapmalısın.',
    'err.msgShort': 'Mesaj çok kısa.',
    'err.needName': 'Ad ve fiyat zorunlu.',
    'err.catName': 'Kategori adı zorunlu.',
    'err.catSlug': 'Bu slug zaten bir kategoriye ait.',
    'err.catBusy': 'Bu kategoride {count} ürün var. Önce ürünleri taşı veya sil.',
    'err.catNone': 'Kategori bulunamadı.',
    'err.wheelFull': 'Çarkta en fazla 8 ürün olabilir; önce birini çıkar.',
    'err.couponShort': 'Kupon kodu en az 3 karakter olmalı.',
    'err.couponExists': 'Bu kod zaten var.',
    'err.revNone': 'Yorum bulunamadı.',
    'err.userNone': 'Kullanıcı bulunamadı.',
    'err.selfEdit': 'Kendi hesabını değiştiremezsin.',
    'err.selfDel': 'Kendi hesabını silemezsin.',
    'err.badReq': 'Geçersiz istek.',
    'err.needAdmin': 'Önce admin girişi gerekli.',
    'err.tooLarge': 'Dosya/istek çok büyük.',
    'err.badJson': 'Geçersiz istek gövdesi.',
    'err.server': 'Sunucuda bir sorun oluştu.'
  },
  en: {
    'err.rate': 'Too many attempts, please wait 1 minute.',
    'err.email': 'Please enter a valid e-mail.',
    'err.pass6': 'Password must be at least 6 characters.',
    'err.emailUsed': 'This e-mail is already registered.',
    'err.badLogin': 'E-mail or password is incorrect.',
    'err.notFound404': 'Endpoint not found.',
    'err.noUser': 'You must be signed in.',
    'err.noProd': 'Product not found.',
    'err.noStock': 'This product is out of stock.',
    'err.notInCart': 'This item is not in your cart.',
    'err.couponNone': 'Coupon not found.',
    'err.couponOff': 'This coupon is no longer active.',
    'err.couponMin': 'You need at least {min} in your cart for this coupon.',
    'err.emptyCart': 'Cart is empty.',
    'err.namePhone': 'Full name and phone are required.',
    'err.address': 'Address and city are required for shipping.',
    'err.noOrder': 'Order not found.',
    'err.orderForbid': 'You cannot view this order.',
    'err.revShort': 'Review must be at least 10 characters.',
    'err.reviewNeedUser': 'You must sign in to review.',
    'err.msgShort': 'Message is too short.',
    'err.needName': 'Name and price are required.',
    'err.catName': 'Category name is required.',
    'err.catSlug': 'This slug already belongs to a category.',
    'err.catBusy': 'This category has {count} products. Move or delete them first.',
    'err.catNone': 'Category not found.',
    'err.wheelFull': 'The wheel can hold up to 8 products; remove one first.',
    'err.couponShort': 'Coupon code must be at least 3 characters.',
    'err.couponExists': 'This code already exists.',
    'err.revNone': 'Review not found.',
    'err.userNone': 'User not found.',
    'err.selfEdit': 'You cannot modify your own account.',
    'err.selfDel': 'You cannot delete your own account.',
    'err.badReq': 'Invalid request.',
    'err.needAdmin': 'Admin sign-in required first.',
    'err.tooLarge': 'File/request too large.',
    'err.badJson': 'Invalid request body.',
    'err.server': 'A server error occurred.'
  }
};

function errT(lang: string, key: string, vars?: Record<string, any>) {
  let s = (ERR[lang] && ERR[lang][key]) || ERR.tr[key] || key;
  if (vars) for (const v in vars) s = s.split('{' + v + '}').join(String(vars[v]));
  return s;
}

/* ---------------- calc helpers ---------------- */
export function matchesCategory(productCategory: string | undefined | null, filterCategory: string | undefined | null): boolean {
  if (!filterCategory) return true;
  const f = filterCategory.toLowerCase().trim();
  if (f === 'hepsi' || f === 'all' || f === '' || f === 'undefined' || f === 'null') return true;
  if (!productCategory) return false;
  const p = productCategory.toLowerCase().trim();
  if (p === f) return true;

  const normalize = (slug: string): string => {
    const s = slug.toLowerCase().trim();
    if (s === 'vibratorler' || s === 'vibrator' || s === 'vibratori') return 'vibratorler';
    if (s === 'realistik-dildolar' || s === 'dildo' || s === 'dildolar') return 'realistik-dildolar';
    if (s === 'realistik-mankenler' || s === 'sisme-manken' || s === 'mankenler' || s === 'realistik-manken') return 'realistik-mankenler';
    if (s === 'ciftler' || s === 'realistik-vajinalar' || s === 'vajina-masturbator' || s === 'realistik-vajina') return 'ciftler';
    if (s === 'fetish-urunler' || s === 'fetish' || s === 'fetis' || s === 'fetis-urunleri') return 'fetish-urunler';
    if (s === 'fantezi-ic-giyim' || s === 'ic-giyim' || s === 'fantezi-giyim' || s === 'fantezi') return 'fantezi-ic-giyim';
    if (s === 'erkekler' || s === 'erkek-cinsel-saglik' || s === 'erkek-saglik' || s === 'erkek-cinsel-saglik-urunu') return 'erkekler';
    if (s === 'kadinlar' || s === 'kadin-cinsel-saglik' || s === 'kadin-saglik' || s === 'kadin-cinsel-saglik-urunu') return 'kadinlar';
    if (s === 'erkek-ve-kadinlar' || s === 'anal-urunler' || s === 'anal-urun' || s === 'anal' || s === 'anal-plug') return 'anal-urunler';
    return s;
  };

  return normalize(p) === normalize(f);
}

export const SUBCATEGORIES_MAP: Record<string, { slug: string; name: string; nameEn?: string }[]> = {
  'vibratorler': [
    { slug: 'rabbit', name: 'Rabbit', nameEn: 'Rabbit Vibrators' },
    { slug: 'klitoral', name: 'Klitoral', nameEn: 'Clitoral' },
    { slug: 'cift-motor', name: 'Çift Motor', nameEn: 'Dual Motor' },
    { slug: 'akilli-app', name: 'Akıllı / App', nameEn: 'App Controlled' },
    { slug: 'dilli-rotary', name: 'Dilli / Rotary', nameEn: 'Tongue & Thrusting' }
  ],
  'realistik-dildolar': [
    { slug: 'vantuzlu', name: 'Vantuzlu', nameEn: 'Suction Base' },
    { slug: 'damarli', name: 'Damarlı', nameEn: 'Veined & Realistic' },
    { slug: 'buyuk-boy', name: 'Büyük Boy', nameEn: 'Large Size' },
    { slug: 'baslangic', name: 'Başlangıç', nameEn: 'Beginner / Small' }
  ],
  'fantezi-ic-giyim': [
    { slug: 'body-teddy', name: 'Body & Teddy', nameEn: 'Bodysuits' },
    { slug: 'jartiyer', name: 'Jartiyer', nameEn: 'Garter Sets' },
    { slug: 'seffaf-takim', name: 'Şeffaf Takım', nameEn: 'Sheer Sets' }
  ],
  'anal-urunler': [
    { slug: 'plug', name: 'Plug', nameEn: 'Anal Plugs' },
    { slug: 'titresimli', name: 'Titreşimli', nameEn: 'Vibrating Anal' },
    { slug: 'boncuk-kilif', name: 'Boncuk & Kılıf', nameEn: 'Beads & Sleeves' }
  ],
  'ciftler': [
    { slug: 'titresimli-vajina', name: 'Titreşimli Vajina', nameEn: 'Vibrating Flesh' },
    { slug: 'manuel-vajina', name: 'Manuel Vajina', nameEn: 'Manual Flesh' },
    { slug: 'agiz-oral', name: 'Ağız & Oral', nameEn: 'Mouth / Oral' },
    { slug: 'cift-girisli', name: 'Çift Girişli', nameEn: 'Dual Entry' }
  ],
  'realistik-mankenler': [
    { slug: 'tam-boy-manken', name: 'Tam Boy Manken', nameEn: 'Full Body' },
    { slug: 'torso-govde', name: 'Torso Gövde', nameEn: 'Torso' },
    { slug: 'kalca-vajina', name: 'Kalça & Vajina', nameEn: 'Hip & Vagina' }
  ],
  'erkekler': [
    { slug: 'geciktirici', name: 'Geciktirici & Krem', nameEn: 'Delay & Creams' },
    { slug: 'pompa-vakum', name: 'Pompa & Vakum', nameEn: 'Pumps & Vacuums' },
    { slug: 'halka-kilif', name: 'Halka & Kılıf', nameEn: 'Rings & Sleeves' },
    { slug: 'masturbator', name: 'Mastürbatör', nameEn: 'Masturbators' }
  ],
  'kadinlar': [
    { slug: 'kayganlastirici', name: 'Kayganlaştırıcı', nameEn: 'Lubricants' },
    { slug: 'kegel-toplari', name: 'Kegel Topları', nameEn: 'Kegel Balls' },
    { slug: 'istek-artirici', name: 'İstek Artırıcı', nameEn: 'Arousal' }
  ],
  'fetish-urunler': [
    { slug: 'baglama-kelepce', name: 'Bağlama & Kelepçe', nameEn: 'Restraints' },
    { slug: 'kirbac-spank', name: 'Kırbaç & Spank', nameEn: 'Whips' },
    { slug: 'maske-kostum', name: 'Maske & Kostüm', nameEn: 'Masks & Costumes' }
  ]
};

export function matchesSubcategory(p: any, subcat: string | undefined | null): boolean {
  if (!subcat) return true;
  const s = String(subcat).toLowerCase().trim();
  
  // 1. Exact direct match on assigned subcategory slug
  if (p && p.subcategory && String(p.subcategory).toLowerCase().trim() === s) return true;
  
  // 2. Legacy fallback fuzzy matching for backward compatibility
  const name = String(p?.name || '').toLowerCase();
  const desc = String(p?.description || '').toLowerCase();
  const text = `${name} ${desc}`;
  
  if (s === 'rabbit' || s === 'rabbit-vibratorler') return text.includes('rabbit');
  if (s === 'cift-motor' || s === 'cift-motorlu') return text.includes('çift motor') || text.includes('u tipi') || text.includes('noctis') || text.includes('ornella') || text.includes('mika');
  if (s === 'akilli-app' || s === 'telefon-kontrollu') return text.includes('telefon') || text.includes('app') || text.includes('bluetooth');
  if (s === 'klitoral' || s === 'klitoral-uyarici') return text.includes('klitoral') || text.includes('emiş') || text.includes('wand') || text.includes('petunia') || text.includes('wisteria') || text.includes('lilu') || text.includes('flax') || text.includes('azalia') || text.includes('lelo');
  if (s === 'dilli-rotary' || s === 'dilli-hareketli') return text.includes('dilli') || text.includes('hareketli') || text.includes('begonia');
  
  if (s === 'vantuzlu') return text.includes('vantuz') || text.includes('steve') || text.includes('oscar');
  if (s === 'damarli' || s === 'damarli-realistik') return text.includes('damar') || text.includes('realistik') || text.includes('steve') || text.includes('oscar');
  if (s === 'buyuk-boy') return text.includes('büyük') || text.includes('xl');
  if (s === 'baslangic' || s === 'baslangic-seviyesi') return text.includes('küçük') || text.includes('başlangıç');
  
  if (s === 'plug') return text.includes('plug') || text.includes('elmas') || text.includes('metal') || text.includes('yapay penis');
  if (s === 'boncuk-kilif' || s === 'boncuklu') return text.includes('boncuk') || text.includes('kılıf') || text.includes('eridani');
  if (s === 'titresimli' || s === 'titresimli-anal') return text.includes('titreşim') || text.includes('stimülatör') || text.includes('telefon') || text.includes('dorado');
  
  if (s === 'body-teddy' || s === 'body') return text.includes('body') || text.includes('teddy');
  if (s === 'jartiyer' || s === 'jartiyer-takim') return text.includes('jartiyer');
  if (s === 'seffaf-takim') return text.includes('şeffaf') || text.includes('tül');

  if (s === 'titresimli-vajina') return text.includes('titreşim') || text.includes('motor');
  if (s === 'manuel-vajina') return text.includes('manuel') || text.includes('cep') || text.includes('egg');
  if (s === 'agiz-oral') return text.includes('oral') || text.includes('ağız') || text.includes('dudak');
  if (s === 'cift-girisli') return text.includes('çift') || text.includes('2 giriş') || text.includes('tünel');

  if (s === 'tam-boy-manken') return text.includes('tam boy') || text.includes('160') || text.includes('165') || text.includes('158');
  if (s === 'torso-govde') return text.includes('torso') || text.includes('gövde');
  if (s === 'kalca-vajina') return text.includes('kalça') || text.includes('bacak');

  if (s === 'geciktirici') return text.includes('geciktirici') || text.includes('sprey') || text.includes('krem');
  if (s === 'pompa-vakum') return text.includes('pompa') || text.includes('vakum') || text.includes('otomatik pompa');
  if (s === 'halka-kilif') return text.includes('halka') || text.includes('kılıf') || text.includes('ring');
  if (s === 'masturbator') return text.includes('mastürbatör') || text.includes('cup') || text.includes('otomatik');

  if (s === 'kayganlastirici') return text.includes('kayganlaştırıcı') || text.includes('jel') || text.includes('lubricant');
  if (s === 'kegel-toplari') return text.includes('kegel') || text.includes('top');
  if (s === 'istek-artirici') return text.includes('istek') || text.includes('damla') || text.includes('uyarıcı jel');

  if (s === 'baglama-kelepce') return text.includes('kelepçe') || text.includes('bağlama') || text.includes('halat') || text.includes('tasma');
  if (s === 'kirbac-spank') return text.includes('kırbaç') || text.includes('spank') || text.includes('şaklatıcı');
  if (s === 'maske-kostum') return text.includes('maske') || text.includes('kostüm') || text.includes('deri');
  
  return false;
}

function allCategories() {
  const cats = Array.isArray(db.categories) ? [...db.categories] : [];
  for (const c of cats) {
    if (c.slug === 'erkekler' || c.name === 'Erkek Sağlık') {
      c.name = 'Erkek Cinsel Sağlık';
    }
    if (c.slug === 'erkek-ve-kadinlar' || c.name === 'Anal Ürünler') {
      c.slug = 'anal-urunler';
      c.name = 'Anal Ürünler';
    }
  }
  const known = new Set(cats.map((c: any) => c.slug));
  for (const p of db.products || []) {
    if (p.category === 'erkekler' || p.categoryName === 'Erkek Sağlık') {
      p.categoryName = 'Erkek Cinsel Sağlık';
    }
    if (p.category === 'erkek-ve-kadinlar' || p.categoryName === 'Anal Ürünler') {
      p.category = 'anal-urunler';
      p.categoryName = 'Anal Ürünler';
    }
    if (p.category && !known.has(p.category)) {
      known.add(p.category);
      cats.push({ id: 'ct_' + p.category, slug: p.category, name: p.categoryName || p.category, image: '', featuredOnHome: false, homeOrder: 99, createdAt: p.createdAt });
    }
  }
  for (const c of cats) {
    c.subcategories = SUBCATEGORIES_MAP[c.slug] || [];
  }
  return cats;
}

function formatCatTitle(name: string): string {
  const parts = (name || '').trim().split(/\s+/);
  if (parts.length <= 1) return esc(parts[0] || '');
  const first = parts.slice(0, -1).join(' ');
  const last = parts[parts.length - 1];
  return `${esc(first)} <em>${esc(last)}</em>`;
}

function wheelProducts() {
  if (!Array.isArray(db.settings.wheelIds)) db.settings.wheelIds = [];
  const chosen: any[] = [];
  const ids = new Set();
  const validIds: string[] = [];
  let changed = false;
  for (const id of db.settings.wheelIds) {
    const p = db.products.find((x: any) => x.id === id);
    if (p) {
      validIds.push(id);
      if (!ids.has(p.id)) { chosen.push(p); ids.add(p.id); }
    } else {
      changed = true;
    }
    if (chosen.length >= 8) break;
  }
  if (changed) {
    db.settings.wheelIds = validIds;
    saveLocal();
  }
  if (chosen.length < 8) {
    for (const p of db.products.filter((x: any) => (x.featured || x.bestSeller) && !ids.has(x.id)).slice(0, 8 - chosen.length)) {
      chosen.push(p); ids.add(p.id);
    }
  }
  if (chosen.length < 8) {
    for (const p of db.products) {
      if (!ids.has(p.id)) { chosen.push(p); ids.add(p.id); if (chosen.length >= 8) break; }
    }
  }
  return chosen.slice(0, 8);
}

function bentoTemplate(n: number) {
  n = Math.max(1, Math.min(n || 1, 4));
  const L = 'abcd';
  const desk: string[][] = [], mid: string[][] = [], mob: string[][] = [];
  if (n === 1) {
    desk.push([L[0], L[0], L[0]], ['e', 'e', 'e']);
    mid.push([L[0]], ['e']);
    mob.push([L[0]], ['e']);
  } else if (n === 2) {
    desk.push([L[0], L[0], L[1], L[1]], ['e', 'e', 'e', 'e']);
    mid.push([L[0], L[1]], ['e', 'e']);
    mob.push([L[0], L[1]], ['e', 'e']);
  } else if (n === 3) {
    desk.push([L[0], L[0], L[1], L[2]], [L[0], L[0], 'e', 'e']);
    mid.push([L[0], L[1]], [L[2], 'e']);
    mob.push([L[0], L[0]], [L[1], L[2]], ['e', 'e']);
  } else {
    desk.push([L[0], L[0], L[1], L[2]], [L[0], L[0], L[3], 'e']);
    mid.push([L[0], L[1]], [L[2], L[3]], ['e', 'e']);
    mob.push([L[0], L[0]], [L[1], L[2]], [L[3], 'e']);
  }
  const formatRows = (rows: string[][]) => rows.map((r) => `'${r.join(' ')}'`).join(' ');
  return { desktop: formatRows(desk), mid: formatRows(mid), mob: formatRows(mob) };
}

function cartCalc(cartOrSess: any, couponParam?: string) {
  const st = db.settings;
  const items: any[] = [];
  let rawList: any[] = [];
  let couponCode: string | null = null;

  if (Array.isArray(cartOrSess)) {
    rawList = cartOrSess;
    couponCode = couponParam || null;
  } else if (cartOrSess && typeof cartOrSess === 'object') {
    rawList = Array.isArray(cartOrSess.cart) ? cartOrSess.cart : (Array.isArray(cartOrSess.items) ? cartOrSess.items : []);
    couponCode = couponParam || cartOrSess.coupon || (typeof cartOrSess.coupon === 'object' ? cartOrSess.coupon?.code : null) || null;
  }

  for (const line of rawList) {
    if (!line) continue;
    const prodId = String(line.productId || line.id || '').trim();
    const p = db.products.find((x: any) => x.id === prodId || x.slug === prodId);
    if (!p || p.stock <= 0) continue;
    const reqQty = Math.max(1, parseInt(line.qty, 10) || 1);
    const validQty = Math.min(reqQty, p.stock);
    const variant = String(line.variant || 'standart').trim();
    
    const existing = items.find((it) => it.productId === p.id && it.variant === variant);
    if (existing) {
      existing.qty = Math.min(existing.qty + validQty, p.stock);
      existing.lineTotal = existing.price * existing.qty;
    } else {
      items.push({
        productId: p.id, slug: p.slug, name: p.name, categoryName: p.categoryName,
        category: p.category, image: p.image, variant,
        price: p.price, qty: validQty, lineTotal: p.price * validQty, stock: p.stock
      });
    }
  }
  const subtotal = items.reduce((a, i) => a + i.lineTotal, 0);
  let discount = 0, coupon = null;
  if (couponCode) {
    const c = db.coupons.find((x: any) => x.code.toUpperCase() === String(couponCode).toUpperCase().trim());
    if (c && c.active && subtotal >= c.minTotal) {
      coupon = c;
      discount = c.type === 'percent' ? Math.round(subtotal * c.value) / 100 : c.value;
      discount = Math.min(discount, subtotal);
    }
  }
  const shipping = subtotal === 0 ? 0 : (subtotal - discount >= st.freeShippingThreshold ? 0 : st.shippingFee);
  return { items, subtotal, discount: Math.round(discount * 100) / 100, shipping, coupon, total: Math.round((subtotal - discount + shipping) * 100) / 100, freeShippingThreshold: st.freeShippingThreshold };
}

function findCoupon(code: string, lang = 'tr') {
  const c = db.coupons.find((x: any) => x.code.toUpperCase() === String(code || '').toUpperCase().trim());
  if (!c) return { error: errT(lang, 'err.couponNone') };
  if (!c.active) return { error: errT(lang, 'err.couponOff') };
  if (c.maxUses > 0 && c.used >= c.maxUses) return { error: 'Bu kuponun kullanım limiti dolmuş.' };
  return { coupon: c };
}

/* ---------------- layout ---------------- */
const CAT_EN: Record<string, string> = {
  'anal-urunler': 'Anal Products',
  'anal-urun': 'Anal Products',
  'erkek-ve-kadinlar': 'Anal Products',
  'vibratorler': 'Vibrators',
  'vibrator': 'Vibrators',
  'vibratori': 'Vibrators',
  'realistik-dildolar': 'Realistic Dildos',
  'dildo': 'Dildos',
  'realistik-mankenler': 'Realistic Dolls',
  'ciftler': 'Realistic Vaginas',
  'realistik-vajinalar': 'Realistic Vaginas',
  'fantezi-ic-giyim': 'Fantasy Lingerie',
  'fetish-urunler': 'Fetish Products',
  'erkekler': "Men's Sexual Health",
  'erkek-cinsel-saglik': "Men's Sexual Health",
  'kadinlar': "Women's Sexual Health",
  'kadin-cinsel-saglik': "Women's Sexual Health",
  'kozmetik': 'Cosmetics',
  'fantasy': 'Fantasy & Costume',
  'oyunlar': 'Games & Accessories'
};

function catNameEN(slug: string, name: string) { return CAT_EN[slug] || name; }

const APP_BUILD_TIME = Date.now();
const APP_VERSION = '2.1.0';

function layout(title: string, body: string, opts: any = {}, ctx: any = null) {
  const st = db.settings;
  const C = ctx || { lang: 'tr', theme: 'light', t: makeT('tr'), num: (n: number) => n.toLocaleString('tr-TR') };
  const tr = C.t;
  const dark = C.theme === 'dark';
  const appVersion = `${APP_VERSION}-${APP_BUILD_TIME}`;
  const desc = opts.description || (C.lang === 'en' 
    ? 'LOVE: Modern Sexual Wellness & Intimacy store. 100% discreet packaging, anonymous payment, certified body-safe products with express delivery across Turkey.'
    : 'LOVE: Modern Sexual Wellness & Cinsel Sağlık Platformu. Beden dostu medikal teknolojiler, masaj aletleri ve organik formüller. %100 çift mühürlü gizli paketleme, tüm Türkiye\'ye aynı gün kargo ve Eskişehir 15 yıllık köklü mağaza güvencesi.');
  const canonicalUrl = opts.canonical || (`https://loveeroticshop.com${C.path || '/'}`);
  const ogImage = opts.ogImage || (opts.product?.image ? opts.product.image : 'https://loveeroticshop.com/test.png');

  // 2026 Enhanced Structured Data (JSON-LD) for Search Intent & Brand Authority
  const schemaGraph: any[] = [
    {
      "@type": "WebSite",
      "@id": "https://loveeroticshop.com/#website",
      "url": "https://loveeroticshop.com/",
      "name": "LOVE — Sexual Wellness & Intimacy",
      "alternateName": ["LOVE Sexual Wellness", "LOVE Cinsel Sağlık", "Love Sex Shop", "Love Erotik Shop", "Love Seks Shop", "Love Shop"],
      "description": "Türkiye'nin lider modern Sexual Wellness & Cinsel Sağlık platformu. %100 gizli çift mühürlü paketleme, aynı gün hızlı kargo ve medikal standartlar.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://loveeroticshop.com/magaza?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://loveeroticshop.com/#organization",
      "name": "LOVE — Sexual Wellness",
      "url": "https://loveeroticshop.com/",
      "logo": "https://loveeroticshop.com/test.png",
      "description": "Türkiye genelinde %100 çift mühürlü gizli paketleme ile hizmet veren modern sexual wellness ve intimate body care platformu.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": st.supportPhone || "+90 543 633 13 25",
        "contactType": "customer service",
        "areaServed": "TR",
        "availableLanguage": ["Turkish", "English"]
      }
    }
  ];

  // Store / LocalBusiness schema MUST ONLY be present on physical store page or contact page
  if (opts.includeStoreSchema) {
    schemaGraph.push({
      "@type": "Store",
      "@id": "https://loveeroticshop.com/#store",
      "name": "LOVE — Sexual Wellness & Cinsel Sağlık (Eskişehir Mağazası)",
      "legalName": "Love Erotik Shop Eskişehir",
      "alternateName": ["Eskişehir Sex Shop", "Eskişehir Erotik Shop", "Love Shop Eskişehir"],
      "url": "https://loveeroticshop.com/sehir/eskisehir",
      "logo": "https://loveeroticshop.com/test.png",
      "image": "https://loveeroticshop.com/test.png",
      "description": "Eskişehir Tepebaşı & Odunpazarı içi 2-3 saatte özel gizli kurye ve fiziksel mağazadan elden teslim. %100 gizli çift katlı mühürlü paketleme, orijinal faturalı ve beden dostu medikal teknolojiler.",
      "priceRange": "₺₺",
      "telephone": st.supportPhone || "+90 543 633 13 25",
      "currenciesAccepted": "TRY",
      "paymentAccepted": "Nakit, Kredi Kartı, Havale, EFT, Güvenli Online Ödeme",
      "areaServed": [
        { "@type": "City", "name": "Eskişehir" },
        { "@type": "AdministrativeArea", "name": "Tepebaşı" },
        { "@type": "AdministrativeArea", "name": "Odunpazarı" }
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "10:00",
          "closes": "02:00"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "İsmet İnönü-1 Cd. No:52/2 Ilgaz İş Hanı Kat:1 Daire:2 (İsmet İnönü Tramvay Durağı Karşısı, Watsons & Yves Rocher Yanı)",
        "addressLocality": "Tepebaşı",
        "addressRegion": "Eskişehir",
        "postalCode": "26170",
        "addressCountry": "TR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 39.7767,
        "longitude": 30.5206
      },
      "hasMap": "https://maps.google.com/?q=39.7767,30.5206",
      "hasMerchantReturnPolicy": getMerchantReturnPolicySchema()
    });
  }

  if (opts.product) {
    const prod = opts.product;
    schemaGraph.push({
      "@type": "Product",
      "@id": `https://loveeroticshop.com/urun/${prod.slug || prod.id}#product`,
      "name": prod.name,
      "description": prod.desc || prod.name,
      "image": prod.image ? [prod.image] : [],
      "sku": prod.id,
      "brand": {
        "@type": "Brand",
        "name": "Love."
      },
      "offers": {
        "@type": "Offer",
        "url": `https://loveeroticshop.com/urun/${prod.slug || prod.id}`,
        "priceCurrency": "TRY",
        "price": prod.price,
        "availability": (prod.stock ?? 1) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition",
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "shippingDetails": getProductShippingDetailsSchema(Number(prod.price || 0)),
        "hasMerchantReturnPolicy": getMerchantReturnPolicySchema(),
        "seller": {
          "@type": "Organization",
          "name": "Love Erotik Shop Eskişehir"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": prod.rating || 5.0,
        "reviewCount": prod.reviewCount || 12
      }
    });

    schemaGraph.push({
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://loveeroticshop.com/" },
        { "@type": "ListItem", "position": 2, "name": "Mağaza", "item": "https://loveeroticshop.com/magaza" },
        { "@type": "ListItem", "position": 3, "name": prod.name, "item": `https://loveeroticshop.com/urun/${prod.slug || prod.id}` }
      ]
    });
  }

  if (opts.breadcrumbs && Array.isArray(opts.breadcrumbs)) {
    schemaGraph.push({
      "@type": "BreadcrumbList",
      "itemListElement": opts.breadcrumbs.map((b: any, idx: number) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": b.name,
        "item": b.url
      }))
    });
  }

  if (opts.article) {
    const art = opts.article;
    schemaGraph.push({
      "@type": "Article",
      "headline": art.title,
      "description": art.summary,
      "author": {
        "@type": "Organization",
        "name": "Love. Sağlık ve Ürün Standartları Masası",
        "url": "https://loveeroticshop.com/hakkimizda"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Love Erotik & Seks Shop Eskişehir",
        "logo": {
          "@type": "ImageObject",
          "url": "https://loveeroticshop.com/test.png"
        }
      },
      "datePublished": art.date,
      "dateModified": art.date,
      "mainEntityOfPage": `https://loveeroticshop.com/rehber/${art.slug}`
    });
  }

  if (opts.faq && Array.isArray(opts.faq)) {
    schemaGraph.push({
      "@type": "FAQPage",
      "mainEntity": opts.faq.map((item: any) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    });
  }

  const jsonLd = JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph });

  return `<!DOCTYPE html>
<html lang="${C.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} | LOVE Sexual Wellness</title>
<meta name="description" content="${esc(desc)}">
<meta name="google-site-verification" content="googled2d4255e0f685daf">
<meta property="og:site_name" content="LOVE — Sexual Wellness & Intimacy">
<meta property="og:title" content="${esc(title)} | LOVE Sexual Wellness">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:url" content="${esc(canonicalUrl)}">
<meta property="og:type" content="website">
<link rel="canonical" href="${esc(canonicalUrl)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Playfair+Display:ital,wght@0,600;1,400;1,600&display=swap" media="print" onload="this.media='all'" />
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Playfair+Display:ital,wght@0,600;1,400;1,600&display=swap" /></noscript>
<link rel="preload" href="/css/shop.css?v=${appVersion}" as="style">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<!-- <link rel="icon" type="image/x-icon" href="/favicon.ico"> removed -->
<link rel="apple-touch-icon" href="/favicon.svg">
<script>try{var d=localStorage.getItem('ls_theme');if(d==='dark'||((d===null||d==='')&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');var isBot=/bot|googlebot|crawler|spider|robot|crawling|lighthouse|pagespeed|pingdom|gtmetrix|headless/i.test(navigator.userAgent);if(!isBot&&(localStorage.getItem('ls_age_ok_v11')!=='1'||new URLSearchParams(location.search).has('gate')||new URLSearchParams(location.search).has('yas')))document.documentElement.classList.add('gate-active-init');}catch(e){}</script>
<style>html:not(.gate-active-init) #age-gate { display: none !important; }</style>
<link rel="stylesheet" href="/css/shop.css?v=${appVersion}">
${opts.preloadImages && Array.isArray(opts.preloadImages) ? opts.preloadImages.map((img: string) => `<link rel="preload" as="image" href="${esc(img)}" fetchpriority="high">`).join('\n') : ''}
<script type="application/ld+json">${jsonLd}</script>
<script type="speculationrules">
{
  "prefetch": [
    {
      "where": { "href_matches": "/*" },
      "eagerness": "moderate"
    }
  ]
}
</script>
${GOOGLE_CLIENT_ID ? `<script>window.__LS_GOOGLE_CLIENT_ID__='${GOOGLE_CLIENT_ID}'</script><script src="https://accounts.google.com/gsi/client" async defer></script>` : ''}
</head>
<body>
${opts.noChrome ? body : `
${C.isBot ? '' : `
<div id="age-gate">
  <video class="age-bg-video" autoplay loop muted playsinline preload="auto">
    <source src="/uploads/age-gate-bg.mp4" type="video/mp4">
    <source src="/videos/age-gate-bg.mp4" type="video/mp4">
    <source src="/age-gate-bg.mp4" type="video/mp4">
    <source src="/uploads/video.mp4" type="video/mp4">
  </video>
  <div class="age-video-overlay"></div>
  <div class="age-content">
    <h2 class="brand age-brand">LOVE<span class="dot">.</span></h2>
    <div class="age-title" style="font-size:32px;font-weight:700;margin-bottom:12px">${tr('age.title')}</div>
    <p class="age-legal">${tr('age.legal')}</p>
    <div class="age-actions">
      <button id="age-yes" class="btn btn-primary">${tr('age.yes')}</button>
      <button id="age-no" class="btn btn-ghost">${tr('age.no')}</button>
    </div>
    <small class="age-small">${tr('age.small')}</small>
  </div>
</div>`}
<div id="cursor-glow"></div>
<header><nav class="top">
  <div class="nav-inner">
    <a href="/" class="brand">LOVE<span class="dot">.</span></a>
    <div class="nav-links">
      <a href="/" data-nav="/">${tr('nav.home')}</a>
      <a href="/magaza" data-nav="/magaza">${tr('nav.shop')}</a>
      <a href="/hakkimizda" data-nav="/hakkimizda">${tr('nav.about')}</a>
      <a href="/iletisim" data-nav="/iletisim">${tr('nav.contact')}</a>
    </div>
    <div class="nav-tools">
      <button id="nav-search-btn" class="icon-btn" title="${tr('nav.search')}" aria-label="Search">
        <svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
      <button id="theme-toggle" class="icon-btn" title="${dark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}" aria-label="Dark mode">
        ${dark ? '<svg class="icon-svg icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>' : '<svg class="icon-svg icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>'}
      </button>
      <button id="lang-toggle" class="lang-btn" title="${C.lang === 'tr' ? 'Switch to English' : 'Türkçeye geç'}" aria-label="Switch language">${C.lang === 'tr' ? 'EN' : 'TR'}</button>
      <span id="nav-user"><a href="/giris" class="icon-btn" title="${tr('nav.login')}"><svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></a></span>
      <a href="/sepet" class="icon-btn cart-btn" id="nav-cart-btn" title="Sepet" aria-label="Sepet"><svg class="icon-svg icon-bag-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8.5h12l1 11.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8.5z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/></svg><span class="cart-badge ${C.cartCount ? '' : 'hidden'}" id="cart-badge" style="${C.cartCount ? '' : 'display:none;'}">${C.cartCount || 0}</span></a>
      <button id="burger" class="icon-btn burger-btn" aria-label="Menü" title="Menü">
        <svg class="icon-svg icon-burger-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <line class="burger-bar b-bar-1" x1="4" x2="20" y1="8.5" y2="8.5"/>
          <line class="burger-bar b-bar-2" x1="4" x2="20" y1="15.5" y2="15.5"/>
        </svg>
      </button>
    </div>
  </div>
</nav></header>
<div class="mm-backdrop" id="mm-backdrop"></div>
<aside class="mobile-menu" id="mobile-menu" aria-label="Mobil Gezinme Menüsü" role="dialog" aria-modal="true">
  <div class="mm-head">
    <a href="/" class="brand mm-brand">LOVE<span class="dot">.</span></a>
    <button type="button" id="mm-close" class="icon-btn mm-close-btn" aria-label="Kapat" title="Kapat">
      <svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>

  <div class="mm-body">
    <div class="mm-primary-section">
      <nav class="mm-apple-nav" aria-label="Ana Gezinme">
        <a href="/" data-nav="/" class="mm-apple-link" style="--i: 0">
          <span>${tr('nav.home')}</span>
        </a>
        <a href="/magaza" data-nav="/magaza" class="mm-apple-link" style="--i: 1">
          <span>${tr('nav.shop')}</span>
        </a>
        <a href="/magaza?filter=new" data-nav="/magaza?filter=new" class="mm-apple-link" style="--i: 2">
          <span>${C.lang === 'tr' ? 'Yeni Gelenler' : 'New Arrivals'}</span>
        </a>
        <a href="/magaza?filter=bestsellers" data-nav="/magaza?filter=bestsellers" class="mm-apple-link" style="--i: 3">
          <span>${C.lang === 'tr' ? 'Çok Satanlar' : 'Bestsellers'}</span>
        </a>
        <a href="/rehber" data-nav="/rehber" class="mm-apple-link" style="--i: 3.5">
          <span>${C.lang === 'tr' ? 'Rehber & Sağlık' : 'Guides & Health'}</span>
        </a>
        <a href="/hakkimizda" data-nav="/hakkimizda" class="mm-apple-link" style="--i: 4">
          <span>${tr('nav.about')}</span>
        </a>
        <a href="/iletisim" data-nav="/iletisim" class="mm-apple-link" style="--i: 5">
          <span>${tr('nav.contact')}</span>
        </a>
      </nav>
    </div>
  </div>

  <div class="mm-footer">
    <div class="mm-apple-controls">
      <a href="/giris" id="mm-account-link" class="mm-apple-ctrl-row">
        <span class="mm-ctrl-text" style="display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="mm-acc-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span id="mm-account-text">${tr('nav.login')}</span>
        </span>
        <svg class="mm-ctrl-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </a>

      <a href="/admin" id="mm-admin-link" class="mm-apple-ctrl-row" style="display:none;">
        <span class="mm-ctrl-text" style="display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="mm-acc-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>${C.lang === 'tr' ? 'Yönetim Paneli' : 'Admin Panel'}</span>
        </span>
        <svg class="mm-ctrl-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </a>

      <button type="button" id="mm-logout-link" class="mm-apple-ctrl-row" style="display:none;">
        <span class="mm-ctrl-text" style="display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="mm-acc-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>${C.lang === 'tr' ? 'Güvenli Çıkış' : 'Sign Out'}</span>
        </span>
      </button>

      <button type="button" id="mm-lang" class="mm-apple-ctrl-row" aria-label="Dili Değiştir">
        <span class="mm-ctrl-text">${C.lang === 'tr' ? 'Dil / Language' : 'Language / Dil'}</span>
        <span class="mm-ctrl-val" style="font-weight:600;font-size:13px;color:var(--rose);">${C.lang === 'tr' ? 'English (EN)' : 'Türkçe (TR)'}</span>
      </button>

      <button type="button" id="mm-theme" class="mm-apple-ctrl-row" aria-label="Tema Değiştir">
        <span class="mm-ctrl-text">${C.lang === 'tr' ? 'Karanlık Mod' : 'Dark Mode'}</span>
        <span class="mm-switch-pill ${dark ? 'active' : ''}">
          <span class="mm-switch-knob"></span>
        </span>
      </button>

      <a class="mm-apple-ctrl-row" href="${esc(st.whatsapp)}" target="_blank" rel="noopener">
        <span class="mm-ctrl-text">${C.lang === 'tr' ? 'WhatsApp Canlı Destek' : 'WhatsApp Concierge'}</span>
        <svg class="mm-ctrl-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </a>
    </div>

    <div class="mm-badge-row" style="flex-direction: column; align-items: flex-start; gap: 6px;">
      <div style="display: flex; align-items: center; gap: 6px;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <strong style="color: var(--rose); font-weight: 600;">${C.lang === 'tr' ? 'Eskişehir İçi: ~2 Saatte Özel Kurye' : 'Eskişehir: ~2h Express Courier'}</strong>
      </div>
      <div style="display: flex; align-items: center; gap: 6px; opacity: 0.85;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>${C.lang === 'tr' ? '%100 Gizli Paketleme & Aynı Gün Kargo' : '100% Discreet Packaging & Same-Day Dispatch'}</span>
      </div>
    </div>
  </div>
</aside>
<main id="app-main">
${body}
</main>
<footer>
  <div class="foot-main">
    <div class="foot-id">
      <a href="/" class="brand foot-brand">LOVE<span class="dot">.</span></a>
      <p class="foot-desc"><b>${esc(st.storeName)}</b>${tr('foot.desc')}</p>
    </div>
    <div class="foot-nav-groups">
      <div class="foot-col">
        <h4 class="foot-col-title">${C.lang === 'en' ? 'SHOP' : 'MAĞAZA'}</h4>
        <nav class="foot-col-links">
          <a href="/magaza">${tr('foot.all')}</a>
          <a href="/rehber">${C.lang === 'en' ? 'Guides & Health' : 'Rehber & Sağlık'}</a>
        </nav>
      </div>
      <div class="foot-col">
        <h4 class="foot-col-title">${C.lang === 'en' ? 'CORPORATE' : 'KURUMSAL'}</h4>
        <nav class="foot-col-links">
          <a href="/hakkimizda">${tr('foot.about')}</a>
          <a href="/iletisim">${tr('foot.contact')}</a>
          <a href="/hakkimizda#iade">${tr('foot.returns')}</a>
          <a href="/kargo-ve-teslimat">${C.lang === 'en' ? 'Shipping & Delivery' : 'Kargo & Teslimat'}</a>
          <a href="/gizlilik-politikasi">${C.lang === 'en' ? 'Privacy Policy & KVKK' : 'Gizlilik & KVKK'}</a>
          <a href="/kullanim-kosullari">${C.lang === 'en' ? 'Terms & Distance Sales' : 'Mesafeli Satış & Şartlar'}</a>
        </nav>
      </div>
    </div>
    <div class="foot-contact">
      <a class="foot-phone" href="${esc(st.whatsapp)}" target="_blank" rel="noopener">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
        ${esc(st.supportPhone)}
      </a>
    </div>
  </div>
  <div class="foot-bottom">
    <span>© ${new Date().getFullYear()} ${esc(st.storeName)}${tr('foot.rights')}</span>
    <a href="/gizlilik-politikasi" style="color:var(--muted);font-size:12px;margin:0 6px;text-decoration:none;">${C.lang === 'en' ? 'Privacy' : 'Gizlilik'}</a>
    <span style="color:var(--line);font-size:11px;">·</span>
    <a href="/kullanim-kosullari" style="color:var(--muted);font-size:12px;margin:0 6px;text-decoration:none;">${C.lang === 'en' ? 'Terms' : 'Kullanım Koşulları'}</a>
    <span style="color:var(--line);font-size:11px;">·</span>
    <button type="button" onclick="window.showAgeGate && window.showAgeGate()" style="background:none;border:none;color:var(--muted);font-size:12px;cursor:pointer;text-decoration:underline;padding:0;margin:0 6px;" title="Doğrulama Ekranını Yeniden Göster">+18 Yaş Doğrulama</button>
    <div class="pay-chips">
      <span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
        ${tr('foot.pay.wa')}
      </span>
      <span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        ${tr('foot.pay.shop')}
      </span>
      <span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        ${tr('foot.pay.discreet')}
      </span>
    </div>
  </div>
</footer>

<!-- Apple-Grade Fullscreen Search Curtain -->
<div class="quick-search-modal" id="quick-search-modal" aria-hidden="true">
  <div class="qs-backdrop" id="qs-backdrop"></div>
  <div class="qs-curtain-container" role="dialog" aria-modal="true" aria-label="Hızlı Ürün Arama">
    <div class="qs-top-bar">
      <a href="/" class="brand qs-top-brand">LOVE<span class="dot">.</span></a>
      <button type="button" class="qs-close-btn" id="qs-close-btn" aria-label="${tr('qs.close')}" title="${tr('qs.close')}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    
    <div class="qs-main-content">
      <div class="qs-input-row">
        <input type="text" id="qs-input" inputmode="search" placeholder="${C.lang === 'en' ? 'Search' : 'Ara'}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
        <button type="button" class="qs-clear-btn" id="qs-clear-btn" style="display:none" aria-label="Temizle" title="Temizle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="qs-body" id="qs-results">
        <!-- Default Apple Quick Links or Live Products List -->
      </div>
    </div>
  </div>
</div>`}
<div id="toast-zone"></div>

<!-- Spatial Card Zoom / Morphing Canvas Modal (2026 E-Commerce Award Winner) -->
<div class="spatial-canvas-overlay" id="spatial-canvas-overlay" aria-hidden="true">
  <!-- Outer Navigation Arrows (Sonsuz Hızlı Gözat) -->
  <button type="button" class="spatial-nav-arrow spatial-outer-prev" id="spatial-outer-prev" aria-label="Önceki Ürün">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" /></svg>
  </button>
  <button type="button" class="spatial-nav-arrow spatial-outer-next" id="spatial-outer-next" aria-label="Sonraki Ürün">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
  </button>

  <div class="spatial-card-stage" id="spatial-card-stage" role="dialog" aria-modal="true" aria-label="Product Showcase">
    <!-- Populated with FLIP spring animation by shop.js -->
  </div>
</div>

<script>window.__LS_LANG__='${C.lang}';</script>
<script type="module" src="/js/shop.js?v=${appVersion}"></script>
</body>
</html>`;
}

function cleanEditorialTitle(name: string): string {
  if (!name) return '';
  let s = String(name).replace(/\s+/g, ' ').trim();
  s = s.replace(/[\s\-\–\—\:\/\|]+$/, '').trim();
  return s;
}

const productCardSSR = (p: any, tr: any) => {
  const isOut = !p.stock || p.stock <= 0;
  const displayName = cleanEditorialTitle(p.name);
  const rawNum = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: p.price % 1 ? 2 : 0 }).format(p.price);
  const priceHtml = `<span class="price"><span class="val">${rawNum}</span> <span class="cur">₺</span></span>`;
  const imgUrl = (p.image && VERCEL_BLOB_MIGRATION_MAP[p.image]) ? VERCEL_BLOB_MIGRATION_MAP[p.image] : (p.image || '');

  return `
<article class="prod-card rv vis ${isOut ? 'is-out-of-stock' : ''}" data-id="${p.id}" data-slug="${esc(p.slug)}">
  <a href="/urun/${esc(p.slug)}" class="prod-media" data-slug="${esc(p.slug)}">
    ${imgUrl ? `<img src="${esc(imgUrl)}" alt="${esc(p.name)}" width="320" height="320" loading="lazy" decoding="async">` : `<div style="width:100%;height:100%;background:transparent"></div>`}
    ${isOut ? `<div class="card-out-badge"><span>${tr('pd.stock.out') || 'Tükendi'}</span></div>` : ''}
    <div class="card-sheen"></div>
  </a>
  <div class="prod-info">
    <a href="/urun/${esc(p.slug)}" class="prod-name" title="${esc(p.name)}">${esc(displayName)}</a>
    <div class="prod-price-row">
      ${priceHtml}
      ${isOut ? `
      <span class="card-out-status-pill">${tr('pd.stock.out') || 'Tükendi'}</span>
      ` : `
      <button type="button" class="editorial-add-btn action-btn" data-add="${p.id}" title="${tr('quickadd')}" aria-label="${tr('quickadd')}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      `}
    </div>
  </div>
</article>`;
};

const featuredCardSSR = (p: any, tr: any) => {
  return productCardSSR(p, tr);
};

/* ---------------- pages ---------------- */
function pageHome(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const tr = C.t;
  const allCats = allCategories().map((c: any) => {
    const products = db.products.filter((p: any) => p.category === c.slug);
    const cover = products.find((p: any) => p.bestSeller) || products[0];
    const rawName = c.name || catNameEN(c.slug, c.slug);
    return {
      id: c.id,
      slug: c.slug,
      name: C.lang === 'en' ? catNameEN(c.slug, rawName) : rawName,
      count: products.length,
      image: c.image || (cover ? cover.image : ''),
      featuredOnHome: !!c.featuredOnHome,
      homeOrder: typeof c.homeOrder === 'number' ? c.homeOrder : 99
    };
  });
  const exactSlugs = ['vibratorler', 'realistik-dildolar', 'anal-urunler', 'erkek-ve-kadinlar', 'fetish-urunler', 'fantezi-ic-giyim', 'realistik-mankenler', 'ciftler', 'erkekler', 'kadinlar'];
  const topCats = exactSlugs.map(slug => allCats.find(c => c.slug === slug)).filter(Boolean);
  const homeRemaining = allCats.filter((c) => !topCats.some((h) => h.slug === c.slug)).sort((a, b) => b.count - a.count);
  const top = [...topCats, ...homeRemaining].slice(0, 8);
  const rest = allCats.filter((c) => !top.some((t) => t.slug === c.slug));
  const totalCount = allCats.reduce((s, c) => s + c.count, 0);
  const featured = db.products.filter((p: any) => p.featured).slice(0, 10);
  const heroProds = wheelProducts();
  const news = [...db.products].sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const reviews = db.reviews.filter((r: any) => r.approved).slice(0, 3);
  const heroJson = JSON.stringify(heroProds.map((p: any) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category
  }))).replace(/</g, '\\u003c');
  const heroFirstImg = heroProds[0]?.image || '';
  const html = `
<section class="hero">
  <div class="hero-bg"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div></div>
  <div class="hero-content">
    <h1>${tr('hero.h1')}</h1>
    <p>${tr('hero.p')}</p>
    <div class="hero-cta">
      <a href="/magaza" class="btn btn-primary">${tr('hero.cta.shop')}</a>
      <a href="/hakkimizda" class="btn btn-ghost">${tr('hero.cta.why')}</a>
    </div>
    <div class="hero-stats">
      <div><strong>${C.num(db.products.length)}+</strong><span>${tr('hero.stat1')}</span></div>
      <div><strong>${tr('hero.stat2')}</strong><span>${tr('hero.stat2.label')}</span></div>
      <div><strong>${tr('hero.stat3')}</strong><span>${tr('hero.stat3.label')}</span></div>
      <div class="hero-stat-highlight" id="hero-stat-delivery" data-tr-esk="${tr('hero.stat4')}" data-tr-esk-lbl="${tr('hero.stat4.label')}">
        <strong id="hero-stat-delivery-val">${tr('hero.stat4')}</strong>
        <span id="hero-stat-delivery-lbl">${tr('hero.stat4.label')}</span>
      </div>
    </div>
  </div>
  <div class="hero-visual">
    <div class="cf-stage" id="cf-stage" aria-label="Featured product showcase">
      <script type="application/json" id="hero-prods-data">${heroJson}</script>
    </div>
  </div>
</section>
<section class="block">
  <div class="section-head rv"><div><h2>${tr('sec.cats.h2')}</h2><p>${tr('sec.cats.p', { n: C.num(totalCount) })}</p></div><a href="/magaza" class="link-more">${tr('sec.cats.link')}</a></div>
  <div class="bento">${top.map((c, i) => {
    const nm = formatCatTitle(c.name);
    const area = ['a','b','c','i','d','e','f','h'][i] || 'a';
    return `
    <a class="bento-card bento-card-${area} rv rv-d${i + 1}" href="/magaza?kat=${c.slug}">
      <div class="bento-img-wrap"><img class="bento-bg" src="${esc(c.image)}" alt="${esc(c.name)}" width="480" height="480" loading="lazy" decoding="async"></div>
      <div class="bento-meta">
        <h3>${nm}</h3>
      </div>
    </a>`;
  }).join('')}
    <a class="bento-card bento-cta bento-card-g rv rv-d${top.length + 1}" href="/magaza">
      <span class="cta-glow" aria-hidden="true"></span>
      <span class="cta-inner">
        <h3>${tr('bcta.h3')}<span class="dot-rose">.</span></h3>
        <span class="cta-count">${tr('bcta.count', { cats: allCats.length, prods: C.num(totalCount) })}</span>
      </span>
      <span class="cta-list">${rest.slice(0, 7).map((c) => esc(c.name)).join(' · ')}${rest.length > 7 ? ' · …' : ''}</span>
    </a>
  </div>
</section>
<section class="block">
  <div class="section-head rv"><div><h2>${tr('sec.feat.h2')}</h2></div><a href="/magaza" class="link-more">${tr('sec.feat.link')}</a></div>
  <div class="prod-grid" id="featured-grid">${featured.map((p: any) => featuredCardSSR(p, tr)).join('')}</div>
</section>
<section class="block">
  <div class="banner rv">
    <h2>${tr('banner.h2')}</h2>
    <p>${tr('banner.p')}</p>
    <a href="/hakkimizda#gizlilik" class="btn btn-gold">${tr('banner.btn')}</a>
  </div>
</section>
<section class="block">
  <div class="section-head rv"><div><h2>${tr('sec.new.h2')}</h2></div><a href="/magaza?sort=yeni" class="link-more">${tr('sec.new.link')}</a></div>
  <div class="prod-grid" id="new-grid">${news.map((p: any) => productCardSSR(p, tr)).join('')}</div>
</section>
<section class="block">
  <div class="features">
    <div class="feature rv"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></div><div><h3>${tr('f1.t')}</h3><p>${tr('f1.p')}</p></div></div>
    <div class="feature rv rv-d1"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div><h3>${tr('f2.t')}</h3><p>${tr('f2.p')}</p></div></div>
    <div class="feature rv rv-d2"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg></div><div><h3>${tr('f3.t')}</h3><p>${tr('f3.p')}</p></div></div>
    <div class="feature rv rv-d3"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></div><div><h3>${tr('f4.t')}</h3><p>${tr('f4.p')}</p></div></div>
  </div>
</section>
<section class="block">
  <div class="section-head rv"><div><h2>${tr('sec.rev.h2')}</h2></div></div>
  <div class="review-grid">${reviews.map((r: any) => {
    const p = db.products.find((x: any) => x.id === r.productId);
    return `<div class="review-card rv"><div class="stars">${stars(r.rating)}</div><p>"${esc(r.text)}"</p><small>— ${esc(r.userName)} · ${esc(p ? p.name : 'Product')}</small></div>`;
  }).join('') || `<div class="empty-state"><div class="big">💬</div><p>${tr('sec.rev.empty')}</p></div>`}
  </div>
</section>
<section class="block">
  <div class="newsletter rv">
    <h2>${tr('nl.h2')}</h2>
    <p>${tr('nl.p')}</p>
    <form class="nl-form" id="nl-form">
      <input id="nl-email" type="email" aria-label="${tr('nl.ph')}" placeholder="${tr('nl.ph')}" required>
      <button class="btn btn-primary" type="submit">${tr('nl.btn')}</button>
    </form>
  </div>
</section>`;
  const homeFaqs = [
    {
      q: "Eskişehir içi kurye teslimatı ne kadar sürede ulaşır?",
      a: "Tepebaşı, Odunpazarı ve tüm Eskişehir merkez mahallelerine siparişleriniz özel gizli kuryemiz ile 2 ila 3 saat içerisinde doğrudan adresinize teslim edilir."
    },
    {
      q: "Paketlemede sipariş içeriği veya firma adı belli olur mu?",
      a: "%100 çift katlı koruyucu, dışarıdan içi görünmeyen mühürlü nötr ambalaj kullanılır. Paketin üzerinde 'erotik shop', 'seks shop' veya ürün adı yazmaz."
    },
    {
      q: "Banka ve kredi kartı ekstresinde ne yazar?",
      a: "Ödeme dökümünde cinsel sağlık veya yetişkin mağazası çağrışımı yapan hiçbir ibare yer almaz, standart nötr ticari unvan görünür."
    },
    {
      q: "Mağazadan elden teslim alabilir miyim?",
      a: "Evet. İsmet İnönü-1 Caddesi Ilgaz İş Hanı Kat:1 Daire:2 adresindeki mağazamızı ziyaret ederek ürünleri inceleyip elden teslim alabilirsiniz."
    }
  ];

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(C.lang === 'en' ? 'LOVE — Sexual Wellness & Intimacy' : 'LOVE — Modern Sexual Wellness & Cinsel Sağlık | %100 Gizli Teslimat', html, {
    description: C.lang === 'en'
      ? 'LOVE: 100% discreet packaging, anonymous payment, certified body-safe adult wellness store with express delivery across Turkey.'
      : 'LOVE: Modern Sexual Wellness & Cinsel Sağlık Platformu. Beden dostu medikal teknolojiler, masaj aletleri ve organik formüller. %100 çift mühürlü gizli paketleme, aynı gün kargo ve Eskişehir 15 yıllık köklü mağaza güvencesi.',
    faq: homeFaqs,
    preloadImages: heroFirstImg ? [heroFirstImg] : []
  }, C));
}

function pageShop(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const tr = C.t;
  const cats = allCategories();

  // Parse query parameters from request URL
  const parsedUrl = new URL(req.url || '/magaza', 'http://localhost');
  const catParam = (parsedUrl.searchParams.get('kat') || parsedUrl.searchParams.get('cat') || 'hepsi').trim();
  const sortParam = (parsedUrl.searchParams.get('sort') || 'onerilen').trim();
  const filterParam = (parsedUrl.searchParams.get('filter') || '').trim();
  const qParam = (parsedUrl.searchParams.get('q') || '').trim();
  const kw = qParam.toLowerCase();

  let prods = Array.isArray(db.products) ? [...db.products] : [];

  // Filter by category
  const isHepsi = !catParam || catParam === 'hepsi' || catParam === 'all';
  if (!isHepsi) {
    prods = prods.filter((p: any) => matchesCategory(p.category, catParam));
  }

  // Filter by keyword
  if (kw) {
    prods = prods.filter((p: any) =>
      (p.name && p.name.toLowerCase().includes(kw)) ||
      (p.description && p.description.toLowerCase().includes(kw)) ||
      (p.slug && p.slug.toLowerCase().includes(kw))
    );
  }

  // Filter by badge / type
  if (filterParam === 'bestsellers') {
    prods = prods.filter((p: any) => p.bestSeller);
  } else if (filterParam === 'new') {
    prods = prods.filter((p: any) => p.isNew);
  }

  // Sort with identical algorithm to /api/products
  switch (sortParam) {
    case 'yeni':
    case 'new':
      prods.sort((a: any, b: any) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
      break;
    case 'fiyat-artan':
      prods.sort((a: any, b: any) => a.price - b.price);
      break;
    case 'fiyat-azalan':
      prods.sort((a: any, b: any) => b.price - a.price);
      break;
    case 'puan':
      prods.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
      break;
    default:
      prods.sort((a: any, b: any) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
  }

  // Find active category for title and breadcrumbs
  const activeCat = !isHepsi ? cats.find((c: any) => matchesCategory(c.slug, catParam)) : null;
  const activeCatName = activeCat ? (C.lang === 'en' ? catNameEN(activeCat.slug, activeCat.name) : activeCat.name) : '';

  const pageHeading = activeCatName || tr('shop.title');
  const pageSub = tr('shop.desc', { n: C.num(prods.length) });

  let crumbsHtml = `<a href="/">${tr('shop.crumb.home')}</a> / <a href="/magaza">${tr('shop.title')}</a>`;
  if (activeCatName) {
    crumbsHtml += ` / ${esc(activeCatName)}`;
  }

  const initialGridHtml = prods.length
    ? `<div class="prod-grid">${prods.slice(0, 50).map((p: any) => productCardSSR(p, tr)).join('')}</div>`
    : `<div class="empty-state"><div class="big"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div><p>${tr('shop.empty')}</p></div>`;

  const html = `
<div class="page-head">
  <div class="crumbs">${crumbsHtml}</div>
  <div class="page-head-title-row">
    <h1 id="shop-page-title">${esc(pageHeading)}</h1>
    <span class="shop-results-count" id="results-count">${tr('shop.count', { n: C.num(prods.length) })}</span>
  </div>
  <p id="shop-page-sub">${pageSub}</p>
</div>
<div class="shop-layout">
  <aside class="filters" id="shop-filters-aside">
    <div class="field"><input id="shop-search" placeholder="${tr('shop.search')}" value="${esc(qParam)}"></div>
    <h4>${tr('shop.cat')}</h4>
    <div class="filter-chips" id="cat-chips">
      <button class="chip ${isHepsi ? 'on' : ''}" data-cat="hepsi">${tr('shop.all')}</button>
      ${cats.map((c: any) => {
        const isCatMatch = !isHepsi && matchesCategory(c.slug, catParam);
        const name = C.lang === 'en' ? catNameEN(c.slug, c.name) : c.name;
        return `<button class="chip ${isCatMatch ? 'on' : ''}" data-cat="${esc(c.slug)}">${esc(name)}</button>`;
      }).join('')}
    </div>
  </aside>
  <div>
    <div class="shop-toolbar">
      <div class="shop-sort-pill" id="shop-sort-pill" tabindex="0" role="button" aria-haspopup="listbox" aria-expanded="false" aria-label="${C.lang === 'en' ? 'Sort' : 'Sırala'}">
        <svg class="pill-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
        <span class="pill-text" id="sort-pill-display">${C.lang === 'en' ? 'Sort' : 'Sırala'}: <strong id="sort-active-label">${sortParam === 'yeni' || sortParam === 'new' ? tr('shop.sort.new') : sortParam === 'fiyat-artan' ? tr('shop.sort.asc') : sortParam === 'fiyat-azalan' ? tr('shop.sort.desc') : sortParam === 'puan' ? tr('shop.sort.rate') : (C.lang === 'en' ? 'Recommended' : 'Önerilen')}</strong></span>
        <svg class="pill-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        <div class="shop-sort-menu" id="shop-sort-menu" role="listbox">
          <button type="button" class="sort-menu-item ${sortParam === 'onerilen' || !sortParam ? 'active' : ''}" data-val="onerilen" role="option">
            <span>${C.lang === 'en' ? 'Recommended' : 'Önerilen'}</span>
            <svg class="sort-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
          <button type="button" class="sort-menu-item ${sortParam === 'yeni' || sortParam === 'new' ? 'active' : ''}" data-val="yeni" role="option">
            <span>${tr('shop.sort.new')}</span>
            <svg class="sort-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
          <button type="button" class="sort-menu-item ${sortParam === 'fiyat-artan' ? 'active' : ''}" data-val="fiyat-artan" role="option">
            <span>${tr('shop.sort.asc')}</span>
            <svg class="sort-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
          <button type="button" class="sort-menu-item ${sortParam === 'fiyat-azalan' ? 'active' : ''}" data-val="fiyat-azalan" role="option">
            <span>${tr('shop.sort.desc')}</span>
            <svg class="sort-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
          <button type="button" class="sort-menu-item ${sortParam === 'puan' ? 'active' : ''}" data-val="puan" role="option">
            <span>${tr('shop.sort.rate')}</span>
            <svg class="sort-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        </div>
        <select id="shop-sort" class="shop-sort-native" aria-hidden="true" tabindex="-1">
          <option value="onerilen" ${sortParam === 'onerilen' ? 'selected' : ''}>${tr('shop.sort.def')}</option>
          <option value="yeni" ${sortParam === 'yeni' || sortParam === 'new' ? 'selected' : ''}>${tr('shop.sort.new')}</option>
          <option value="fiyat-artan" ${sortParam === 'fiyat-artan' ? 'selected' : ''}>${tr('shop.sort.asc')}</option>
          <option value="fiyat-azalan" ${sortParam === 'fiyat-azalan' ? 'selected' : ''}>${tr('shop.sort.desc')}</option>
          <option value="puan" ${sortParam === 'puan' ? 'selected' : ''}>${tr('shop.sort.rate')}</option>
        </select>
      </div>
    </div>
    <div id="shop-root">${initialGridHtml}</div>
  </div>
</div>`;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  const titleStr = activeCatName
    ? `${activeCatName} — ${C.lang === 'en' ? 'Shop' : 'Seks Shop & Erotik Shop'}`
    : (C.lang === 'en' ? 'Shop' : 'Tüm Ürünler — Seks Shop & Erotik Shop');
  res.end(layout(titleStr, html, {
    description: 'Eskişehir Love Seks Shop & Erotik Shop online kataloğu. Kadın, erkek, çiftler için vücut dostu ürünler, kayganlaştırıcılar, iç giyim ve aksesuarlar.'
  }, C));
}

function pageProduct(req: http.IncomingMessage, res: http.ServerResponse, slug: string) {
  const C = pageCtx(req);
  const rawKey = decodeURIComponent(slug || '').trim().toLowerCase();
  const cleanKey = rawKey.replace(/^\/urun\//, '').replace(/\/+$/, '');
  const p = db.products.find((x: any) => {
    const s = String(x.slug || '').toLowerCase();
    const i = String(x.id || '').toLowerCase();
    return s === cleanKey || i === cleanKey || s === rawKey || i === rawKey;
  });
  const pageTitle = p ? p.name : (C.lang === 'en' ? 'Product' : 'Ürün');
  const desc = p ? (p.desc || p.name) : undefined;
  const ogImage = p ? p.image : undefined;
  const canonical = p ? `https://loveeroticshop.com/urun/${p.slug}` : undefined;
  const html = `<div id="product-root"><div class="spinner"></div></div>`;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(pageTitle, html, { product: p, description: desc, ogImage, canonical }, C));
}

function pageReviewForm(req: http.IncomingMessage, res: http.ServerResponse, slug: string) {
  const rawKey = decodeURIComponent(slug || '').trim().toLowerCase();
  const cleanKey = rawKey.replace(/^\/urun\//, '').replace(/\/+$/, '');
  const p = db.products.find((x: any) => {
    const s = String(x.slug || '').toLowerCase();
    const i = String(x.id || '').toLowerCase();
    return s === cleanKey || i === cleanKey || s === rawKey || i === rawKey;
  });
  if (!p) { res.writeHead(302, { Location: '/magaza' }); return res.end(); }
  const C = pageCtx(req);
  const tr = C.t;
  const html = `
<div class="auth-wrap"><div class="auth-card" style="max-width:520px">
  <h1>${tr('rv.title')}</h1><p class="sub">${esc(p.name)}</p>
  <form id="review-form" data-product="${p.id}" data-slug="${esc(p.slug)}">
    <div class="field"><label>${tr('rv.rating')}</label>
      <div id="stars-row" style="font-size:26px;letter-spacing:4px;color:var(--gold);cursor:pointer">
        ${[1, 2, 3, 4, 5].map((i) => `<span data-star="${i}">★</span>`).join('')}<input type="hidden" value="5">
      </div>
    </div>
    <div class="field"><label>${tr('rv.comment')}</label><textarea id="rv-text" placeholder="${tr('rv.ph')}"></textarea></div>
    <button class="btn btn-primary btn-block" type="submit">${tr('rv.submit')}</button>
  </form>
  <p class="auth-alt">${tr('rv.note')} <a href="/urun/${esc(p.slug)}">${tr('rv.back')}</a></p>
</div></div>`;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(C.lang === 'en' ? 'Write a Review' : 'Yorum Yaz', html, {}, C));
}

function pageCart(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const tr = C.t;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(tr('cart.title'), `<div class="page-head"><div class="crumbs"><a href="/">${tr('shop.crumb.home')}</a> / ${tr('cart.crumb')}</div><h1>${tr('cart.title')}</h1></div><div class="cart-layout" id="cart-root"><div class="spinner"></div></div>`, {}, C));
}

function pageCheckout(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const tr = C.t;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(tr('checkout.title'), `<div class="page-head"><div class="crumbs"><a href="/">${tr('shop.crumb.home')}</a> / <a href="/sepet">${tr('cart.crumb')}</a> / ${tr('checkout.crumb')}</div><h1>${tr('checkout.title')}</h1></div><div id="checkout-root"><div class="spinner"></div></div>`, {}, C));
}

function pageThanks(req: http.IncomingMessage, res: http.ServerResponse, id: string) {
  const st = db.settings;
  const C = pageCtx(req);
  const tr = C.t;
  const en = C.lang === 'en';
  const order = db.orders.find((o: any) => o.id === id);
  const pickup = !!(order && order.address && String(order.address.full).startsWith('MAĞAZADAN'));
  
  let lines = [];
  if (order) {
    if (en) {
      lines = [
        '✨ *Hello Love, I have a new order!*', '',
        `📦 *ORDER SUMMARY* (Order No: #${order.id})`,
        '━━━━━━━━━━━━━━━━━━'
      ];
      for (const i of order.items) lines.push(`🔹 ${i.name} (x${i.qty}) - ${fmt(i.price * i.qty)}`);
      lines.push('━━━━━━━━━━━━━━━━━━');
      if (order.shipping) lines.push(`🚚 Shipping: ${fmt(order.shipping)}`);
      if (order.discount) lines.push(`🎁 Discount: -${fmt(order.discount)}`);
      lines.push(`💰 *TOTAL: ${fmt(order.total)}*`);
      lines.push('', '👤 *CUSTOMER INFO*');
      lines.push(`*Name:* ${order.customerName}`);
      lines.push(`*Phone:* ${order.phone}`);
      if (order.address && !pickup) lines.push(`*Address:* ${order.address.full} ${order.address.city}`);
      if (order.note) lines.push(`*Note:* ${order.note}`);
      lines.push('', `💳 *Payment Method:* ${order.payment || 'Bank Transfer'}`);
      lines.push('', '_Looking forward to your reply, thanks! 🌸_');
    } else {
      lines = [
        '✨ *Merhaba Love, yeni bir sipariş vermek istiyorum!*', '',
        `📦 *SİPARİŞ ÖZETİ* (Sipariş No: #${order.id})`,
        '━━━━━━━━━━━━━━━━━━'
      ];
      for (const i of order.items) lines.push(`🔹 ${i.name} (x${i.qty}) - ${fmt(i.price * i.qty)}`);
      lines.push('━━━━━━━━━━━━━━━━━━');
      if (order.shipping) lines.push(`🚚 Kargo: ${fmt(order.shipping)}`);
      if (order.discount) lines.push(`🎁 İndirim: -${fmt(order.discount)}`);
      lines.push(`💰 *GENEL TOPLAM: ${fmt(order.total)}*`);
      lines.push('', '👤 *MÜŞTERİ BİLGİLERİ*');
      lines.push(`*İsim:* ${order.customerName}`);
      lines.push(`*Telefon:* ${order.phone}`);
      if (order.address && !pickup) lines.push(`*Adres:* ${order.address.full} ${order.address.city} ${order.address.zip}`);
      if (order.note) lines.push(`*Not:* ${order.note}`);
      lines.push('', `💳 *Ödeme Tercihi:* ${order.payment || 'Havale/EFT'}`);
      lines.push('', '_Siparişimle ilgili dönüşünüzü bekliyorum, iyi çalışmalar! 🌸_');
    }
  }

  const waLink = (st.whatsapp || 'https://wa.me/905436331325') + '?text=' + encodeURIComponent(lines.join('\n'));
  const html = `
<div class="success-wrap" id="thanks-wrap"><div class="success-card">
  <div class="success-icon" id="thanks-icon">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  </div>
  <h1 id="thanks-h1">${pickup ? tr('thanks.h.pickup') : tr('thanks.h.ship')}</h1>
  <p id="thanks-total">${order ? tr('thanks.total') + ' ' + fmt(order.total) : ''}</p>
  <p id="thanks-p">${pickup ? tr('thanks.p.pickup') : tr('thanks.p.ship')}</p>
  <div class="order-no" id="thanks-order">${esc(id)}</div>
  <a href="${esc(waLink)}" target="_blank" rel="noopener" class="btn btn-primary" id="thanks-wa-btn" style="margin-top:20px">💬 ${pickup ? tr('thanks.wa.pickup') : tr('thanks.wa.ship')}</a>
  <p style="font-size:12.5px;color:var(--muted);margin-top:8px" id="thanks-acc-info">${tr('thanks.account')}</p>
  <div style="margin-top:26px;display:flex;gap:12px;justify-content:center"><a href="/magaza" class="btn btn-ghost">${tr('thanks.continue')}</a></div>
</div></div>
<script>
  const btn = document.getElementById('thanks-wa-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        const h1 = document.getElementById('thanks-h1');
        const p = document.getElementById('thanks-p');
        const accInfo = document.getElementById('thanks-acc-info');
        if (h1) h1.textContent = '${en ? "Order Received" : "Siparişiniz Alındı"}';
        if (p) p.textContent = '${en ? "Your order details have been received. We will contact you via WhatsApp shortly." : "Sipariş detaylarınız bize ulaştı. WhatsApp üzerinden sizinle iletişime geçeceğiz."}';
        if (btn) btn.style.display = 'none';
        if (accInfo) accInfo.style.display = 'none';
      }, 800);
    });
  }
</script>
`;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(en ? 'Order Received' : 'Sipariş Alındı', html, {}, C));
}

function pageLogin(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const tr = C.t;
  const html = `
<div class="auth-wrap"><div class="auth-card">
  <h1>${tr('login.title')}</h1>
  <p class="sub">${tr('login.sub')}</p>

  <button type="button" class="btn-google" id="btn-google-login">
    <svg class="google-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
    </svg>
    <span>${tr('auth.google.login')}</span>
  </button>

  <div class="auth-divider"><span>${tr('auth.or')}</span></div>

  <form id="login-form">
    <div class="field"><label for="l-email">${tr('login.email')}</label><input id="l-email" type="email" required placeholder="e-posta@adres.com"></div>
    <div class="field"><label for="l-pass">${tr('login.pass')}</label><input id="l-pass" type="password" required placeholder="••••••••"></div>
    <button class="btn btn-primary btn-block" type="submit">${tr('login.btn')}</button>
  </form>
  <p class="auth-alt">${tr('login.alt')} <a href="/kayit">${tr('login.altLink')}</a></p>
</div></div>`;
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.end(layout(C.lang === 'en' ? 'Sign In' : 'Giriş Yap', html, {}, C));
}

function pageRegister(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const tr = C.t;
  const html = `
<div class="auth-wrap"><div class="auth-card">
  <h1>${tr('reg.title')}</h1>
  <p class="sub">${tr('reg.sub')}</p>

  <button type="button" class="btn-google" id="btn-google-reg">
    <svg class="google-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
    </svg>
    <span>${tr('auth.google.reg')}</span>
  </button>

  <div class="auth-divider"><span>${tr('auth.or')}</span></div>

  <form id="register-form">
    <div class="field"><label for="r-name">${tr('reg.name')}</label><input id="r-name" required placeholder="${C.lang === 'en' ? 'Your full name' : 'Adınız Soyadınız'}"></div>
    <div class="field"><label for="r-email">${tr('reg.email')}</label><input id="r-email" type="email" required placeholder="e-posta@adres.com"></div>
    <div class="grid-2">
      <div class="field"><label for="r-pass">${tr('reg.pass')}</label><input id="r-pass" type="password" required placeholder="${C.lang === 'en' ? 'At least 6 characters' : 'En az 6 karakter'}"></div>
      <div class="field"><label for="r-pass2">${tr('reg.pass2')}</label><input id="r-pass2" type="password" required placeholder="••••••••"></div>
    </div>
    <div class="checkbox-row" style="margin-bottom:18px"><input type="checkbox" id="r-age"><label for="r-age">${tr('reg.age')}</label></div>
    <button class="btn btn-primary btn-block" type="submit">${tr('reg.btn')}</button>
  </form>
  <p class="auth-alt">${tr('reg.alt')} <a href="/giris">${tr('reg.altLink')}</a></p>
</div></div>`;
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.end(layout(C.lang === 'en' ? 'Register' : 'Kayıt Ol', html, {}, C));
}

function pageAccount(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const tr = C.t;
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.end(layout(tr('account.title'), `<div class="page-head"><div class="crumbs"><a href="/">${tr('shop.crumb.home')}</a> / ${tr('nav.account')}</div><h1>${tr('account.title')}</h1></div><div class="acc-layout" id="account-root"><div class="spinner"></div></div>`, {}, C));
}

function pageProfile(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const tr = C.t;
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.end(layout(tr('profile.title'), `<div class="page-head"><div class="crumbs"><a href="/">${tr('shop.crumb.home')}</a> / <a href="/hesap">${tr('account.title')}</a> / ${tr('profile.title')}</div><h1>${tr('profile.title')}</h1></div><div class="acc-layout" id="profile-root"><div class="spinner"></div></div>`, {}, C));
}


/* ---------------- EEAT Guide Pages ---------------- */
function pageGuides(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const guides = GUIDES;
  const html = `
<div class="rich">
  <div class="guide-breadcrumbs">
    <a href="/">Ana Sayfa</a> <span>/</span> <span class="current">Rehber & Cinsel Sağlık</span>
  </div>
  <h1 style="font-family:var(--font-display);font-size:clamp(30px,4vw,52px);line-height:1.1;margin:16px 0 16px;">Rehber & Cinsel Sağlık</h1>
  <p style="font-size:16px;line-height:1.7;max-width:700px;color:var(--muted)">Eskişehir Love Shop uzmanları tarafından hazırlanan; doğru ürün seçimi, medikal standartlar, geciktirici ve kayganlaştırıcı rehberleri, gizli paketleme ve ürün hijyeni hakkında kapsamlı makaleler.</p>

  <div class="guide-grid">
    ${guides.map(g => `
      <a href="/rehber/${g.slug}" class="guide-card">
        <div>
          <span class="guide-card-tag">${esc(g.category)}</span>
          <h2 class="guide-card-title">${esc(g.title)}</h2>
          <p class="guide-card-desc">${esc(g.summary)}</p>
        </div>
        <div class="guide-card-meta">
          <span>${esc(g.readTime)} · ${g.date}</span>
          <span class="guide-card-arrow">
            Rehberi Oku
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </span>
        </div>
      </a>
    `).join('')}
  </div>

  <div class="banner rv" style="margin-top:40px;text-align:center;position:relative;z-index:1;isolation:isolate;">
    <h2 style="margin:0 auto;position:relative;z-index:2;">Eskişehir İçi 2-3 Saatte Kapınızda</h2>
    <p style="margin:14px auto 28px;position:relative;z-index:2;color:var(--muted)">Aklınıza takılan tüm sorular için WhatsApp danışma hattımızdan %100 gizlilik garantisiyle bilgi alabilirsiniz.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative;z-index:10;">
      <a href="/magaza" class="btn btn-primary" style="cursor:pointer;position:relative;z-index:10;font-weight:600;">Tüm Orijinal Ürünler</a>
      <a href="${esc(db.settings.whatsapp || 'https://wa.me/905436331325')}" target="_blank" rel="noopener noreferrer" class="btn btn-wa" style="cursor:pointer;position:relative;z-index:10;font-weight:600;">WhatsApp Danışma Hattı</a>
    </div>
  </div>
</div>`;

  const faqs = guides.flatMap(g => g.faqs).slice(0, 5);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout('Rehber & Cinsel Sağlık — Uzman Bilgi ve Gizli Teslimat', html, {
    description: "Eskişehir cinsel sağlık ve yetişkin ürünleri rehberi. Geciktirici kullanımı, kayganlaştırıcı seçimi, gizli paketleme ve hijyen standartları.",
    breadcrumbs: [
      { name: 'Ana Sayfa', url: 'https://loveeroticshop.com/' },
      { name: 'Rehber & Cinsel Sağlık', url: 'https://loveeroticshop.com/rehber' }
    ],
    faq: faqs
  }, C));
}

function pageGuideDetail(req: http.IncomingMessage, res: http.ServerResponse, slug: string) {
  const C = pageCtx(req);
  const tr = C.t;
  const guide = GUIDES.find(g => g.slug === slug);
  if (!guide) {
    res.writeHead(302, { Location: '/rehber' });
    return res.end();
  }

  // Recommended products matching guide topics
  const allProds = db.products || [];
  let recommendedProducts: any[] = [];
  if (guide.productSlugs && guide.productSlugs.length > 0) {
    recommendedProducts = guide.productSlugs
      .map(ps => allProds.find((p: any) => p.slug === ps))
      .filter(Boolean);
  }
  // Fallback if needed to guarantee at least 2 curated products
  if (recommendedProducts.length < 2) {
    const fallbackProds = allProds.filter((p: any) => {
      const name = (p.name || '').toLowerCase();
      return name.includes('vibratör') || name.includes('jel') || name.includes('lelo') || name.includes('flovetta');
    }).slice(0, 3);
    for (const fp of fallbackProds) {
      if (!recommendedProducts.some(rp => rp.id === fp.id) && recommendedProducts.length < 3) {
        recommendedProducts.push(fp);
      }
    }
  }

  const recProdsCardsHtml = recommendedProducts.map(p => productCardSSR(p, tr)).join('\n');

  const html = `
<div class="rich">
  <div class="guide-breadcrumbs">
    <a href="/">Ana Sayfa</a> <span>/</span> <a href="/rehber">Rehber</a> <span>/</span> <span class="current">${esc(guide.title)}</span>
  </div>

  <div class="guide-meta-pill">${esc(guide.category)} &bull; ${esc(guide.readTime)}</div>

  <h1 style="font-family:var(--font-display);font-size:clamp(28px,3.8vw,46px);line-height:1.15;margin:8px 0 20px;">${esc(guide.title)}</h1>

  <div class="guide-author-badge">
    <div class="guide-author-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    </div>
    <div>
      <div style="color:var(--text);font-weight:600;">Love. Sağlık ve Ürün Standartları Masası</div>
      <div style="font-size:12px;">Medikal İçerik ve Yerel Teslimat Denetimi &bull; Güncelleme: ${guide.date}</div>
    </div>
  </div>

  <div class="guide-body" style="font-size:15.5px;line-height:1.75;">
    ${guide.contentHtml}
  </div>

  ${guide.tags && guide.tags.length > 0 ? `
    <div class="guide-tags-row">
      ${guide.tags.map(t => `<span class="guide-tag">#${esc(t)}</span>`).join('')}
    </div>
  ` : ''}

  ${recommendedProducts.length > 0 ? `
    <section class="guide-recommended-section">
      <div class="guide-rec-head">
        <div>
          <h2 class="guide-rec-title">${C.lang === 'en' ? 'Featured &amp; Recommended Products' : 'Rehberde Önerilen ve İncelenen Ürünler'}</h2>
          <p class="guide-rec-sub">${C.lang === 'en' ? 'Authentic, body-safe sexual wellness products mentioned in this clinical guide.' : 'Bu makalede incelenen, %100 orijinal ve medikal standartlara uygun seçkin modeller.'}</p>
        </div>
        <a href="/magaza" class="link-more" style="font-weight:600;font-size:13px;">${C.lang === 'en' ? 'View Catalog →' : 'Tüm Kataloğu İncele →'}</a>
      </div>
      <div class="prod-grid">
        ${recProdsCardsHtml}
      </div>
    </section>
  ` : ''}

  ${guide.faqs && guide.faqs.length > 0 ? `
    <div class="guide-faq-section">
      <h2 style="font-family:var(--font-display);margin-bottom:16px;">Sıkça Sorulan Sorular</h2>
      ${guide.faqs.map(f => `
        <div class="guide-faq-item">
          <h3 class="guide-faq-q">${esc(f.q)}</h3>
          <p class="guide-faq-a">${esc(f.a)}</p>
        </div>
      `).join('')}
    </div>
  ` : ''}

  <div class="banner rv" style="margin-top:44px;text-align:center;position:relative;z-index:1;isolation:isolate;">
    <h2 style="margin:0 auto;position:relative;z-index:2;">Orijinal ve Güvenilir Ürünleri Keşfedin</h2>
    <p style="margin:14px auto 28px;position:relative;z-index:2;color:var(--muted)">Eskişehir içi 2-3 saatte özel kurye veya tüm Türkiye'ye %100 gizli kargo ile sipariş verin.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative;z-index:10;">
      <a href="/magaza" class="btn btn-primary" style="cursor:pointer;position:relative;z-index:10;font-weight:600;">Kataloğu İncele</a>
      <a href="${esc(db.settings.whatsapp || 'https://wa.me/905436331325')}" target="_blank" rel="noopener noreferrer" class="btn btn-wa" style="cursor:pointer;position:relative;z-index:10;font-weight:600;">WhatsApp Sipariş & Destek</a>
    </div>
  </div>
</div>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(`${guide.title} — Love Rehber`, html, {
    description: guide.summary,
    canonical: `https://loveeroticshop.com/rehber/${guide.slug}`,
    breadcrumbs: [
      { name: 'Ana Sayfa', url: 'https://loveeroticshop.com/' },
      { name: 'Rehber', url: 'https://loveeroticshop.com/rehber' },
      { name: guide.title, url: `https://loveeroticshop.com/rehber/${guide.slug}` }
    ],
    article: guide,
    faq: guide.faqs
  }, C));
}

function pageShippingAndDelivery(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const tr = C.t;
  const st = db.settings;

  const html = `
<div class="shipping-page">
  <div class="shipping-hero rv">
    <h1 class="shipping-h1">${C.lang === 'en' ? 'Shipping, Discretion & Turkey Delivery Times' : 'Kargo, Gizlilik ve Türkiye Geneli Teslimat Süreleri'}</h1>
    <p class="shipping-lead">
      ${C.lang === 'en' 
        ? 'All orders are dispatched in 100% opaque, double-sealed neutral packaging with zero external branding. Enjoy fast express delivery across all 81 provinces in Turkey, backed by our 256-bit SSL anonymous billing guarantee.'
        : 'Tüm siparişleriniz, dışarıdan içeriği kesinlikle anlaşılamayan çift katlı mühürlü nötr ambalajlarla hazırlanır. Saat 16:30\'a kadar verilen siparişler aynı gün kargoya teslim edilir; 256-bit SSL gizli ekstre güvencesiyle Türkiye\'nin 81 iline hızla ulaştırılır.'}
    </p>

    <div class="shipping-pill-row">
      <div class="shipping-pill">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>16:30'a Kadar Aynı Gün Sevkiyat</span>
      </div>
      <div class="shipping-pill">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>%100 Çift Katlı Gizli Paketleme</span>
      </div>
      <div class="shipping-pill">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/></svg>
        <span>Kargo Şubesinden veya Otomattan Teslim</span>
      </div>
    </div>
  </div>

  <!-- Regional Logistics Table -->
  <section class="shipping-section rv">
    <div class="shipping-section-head">
      <h2 class="shipping-section-title">${C.lang === 'en' ? 'Regional Logistics & Estimated Delivery Table' : 'Bölgesel Lojistik & Tahmini Teslimat Tablosu'}</h2>
      <p class="shipping-section-desc">${C.lang === 'en' ? 'Central dispatch from our certified warehouse. Direct partner networks with Yurtiçi, Aras, and MNG Express.' : 'Eskişehir ana transfer depomuzdan Türkiye geneline doğrudan çıkış. Yurtiçi Kargo, MNG ve Aras Kargo entegrasyonu ile kapıda veya şubede teslim.'}</p>
    </div>

    <div class="shipping-table-container">
      <table class="shipping-table">
        <thead>
          <tr>
            <th style="width: 28%;">${C.lang === 'en' ? 'Region / Hub' : 'Bölge / Kapsam'}</th>
            <th style="width: 32%;">${C.lang === 'en' ? 'Covered Cities' : 'Başlıca İller'}</th>
            <th style="width: 18%;">${C.lang === 'en' ? 'Transit Time' : 'Teslimat Süresi'}</th>
            <th style="width: 22%;">${C.lang === 'en' ? 'Carrier Method' : 'Gönderim Yöntemi'}</th>
          </tr>
        </thead>
        <tbody>
          ${SHIPPING_REGIONS.map(r => `
          <tr class="${r.region.includes('Eskişehir') ? 'highlight-eskisehir' : ''}">
            <td>
              <strong>${esc(r.region)}</strong>
              <div class="shipping-table-sub">${esc(r.notes)}</div>
            </td>
            <td>${esc(r.cities)}</td>
            <td>
              <span class="shipping-time-tag">${esc(r.duration)}</span>
            </td>
            <td>
              <span>${esc(r.method)}</span>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <!-- Eskişehir Hub Callout -->
    <div class="shipping-hub-card rv">
      <div class="shipping-hub-content">
        <h3 class="shipping-hub-title">Eskişehir'de Misiniz? 2-3 Saatte Özel Gizli Kurye & Elden Mağazadan Teslim</h3>
        <p class="shipping-hub-desc">
          Tepebaşı, Odunpazarı ve merkez ilçelere kendi özel saha kuryemizle 2 ila 3 saat içinde kapıda mühürlü nötr kutu teslimatı sunuyoruz. Ayrıca İsmet İnönü Tramvay Durağı karşısındaki Ilgaz İş Hanı Kat:1 mağazamızı ziyaret ederek randevusuz elden teslim alabilirsiniz.
        </p>
      </div>
      <div class="shipping-hub-action">
        <a href="/sehir/eskisehir" class="btn btn-primary" style="white-space:nowrap;">Eskişehir Mağazamızı İnceleyin →</a>
      </div>
    </div>
  </section>

  <!-- 5-Step Discretion Protocol -->
  <section class="shipping-section rv" id="gizlilik-protokolu">
    <div class="shipping-section-head">
      <h2 class="shipping-section-title">${C.lang === 'en' ? '5-Step Discretion & Anonymity Charter' : '5 Aşamalı %100 Gizlilik ve Güvenlik Protokolü'}</h2>
      <p class="shipping-section-desc">${C.lang === 'en' ? 'From package preparation to payment statement, your absolute privacy is guaranteed.' : 'Siparişin paketlenmesinden kargo etiketine ve banka ekstresine kadar gizliliğiniz tavizsiz şekilde korunur.'}</p>
    </div>

    <div class="shipping-steps-grid">
      ${PACKAGING_STEPS.map(s => `
      <div class="shipping-step-card">
        <span class="shipping-step-num">Aşama 0${s.step}</span>
        <h3 class="shipping-step-title">${esc(s.title)}</h3>
        <p class="shipping-step-desc">${esc(s.desc)}</p>
      </div>`).join('')}
    </div>
  </section>

  <!-- Shipping FAQs -->
  <section class="shipping-section rv">
    <div class="shipping-section-head">
      <h2 class="shipping-section-title">${C.lang === 'en' ? 'Frequently Asked Questions' : 'Kargo ve Teslimat Hakkında Sıkça Sorulanlar'}</h2>
      <p class="shipping-section-desc">${C.lang === 'en' ? 'Clear answers to the most common delivery and privacy questions.' : 'Paketleme, teslimat adresleri ve ödeme güvenliği hakkında merak edilenler.'}</p>
    </div>

    <div class="city-faqs-container">
      ${SHIPPING_FAQS.map((f, i) => `
      <details class="city-faq-item"${i === 0 ? ' open' : ''}>
        <summary class="city-faq-summary">
          <span class="city-faq-q">${esc(f.q)}</span>
          <span class="city-faq-chevron" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </summary>
        <div class="city-faq-body">
          <p>${esc(f.a)}</p>
        </div>
      </details>`).join('')}
    </div>
  </section>

  <!-- CTA Banner -->
  <div class="banner rv" style="margin-top:40px;text-align:center;position:relative;z-index:1;isolation:isolate;">
    <h2 style="margin:0 auto;position:relative;z-index:2;">${C.lang === 'en' ? 'Explore Certified Wellness Collection' : 'Beden Dostu & Orijinal Ürünleri Keşfedin'}</h2>
    <p style="margin:14px auto 28px;position:relative;z-index:2;color:var(--muted)">Tüm Türkiye'ye aynı gün kargo ve %100 çift mühürlü nötr paket güvencesiyle sipariş verin.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative;z-index:10;">
      <a href="/magaza" class="btn btn-primary" style="cursor:pointer;position:relative;z-index:10;font-weight:600;">Kataloğu İncele</a>
      <a href="${esc(st.whatsapp || 'https://wa.me/905436331325')}" target="_blank" rel="noopener noreferrer" class="btn btn-wa" style="cursor:pointer;position:relative;z-index:10;font-weight:600;">Gizli WhatsApp Danışma</a>
    </div>
  </div>
</div>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(
    C.lang === 'en' ? 'Shipping, Discretion & Delivery Times — LOVE' : 'Kargo, Gizlilik ve Teslimat Süreleri — LOVE Cinsel Sağlık',
    html,
    {
      description: 'Türkiye geneli 24 saatte hızlı teslimat ve %100 çift katlı mühürlü gizli paketleme. Şubeden anonim teslimat, ekstre gizliliği ve bölgesel kargo süreleri tablosu.',
      canonical: 'https://loveeroticshop.com/kargo-ve-teslimat',
      breadcrumbs: [
        { name: 'Ana Sayfa', url: 'https://loveeroticshop.com/' },
        { name: 'Kargo ve Teslimat', url: 'https://loveeroticshop.com/kargo-ve-teslimat' }
      ],
      faq: SHIPPING_FAQS
    },
    C
  ));
}

function pageCityLanding(req: http.IncomingMessage, res: http.ServerResponse, citySlug: string) {
  // Google Doorway Page Protection: Only the genuine physical Eskişehir store is kept as a city landing.
  // Other virtual city requests are permanently redirected (301) to the authoritative /kargo-ve-teslimat page.
  if (citySlug !== 'eskisehir') {
    res.writeHead(301, { Location: '/kargo-ve-teslimat' });
    return res.end();
  }

  const city = CITIES[0] || ESKISEHIR_STORE;
  const C = pageCtx(req);
  const tr = C.t;
  const st = db.settings;

  // Curated showcase products: Strictly sexual wellness & intimate body care
  const excludedKeywords = ['kelepçe', 'maske', 'fetiş', 'fetish', 'manken', 'doll', 'vajina', 'mastürbatör', 'suni', 'kalça', 'peluş', 'dildo'];
  const allProds = db.products || [];
  
  const wellnessProds = allProds.filter((p: any) => {
    const nameLower = (p.name || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    if (cat === 'fetish-urunler' || cat === 'realistik-mankenler' || cat === 'realistik-dildolar') return false;
    if (excludedKeywords.some(kw => nameLower.includes(kw))) return false;
    
    const isTarget = cat === 'vibratorler' || cat === 'kadinlar' || cat === 'ciftler' ||
                     nameLower.includes('vibratör') || nameLower.includes('uyarıcı') ||
                     nameLower.includes('jel') || nameLower.includes('damla') ||
                     nameLower.includes('lube') || nameLower.includes('lelo') ||
                     nameLower.includes('flovetta') || nameLower.includes('floretta') ||
                     nameLower.includes('g-spot') || nameLower.includes('wand');
    return isTarget;
  });

  const curated = [...wellnessProds].sort((a: any, b: any) => {
    const aL = (a.name || '').toLowerCase().includes('lelo') ? 1 : 0;
    const bL = (b.name || '').toLowerCase().includes('lelo') ? 1 : 0;
    if (bL !== aL) return bL - aL;
    const aFeat = (a.featured || a.bestSeller) ? 1 : 0;
    const bFeat = (b.featured || b.bestSeller) ? 1 : 0;
    return bFeat - aFeat;
  }).slice(0, 10);

  const benefitIcons = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`
  ];

  const prodCardsHtml = curated.map((p: any) => productCardSSR(p, tr)).join('\n');

  const html = `
<div class="city-landing">
  <!-- City Hero (Eskişehir Authentic Physical Store & Central Logistics Hub) -->
  <section class="block city-hero rv">
    <div class="city-hero-inner">
      <h1 class="city-hero-h1"><span class="city-hero-title-main">Eskişehir Sexual Wellness &amp;</span> <span class="city-hero-title-sub"><em class="city-italic">15 Yıllık Köklü Mağaza</em></span></h1>
      <p class="city-hero-lead">${esc(city.heroSub)}</p>
      
      <div class="city-hero-cta">
        <a href="/magaza" class="btn btn-primary">${C.lang === 'en' ? 'Explore Collection' : 'Kataloğu Keşfet'}</a>
        <a href="${esc(st.whatsapp || 'https://wa.me/905436331325')}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
          ${C.lang === 'en' ? 'Discreet WhatsApp Inquiry' : 'Gizli Kurye / WhatsApp Sipariş'}
        </a>
      </div>

      <div class="city-metrics-bar">
        <div class="city-metric-item">
          <strong>2-3 Saatte Kurye</strong>
          <span>Tepebaşı & Odunpazarı Özel Kurye</span>
        </div>
        <div class="city-metric-item">
          <strong>Mağazadan Teslim</strong>
          <span>İsmet İnönü Tramvay Durağı Karşısı</span>
        </div>
        <div class="city-metric-item">
          <strong>15 Yıllık Güven</strong>
          <span>2012'den Beri Aynı Adreste Kesintisiz</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Curated Sexual Wellness Showcase -->
  <section class="block rv">
    <div class="section-head">
      <div>
        <h2>Seçkin Sexual Wellness <em class="city-italic">Koleksiyonu</em></h2>
        <p>Eskişehir mağazamızda fiziki olarak stokta bulunan, doğrudan elden teslim alabileceğiniz veya kuryemizle 2-3 saatte kapınıza gelecek medikal sertifikalı ürünler.</p>
      </div>
      <a href="/magaza" class="link-more">${C.lang === 'en' ? 'View All' : 'Tümünü Gör'}</a>
    </div>
    <div class="prod-grid">
      ${prodCardsHtml}
    </div>
  </section>

  <!-- Logistics & Discretion Protocol -->
  <section class="block city-protocol-section rv">
    <div class="section-head">
      <div>
        <h2>Eskişehir İçi Hızlı Lojistik ve <em class="city-italic">Mağaza Bilgileri</em></h2>
        <p>${esc(city.logisticsDetail)}</p>
      </div>
    </div>
    
    <div class="features">
      ${city.keyBenefits.map((b: any, idx: number) => `
      <div class="feature rv rv-d${idx}">
        <div class="fi">${benefitIcons[idx] || benefitIcons[0]}</div>
        <div>
          <h3>${esc(b.title)}</h3>
          <p>${esc(b.desc)}</p>
        </div>
      </div>`).join('')}
    </div>

    <!-- Supported Districts -->
    <div class="city-districts-box">
      <div class="city-districts-header">
        <h3 class="city-districts-title">Eskişehir Kurye Kapsamındaki Başlıca Semtler</h3>
        <span class="city-districts-note">Özel saha kuryemiz ile aynı gün 2-3 saatte adreste</span>
      </div>
      <div class="city-districts-tags">
        ${city.districts.map((d: string) => `<span class="city-district-tag">${esc(d)}</span>`).join('')}
      </div>
    </div>
  </section>

  <!-- Store Location Map & Address Details -->
  <section class="block rv" style="background:var(--bg-card);border:1px solid var(--line);border-radius:var(--r-md);padding:28px;">
    <div class="section-head" style="margin-bottom:20px;">
      <div>
        <h2>Fiziksel Mağazamız ve <em class="city-italic">Adres Tarifi</em></h2>
        <p>İsmet İnönü-1 Cd. No:52/2 Ilgaz İş Hanı Kat:1 Daire:2 (İsmet İnönü Tramvay Durağı Tam Karşısı, Watsons &amp; Yves Rocher Yanı) Tepebaşı / Eskişehir</p>
      </div>
    </div>
    <iframe src="https://www.google.com/maps?q=${esc(st.mapsQuery || '39.7767,30.5206')}&output=embed" style="width:100%;height:320px;border:1px solid var(--line);border-radius:var(--r-md)" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" title="Love Sex Shop Eskişehir Mağazası"></iframe>
    <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap">
      <a href="https://www.google.com/maps/search/?api=1&query=${esc(st.mapsQuery || '39.7767,30.5206')}" target="_blank" rel="noopener" class="btn btn-primary">Google Haritalarda Aç</a>
      <a href="${esc(st.whatsapp || 'https://wa.me/905436331325')}" target="_blank" rel="noopener" class="btn btn-ghost">Kurye Çağır / Konum İste</a>
    </div>
  </section>

  <!-- City FAQs -->
  <section class="block city-faq-section rv">
    <div class="section-head">
      <div>
        <h2>Sıkça Sorulan <em class="city-italic">Sorular</em></h2>
        <p>Eskişehir kurye teslimatı, mağazadan elden teslim alma ve gizlilik süreci hakkında merak edilenler.</p>
      </div>
    </div>
    <div class="city-faqs-container">
      ${city.faqs.map((f: any, i: number) => `
      <details class="city-faq-item"${i === 0 ? ' open' : ''}>
        <summary class="city-faq-summary">
          <span class="city-faq-q">${esc(f.q)}</span>
          <span class="city-faq-chevron" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </summary>
        <div class="city-faq-body">
          <p>${esc(f.a)}</p>
        </div>
      </details>`).join('')}
    </div>
  </section>

  <!-- Turkey Wide Shipping Link -->
  <section class="block city-switch-section rv" style="text-align:center;padding:32px 24px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--bg-alt, rgba(255,255,255,0.02));">
    <h3 style="font-family:var(--font-display);font-size:20px;font-weight:650;margin:0 0 10px;">Farklı Bir Şehirde Misiniz?</h3>
    <p style="font-size:14.5px;color:var(--muted);max-width:600px;margin:0 auto 20px;">
      İstanbul, Ankara, İzmir, Bursa, Antalya ve tüm Türkiye'ye 24 saatte hızlı teslimat ve %100 gizli kargo sürelerimizi inceleyin.
    </p>
    <a href="/kargo-ve-teslimat" class="btn btn-primary">Türkiye Geneli Kargo ve Teslimat Süreleri →</a>
  </section>
</div>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(city.metaTitle, html, {
    description: city.metaDesc,
    canonical: `https://loveeroticshop.com/sehir/eskisehir`,
    breadcrumbs: [
      { name: 'Ana Sayfa', url: 'https://loveeroticshop.com/' },
      { name: 'Eskişehir Mağazamız', url: 'https://loveeroticshop.com/sehir/eskisehir' }
    ],
    faq: city.faqs,
    includeStoreSchema: true
  }, C));
}

function pageAbout(req: http.IncomingMessage, res: http.ServerResponse) {
  const st = db.settings;
  const C = pageCtx(req);
  const tr = C.t;
  const html = `
<div class="rich rich-about">
  <h1 style="font-family:'Outfit',sans-serif !important;font-size:clamp(32px,4.5vw,56px);font-weight:700;line-height:1.15;letter-spacing:-0.6px;margin-bottom:28px;">${tr('about.h1')}</h1>
  <p style="font-size:17px;line-height:1.65;color:var(--text);margin-bottom:16px;">${tr('about.p1')}</p>
  <p style="font-size:16px;line-height:1.65;margin-bottom:16px;">${tr('about.p2')}</p>
  <p style="font-size:16px;line-height:1.65;margin-bottom:34px;">${tr('about.p3')}</p>
  <h2 id="gizlilik">${tr('about.priv.h')}</h2>
  <p>${tr('about.priv.p')}</p>
  <p>${tr('about.priv.list')}</p>
  <h2 id="iade">${tr('about.ret.h')}</h2>
  <p>${tr('about.ret.p')}</p>
  <p>${tr('about.ret.list')}</p>
  <h2 id="teslimat">${C.lang === 'tr' ? 'Eskişehir İçi ~2 Saatte Özel Kurye & Kargo Standartları' : 'Eskişehir 2h Express Courier & Delivery Standards'}</h2>
  <p>${C.lang === 'tr' 
    ? 'Eskişehir merkezli 14 yıllık köklü yapımız sayesinde, internetten sipariş verip günlerce kargo bekleme devrine son veriyoruz. Şehir içindeki siparişleriniz doğrudan İsmet İnönü Caddesi\'ndeki fiziksel depomuzdan hazırlanarak yola çıkar:'
    : 'Thanks to our 14-year established presence in Eskişehir, you never have to wait days for standard delivery. Local orders dispatch directly from our central depot on İsmet İnönü Street:'}</p>
  <p>${C.lang === 'tr'
    ? '• <b>Eskişehir İçi Özel Kurye (~2 Saat):</b> Tepebaşı, Odunpazarı, Batıkent, Yenibağlar, Vişnelik ve çevre semtlere mesafeye bağlı olarak ortalama 2 saatte doğrudan adrese gizli teslimat.<br>• <b>Kuryede Sıfır Etiket & Tam Mahremiyet:</b> Kurye teslimatı tamamen sivil kıyafetli personel ile logosuz, nötr siyah/kraft ambalajda gerçekleştirilir. Paketin dışından içeriğe dair en ufak bir emare anlaşılmaz.<br>• <b>Mağazadan Randevulu / Doğrudan Teslim Al:</b> Dilerseniz siparişinizi web sitemizden oluşturup, İsmet İnönü Tramvay Durağı karşısındaki Ilgaz İş Hanı kat mağazamızdan kimliğinizi veya sipariş numaranızı belirterek saniyeler içinde teslim alabilirsiniz.<br>• <b>Tüm Türkiye\'ye Aynı Gün Kargo:</b> Eskişehir dışındaki 80 ile saat 16:30\'a kadar verilen tüm siparişler aynı gün nötr kutulu ve kurumsal irsaliyeli olarak kargoya verilir.'
    : '• <b>Eskişehir Express Local Courier (~2 Hours):</b> Fast delivery across Tepebaşı, Odunpazarı, Batıkent and surrounding districts in approximately 2 hours.<br>• <b>Complete Discretion:</b> Unbranded plain parcels, plain-clothed couriers, absolute discretion.<br>• <b>In-Store Pickup:</b> You can also order online and collect discreetly in minutes from our central store facing İsmet İnönü Tram Stop.<br>• <b>Same-Day Nationwide Shipping:</b> Orders across Turkey placed by 16:30 dispatch the same day in neutral security boxes.'}</p>
  <h2>${tr('about.val.h')}</h2>
  <div class="value-grid">
    <div class="feature"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></div><h3>${tr('about.v1.t')}</h3><p>${tr('about.v1.p')}</p></div>
    <div class="feature"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg></div><h3>${tr('about.v2.t')}</h3><p>${tr('about.v2.p')}</p></div>
    <div class="feature"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="7"/><circle cx="15" cy="15" r="7"/></svg></div><h3>${tr('about.v3.t')}</h3><p>${tr('about.v3.p')}</p></div>
  </div>
  <div class="banner rv" style="margin-top:40px;text-align:center;position:relative;z-index:1;isolation:isolate;">
    <h2 style="margin:0 auto;position:relative;z-index:2;">${tr('about.cta.h')}</h2>
    <p style="margin:14px auto 28px;position:relative;z-index:2;">${esc(st.supportEmail)} · ${esc(st.supportPhone)}</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative;z-index:10;">
      <a href="${esc(st.whatsapp || 'https://wa.me/905436331325')}" target="_blank" rel="noopener noreferrer" data-external="true" class="btn btn-wa" style="cursor:pointer;position:relative;z-index:10;font-weight:600;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0 1"/></svg>
        ${C.lang === 'en' ? 'Chat on WhatsApp' : 'WhatsApp\'tan Yaz'}
      </a>
      <a href="tel:${st.supportPhone ? st.supportPhone.replace(/[^0-9+]/g, '') : '+905436331325'}" data-external="true" class="btn btn-primary" style="cursor:pointer;position:relative;z-index:10;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        ${C.lang === 'en' ? 'Call Now' : 'Hemen Ara'}
      </a>
    </div>
  </div>
</div>`;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(C.lang === 'en' ? 'About Us' : 'Hakkımızda — Eskişehir Love Seks & Erotik Shop', html, {
    description: C.lang === 'en' ? 'Love Shop: 14 years at the same address in Eskişehir, delivering over 5,000 orders with 100% discretion and body-safe certified products.' : 'Love Shop: 2012\'den bu yana 14 yıldır Eskişehir\'deki aynı fiziksel adresinde, 5.000\'i aşkın müşterisine %100 gizlilik ve güvenle hizmet veren köklü mağaza.'
  }, C));
}


function pagePrivacy(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const st = db.settings;
  const title = C.lang === 'en' ? 'Privacy Policy & KVKK Statement' : 'Gizlilik Politikası ve KVKK Aydınlatma Metni';
  const html = getPrivacyPolicyHtml(C, st);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(title, html, {
    description: C.lang === 'en'
      ? 'Official Privacy Policy and Personal Data Protection (KVKK Law No. 6698) clarification statement for loveeroticshop.com. Review data retention, data subject statutory rights, and our 100% neutral packaging commitment.'
      : 'loveeroticshop.com 6698 Sayılı KVKK ve tüketici mevzuatına uygun resmi Gizlilik Politikası ve Aydınlatma Metni. Kişisel verilerin korunması, çerez tercihleri ve %100 gizli paketleme güvencemiz.'
  }, C));
}

function pageTerms(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const st = db.settings;
  const title = C.lang === 'en' ? 'Terms of Service & Distance Sales Contract' : 'Kullanım Koşulları ve Mesafeli Satış Sözleşmesi';
  const html = getTermsOfServiceHtml(C, st);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(title, html, {
    description: C.lang === 'en'
      ? 'Statutory Distance Sales Contract and Terms of Service pursuant to Turkish Law No. 6502 and the Regulation on Distance Contracts. Essential terms on +18 age representation and hygiene return exceptions.'
      : 'loveeroticshop.com 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği\'ne uygun yasal Mesafeli Satış Sözleşmesi, +18 yaş beyanı ve hijyen iade istisnaları.'
  }, C));
}

function pageContact(req: http.IncomingMessage, res: http.ServerResponse) {
  const st = db.settings;
  const C = pageCtx(req);
  const tr = C.t;
  const html = `
<div class="rich">
  <h2 style="font-family:var(--font-display);font-size:clamp(30px,4vw,52px);line-height:1.1;margin-top:0">${tr('contact.h1')}</h2>
  <p>${tr('contact.p')}</p>
  <div class="contact-cards" style="margin-top:30px">
    <div class="feature"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg></div><div><h3>${tr('contact.wa.t')}</h3><p><a href="${esc(st.whatsapp)}" target="_blank" rel="noopener" style="color:var(--rose);font-weight:600">+90 543 633 13 25</a><br><span class="muted" style="font-size:12px">${tr('contact.wa.s')}</span></p></div></div>
    <div class="feature"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M10 12h4"/></svg></div><div><h3>${tr('contact.store.t')}</h3><p><strong>${esc(st.address)}</strong></p></div></div>
    <div class="feature"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div><div><h3>${tr('contact.phone.t')}</h3><p>${esc(st.supportPhone)}<br><span class="muted" style="font-size:12px">${tr('contact.phone.s')}</span></p></div></div>
    <div class="feature"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div><h3>${C.lang === 'tr' ? 'Eskişehir İçi Özel Kurye' : 'Eskişehir 2h Express Courier'}</h3><p><strong>${C.lang === 'tr' ? 'Semtinize göre ~2 saatte gizli teslimat' : 'Discreet direct delivery in ~2 hours'}</strong><br><span class="muted" style="font-size:12px">${C.lang === 'tr' ? 'Sivil kurye, logosuz nötr paket, tam gizlilik' : 'Plain package, unbranded, complete privacy'}</span></p></div></div>
  </div>

  <div class="check-step" style="margin-top:34px;background:var(--bg-card);border:1px solid var(--line);border-radius:var(--r-md);padding:24px">
    <h3 style="margin-top:0">${tr('contact.map.h')}</h3>
    <p style="margin-bottom:20px;line-height:1.6">${tr('contact.map.p')}</p>
    
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:22px">
      <div style="background:rgba(255,255,255,0.03);border:1px solid var(--line);padding:14px 16px;border-radius:var(--r-sm)">
        <div style="margin-bottom:8px;color:var(--text)"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg></div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">Tramvay Durağı Karşısı</div>
        <div style="font-size:13px;color:var(--muted)">İsmet İnönü-1 Tramvay Durağı'nın doğrudan tam karşısındaki bina.</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid var(--line);padding:14px 16px;border-radius:var(--r-sm)">
        <div style="margin-bottom:8px;color:var(--text)"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg></div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">Bina Giriş Belirteçleri</div>
        <div style="font-size:13px;color:var(--muted)">Alt girişte <b>Yves Rocher</b> mağazası ve büyük yeşil <b>Shakespeare tabelası</b>.</div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid var(--line);padding:14px 16px;border-radius:var(--r-sm)">
        <div style="margin-bottom:8px;color:var(--text)"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg></div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">Ilgaz İş Hanı Kat:1 D:2</div>
        <div style="font-size:13px;color:var(--muted)">Watsons yanı, 1. kat. Vitrinsiz, tamamen konforlu ve %100 gizli ortam.</div>
      </div>
    </div>

    <iframe src="https://www.google.com/maps?q=${esc(st.mapsQuery)}&output=embed" style="width:100%;height:340px;border:1px solid var(--line);border-radius:var(--r-md)" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" title="Love Sex Shop Eskişehir — Google Maps"></iframe>
    <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap">
      <a href="https://www.google.com/maps/search/?api=1&query=${esc(st.mapsQuery)}" target="_blank" rel="noopener" class="btn btn-primary">${tr('contact.map.btn')}</a>
      <a href="${esc(st.whatsapp)}" target="_blank" rel="noopener" class="btn btn-ghost">${tr('contact.wa.btn')}</a>
    </div>
  </div>

  <div class="check-step" style="margin-top:34px">
    <h3>${tr('contact.form.h')}</h3>
    <form id="contact-form">
      <div class="grid-2">
        <div class="field"><label for="c-name">${tr('contact.form.name')}</label><input id="c-name" placeholder="${tr('contact.form.name.ph')}"></div>
        <div class="field"><label for="c-email">${tr('contact.form.email')}</label><input id="c-email" type="email" required placeholder="${tr('contact.form.email.ph')}"></div>
      </div>
      <div class="field"><label for="c-msg">${tr('contact.form.msg')}</label><textarea id="c-msg" required placeholder="${tr('contact.form.msg.ph')}"></textarea></div>
      <button class="btn btn-primary" type="submit">${tr('contact.form.btn')}</button>
    </form>
  </div>
</div>`;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(C.lang === 'en' ? 'Contact' : 'İletişim & Mağaza Adresi — Love Seks Shop Eskişehir', html, {
    description: 'Love Seks Shop & Erotik Shop Eskişehir iletişim ve mağaza adresi. İsmet İnönü Tramvay Durağı Karşısı, Ilgaz İş Hanı Kat:1 D:2 (Yves Rocher & Watsons Yanı). 7/24 gizli WhatsApp hattı.',
    includeStoreSchema: true
  }, C));
}

function pageAdmin(req: http.IncomingMessage, res: http.ServerResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  const v = Date.now();
  res.end(`<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Panel — LOVE SHOP 2026</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/admin.css?v=${v}">
</head>
<body>
<div id="admin-root"></div>
<div id="toast-zone"></div>
<script src="/js/admin.js?v=${v}"></script>
</body>
</html>`);
}

/* ---------------- static ---------------- */
const MIME: Record<string, string> = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.json': 'application/json',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4'
};

function serveStatic(req: http.IncomingMessage, res: http.ServerResponse, pathname: string) {
  // 1. Instant 301 Permanent Redirect to Vercel Blob for all migrated uploads
  if ((pathname.startsWith('/uploads/') || pathname.includes('/uploads/')) && VERCEL_BLOB_MIGRATION_MAP[pathname]) {
    res.writeHead(301, {
      'Location': VERCEL_BLOB_MIGRATION_MAP[pathname],
      'Cache-Control': 'public, max-age=31536000, immutable'
    });
    return res.end();
  }

  const p = path.normalize(path.join(PUB, pathname));
  if (!p.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  const ext = path.extname(p).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const isScriptOrStyle = ext === '.css' || ext === '.js' || ext === '.json' || ext === '.html';

  const sendSvgFallback = async () => {
    if (pathname.startsWith('/uploads/') || pathname.includes('/uploads/')) {
      const fileName = path.basename(pathname);
      try {
        const cloudBase64 = await getImageFromCloud(fileName);
        if (cloudBase64) {
          const m = cloudBase64.match(/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/);
          if (m) {
            const buf = Buffer.from(m[2], 'base64');
            // Write back to local cache so next requests are instant
            try {
              fs.mkdirSync(path.join(PUB, 'uploads'), { recursive: true });
              fs.writeFileSync(p, buf);
            } catch (e) {}
            res.writeHead(200, {
              'Content-Type': `image/${m[1]}`,
              'Cache-Control': 'public, max-age=86400'
            });
            if (req.method === 'HEAD') return res.end();
            return res.end(buf);
          }
        }
      } catch (e) {}

      // Only attempt SVG silhouette rendering if the request is specifically for an SVG file or a known vector slug
      if (ext === '.svg' || !ext) {
        const slug = path.basename(pathname, path.extname(pathname));
        const svg = getSvgForSlug(slug);
        if (svg) {
          res.writeHead(200, {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=86400'
          });
          if (req.method === 'HEAD') return res.end();
          return res.end(svg);
        }
      }
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404');
  };

  fs.stat(p, (serr, st) => {
    if (serr) { return sendSvgFallback(); }
    
    const reqUrl = req.url || '';
    const isVersioned = reqUrl.includes('?v=') || reqUrl.includes('&v=');
    let cacheControl = 'no-cache, must-revalidate';
    if (ext === '.woff2' || ext === '.ttf' || pathname.startsWith('/uploads/') || ext === '.webp' || ext === '.png' || ext === '.jpg' || ext === '.svg' || ext === '.ico') {
      cacheControl = 'public, max-age=31536000, immutable';
    } else if (isScriptOrStyle) {
      cacheControl = isVersioned ? 'public, max-age=31536000, immutable' : 'no-cache, must-revalidate';
    }

    // Support HTTP Range requests for video/media playback (Essential for iOS Safari & Chrome)
    if (req.method === 'HEAD') {
      res.writeHead(200, {
        'Content-Length': st.size,
        'Content-Type': type,
        'Cache-Control': cacheControl
      });
      return res.end();
    }
    
    if (ext === '.mp4' || req.headers.range) {
      const range = req.headers.range;
      const fileSize = st.size;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;
        const stream = fs.createReadStream(p, { start, end });
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': type,
          'Cache-Control': cacheControl
        });
        return stream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': type,
          'Accept-Ranges': 'bytes',
          'Cache-Control': cacheControl
        });
        return fs.createReadStream(p).pipe(res);
      }
    }

    fs.readFile(p, (err, buf) => {
      if (err) { return sendSvgFallback(); }
      res.writeHead(200, {
        'Content-Length': buf.length,
        'Content-Type': type,
        'Cache-Control': cacheControl
      });
      res.end(buf);
    });
  });
}



function getCleanBlobToken(): string {
  const raw = process.env.BLOB_READ_WRITE_TOKEN || '';
  const match = raw.match(/vercel_blob_rw_[A-Za-z0-9_]+/);
  if (match) return match[0];
  return raw.replace(/^["']|["']$/g, '').trim();
}

async function saveUpload(dataUrl: string): Promise<string> {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  const trimmed = dataUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If already an /uploads/ path, return mapped Vercel Blob URL or try to migrate to Firebase Storage
  if (trimmed.startsWith('/uploads/')) {
    if (VERCEL_BLOB_MIGRATION_MAP[trimmed]) {
      return VERCEL_BLOB_MIGRATION_MAP[trimmed];
    }
    const fileName = path.basename(trimmed);
    const localFile = path.join(PUB, 'uploads', fileName);
    let buf: Buffer | null = null;
    let mimeType = 'image/webp';
    if (fs.existsSync(localFile)) {
      try { buf = fs.readFileSync(localFile); } catch {}
    }
    if (!buf) {
      try {
        const cloudBase64 = await getImageFromCloud(fileName);
        if (cloudBase64) {
          const m = cloudBase64.match(/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/);
          if (m) {
            buf = Buffer.from(m[2], 'base64');
            mimeType = `image/${m[1]}`;
          }
        }
      } catch {}
    }
    if (buf && buf.length > 0) {
      // Migrate to Firebase Storage directly
      try {
        const fbUrl = await uploadToFirebaseStorage(fileName, buf, mimeType);
        if (fbUrl) {
          console.log(`[Firebase Storage] Uploaded existing upload ${trimmed} -> ${fbUrl}`);
          return fbUrl;
        }
      } catch (err) {
        console.error('[Firebase Storage] Auto-migration error:', err);
      }
    }
    return trimmed;
  }

  const base64Index = trimmed.indexOf(';base64,');
  if (trimmed.startsWith('data:image/') && base64Index !== -1) {
    const header = trimmed.substring(5, base64Index);
    const rawType = header.replace(/^image\//, '').split(';')[0].trim().toLowerCase();
    const rawBase64 = trimmed.substring(base64Index + 8);

    const extMap: Record<string, string> = {
      'svg+xml': 'svg', 'svg': 'svg',
      'png': 'png', 'x-png': 'png',
      'jpeg': 'jpg', 'jpg': 'jpg', 'pjpeg': 'jpg',
      'webp': 'webp', 'avif': 'avif', 'gif': 'gif'
    };
    const ext = extMap[rawType] || 'webp';
    const mimeType = rawType === 'svg' || rawType === 'svg+xml' ? 'image/svg+xml' : (rawType === 'jpg' ? 'image/jpeg' : `image/${rawType}`);

    try {
      const cleanBase64 = rawBase64.replace(/[\s\r\n]+/g, '');
      const buf = Buffer.from(cleanBase64, 'base64');
      if (buf.length > 0) {
        const name = uid('img') + '.' + ext;

        // 1. Primary & Permanent: Upload directly to Firebase Cloud Storage
        try {
          const storageUrl = await uploadToFirebaseStorage(name, buf, mimeType);
          if (storageUrl) {
            console.log(`[Firebase Storage] Uploaded successfully: ${storageUrl}`);
            // Also write to local cache so current process has immediate instant read
            const uploadDir = path.join(PUB, 'uploads');
            try { fs.mkdirSync(uploadDir, { recursive: true }); } catch {}
            try { fs.writeFileSync(path.join(uploadDir, name), buf); } catch {}
            return storageUrl;
          }
        } catch (storageErr) {
          console.error('[Firebase Storage] Primary upload failed, falling back:', storageErr);
        }

        // 2. Fallback for local dev and Cloud container environment
        const uploadDir = path.join(PUB, 'uploads');
        try { fs.mkdirSync(uploadDir, { recursive: true }); } catch {}
        try { fs.writeFileSync(path.join(uploadDir, name), buf); } catch {}
        
        const savedPath = '/uploads/' + name;

        // Persist to Cloud Firestore so container rebuilds never lose the photo
        await saveImageToCloud(name, trimmed).catch(() => {});

        return savedPath;
      }
    } catch (err) {
      console.error('saveUpload error:', err);
    }
  }

  return trimmed.startsWith('data:') ? '' : trimmed;
}


/* ---------------- API ---------------- */
async function handleApi(req: http.IncomingMessage, res: http.ServerResponse, pathname: string, url: URL) {
  const method = req.method;
  const q = url.searchParams;
  const sess = getSession(req, res);
  const user = getAuthUser(req, sess);
  const apiLang = getCookieValue(req, 'ls_lang') === 'en' ? 'en' : 'tr';
  const E = (key: string, vars?: any) => errT(apiLang, key, vars);

  /* --- session --- */
  if (pathname === '/api/session' && method === 'GET') {
    return json(res, 200, {
      ok: true,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: isAdminEmail(user.email) ? 'admin' : 'customer',
        addresses: user.addresses || []
      } : null
    });
  }

  /* --- auth --- */
  if (pathname === '/api/auth/register' && method === 'POST') {
    if (rateLimited(req, 'auth', 8, 60000)) return sendError(res, 429, E('err.rate'));
    const b = await readBody(req);
    const email = String(b.email || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return sendError(res, 400, E('err.email'));
    if (!String(b.password || '') || b.password.length < 6) return sendError(res, 400, E('err.pass6'));
    if (db.users.some((u: any) => u.email === email)) return sendError(res, 409, E('err.emailUsed'));
    const role = isAdminEmail(email) ? 'admin' : 'customer';
    const u = { id: uid('u'), email, passwordHash: hash(b.password), name: String(b.name || '').trim() || 'Misafir', role, tokenVersion: 1, createdAt: new Date().toISOString(), addresses: [] };
    db.users.push(u); await saveAsync();
    sess.userId = u.id; persistSessions();
    const token = createAuthToken(u.id, u.role, u.tokenVersion);
    const cur = res.getHeader('Set-Cookie');
    const arr = Array.isArray(cur) ? [...cur].map(String) : (cur ? [String(cur)] : []);
    arr.push(`ls_token=${token}; Path=/; SameSite=Lax; HttpOnly${isProd ? '; Secure' : ''}; Max-Age=${60 * 60 * 24 * 30}`);
    res.setHeader('Set-Cookie', arr);
    return json(res, 200, { ok: true, user: { id: u.id, name: u.name, email: u.email, role: u.role }, token });
  }
  if (pathname === '/api/auth/login' && method === 'POST') {
    if (rateLimited(req, 'auth', 8, 60000)) return sendError(res, 429, E('err.rate'));
    const b = await readBody(req);
    const email = String(b.email || '').trim().toLowerCase();
    const u = db.users.find((x: any) => x.email === email);
    if (!u || u.passwordHash !== hash(String(b.password || ''))) return sendError(res, 401, E('err.badLogin'));
    // Enforce role and ensure valid token version
    u.role = isAdminEmail(u.email) ? 'admin' : 'customer';
    u.tokenVersion = u.tokenVersion || 1;
    await saveAsync();
    sess.userId = u.id; persistSessions();
    const token = createAuthToken(u.id, u.role, u.tokenVersion);
    const cur = res.getHeader('Set-Cookie');
    const arr = Array.isArray(cur) ? [...cur].map(String) : (cur ? [String(cur)] : []);
    arr.push(`ls_token=${token}; Path=/; SameSite=Lax; HttpOnly${isProd ? '; Secure' : ''}; Max-Age=${60 * 60 * 24 * 30}`);
    res.setHeader('Set-Cookie', arr);
    return json(res, 200, { ok: true, user: { id: u.id, name: u.name, email: u.email, role: u.role }, token });
  }
  if (pathname === '/api/auth/google' && method === 'POST') {
    if (rateLimited(req, 'auth', 15, 60000)) return sendError(res, 429, E('err.rate'));
    if (!GOOGLE_CLIENT_ID) return json(res, 503, { ok: false, error: 'Google login disabled' });
    const b = await readBody(req);
    const credential = b.credential || b.idToken;
    const accessToken = b.accessToken || b.access_token;

    if (!credential && !accessToken) return sendError(res, 401, 'Credential or Access Token required');
    let email = '';
    let name = '';
    let picture = '';

    if (credential) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) throw new Error('No payload');
        email = String(payload.email || '').trim().toLowerCase();
        name = String(payload.name || payload.given_name || '').trim();
        picture = String(payload.picture || '').trim();
      } catch (err) {
        // ID token verify failed
      }
    }

    if (!email && accessToken) {
      try {
        const uRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (uRes.ok) {
          const uData = await uRes.json();
          email = String(uData.email || '').trim().toLowerCase();
          name = String(uData.name || uData.given_name || '').trim();
          picture = String(uData.picture || '').trim();
        }
      } catch (err) {
        // Access token verify failed
      }
    }

    if (!email) {
      return sendError(res, 401, 'Invalid Google credentials');
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return sendError(res, 400, E('err.email'));
    }

    const assignedRole = isAdminEmail(email) ? 'admin' : 'customer';
    let u = db.users.find((x: any) => x.email === email);
    if (!u) {
      u = {
        id: uid('u'),
        email,
        passwordHash: hash('google_oauth_' + uid('g') + '_' + Date.now()),
        name: name || email.split('@')[0] || 'Kullanıcı',
        role: assignedRole,
        tokenVersion: 1,
        googleAuth: true,
        avatar: picture || '',
        createdAt: new Date().toISOString(),
        addresses: []
      };
      db.users.push(u);
      await saveAsync();
    } else {
      let modified = false;
      if (u.role !== assignedRole) {
        u.role = assignedRole;
        modified = true;
      }
      if (name && (!u.name || u.name === 'Misafir')) {
        u.name = name;
        modified = true;
      }
      if (picture && !u.avatar) {
        u.avatar = picture;
        modified = true;
      }
      if (!u.tokenVersion) {
        u.tokenVersion = 1;
        modified = true;
      }
      if (modified) await saveAsync();
    }

    sess.userId = u.id;
    persistSessions();
    const token = createAuthToken(u.id, u.role, u.tokenVersion || 1);
    const cur = res.getHeader('Set-Cookie');
    const arr = Array.isArray(cur) ? [...cur].map(String) : (cur ? [String(cur)] : []);
    arr.push(`ls_token=${token}; Path=/; SameSite=Lax; HttpOnly${isProd ? '; Secure' : ''}; Max-Age=${60 * 60 * 24 * 30}`);
    res.setHeader('Set-Cookie', arr);
    return json(res, 200, { ok: true, user: { id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar || '' }, token });
  }
  if (pathname === '/api/auth/logout' && method === 'POST') {
    const authUser = getAuthUser(req, sess);
    if (authUser) {
      authUser.tokenVersion = (authUser.tokenVersion || 1) + 1;
      await saveAsync();
    }
    const sid = getSid(req);
    if (sid && sessions[sid]) {
      sessions[sid].userId = null;
      delete sessions[sid];
      persistSessions();
    }
    if (sess) { sess.userId = null; }
    clearSidCookie(res);
    return json(res, 200, { ok: true });
  }

  /* --- categories & products (public) --- */
  if (pathname === '/api/categories' && method === 'GET') {
    const cats = allCategories().map((c: any) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      image: c.image || '',
      featuredOnHome: !!c.featuredOnHome,
      homeOrder: typeof c.homeOrder === 'number' ? c.homeOrder : 99,
      subcategories: c.subcategories || [],
      count: db.products.filter((p: any) => matchesCategory(p.category, c.slug)).length
    }));
    return json(res, 200, { ok: true, categories: cats });
  }
  if (pathname === '/api/products' && method === 'GET') {
    let list = [...db.products];
    const cat = q.get('cat') || q.get('kat');
    if (cat && cat !== 'hepsi' && cat !== 'all') {
      list = list.filter((p: any) => matchesCategory(p.category, cat));
    }
    const subcat = q.get('subcat') || q.get('altkat');
    if (subcat) {
      list = list.filter((p: any) => matchesSubcategory(p, subcat));
    }
    const kw = q.get('q');
    if (kw) {
      const normalizeTr = (s: string) =>
        String(s || '')
          .toLowerCase()
          .replace(/[ıİ]/g, 'i')
          .replace(/[ğĞ]/g, 'g')
          .replace(/[üÜ]/g, 'u')
          .replace(/[şŞ]/g, 's')
          .replace(/[öÖ]/g, 'o')
          .replace(/[çÇ]/g, 'c')
          .trim();

      const normKw = normalizeTr(kw);
      if (normKw === 'yeni' || normKw === 'new' || normKw === 'yeni gelenler' || normKw === 'yeni gelen') {
        list.sort((a: any, b: any) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
      } else {
        const words = normKw.split(/\s+/).filter(Boolean);
        list = list.filter((p: any) => {
          const nameNorm = normalizeTr(p.name);
          const descNorm = normalizeTr(p.description);
          const catNorm = normalizeTr(p.category || '');
          const catNameNorm = normalizeTr(p.categoryName || '');
          const tagsNorm = normalizeTr(Array.isArray(p.tags) ? p.tags.join(' ') : '');
          const combined = `${nameNorm} ${descNorm} ${catNorm} ${catNameNorm} ${tagsNorm}`;
          return words.every((w) => combined.includes(w));
        });
      }
    }
    const filter = q.get('filter');
    if (filter === 'bestsellers') list = list.filter((p: any) => p.bestSeller);
    if (filter === 'new') list = list.filter((p: any) => p.isNew);
    if (q.get('featured') === '1') list = list.filter((p: any) => p.featured);
    if (q.get('wheel') === '1') return json(res, 200, { ok: true, total: 0, products: wheelProducts() });
    switch (q.get('sort')) {
      case 'yeni': case 'new': list.sort((a: any, b: any) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))); break;
      case 'fiyat-artan': list.sort((a: any, b: any) => a.price - b.price); break;
      case 'fiyat-azalan': list.sort((a: any, b: any) => b.price - a.price); break;
      case 'puan': list.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0)); break;
      default: {
        const queryTerm = kw ? kw.toLowerCase().trim() : '';
        if (!kw || !['yeni', 'new', 'yeni gelenler', 'yeni gelen'].includes(queryTerm)) {
          list.sort((a: any, b: any) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
        }
      }
    }
    const total = list.length;
    const offset = parseInt(q.get('offset') || '0', 10) || 0;
    const limit = Math.min(parseInt(q.get('limit') || '50', 10) || 50, 100);
    return json(res, 200, { ok: true, total, products: list.slice(offset, offset + limit) });
  }
  const pSlug = pathname.match(/^\/api\/products\/([^/]+)\/?$/);
  if (pSlug && method === 'GET') {
    const rawKey = decodeURIComponent(pSlug[1]).trim().toLowerCase();
    const cleanKey = rawKey.replace(/^\/urun\//, '').replace(/\/+$/, '');
    const p = db.products.find((x: any) => {
      const s = String(x.slug || '').toLowerCase();
      const i = String(x.id || '').toLowerCase();
      const n = String(x.name || '').toLowerCase().replace(/[çğıöşü]/g, (c) => ({ 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' }[c] || c)).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return s === cleanKey || i === cleanKey || n === cleanKey || s === rawKey || i === rawKey;
    });
    if (!p) return sendError(res, 404, E('err.noProd'));
    return json(res, 200, { ok: true, product: p });
  }
  const pRev = pathname.match(/^\/api\/products\/([^/]+)\/reviews\/?$/);
  if (pRev) {
    const rawKey = decodeURIComponent(pRev[1]).trim().toLowerCase();
    const cleanKey = rawKey.replace(/^\/urun\//, '').replace(/\/+$/, '');
    const p = db.products.find((x: any) => {
      const s = String(x.slug || '').toLowerCase();
      const i = String(x.id || '').toLowerCase();
      return s === cleanKey || i === cleanKey || s === rawKey || i === rawKey;
    });
    if (!p) return sendError(res, 404, E('err.noProd'));
    if (method === 'GET') return json(res, 200, { ok: true, reviews: db.reviews.filter((r: any) => r.productId === p.id && r.approved).sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt)) });
    if (method === 'POST') {
      const b = await readBody(req);
      const text = String(b.text || '').trim();
      if (text.length < 10) return sendError(res, 400, E('err.revShort'));
      const rating = Math.min(5, Math.max(1, parseInt(b.rating, 10) || 5));
      const masked = user ? user.name.trim()[0] + '***' : 'M***';
      db.reviews.push({ id: uid('r'), productId: p.id, userName: masked, rating, text, approved: false, createdAt: new Date().toISOString() });
      await saveAsync();
      return json(res, 200, { ok: true });
    }
  }

  if (pathname === '/api/stock-notify' && method === 'POST') {
    const b = await readBody(req);
    const email = String(b.email || '').trim().toLowerCase();
    const productId = String(b.productId || '').trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
      return sendError(res, 400, 'Lütfen geçerli bir e-posta adresi giriniz.');
    }
    if (!productId) return sendError(res, 400, 'Ürün bilgisi bulunamadı.');
    if (!Array.isArray((db as any).stockNotifies)) (db as any).stockNotifies = [];
    const exists = (db as any).stockNotifies.some((x: any) => x.email === email && x.productId === productId);
    if (!exists) {
      (db as any).stockNotifies.push({
        id: uid('sn'),
        email,
        productId,
        createdAt: new Date().toISOString()
      });
      await saveAsync();
    }
    return json(res, 200, { ok: true, message: 'Talebiniz başarıyla alındı. Ürün stoğa girdiğinde e-posta ile bilgilendirileceksiniz.' });
  }

  /* --- cart --- */
  if ((pathname === '/api/cart' || pathname === '/api/cart/calc') && (method === 'GET' || method === 'POST')) {
    if (method === 'POST') {
      const b = await readBody(req);
      const items = Array.isArray(b.items) ? b.items : (Array.isArray(b.cart) ? b.cart : (sess.cart || []));
      const coupon = b.coupon !== undefined ? b.coupon : sess.coupon;
      return json(res, 200, { ok: true, ...cartCalc(items, coupon) });
    }
    return json(res, 200, { ok: true, ...cartCalc(sess) });
  }
  if (pathname === '/api/cart/add' && method === 'POST') {
    const b = await readBody(req);
    const prodId = String(b.productId || '').trim();
    const p = db.products.find((x: any) => x.id === prodId || x.slug === prodId);
    if (!p) return sendError(res, 404, E('err.noProd'));
    if (p.stock <= 0) return sendError(res, 400, E('err.noStock'));
    
    // Support stateless client items array or fallback to session
    const clientItems = Array.isArray(b.items) ? [...b.items] : (Array.isArray(sess.cart) ? [...sess.cart] : []);
    const qty = Math.min(Math.max(1, parseInt(b.qty, 10) || 1), p.stock);
    const variant = String(b.variant || 'standart').trim();
    const line = clientItems.find((l: any) => (l.productId === p.id || l.id === p.id) && (l.variant || 'standart') === variant);
    if (line) {
      line.qty = Math.min((parseInt(line.qty, 10) || 0) + qty, p.stock);
    } else {
      clientItems.push({ productId: p.id, qty, variant });
    }
    const coupon = b.coupon !== undefined ? b.coupon : sess.coupon;
    sess.cart = clientItems;
    if (coupon) sess.coupon = coupon;
    persistSessions();
    return json(res, 200, { ok: true, ...cartCalc(clientItems, coupon) });
  }
  if (pathname === '/api/cart/update' && method === 'POST') {
    const b = await readBody(req);
    const prodId = String(b.productId || '').trim();
    const clientItems = Array.isArray(b.items) ? [...b.items] : (Array.isArray(sess.cart) ? [...sess.cart] : []);
    const line = clientItems.find((l: any) => l.productId === prodId || l.id === prodId);
    if (!line) return sendError(res, 404, E('err.notInCart'));
    const p = db.products.find((x: any) => x.id === prodId || x.slug === prodId);
    line.qty = Math.min(Math.max(1, parseInt(b.qty, 10) || 1), p ? p.stock : 99);
    const coupon = b.coupon !== undefined ? b.coupon : sess.coupon;
    sess.cart = clientItems;
    if (coupon) sess.coupon = coupon;
    persistSessions();
    return json(res, 200, { ok: true, ...cartCalc(clientItems, coupon) });
  }
  if (pathname === '/api/cart/remove' && method === 'POST') {
    const b = await readBody(req);
    const prodId = String(b.productId || '').trim();
    let clientItems = Array.isArray(b.items) ? [...b.items] : (Array.isArray(sess.cart) ? [...sess.cart] : []);
    clientItems = clientItems.filter((l: any) => l.productId !== prodId && l.id !== prodId);
    const coupon = b.coupon !== undefined ? b.coupon : sess.coupon;
    sess.cart = clientItems;
    if (coupon) sess.coupon = coupon;
    persistSessions();
    return json(res, 200, { ok: true, ...cartCalc(clientItems, coupon) });
  }
  if (pathname === '/api/cart/coupon' && method === 'POST') {
    const b = await readBody(req);
    const r = findCoupon(b.code, apiLang);
    if (r.error) return sendError(res, 400, r.error);
    const clientItems = Array.isArray(b.items) ? b.items : (Array.isArray(sess.cart) ? sess.cart : []);
    const c = cartCalc(clientItems, r.coupon.code);
    if (r.coupon.minTotal > c.subtotal) return sendError(res, 400, E('err.couponMin', { min: fmt(r.coupon.minTotal) }));
    sess.coupon = r.coupon.code;
    sess.cart = clientItems;
    persistSessions();
    return json(res, 200, { ok: true, ...c });
  }

  /* --- checkout --- */
  if (pathname === '/api/checkout' && method === 'POST') {
    const st = db.settings;
    const b = await readBody(req);
    const clientItems = Array.isArray(b.items) ? b.items : null;
    const clientCoupon = typeof b.coupon === 'string' ? b.coupon : (typeof b.coupon === 'object' ? b.coupon?.code : undefined);
    const c = clientItems ? cartCalc(clientItems, clientCoupon) : cartCalc(sess);
    if (!c.items.length) return sendError(res, 400, E('err.emptyCart'));
    const name = String(b.name || '').trim();
    const phone = String(b.phone || '').trim();
    const PAY: Record<string, string> = { whatsapp: 'WhatsApp ile Sipariş', shop: 'Mağazadan Teslim & Ödeme' };
    const payKey = PAY[b.payment] ? b.payment : 'whatsapp';
    const pickup = payKey === 'shop';
    if (!name || !phone) return sendError(res, 400, E('err.namePhone'));
    const address = String(b.address || '').trim();
    const city = String(b.city || '').trim();
    if (!pickup && (!address || !city)) return sendError(res, 400, E('err.address'));
    const shipping = pickup ? 0 : c.shipping;
    const total = Math.round((c.subtotal - c.discount + shipping) * 100) / 100;
    const nextSeq = nextId('order');
    const orderId = 'LS-' + (1000 + nextSeq);
    const email = user ? user.email : String(b.email || '').trim().toLowerCase() || sess.lastGuestEmail || '';
    const order = {
      id: orderId, userId: user ? user.id : null, userEmail: email, customerName: name,
      items: c.items.map((i: any) => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty, image: i.image })),
      subtotal: c.subtotal, shipping, discount: c.discount, total,
      coupon: c.coupon ? c.coupon.code : null, status: 'processing', payment: PAY[payKey],
      discreet: pickup ? false : !!b.discreet, phone,
      address: pickup ? { full: 'MAĞAZADAN TESLİM — ' + (st.address || ''), city: 'Eskişehir', zip: '26170' } : { full: address, city, zip: String(b.zip || '').trim() },
      createdAt: new Date().toISOString(), note: String(b.note || '').trim()
    };
    for (const i of c.items) {
      const p = db.products.find((x: any) => x.id === i.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - i.qty);
        saveProductToCloud(p).catch(() => {});
      }
    }
    if (c.coupon) { c.coupon.used++; }
    if (user) {
      user.addresses = [{ label: pickup ? 'Mağazadan' : 'Ev', full: order.address.full, city: order.address.city, zip: order.address.zip, phone, discreet: order.discreet }];
    }
    db.orders.push(order);
    sess.cart = []; sess.coupon = null; sess.lastGuestEmail = email || null;
    await saveOrderToCloud(order);
    await saveOrderSeqToCloud(nextSeq);
    await saveAsync(); persistSessions();

    const isEskisehir = !pickup && city.toLowerCase().includes('eskişehir') || city.toLowerCase().includes('eskisehir');
    const lines = [
      'Merhaba Love Shop! 🖤',
      'Web sitenizden yeni bir sipariş vermek istiyorum. Detaylar aşağıdadır:',
      '',
      '🛍️ SİPARİŞ ÖZETİ:'
    ];
    for (const i of order.items) {
      lines.push(`${i.qty}x ${i.name} - ${fmt(i.price * i.qty)}`);
    }
    lines.push('');
    lines.push('--------------------------');
    lines.push(`📦 TESLİMAT: ${pickup ? 'Mağazadan Teslim' : (isEskisehir ? `Eskişehir İçi Özel Kurye (~2 Saat) (${fmt(shipping)})` : `Adrese Kargo (${fmt(shipping)})`)}`);
    if (order.discount && order.coupon) lines.push(`🎁 İNDİRİM: -${fmt(order.discount)} (Kupon: ${order.coupon})`);
    else if (order.discount) lines.push(`🎁 İNDİRİM: -${fmt(order.discount)}`);
    lines.push(`💳 TOPLAM TUTAR: ${fmt(total)}`);
    lines.push('');
    lines.push('👤 BİLGİLERİM:');
    lines.push(`İsim: ${name}`);
    if (!pickup) lines.push(`Adres: ${address}, ${city}`);
    lines.push(`Tel: ${phone}`);
    if (order.discreet) lines.push('Not: %100 Gizli & İsimsiz Paketleme');
    if (isEskisehir) lines.push('⚡ Teslimat Tercihi: Eskişehir İçi 2 Saatte Hızlı Teslimat');
    if (order.note) lines.push(`Sipariş Notu: ${order.note}`);
    lines.push('');
    lines.push('Siparişi onaylamak için IBAN veya ödeme linki alabilir miyim? Teşekkürler! ✨');

    const waMessage = lines.join('\n');
    return json(res, 200, { ok: true, orderId, total, pickup, waMessage, waLink: (st.whatsapp || 'https://wa.me/905436331325') + '?text=' + encodeURIComponent(waMessage) });
  }

  /* --- orders --- */
  if (pathname === '/api/orders/mine' && method === 'GET') {
    if (!user) return sendError(res, 401, E('err.noUser'));
    return json(res, 200, { ok: true, orders: db.orders.filter((o: any) => o.userId === user.id).sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt)) });
  }
  const oGet = pathname.match(/^\/api\/orders\/([^/]+)$/);
  if (oGet && method === 'GET') {
    const o = db.orders.find((x: any) => x.id === decodeURIComponent(oGet[1]));
    if (!o) return sendError(res, 404, E('err.noOrder'));
    const allowed = (user && user.role === 'admin') || (user && o.userId === user.id) || (o.userEmail && o.userEmail === sess.lastGuestEmail);
    if (!allowed) return sendError(res, 403, E('err.orderForbid'));
    return json(res, 200, { ok: true, order: o });
  }

  /* --- account --- */
  if (pathname === '/api/account' && method === 'POST') {
    if (!user) return sendError(res, 401, E('err.noUser'));
    const b = await readBody(req);
    if (b.name) user.name = String(b.name).trim();
    await saveAsync();
    return json(res, 200, { ok: true });
  }
  if (pathname === '/api/account/address' && method === 'POST') {
    if (!user) return sendError(res, 401, E('err.noUser'));
    const b = await readBody(req);
    user.addresses = [{ label: 'Ev', full: String(b.full || ''), city: String(b.city || ''), zip: String(b.zip || ''), phone: String(b.phone || ''), discreet: !!b.discreet }];
    await saveAsync();
    return json(res, 200, { ok: true });
  }
  if (pathname === '/api/account/password' && method === 'POST') {
    if (!user) return sendError(res, 401, E('err.noUser'));
    const b = await readBody(req);
    if (!b.password || b.password.length < 6) return sendError(res, 400, E('err.pass6'));
    user.passwordHash = hash(b.password);
    user.tokenVersion = (user.tokenVersion || 1) + 1;
    await saveAsync();
    return json(res, 200, { ok: true });
  }

  /* --- newsletter & contact --- */
  if (pathname === '/api/newsletter' && method === 'POST') {
    const b = await readBody(req);
    const email = String(b.email || '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return sendError(res, 400, E('err.email'));
    if (db.newsletter.some((n: any) => n.email === email)) return sendError(res, 409, E('err.emailUsed'));
    db.newsletter.push({ id: uid('n'), email, createdAt: new Date().toISOString() }); await saveAsync();
    return json(res, 200, { ok: true });
  }
  if (pathname === '/api/contact' && method === 'POST') {
    const b = await readBody(req);
    const email = String(b.email || '').trim().toLowerCase();
    const message = String(b.message || '').trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return sendError(res, 400, E('err.email'));
    if (message.length < 5) return sendError(res, 400, E('err.msgShort'));
    db.contact.push({ id: uid('m'), name: String(b.name || 'Anonim').trim(), email, message, createdAt: new Date().toISOString(), read: false });
    await saveAsync();
    return json(res, 200, { ok: true });
  }

  /* --- Geo-IP location check (Eskişehir vs Other Cities) --- */
  if (pathname === '/api/geo' && method === 'GET') {
    // Check Cloudflare / GCP / Proxy headers
    const cfCity = (req.headers['cf-ipcity'] || '').toString().toLowerCase();
    const cfRegion = (req.headers['cf-region'] || '').toString().toLowerCase();
    const cfCountry = (req.headers['cf-ipcountry'] || '').toString().toUpperCase();

    // Check if directly flagged as Eskisehir from CDN headers
    const isEskisehir = cfCity.includes('eskisehir') || cfCity.includes('eskişehir') || cfRegion.includes('26') || cfRegion.includes('eskisehir');

    return json(res, 200, {
      ok: true,
      city: cfCity || null,
      region: cfRegion || null,
      country: cfCountry || 'TR',
      isEskisehir: isEskisehir
    });
  }

  // Universal, strict, safety-first extraction of product highlights from actual description text (NO HALLUCINATIONS)
  function extractProductHighlights(prod: any): string[] {
    const name = String(prod.name || '');
    const desc = String(prod.description || '');
    const longDesc = String(prod.longDescription || '');
    const fullText = `${name} ${desc} ${longDesc}`;
    const lower = fullText.toLowerCase();

    const highlights: string[] = [];

    // =========================================================================
    // 1. CRITICAL HEALTH & USAGE ROUTE (ORAL VS TOPICAL VS MECHANICAL)
    // =========================================================================
    const isExplicitOral = (
      lower.includes('içecek') || lower.includes('içeceğe') || lower.includes('suya damlat') ||
      lower.includes('dilaltı') || lower.includes('dil altı') || lower.includes('içilir') ||
      lower.includes('tüketilir') || lower.includes('oral damla') || lower.includes('sıvı takviye')
    ) && !lower.includes('harici kullanım') && !lower.includes('masaj damlası') && !lower.includes('bölgeye damlat');

    const isMechanicalOrApparatus = lower.includes('mastürbatör') || lower.includes('masturbat') ||
      lower.includes('dildo') || lower.includes('vibratör') || lower.includes('manken') ||
      lower.includes('kelepçe') || lower.includes('halka') || lower.includes('plug') ||
      lower.includes('pompa') || lower.includes('maske');

    const isDropsOrLiquid = !isMechanicalOrApparatus && (
      lower.includes('damla') || lower.includes('drop') || lower.includes('serum') ||
      lower.includes('yağ') || lower.includes('sprey') || lower.includes('krem') ||
      lower.includes('jel') || lower.includes('lube') || lower.includes('kayganlaştırıcı')
    );

    if (isExplicitOral) {
      highlights.push('Ağızdan İçeceğe Karıştırılarak Tüketilir');
      highlights.push('Bitkisel Sıvı Destek Damlası');
    } else if (isDropsOrLiquid) {
      highlights.push('YALNIZCA HARİCİ KULLANIM — KESİNLİKLE İÇİLMEZ');
      const isDurationSupport = lower.includes('süreyi') || lower.includes('süre destek') || lower.includes('birliktelik süresi') || lower.includes('geciktir') || lower.includes('delay') || lower.includes('stag') || lower.includes('proling');
      if (isDurationSupport) {
        highlights.push('Birliktelik Süresini Destekleyici Formül');
      }
      if (lower.includes('damla') || lower.includes('drop')) highlights.push('Bölgesel Masaj & Uyarıcı Damla');
      else if (lower.includes('sprey')) highlights.push('Lokal Püskürtme Uygulaması');
      else if (lower.includes('krem')) highlights.push('Bölgesel Masajla Emilim');
      else if (lower.includes('serum')) highlights.push('Konsantre Harici Serum');
    }

    // 2. EXACT IPX / WATERPROOF (ONLY IF PRESENT IN REAL TEXT - NEVER INVENTED)
    const ipxMatch = fullText.match(/\bip(?:x|v)?([0-9])\b/i);
    if (ipxMatch) {
      const lvl = ipxMatch[1];
      if (lvl === '1' || lvl === '2') highlights.push(`IPX${lvl} Damlama Korumalı`);
      else if (lvl === '3') highlights.push('IPX3 Sıçrama Korumalı');
      else if (lvl === '4') highlights.push('IPX4 Sıçrama Korumalı');
      else if (lvl === '5') highlights.push('IPX5 Su Püskürtme Dayanımlı');
      else if (lvl === '6') highlights.push('IPX6 Güçlü Su Dayanımlı');
      else if (lvl === '7') highlights.push('IPX7 Su Geçirmez');
      else if (lvl === '8') highlights.push('IPX8 Tam Su Altı Geçirmez');
      else highlights.push(`IPX${lvl} Sertifikalı`);
    } else if (lower.includes('tamamen su geçirmez') || lower.includes('%100 su geçirmez') || lower.includes('100% su geçirmez')) {
      highlights.push('%100 Su Geçirmez');
    } else if (lower.includes('su geçirmezlik: evet') || (lower.includes('su geçirmez') && !lower.includes('su geçirmez değildir'))) {
      highlights.push('Su Geçirmez Gövde');
    }

    // 3. MATERIAL (VERIFIED FROM ACTUAL TEXT)
    if (lower.includes('medikal platin') || lower.includes('platinum silikon')) highlights.push('Medikal Platinum Silikon');
    else if (lower.includes('sıvı silikon') || lower.includes('liquid silicone')) highlights.push('Medikal Sıvı Silikon');
    else if (lower.includes('medikal silikon') || lower.includes('tıbbi sınıf')) highlights.push('%100 Medikal Silikon');
    else if (lower.includes('tpe') || lower.includes('cyberskin') || lower.includes('tpr')) highlights.push('Gerçekçi Medikal TPE');
    else if (lower.includes('borosilikat') || lower.includes('cam dildo')) highlights.push('Borosilikat Medikal Cam');
    else if (lower.includes('paslanmaz çelik') || lower.includes('metal plug') || lower.includes('metal') || lower.includes('çelik')) highlights.push('Medikal Paslanmaz Çelik');
    else if (lower.includes('vegan deri') || lower.includes('suni deri')) highlights.push('Yumuşak Vegan Deri');
    else if (lower.includes('peluş')) highlights.push('Peluş Kaplamalı Metal');
    else if (lower.includes('lateks') || lower.includes('prezervatif')) highlights.push('Klinik Doğal Lateks');

    // 4. POWER / CHARGE (VERIFIED)
    if (lower.includes('manyetik') && (lower.includes('şarj') || lower.includes('usb'))) highlights.push('Manyetik Hızlı Şarj');
    else if (lower.includes('type-c') || lower.includes('type c')) highlights.push('Type-C Hızlı Şarj');
    else if (lower.includes('usb') && (lower.includes('şarj') || lower.includes('kablo'))) highlights.push('USB Şarj Edilebilir');
    else if (lower.includes('2aaa') || lower.includes('2xaaa') || lower.includes('2 adet aaa')) highlights.push('2x AAA Pille Çalışır');
    else if (lower.includes('1aaa') || lower.includes('1xaaa') || lower.includes('1 adet aaa')) highlights.push('1x AAA Pille Çalışır');
    else if (lower.includes('2aa') || lower.includes('2xaa') || lower.includes('2 adet aa')) highlights.push('2x AA Pille Çalışır');
    else if (lower.includes('şarj edilebilir') || lower.includes('şarjlı')) highlights.push('Şarj Edilebilir Batarya');

    // 5. FUNCTION / MODES (VERIFIED)
    const modeMatch = fullText.match(/(\d+)\s*(?:farklı\s*)?(?:titreşim|hız|frekans|mod|program|fonksiyon)/i);
    if (modeMatch) {
      highlights.push(`${modeMatch[1]} Titreşim Modu`);
    }
    if (lower.includes('çift motor') || lower.includes('iki motor')) highlights.push('Çift Bağımsız Motor');
    if (lower.includes('app') || lower.includes('telefon kontrollü') || lower.includes('bluetooth')) highlights.push('Mobil Uygulama Kontrollü');
    if (lower.includes('ısıtma') || lower.includes('ısıtmalı')) highlights.push('Vücut Sıcaklığında Isıtma');
    if (lower.includes('360°') || lower.includes('dönen başlık')) highlights.push('360° Dönen Başlık');
    if (lower.includes('sessiz') || lower.includes('45db') || lower.includes('40db') || lower.includes('50db')) highlights.push('<45dB Fısıltı Motoru');
    if (lower.includes('vantuz') || lower.includes('sabitleme')) highlights.push('Güçlü Sabitleme Vantuzu');
    if (lower.includes('dermatolojik') || lower.includes('klinik test')) highlights.push('Dermatolojik Onaylı');

    // 6. VOLUME / FORMULA (VERIFIED)
    const mlMatch = fullText.match(/(\d+)\s*ml\b/i);
    if (mlMatch && (lower.includes('jel') || lower.includes('sprey') || lower.includes('damla') || lower.includes('krem') || lower.includes('yağ') || lower.includes('serum'))) {
      highlights.push(`${mlMatch[1]} ml Net Hacim`);
    }
    if (lower.includes('su bazlı')) highlights.push('Su Bazlı Formül');
    if (lower.includes('silikon bazlı')) highlights.push('Silikon Bazlı Formül');

    // 7. SAFE NEUTRAL FALLBACKS (NEVER INVENT WATERPROOF, DOSE OR FAKE SPECS)
    const neutralFallbacks = [
      '%100 Orijinal & Faturalı',
      'Gizli Paketleme & Express Teslimat',
      'Hijyenik Koruma Mühürlü'
    ];
    for (const n of neutralFallbacks) {
      if (highlights.length >= 3) break;
      if (!highlights.includes(n)) highlights.push(n);
    }

    return highlights.slice(0, 4);
  }

  function fallbackPolishProduct(name: string, category: string, rawText: string) {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const cleanTitle = name || (lines[0] ? lines[0].slice(0, 65) : 'Özel Seri Ürün');
    const highlights = extractProductHighlights({ name: cleanTitle, category, description: rawText, longDescription: rawText });

    let lead = `${cleanTitle}, özel tasarımı ve premium kalitesiyle beklentileri aşan lüks bir deneyim sunar.`;
    if (category.toLowerCase().includes('sprey') || category.toLowerCase().includes('sağlık')) {
       lead = `${cleanTitle}, özel formülü sayesinde beklentileri karşılayan ve güven veren etkili bir deneyim sunar.`;
    }

    const bulletItems = lines.filter(l => l.length > 5 && !l.toLowerCase().includes('bu ürün')).slice(0, 6);
    const bulletText = bulletItems.length 
      ? `\n\nÖne Çıkan Özellikler:\n` + bulletItems.map(b => `• ${b.replace(/^[-•*:\d.]+\s*/, '')}`).join('\n')
      : '';

    return {
      name: cleanTitle,
      description: lead,
      highlights,
      longDescription: `${lead}${bulletText}`
    };
  }

  /* ================= ADMIN ================= */
  const adm = requireAdmin(req, res);

  if (pathname.startsWith('/api/admin/')) {
    if (!adm) return sendError(res, 401, E('err.needAdmin'));

    if (pathname === '/api/admin/stats' && method === 'GET') {
      const revenueOrders = db.orders.filter((o: any) => o.status !== 'cancelled');
      const now = new Date();
      
      // Calculate 30-day historical data
      const days30 = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(now.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const dayOrders = revenueOrders.filter((o: any) => (o.createdAt || '').slice(0, 10) === key);
        const total = dayOrders.reduce((a: number, o: any) => a + (o.total || 0), 0);
        days30.push({
          date: key,
          label: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
          shortLabel: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
          value: Math.round(total * 100) / 100,
          orders: dayOrders.length
        });
      }
      
      // Last 7 days for backwards compatibility
      const days = days30.slice(23).map((x) => ({ label: x.shortLabel, value: x.value }));

      // Calculate 7-day growth vs previous 7 days
      const last7Revenue = days30.slice(23).reduce((acc, d) => acc + d.value, 0);
      const prev7Revenue = days30.slice(16, 23).reduce((acc, d) => acc + d.value, 0);
      const revGrowth = prev7Revenue > 0 
        ? Math.round(((last7Revenue - prev7Revenue) / prev7Revenue) * 100) 
        : (last7Revenue > 0 ? 100 : 0);

      const last7Orders = days30.slice(23).reduce((acc, d) => acc + d.orders, 0);
      const prev7Orders = days30.slice(16, 23).reduce((acc, d) => acc + d.orders, 0);
      const ordGrowth = prev7Orders > 0 
        ? Math.round(((last7Orders - prev7Orders) / prev7Orders) * 100) 
        : (last7Orders > 0 ? 100 : 0);

      // Category distribution
      const catDist: Record<string, number> = {};
      const catRevenue: Record<string, number> = {};
      for (const p of db.products) {
        for (const o of revenueOrders) {
          for (const i of o.items) {
            if (i.productId === p.id) {
              const cat = p.categoryName || 'Diğer';
              catDist[cat] = (catDist[cat] || 0) + i.qty;
              catRevenue[cat] = (catRevenue[cat] || 0) + (i.price * i.qty);
            }
          }
        }
      }

      const totalItemsSold = Object.values(catDist).reduce((a, b) => a + b, 0) || 1;
      const palette = ['#FF4D6D', '#A78BFA', '#38BDF8', '#34D399', '#FBBF24', '#F472B6'];
      const categoriesDetailed = Object.entries(catDist)
        .sort((a, b) => b[1] - a[1])
        .map(([name, qty], idx) => ({
          name,
          qty,
          revenue: Math.round((catRevenue[name] || 0) * 100) / 100,
          percentage: Math.round((qty / totalItemsSold) * 100),
          color: palette[idx % palette.length]
        }));

      const totalRevenue = Math.round(revenueOrders.reduce((a: number, o: any) => a + o.total, 0) * 100) / 100;
      const aov = db.orders.length > 0 ? Math.round((totalRevenue / db.orders.length) * 100) / 100 : 0;

      return json(res, 200, {
        ok: true,
        stats: {
          revenue: totalRevenue,
          orders: db.orders.length,
          customers: db.users.filter((u: any) => u.role === 'customer').length,
          products: db.products.length,
          newsletter: db.newsletter.length,
          pendingOrders: db.orders.filter((o: any) => o.status === 'processing').length,
          pendingReviews: db.reviews.filter((r: any) => !r.approved).length,
          lowStock: db.products.filter((p: any) => p.stock <= 5),
          days,
          days30,
          revGrowth,
          ordGrowth,
          aov,
          catDist,
          categoriesDetailed
        }
      });
    }

    if (pathname === '/api/admin/orders' && method === 'GET') {
      const orders = [...db.orders].sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));
      return json(res, 200, { ok: true, orders });
    }
    const oUp = pathname.match(/^\/api\/admin\/orders\/([^/]+)$/);
    if (oUp && method === 'POST') {
      const o = db.orders.find((x: any) => x.id === decodeURIComponent(oUp[1]));
      if (!o) return sendError(res, 404, E('err.noOrder'));
      const b = await readBody(req);
      if (['processing', 'shipped', 'delivered', 'cancelled'].includes(b.status)) {
        if (o.status !== b.status) {
          if (b.status === 'cancelled') {
            for (const item of o.items) {
              const p = db.products.find((x: any) => x.id === item.productId);
              if (p) {
                p.stock += item.qty;
                saveProductToCloud(p).catch(() => {});
              }
            }
          } else if (o.status === 'cancelled') {
            for (const item of o.items) {
              const p = db.products.find((x: any) => x.id === item.productId);
              if (p) {
                p.stock = Math.max(0, p.stock - item.qty);
                saveProductToCloud(p).catch(() => {});
              }
            }
          }
          o.status = b.status;
        }
      }
      if (b.trackingNumber !== undefined) o.trackingNumber = String(b.trackingNumber).trim();
      if (b.carrier !== undefined) o.carrier = String(b.carrier).trim();
      if (b.adminNote !== undefined) o.adminNote = String(b.adminNote).trim();
      await saveOrderToCloud(o);
      await saveAsync();
      return json(res, 200, { ok: true, order: o });
    }
    if (pathname === '/api/admin/orders/clear-all' && method === 'POST') {
      const deletedCount = db.orders.length;
      const idsToDelete = (db.orders || []).map((o: any) => o.id);
      db.orders = [];
      for (const oid of idsToDelete) {
        await deleteOrderFromCloud(oid);
      }
      await saveAsync();
      return json(res, 200, { ok: true, message: 'Tüm siparişler başarıyla temizlendi.', deletedCount });
    }
    if (oUp && method === 'DELETE') {
      const id = decodeURIComponent(oUp[1]);
      const idx = db.orders.findIndex((x: any) => x.id === id);
      if (idx === -1) return sendError(res, 404, E('err.noOrder'));
      db.orders.splice(idx, 1);
      await deleteOrderFromCloud(id);
      await saveAsync();
      return json(res, 200, { ok: true });
    }

    if (pathname === '/api/admin/upload' && method === 'POST') {
      const b = await readBody(req);
      const rawImage = b.image || b.file || b.data;
      if (!rawImage) return sendError(res, 400, 'Görsel verisi bulunamadı.');
      const url = await saveUpload(String(rawImage));
      if (!url) return sendError(res, 400, 'Görsel yüklenemedi.');
      return json(res, 200, { ok: true, url });
    }

    if (pathname === '/api/admin/products' && method === 'GET') {
      const kw = (q.get('q') || '').toLowerCase();
      let list = [...db.products];
      if (kw) list = list.filter((p: any) => p.name.toLowerCase().includes(kw) || p.slug.includes(kw));
      return json(res, 200, { ok: true, products: list });
    }
    if (pathname === '/api/admin/products' && method === 'POST') {
      const b = await readBody(req);
      if (!b.name || !b.price) return sendError(res, 400, E('err.needName'));
      let slug = String(b.slug || b.name).toLowerCase().replace(/[çğıöşü]/g, (c) => ({ 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' }[c] || c)).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || uid('p');
      if (db.products.some((p: any) => p.slug === slug)) slug += '-' + Date.now().toString(36);
      
      let gallery: string[] = [];
      const rawGallery = Array.isArray(b.gallery) ? b.gallery : (Array.isArray(b.images) ? b.images : []);
      for (const item of rawGallery) {
        if (!item) continue;
        const saved = await saveUpload(item);
        if (saved && !gallery.includes(saved)) gallery.push(saved);
      }

      let image = '';
      if (b.image) {
        const rawIdx = rawGallery.indexOf(b.image);
        if (rawIdx !== -1 && gallery[rawIdx]) {
          image = gallery[rawIdx];
        } else {
          image = await saveUpload(b.image);
        }
      } else {
        image = gallery[0] || '';
      }
      if (image && !gallery.includes(image)) gallery.unshift(image);
      if (!gallery.length && image) gallery = [image];
      gallery = Array.from(new Set(gallery.filter(Boolean)));

      let parsedHighlights = Array.isArray(b.highlights) ? b.highlights.map(String).map(s => s.trim()).filter(Boolean) : (typeof b.highlights === 'string' ? b.highlights.split(',').map(s => s.trim()).filter(Boolean) : []);
      if (parsedHighlights.length === 0) {
        parsedHighlights = extractProductHighlights({
          name: b.name,
          category: b.category,
          description: b.description,
          longDescription: b.longDescription
        });
      }

      const p = {
        id: uid('p'), slug, name: String(b.name).trim(),
        category: b.category || 'ciftler', categoryName: b.categoryName || 'Genel',
        subcategory: b.subcategory ? String(b.subcategory).trim() : '',
        description: String(b.description || ''), longDescription: String(b.longDescription || b.description || ''),
        price: Math.max(0, Number(b.price)), oldPrice: b.oldPrice ? Number(b.oldPrice) : null,
        stock: Math.max(0, parseInt(b.stock, 10) || 0), rating: Number(b.rating) || 0, reviewCount: 0,
        featured: !!b.featured, isNew: !!b.isNew, bestSeller: !!b.bestSeller,
        highlights: parsedHighlights,
        image, gallery, tags: [], variants: ['standart'], createdAt: new Date().toISOString()
      };
      db.products.push(p);
      await saveProductToCloud(p);
      await saveAsync();
      return json(res, 200, { ok: true, product: p });
    }
    const pUp = pathname.match(/^\/api\/admin\/products\/([^/]+)$/);
    if (pUp && (method === 'POST' || method === 'PUT')) {
      const p = db.products.find((x: any) => x.id === decodeURIComponent(pUp[1]));
      if (!p) return sendError(res, 404, E('err.noProd'));
      const b = await readBody(req);
      const f = ['name', 'category', 'categoryName', 'subcategory', 'description', 'longDescription', 'price', 'oldPrice', 'stock', 'rating', 'featured', 'isNew', 'bestSeller', 'slug', 'highlights'];
      for (const k of f) if (b[k] !== undefined) {
        if (k === 'featured' || k === 'isNew' || k === 'bestSeller') {
          p[k] = !!b[k];
        } else if (k === 'highlights') {
          p[k] = Array.isArray(b[k]) ? b[k].map(String).map(s => s.trim()).filter(Boolean) : (typeof b[k] === 'string' ? b[k].split(',').map(s => s.trim()).filter(Boolean) : []);
        } else if (k === 'subcategory') {
          p[k] = b[k] ? String(b[k]).trim() : '';
        } else {
          p[k] = b[k];
        }
      }
      if (b.oldPrice === null || b.oldPrice === '') p.oldPrice = null;
      
      if (b.gallery !== undefined || b.images !== undefined) {
        const rawGallery = Array.isArray(b.gallery) ? b.gallery : (Array.isArray(b.images) ? b.images : []);
        const newGallery: string[] = [];
        for (const item of rawGallery) {
          if (!item) continue;
          const saved = await saveUpload(item);
          if (saved && !newGallery.includes(saved)) newGallery.push(saved);
        }
        if (newGallery.length) p.gallery = newGallery;
      }

      if (b.image) {
        const rawGallery = Array.isArray(b.gallery) ? b.gallery : (Array.isArray(b.images) ? b.images : []);
        const rawIdx = rawGallery.indexOf(b.image);
        if (rawIdx !== -1 && Array.isArray(p.gallery) && p.gallery[rawIdx]) {
          p.image = p.gallery[rawIdx];
        } else {
          const savedCover = await saveUpload(b.image);
          if (savedCover) p.image = savedCover;
        }
      }
      
      if (!Array.isArray(p.gallery) || !p.gallery.length) {
        p.gallery = [p.image || ''];
      }
      p.gallery = Array.from(new Set(p.gallery.filter(Boolean)));
      if (p.gallery && p.gallery.length && (!p.image || !p.gallery.includes(p.image))) {
        p.image = p.gallery[0];
      }

      if (!Array.isArray(p.highlights) || p.highlights.length === 0) {
        p.highlights = extractProductHighlights(p);
      }

      await saveProductToCloud(p);
      await saveAsync();
      return json(res, 200, { ok: true, product: p });
    }
    if (pathname === '/api/admin/sync-highlights' && method === 'POST') {
      let count = 0;
      for (const prod of db.products) {
        prod.highlights = extractProductHighlights(prod);
        await saveProductToCloud(prod);
        count++;
      }
      await saveAsync();
      return json(res, 200, { ok: true, count, products: db.products });
    }
    if (pUp && method === 'DELETE') {
      const id = decodeURIComponent(pUp[1]);
      const idx = db.products.findIndex((x: any) => x.id === id);
      if (idx === -1) return sendError(res, 404, E('err.noProd'));
      db.products.splice(idx, 1);
      for (const s of Object.values(sessions)) s.cart = (s.cart || []).filter((l: any) => l.productId !== id);
      persistSessions();
      await deleteProductFromCloud(id);
      await saveAsync();
      return json(res, 200, { ok: true });
    }

    if (pathname === '/api/admin/ai-polish' && method === 'POST') {
      const b = await readBody(req);
      const rawText = String(b.rawText || b.text || b.longDescription || b.description || '').trim();
      const name = String(b.name || '').trim();
      const category = String(b.category || 'ciftler').trim();

      if (!rawText && !name) {
        return sendError(res, 400, 'Dönüştürülecek ürün adı veya metin girilmedi.');
      }

      const ai = getAiClient();
      if (ai) {
        try {
          const prompt = `Aşağıda toptancıdan veya kullanıcının girdiği ham ürün bilgisi yer almaktadır.
Lütfen bu metni Türkiye'nin en seçkin lüks yetişkin sağlık ve yaşam mağazası LOVE SHOP standartlarına uygun, cezbedici, net, dürüst ve profesyonel bir e-ticaret metnine dönüştür.

Kategori: "${category}"

HAYATİ VE MUTLAK GÜVENLİK KURALLARI (SIFIR HALÜSİNASYON):
1. TÜKETİM VE KULLANIM GÜVENLİĞİ (EN YÜKSEK ÖNCELİK):
   - Eğer ürün bir damla, şurup veya sıvı takviye ise ve içecekle/ağızdan tüketiliyorsa (metinde içecek, suya damlatma, dilaltı vb. geçiyorsa): Highlights listesinin İLK sırasına kesinlikle "Ağızdan İçeceğe Karıştırılarak Tüketilir" koy.
   - Eğer ürün harici olarak cilde/bölgeye sürülen veya püskürtülen bir ürün ise (damla, krem, sprey, jel, yağ, serum): Highlights listesinin İLK sırasına mutlaka "YALNIZCA HARİCİ KULLANIM — KESİNLİKLE İÇİLMEZ" koy.
   - Kullanım Şekli Belirsizse: Metinde nasıl kullanılacağı açıkça yazmıyorsa ASLA süre, dakika veya doz uydurma! Sadece ambalaja yönlendir veya diğer net nitelikleri yaz.
2. TEKNİK ÖZELLİKLER VE SU GEÇİRMEZLİK:
   - SADECE metinde açıkça "IPX..." veya "su geçirmez" yazıyorsa su koruması kartı üret. Metinde yazmıyorsa ASLA IPX veya su geçirmezlik uydurma!
   - Motorlu olmayan ürünlere (dildo, anal plug, manken, sprey, krem, giyim, kelepçe) ASLA motor, titreşim, şarj veya IPX rozeti yazma!
   - Malzemeyi sadece metinde varsa çıkar (Örn: "Medikal Paslanmaz Çelik", "Borosilikat Medikal Cam", "%100 Medikal Silikon", "Realistik Medikal TPE").

Kurallar:
1. Ürün Adı: Net, estetik ve profesyonel olsun.
2. Kısa Açıklama (description): 1-2 cümlelik vurucu, öz, lüks bir tanıtım cümlesi.
3. Öne Çıkan Özellikler (highlights): 3 ila 4 adet NET, DOĞRU ve HAYATİ rozet özelliği.
4. Detaylı Açıklama (longDescription): Girişte akıcı ve lüks 1-2 paragraf; ardından madde imleriyle (•) toparlanmış detaylar ve güvenlik uyarısı.

Girdi Bilgileri:
Ürün Adı: ${name || 'Belirtilmedi'}
Kategori: ${category}
Ham İçerik:
${rawText || name}`;
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              systemInstruction: "Sen lüks e-ticaret markaları için kıdemli bir ürün metin yazarı ve içerik mimarısın. Toptancı metinlerini temizler, lüks ve akıcı satış diline dönüştürürsün.",
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  highlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  longDescription: { type: Type.STRING }
                },
                required: ['name', 'description', 'highlights', 'longDescription']
              }
            }
          });

          const parsed = JSON.parse(response.text?.trim() || '{}');
          if (parsed && (parsed.description || parsed.longDescription)) {
            return json(res, 200, {
              ok: true,
              ai: true,
              data: {
                name: parsed.name || name,
                description: parsed.description || '',
                highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
                longDescription: parsed.longDescription || ''
              }
            });
          }
        } catch (err) {
          console.error('[Admin AI Polish Error]', err);
        }
      }

      // Smart Fallback
      const fallback = fallbackPolishProduct(name, category, rawText);
      return json(res, 200, {
        ok: true,
        ai: false,
        fallback: true,
        data: fallback
      });
    }

    /* --- categories --- */
    if (!Array.isArray(db.categories)) db.categories = [];
    if (pathname === '/api/admin/categories' && method === 'GET') {
      return json(res, 200, {
        ok: true,
        categories: allCategories().map((c: any) => ({
          ...c,
          featuredOnHome: !!c.featuredOnHome,
          homeOrder: typeof c.homeOrder === 'number' ? c.homeOrder : 99,
          count: db.products.filter((p: any) => p.category === c.slug).length
        }))
      });
    }
    if (pathname === '/api/admin/categories' && method === 'POST') {
      const b = await readBody(req);
      const name = String(b.name || '').trim();
      if (!name) return sendError(res, 400, E('err.catName'));
      let slug = String(b.slug || name).trim().toLowerCase().replace(/i̇/g, 'i').replace(/[çğıöşü]/g, (c) => ({ 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' }[c] || c)).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || uid('ct');
      if (allCategories().some((c: any) => c.slug === slug)) return sendError(res, 409, `Bu bağlantı (slug: ${slug}) zaten başka bir kategori tarafından kullanılıyor. Lütfen farklı bir isim deneyin.`);
      let image = '';
      if (b.image) image = await saveUpload(b.image);
      const featuredOnHome = !!b.featuredOnHome;
      const homeOrder = typeof b.homeOrder === 'number' ? Number(b.homeOrder) : (featuredOnHome ? 1 : 99);
      const c = { id: uid('ct'), slug, name, image, featuredOnHome, homeOrder, createdAt: new Date().toISOString() };
      db.categories.push(c);
      await saveCategoryToCloud(c);
      await saveAsync();
      return json(res, 200, { ok: true, category: c });
    }
    const ctUp = pathname.match(/^\/api\/admin\/categories\/([^/]+)$/);
    if (ctUp && (method === 'POST' || method === 'PUT')) {
      let c = db.categories.find((x: any) => x.id === decodeURIComponent(ctUp[1]) || x.slug === decodeURIComponent(ctUp[1]));
      const b = await readBody(req);
      if (!c) {
        // If it was auto-detected from products but not in db.categories yet
        const foundAuto = allCategories().find((x: any) => x.id === decodeURIComponent(ctUp[1]) || x.slug === decodeURIComponent(ctUp[1]));
        if (foundAuto) {
          c = { id: foundAuto.id.startsWith('ct_') ? foundAuto.id : uid('ct'), slug: foundAuto.slug, name: foundAuto.name, image: foundAuto.image || '', featuredOnHome: false, homeOrder: 99, createdAt: new Date().toISOString() };
          db.categories.push(c);
        } else {
          return sendError(res, 404, E('err.catNone'));
        }
      }
      if (b.name) c.name = String(b.name).trim();
      if (b.image) c.image = await saveUpload(b.image);
      else if (b.useAutoCover) {
        const cover = db.products.find((p: any) => p.category === c.slug && p.bestSeller) || db.products.find((p: any) => p.category === c.slug);
        c.image = cover ? cover.image : '';
      }
      if (typeof b.featuredOnHome !== 'undefined') c.featuredOnHome = !!b.featuredOnHome;
      if (typeof b.homeOrder !== 'undefined') c.homeOrder = Number(b.homeOrder) || 1;
      await saveCategoryToCloud(c);
      await saveAsync();
      return json(res, 200, { ok: true, category: c });
    }

    const ctToggle = pathname.match(/^\/api\/admin\/categories\/([^/]+)\/home-toggle$/);
    if (ctToggle && method === 'POST') {
      let c = db.categories.find((x: any) => x.id === decodeURIComponent(ctToggle[1]) || x.slug === decodeURIComponent(ctToggle[1]));
      if (!c) {
        const foundAuto = allCategories().find((x: any) => x.id === decodeURIComponent(ctToggle[1]) || x.slug === decodeURIComponent(ctToggle[1]));
        if (foundAuto) {
          c = { id: foundAuto.id.startsWith('ct_') ? foundAuto.id : uid('ct'), slug: foundAuto.slug, name: foundAuto.name, image: foundAuto.image || '', featuredOnHome: false, homeOrder: 99, createdAt: new Date().toISOString() };
          db.categories.push(c);
        } else {
          return sendError(res, 404, E('err.catNone'));
        }
      }
      c.featuredOnHome = !c.featuredOnHome;
      if (c.featuredOnHome && (!c.homeOrder || c.homeOrder > 10)) c.homeOrder = 1;
      await saveCategoryToCloud(c);
      await saveAsync();
      return json(res, 200, { ok: true, category: c });
    }
    if (ctUp && method === 'DELETE') {
      const id = decodeURIComponent(ctUp[1]);
      const c = db.categories.find((x: any) => x.id === id);
      if (!c) return sendError(res, 404, E('err.catNone'));
      const count = db.products.filter((p: any) => p.category === c.slug).length;
      if (count > 0) return sendError(res, 400, `Bu kategoride ${count} ürün var. Önce ürünleri taşı veya sil.`);
      db.categories = db.categories.filter((x: any) => x.id !== id);
      await deleteCategoryFromCloud(id);
      await saveAsync();
      return json(res, 200, { ok: true });
    }

    /* --- wheel --- */
    if (pathname === '/api/admin/wheel' && method === 'GET') {
      try {
        const cloudWheel = await loadWheelSettingsFromCloud();
        if (Array.isArray(cloudWheel) && cloudWheel.length > 0) {
          if (!db.settings) db.settings = {};
          db.settings.wheelIds = cloudWheel;
        }
      } catch (err) {
        console.error('[Wheel GET] Error loading dedicated settings:', err);
      }
      if (!Array.isArray(db.settings.wheelIds)) db.settings.wheelIds = [];
      const wp = wheelProducts();
      return json(res, 200, { ok: true, ids: db.settings.wheelIds, products: wp });
    }
    if (pathname === '/api/admin/wheel' && method === 'POST') {
      if (!Array.isArray(db.settings.wheelIds)) db.settings.wheelIds = [];
      const b = await readBody(req);
      if (Array.isArray(b.ids)) {
        const clean: string[] = [], seen = new Set();
        for (const id of b.ids) {
          const p = db.products.find((x: any) => x.id === id);
          if (p && !seen.has(p.id)) { clean.push(p.id); seen.add(p.id); }
          if (clean.length >= 8) break;
        }
        db.settings.wheelIds = clean;
        await saveWheelSettingsToCloud(clean);
        await saveAsync();
        return json(res, 200, { ok: true, ids: db.settings.wheelIds });
      }
      if (b.toggle) {
        const p = db.products.find((x: any) => x.id === String(b.toggle));
        if (!p) return sendError(res, 404, E('err.noProd'));
        if (db.settings.wheelIds.includes(p.id)) db.settings.wheelIds = db.settings.wheelIds.filter((x: any) => x !== p.id);
        else {
          if (db.settings.wheelIds.length >= 8) return sendError(res, 400, E('err.wheelFull'));
          db.settings.wheelIds.push(p.id);
        }
        await saveWheelSettingsToCloud(db.settings.wheelIds);
        await saveAsync();
        return json(res, 200, { ok: true, ids: db.settings.wheelIds });
      }
      return sendError(res, 400, E('err.badReq'));
    }

    if (pathname === '/api/admin/reviews' && method === 'GET') {
      return json(res, 200, { ok: true, reviews: [...db.reviews].sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt)) });
    }
    const rApp = pathname.match(/^\/api\/admin\/reviews\/([^/]+)\/approve$/);
    if (rApp && method === 'POST') {
      const r = db.reviews.find((x: any) => x.id === decodeURIComponent(rApp[1]));
      if (!r) return sendError(res, 404, E('err.revNone'));
      r.approved = true;
      const p = db.products.find((x: any) => x.id === r.productId);
      if (p) {
        p.rating = Math.round(((p.rating || 0) * (p.reviewCount || 0) + r.rating) / ((p.reviewCount || 0) + 1) * 10) / 10;
        p.reviewCount = (p.reviewCount || 0) + 1;
        saveProductToCloud(p).catch(() => {});
      }
      await saveAsync();
      return json(res, 200, { ok: true });
    }
    const rDel = pathname.match(/^\/api\/admin\/reviews\/([^/]+)$/);
    if (rDel && method === 'DELETE') {
      const i = db.reviews.findIndex((x: any) => x.id === decodeURIComponent(rDel[1]));
      if (i === -1) return sendError(res, 404, E('err.revNone'));
      db.reviews.splice(i, 1); await saveAsync();
      return json(res, 200, { ok: true });
    }

    if (pathname === '/api/admin/coupons' && method === 'GET') return json(res, 200, { ok: true, coupons: db.coupons });
    if (pathname === '/api/admin/coupons' && method === 'POST') {
      const b = await readBody(req);
      const code = String(b.code || '').toUpperCase().trim();
      if (!code || code.length < 3) return sendError(res, 400, E('err.couponShort'));
      if (db.coupons.some((c: any) => c.code === code)) return sendError(res, 409, E('err.couponExists'));
      const c = { id: uid('c'), code, type: b.type === 'fixed' ? 'fixed' : 'percent', value: Math.max(0, Number(b.value) || 0), minTotal: Math.max(0, Number(b.minTotal) || 0), maxUses: Math.max(0, Number(b.maxUses) || 0), active: b.active !== false, used: 0 };
      db.coupons.push(c); await saveAsync();
      return json(res, 200, { ok: true, coupon: c });
    }
    const cUp = pathname.match(/^\/api\/admin\/coupons\/([^/]+)$/);
    if (cUp && (method === 'POST' || method === 'PUT')) {
      const c = db.coupons.find((x: any) => x.id === decodeURIComponent(cUp[1]));
      if (!c) return sendError(res, 404, E('err.couponNone'));
      const b = await readBody(req);
      if (b.active !== undefined) c.active = !!b.active;
      if (b.value !== undefined) c.value = Number(b.value);
      if (b.minTotal !== undefined) c.minTotal = Number(b.minTotal);
      if (b.maxUses !== undefined) c.maxUses = Math.max(0, Number(b.maxUses) || 0);
      await saveAsync();
      return json(res, 200, { ok: true });
    }
    if (cUp && method === 'DELETE') {
      const i = db.coupons.findIndex((x: any) => x.id === decodeURIComponent(cUp[1]));
      if (i === -1) return sendError(res, 404, E('err.couponNone'));
      db.coupons.splice(i, 1); await saveAsync();
      return json(res, 200, { ok: true });
    }

    if (pathname === '/api/admin/users' && method === 'GET') {
      return json(res, 200, { ok: true, users: db.users.map((u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt, orders: db.orders.filter((o: any) => o.userId === u.id).length })) });
    }
    const uUp = pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
    if (uUp && (method === 'POST' || method === 'PUT')) {
      const u = db.users.find((x: any) => x.id === decodeURIComponent(uUp[1]));
      if (!u) return sendError(res, 404, E('err.userNone'));
      if (u.id === adm.id) return sendError(res, 400, E('err.selfEdit'));
      const b = await readBody(req);
      if (b.role === 'admin') {
        if (!isAdminEmail(u.email)) {
          return sendError(res, 403, 'Yönetici rolü yalnızca ADMIN_EMAILS listesindeki güvenli e-posta adreslerine atanabilir.');
        }
        u.role = 'admin';
      } else if (b.role === 'customer') {
        u.role = 'customer';
      }
      await saveAsync();
      return json(res, 200, { ok: true });
    }
    if (uUp && method === 'DELETE') {
      const id = decodeURIComponent(uUp[1]);
      if (id === adm.id) return sendError(res, 400, E('err.selfDel'));
      const i = db.users.findIndex((x: any) => x.id === id);
      if (i === -1) return sendError(res, 404, E('err.userNone'));
      db.users.splice(i, 1); await saveAsync();
      return json(res, 200, { ok: true });
    }

    if (pathname === '/api/admin/settings' && method === 'GET') return json(res, 200, { ok: true, settings: db.settings });
    if (pathname === '/api/admin/settings' && (method === 'POST' || method === 'PUT')) {
      const b = await readBody(req);
      for (const k of ['storeName', 'announcement', 'supportEmail', 'supportPhone', 'instagram', 'whatsapp', 'address', 'mapsQuery']) if (b[k] !== undefined) db.settings[k] = String(b[k]);
      for (const k of ['freeShippingThreshold', 'shippingFee', 'kdvRate']) if (b[k] !== undefined) db.settings[k] = Number(b[k]) || 0;
      await saveSettingsToCloud(db.settings);
      await saveAsync();
      return json(res, 200, { ok: true, settings: db.settings });
    }

    if (pathname === '/api/admin/change-password' && method === 'POST') {
      const b = await readBody(req);
      const newPass = String(b.password || '').trim();
      if (!newPass || newPass.length < 6) return sendError(res, 400, 'Şifre en az 6 karakter olmalıdır.');
      const me = db.users.find((u: any) => u.id === adm.id);
      if (!me) return sendError(res, 404, 'Kullanıcı hesabı bulunamadı.');
      me.passwordHash = hashPassword(newPass);
      me.tokenVersion = (me.tokenVersion || 1) + 1;
      await saveAsync();
      return json(res, 200, { ok: true, message: 'Yönetici şifreniz başarıyla güncellendi.' });
    }

    if (pathname === '/api/admin/messages' && method === 'GET') return json(res, 200, { ok: true, messages: [...db.contact].reverse() });
    const msgMatch = pathname.match(/^\/api\/admin\/messages\/([^/]+)$/);
    if (msgMatch && method === 'DELETE') {
      const idx = db.contact.findIndex((x: any) => x.id === decodeURIComponent(msgMatch[1]));
      if (idx !== -1) { db.contact.splice(idx, 1); await saveAsync(); }
      return json(res, 200, { ok: true });
    }
    const nslMatch = pathname.match(/^\/api\/admin\/newsletter\/([^/]+)$/);
    if (nslMatch && method === 'DELETE') {
      const idx = db.newsletter.findIndex((x: any) => x.id === decodeURIComponent(nslMatch[1]));
      if (idx !== -1) { db.newsletter.splice(idx, 1); await saveAsync(); }
      return json(res, 200, { ok: true });
    }

    /* ================= POS / FİZİKSEL MAĞAZA KASA API ================= */
    if (pathname === '/api/admin/pos' && method === 'GET') {
      try {
        const cloudSales = await loadPosSalesFromCloud();
        if (Array.isArray(cloudSales) && cloudSales.length > 0) {
          const posMap = new Map();
          cloudSales.forEach((s: any) => s && s.id && posMap.set(s.id, s));
          (db.posSales || []).forEach((s: any) => {
            if (s && s.id && !posMap.has(s.id)) {
              posMap.set(s.id, s);
            }
          });
          db.posSales = Array.from(posMap.values()).sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        }
      } catch (err) {
        console.error('[POS GET] Error loading from cloud:', err);
      }
      if (!Array.isArray(db.posSales)) db.posSales = [];
      const sales = [...db.posSales].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return json(res, 200, { ok: true, sales, products: db.products.map((p: any) => ({ id: p.id, name: p.name, price: p.price, originalPrice: p.originalPrice, categoryName: p.categoryName, image: p.image })) });
    }

    if (pathname === '/api/admin/pos' && method === 'POST') {
      if (!Array.isArray(db.posSales)) db.posSales = [];
      const b = await readBody(req);
      const title = String(b.title || '').trim() || 'Mağaza Elden Satış';
      const paymentMethod = ['nakit', 'pos', 'havale'].includes(b.paymentMethod) ? b.paymentMethod : 'nakit';
      const items = Array.isArray(b.items) ? b.items.map((it: any) => ({
        productId: it.productId || null,
        title: String(it.title || 'Ürün').trim(),
        price: Math.max(0, Number(it.price) || 0),
        qty: Math.max(1, parseInt(it.qty, 10) || 1)
      })) : [];

      let total = Math.max(0, Number(b.total) || 0);
      if (items.length > 0 && total <= 0) {
        total = items.reduce((acc: number, it: any) => acc + (it.price * it.qty), 0);
      }
      if (total <= 0) {
        return sendError(res, 400, 'Satış tutarı 0 veya daha düşük olamaz.');
      }

      const newSale = {
        id: 'POS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase(),
        title,
        paymentMethod, // 'nakit' | 'pos' | 'havale'
        total: Math.round(total * 100) / 100,
        items,
        note: String(b.note || '').trim(),
        sellerName: adm.name || 'Mağaza Yetkilisi',
        sellerEmail: adm.email || '',
        createdAt: new Date().toISOString()
      };

      db.posSales.unshift(newSale);
      await savePosSaleToCloud(newSale);
      await saveAsync();
      return json(res, 201, { ok: true, sale: newSale });
    }

    const posDelMatch = pathname.match(/^\/api\/admin\/pos\/([^/]+)$/);
    if (posDelMatch && method === 'DELETE') {
      if (!Array.isArray(db.posSales)) db.posSales = [];
      const saleId = decodeURIComponent(posDelMatch[1]);
      const idx = db.posSales.findIndex((s: any) => s.id === saleId);
      if (idx === -1) return sendError(res, 404, 'Satış kaydı bulunamadı.');
      db.posSales.splice(idx, 1);
      await deletePosSaleFromCloud(saleId);
      await saveAsync();
      return json(res, 200, { ok: true });
    }
  }

  return sendError(res, 404, E('err.notFound404'));
}

/* ---------------- router ---------------- */
export const handler = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  // A+ Security Headers for Defense-in-Depth
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=()');

  let url: URL;
  let pathname = '/';
  try {
    url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    let rawPath = url.pathname;
    if (url.searchParams.has('__vpath')) {
      rawPath = '/' + url.searchParams.get('__vpath');
    }
    try {
      pathname = decodeURI(rawPath).replace(/\/+$/, '') || '/';
    } catch {
      pathname = rawPath.replace(/\/+$/, '') || '/';
    }
  } catch {
    url = new URL('/', 'http://localhost');
    pathname = '/';
  }

  // Ensure fresh database state on cold starts for API routes and dynamic pages
  if (pathname.startsWith('/api/') || pathname.startsWith('/admin') || pathname === '/' || pathname === '/magaza') {
    await ensureCloudDatabaseReady();
  } else {
    ensureCloudDatabaseReady().catch(() => {});
  }
  try {
    // 301 Permanent Redirects (Fixing 404s for Google Index & Legacy Links across all methods)
    if (pathname === '/love/iletisim' || pathname === '/love/iletisim/' || pathname === '/iletisim.html') {
      res.writeHead(301, { Location: '/iletisim' });
      return res.end();
    }
    if (pathname === '/love/hakkimizda' || pathname === '/love/hakkimizda/' || pathname === '/hakkimizda.html') {
      res.writeHead(301, { Location: '/hakkimizda' });
      return res.end();
    }
    if (pathname === '/love/magaza' || pathname === '/love/magaza/' || pathname === '/magaza.html' || pathname === '/urunler') {
      res.writeHead(301, { Location: '/magaza' });
      return res.end();
    }
    if (pathname.startsWith('/love/urun/')) {
      const pSlug = pathname.replace(/^\/love\/urun\//, '');
      res.writeHead(301, { Location: `/urun/${pSlug}` });
      return res.end();
    }
    if (pathname.startsWith('/love/kategori/') || pathname.startsWith('/love/kat/')) {
      const cSlug = pathname.replace(/^\/love\/(kategori|kat)\//, '');
      res.writeHead(301, { Location: `/magaza?kat=${cSlug}` });
      return res.end();
    }
    if (pathname.startsWith('/love/')) {
      const sub = pathname.replace(/^\/love\//, '');
      res.writeHead(301, { Location: sub ? `/${sub}` : '/' });
      return res.end();
    }
    if (pathname === '/love') {
      res.writeHead(301, { Location: '/' });
      return res.end();
    }
    if (pathname === '/contact' || pathname === '/contact.html') {
      res.writeHead(301, { Location: '/iletisim' });
      return res.end();
    }
    if (pathname === '/about' || pathname === '/about.html') {
      res.writeHead(301, { Location: '/hakkimizda' });
      return res.end();
    }
    if (pathname === '/shop' || pathname === '/shop.html' || pathname === '/products') {
      res.writeHead(301, { Location: '/magaza' });
      return res.end();
    }
    if (pathname === '/cart') {
      res.writeHead(301, { Location: '/sepet' });
      return res.end();
    }
    if (pathname === '/checkout') {
      res.writeHead(301, { Location: '/odeme' });
      return res.end();
    }

    if (pathname.startsWith('/api/')) return await handleApi(req, res, pathname, url);

    if (req.method === 'GET' || req.method === 'HEAD') {
      if (pathname === '/favicon.ico' || pathname === '/apple-touch-icon.png') {
        const fp = path.join(ROOT, 'public', pathname.replace(/^\//, ''));
        if (fs.existsSync(fp)) return serveStatic(req, res, pathname);
        return serveStatic(req, res, '/favicon.svg');
      }
      if (
        pathname.startsWith('/css/') ||
        pathname.startsWith('/js/') ||
        pathname.startsWith('/uploads/') ||
        pathname.startsWith('/media/') ||
        pathname.startsWith('/assets/') ||
        pathname.startsWith('/public/') ||
        (pathname.startsWith('/google') && !pathname.endsWith('.xml')) ||
        /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2|ttf|mp4|json|html|txt)$/i.test(pathname)
      ) {
        return serveStatic(req, res, pathname.replace(/^\/public/, ''));
      }
      
      if (pathname === '/robots.txt') {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'loveeroticshop.com';
        const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
        const baseUrl = `${proto}://${host}`;
        return res.end(`User-agent: *
Allow: /
Allow: /magaza
Allow: /urun/
Allow: /rehber
Allow: /rehber/
Allow: /hakkimizda
Allow: /iletisim
Allow: /css/
Allow: /js/
Allow: /assets/
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /sepet
Disallow: /odeme
Disallow: /hesap
Disallow: /profil

Sitemap: ${baseUrl}/sitemap.xml
`);
      }

      if (pathname === '/sitemap.xlm' || pathname === '/sitemap') {
        res.writeHead(301, { Location: '/sitemap.xml' });
        return res.end();
      }

      if (pathname === '/sitemap.xml') {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'loveeroticshop.com';
        const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
        const baseUrl = `${proto}://${host}`;
        const today = new Date().toISOString().split('T')[0];

        const staticUrls = [
          { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
          { loc: `${baseUrl}/magaza`, priority: '0.9', changefreq: 'daily' },
          { loc: `${baseUrl}/kargo-ve-teslimat`, priority: '0.9', changefreq: 'weekly' },
          { loc: `${baseUrl}/rehber`, priority: '0.9', changefreq: 'weekly' },
          { loc: `${baseUrl}/hakkimizda`, priority: '0.7', changefreq: 'monthly' },
          { loc: `${baseUrl}/iletisim`, priority: '0.7', changefreq: 'monthly' },
          { loc: `${baseUrl}/gizlilik-politikasi`, priority: '0.5', changefreq: 'monthly' },
          { loc: `${baseUrl}/kullanim-kosullari`, priority: '0.5', changefreq: 'monthly' }
        ];

        const catUrls = allCategories().map((c: any) => ({
          loc: `${baseUrl}/magaza?kategori=${encodeURIComponent(c.slug)}`,
          priority: '0.85',
          changefreq: 'weekly'
        }));

        const guideUrls = GUIDES.map(g => ({
          loc: `${baseUrl}/rehber/${g.slug}`,
          priority: '0.85',
          changefreq: 'weekly',
          lastmod: g.date
        }));

        const cityUrls = [
          {
            loc: `${baseUrl}/sehir/eskisehir`,
            priority: '0.85',
            changefreq: 'weekly',
            lastmod: today
          }
        ];

        const prodUrls = (db.products || []).map((p: any) => {
          let fullImg = p.image || '';
          if (fullImg && !fullImg.startsWith('http://') && !fullImg.startsWith('https://')) {
            fullImg = `${baseUrl}${fullImg.startsWith('/') ? '' : '/'}${fullImg}`;
          }
          return {
            loc: `${baseUrl}/urun/${esc(p.slug || p.id)}`,
            priority: '0.8',
            changefreq: 'daily',
            lastmod: today,
            image: fullImg,
            name: p.name
          };
        });

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticUrls.map(u => `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
${catUrls.map(u => `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
${cityUrls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
${guideUrls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
${prodUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.image ? `
    <image:image><image:loc>${esc(u.image)}</image:loc><image:title>${esc(u.name)}</image:title></image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;
        return res.end(sitemap);
      }

      if (pathname === '/google-feed.xml' || pathname === '/merchant-feed.xml') {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        const host = req.headers.host || 'loveeroticshop.com';
        const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
        const baseUrl = host.includes('localhost') ? `${proto}://${host}` : 'https://loveeroticshop.com';
        
        const approvedIds = ['p5bdb3e17409d', 'pbcfa6505bc8d', 'p5813616cd082'];
        const selectedProducts = (db.products || []).filter((p: any) => approvedIds.includes(p.id));
        
        const itemsXml = selectedProducts.map((p: any) => {
          let fullImg = p.image || '';
          if (fullImg && !fullImg.startsWith('http://') && !fullImg.startsWith('https://')) {
            fullImg = `${baseUrl}${fullImg.startsWith('/') ? '' : '/'}${fullImg}`;
          }
          const itemLink = `${baseUrl}/urun/${esc(p.slug || p.id)}`;
          const priceStr = `${Number(p.price || 0).toFixed(2)} TRY`;
          const cleanDesc = (p.description || p.shortDesc || p.name).replace(/<[^>]+>/g, '').trim();
          const shippingCost = Number(p.price || 0) >= (db.settings.freeShippingThreshold || COMMERCE_CONFIG.shipping.freeShippingThreshold) ? '0.00 TRY' : `${Number(db.settings.shippingFee || COMMERCE_CONFIG.shipping.defaultShippingFee).toFixed(2)} TRY`;
          
          return `    <item>
      <g:id>${esc(p.id)}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${cleanDesc}]]></g:description>
      <g:link>${itemLink}</g:link>
      <g:image_link>${esc(fullImg)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${p.stock > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${priceStr}</g:price>
      <g:brand>Love</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>TR</g:country>
        <g:service>Standart Hızlı Kargo</g:service>
        <g:price>${shippingCost}</g:price>
      </g:shipping>
    </item>`;
        }).join('\n');

        const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Love Erotik Shop - Google Alışveriş Kataloğu</title>
    <link>${baseUrl}</link>
    <description>Love Erotik Shop Onaylı Kişisel Bakım ve Masaj Ürünleri</description>
${itemsXml}
  </channel>
</rss>`;
        return res.end(xmlFeed);
      }

      if (pathname === '/local-inventory.xml' || pathname === '/local-feed.xml' || pathname === '/google-local-inventory.xml') {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        const host = req.headers.host || 'loveeroticshop.com';
        const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
        const baseUrl = host.includes('localhost') ? `${proto}://${host}` : 'https://loveeroticshop.com';
        
        // Store code query support, default to store code '1' or 'eskisehir'
        const urlObj = new URL(req.url || '/', `http://${host}`);
        const storeCode = urlObj.searchParams.get('store_code') || '1';
        
        const approvedIds = ['p5bdb3e17409d', 'pbcfa6505bc8d', 'p5813616cd082'];
        const selectedProducts = (db.products || []).filter((p: any) => approvedIds.includes(p.id));
        
        const localItemsXml = selectedProducts.map((p: any) => {
          const priceStr = `${Number(p.price || 0).toFixed(2)} TRY`;
          const qty = p.stock && p.stock > 0 ? p.stock : 15;
          return `    <item>
      <g:store_code>${esc(storeCode)}</g:store_code>
      <g:id>${esc(p.id)}</g:id>
      <g:price>${priceStr}</g:price>
      <g:availability>in_stock</g:availability>
      <g:quantity>${qty}</g:quantity>
    </item>`;
        }).join('\n');

        const xmlLocalFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Love Erotik Shop - Eskişehir Mağaza Yerel Envanteri</title>
    <link>${baseUrl}</link>
    <description>Eskişehir Fiziksel Mağaza Raf Envanter ve Stok Bilgisi</description>
${localItemsXml}
  </channel>
</rss>`;
        return res.end(xmlLocalFeed);
      }

      if (pathname === '/') return pageHome(req, res);
      if (pathname === '/magaza') return pageShop(req, res);
      const rev = pathname.match(/^\/urun\/([^/]+)\/yorum$/);
      if (rev) return pageReviewForm(req, res, decodeURIComponent(rev[1]));
      const pr = pathname.match(/^\/urun\/([^/]+)$/);
      if (pr) return pageProduct(req, res, decodeURIComponent(pr[1]));
      if (pathname === '/sepet') return pageCart(req, res);
      if (pathname === '/odeme') return pageCheckout(req, res);
      const th = pathname.match(/^\/tesekkurler\/([^/]+)$/);
      if (th) return pageThanks(req, res, decodeURIComponent(th[1]));
      if (pathname === '/giris') return pageLogin(req, res);
      if (pathname === '/kayit') return pageRegister(req, res);
      if (pathname === '/hesap') return pageAccount(req, res);
      if (pathname === '/profil') return pageProfile(req, res);
      if (pathname === '/rehber') return pageGuides(req, res);
      const guideMatch = pathname.match(/^\/rehber\/([^/]+)$/);
      if (guideMatch) return pageGuideDetail(req, res, decodeURIComponent(guideMatch[1]));
      if (pathname === '/kargo-ve-teslimat' || pathname === '/kargo' || pathname === '/kargo-takip') {
        return pageShippingAndDelivery(req, res);
      }
      if (pathname === '/sehir' || pathname === '/sehirler') {
        res.writeHead(301, { Location: '/kargo-ve-teslimat' });
        return res.end();
      }
      const cityMatch = pathname.match(/^\/sehir\/([^/]+)$/);
      if (cityMatch) return pageCityLanding(req, res, decodeURIComponent(cityMatch[1]));
      if (pathname === '/hakkimizda') return pageAbout(req, res);
      if (pathname === '/iletisim') return pageContact(req, res);
      if (pathname === '/admin' || pathname === '/admin/login') return pageAdmin(req, res);

      if (pathname === '/gizlilik' || pathname === '/gizlilik-politikasi' || pathname === '/privacy-policy' || pathname === '/privacy' || pathname === '/kvkk' || pathname === '/kvkk-aydinlatma-metni') return pagePrivacy(req, res);
      if (pathname === '/kullanim-kosullari' || pathname === '/terms-of-service' || pathname === '/mesafeli-satis' || pathname === '/mesafeli-satis-sozlesmesi' || pathname === '/terms' || pathname === '/sozlesme' || pathname === '/satis-sozlesmesi') return pageTerms(req, res);
      if (pathname === '/teslimat' || pathname === '/teslimat-ve-iade') {
        res.writeHead(301, { Location: '/kargo-ve-teslimat' });
        return res.end();
      }
      if (pathname === '/iade') {
        res.writeHead(302, { Location: '/hakkimizda#iade' });
        return res.end();
      }
      if (pathname === '/sss' || pathname === '/faq') {
        res.writeHead(302, { Location: '/hakkimizda#iade' });
        return res.end();
      }

      
    }
    if (pathname.startsWith('/api/')) return await handleApi(req, res, pathname, url);
    const nf = pageCtx(req);
    const nfT = nf.t;
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(layout('404', `<div class="success-wrap"><div class="success-card">
  <div class="success-icon">🫣</div>
  <h1>${nfT('404.h')}</h1>
  <p>${nfT('404.p')}</p>
  <div style="margin-top:22px"><a href="/" class="btn btn-primary">${nfT('404.home')}</a> <a href="/magaza" class="btn btn-ghost" style="margin-left:8px">${nfT('404.shop')}</a></div>
</div></div>`, { noChrome: false }, nf));
  } catch (e: any) {
    const cLang = getCookieValue(req, 'ls_lang') === 'en' ? 'en' : 'tr';
    if (e.message === 'BODY_TOO_LARGE') return sendError(res, 413, errT(cLang, 'err.tooLarge'));
    if (e.message === 'BAD_JSON') return sendError(res, 400, errT(cLang, 'err.badJson'));
    console.error(e);
    return sendError(res, 500, errT(cLang, 'err.server'));
  }
};

const server = http.createServer(handler);

if (!process.env.VERCEL) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`LOVE SHOP ready on http://0.0.0.0:${PORT}`);
    console.log(`Admin paneli: http://localhost:${PORT}/admin`);
    console.log(`Admin yetkili e-posta: cemal.ulas@gmail.com`);
  });
}

export default handler;

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { scheduleCloudFirestoreSave, flushPendingSave } from './firebase.js';

const require = createRequire(import.meta.url);

export const VERCEL_BLOB_MIGRATION_MAP = {
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

export function normalizeBlobImages(target) {
  if (!target || typeof target !== 'object') return target;
  if (Array.isArray(target.products)) {
    for (const p of target.products) {
      if (p.image && VERCEL_BLOB_MIGRATION_MAP[p.image]) {
        p.image = VERCEL_BLOB_MIGRATION_MAP[p.image];
      }
      if (Array.isArray(p.images)) {
        p.images = p.images.map(img => VERCEL_BLOB_MIGRATION_MAP[img] || img);
      }
      if (Array.isArray(p.gallery)) {
        p.gallery = p.gallery.map(img => VERCEL_BLOB_MIGRATION_MAP[img] || img);
      }
    }
  }
  if (Array.isArray(target.categories)) {
    for (const c of target.categories) {
      if (c.image && VERCEL_BLOB_MIGRATION_MAP[c.image]) {
        c.image = VERCEL_BLOB_MIGRATION_MAP[c.image];
      }
    }
  }
  return target;
}

let seedDbData = null;
try {
  seedDbData = normalizeBlobImages(require('../data/db.json'));
} catch (e) {
  seedDbData = null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_DIR = path.join(__dirname, '..', 'data');
export const DB_FILE = path.join(DATA_DIR, 'db.json');

let db = null;

export function setMemoryDb(newDb, persistLocal = true) {
  if (newDb && typeof newDb === 'object') {
    normalizeBlobImages(newDb);
    if (!Array.isArray(newDb.posSales)) newDb.posSales = [];
    if (!Array.isArray(newDb.orders)) newDb.orders = [];

    if (db && typeof db === 'object') {
      // 1. Merge posSales so no in-memory physical cashier record is lost
      const curPos = Array.isArray(db.posSales) ? db.posSales : [];
      const newPos = Array.isArray(newDb.posSales) ? newDb.posSales : [];
      const posMap = new Map();
      curPos.forEach((s) => s && s.id && posMap.set(s.id, s));
      newPos.forEach((s) => s && s.id && posMap.set(s.id, s));
      newDb.posSales = Array.from(posMap.values()).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      // 2. Merge orders so no customer order is lost
      const curOrders = Array.isArray(db.orders) ? db.orders : [];
      const newOrders = Array.isArray(newDb.orders) ? newDb.orders : [];
      const orderMap = new Map();
      curOrders.forEach((o) => o && o.id && orderMap.set(o.id, o));
      newOrders.forEach((o) => o && o.id && orderMap.set(o.id, o));
      newDb.orders = Array.from(orderMap.values()).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      // 3. Preserve store settings so recent changes (such as shipping fee) are not lost on cloud sync
      if (!newDb.settings) newDb.settings = {};
      if (db.settings && typeof db.settings === 'object') {
        newDb.settings = { ...newDb.settings, ...db.settings };
      }
      if (Array.isArray(db.settings?.wheelIds) && db.settings.wheelIds.length > 0) {
        newDb.settings.wheelIds = db.settings.wheelIds;
      }

      // 4. Preserve highest sequence counters so IDs never roll backwards
      if (db.meta && typeof db.meta === 'object' && db.meta.seq) {
        if (!newDb.meta) newDb.meta = { createdAt: new Date().toISOString(), seq: { product: 0, order: 0, pos: 0 } };
        if (!newDb.meta.seq) newDb.meta.seq = { product: 0, order: 0, pos: 0 };
        newDb.meta.seq.order = Math.max(newDb.meta.seq.order || 0, db.meta.seq.order || 0);
        newDb.meta.seq.product = Math.max(newDb.meta.seq.product || 0, db.meta.seq.product || 0);
        newDb.meta.seq.pos = Math.max(newDb.meta.seq.pos || 0, db.meta.seq.pos || 0);
      }

      Object.keys(db).forEach((k) => delete db[k]);
      Object.assign(db, newDb);
    } else {
      db = newDb;
    }
    if (persistLocal) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        const tmp = DB_FILE + '.tmp';
        fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
        fs.renameSync(tmp, DB_FILE);
      } catch (err) {}
    }
  }
}

function empty() {
  return {
    users: [],
    products: [],
    categories: [],
    orders: [],
    posSales: [],
    coupons: [],
    reviews: [],
    newsletter: [],
    contact: [],
    settings: {
      storeName: 'Love.',
      announcement: 'WHATSAPP SİPARİŞ + MAĞAZADA ÖDEME — GİZLİ PAKETLEME GARANTİSİ',
      freeShippingThreshold: 750,
      shippingFee: 49.9,
      kdvRate: 20,
      supportEmail: 'info@loveshop.com.tr',
      supportPhone: '+90 543 633 13 25',
      whatsapp: 'https://wa.me/905436331325',
      address: 'İsmet İnönü-1 Cd. No:52/2 (İsmet İnönü Tramvay Durağı Karşısı, Watsons & Yves Rocher Yanı), Ilgaz İş Hanı Kat:1 Daire:2, 26170 Tepebaşı/Eskişehir',
      mapsQuery: encodeURIComponent('Love Sex Shop Eskişehir Erotik Shop'),
      instagram: '@loveshop.tr',
      wheelIds: []
    },
    meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1, seq: { product: 0, order: 0, pos: 0 } }
  };
}

export function load() {
  if (db && Array.isArray(db.products) && db.products.length > 0) {
    if (!Array.isArray(db.posSales)) db.posSales = [];
    return db;
  }
  try {
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) {
    db = null;
  }
  if (!db || !Array.isArray(db.products) || db.products.length === 0) {
    if (seedDbData && Array.isArray(seedDbData.products) && seedDbData.products.length > 0) {
      db = JSON.parse(JSON.stringify(seedDbData));
    } else {
      db = empty();
    }
  }
  if (!Array.isArray(db.posSales)) db.posSales = [];
  normalizeBlobImages(db);
  return db;
}

export function saveLocal() {
  if (db) {
    normalizeBlobImages(db);
    if (!db.meta) db.meta = { createdAt: new Date().toISOString(), seq: { product: 0, order: 0 } };
    db.meta.updatedAt = new Date().toISOString();
  }
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    fs.renameSync(tmp, DB_FILE);
  } catch (err) {
    // Read-only filesystem
  }
}

export function save() {
  if (db) {
    normalizeBlobImages(db);
    if (!db.meta) db.meta = { createdAt: new Date().toISOString(), seq: { product: 0, order: 0 } };
    db.meta.updatedAt = new Date().toISOString();
    db.meta.version = (db.meta.version || 0) + 1;
  }
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    fs.renameSync(tmp, DB_FILE);
  } catch (err) {
    // Read-only filesystem
  }
  if (db) {
    scheduleCloudFirestoreSave(db);
  }
}

export async function saveAsync() {
  save();
  return flushPendingSave();
}

export function uid(prefix) {
  return (prefix || '') + crypto.randomBytes(6).toString('hex');
}

function getSecret() {
  const SECRET_FILE = path.join(DATA_DIR, 'secret.txt');
  try { return fs.readFileSync(SECRET_FILE, 'utf8'); }
  catch {
    const s = 'loveshop_secret_key_2026';
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(SECRET_FILE, s);
    } catch (e) {}
    return s;
  }
}

export function hashPassword(s) {
  return crypto.createHash('sha256').update(getSecret() + ':' + s).digest('hex');
}

export function nextId(kind) {
  db = load();
  if (!db.meta) db.meta = { createdAt: new Date().toISOString(), seq: { product: 0, order: 0, pos: 0 } };
  if (!db.meta.seq) db.meta.seq = { product: 0, order: 0, pos: 0 };

  if (kind === 'order') {
    // 1. Calculate max order number from all currently existing orders in db.orders
    let maxOrderNum = 1000;
    if (Array.isArray(db.orders)) {
      for (const o of db.orders) {
        if (o && o.id) {
          const match = String(o.id).match(/LS-(\d+)/i);
          if (match) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > maxOrderNum) {
              maxOrderNum = num;
            }
          }
        }
      }
    }
    // 2. Also compare with current seq number
    const seqNum = 1000 + (db.meta.seq.order || 0);
    const highestBase = Math.max(maxOrderNum, seqNum);
    let nextNum = highestBase + 1;

    // 3. Double check against collision in db.orders
    if (Array.isArray(db.orders)) {
      const existingIds = new Set(db.orders.map((o) => o && o.id));
      while (existingIds.has('LS-' + nextNum)) {
        nextNum++;
      }
    }

    db.meta.seq.order = nextNum - 1000;
    saveLocal();
    return db.meta.seq.order;
  }

  db.meta.seq[kind] = (db.meta.seq[kind] || 0) + 1;
  saveLocal();
  return db.meta.seq[kind];
}

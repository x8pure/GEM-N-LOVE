import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { scheduleCloudFirestoreSave, flushPendingSave } from './firebase.js';

const require = createRequire(import.meta.url);
let seedDbData = null;
try {
  seedDbData = require('../data/db.json');
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
  return db;
}

export function saveLocal() {
  if (db) {
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

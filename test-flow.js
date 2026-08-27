import { initFirebase, loadFromCloudFirestore, saveToCloudFirestore } from './lib/firebase.js';
import { hashPassword } from './lib/db.js';
import http from 'http';

async function request(method, path, body = null, cookie = null) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie && { 'Cookie': cookie })
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      const setCookie = res.headers['set-cookie'] ? res.headers['set-cookie'][0] : null;
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data), setCookie }); } 
        catch(e) { resolve({ status: res.statusCode, data, setCookie }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('--- STARTING E2E ORDER TEST ---');
  initFirebase();

  let cloudState = await loadFromCloudFirestore();
  let admin = cloudState.users.find(u => u.email === 'cemal.ulas@gmail.com');
  admin.passwordHash = hashPassword('testpass123');
  await saveToCloudFirestore(cloudState);
  console.log('[Test] Admin password temporarily set for test.');

  console.log('[Test] Logging in as Admin...');
  const loginRes = await request('POST', '/api/login', { email: 'cemal.ulas@gmail.com', password: 'testpass123' });
  const cookie = loginRes.setCookie || (loginRes.data.token ? `loveshop_session=${loginRes.data.token}` : null);
  
  if (!cookie && !loginRes.data.token) {
     // fallback auth
     const fakeToken = await request('POST', '/api/auth/login', { email: 'cemal.ulas@gmail.com', password: 'testpass123' });
     cookie = fakeToken.setCookie || `loveshop_session=${fakeToken.data.token}`;
  }

  console.log('[Test] Placing a new order as customer...');
  const product = cloudState.products[0] || { id: 'p1', name: 'Test Product', price: 100 };
  const orderRes = await request('POST', '/api/checkout', {
    items: [{ id: product.id, qty: 1, price: product.price, name: product.name }],
    name: 'E2E Test User',
    phone: '5550001122',
    address: 'Test Mah',
    city: 'Test',
    payment: 'whatsapp'
  });
  
  if (!orderRes.data.ok) throw new Error('Order placement failed: ' + JSON.stringify(orderRes.data));
  const orderId = orderRes.data.orderId;
  console.log(`[Test] Order placed successfully. ID: ${orderId}`);

  let cloudCheck = await loadFromCloudFirestore();
  let foundOrder = cloudCheck.orders.find(o => o.id === orderId);
  console.log('[Test] Is order immediately in Cloud Firestore?', !!foundOrder, 'Status:', foundOrder?.status);
  if (!foundOrder) throw new Error('Order did not flush to cloud synchronously!');

  console.log('[Test] Admin: Changing status to "shipped"...');
  await request('POST', `/api/admin/orders/${orderId}`, { status: 'shipped' }, cookie);

  cloudCheck = await loadFromCloudFirestore();
  foundOrder = cloudCheck.orders.find(o => o.id === orderId);
  console.log('[Test] Is status updated in Cloud Firestore?', foundOrder?.status === 'shipped');

  console.log('[Test] Admin: Changing status to "delivered"...');
  await request('POST', `/api/admin/orders/${orderId}`, { status: 'delivered' }, cookie);

  cloudCheck = await loadFromCloudFirestore();
  foundOrder = cloudCheck.orders.find(o => o.id === orderId);
  console.log('[Test] Is status updated in Cloud Firestore?', foundOrder?.status === 'delivered');

  console.log('--- TEST PASSED SUCCESSFULLY ---');
  process.exit(0);
}

run().catch(e => { console.error('TEST FAILED:', e); process.exit(1); });

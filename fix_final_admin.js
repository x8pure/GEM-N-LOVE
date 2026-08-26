import { hashPassword, load, save } from './lib/db.js';
import { loadFromCloudFirestore, saveToCloudFirestore } from './lib/firebase.js';

async function fix() {
  const newPass = hashPassword('admin123');
  
  let db = load();
  const a = db.users.find(u => u.email === 'admin@loveshop.com.tr');
  if (a) a.passwordHash = newPass;
  
  const g = db.users.find(u => u.email === 'x8pure@gmail.com');
  if (g) g.role = 'admin';
  
  save();

  const c = await loadFromCloudFirestore();
  if (c && c.users) {
    const ca = c.users.find(u => u.email === 'admin@loveshop.com.tr');
    if (ca) ca.passwordHash = newPass;
    const cg = c.users.find(u => u.email === 'x8pure@gmail.com');
    if (cg) cg.role = 'admin';
    await saveToCloudFirestore(c);
  }
}
fix();

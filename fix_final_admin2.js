import { hashPassword, load, save, setMemoryDb } from './lib/db.js';
import { loadFromCloudFirestore, saveToCloudFirestore } from './lib/firebase.js';

async function fix() {
  const newPass = hashPassword('admin123');
  
  let db = load();
  if (!db.users) db.users = [];
  
  const a = db.users.find(u => u.email === 'admin@loveshop.com.tr');
  if (a) {
    a.passwordHash = newPass;
  } else {
    db.users.push({
      id: 'u5ba8df5754d3',
      email: 'admin@loveshop.com.tr',
      passwordHash: newPass,
      name: 'Mağaza Yönetimi',
      role: 'admin',
      createdAt: new Date().toISOString(),
      addresses: []
    });
  }
  
  const g = db.users.find(u => u.email === 'x8pure@gmail.com');
  if (g) g.role = 'admin';

  if (!db.categories || db.categories.length === 0) {
    db.categories = [
        { "id": "c1", "slug": "vibratori", "name": "Vibratörler", "image": "", "featuredOnHome": true, "homeOrder": 1 },
        { "id": "c2", "slug": "cift", "name": "Çiftler İçin", "image": "", "featuredOnHome": true, "homeOrder": 2 },
        { "id": "c3", "slug": "kozmetik", "name": "Kozmetik & Bakım", "image": "", "featuredOnHome": true, "homeOrder": 3 },
        { "id": "c4", "slug": "fantezi", "name": "Fantasy & Kostüm", "image": "", "featuredOnHome": false, "homeOrder": 4 },
        { "id": "c5", "slug": "oyun", "name": "Oyunlar & Aksesuar", "image": "", "featuredOnHome": false, "homeOrder": 5 }
    ];
  }
  
  save();

  const c = await loadFromCloudFirestore() || db;
  c.users = db.users;
  c.categories = db.categories;
  await saveToCloudFirestore(c);
  console.log("Fixed DB users/categories to cloud/local!");
}
fix();

import { loadFromCloudFirestore, saveToCloudFirestore } from './lib/firebase.js';

async function fix() {
  const c = await loadFromCloudFirestore();
  if (c) {
    if (!c.users) c.users = [];
    // Ensure admin exists
    const adminExists = c.users.find(u => u.role === 'admin' || u.email === 'admin@loveshop.com.tr');
    if (!adminExists) {
      c.users.push({
        "id": "u5ba8df5754d3",
        "email": "admin@loveshop.com.tr",
        "passwordHash": "9986abca34f4654f2d3cf9ed9c7d19f1730ee04109451b1ce1b54dd95db7d631",
        "name": "Mağaza Yönetimi",
        "role": "admin",
        "createdAt": "2026-08-26T14:02:46.012Z",
        "addresses": []
      });
    }
    
    // Check if x8pure is there, make them admin just in case?
    const x8 = c.users.find(u => u.email === 'x8pure@gmail.com');
    if (x8) {
      x8.role = 'admin';
    }

    await saveToCloudFirestore(c);
    console.log("Cloud updated!");
  }
}
fix();

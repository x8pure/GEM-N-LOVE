import { load, save, setMemoryDb } from './lib/db.js';
import { loadFromCloudFirestore, saveToCloudFirestore } from './lib/firebase.js';

async function fix() {
  const db = load(); // Gets local DB with the fixed users/cats
  if (!db.users || db.users.length === 0) {
    console.log("Local users are empty too, applying emergency fix...");
    db.users = [
      {
        "id": "u5ba8df5754d3",
        "email": "admin@loveshop.com.tr",
        "passwordHash": "9986abca34f4654f2d3cf9ed9c7d19f1730ee04109451b1ce1b54dd95db7d631",
        "name": "Mağaza Yönetimi",
        "role": "admin",
        "createdAt": "2026-08-26T14:02:46.012Z",
        "addresses": []
      }
    ];
    db.categories = [
        { "id": "c1", "slug": "vibratori", "name": "Vibratörler", "image": "", "featuredOnHome": true, "homeOrder": 1 },
        { "id": "c2", "slug": "cift", "name": "Çiftler İçin", "image": "", "featuredOnHome": true, "homeOrder": 2 },
        { "id": "c3", "slug": "kozmetik", "name": "Kozmetik & Bakım", "image": "", "featuredOnHome": true, "homeOrder": 3 },
        { "id": "c4", "slug": "fantezi", "name": "Fantasy & Kostüm", "image": "", "featuredOnHome": false, "homeOrder": 4 },
        { "id": "c5", "slug": "oyun", "name": "Oyunlar & Aksesuar", "image": "", "featuredOnHome": false, "homeOrder": 5 }
    ];
    save();
  }
  
  const cloudState = await loadFromCloudFirestore();
  if (cloudState) {
    cloudState.users = db.users;
    cloudState.categories = db.categories;
    cloudState.products = [];
    await saveToCloudFirestore(cloudState);
    console.log("Cloud users and categories restored to match local.");
  }
}
fix();

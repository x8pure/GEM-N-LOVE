import fs from 'fs';
import { load, save } from './lib/db.js';

let db = load();
db.users = [
  {
    "id": "u5ba8df5754d3",
    "email": "admin@loveshop.com.tr",
    "passwordHash": "9986abca34f4654f2d3cf9ed9c7d19f1730ee04109451b1ce1b54dd95db7d631",
    "name": "Mağaza Yönetimi",
    "role": "admin",
    "createdAt": "2026-08-26T14:02:46.012Z",
    "addresses": []
  },
  {
    "id": "u40ad1297d1db",
    "email": "demo@loveshop.com.tr",
    "passwordHash": "a928a75120e800047cc4bc3f3b79b4ae52cf0b67cf90af9c4e0631bf5f2feab1",
    "name": "Demo Müşteri",
    "role": "customer",
    "createdAt": "2026-08-26T14:02:46.012Z",
    "addresses": [
      {
        "title": "Ev",
        "city": "İstanbul",
        "district": "Kadıköy",
        "fullAddress": "Caferağa Mah. Moda Cad. No:123 D:4",
        "phone": "0532 123 45 67"
      }
    ]
  }
];

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
console.log("Fixed users and categories.");

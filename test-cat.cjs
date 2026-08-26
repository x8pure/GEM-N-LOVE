const fs = require('fs');
const DB_FILE = './data/db.json';
const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

function allCategories() {
  const cats = Array.isArray(db.categories) ? [...db.categories] : [];
  const known = new Set(cats.map((c) => c.slug));
  for (const p of db.products || []) {
    if (p.category && !known.has(p.category)) {
      known.add(p.category);
      cats.push({ id: 'ct_' + p.category, slug: p.category, name: p.categoryName || p.category, image: '', featuredOnHome: false, homeOrder: 99, createdAt: p.createdAt });
    }
  }
  return cats;
}
console.log(allCategories().map(c => c.slug));

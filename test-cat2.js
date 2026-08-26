import fs from 'fs';
const db = JSON.parse(fs.readFileSync('data/db.json'));
function allCategories() {
  const cats = Array.isArray(db.categories) ? [...db.categories] : [];
  const known = new Set(cats.map((c) => c.slug));
  for (const p of db.products || []) {
    if (p.category && !known.has(p.category)) {
      known.add(p.category);
      cats.push({ id: 'ct_' + p.category, slug: p.category, name: p.categoryName || p.category });
    }
  }
  return cats;
}
let slug = "yeni-kategori";
console.log(allCategories().some(c => c.slug === slug));

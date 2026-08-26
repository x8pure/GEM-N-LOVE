import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.products.forEach(p => {
  p.image = '';
  p.gallery = [];
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('All product images wiped from db.json');

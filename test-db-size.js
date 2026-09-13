import fs from 'fs';
import { loadFromCloudFirestore } from './lib/firebase.js';

async function main() {
  console.log("Loading state...");
  const db = await loadFromCloudFirestore();
  if (db) {
    console.log("Products count:", db.products?.length);
    console.log("Orders count:", db.orders?.length);
    let hasBase64 = false;
    db.products?.forEach(p => {
      if (p.image?.includes('base64')) hasBase64 = true;
      if (p.images?.some(img => img.includes('base64'))) hasBase64 = true;
    });
    console.log("Products contain base64?", hasBase64);
    console.log("Total DB JSON size:", JSON.stringify(db).length, "bytes");
  }
}
main();

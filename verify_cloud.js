import { loadFromCloudFirestore } from './lib/firebase.js';

async function verify() {
  const c = await loadFromCloudFirestore();
  console.log(`FINAL CLOUD STATE - Products: ${c?.products?.length}, Users: ${c?.users?.length}, Categories: ${c?.categories?.length}`);
}
verify();

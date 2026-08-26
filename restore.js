import fs from 'fs';
import { loadFromCloudFirestore } from './lib/firebase.js';

async function check() {
  const c = await loadFromCloudFirestore();
  console.log("Cloud keys:", c ? Object.keys(c) : "null");
  console.log("Cloud users:", c?.users?.length);
  console.log("Cloud cats:", c?.categories?.length);
}
check();

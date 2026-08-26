import { load, saveToCloudFirestore } from './lib/firebase.js';
import { load as loadDb, save as saveDb, setMemoryDb } from './lib/db.js';
import { loadFromCloudFirestore } from './lib/firebase.js';

async function run() {
  const cloudState = await loadFromCloudFirestore();
  if (cloudState) {
    cloudState.products = [];
    setMemoryDb(cloudState);
    await saveToCloudFirestore(cloudState);
    console.log("Wiped from cloud!");
  } else {
    let db = loadDb();
    db.products = [];
    saveDb();
    console.log("Wiped locally.");
  }
}
run();

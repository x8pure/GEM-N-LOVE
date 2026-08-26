import { load, save, setMemoryDb } from './lib/db.js';
import { loadFromCloudFirestore, saveToCloudFirestore } from './lib/firebase.js';

async function run() {
  const cloudState = await loadFromCloudFirestore();
  if (cloudState) {
    cloudState.products = [];
    setMemoryDb(cloudState);
    await saveToCloudFirestore(cloudState);
    console.log("Wiped all products from cloud database!");
  } else {
    // try local db load
    const db = load();
    db.products = [];
    save();
    console.log("Wiped all products from local database (which triggered cloud sync via save)!");
  }
}
run();

import { load, save, setMemoryDb } from './lib/db.js';
import { loadFromCloudFirestore, saveToCloudFirestore } from './lib/firebase.js';

async function run() {
  let cloudState = await loadFromCloudFirestore();
  if (!cloudState) cloudState = load();

  if (cloudState && cloudState.products) {
    cloudState.products.forEach(p => {
      p.image = '';
      p.gallery = [];
    });
    setMemoryDb(cloudState);
    await saveToCloudFirestore(cloudState);
    console.log("Wiped all images from products.");
  }
}
run();

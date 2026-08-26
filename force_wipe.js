import { loadFromCloudFirestore, saveToCloudFirestore } from './lib/firebase.js';

async function wipe() {
  const state = await loadFromCloudFirestore();
  if (state) {
    console.log(`Before: ${state.products?.length} products, ${state.users?.length} users, ${state.categories?.length} cats`);
    state.products = [];
    await saveToCloudFirestore(state);
    console.log("Products wiped from cloud successfully.");
  } else {
    console.log("No cloud state found.");
  }
}
wipe();

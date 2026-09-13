import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import fs from 'fs';

const raw = fs.readFileSync('firebase-applet-config.json', 'utf-8');
const config = JSON.parse(raw);
const app = initializeApp({
  projectId: config.projectId,
  apiKey: config.apiKey,
  storageBucket: config.projectId + '.appspot.com',
});
const storage = getStorage(app);
const testRef = ref(storage, 'test.txt');

async function test() {
  try {
    await uploadString(testRef, 'hello world', 'raw', { contentType: 'text/plain' });
    const url = await getDownloadURL(testRef);
    console.log("Success! URL:", url);
  } catch (err) {
    console.error("Storage upload failed:", err);
  }
}
test();

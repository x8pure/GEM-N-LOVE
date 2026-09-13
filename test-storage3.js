import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import fs from 'fs';

const raw = fs.readFileSync('firebase-applet-config.json', 'utf-8');
const config = JSON.parse(raw);
const app = initializeApp({
  projectId: config.projectId,
  apiKey: config.apiKey,
  storageBucket: config.storageBucket,
});
console.log("Bucket:", config.storageBucket);

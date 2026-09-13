import fs from 'fs';
const raw = fs.readFileSync('firebase-applet-config.json', 'utf-8');
const config = JSON.parse(raw);
console.log("Firebase Proje ID:", config.projectId);

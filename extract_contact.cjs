const fs = require('fs');
const backup = fs.readFileSync('public/js/shop.backup.js', 'utf8');

const start = backup.indexOf('  /* ================= CONTACT ================= */');
const end = backup.indexOf('  /* ================= INIT ================= */');

let snippet = backup.substring(start, end);
snippet = `import { api } from './api.js';
import { toast } from './ui.js';
const $ = (s, r) => (r || document).querySelector(s);
const t = (...args) => window.LS.t(...args);

export ` + snippet.replace('  function initContact() {', 'function initContact() {');

fs.writeFileSync('public/js/modules/contact.js', snippet);

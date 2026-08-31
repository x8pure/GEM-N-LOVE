const fs = require('fs');
const backup = fs.readFileSync('public/js/shop.backup.js', 'utf8');

const start = backup.indexOf('/* ================= DEPTHDECK COVERFLOW');
const end = backup.indexOf('  /* ================= SOFT SPA NAVIGATION');

let snippet = backup.substring(start, end);
snippet = `import { api } from './api.js';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const imgSrc = (s) => { if (!s) return ''; const str = String(s); if (str.startsWith('data:') || str.startsWith('http://') || str.startsWith('https://') || str.includes('?')) return str; return str + '?v=transparent2'; };
const LANG = window.__LS_LANG__ || 'tr';
const fmt = (n) => new Intl.NumberFormat(LANG === 'en' ? 'en-US' : 'tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
const t = (...args) => window.LS.t(...args);

export ` + snippet;

snippet = snippet.replace(/resumeTimer = setTimeout auto = \!reduced; \}, sec \* 1000\);/g, "resumeTimer = setTimeout(() => { auto = !reduced; }, sec * 1000);");

fs.writeFileSync('public/js/modules/coverflow.js', snippet);

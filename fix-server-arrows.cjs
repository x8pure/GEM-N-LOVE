const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'server.ts');
let code = fs.readFileSync(file, 'utf8');

const oldPrevSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
const newPrevSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" /></svg>';

const oldNextSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
const newNextSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>';

code = code.replace(oldPrevSVG, newPrevSVG);
code = code.replace(oldNextSVG, newNextSVG);

fs.writeFileSync(file, code);
console.log('Fixed server arrows');

const fs = require('fs');
const path = require('path');

const shopPath = path.join(__dirname, 'public/js/shop.js');
let shopCode = fs.readFileSync(shopPath, 'utf8');

const coverflowRegex = /\/\* ================= DEPTHDECK COVERFLOW.*?initCoverflow\(stage\) \{.*?layout\(performance\.now\(\)\);\n  \}\n/s;
const coverflowMatch = shopCode.match(coverflowRegex);

const contactRegex = /\/\* ================= CONTACT ================= \*\/.*?initContact\(\) \{.*?\}\n/s;
const contactMatch = shopCode.match(contactRegex);

if (coverflowMatch) {
  let coverflowCode = coverflowMatch[0];
  // Add imports
  coverflowCode = `import { api } from './api.js';\nimport { t } from './ui.js';\n\nconst $ = (s, r) => (r || document).querySelector(s);\nconst $$ = (s, r) => [...(r || document).querySelectorAll(s)];\nconst imgSrc = (s) => { if (!s) return ''; const str = String(s); if (str.startsWith('data:') || str.startsWith('http://') || str.startsWith('https://') || str.includes('?')) return str; return str + '?v=transparent2'; };\nconst LANG = window.__LS_LANG__ || 'tr';\nconst fmt = (n) => new Intl.NumberFormat(LANG === 'en' ? 'en-US' : 'tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);\n\nexport ` + coverflowCode.replace('async function initCoverflow(stage)', 'async function initCoverflow(stage)');
  
  fs.writeFileSync(path.join(__dirname, 'public/js/modules/coverflow.js'), coverflowCode);
  shopCode = shopCode.replace(coverflowRegex, '');
  console.log('Extracted coverflow.js');
} else {
  console.log('Coverflow not found');
}

if (contactMatch) {
  let contactCode = contactMatch[0];
  contactCode = `import { api } from './api.js';\nimport { toast, t } from './ui.js';\n\nconst $ = (s, r) => (r || document).querySelector(s);\n\nexport ` + contactCode.replace('function initContact()', 'function initContact()');
  
  fs.writeFileSync(path.join(__dirname, 'public/js/modules/contact.js'), contactCode);
  shopCode = shopCode.replace(contactRegex, '');
  console.log('Extracted contact.js');
} else {
  console.log('Contact not found');
}

// Add imports to shop.js
const importsToAdd = `import { initCoverflow } from './modules/coverflow.js';\nimport { initContact } from './modules/contact.js';\n`;
if (!shopCode.includes('import { initCoverflow }')) {
  shopCode = shopCode.replace("import { toast } from './modules/ui.js';", "import { toast } from './modules/ui.js';\n" + importsToAdd);
}

fs.writeFileSync(shopPath, shopCode);
console.log('Updated shop.js');

const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const importStatement = `import { initAccount, initProfile } from './modules/account.js';\n`;

if (!code.includes(importStatement)) {
  code = code.replace("'use strict';\n", "'use strict';\n" + importStatement);
}

const startStr = "/* ================= ACCOUNT & PROFILE DASHBOARD (OPTION 1) ================= */";
const endStr = "/* ================= CONTACT ================= */";

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx > -1 && endIdx > -1) {
  code = code.substring(0, startIdx) + 
         '// initAccount and initProfile imported from modules/account.js\n  window.initAccount = initAccount;\n  window.initProfile = initProfile;\n  ' + 
         code.substring(endIdx);
  fs.writeFileSync('public/js/shop.js', code);
}

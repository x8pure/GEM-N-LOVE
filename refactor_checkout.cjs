const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const importStatement = `import { initCheckout, initThanks } from './modules/checkout.js';\n`;

if (!code.includes(importStatement)) {
  code = code.replace("'use strict';\n", "'use strict';\n" + importStatement);
}

const checkoutStart = code.indexOf('async function initCheckout() {');
if (checkoutStart > -1) {
  const endStr = "/* ================= AUTH ================= */";
  const endIdx = code.indexOf(endStr, checkoutStart);
  if (endIdx > -1) {
    code = code.substring(0, checkoutStart) + 
           '// initCheckout and initThanks imported from modules/checkout.js\n  window.initCheckout = initCheckout;\n  window.initThanks = initThanks;\n  ' + 
           code.substring(endIdx);
  }
}

fs.writeFileSync('public/js/shop.js', code);

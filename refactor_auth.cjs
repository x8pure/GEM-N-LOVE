const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const importStatement = `import { performLogout, initAuth } from './modules/auth.js';\n`;

if (!code.includes(importStatement)) {
  code = code.replace("'use strict';\n", "'use strict';\n" + importStatement);
}

// Remove performLogout
const performLogoutStart = code.indexOf('async function performLogout(redirectUrl = \'/\') {');
if (performLogoutStart > -1) {
  const endStr = "LS.logout = performLogout;";
  const endIdx = code.indexOf(endStr, performLogoutStart);
  if (endIdx > -1) {
    code = code.substring(0, performLogoutStart) + 
           '// performLogout imported from modules/auth.js\n  window.performLogout = performLogout;\n  ' + 
           code.substring(endIdx);
  }
}

// Remove initAuth
const initAuthStart = code.indexOf('function initAuth() {');
if (initAuthStart > -1) {
  const endStr = "/* ================= ACCOUNT & PROFILE DASHBOARD (OPTION 1) ================= */";
  const endIdx = code.indexOf(endStr, initAuthStart);
  if (endIdx > -1) {
    code = code.substring(0, initAuthStart) + 
           '// initAuth imported from modules/auth.js\n  ' + 
           code.substring(endIdx);
  }
}

fs.writeFileSync('public/js/shop.js', code);

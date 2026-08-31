const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const importStatement = `import { api, getClientSid } from './modules/api.js';\n`;

if (!code.includes(importStatement)) {
  code = code.replace("'use strict';\n", "'use strict';\n" + importStatement);
}

// Replace getClientSid function
const getClientSidStart = code.indexOf('function getClientSid() {');
if (getClientSidStart > -1) {
  const endStr = "return '';\n    }\n  }";
  const endIdx = code.indexOf(endStr, getClientSidStart);
  if (endIdx > -1) {
    code = code.substring(0, getClientSidStart) + 
           '// getClientSid imported from modules/api.js\n  window.getClientSid = getClientSid;' + 
           code.substring(endIdx + endStr.length);
  }
}

// Replace api function
const apiStart = code.indexOf('async function api(path, opts = {}) {');
if (apiStart > -1) {
  const endStr = "LS.api = api;";
  const endIdx = code.indexOf(endStr, apiStart);
  if (endIdx > -1) {
    code = code.substring(0, apiStart) + 
           '// api imported from modules/api.js\n  window.api = api;\n  LS.api = api;' + 
           code.substring(endIdx + endStr.length);
  }
}

fs.writeFileSync('public/js/shop.js', code);

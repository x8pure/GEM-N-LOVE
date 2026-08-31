const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const importStatement = `import { api, getClientSid } from './modules/api.js';\n`;

// Add import at the top
code = code.replace("'use strict';\n", "'use strict';\n" + importStatement);

// Remove getClientSid
const getClientSidRegex = /function getClientSid\(\) \{[\s\S]*?return sid;\n\s*\} catch \{ return ''; \}\n\s*\}/;
code = code.replace(getClientSidRegex, '// getClientSid imported from modules/api.js');

// Remove api
const apiRegex = /async function api\(path, opts = \{\}\) \{[\s\S]*?LS\.api = api;/;
code = code.replace(apiRegex, '// api imported from modules/api.js\n  window.api = api;\n  LS.api = api;');

fs.writeFileSync('public/js/shop.js', code);

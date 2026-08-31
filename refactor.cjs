const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const importStatement = `import { toast } from './modules/ui.js';\n`;

// Add import at the top (after 'use strict';)
code = code.replace("'use strict';", "'use strict';\n" + importStatement);

// Remove the toast function definition
const toastRegex = /\/\* ---------- toast ---------- \*\/\n\s*function toast[\s\S]*?LS\.toast = toast;/;
code = code.replace(toastRegex, '/* ---------- toast ---------- */\n  // toast function is now imported from modules/ui.js\n  window.toast = toast; // backward compatibility if needed\n  LS.toast = toast;');

fs.writeFileSync('public/js/shop.js', code);

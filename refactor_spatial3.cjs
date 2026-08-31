const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const regex = /function initQuickDrawerListeners\(\) \{[\s\S]*?\}\n/g;
code = code.replace(regex, '');

code = code.replace(/initQuickDrawerListeners, /g, '');

fs.writeFileSync('public/js/shop.js', code);

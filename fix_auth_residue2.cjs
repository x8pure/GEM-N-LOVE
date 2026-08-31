const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

code = code.replace(/window\.initProfile = initProfile;\n\s+\}\);\n\s+\}/, 'window.initProfile = initProfile;');

fs.writeFileSync('public/js/shop.js', code);

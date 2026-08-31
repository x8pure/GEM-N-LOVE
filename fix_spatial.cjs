const fs = require('fs');
let code = fs.readFileSync('public/js/modules/spatial.js', 'utf8');

code = code.replace(/\\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('public/js/modules/spatial.js', code);

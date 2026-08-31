const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

code = code.replace(/catch panel\.textContent/g, "catch(() => { panel.textContent");

fs.writeFileSync('public/js/shop.js', code);

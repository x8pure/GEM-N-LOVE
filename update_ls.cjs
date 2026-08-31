const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

code = code.replace(
  'window.LS = { fmt, t, lang: LANG, dateFmt };',
  'window.LS = { fmt, t, lang: LANG, dateFmt, imgSrc, esc, stars };'
);

fs.writeFileSync('public/js/shop.js', code);

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'server.ts');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/id="spatial-nav-prev"/g, 'id="spatial-outer-prev"');
code = code.replace(/id="spatial-nav-next"/g, 'id="spatial-outer-next"');

fs.writeFileSync(file, code);

const cssFile = path.join(__dirname, 'public', 'css', 'shop.css');
let css = fs.readFileSync(cssFile, 'utf8');
css = css.replace(/\.spatial-nav-prev\s*\{/g, '.spatial-outer-prev {');
css = css.replace(/\.spatial-nav-next\s*\{/g, '.spatial-outer-next {');
fs.writeFileSync(cssFile, css);

console.log('Fixed outer IDs');

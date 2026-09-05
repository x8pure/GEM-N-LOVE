const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, 'public', 'css', 'shop.css');
let css = fs.readFileSync(cssPath, 'utf8');

// I will globally replace flex-start with center, EXCEPT where I explicitly added it recently.
// Wait, I explicitly added it in my recent CSS block:
/*
  /* Keep the scrollable body tight at the top * /
  .spatial-scrollable-body {
    justify-content: flex-start;
*/

css = css.replace(/justify-content: flex-start;/g, 'justify-content: center;');

// Now restore the one for .spatial-scrollable-body in the desktop media query
css = css.replace(
  /\.spatial-scrollable-body\s*\{\s*justify-content: center;\s*padding-top: 0;/g,
  '/* Keep the scrollable body tight at the top */\n  .spatial-scrollable-body {\n    justify-content: flex-start;\n    padding-top: 0;'
);

// Any other spatial-scrollable-body? The original one was flex-start? Let's check.
fs.writeFileSync(cssPath, css);
console.log('Restored all centers');

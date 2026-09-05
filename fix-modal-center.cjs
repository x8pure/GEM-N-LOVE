const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, 'public', 'css', 'shop.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Fix spatial-canvas-overlay
css = css.replace(
  /\.spatial-canvas-overlay\s*\{[^}]*\}/,
  match => match.replace('justify-content: flex-start;', 'justify-content: center;')
);

// Fix spatial-stage-close
css = css.replace(
  /\.spatial-stage-close\s*\{[^}]*\}/,
  match => match.replace('justify-content: flex-start;', 'justify-content: center;')
);

// We should also revert it where we explicitly intended for the scrollable body in the desktop fix
// But let's check .spatial-canvas-overlay (there are two, one for base, one for mobile)
css = css.replace(
  /\.spatial-canvas-overlay\s*\{[^}]*\}/g,
  match => match.replace('justify-content: flex-start;', 'justify-content: center;')
);

fs.writeFileSync(cssPath, css);
console.log('Fixed overlay center');

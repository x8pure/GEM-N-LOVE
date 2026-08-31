const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const startStr = "$('#spatial-canvas-overlay')?.addEventListener('click', (e) => {";
const endStr = "// ESC key closes spatial modal\n    window.addEventListener('keydown', (e) => {\n      if (e.key === 'Escape') closeSpatialCardZoom();\n    });";

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx > -1 && endIdx > -1) {
  code = code.substring(0, startIdx) + code.substring(endIdx + endStr.length);
  fs.writeFileSync('public/js/shop.js', code);
} else {
  console.log("Could not find the bounds to remove.");
}

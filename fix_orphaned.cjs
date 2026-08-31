const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const startIdx = code.indexOf('  function getProductSpecs(prod) {');
const endStr = '/* ================= HOME ================= */';
const endIdx = code.indexOf(endStr, startIdx);

if (startIdx > -1 && endIdx > -1) {
  code = code.substring(0, startIdx) + '  ' + code.substring(endIdx);
  fs.writeFileSync('public/js/shop.js', code);
  console.log('Removed orphaned spatial code!');
} else {
  console.log('Could not find start or end bounds');
}

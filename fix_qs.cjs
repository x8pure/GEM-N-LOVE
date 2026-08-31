const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');
let backup = fs.readFileSync('public/js/shop.backup.js', 'utf8');

const backupMatch = backup.match(/\/\* ---------- Quick Search Modal.*?qs-chip.*?\}\);\n      \}\);\n/s);
if (backupMatch) {
  let chunkToInsert = backupMatch[0];
  
  // Now we find where to inject in shop.js
  const shopRegex = /window\.updateCartBadge = updateCartBadge;\);\n\s+\$\$\('\.qs-cat-btn'/s;
  
  if (shopRegex.test(code)) {
    code = code.replace(shopRegex, "window.updateCartBadge = updateCartBadge;\n  " + chunkToInsert + "\n      $$('.qs-cat-btn'");
    fs.writeFileSync('public/js/shop.js', code);
    console.log('Fixed Quick Search block');
  } else {
    console.log('Could not find shopRegex');
  }
} else {
  console.log('Could not find backupMatch');
}


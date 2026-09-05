const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'js', 'modules', 'spatial.js');
let code = fs.readFileSync(file, 'utf8');

// The internal gallery buttons should have id="spatial-nav-prev" and id="spatial-nav-next"
code = code.replace(
  '<button type="button" class="spatial-nav-btn prev" id="spatial-outer-prev"',
  '<button type="button" class="spatial-nav-btn prev" id="spatial-nav-prev"'
);
code = code.replace(
  '<button type="button" class="spatial-nav-btn next" id="spatial-outer-next"',
  '<button type="button" class="spatial-nav-btn next" id="spatial-nav-next"'
);

fs.writeFileSync(file, code);
console.log('Reverted internal gallery arrow IDs');

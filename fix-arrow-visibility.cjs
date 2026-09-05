const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'js', 'modules', 'spatial.js');
let code = fs.readFileSync(file, 'utf8');

const openSearch = `  document.body.style.overflow = 'hidden';`;
const openReplace = `  document.body.style.overflow = 'hidden';
  
  // Conditionally show/hide outer arrows based on having an origin card
  const prevBtn = $('#spatial-nav-prev');
  const nextBtn = $('#spatial-nav-next');
  if (prevBtn && nextBtn) {
    if (originCard) {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }`;

code = code.replace(openSearch, openReplace);
fs.writeFileSync(file, code);
console.log('Fixed arrow visibility');

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'js', 'modules', 'spatial.js');
let code = fs.readFileSync(file, 'utf8');

// Goal 1: Fix "Tüm Detaylar" back button issue
// We will replace the current link click handler to clean up the URL first
const oldLinkHandler = `
    // Clicking 'Tüm Detaylar' navigates to product page
    $('.spatial-all-features-link', stage)?.addEventListener('click', function(e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const btn = this;
      btn.classList.add('is-loading');
      btn.style.pointerEvents = 'none';
      const label = btn.querySelector('span');
`;

const newLinkHandler = `
    // Clicking 'Tüm Detaylar' navigates to product page
    $('.spatial-all-features-link', stage)?.addEventListener('click', function(e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      
      // Clean up the URL before navigating, so clicking 'Back' doesn't reopen modal
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('modal');
      cleanUrl.searchParams.delete('id');
      cleanUrl.searchParams.delete('urun'); // just in case
      window.history.replaceState({}, '', cleanUrl.toString());

      const btn = this;
      btn.classList.add('is-loading');
      btn.style.pointerEvents = 'none';
      const label = btn.querySelector('span');
`;

code = code.replace(oldLinkHandler, newLinkHandler);

fs.writeFileSync(file, code);
console.log('Patched Goal 1');

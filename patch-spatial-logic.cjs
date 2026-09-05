const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'js', 'modules', 'spatial.js');
let code = fs.readFileSync(file, 'utf8');

const oldLogic = `  // ESC key closes spatial modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSpatialCardZoom();
  });`;

const newLogic = `  // Global outer arrow navigation logic
  const navigateToSibling = (direction) => {
    if (!$('#spatial-canvas-overlay')?.classList.contains('open')) return;
    if (!activeOriginCard) return; // Need an origin to find siblings
    
    // Find all product cards in the current view
    const allCards = Array.from(document.querySelectorAll('.product-card'));
    if (allCards.length === 0) return;
    
    const currentIndex = allCards.indexOf(activeOriginCard);
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = allCards.length - 1; // loop around
    if (nextIndex >= allCards.length) nextIndex = 0; // loop around
    
    const targetCard = allCards[nextIndex];
    if (targetCard) {
      // Simulate click on the sibling card to trigger its openSpatialCardZoom naturally
      // But first, let's fast-close the current one to avoid transition glitches?
      // Actually, clicking it directly might work if we have the href link
      const link = targetCard.querySelector('a.prod-card-link, a.cat-card-link');
      if (link) {
        link.click();
      } else {
        targetCard.click();
      }
    }
  };

  $('#spatial-nav-prev')?.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent overlay click
    navigateToSibling(-1);
  });
  $('#spatial-nav-next')?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateToSibling(1);
  });

  // ESC key and arrow keys
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSpatialCardZoom();
    if (e.key === 'ArrowLeft') navigateToSibling(-1);
    if (e.key === 'ArrowRight') navigateToSibling(1);
  });`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync(file, code);
console.log('Patched spatial logic');

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'js', 'modules', 'spatial.js');
let code = fs.readFileSync(file, 'utf8');

const oldLogic = `  // Global outer arrow navigation logic
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
  };`;

const newLogic = `  // Global outer arrow navigation logic
  const navigateToSibling = (direction) => {
    if (!$('#spatial-canvas-overlay')?.classList.contains('open')) return;
    if (!activeOriginCard) return; // Need an origin to find siblings
    
    // Find all product cards in the current view
    const allCards = Array.from(document.querySelectorAll('.prod-card'));
    if (allCards.length === 0) return;
    
    const currentIndex = allCards.indexOf(activeOriginCard);
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = allCards.length - 1; // loop around
    if (nextIndex >= allCards.length) nextIndex = 0; // loop around
    
    const targetCard = allCards[nextIndex];
    if (targetCard) {
      // Restore previous origin card styles before switching
      if (activeOriginCard) {
        activeOriginCard.style.opacity = '';
        activeOriginCard.style.transform = '';
      }
      
      const pid = targetCard.dataset.slug || targetCard.dataset.id;
      if (pid) {
        openSpatialCardZoom(pid, targetCard);
      }
    }
  };`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync(file, code);
console.log('Fixed sibling navigation logic');

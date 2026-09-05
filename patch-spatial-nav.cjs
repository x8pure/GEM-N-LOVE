const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'js', 'modules', 'spatial.js');
let code = fs.readFileSync(file, 'utf8');

const oldNav = `  // Global outer arrow navigation logic
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

const newNav = `  // Global outer arrow navigation logic (Smart Playlist)
  const navigateToSibling = (direction) => {
    if (!$('#spatial-canvas-overlay')?.classList.contains('open')) return;
    if (!activePlaylist || activePlaylist.length < 2) return; // Need a playlist
    
    // Find current product in the playlist
    const currentId = new URLSearchParams(window.location.search).get('urun') || new URLSearchParams(window.location.search).get('id');
    if (!currentId) return;
    
    const currentIndex = activePlaylist.findIndex(p => p.slug === currentId || p.id === currentId);
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = activePlaylist.length - 1; // loop around
    if (nextIndex >= activePlaylist.length) nextIndex = 0; // loop around
    
    const nextProduct = activePlaylist[nextIndex];
    if (nextProduct) {
      // Restore previous origin card styles before switching
      if (activeOriginCard) {
        activeOriginCard.style.opacity = '';
        activeOriginCard.style.transform = '';
      }
      
      const pid = nextProduct.slug || nextProduct.id;
      if (pid) {
        // Find if this new product happens to have a card in the DOM to act as the new origin
        const potentialOrigin = document.querySelector(\`.prod-card[data-slug="\${pid}"], .prod-card[data-id="\${pid}"]\`);
        openSpatialCardZoom(pid, potentialOrigin || null);
      }
    }
  };`;

code = code.replace(oldNav, newNav);

// Also need to fix the event listener IDs:
code = code.replace(/id="spatial-nav-prev"/g, 'id="spatial-outer-prev"');
code = code.replace(/id="spatial-nav-next"/g, 'id="spatial-outer-next"');
code = code.replace(/\$\('#spatial-nav-prev'\)/g, "$('#spatial-outer-prev')");
code = code.replace(/\$\('#spatial-nav-next'\)/g, "$('#spatial-outer-next')");

fs.writeFileSync(file, code);
console.log('Patched sibling navigation logic');

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'server.ts');
let code = fs.readFileSync(file, 'utf8');

// We add outer navigation arrows to the overlay
const oldOverlay = `<div class="spatial-canvas-overlay" id="spatial-canvas-overlay" aria-hidden="true">
  <div class="spatial-card-stage" id="spatial-card-stage" role="dialog" aria-modal="true" aria-label="Product Showcase">
    <!-- Populated with FLIP spring animation by shop.js -->
  </div>
</div>`;

const newOverlay = `<div class="spatial-canvas-overlay" id="spatial-canvas-overlay" aria-hidden="true">
  <!-- Outer Navigation Arrows (Sonsuz Hızlı Gözat) -->
  <button type="button" class="spatial-nav-arrow spatial-nav-prev" id="spatial-nav-prev" aria-label="Önceki Ürün">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  </button>
  <button type="button" class="spatial-nav-arrow spatial-nav-next" id="spatial-nav-next" aria-label="Sonraki Ürün">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </button>

  <div class="spatial-card-stage" id="spatial-card-stage" role="dialog" aria-modal="true" aria-label="Product Showcase">
    <!-- Populated with FLIP spring animation by shop.js -->
  </div>
</div>`;

code = code.replace(oldOverlay, newOverlay);
fs.writeFileSync(file, code);
console.log('Patched server overlay');

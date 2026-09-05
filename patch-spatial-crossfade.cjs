const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'js', 'modules', 'spatial.js');
let code = fs.readFileSync(file, 'utf8');

// 1. Add activePlaylist and activeCategory variables at the top
if (!code.includes('let activePlaylist')) {
  code = code.replace(
    /let activeOriginCard = null;\s*let activeZoomRequestId = 0;/,
    "let activeOriginCard = null;\nlet activeZoomRequestId = 0;\nlet activePlaylist = [];\nlet activeCategory = null;"
  );
}

// 2. Modify the spinner step to support crossfade
const oldSpinner = `  stage.innerHTML = \`
    <button type="button" class="spatial-stage-close" id="spatial-stage-close" aria-label="\${LANG === 'en' ? 'Close' : 'Kapat'}">✕</button>
    <div style="display:flex;align-items:center;justify-content:center;height:460px;width:100%;">
      <div class="spinner"></div>
    </div>
  \`;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');`;

const newSpinner = `  const isAlreadyOpen = overlay.classList.contains('open') && stage.querySelector('.spatial-grid');
  if (isAlreadyOpen) {
    const grid = stage.querySelector('.spatial-grid');
    if (grid) grid.style.opacity = '0.3';
  } else {
    stage.innerHTML = \`
      <button type="button" class="spatial-stage-close" id="spatial-stage-close" aria-label="\${LANG === 'en' ? 'Close' : 'Kapat'}">✕</button>
      <div style="display:flex;align-items:center;justify-content:center;height:460px;width:100%;">
        <div class="spinner"></div>
      </div>
    \`;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }`;

if (code.includes(oldSpinner)) {
  code = code.replace(oldSpinner, newSpinner);
}

// 3. Before generating HTML, fetch the category playlist if needed
const oldFetch = `    const p = (res && res.product) ? res.product : res;
    if (!p || !p.id) throw new Error('Ürün bulunamadı');`;

const newFetch = `    const p = (res && res.product) ? res.product : res;
    if (!p || !p.id) throw new Error('Ürün bulunamadı');
    
    // Auto-fetch playlist for infinite browsing
    if (p.category && activeCategory !== p.category) {
      try {
        const catRes = await api('/api/products?limit=100&cat=' + encodeURIComponent(p.category));
        if (catRes && catRes.products) {
          activePlaylist = catRes.products;
          activeCategory = p.category;
        }
      } catch (e) { console.error('Playlist fetch error:', e); }
    }`;

if (code.includes(oldFetch)) {
  code = code.replace(oldFetch, newFetch);
}

// 4. Update the logic for outer arrows visibility
const oldArrowVis = `  // Conditionally show/hide outer arrows based on having an origin card
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
  
const newArrowVis = `  // Conditionally show/hide outer arrows
  const prevBtn = $('#spatial-outer-prev');
  const nextBtn = $('#spatial-outer-next');
  if (prevBtn && nextBtn) {
    // We can always show arrows now because it pulls from category, unless we have no playlist yet?
    // Let's just always show them if we are in spatial view, except if we literally have 0 siblings.
    // We will update their visibility after fetching.
  }`;

if (code.includes(oldArrowVis)) {
  code = code.replace(oldArrowVis, newArrowVis);
}

// Update the generated HTML to have animation on load if crossfading
const oldStageSet = `    stage.innerHTML = \`
      <button type="button" class="spatial-stage-close" id="spatial-stage-close" aria-label="\${LANG === 'en' ? 'Close' : 'Kapat'}">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="spatial-grid">`;

const newStageSet = `    stage.innerHTML = \`
      <button type="button" class="spatial-stage-close" id="spatial-stage-close" aria-label="\${LANG === 'en' ? 'Close' : 'Kapat'}">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="spatial-grid \${isAlreadyOpen ? 'crossfade-in' : ''}">`;

if (code.includes(oldStageSet)) {
  code = code.replace(oldStageSet, newStageSet);
}

fs.writeFileSync(file, code);
console.log('Patched crossfade steps');

const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'js', 'modules', 'spatial.js');
let code = fs.readFileSync(file, 'utf8');

const oldFetch = `    // Auto-fetch playlist for infinite browsing
    if (p.category && activeCategory !== p.category) {
      try {
        const catRes = await api('/api/products?limit=100&cat=' + encodeURIComponent(p.category));
        if (catRes && catRes.products) {
          activePlaylist = catRes.products;
          activeCategory = p.category;
        }
      } catch (e) { console.error('Playlist fetch error:', e); }
    }`;

const newFetch = `    // Auto-fetch playlist for infinite browsing
    if (p.category && activeCategory !== p.category) {
      try {
        const catRes = await api('/api/products?limit=100&cat=' + encodeURIComponent(p.category));
        if (catRes && catRes.products) {
          activePlaylist = catRes.products;
          activeCategory = p.category;
        }
      } catch (e) { console.error('Playlist fetch error:', e); }
    } else if (!p.category) {
      activePlaylist = [];
      activeCategory = null;
    }
    
    // Update outer arrows visibility based on playlist length
    const prevBtn = $('#spatial-outer-prev');
    const nextBtn = $('#spatial-outer-next');
    if (prevBtn && nextBtn) {
      if (activePlaylist && activePlaylist.length > 1) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
      } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      }
    }`;

if (code.includes(oldFetch)) {
  code = code.replace(oldFetch, newFetch);
  fs.writeFileSync(file, code);
  console.log('Fixed arrow visibility');
} else {
  console.log('Could not find fetch block');
}

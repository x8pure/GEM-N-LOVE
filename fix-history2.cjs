const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'js', 'modules', 'spatial.js');
let code = fs.readFileSync(file, 'utf8');

const oldHistory = `    const params = new URLSearchParams(window.location.search);
    if (params.get('urun') !== (p.slug || p.id)) {
      params.set('urun', p.slug || p.id);
      window.history.pushState({ modal: 'spatial', id: p.id }, '', window.location.pathname + '?' + params.toString());
    }`;

const newHistory = `    const params = new URLSearchParams(window.location.search);
    if (params.get('urun') !== (p.slug || p.id)) {
      const wasAlreadyInModal = params.has('urun');
      params.set('urun', p.slug || p.id);
      if (wasAlreadyInModal) {
        window.history.replaceState({ modal: 'spatial', id: p.id }, '', window.location.pathname + '?' + params.toString());
      } else {
        window.history.pushState({ modal: 'spatial', id: p.id }, '', window.location.pathname + '?' + params.toString());
      }
    }`;

code = code.replace(oldHistory, newHistory);
fs.writeFileSync(file, code);
console.log('Fixed history push/replace part 2');

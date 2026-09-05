const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'js', 'modules', 'spatial.js');
let code = fs.readFileSync(file, 'utf8');

const oldHistory = `    // Update URL quietly
    if (typeof window !== 'undefined' && window.history) {
      const params = new URLSearchParams(window.location.search);
      params.set('modal', 'spatial');
      params.set('id', p.id);
      window.history.pushState({ modal: 'spatial', id: p.id }, '', window.location.pathname + '?' + params.toString());
    }`;

const newHistory = `    // Update URL quietly
    if (typeof window !== 'undefined' && window.history) {
      const params = new URLSearchParams(window.location.search);
      const wasAlreadyInModal = params.get('modal') === 'spatial';
      params.set('modal', 'spatial');
      params.set('id', p.id);
      if (wasAlreadyInModal) {
        window.history.replaceState({ modal: 'spatial', id: p.id }, '', window.location.pathname + '?' + params.toString());
      } else {
        window.history.pushState({ modal: 'spatial', id: p.id }, '', window.location.pathname + '?' + params.toString());
      }
    }`;

if (code.includes(oldHistory)) {
  code = code.replace(oldHistory, newHistory);
  fs.writeFileSync(file, code);
  console.log('Fixed history push/replace');
} else {
  console.log('Could not find history block exactly');
}

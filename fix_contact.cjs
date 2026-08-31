const fs = require('fs');

const snippet = `import { api } from './api.js';
import { toast } from './ui.js';
const $ = (s, r) => (r || document).querySelector(s);
const t = (...args) => window.LS.t(...args);

export function initContact() {
  const f = $('#contact-form');
  if (!f) return;
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api('/api/contact', { method: 'POST', body: { name: $('#c-name').value.trim(), email: $('#c-email').value.trim(), message: $('#c-msg').value.trim() } });
      toast(t('contact.ok'), '✅');
      f.reset();
    } catch (err) { toast(err.message, '⚠️'); }
  });
}
`;
fs.writeFileSync('public/js/modules/contact.js', snippet);

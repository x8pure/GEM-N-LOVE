const fs = require('fs');
let code = fs.readFileSync('account_extract.js', 'utf8');

const replacements = [
  { regex: /\bt\(/g, rep: 'window.LS.t(' },
  { regex: /\bfmt\(/g, rep: 'window.LS.fmt(' },
  { regex: /\bimgSrc\(/g, rep: 'window.LS.imgSrc(' },
  { regex: /\bdateFmt\(/g, rep: 'window.LS.dateFmt(' },
  { regex: /\besc\(/g, rep: 'window.LS.esc(' },
  { regex: /\bLANG\b/g, rep: 'window.__LS_LANG__' },
];

replacements.forEach(r => {
  code = code.replace(r.regex, r.rep);
});

fs.writeFileSync('account_extract.js', code);

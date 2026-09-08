const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '.cf-prev { left: -6px; } .cf-next { right: -6px; }',
  '.cf-prev { left: -50px; } .cf-next { right: -50px; }\n\n@media (max-width: 900px) {\n  .cf-arrow { display: none !important; }\n}'
);

fs.writeFileSync('public/css/shop.css', css);

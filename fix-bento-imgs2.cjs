const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '.bento-card-e .bento-bg {\n  max-width: 78%;',
  '.bento-card-e .bento-bg,\n.bento-card-f .bento-bg {\n  max-width: 78%;'
);

fs.writeFileSync('public/css/shop.css', css);

const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '.bento-card-h .bento-bg {\n  max-height: 74%;\n  max-width: 58%;\n  transform: translateY(-6px);\n}',
  '.bento-card-h .bento-bg {\n  max-height: 85%;\n  max-width: 75%;\n  transform: translateY(0);\n}'
);

fs.writeFileSync('public/css/shop.css', css);

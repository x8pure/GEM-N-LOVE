const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '.bento-card-f .bento-bg,\n.bento-card-e .bento-bg,\n.bento-card-f .bento-bg {\n  max-width: 78%;\n  max-height: 85%;\n  transform: translateY(-4px);\n  filter: drop-shadow(0 15px 24px rgba(41, 37, 36, 0.12));\n}',
  '.bento-card-e .bento-bg {\n  max-width: 78%;\n  max-height: 85%;\n  transform: translateY(-4px);\n  filter: drop-shadow(0 15px 24px rgba(41, 37, 36, 0.12));\n}\n\n.bento-card-f .bento-bg {\n  max-height: 74%;\n  max-width: 58%;\n  transform: translateY(-6px);\n}'
);

fs.writeFileSync('public/css/shop.css', css);

const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '.bento-card:hover .bento-bg {\n  transform: scale(1.06) translateY(-6px);\n}\n.bento-card-b:hover .bento-bg {\n  transform: scale(1.06) translateY(-12px);\n}',
  '.bento-card:hover .bento-bg {\n  transform: scale(1.06) translateY(-6px);\n}\n.bento-card-b:hover .bento-bg {\n  transform: scale(1.06) translateY(-14px);\n}\n.bento-card-c:hover .bento-bg,\n.bento-card-d:hover .bento-bg {\n  transform: scale(1.06) translateY(6px) translateX(12px);\n}\n.bento-card-e:hover .bento-bg,\n.bento-card-f:hover .bento-bg {\n  transform: scale(1.06) translateY(-10px);\n}\n.bento-card-h:hover .bento-bg {\n  transform: scale(1.06) translateY(-12px);\n}'
);

fs.writeFileSync('public/css/shop.css', css);

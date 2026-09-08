const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '.bento-card-b .bento-img-wrap,\n.bento-card-c .bento-img-wrap,\n.bento-card-d .bento-img-wrap,\n.bento-card-e .bento-img-wrap {',
  '.bento-card-b .bento-img-wrap,\n.bento-card-c .bento-img-wrap,\n.bento-card-d .bento-img-wrap,\n.bento-card-e .bento-img-wrap,\n.bento-card-f .bento-img-wrap {'
);

fs.writeFileSync('public/css/shop.css', css);

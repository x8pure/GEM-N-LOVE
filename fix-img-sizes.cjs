const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

// For Fantezi Iç Giyim (c) and Realistik Mankenler (d)
// Let's remove the padding from img-wrap and push them to the corner with object-fit: contain/cover
// And increase max-width/height

css = css.replace(
  '.bento-card-b .bento-img-wrap,\n.bento-card-c .bento-img-wrap,\n.bento-card-d .bento-img-wrap,\n.bento-card-f .bento-img-wrap {\n  align-items: center;\n  justify-content: flex-end;\n  padding-right: 18px;\n}',
  '.bento-card-b .bento-img-wrap,\n.bento-card-f .bento-img-wrap {\n  align-items: center;\n  justify-content: flex-end;\n  padding-right: 18px;\n}\n\n.bento-card-c .bento-img-wrap,\n.bento-card-d .bento-img-wrap {\n  align-items: flex-end;\n  justify-content: flex-end;\n  padding: 0;\n}'
);

css = css.replace(
  '.bento-card-c .bento-bg {\n  max-height: 78%;\n  max-width: 60%;\n  transform: translateY(-4px);\n}',
  '.bento-card-c .bento-bg {\n  max-height: 100%;\n  max-width: 90%;\n  transform: translateY(12px) translateX(12px);\n}'
);

css = css.replace(
  '.bento-card-d .bento-bg {\n  max-height: 74%;\n  max-width: 58%;\n  transform: translateY(-6px);\n}',
  '.bento-card-d .bento-bg {\n  max-height: 110%;\n  max-width: 80%;\n  transform: translateY(12px) translateX(12px);\n}'
);

fs.writeFileSync('public/css/shop.css', css);

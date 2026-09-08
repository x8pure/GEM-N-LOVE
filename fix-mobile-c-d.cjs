const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

const targetStr = `  .bento-card-c .bento-bg {\n    max-width: 60% !important;\n    max-height: 92% !important;\n    transform: translateY(-2px) !important;\n  }\n  .bento-card-d .bento-bg {\n    max-width: 60% !important;\n    max-height: 90% !important;\n    transform: translateY(-2px) !important;\n  }`;

const newStr = `  .bento-card-c .bento-img-wrap,\n  .bento-card-d .bento-img-wrap {\n    align-items: flex-end !important;\n    padding: 0 !important;\n  }\n  .bento-card-c .bento-bg {\n    max-width: 55% !important;\n    max-height: 105% !important;\n    transform: translateY(0) translateX(2px) !important;\n  }\n  .bento-card-d .bento-bg {\n    max-width: 55% !important;\n    max-height: 110% !important;\n    transform: translateY(0) translateX(2px) !important;\n  }`;

css = css.replace(targetStr, newStr);

fs.writeFileSync('public/css/shop.css', css);

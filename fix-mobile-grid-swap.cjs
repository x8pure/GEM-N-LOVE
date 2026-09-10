const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '  .bento-card-c { grid-area: h !important; } /* Swapped on mobile: Erkek Cinsel Sağlık gets wider left spot h */',
  '  .bento-card-c { grid-area: c !important; }'
);

css = css.replace(
  '  .bento-card-h { grid-area: c !important; } /* Swapped on mobile: Anal Ürünler gets spot c */',
  '  .bento-card-h { grid-area: h !important; }'
);

// Swap the specific fine tuning classes
css = css.replace(
  '  .bento-card-b .bento-img-wrap,\n  .bento-card-h .bento-img-wrap {',
  '  .bento-card-b .bento-img-wrap,\n  .bento-card-c .bento-img-wrap {'
);

css = css.replace(
  '  .bento-card-h .bento-bg {\n    position: relative !important;\n    max-width: 48% !important;\n    max-height: 82% !important;\n    right: auto !important;\n    bottom: auto !important;\n  }',
  '  .bento-card-c .bento-bg {\n    position: relative !important;\n    max-width: 48% !important;\n    max-height: 82% !important;\n    right: auto !important;\n    bottom: auto !important;\n  }'
);

css = css.replace(
  '  .bento-card-f .bento-meta h3,\n  .bento-card-c .bento-meta h3 {',
  '  .bento-card-f .bento-meta h3,\n  .bento-card-h .bento-meta h3 {'
);

css = css.replace(
  '  .bento-card-c .bento-bg {\n    max-width: 50% !important;\n    max-height: 100% !important;\n    right: 2px !important;\n    bottom: 0 !important;\n  }',
  '  .bento-card-h .bento-bg {\n    max-width: 50% !important;\n    max-height: 100% !important;\n    right: 2px !important;\n    bottom: 0 !important;\n  }'
);

fs.writeFileSync('public/css/shop.css', css);
console.log('done');

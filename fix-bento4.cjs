const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '    "a a b c"\n    "a a d d"\n    "e f f g";\n  grid-auto-rows: 195px;\n}',
  '    "a a b c"\n    "a a d d"\n    "e f h g";\n  grid-auto-rows: 195px;\n}'
);

css = css.replace(
  '  .bento {\n    display: grid !important;\n    grid-template-columns: repeat(2, 1fr) !important;\n    grid-template-areas: "a a" "b c" "d d" "f f" "e g" !important;\n    grid-auto-rows: 200px !important;\n    gap: 14px !important;\n  }',
  '  .bento {\n    display: grid !important;\n    grid-template-columns: repeat(2, 1fr) !important;\n    grid-template-areas: "a a" "b c" "d d" "e f" "h g" !important;\n    grid-auto-rows: 200px !important;\n    gap: 14px !important;\n  }'
);

if (!css.includes('.bento-card-h')) {
  css = css.replace(
    '.bento-card-g { grid-area: g; }',
    '.bento-card-g { grid-area: g; }\n.bento-card-h { grid-area: h; }'
  );
}

// Add padding to h as well since it's a 1x1 card, like b, c, e, f?
// Actually b, c, e, f, h don't explicitly need padding if they use the base styles, 
// wait, the image alignment is done via .bento-card-h .bento-img-wrap
css = css.replace(
  '.bento-card-b .bento-img-wrap,\n.bento-card-f .bento-img-wrap {',
  '.bento-card-b .bento-img-wrap,\n.bento-card-f .bento-img-wrap,\n.bento-card-h .bento-img-wrap {'
);

css = css.replace(
  '.bento-card-f .bento-bg {\n  max-height: 74%;\n  max-width: 58%;\n  transform: translateY(-6px);\n}',
  '.bento-card-f .bento-bg {\n  max-width: 78%;\n  max-height: 85%;\n  transform: translateY(-4px);\n  filter: drop-shadow(0 15px 24px rgba(41, 37, 36, 0.12));\n}\n\n.bento-card-h .bento-bg {\n  max-height: 74%;\n  max-width: 58%;\n  transform: translateY(-6px);\n}'
);

fs.writeFileSync('public/css/shop.css', css);

let ts = fs.readFileSync('server.ts', 'utf8');
ts = ts.replace(
  "const top = [...topCats, ...homeRemaining].slice(0, 6);",
  "const top = [...topCats, ...homeRemaining].slice(0, 7);"
);
ts = ts.replace(
  "const area = ['a','b','c','d','e','f'][i] || 'a';",
  "const area = ['a','b','c','d','e','f','h'][i] || 'a';"
);

fs.writeFileSync('server.ts', ts);

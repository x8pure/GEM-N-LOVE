const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '    "a a b c"\n    "a a d d"\n    "e f g g";\n  grid-auto-rows: 195px;\n}',
  '    "a a b c"\n    "a a d d"\n    "e f f g";\n  grid-auto-rows: 195px;\n}'
);

css = css.replace(
  '  .bento {\n    display: grid !important;\n    grid-template-columns: repeat(2, 1fr) !important;\n    grid-template-areas: "a a" "b c" "d d" "e f" "g g" !important;\n    grid-auto-rows: 200px !important;\n    gap: 14px !important;\n  }',
  '  .bento {\n    display: grid !important;\n    grid-template-columns: repeat(2, 1fr) !important;\n    grid-template-areas: "a a" "b c" "d d" "f f" "e g" !important;\n    grid-auto-rows: 200px !important;\n    gap: 14px !important;\n  }'
);

fs.writeFileSync('public/css/shop.css', css);

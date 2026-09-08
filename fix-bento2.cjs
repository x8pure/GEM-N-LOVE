const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '    "a a b c"\n    "f f d c"\n    "e e g g";\n  grid-auto-rows: 200px;\n}',
  '    "a a b c"\n    "a a d d"\n    "e e e f";\n  grid-auto-rows: 220px;\n}'
);

css = css.replace(
  '  .bento {\n    display: grid !important;\n    grid-template-columns: repeat(2, 1fr) !important;\n    grid-template-areas: "a a" "b c" "f f" "d e" "g g" !important;\n    grid-auto-rows: 200px !important;\n    gap: 14px !important;\n  }',
  '  .bento {\n    display: grid !important;\n    grid-template-columns: repeat(2, 1fr) !important;\n    grid-template-areas: "a a" "b c" "d d" "e e" "f f" !important;\n    grid-auto-rows: 200px !important;\n    gap: 14px !important;\n  }'
);

fs.writeFileSync('public/css/shop.css', css);

let ts = fs.readFileSync('server.ts', 'utf8');
ts = ts.replace(
  "const exactSlugs = ['vibratorler', 'erkekler', 'realistik-mankenler', 'fantezi-ic-giyim', 'ciftler', 'realistik-dildolar'];",
  "const exactSlugs = ['vibratorler', 'erkekler', 'fantezi-ic-giyim', 'realistik-mankenler', 'ciftler'];"
);
ts = ts.replace(
  "const top = [...topCats, ...homeRemaining].slice(0, 6);",
  "const top = [...topCats, ...homeRemaining].slice(0, 5);"
);
ts = ts.replace(
  "const area = ['a','b','c','f','d','e'][i] || 'a';",
  "const area = ['a','b','c','d','e'][i] || 'a';"
);
ts = ts.replace(
  "<a class=\"bento-card bento-cta bento-card-g rv rv-d${top.length + 1}\" href=\"/magaza\">",
  "<a class=\"bento-card bento-cta bento-card-f rv rv-d${top.length + 1}\" href=\"/magaza\">"
);
fs.writeFileSync('server.ts', ts);

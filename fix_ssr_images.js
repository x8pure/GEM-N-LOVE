import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /<img src="\$\{esc\(p\.image\)\}" alt="\$\{esc\(p\.name\)\}" loading="lazy">/g,
  `\${p.image ? \`<img src="\${esc(p.image)}" alt="\${esc(p.name)}" loading="lazy">\` : \`<div style="width:100%;height:100%;background:transparent"></div>\`}`
);

fs.writeFileSync('server.ts', code);

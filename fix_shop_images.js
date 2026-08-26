import fs from 'fs';
let code = fs.readFileSync('public/js/shop.js', 'utf8');

code = code.replace(
  /<img src="\$\{imgSrc\(p\.image\)\}" alt="\$\{p\.name\}" loading="lazy">/g,
  `\${p.image ? \`<img src="\${imgSrc(p.image)}" alt="\${p.name}" loading="lazy">\` : \`<div style="width:100%;height:100%;background:transparent"></div>\`}`
);
code = code.replace(
  /<img src="\$\{imgSrc\(p\.image\)\}" alt="\$\{esc\(p\.name\)\}" class="qs-item-img" loading="lazy">/g,
  `\${p.image ? \`<img src="\${imgSrc(p.image)}" alt="\${esc(p.name)}" class="qs-item-img" loading="lazy">\` : \`<div class="qs-item-img" style="background:transparent"></div>\`}`
);

fs.writeFileSync('public/js/shop.js', code);

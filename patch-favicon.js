import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

// HTML head kısmındaki favicon tanımlarını SVG'yi önceleyecek şekilde düzenle
code = code.replace(
  '<link rel="icon" type="image/x-icon" href="/favicon.ico">',
  '<!-- <link rel="icon" type="image/x-icon" href="/favicon.ico"> removed -->'
);

fs.writeFileSync('server.ts', code);
console.log("Patched favicon meta tags");

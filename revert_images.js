import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/<img src="\$\{p\.image \? esc\(p\.image\) : 'data:image\/gif;base64,R0lGODlhAQABAIAAAAAAAP\/\/\/yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'\}"/g, `<img src="\${esc(p.image)}"`);
code = code.replace(/<img src="\$\{galleryItem \? esc\(galleryItem\) : 'data:image\/gif;base64,R0lGODlhAQABAIAAAAAAAP\/\/\/yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'\}"/g, `<img src="\${esc(galleryItem)}"`);
code = code.replace(/<img src="\$\{o\.image \? esc\(o\.image\) : 'data:image\/gif;base64,R0lGODlhAQABAIAAAAAAAP\/\/\/yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'\}"/g, `<img src="\${esc(o.image)}"`);
code = code.replace(/<img class="acc-item-thumb" src="\$\{i\.image \? esc\(i\.image\) : 'data:image\/gif;base64,R0lGODlhAQABAIAAAAAAAP\/\/\/yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'\}"/g, `<img class="acc-item-thumb" src="\${esc(i.image)}"`);

fs.writeFileSync('server.ts', code);

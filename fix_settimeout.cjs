const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

// Fixes:
code = code.replace(/setTimeout\s+gate\.classList\.add\(\`hidden\`\);/g, "setTimeout(() => { gate.classList.add(`hidden`);");
code = code.replace(/searchTimer = setTimeout\s+doSearch\(input\.value\);/g, "searchTimer = setTimeout(() => { doSearch(input.value);");
code = code.replace(/setTimeout\s+if \(\!isPulling\) \{/g, "setTimeout(() => { if (!isPulling) {");
code = code.replace(/setTimeout state\.q/g, "setTimeout(() => { state.q");
code = code.replace(/setTimeout\s+mainEl\.classList\.remove\('is-transitioning'\);/g, "setTimeout(() => { mainEl.classList.remove('is-transitioning');");

fs.writeFileSync('public/js/shop.js', code);
console.log('Fixed shop.js');

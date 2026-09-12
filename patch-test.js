import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace("if (!adm) return sendError(res, 403, 'Önce admin girişi gerekli.');", "//if (!adm) return sendError(res, 403, 'Önce admin girişi gerekli.');");
fs.writeFileSync('server.ts', code);
console.log("Patched server.ts");

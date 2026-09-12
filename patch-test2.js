import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace("if (!adm) return sendError(res, 401, E('err.needAdmin'));", "// if (!adm) return sendError(res, 401, E('err.needAdmin'));");
fs.writeFileSync('server.ts', code);
console.log("Patched server.ts 2");

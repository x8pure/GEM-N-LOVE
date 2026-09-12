import fs from 'fs';
let code = fs.readFileSync('lib/db.js', 'utf8');
code = code.replace(/if \(Array\.isArray\(db\.posSales\).*?newDb\.posSales = db\.posSales;\n      \}/s, '');
code = code.replace(/if \(Array\.isArray\(db\.orders\).*?newDb\.orders = db\.orders;\n      \}/s, '');
fs.writeFileSync('lib/db.js', code);
console.log("Hacks removed");

const fs = require('fs');
let code = fs.readFileSync('public/js/modules/account.js', 'utf8');
code = code.replace('async function initAccount()', 'export async function initAccount()');
code = code.replace('async function initProfile()', 'export async function initProfile()');
fs.writeFileSync('public/js/modules/account.js', code);

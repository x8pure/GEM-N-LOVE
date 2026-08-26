import { load, hashPassword } from './lib/db.js';
const hash = hashPassword;

let db = load();
const b = { email: "admin@loveshop.com.tr", password: "admin123" };
const u = db.users.find((x) => x.email === String(b.email || '').trim().toLowerCase());
console.log("User found:", u ? u.email : "none");
if (u) {
  console.log("Hash in DB:", u.passwordHash);
  console.log("Hash of password:", hash(String(b.password || '')));
  console.log("Match:", u.passwordHash === hash(String(b.password || '')));
}

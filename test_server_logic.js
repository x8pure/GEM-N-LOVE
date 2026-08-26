import { load, save, hashPassword } from './lib/db.js';
const hash = hashPassword;

let db = load();
console.log("Before:", db.users.length);

if (Array.isArray(db.users)) {
  let userFixed = false;
  const rootAdmin = db.users.find((u) => u.email === 'admin@loveshop.com.tr');
  if (!rootAdmin) {
    db.users.push({
      id: 'u5ba8df5754d3',
      email: 'admin@loveshop.com.tr',
      passwordHash: hash('admin123'),
      name: 'Mağaza Yönetimi',
      role: 'admin',
      createdAt: new Date().toISOString(),
      addresses: []
    });
    userFixed = true;
  } else {
    rootAdmin.passwordHash = hash('admin123');
    userFixed = true;
  }
  
  if (userFixed) save();
}
console.log("After:", db.users.length);

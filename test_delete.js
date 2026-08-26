import { load } from './lib/db.js';

const db = load();
const adm = db.users.find(u => u.role === 'admin');
console.log("Admin email:", adm?.email);

const body = JSON.stringify({ email: adm.email, password: "admin" });

fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body
}).then(r => r.json()).then(async data => {
  console.log("Login data:", data);
  if (data.token) {
    const prods = await fetch("http://localhost:3000/api/admin/products", {
      headers: { "Authorization": "Bearer " + data.token }
    }).then(r => r.json());
    
    if (prods.products && prods.products.length > 0) {
      const pid = prods.products[0].id;
      console.log("Deleting product:", pid);
      const del = await fetch("http://localhost:3000/api/admin/products/" + pid, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + data.token }
      }).then(r => r.json());
      console.log("Delete response:", del);
    }
  }
});

import http from 'http';
const b = JSON.stringify({ email: "admin@loveshop.com.tr", password: "admin123" });
const req = http.request("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(b) }
}, res => {
  let d = '';
  res.on('data', c => d+=c);
  res.on('end', () => console.log("Response:", d));
});
req.write(b);
req.end();

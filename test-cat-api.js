const http = require('http');

const body = JSON.stringify({ name: "Deneme Yeni", slug: "" });

const req = http.request({
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/admin/categories',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    // we need the x-ls-token!
  }
}, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(res.statusCode, data));
});
req.write(body);
req.end();

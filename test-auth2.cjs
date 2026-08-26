const http = require('http');
const req = http.request({ hostname: '127.0.0.1', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, res => {
  let token = res.headers['set-cookie'].find(c => c.startsWith('ls_token=')).split(';')[0].split('=')[1];
  
  const req2 = http.request({ hostname: '127.0.0.1', port: 3000, path: '/api/admin/categories', method: 'POST', headers: { 'Content-Type': 'application/json', 'x-ls-token': token } }, res2 => {
    let data = '';
    res2.on('data', d => data += d);
    res2.on('end', () => console.log('POST Response:', data));
  });
  req2.write(JSON.stringify({ name: "Bir Başka Yeni", slug: "deneme" }));
  req2.end();
});
req.write(JSON.stringify({ email: 'admin@loveshop.com.tr', password: 'loveshop2026' }));
req.end();

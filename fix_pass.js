import crypto from 'crypto';
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');
console.log("admin hash:", hash("admin"));
console.log("123456 hash:", hash("123456"));
console.log("loveshop hash:", hash("loveshop"));

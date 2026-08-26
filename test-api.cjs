const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/categories',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

// I need the token. Let's just look at the code for bug

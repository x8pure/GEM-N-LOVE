const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

// The code currently has:
//       requestAnimationFrame(loop);
//       
//   }
// Let's replace it with:
//       requestAnimationFrame(loop);
//     })();
//   }

code = code.replace(/requestAnimationFrame\(loop\);\n\s+\n\s+\}/g, "requestAnimationFrame(loop);\n    })();\n  }");

fs.writeFileSync('public/js/shop.js', code);
console.log('Fixed loop');

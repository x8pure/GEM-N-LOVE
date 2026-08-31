const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const buggy = `      } finally {
        activeCartFetchPromise = null;
      }
        return activeCartFetchPromise;
  }`;

const fixed = `      } finally {
        activeCartFetchPromise = null;
      }
    })();
    return activeCartFetchPromise;
  }`;

code = code.replace(buggy, fixed);
fs.writeFileSync('public/js/shop.js', code);
console.log('Fixed activeCartFetchPromise');

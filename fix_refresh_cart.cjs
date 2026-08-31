const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const missingPart = `  let activeCartFetchPromise = null;
  async function refreshCartBadge() {
    const local = getLocalCart();
    if (local && Array.isArray(local.items)) {
      const localCount = local.items.reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
      updateCartBadge(localCount);
    } else {
      updateCartBadge(0);
    }

    if (!local || !Array.isArray(local.items) || local.items.length === 0) {
      return null;
    }

    if (activeCartFetchPromise) {
      return activeCartFetchPromise;
    }`;

// Currently shop.js has:
//     }
//     activeCartFetchPromise = (async () => {

code = code.replace(/    \}\n    activeCartFetchPromise = \(async \(\) => \{/s, missingPart + '\n    activeCartFetchPromise = (async () => {');

fs.writeFileSync('public/js/shop.js', code);
console.log('Fixed refreshCartBadge');

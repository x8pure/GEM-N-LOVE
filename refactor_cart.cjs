const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const importStatement = `import { getLocalCart, setLocalCart, updateCartBadge, addToCart, initCart } from './modules/cart.js';\n`;

if (!code.includes(importStatement)) {
  code = code.replace("'use strict';\n", "'use strict';\n" + importStatement);
}

// Ensure catName is exported to window for cart module
const catNameMatch = code.match(/function catName\(slug, name\) \{[\s\S]*?return name \|\| CAT_EN\[slug\] \|\| slug;\n\s*\}/);
if (catNameMatch && !code.includes('window.LS.catName = catName;')) {
  code = code.replace(catNameMatch[0], catNameMatch[0] + '\n  window.LS.catName = catName;');
}

const getLocalCartRegex = /function getLocalCart\(\) \{[\s\S]*?\} catch \{ return null; \}\n\s*\}/;
code = code.replace(getLocalCartRegex, '// getLocalCart imported from modules/cart.js\n  window.getLocalCart = getLocalCart;');

const setLocalCartRegex = /function setLocalCart\(cart\) \{[\s\S]*?\} catch \{\}\n\s*\}/;
code = code.replace(setLocalCartRegex, '// setLocalCart imported from modules/cart.js\n  window.setLocalCart = setLocalCart;');

const updateCartBadgeRegex = /function updateCartBadge\(count, isNewAdd = false\) \{[\s\S]*?\}\);?\n\s*\}/;
code = code.replace(updateCartBadgeRegex, '// updateCartBadge imported from modules/cart.js\n  window.updateCartBadge = updateCartBadge;');

const addToCartRegex = /async function addToCart\(productId, qty = 1, variant = 'standart', btn = null\) \{[\s\S]*?LS\.addToCart = addToCart;/;
code = code.replace(addToCartRegex, '// addToCart imported from modules/cart.js\n  window.addToCart = addToCart;\n  LS.addToCart = addToCart;');

const initCartStart = code.indexOf('async function initCart() {');
if (initCartStart > -1) {
  const endStr = "render();\n  }";
  const endIdx = code.indexOf(endStr, initCartStart);
  if (endIdx > -1) {
    code = code.substring(0, initCartStart) + 
           '// initCart imported from modules/cart.js\n  window.initCart = initCart;\n  ' + 
           code.substring(endIdx + endStr.length);
  }
}

fs.writeFileSync('public/js/shop.js', code);

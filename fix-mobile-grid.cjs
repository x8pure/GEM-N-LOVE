const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '.prod-grid,\n  #featured-grid,\n  #new-grid,\n  .shop-layout .prod-grid {\n    display: block !important;\n    column-count: 2 !important;\n    column-gap: 12px !important;\n    width: 100% !important;\n    padding: 0 !important;\n  }',
  '.prod-grid,\n  #featured-grid,\n  #new-grid,\n  .shop-layout .prod-grid {\n    display: grid !important;\n    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;\n    gap: 12px !important;\n    width: 100% !important;\n    padding: 0 !important;\n    align-items: start !important;\n  }'
);

css = css.replace(
  '  .prod-card {\n    display: inline-flex !important;\n    flex-direction: column !important;\n    justify-content: space-between !important;\n    width: 100% !important;\n    break-inside: avoid !important;\n    page-break-inside: avoid !important;\n    -webkit-column-break-inside: avoid !important;\n    margin: 0 0 12px 0 !important;\n    height: auto !important;\n    padding: 12px 12px 14px !important;\n    border-radius: 22px !important;\n    box-sizing: border-box !important;\n  }',
  '  .prod-card {\n    display: flex !important;\n    flex-direction: column !important;\n    justify-content: space-between !important;\n    width: 100% !important;\n    margin: 0 !important;\n    height: 100% !important;\n    padding: 12px 12px 14px !important;\n    border-radius: 22px !important;\n    box-sizing: border-box !important;\n  }'
);

fs.writeFileSync('public/css/shop.css', css);

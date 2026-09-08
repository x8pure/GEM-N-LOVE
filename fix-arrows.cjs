const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  '.bento-arrow-icon {\n  position: absolute;\n  top: 18px;\n  right: 18px;\n  z-index: 4;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.85);\n  border: 1px solid var(--line);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #71717A;\n  opacity: 0.65;\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  transition: opacity .25s ease, transform .25s ease, background .25s ease, color .25s ease;\n}',
  '.bento-arrow-icon {\n  position: absolute;\n  top: 18px;\n  right: 18px;\n  z-index: 4;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.85);\n  border: 1px solid var(--line);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #71717A;\n  opacity: 0;\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  transform: translate(-4px, 4px);\n  transition: opacity .35s ease, transform .35s cubic-bezier(0.16, 1, 0.3, 1), background .25s ease, color .25s ease;\n}'
);

css = css.replace(
  '.bento-card:hover .bento-arrow-icon {\n  opacity: 1;\n  color: #18181B;\n  transform: translate(2px, -2px);\n  background: #FFFFFF;\n}',
  '.bento-card:hover .bento-arrow-icon {\n  opacity: 1;\n  color: #18181B;\n  transform: translate(0, 0);\n  background: #FFFFFF;\n}'
);

fs.writeFileSync('public/css/shop.css', css);

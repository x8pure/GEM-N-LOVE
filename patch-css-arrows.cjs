const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'css', 'shop.css');
let code = fs.readFileSync(file, 'utf8');

const newCSS = `
/* Outer Navigation Arrows (Sonsuz Hızlı Gözat) */
.spatial-nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100000;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
  pointer-events: none;
}

.spatial-canvas-overlay.open .spatial-nav-arrow {
  opacity: 1;
  pointer-events: auto;
}

.spatial-nav-arrow:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transform: translateY(-50%) scale(1.1);
}

.spatial-nav-arrow svg {
  width: 24px;
  height: 24px;
}

.spatial-nav-prev {
  left: 24px;
}

.spatial-nav-next {
  right: 24px;
}

/* Hide outer arrows on mobile, as swipe gestures are usually expected there, 
   but for now we keep them only for desktop where mouse hovering happens */
@media (max-width: 768px) {
  .spatial-nav-arrow {
    display: none !important;
  }
}
`;

code += newCSS;
fs.writeFileSync(file, code);
console.log('Patched css for arrows');

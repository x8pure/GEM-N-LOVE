const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

const importStatement = `import { initSpatialAnimations, openSpatialCardZoom, closeSpatialCardZoom } from './modules/spatial.js';\n`;

if (!code.includes(importStatement)) {
  code = code.replace("'use strict';\n", "'use strict';\n" + importStatement);
}

// Remove initTiltPhysics
const initTiltPhysicsStart = code.indexOf('function initTiltPhysics() {');
if (initTiltPhysicsStart > -1) {
  const endStr = "/* ---------- product card template ---------- */";
  const endIdx = code.indexOf(endStr, initTiltPhysicsStart);
  if (endIdx > -1) {
    code = code.substring(0, initTiltPhysicsStart) + 
           '// initTiltPhysics logic moved to modules/spatial.js\n  ' + 
           code.substring(endIdx);
  }
}

// Remove activeOriginCard and activeZoomRequestId and openSpatialCardZoom and closeSpatialCardZoom and the event delegation
const spatialSectionStart = code.indexOf('/* ================= 2026 SPATIAL CARD ZOOM (MORPHING CANVAS) ================= */');
if (spatialSectionStart > -1) {
  const endStr = "function getProductSpecs(prod) {";
  const endIdx = code.indexOf(endStr, spatialSectionStart);
  if (endIdx > -1) {
    code = code.substring(0, spatialSectionStart) + 
           '/* ================= 2026 SPATIAL CARD ZOOM ================= */\n  // Spatial zoom and tilt physics moved to modules/spatial.js\n  window.openSpatialCardZoom = openSpatialCardZoom;\n  window.closeSpatialCardZoom = closeSpatialCardZoom;\n  ' + 
           code.substring(endIdx);
  }
}

fs.writeFileSync('public/js/shop.js', code);

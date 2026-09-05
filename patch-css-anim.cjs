const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'css', 'shop.css');
let code = fs.readFileSync(file, 'utf8');

code += `
/* Crossfade Animations for Smart Playlist */
.spatial-grid {
  transition: opacity 0.25s ease-in-out;
}
.spatial-grid.crossfade-in {
  animation: spatialCrossfade 0.4s ease-out forwards;
}

@keyframes spatialCrossfade {
  0% {
    opacity: 0.2;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Let's make sure the arrows conditionally show based on playlist size */
/* But since it's JS driven, we can just let JS control it or rely on the playlist size. */
.spatial-outer-prev, .spatial-outer-next {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s;
}
`;

fs.writeFileSync(file, code);
console.log('Patched css animations');

const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, 'public', 'css', 'shop.css');
let css = fs.readFileSync(cssPath, 'utf8');

// The bottom action bar shouldn't hug the bottom too closely, give it breathing room.
// In the desktop @media (min-width: 769px) block:
// .spatial-card-stage .spatial-bottom-action-bar { padding: 24px 0 32px 0; }
// Wait, 32px bottom padding is actually decent. But maybe .spatial-content-pane has no padding bottom and it cuts off?
// Actually in `.spatial-content-pane` we had padding: 40px 48px 0;
// So it hits the absolute bottom! 
// Let's modify the desktop block again.

css = css.replace(
  /\.spatial-content-pane\s*\{\s*padding:\s*40px\s*48px\s*0;\s*display:\s*flex;\s*flex-direction:\s*column;\s*height:\s*100%;\s*\}/,
  `.spatial-content-pane {
    padding: 40px 48px; /* Give it bottom padding too */
    display: flex;
    flex-direction: column;
    height: 100%;
  }`
);

// We need to vertically center the scrollable body content.
// The scrollable body has:
// flex: 1 1 auto; overflow-y: auto; padding-bottom: 24px;
// If we add justify-content: center, it will center everything vertically!
css = css.replace(
  /\.spatial-scrollable-body\s*\{\s*flex:\s*1\s*1\s*auto;\s*overflow-y:\s*auto;\s*padding-bottom:\s*24px;\s*\}/,
  `.spatial-scrollable-body {
    flex: 1 1 auto;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: center; /* THIS CENTERS THE CONTENT VERTICALLY */
    padding-bottom: 24px;
  }`
);

// Fix typography on the feature list specifically to be elegant.
css += `
@media (min-width: 769px) {
  .spatial-swiss-item span {
    font-weight: 400 !important;
    font-size: 13.5px !important;
    letter-spacing: 0.01em;
    color: var(--text) !important;
    opacity: 0.85;
  }
  .spatial-swiss-icon {
    opacity: 0.7;
    width: 20px !important;
    height: 20px !important;
  }
  
  /* Fix the top bar overlap */
  .spatial-top-meta-editorial {
    padding-right: 60px; /* More room for the X button */
  }
  
  .spatial-stage-close {
    /* Pin the close button strictly to the main wrapper, not relative to scrolling content */
    top: 32px !important;
    right: 32px !important;
  }
  
  /* Make the Add to Cart bar cleaner */
  .spatial-card-stage .spatial-bottom-action-bar {
    padding: 24px 0 0 0 !important; /* The padding-bottom is handled by content-pane now */
  }
}
`;

fs.writeFileSync(cssPath, css);
console.log('Fixed card details');

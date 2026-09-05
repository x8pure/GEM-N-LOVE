sed -i 's/justify-content: center;/justify-content: flex-start;/g' public/css/shop.css

cat << 'INNER_EOF' >> public/css/shop.css

/* Fix the void and close button issues on desktop */
@media (min-width: 769px) {
  /* Fix close button contrast in light mode */
  .spatial-stage-close {
    background: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.08) !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
  }
  
  html.dark .spatial-stage-close {
    background: #272422 !important;
    border: 1px solid rgba(255, 255, 255, 0.14) !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
  }

  /* Keep the scrollable body tight at the top */
  .spatial-scrollable-body {
    justify-content: flex-start;
    padding-top: 0;
    gap: 0;
  }

  /* Make sure the bottom action bar container sticks to the bottom */
  .spatial-content-pane {
    padding: 40px 48px 0;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* Ensure the content area pushes the action bar down */
  .spatial-scrollable-body {
    flex: 1 1 auto;
    overflow-y: auto;
    padding-bottom: 24px;
  }

  /* The action bar at the bottom */
  .spatial-card-stage .spatial-bottom-action-bar {
    position: relative;
    border-top: 1px solid var(--line);
    background: var(--bg);
    padding: 24px 0 32px 0;
    margin-top: auto;
    flex-shrink: 0;
    width: 100%;
    bottom: auto;
    left: auto;
    right: auto;
    z-index: 10;
  }

  /* Group features closer together */
  .spatial-spec-deck {
    margin-bottom: 24px;
  }

  .spatial-trust-ribbon {
    margin-top: 0;
  }
}
INNER_EOF

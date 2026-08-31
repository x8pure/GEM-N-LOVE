/* ================= TRANSPARENT PRODUCT IMAGE AUTO-CROP & NORMALIZER ================= */
const _normalizedCache = new Map();

/**
 * Normalizes transparent WebP/PNG images so that the product content fills a standardized
 * bounding area regardless of original whitespace padding around the image.
 */
export function normalizeTransparentImage(img) {
  if (!img || img.dataset.autocropped === "true") return;
  const src = img.src || img.getAttribute('src');
  if (!src || src.startsWith('data:image/svg')) return;

  // Mark as processed so we don't loop endlessly
  img.dataset.autocropped = "true";

  if (_normalizedCache.has(src)) {
    const cached = _normalizedCache.get(src);
    if (cached && img.src !== cached) img.src = cached;
    return;
  }

  const runNormalization = () => {
    try {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) return;

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!tempCtx) return;

      tempCanvas.width = w;
      tempCanvas.height = h;

      tempCtx.drawImage(img, 0, 0, w, h);

      let imgData;
      try {
        imgData = tempCtx.getImageData(0, 0, w, h);
      } catch (corsErr) {
        return;
      }

      const data = imgData.data;
      let minX = w, minY = h, maxX = 0, maxY = 0;
      let found = false;

      // Scan for non-transparent pixels (alpha > 15)
      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          const alpha = data[(y * w + x) * 4 + 3];
          if (alpha > 15) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            found = true;
          }
        }
      }

      if (!found) return;

      // Expand 2px for smooth anti-aliased edge safety
      minX = Math.max(0, minX - 2);
      minY = Math.max(0, minY - 2);
      maxX = Math.min(w - 1, maxX + 2);
      maxY = Math.min(h - 1, maxY + 2);

      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;

      // Only re-canvas if there is meaningful padding to trim (>3% margin)
      if (cropW < w * 0.97 || cropH < h * 0.97) {
        const TARGET_SIZE = 600;
        const FILL_RATIO = 0.85; // Standardized 85% product visual fill
        const TARGET_FILL = TARGET_SIZE * FILL_RATIO;

        const outCanvas = document.createElement('canvas');
        outCanvas.width = TARGET_SIZE;
        outCanvas.height = TARGET_SIZE;
        const outCtx = outCanvas.getContext('2d');

        const scale = TARGET_FILL / Math.max(cropW, cropH);
        const tw = Math.round(cropW * scale);
        const th = Math.round(cropH * scale);
        const tx = Math.round((TARGET_SIZE - tw) / 2);
        const ty = Math.round((TARGET_SIZE - th) / 2);

        outCtx.drawImage(tempCanvas, minX, minY, cropW, cropH, tx, ty, tw, th);

        const normalizedDataUrl = outCanvas.toDataURL('image/webp', 0.92);
        _normalizedCache.set(src, normalizedDataUrl);
        img.src = normalizedDataUrl;
      } else {
        _normalizedCache.set(src, src);
      }
    } catch (e) {
      // Quiet fail fallback
    }
  };

  if (img.complete && img.naturalWidth > 0) {
    runNormalization();
  } else {
    img.addEventListener('load', runNormalization, { once: true });
  }
}

/**
 * Initializes MutationObserver to automatically auto-crop and normalize any product image rendered anywhere in the DOM.
 */
export function initAutoCropNormalizer() {
  const processAll = () => {
    const selector = '.prod-media img, .cf-card img, .pd-gallery img, .qs-img-wrap img, .cart-item img';
    document.querySelectorAll(selector).forEach(normalizeTransparentImage);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processAll);
  } else {
    processAll();
  }

  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    for (const m of mutations) {
      if (m.addedNodes.length > 0) {
        shouldCheck = true;
        break;
      }
    }
    if (shouldCheck) {
      processAll();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

import { api } from './api.js';
import { toast } from './ui.js';
import { addToCart } from './cart.js';

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const LANG = window.__LS_LANG__ || 'tr';
const imgSrc = (s) => {
  if (!s) return '';
  const str = String(s);
  if (str.startsWith('data:') || str.startsWith('http://') || str.startsWith('https://') || str.includes('?')) return str;
  return str + '?v=transparent2';
};
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
const t = (...args) => (window.LS && window.LS.t) ? window.LS.t(...args) : (args[0] || '');
const catName = (c, n) => (window.LS && window.LS.catName) ? window.LS.catName(c, n) : (n || c || '');
const fmt = (n) => (window.LS && window.LS.fmt) ? window.LS.fmt(n) : new Intl.NumberFormat(LANG === 'en' ? 'en-US' : 'tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);

export function initTiltPhysics() {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.prod-card');
    if (!card) return;
    const media = card.querySelector('.prod-media');
    if (!media) return;
    const rect = media.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    media.style.setProperty('--sheen-x', `${px.toFixed(1)}%`);
    media.style.setProperty('--sheen-y', `${py.toFixed(1)}%`);
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 6;
    const rotX = -((y - cy) / cy) * 6;
    media.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
  }, { passive: true });
  document.addEventListener('pointerout', (e) => {
    const card = e.target.closest('.prod-card');
    if (!card || card.contains(e.relatedTarget)) return;
    const media = card.querySelector('.prod-media');
    if (media) media.style.transform = '';
  });
}

// Compute Smart Dynamic Specs (Custom Highlights > Category Rules > Universal Safe Specs)
export function getProductSpecs(prod) {
  if (Array.isArray(prod.highlights) && prod.highlights.length) {
    const icons = [
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
      '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>'
    ];
    return prod.highlights.slice(0, 4).map((text, i) => ({
      icon: icons[i % icons.length],
      text: String(text).trim()
    }));
  }

  const cat = String(prod.category || '').toLowerCase();
  const name = String(prod.name || '').toLowerCase();

  // Electronic / Vibrators / Masturbators / Dolls
  if (cat.includes('vibrator') || cat.includes('masturbator') || cat.includes('vajina') || cat.includes('sisme') || name.includes('vibratör') || name.includes('şarjlı') || name.includes('motor')) {
    return [
      { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', text: LANG === 'en' ? 'Medical Silicone' : '%100 Medikal Silikon' },
      { icon: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>', text: LANG === 'en' ? 'IPX7 Waterproof' : 'IPX7 Su Geçirmez' },
      { icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', text: LANG === 'en' ? 'Magnetic USB Charge' : 'Manyetik USB Şarj' },
      { icon: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>', text: LANG === 'en' ? '<40dB Whisper Motor' : '<40dB Fısıltı Motoru' }
    ];
  }

  // Cosmetics / Oils / Lubricants / Sprays / Care
  if (cat.includes('kozmetik') || cat.includes('saglik') || name.includes('jel') || name.includes('yağ') || name.includes('sprey') || name.includes('krem') || name.includes('lube')) {
    return [
      { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', text: LANG === 'en' ? 'Dermatologically Tested' : 'Dermatolojik Test Edildi' },
      { icon: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>', text: LANG === 'en' ? 'Water Based & Safe pH' : 'Su Bazlı & Güvenli pH' },
      { icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>', text: LANG === 'en' ? 'Condom & Skin Safe' : 'Cilt & Prezervatif Uyumlu' },
      { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>', text: LANG === 'en' ? 'Stain Free & Easy Clean' : 'Leke Bırakmaz & Kolay Temizlenir' }
    ];
  }

  // Lingerie / Costume / Fantasy
  if (cat.includes('fantezi') || cat.includes('fantasy') || cat.includes('kostum') || cat.includes('giyim') || name.includes('çorap') || name.includes('gecelik') || name.includes('deri') || name.includes('dantel')) {
    return [
      { icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>', text: LANG === 'en' ? 'Soft Touch Fabric' : 'Hassas & Yumuşak Doku' },
      { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', text: LANG === 'en' ? 'Flexible Ergonomic Fit' : 'Esnek & Rahat Kalıp' },
      { icon: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>', text: LANG === 'en' ? 'Breathable Textile' : 'Nefes Alan Kumaş' },
      { icon: '<polyline points="20 6 9 17 4 12"/>', text: LANG === 'en' ? 'Premium Handcraft' : 'Kaliteli & Dayanıklı Dikiş' }
    ];
  }

  // Dildos / Anal / Non-electric Body Safe Products
  if (cat.includes('dildo') || cat.includes('anal') || cat.includes('knot')) {
    return [
      { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', text: LANG === 'en' ? '%100 Body-Safe Material' : '%100 Vücut Dostu Materyal' },
      { icon: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>', text: LANG === 'en' ? '100% Waterproof' : '%100 Su Geçirmez' },
      { icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', text: LANG === 'en' ? 'Seamless & Hypoallergenic' : 'Pürüzsüz & Hipoalerjenik' },
      { icon: '<polyline points="20 6 9 17 4 12"/>', text: LANG === 'en' ? 'Easy to Sanitize' : 'Kolay Sterilize Edilir' }
    ];
  }

  // Universal Default Trust & Quality Specs
  return [
    { icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', text: LANG === 'en' ? '100% Original & Invoiced' : '%100 Orijinal & Faturalı' },
    { icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>', text: LANG === 'en' ? 'Discreet Packaging' : '%100 Gizli Paketleme' },
    { icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', text: LANG === 'en' ? 'Fast 24h Dispatch' : '24 Saatte Hızlı Kargo' },
    { icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', text: LANG === 'en' ? 'Premium Quality Standard' : 'Yüksek Kalite Standardı' }
  ];
}

let activeOriginCard = null;
let activeZoomRequestId = 0;

export async function openSpatialCardZoom(productIdOrSlug, originCard) {
  if (!productIdOrSlug) return;
  const overlay = $('#spatial-canvas-overlay');
  const stage = $('#spatial-card-stage');
  if (!overlay || !stage) return;
  const reqId = ++activeZoomRequestId;
  activeOriginCard = originCard;
  document.body.style.overflow = 'hidden';

  // Morph origin card if available
  if (originCard) {
    originCard.style.opacity = '0.4';
    originCard.style.transform = 'scale(0.97)';
    originCard.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  }

  stage.innerHTML = `
    <button type="button" class="spatial-stage-close" id="spatial-stage-close" aria-label="${LANG === 'en' ? 'Close' : 'Kapat'}">✕</button>
    <div style="display:flex;align-items:center;justify-content:center;height:460px;width:100%;">
      <div class="spinner"></div>
    </div>
  `;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');

  try {
    const cleanKey = String(productIdOrSlug || '').replace(/^\/urun\//, '').replace(/\/+$/, '').trim();
    const res = await api('/api/products/' + encodeURIComponent(cleanKey));
    if (reqId !== activeZoomRequestId) return;
    const p = (res && res.product) ? res.product : res;
    if (!p || !p.id) throw new Error('Ürün bulunamadı');

    const inStock = p.stock > 0;
    const stockBadge = inStock
      ? `<span class="stock-pill in-stock">● ${LANG === 'en' ? 'In Stock · Ships in 24h' : 'Stokta · 24 Saatte Kargoda'}</span>`
      : `<span class="stock-pill out-stock">● ${LANG === 'en' ? 'Out of Stock' : 'Tükendi'}</span>`;

    const productGallery = (Array.isArray(p.gallery) && p.gallery.length) ? p.gallery : (p.image ? [p.image] : []);
    const hasMultipleImages = productGallery.length > 1;

    stage.innerHTML = `
      <button type="button" class="spatial-stage-close" id="spatial-stage-close" aria-label="${LANG === 'en' ? 'Close' : 'Kapat'}">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="spatial-grid">
        <div class="spatial-visual-hero">
          <div class="spatial-ambient-glow" id="spatial-ambient-glow"></div>
          <img id="spatial-main-image" src="${imgSrc(p.image)}" alt="${esc(p.name)}">
          <div class="spatial-badge-cluster">
            ${p.isNew ? `<span>${t('badge.new')}</span>` : ''}
            ${p.oldPrice ? `<span>${t('badge.sale')}</span>` : ''}
            ${(!p.isNew && !p.oldPrice && p.bestSeller) ? `<span>${t('badge.hot')}</span>` : ''}
          </div>
          ${hasMultipleImages ? `
            <button type="button" class="spatial-nav-btn prev" id="spatial-nav-prev" aria-label="${LANG === 'en' ? 'Previous image' : 'Önceki Fotoğraf'}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button type="button" class="spatial-nav-btn next" id="spatial-nav-next" aria-label="${LANG === 'en' ? 'Next image' : 'Sonraki Fotoğraf'}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
            <div class="spatial-dots" id="spatial-dots">
              ${productGallery.map((_, idx) => `
                <span class="spatial-dot ${idx === 0 ? 'active' : ''}" data-dot-idx="${idx}"></span>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="spatial-content-pane">
          <div class="spatial-top-meta">
            <a href="/magaza?kat=${encodeURIComponent(p.category || '')}" class="spatial-cat" title="${catName(p.category, p.categoryName)}">
              <span>${catName(p.category, p.categoryName)}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
            <div class="spatial-rating-row">
              <span class="rating-stars">${stars(p.rating || 5)}</span>
              <span class="count">(${p.reviewCount || 0})</span>
            </div>
          </div>

          <h1 class="spatial-title"><a href="/urun/${p.slug}">${esc(p.name)}</a></h1>

          <div class="spatial-price-cluster">
            <div class="spatial-price-values">
              <span class="spatial-price">${fmt(p.price)}</span>
              ${p.oldPrice ? `<span class="spatial-price-old">${fmt(p.oldPrice)}</span>` : ''}
            </div>
            <div class="spatial-live-presence">
              <span class="pulse-indicator ${inStock ? 'live-green' : 'live-red'}"></span>
              <span>${inStock ? (LANG === 'en' ? 'In Stock · 24h Dispatch' : 'Stokta · 24s Kargo') : (LANG === 'en' ? 'Out of Stock' : 'Tükendi')}</span>
            </div>
          </div>

          <a href="/urun/${p.slug}" class="spatial-all-features-link">
            <span>${LANG === 'en' ? 'Explore full specifications' : 'Tüm özellikleri keşfet'}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>

          <!-- 2026 Apple Dynamic Island Action Pill -->
          <div class="spatial-action-bar">
            <div class="spatial-dynamic-pill">
              <div class="spatial-pill-stepper">
                <button type="button" class="spatial-qty-btn" id="spatial-qty-dec" aria-label="Azalt">−</button>
                <span class="spatial-qty-val" id="spatial-qty-val">1</span>
                <button type="button" class="spatial-qty-btn" id="spatial-qty-inc" aria-label="Artır">+</button>
              </div>
              <div class="spatial-pill-divider"></div>
              <button type="button" class="spatial-pill-cta" id="spatial-add-btn" data-product-id="${p.id}" ${!inStock ? 'disabled' : ''}>
                <svg class="pill-bag-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span class="pill-cta-label">${LANG === 'en' ? 'Add to Bag' : 'Sepete Ekle'}</span>
                <span class="pill-cta-dot">·</span>
                <span class="pill-cta-price" id="spatial-pill-price">${fmt(p.price)}</span>
              </button>
            </div>

            <div class="spatial-whisper">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>${LANG === 'en' ? '100% Discreet Packaging · Anonymous Delivery' : '%100 Gizli Paketleme · Anonim Teslimat'}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Spatial gallery thumbnail switcher
    const spatialMain = $('#spatial-main-image', stage);
    const spatialGlow = $('#spatial-ambient-glow', stage);
    
    // 2026 Apple Spatial Physics & Depth-of-Field Pull-to-Zoom
    const spatialVisual = $('.spatial-visual-hero', stage);
    const stageGrid = $('.spatial-grid', stage);
    const contentPane = $('.spatial-content-pane', stage);
    const closeBtn = $('#spatial-stage-close', stage);
    const badgeCluster = $('.spatial-badge-cluster', stage);
    
    if (spatialVisual && spatialMain) {
      let startX = 0;
      let startY = 0;
      let currentScale = 1;
      let lastDeltaY = 0;
      let lastDeltaX = 0;
      let isPulling = false;
      
      spatialVisual.addEventListener('touchstart', (e) => {
        if (e.target.closest('.spatial-nav-btn') || e.target.closest('.spatial-dots')) return;
        
        const scrollTop = stageGrid ? stageGrid.scrollTop : 0;
        if (scrollTop <= 5 && e.touches.length === 1) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          isPulling = true;
          currentScale = 1;
          lastDeltaY = 0;
          lastDeltaX = 0;
          
          spatialMain.style.transition = 'none';
          spatialMain.style.transformOrigin = '50% 25%';
          spatialMain.style.willChange = 'transform, filter';
          spatialMain.style.zIndex = '999';
          spatialVisual.style.overflow = 'visible';
          spatialVisual.style.zIndex = '50';
          if (stageGrid) stageGrid.style.overflow = 'visible';
          
          if (spatialGlow) spatialGlow.style.transition = 'none';
          if (contentPane) contentPane.style.transition = 'none';
          if (closeBtn) closeBtn.style.transition = 'none';
          if (badgeCluster) badgeCluster.style.transition = 'none';
        }
      }, { passive: true });

      spatialVisual.addEventListener('touchmove', (e) => {
        if (!isPulling) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        const deltaX = currentX - startX;
        
        if (deltaY > 0) {
          e.preventDefault();
          lastDeltaY = deltaY;
          lastDeltaX = deltaX;
          if (!spatialVisual.classList.contains('is-pulling')) {
            spatialVisual.classList.add('is-pulling');
          }
          if (stage && !stage.classList.contains('is-pulling-mode')) {
            stage.classList.add('is-pulling-mode');
          }
          
          // Eased rubber-band downward pull physics with enlarged dynamic zoom
          // Şeffaf PNG ürün görseli z-index: 999 ile bilgi kartının üzerine çıkar ve devleşir (1.0 -> 1.68)
          // Arka plandaki bilgi paneli sinematik blur (6px) ve hafif küçülmeyle (scale 0.95) arkaya itilir
          const maxTravelY = 125;
          const pullForce = deltaY * 0.52;
          const moveY = Math.min(maxTravelY, pullForce / (1 + pullForce / (maxTravelY * 2.1)));
          const progress = Math.min(1, moveY / maxTravelY);
          
          // Gerçek ve belirgin büyüme: 1.0 -> 1.68 (şeffaf görsel tüm detaylarıyla devleşir)
          const scale = 1 + progress * 0.68;
          currentScale = scale;
          
          // Direct downward enlargement on top of blurred content pane with rich realistic drop-shadow
          spatialMain.style.transform = `translateY(${moveY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
          spatialMain.style.filter = `drop-shadow(0 ${(18 + moveY * 0.35).toFixed(1)}px ${(32 + moveY * 0.45).toFixed(1)}px rgba(0,0,0,${(0.28 + progress * 0.26).toFixed(2)}))`;
          
          if (spatialGlow) {
            spatialGlow.style.transform = `translate(-50%, -50%) translateY(${(moveY * 0.4).toFixed(1)}px) scale(${(1 + progress * 0.45).toFixed(2)})`;
            spatialGlow.style.opacity = '1';
          }

          // 3D Depth of Field & Receding UI: Bilgi kartı sinematik bir derinlikle bulanıklaşır ve arkaya çekilir
          if (contentPane) {
            const blurPx = (progress * 6.0).toFixed(1);
            const paneScale = (1 - progress * 0.05).toFixed(3);
            const paneShift = (progress * 9).toFixed(1);
            const paneOpacity = (1 - progress * 0.25).toFixed(2);
            contentPane.style.filter = `blur(${blurPx}px)`;
            contentPane.style.transform = `scale(${paneScale}) translateY(${paneShift}px)`;
            contentPane.style.opacity = paneOpacity;
          }
          if (closeBtn) {
            closeBtn.style.opacity = (1 - progress * 0.7).toFixed(2);
          }
          if (badgeCluster) {
            badgeCluster.style.opacity = (1 - progress * 0.7).toFixed(2);
          }
        } else {
          isPulling = false;
          if (spatialMain.style.transform && spatialMain.style.transform !== 'none') {
            resetZoom();
          }
        }
      }, { passive: false });

      const resetZoom = () => {
        if (isPulling || currentScale > 1 || lastDeltaY > 0) {
          isPulling = false;
          currentScale = 1;

          // Apple spring physics: Smooth bounce back into calm position
          const springTransition = 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), filter 0.38s ease, opacity 0.32s ease';
          spatialMain.style.transition = springTransition;
          spatialMain.style.transform = 'translateY(0) scale(1)';
          spatialMain.style.filter = '';
          
          if (contentPane) {
            contentPane.style.transition = 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), filter 0.38s ease, opacity 0.32s ease';
            contentPane.style.filter = 'none';
            contentPane.style.opacity = '1';
            contentPane.style.transform = 'none';
          }
          if (closeBtn) {
            closeBtn.style.transition = 'opacity 0.28s ease';
            closeBtn.style.opacity = '1';
          }
          if (badgeCluster) {
            badgeCluster.style.transition = 'opacity 0.28s ease';
            badgeCluster.style.opacity = '1';
          }
          if (spatialGlow) {
            spatialGlow.style.transition = springTransition;
            spatialGlow.style.transform = 'translate(-50%, -50%) scale(1)';
            spatialGlow.style.opacity = '';
          }
          
          setTimeout(() => {
            if (!isPulling) {
              spatialVisual.classList.remove('is-pulling');
              if (stage) stage.classList.remove('is-pulling-mode');
              spatialMain.style.transition = '';
              spatialMain.style.transform = '';
              spatialMain.style.willChange = '';
              spatialMain.style.zIndex = '';
              spatialMain.style.filter = '';
              
              if (contentPane) {
                contentPane.style.transition = '';
                contentPane.style.filter = '';
                contentPane.style.opacity = '';
                contentPane.style.transform = '';
              }
              if (closeBtn) {
                closeBtn.style.transition = '';
                closeBtn.style.opacity = '';
              }
              if (badgeCluster) {
                badgeCluster.style.transition = '';
                badgeCluster.style.opacity = '';
              }
              spatialVisual.style.overflow = '';
              spatialVisual.style.zIndex = '';
              if (stageGrid) stageGrid.style.overflow = '';
              if (stage) stage.style.overflow = '';
              
              if (spatialGlow) {
                spatialGlow.style.transition = '';
                spatialGlow.style.transform = '';
              }
              lastDeltaY = 0;
              lastDeltaX = 0;
            }
          }, 380);
        }
      };

      spatialVisual.addEventListener('touchend', resetZoom);
      spatialVisual.addEventListener('touchcancel', resetZoom);
    }

    // Gallery Arrow & Dot Navigation (Option 1)
    if (hasMultipleImages) {
      let activeImgIdx = 0;
      const updateActiveImage = (newIdx) => {
        if (newIdx < 0) newIdx = productGallery.length - 1;
        if (newIdx >= productGallery.length) newIdx = 0;
        activeImgIdx = newIdx;
        const targetImg = productGallery[activeImgIdx];
        if (spatialMain && targetImg) {
          spatialMain.src = imgSrc(targetImg);
        }
        $$('.spatial-dot', stage).forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeImgIdx);
        });
      };

      $('#spatial-nav-prev', stage)?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateActiveImage(activeImgIdx - 1);
      });

      $('#spatial-nav-next', stage)?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateActiveImage(activeImgIdx + 1);
      });

      $$('.spatial-dot', stage).forEach((dot) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const idx = parseInt(dot.dataset.dotIdx, 10);
          if (!isNaN(idx)) updateActiveImage(idx);
        });
      });
    }

    let currentQty = 1;
    const qtyVal = $('#spatial-qty-val', stage);
    const addBtn = $('#spatial-add-btn', stage);
    const pillPrice = $('#spatial-pill-price', stage);

    const updateQtyDisplay = () => {
      if (qtyVal) qtyVal.textContent = currentQty;
      if (pillPrice) pillPrice.textContent = fmt(p.price * currentQty);
    };

    $('#spatial-qty-dec', stage)?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentQty > 1) {
        currentQty--;
        updateQtyDisplay();
      }
    });

    $('#spatial-qty-inc', stage)?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentQty < (p.stock || 99)) {
        currentQty++;
        updateQtyDisplay();
      }
    });

    $('#spatial-stage-close', stage)?.addEventListener('click', closeSpatialCardZoom);

    addBtn?.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!inStock) return;
      const targetPid = addBtn.dataset.productId || p.id;
      if (targetPid) {
        addBtn.classList.add('is-loading');
        await addToCart(targetPid, currentQty, 'standart', addBtn);
        addBtn.classList.remove('is-loading');
        addBtn.classList.add('is-success');
        const ctaLabel = $('.pill-cta-label', addBtn);
        const originalLabel = ctaLabel ? ctaLabel.textContent : '';
        if (ctaLabel) ctaLabel.textContent = LANG === 'en' ? 'Added ✓' : 'Eklendi ✓';
        setTimeout(() => {
          addBtn.classList.remove('is-success');
          if (ctaLabel) ctaLabel.textContent = originalLabel;
        }, 1800);
      }
    });
  } catch (err) {
    if (reqId !== activeZoomRequestId) return;
    stage.innerHTML = `
      <button type="button" class="spatial-stage-close" id="spatial-stage-close">✕</button>
      <div class="empty-state" style="padding:60px 20px;">
        <p>${err.message || 'Ürün detayları yüklenemedi.'}</p>
      </div>`;
    $('#spatial-stage-close', stage)?.addEventListener('click', closeSpatialCardZoom);
  }
}

export function closeSpatialCardZoom() {
  activeZoomRequestId++;
  const overlay = $('#spatial-canvas-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }
  const stage = $('#spatial-card-stage');
  if (stage) {
    stage.innerHTML = '';
  }
  document.body.style.overflow = '';
  if (activeOriginCard) {
    activeOriginCard.style.opacity = '';
    activeOriginCard.style.transform = '';
    activeOriginCard.style.transition = '';
    activeOriginCard = null;
  }
}

export function initSpatialAnimations() {
  initTiltPhysics();

  $('#spatial-canvas-overlay')?.addEventListener('click', (e) => {
    if (e.target === $('#spatial-canvas-overlay')) closeSpatialCardZoom();
  });

  const stageEl = $('#spatial-card-stage');
  if (stageEl) {
    stageEl.addEventListener('click', (e) => e.stopPropagation());
    stageEl.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    stageEl.addEventListener('touchend', (e) => e.stopPropagation(), { passive: true });
  }

  // Global event delegation for cards and modal actions
  document.addEventListener('click', (e) => {
    // 1. Close modal immediately if clicking "Product Details" or any link inside spatial modal
    const modalLink = e.target.closest('#spatial-card-stage a');
    if (modalLink) {
      closeSpatialCardZoom();
      return;
    }

    // 2. Quick Add Button on cards
    const addBtn = e.target.closest('[data-add]');
    if (addBtn && !addBtn.closest('#spatial-card-stage')) {
      e.preventDefault();
      e.stopPropagation();
      const pid = addBtn.dataset.add;
      if (pid) {
        addToCart(pid, 1, 'standart', addBtn);
      }
      return;
    }

    // 3. Card click (media or title) — opens Spatial Morphing Stage Canvas
    const cardLink = e.target.closest('.prod-card .prod-media, .prod-card .prod-name');
    if (cardLink && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      if (!location.pathname.startsWith('/urun/')) {
        e.preventDefault();
        e.stopPropagation();
        const card = cardLink.closest('.prod-card');
        const rawHref = cardLink.getAttribute('href') || '';
        const hrefKey = rawHref.replace(/^\/urun\//, '').replace(/\/+$/, '').trim();
        const pid = card?.dataset?.slug || cardLink.dataset?.slug || card?.dataset?.id || hrefKey;
        if (pid) {
          openSpatialCardZoom(pid, card);
          return;
        }
      }
    }
  });

  // ESC key closes spatial modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSpatialCardZoom();
  });
}

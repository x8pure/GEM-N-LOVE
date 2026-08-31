import { api } from './api.js';
import { toast } from './ui.js';

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const LANG = window.__LS_LANG__ || 'tr';

export function getLocalCart() {
  try {
    const raw = localStorage.getItem('ls_cart_data');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setLocalCart(cart) {
  try {
    if (cart && Array.isArray(cart.items)) {
      localStorage.setItem('ls_cart_data', JSON.stringify(cart));
    } else {
      localStorage.removeItem('ls_cart_data');
    }
  } catch {}
}

export function updateCartBadge(count, isNewAdd = false) {
  const badges = $$('#cart-badge');
  if (!badges.length) return;
  const n = Math.max(0, parseInt(count, 10) || 0);
  badges.forEach((b) => {
    b.textContent = n;
    if (n > 0) {
      b.classList.remove('hidden');
      if (isNewAdd) {
        b.classList.add('bounce');
        setTimeout(() => b.classList.remove('bounce'), 450);
      }
    } else {
      b.classList.add('hidden');
    }
  });
}

export async function addToCart(productId, qty = 1, variant = 'standart', btn = null) {
  if (!productId) return;
  if (btn && btn.dataset.busy === '1') return;
  if (btn) btn.dataset.busy = '1';
  try {
    try {
      if (navigator && typeof navigator.vibrate === 'function') {
        navigator.vibrate([18, 30, 20]);
      }
    } catch {}
    const cleanQty = Math.max(1, parseInt(qty, 10) || 1);
    const local = getLocalCart();
    const currentItems = (local && Array.isArray(local.items)) ? local.items : [];
    const currentCoupon = local?.coupon?.code || (typeof local?.coupon === 'string' ? local.coupon : undefined);
    const res = await api('/api/cart/add', {
      method: 'POST',
      body: { productId, qty: cleanQty, variant, items: currentItems, coupon: currentCoupon }
    });
    
    if (btn) {
      const isIconOnly = btn.classList.contains('action-btn') || btn.classList.contains('quick-add-btn') || btn.offsetWidth <= 52;
      const origContent = btn.innerHTML;
      const origWidth = btn.offsetWidth ? `${btn.offsetWidth}px` : '';
      btn.classList.add('added');
      if (isIconOnly) {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btn-check-icon"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else {
        if (origWidth) btn.style.minWidth = origWidth;
        btn.innerHTML = `<span class="btn-added-content"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> <span>${LANG === 'en' ? 'Added' : 'Eklendi'}</span></span>`;
      }
      setTimeout(() => {
        btn.innerHTML = origContent;
        btn.classList.remove('added');
        if (!isIconOnly) btn.style.minWidth = '';
        delete btn.dataset.busy;
      }, 1350);
    }
    
    // Instant feedback toast on both mobile and desktop
    toast(window.LS?.t ? window.LS.t('added') : (LANG === 'en' ? 'Added to cart' : 'Sepete eklendi'), '🛍️');
    if (res && Array.isArray(res.items)) {
      setLocalCart(res);
      const n = res.items.reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
      updateCartBadge(n, true);
    }
  } catch (err) {
    if (btn) delete btn.dataset.busy;
    toast(err.message || 'Hata oluştu', '⚠️');
  }
}

export async function initCart() {
  const root = $('#cart-root');
  if (!root) return;

  async function render(skipSpinner = false) {
    if (!skipSpinner && !root.querySelector('.cart-items')) {
      root.innerHTML = '<div class="spinner"></div>';
    }

    const local = getLocalCart();
    let c = null;
    if (local && Array.isArray(local.items) && local.items.length > 0) {
      c = await api('/api/cart/calc', {
        method: 'POST',
        body: { items: local.items, coupon: local.coupon?.code || (typeof local.coupon === 'string' ? local.coupon : undefined) }
      }).catch(() => local);
    }

    if (!c || !c.items || !c.items.length) {
      setLocalCart(null);
      updateCartBadge(0);
      root.innerHTML = `
        <div class="empty-state" style="padding: 60px 20px; text-align: center; max-width: 480px; margin: 0 auto;">
          <div style="font-size: 54px; margin-bottom: 16px; opacity: 0.9;">🛒</div>
          <p style="font-size: 16px; color: var(--muted); margin-bottom: 24px; line-height: 1.6;">${window.LS?.t ? window.LS.t('cart.empty') : 'Sepetin şimdilik boş.<br>Keşfetmeye hazır mısın?'}</p>
          <a class="btn btn-primary" href="/magaza" style="padding: 13px 28px; border-radius: 12px; font-weight: 650;">${window.LS?.t ? window.LS.t('cart.empty.btn') : 'Mağazayı Keşfet'}</a>
        </div>`;
      return;
    }

    setLocalCart(c);
    const totalQty = c.items.reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
    updateCartBadge(totalQty);

    const threshold = c.freeShippingThreshold || 750;
    const isFreeShip = c.subtotal >= threshold;
    const remainingForFree = Math.max(0, threshold - c.subtotal);
    const pct = Math.min(100, Math.round((c.subtotal / threshold) * 100));

    const lines = c.items.map((i) => {
      const catLabel = window.LS?.catName ? window.LS.catName(i.category, i.categoryName) : (i.categoryName || i.category || '');
      const itemPrice = typeof i.price === 'number' ? i.price : parseFloat(i.price) || 0;
      const lineTotal = itemPrice * i.qty;
      const imgSrc = i.image ? (String(i.image).includes('?') ? i.image : `${i.image}?v=transparent2`) : '/uploads/placeholder.webp';

      return `
        <article class="cart-line" data-pid="${i.productId}">
          <a href="/urun/${i.slug}" class="cart-line-thumb" title="${i.name}">
            <img src="${imgSrc}" alt="${i.name}" loading="lazy">
          </a>
          <div class="cart-line-info">
            <div class="cl-cat">${catLabel}</div>
            <a class="cl-name" href="/urun/${i.slug}">${i.name}</a>
            <div class="cl-unit-price">${window.LS?.fmt ? window.LS.fmt(itemPrice) : itemPrice + ' TL'} <span class="cl-per">${window.LS?.t ? window.LS.t('cart.per') : '/ adet'}</span></div>
          </div>
          <div class="cart-line-controls">
            <div class="cart-qty-pill">
              <button class="cart-qty-btn" data-dec="${i.productId}" type="button" aria-label="Adet Azalt" title="Adet Azalt">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <span class="cart-qty-number" data-qty-display="${i.productId}">${i.qty}</span>
              <button class="cart-qty-btn" data-inc="${i.productId}" type="button" aria-label="Adet Artır" title="Adet Artır">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div class="cart-line-subtotal">
              <span class="cl-price-val">${window.LS?.fmt ? window.LS.fmt(lineTotal) : lineTotal + ' TL'}</span>
            </div>
            <button class="cart-line-remove" data-del="${i.productId}" type="button" title="${window.LS?.t ? window.LS.t('cart.remove') : 'Kaldır'}" aria-label="${window.LS?.t ? window.LS.t('cart.remove') : 'Kaldır'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </article>`;
    }).join('');

    const freeShipHtml = isFreeShip ? `
      <div class="cart-freeship-card won">
        <div class="cart-freeship-top">
          <span class="freeship-icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
          <span class="freeship-text">${window.LS?.t ? window.LS.t('cart.freeship.won') : 'Ücretsiz kargo hakkı kazandın!'}</span>
        </div>
        <div class="cart-freeship-bar">
          <div class="cart-freeship-fill" style="width: 100%;"></div>
        </div>
      </div>
    ` : `
      <div class="cart-freeship-card">
        <div class="cart-freeship-top">
          <span class="freeship-icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span>
          <span class="freeship-text">${window.LS?.t ? window.LS.t('cart.freeship.left', { x: '<b>' + (window.LS?.fmt ? window.LS.fmt(remainingForFree) : remainingForFree + ' TL') + '</b>' }) : `Ücretsiz kargoya <b>${remainingForFree} TL</b> kaldı!`}</span>
        </div>
        <div class="cart-freeship-bar">
          <div class="cart-freeship-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;

    const couponCode = c.coupon?.code || (typeof c.coupon === 'string' ? c.coupon : '');

    root.innerHTML = `
      <div class="cart-main-col">
        ${freeShipHtml}
        <div class="cart-items-wrapper">
          <div class="cart-items">${lines}</div>
        </div>
        <div class="cart-bottom-actions">
          <a href="/magaza" class="cart-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span>${window.LS?.t ? window.LS.t('cart.continue') : 'Alışverişe Devam Et'}</span>
          </a>
          <button class="cart-clear-btn" id="cart-clear-all" type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            <span>${LANG === 'en' ? 'Clear Cart' : 'Sepeti Boşalt'}</span>
          </button>
        </div>
      </div>

      <aside class="cart-summary-col">
        <div class="summary">
          <div class="summary-header">
            <h3>${window.LS?.t ? window.LS.t('cart.summary') : 'Sipariş Özeti'}</h3>
            <span class="summary-badge">${totalQty} ${LANG === 'en' ? 'items' : 'ürün'}</span>
          </div>

          <div class="cart-coupon-box">
            <div class="coupon-input-group">
              <input id="coupon-input" class="coupon-field" placeholder="${window.LS?.t ? window.LS.t('cart.coupon.ph') : 'Kupon kodu'}" value="${couponCode}" autocomplete="off" autocorrect="off" autocapitalize="characters">
              <button class="coupon-btn" id="coupon-apply" type="button">${window.LS?.t ? window.LS.t('cart.apply') : 'Uygula'}</button>
            </div>
            ${c.coupon ? `
              <div class="coupon-active-chip">
                <span>🎟️ ${window.LS?.t ? window.LS.t('cart.coupon.is', { code: couponCode }) : `Kupon: ${couponCode}`} (-${window.LS?.fmt ? window.LS.fmt(c.discount || 0) : c.discount + ' TL'})</span>
                <button type="button" class="coupon-remove-btn" id="coupon-remove" title="Kuponu Kaldır">✕</button>
              </div>
            ` : ''}
          </div>

          <div class="summary-breakdown">
            <div class="sum-row">
              <span class="sum-label">${window.LS?.t ? window.LS.t('cart.subtotal') : 'Ara toplam'}</span>
              <span class="sum-value">${window.LS?.fmt ? window.LS.fmt(c.subtotal) : c.subtotal + ' TL'}</span>
            </div>
            <div class="sum-row">
              <span class="sum-label">${window.LS?.t ? window.LS.t('cart.shipping') : 'Kargo'}</span>
              <span class="sum-value ${c.shipping === 0 ? 'free' : ''}">${c.shipping === 0 ? (window.LS?.t ? window.LS.t('cart.free') : 'Ücretsiz') : (window.LS?.fmt ? window.LS.fmt(c.shipping) : c.shipping + ' TL')}</span>
            </div>
            ${c.discount ? `
              <div class="sum-row discount">
                <span class="sum-label">${window.LS?.t ? window.LS.t('cart.discount') : 'İndirim'}</span>
                <span class="sum-value">-${window.LS?.fmt ? window.LS.fmt(c.discount) : c.discount + ' TL'}</span>
              </div>
            ` : ''}
            <div class="sum-row total">
              <span class="sum-label">${window.LS?.t ? window.LS.t('cart.total') : 'Toplam'}</span>
              <span class="sum-value">${window.LS?.fmt ? window.LS.fmt(c.total) : c.total + ' TL'}</span>
            </div>
          </div>

          <a href="/odeme" class="checkout-cta-btn">
            <span>${window.LS?.t ? window.LS.t('cart.checkout') : 'Ödemeye Geç →'}</span>
          </a>

          <div class="cart-trust-panel">
            <div class="trust-item">
              <div class="trust-icon">📦</div>
              <div class="trust-content">
                <strong>%100 Gizli Paketleme</strong>
                <span>Dış pakette mağaza veya ürün bilgisi yer almaz</span>
              </div>
            </div>
            <div class="trust-item">
              <div class="trust-icon">🔒</div>
              <div class="trust-content">
                <strong>Güvenli İletişim</strong>
                <span>WhatsApp veya mağazada gizli ödeme</span>
              </div>
            </div>
            <div class="trust-item">
              <div class="trust-icon">⚡</div>
              <div class="trust-content">
                <strong>Hızlı Sevkiyat</strong>
                <span>24 saat içinde gizli ve özenli kargolama</span>
              </div>
            </div>
          </div>
        </div>
      </aside>`;

    // Attach Event Handlers
    // 1. Plus (Increment) button
    $$('[data-inc]', root).forEach((b) => b.addEventListener('click', async (e) => {
      e.preventDefault();
      if (b.disabled || b.dataset.busy === '1') return;
      b.disabled = true;
      b.dataset.busy = '1';
      try {
        const pid = b.dataset.inc;
        const line = c.items.find(x => x.productId === pid || x.id === pid);
        const currentQty = line ? parseInt(line.qty, 10) : (parseInt(root.querySelector(`[data-qty-display="${pid}"]`)?.textContent, 10) || 1);
        const targetQty = currentQty + 1;

        const l = getLocalCart() || { items: [] };
        const currentCoupon = l.coupon?.code || (typeof l.coupon === 'string' ? l.coupon : undefined);
        const res = await api('/api/cart/update', {
          method: 'POST',
          body: {
            productId: pid,
            qty: targetQty,
            items: l.items,
            coupon: currentCoupon
          }
        });
        if (res) {
          setLocalCart(res);
          const n = (res.items || []).reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
          updateCartBadge(n);
        }
        await render(true);
      } catch (err) {
        b.disabled = false;
        delete b.dataset.busy;
        toast(err.message || 'Hata oluştu', '⚠️');
      }
    }));

    // 2. Minus (Decrement) button
    $$('[data-dec]', root).forEach((b) => b.addEventListener('click', async (e) => {
      e.preventDefault();
      if (b.disabled || b.dataset.busy === '1') return;
      b.disabled = true;
      b.dataset.busy = '1';
      try {
        const pid = b.dataset.dec;
        const line = c.items.find(x => x.productId === pid || x.id === pid);
        const currentQty = line ? parseInt(line.qty, 10) : (parseInt(root.querySelector(`[data-qty-display="${pid}"]`)?.textContent, 10) || 1);
        const targetQty = currentQty - 1;

        const l = getLocalCart() || { items: [] };
        const currentCoupon = l.coupon?.code || (typeof l.coupon === 'string' ? l.coupon : undefined);
        let res;
        if (targetQty < 1) {
          res = await api('/api/cart/remove', {
            method: 'POST',
            body: { productId: pid, items: l.items, coupon: currentCoupon }
          });
        } else {
          res = await api('/api/cart/update', {
            method: 'POST',
            body: { productId: pid, qty: targetQty, items: l.items, coupon: currentCoupon }
          });
        }
        if (res) {
          setLocalCart(res);
          const n = (res.items || []).reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
          updateCartBadge(n);
        }
        await render(true);
      } catch (err) {
        b.disabled = false;
        delete b.dataset.busy;
        toast(err.message || 'Hata oluştu', '⚠️');
      }
    }));

    // 3. Delete button
    $$('[data-del]', root).forEach((b) => b.addEventListener('click', async (e) => {
      e.preventDefault();
      if (b.disabled || b.dataset.busy === '1') return;
      b.disabled = true;
      b.dataset.busy = '1';
      try {
        const pid = b.dataset.del;
        const l = getLocalCart() || { items: [] };
        const currentCoupon = l.coupon?.code || (typeof l.coupon === 'string' ? l.coupon : undefined);
        const res = await api('/api/cart/remove', {
          method: 'POST',
          body: { productId: pid, items: l.items, coupon: currentCoupon }
        });
        if (res) {
          setLocalCart(res);
          const n = (res.items || []).reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
          updateCartBadge(n);
        }
        await render(true);
      } catch (err) {
        b.disabled = false;
        delete b.dataset.busy;
        toast(err.message || 'Hata oluştu', '⚠️');
      }
    }));

    // 4. Clear all cart
    const clearBtn = $('#cart-clear-all', root);
    if (clearBtn) {
      clearBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          clearBtn.disabled = true;
          setLocalCart(null);
          try { localStorage.removeItem('ls_cart_data'); } catch {}
          updateCartBadge(0);
          toast(window.LS?.t ? window.LS.t('cart.cleared') : (LANG === 'en' ? 'Cart cleared' : 'Sepetiniz boşaltıldı'), '🗑️');
          await render(false);
        } catch (err) {
          console.error(err);
        } finally {
          if (clearBtn) clearBtn.disabled = false;
        }
      });
    }

    // 5. Apply Coupon
    const ca = $('#coupon-apply', root);
    const cInput = $('#coupon-input', root);
    if (ca && cInput) {
      const applyHandler = async () => {
        const code = (cInput.value || '').trim().toUpperCase();
        if (!code) {
          toast(LANG === 'en' ? 'Please enter a coupon code' : 'Lütfen kupon kodu girin', 'ℹ️');
          return;
        }
        try {
          const l = getLocalCart() || { items: [] };
          const res = await api('/api/cart/coupon', {
            method: 'POST',
            body: { code, items: l.items }
          });
          toast(window.LS?.t ? window.LS.t('cart.coupon.ok') : 'Kupon uygulandı 🎟️', '🎟️');
          if (res) {
            setLocalCart(res);
            const n = (res.items || []).reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
            updateCartBadge(n);
          }
          await render(true);
        } catch (e) {
          toast(e.message || 'Kupon uygulanamadı', '⚠️');
        }
      };

      ca.addEventListener('click', applyHandler);
      cInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyHandler();
        }
      });
    }

    // 6. Remove Coupon
    const cr = $('#coupon-remove', root);
    if (cr) {
      cr.addEventListener('click', async () => {
        try {
          const l = getLocalCart() || { items: [] };
          delete l.coupon;
          const res = await api('/api/cart/calc', {
            method: 'POST',
            body: { items: l.items, coupon: '' }
          });
          toast(LANG === 'en' ? 'Coupon removed' : 'Kupon kaldırıldı', 'ℹ️');
          if (res) {
            setLocalCart(res);
          }
          await render(true);
        } catch (e) {
          toast(e.message || 'Hata oluştu', '⚠️');
        }
      });
    }
  }

  await render(false);
}

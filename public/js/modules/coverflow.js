import { api } from './api.js';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const imgSrc = (s) => { if (!s) return ''; const str = String(s); if (str.startsWith('data:') || str.startsWith('http://') || str.startsWith('https://') || str.includes('?')) return str; return str + '?v=transparent2'; };
const LANG = window.__LS_LANG__ || 'tr';
const fmt = (n) => new Intl.NumberFormat(LANG === 'en' ? 'en-US' : 'tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
const t = (...args) => window.LS.t(...args);

export /* ================= DEPTHDECK COVERFLOW — Perspective Fan & Kinetic Inertia Stage (2026) ================= */
  async function initCoverflow(stage) {
    let prods = [];
    try { prods = (await api('/api/products?wheel=1&limit=8')).products; } catch {}
    if (!prods.length) return;

    stage.innerHTML = `
      <div class="cf-ambient" id="cf-amb"></div>
      <div class="cf-scene" id="cf-scene">
        ${prods.map((p, i) => `
        <div class="cf-pos" data-i="${i}">
          <a class="cf-card" href="/urun/${p.slug}" data-slug="${p.slug}" aria-label="${p.name}">
            <img src="${imgSrc(p.image)}" alt="${p.name}" draggable="false">
            <div class="card-sheen"></div>
            <span class="cf-cap">
              <b>${p.name}</b>
              <em>${fmt(p.price)}${p.oldPrice ? ' <s style="color:#78716C;font-size:10px;font-weight:500">' + fmt(p.oldPrice) + '</s>' : ''}</em>
            </span>
          </a>
        </div>`).join('')}
      </div>
      <button class="cf-arrow cf-prev" id="cf-prev" aria-label="${t('cf.prev')}">←</button>
      <button class="cf-arrow cf-next" id="cf-next" aria-label="${t('cf.next')}">→</button>
      <div class="cf-bar">
        <span class="cf-counter"><b id="cf-idx">01</b><em>/</em><span id="cf-total">${String(prods.length).padStart(2, '0')}</span></span>
        <span class="cf-progress"><i id="cf-fill"></i></span>
        <span class="cf-hint">${t('cf.hint')}</span>
      </div>`;

    const scene = $('#cf-scene', stage);
    const positions = $$('.cf-pos', scene);
    const cards = $$('.cf-card', stage);
    const amb = $('#cf-amb', stage);
    const fill = $('#cf-fill', stage);
    const idxEl = $('#cf-idx', stage);
    const N = prods.length;
    const STEP = (Math.PI * 2) / N;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTO_PER_MS = reduced ? 0 : 1 / 4500;

    let center = 0;
    let target = 0;
    let velocity = 0;
    let auto = !reduced;
    let down = false, moved = 0, lastX = 0, lastTime = 0;
    let focusIdx = -1;
    let resumeTimer = null;
    let gyroX = 0;
    const colorCache = {};

    prods.forEach((p) => { const im = new Image(); im.src = p.image; });

    function wrapD(i) {
      let d = i - center;
      d -= Math.round(d / N) * N;
      return d;
    }

    function tint(p) {
      const key = p.image;
      const apply = () => {
        const t = colorCache[key];
        if (t) amb.style.background = `radial-gradient(circle, ${t}, rgba(255,228,225,0) 70%)`;
      };
      if (colorCache[key]) { apply(); return; }
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = c.height = 20;
          const cx = c.getContext('2d');
          cx.drawImage(im, 0, 0, 20, 20);
          const d = cx.getImageData(0, 0, 20, 20).data;
          let r = 0, g = 0, b = 0, n = 0;
          for (let i = 0; i < d.length; i += 40) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
          r = Math.round(175 + (r / n - 128) * 0.6);
          g = Math.round(175 + (g / n - 128) * 0.6);
          b = Math.round(175 + (b / n - 128) * 0.6);
          colorCache[key] = `rgba(${r},${g},${b},.55)`;
          if (focusIdx >= 0 && prods[focusIdx] === p) apply();
        } catch {}
      };
      im.src = key;
    }

    if (window.DeviceOrientationEvent && !reduced) {
      const handleOrientation = (e) => {
        if (e.gamma !== null && e.gamma !== undefined) {
          gyroX = Math.max(-20, Math.min(20, e.gamma)) * 0.12;
        }
      };
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    const smoothF = new Array(N).fill(0);
    let lastLay = performance.now();

    function layout(t) {
      const nowT = t || performance.now();
      const layDt = Math.min(64, Math.max(0, nowT - lastLay)); lastLay = nowT;
      const fk = 1 - Math.exp(-9 * (layDt / 1000));
      const breath = reduced ? 0 : (Math.sin(nowT / 1000 * 1.25) * 0.5 + 0.5);
      const W = scene.clientWidth || 480;
      const isMobile = W < 500;
      const rx = W * (isMobile ? 0.32 : 0.36);
      const rz = rx * (isMobile ? 1.05 : 1.12);
      let best = -1, bestD = Infinity;

      positions.forEach((pos, i) => {
        let d = i - center;
        d = d - Math.round(d / N) * N;
        const theta = d * STEP;
        const depth = (Math.cos(theta) + 1) / 2;
        const fTarget = Math.max(0, 1 - Math.abs(d) / 0.5);
        smoothF[i] += (fTarget - smoothF[i]) * fk;
        const f = smoothF[i];
        const x = Math.sin(theta) * rx + (f > 0.8 ? gyroX : 0);
        const z = (Math.cos(theta) - 1) * rz;
        const y = -(1 - depth) * (isMobile ? 16 : 22) - f * 6 * breath;
        const rotY = -Math.sin(theta) * (isMobile ? 42 : 48);
        const scale = (0.70 + depth * 0.30) * (1 + f * 0.024 * breath);

        pos.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        pos.style.zIndex = Math.round(depth * 100);
        pos.style.opacity = (0.50 + depth * 0.50).toFixed(2);
        pos.style.filter = depth < 0.6 ? `blur(${(0.6 - depth) * 4}px)` : 'none';
        pos.style.setProperty('--f', f.toFixed(3));

        if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
      });

      if (best !== focusIdx) {
        focusIdx = best;
        idxEl.textContent = String((best + 1)).padStart(2, '0');
        tint(prods[best]);
      }
    }

    function barTick() {
      const frac = ((center - Math.floor(center)) + 1) % 1;
      fill.style.width = (Math.min(frac, 1 - frac) * 2 * 100).toFixed(1) + '%';
    }

    function pauseThenResume(sec) {
      auto = false;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { auto = !reduced; }, sec * 1000);
    }

    function go(dir) {
      target = Math.round(center) + dir;
      velocity = 0;
      pauseThenResume(4.5);
    }

    let lastLoopTime = performance.now();
    (function loop(t) {
      const dt = Math.min(64, Math.max(0, t - lastLoopTime)); lastLoopTime = t;
      if (!down) {
        if (auto) {
          center += AUTO_PER_MS * dt;
          target = center;
        } else {
          if (Math.abs(velocity) > 0.0001) {
            center += velocity;
            velocity *= 0.92;
            target = Math.round(center);
          } else {
            velocity = 0;
            if (Math.abs(target - center) > 0.0002) {
              const k = 1 - Math.exp(-8 * (dt / 1000));
              center += (target - center) * k;
            } else {
              center = target;
            }
          }
        }
      }
      layout(t);
      barTick();
      requestAnimationFrame(loop);
    })(lastLoopTime);

    const startDrag = (e) => {
      down = true;
      moved = 0;
      velocity = 0;
      lastX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
      lastTime = performance.now();
      scene.classList.add('drag');
    };

    const moveDrag = (e) => {
      if (!down) return;
      const currentX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
      const now = performance.now();
      const dx = currentX - lastX;
      lastX = currentX;
      lastTime = now;
      moved += Math.abs(dx);

      const sensitivity = Math.max(140, scene.clientWidth * 0.32);
      const deltaCenter = -dx / sensitivity;
      center += deltaCenter;
      target = center;
      velocity = deltaCenter;
    };

    const endDrag = () => {
      if (!down) return;
      down = false;
      scene.classList.remove('drag');
      if (Math.abs(velocity) > 0.002) {
        velocity = Math.sign(velocity) * Math.min(Math.abs(velocity) * 1.2, 0.15);
      } else {
        velocity = 0;
        target = Math.round(center);
      }
      pauseThenResume(3.5);
    };

    scene.addEventListener('pointerdown', startDrag);
    window.addEventListener('pointermove', moveDrag);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    scene.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) startDrag(e);
    }, { passive: true });

    scene.addEventListener('touchmove', (e) => {
      if (down && e.touches && e.touches.length === 1) moveDrag(e);
    }, { passive: true });

    scene.addEventListener('touchend', endDrag);
    scene.addEventListener('touchcancel', endDrag);

    cards.forEach((card, i) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--sheen-x', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--sheen-y', `${(y * 100).toFixed(1)}%`);
      });

      card.addEventListener('click', (e) => {
        if (moved > 8) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        const d = wrapD(i);
        if (Math.abs(d) > 0.4) {
          e.preventDefault();
          target = center + d;
          velocity = 0;
          pauseThenResume(4.5);
        } else {
          e.preventDefault();
          const slug = card.getAttribute('data-slug') || (prods[i] && prods[i].slug);
          if (slug && typeof openSpatialCardZoom === 'function') {
            openSpatialCardZoom(slug, card);
          }
        }
      });
    });

    $('#cf-next', stage)?.addEventListener('click', () => go(1));
    $('#cf-prev', stage)?.addEventListener('click', () => go(-1));

    stage.setAttribute('tabindex', '0');
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    layout(performance.now());
  }


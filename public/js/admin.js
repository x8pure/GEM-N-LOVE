'use strict';
(() => {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: n % 1 ? 2 : 0 }).format(Number(n) || 0);
  const dShort = (iso) => new Date(iso).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  /* ================= THEME & PRIVACY ENGINE ================= */
  let currentTheme = localStorage.getItem('adm_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  function setTheme(t) {
    currentTheme = t;
    localStorage.setItem('adm_theme', t);
    document.documentElement.setAttribute('data-theme', t);
    const btn = $('#theme-toggle');
    if (btn) btn.innerHTML = t === 'dark' ? '🌙' : '☀️';
    toast(`Tema değiştirildi: ${t === 'dark' ? 'Koyu Lüks' : 'Açık'}`);
  }

  let privacyMode = localStorage.getItem('adm_privacy') === '1';
  function setPrivacy(val) {
    privacyMode = val;
    localStorage.setItem('adm_privacy', val ? '1' : '0');
    const btn = $('#privacy-toggle');
    if (btn) {
      btn.classList.toggle('active', val);
      btn.innerHTML = val ? '🔒 Gizlilik Açık' : '👁️ Gizlilik Modu';
    }
    document.body.classList.toggle('privacy-active', val);
    const hash = (location.hash || '#/dashboard').split('/')[1] || 'dashboard';
    if (VIEWS[hash]) VIEWS[hash]();
  }

  async function api(path, opts = {}) {
    const token = localStorage.getItem('ls_auth_token') || localStorage.getItem('ls_admin_token');
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
      headers['x-ls-token'] = token;
    }
    const res = await fetch(path, {
      credentials: 'same-origin',
      ...opts,
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    let data; try { data = await res.json(); } catch { data = { ok: false }; }
    if (!res.ok) throw Object.assign(new Error(data.error || 'Hata'), { status: res.status });
    return data;
  }

  function toast(msg, err) {
    let zone = $('#toast-zone'); if (!zone) { document.body.insertAdjacentHTML('beforeend', '<div id="toast-zone"></div>'); zone = $('#toast-zone'); }
    const el = document.createElement('div');
    el.className = 'toast' + (err ? ' err' : '');
    el.innerHTML = `<span>${err ? '⚠️' : '✅'}</span><span>${esc(msg)}</span>`;
    zone.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 280); }, 2600);
  }

  function confirmDialog(msg, onConfirm) {
    const m = document.createElement('div');
    m.className = 'modal-back open';
    m.style.zIndex = '99999';
    m.innerHTML = `<div class="modal" style="max-width:400px;text-align:center;padding:24px">
      <div style="font-size:36px;margin-bottom:12px">⚠️</div>
      <h3 style="font-size:18px;font-weight:700;margin-bottom:8px">Silme Onayı</h3>
      <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;line-height:1.5">${esc(msg)}</p>
      <div style="display:flex;gap:12px;justify-content:center">
        <button type="button" class="btn btn-ghost" id="cd-cancel" style="flex:1">Vazgeç</button>
        <button type="button" class="btn" id="cd-yes" style="flex:1;background:#dc2626;color:#fff;border-color:#dc2626">Evet, Sil</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    const close = () => { m.classList.remove('open'); setTimeout(() => m.remove(), 200); };
    $('#cd-cancel', m).onclick = close;
    $('#cd-yes', m).onclick = async () => {
      close();
      await onConfirm();
    };
  }

  function optimizeImage(file, maxDim = 1200, quality = 0.82) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('Dosya seçilmedi'));
      if (file.type === 'image/svg+xml') {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(file);
        return;
      }
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let w = img.width || 800;
        let h = img.height || 800;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.onerror = reject;
          r.readAsDataURL(file);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        
        // Try WebP first for optimal compression with transparency support
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // If still larger than 450KB base64, scale down to 900px
        if (dataUrl.length > 450000 && (w > 800 || h > 800)) {
          const c2 = document.createElement('canvas');
          c2.width = Math.round(w * 0.75);
          c2.height = Math.round(h * 0.75);
          const ctx2 = c2.getContext('2d');
          if (ctx2) {
            ctx2.drawImage(canvas, 0, 0, c2.width, c2.height);
            dataUrl = c2.toDataURL('image/webp', 0.78);
            if (!dataUrl.startsWith('data:image/webp')) {
              dataUrl = c2.toDataURL('image/jpeg', 0.78);
            }
          }
        }

        resolve(dataUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(file);
      };
      img.src = objectUrl;
    });
  }

  function exportCSV(filename, rows) {
    const processRow = (row) => row.map((val) => {
      let v = val === null || val === undefined ? '' : String(val);
      v = v.replace(/"/g, '""');
      if (v.search(/("|,|\n)/g) >= 0) v = `"${v}"`;
      return v;
    }).join(',');
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(processRow).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast('CSV dosyası indirildi 📊');
  }

  const STATUS = { processing: 'Hazırlanıyor', shipped: 'Kargoda', delivered: 'Teslim Edildi', cancelled: 'İptal' };

  const shell = (active, content, badge) => `
  <div class="admin-shell">
    <aside class="sidebar">
      <div class="adm-brand">
        <div class="logo-text">
          <span>LOVE<span class="dot">.</span></span>
          <small>2026 ADMIN OS</small>
        </div>
      </div>
      <div class="nav-section-title">Yönetim</div>
      <nav class="adm-nav">
        <a href="#/dashboard" class="${active === 'dashboard' ? 'on' : ''}"><span class="ic">📊</span>Panel</a>
        <a href="#/orders" class="${active === 'orders' ? 'on' : ''}"><span class="ic">📦</span>Siparişler${badge.orders ? `<span class="pill">${badge.orders}</span>` : ''}</a>
        <a href="#/products" class="${active === 'products' ? 'on' : ''}"><span class="ic">🛍️</span>Ürünler</a>
        <a href="#/categories" class="${active === 'categories' ? 'on' : ''}"><span class="ic">🗂️</span>Kategoriler</a>
        <a href="#/reviews" class="${active === 'reviews' ? 'on' : ''}"><span class="ic">⭐</span>Yorumlar${badge.reviews ? `<span class="pill">${badge.reviews}</span>` : ''}</a>
      </nav>
      <div class="nav-section-title">Pazarlama & Kullanıcı</div>
      <nav class="adm-nav">
        <a href="#/coupons" class="${active === 'coupons' ? 'on' : ''}"><span class="ic">🎟️</span>Kuponlar</a>
        <a href="#/users" class="${active === 'users' ? 'on' : ''}"><span class="ic">👥</span>Kullanıcılar</a>
        <a href="#/messages" class="${active === 'messages' ? 'on' : ''}"><span class="ic">💌</span>Mesajlar</a>
        <a href="#/settings" class="${active === 'settings' ? 'on' : ''}"><span class="ic">⚙️</span>Ayarlar</a>
      </nav>
      <div class="sidebar-foot">
        <a href="/" class="mini" target="_blank">🏬 Mağazayı Önizle</a>
        <a href="#" class="mini" id="adm-logout">🚪 Güvenli Çıkış</a>
      </div>
    </aside>
    <main class="admin-main">
      <div class="admin-topbar">
        <div class="topbar-left">
          <h1 id="page-title"></h1>
          <span class="pulse-badge">Canlı Sistem</span>
        </div>
        <div class="topbar-right">
          <button class="cmd-trigger" id="cmd-btn" title="Hızlı Komut Paleti (Ctrl+K / Cmd+K)">🔍 <span>Ara / Komutlar</span> <kbd>⌘K</kbd></button>
          <button class="privacy-toggle-btn ${privacyMode ? 'active' : ''}" id="privacy-toggle" title="Müşteri verilerini gizle/göster">${privacyMode ? '🔒 Gizlilik Açık' : '👁️ Gizlilik'}</button>
          <button class="theme-toggle-btn" id="theme-toggle" title="Koyu / Açık Tema">${currentTheme === 'dark' ? '🌙' : '☀️'}</button>
          <a class="view-store" href="/" target="_blank">↗ Mağaza</a>
          <div class="adm-avatar" id="adm-avatar" title="${window.__me ? window.__me.name : 'Admin'}">A</div>
        </div>
      </div>
      <div class="admin-content" id="adm-content">${content}</div>
    </main>
  </div>`;

  const TITLES = { dashboard: 'Genel Bakış & Analitik', orders: 'Sipariş Yönetimi', products: 'Ürün Kataloğu', categories: 'Kategori Mimarisi', reviews: 'Müşteri Değerlendirmeleri', coupons: 'Kupon & Kampanya Motoru', users: 'Kullanıcı & Müşteri Veritabanı', messages: 'Gelen Kutusu & İletişim', settings: 'Sistem & Mağaza Ayarları' };

  let currentPage = null;

  function mount(page, content) {
    if (currentPage === page && $('#adm-content')) {
      $('#adm-content').innerHTML = content;
      return;
    }
    currentPage = page;
    const root = $('#admin-root');
    root.innerHTML = shell(page, content, window.__badges || {});
    $('#page-title').textContent = TITLES[page] || '';
    const av = $('#adm-avatar');
    if (av && window.__me) av.textContent = window.__me.name.trim().charAt(0).toUpperCase();
    
    $('#theme-toggle').addEventListener('click', () => setTheme(currentTheme === 'dark' ? 'light' : 'dark'));
    $('#privacy-toggle').addEventListener('click', () => setPrivacy(!privacyMode));
    $('#cmd-btn').addEventListener('click', openCommandPalette);

    const lo = $('#adm-logout');
    if (lo) lo.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await api('/api/auth/logout', { method: 'POST' });
      } catch (e) {}
      try {
        localStorage.removeItem('ls_auth_token');
        localStorage.removeItem('ls_admin_token');
        localStorage.removeItem('ls_token');
        localStorage.removeItem('ls_user');
        localStorage.removeItem('ls_sid');
        sessionStorage.clear();
        document.cookie = 'ls_sid=; Path=/; SameSite=Lax; Max-Age=0';
        document.cookie = 'ls_token=; Path=/; SameSite=Lax; Max-Age=0';
        document.cookie = 'ls_auth_token=; Path=/; SameSite=Lax; Max-Age=0';
      } catch (e) {}
      toast('Başarıyla çıkış yapıldı');
      setTimeout(() => {
        window.location.replace('/giris');
      }, 150);
    });
  }

  /* ================= COMMAND PALETTE (Cmd+K) ================= */
  function openCommandPalette() {
    const m = document.createElement('div');
    m.className = 'modal-back open';
    m.innerHTML = `
    <div class="cmd-modal">
      <div class="cmd-input-wrap">
        <span style="font-size:18px">⚡</span>
        <input id="cmd-input" placeholder="Bir sayfa, ürün, sipariş veya işlem ara… (örn: Ürün, Sipariş, Koyu tema)" autofocus>
        <span class="cmd-badge">ESC</span>
      </div>
      <div class="cmd-list" id="cmd-list"></div>
    </div>`;
    document.body.appendChild(m);
    const input = $('#cmd-input', m);
    const listEl = $('#cmd-list', m);

    const COMMANDS = [
            { name: '📊 Genel Bakış Paneli', action: () => { location.hash = '#/dashboard'; m.remove(); }, badge: 'Sayfa' },
      { name: '📦 Sipariş Yönetimi', action: () => { location.hash = '#/orders'; m.remove(); }, badge: 'Sayfa' },
      { name: '🛍️ Ürün Kataloğu', action: () => { location.hash = '#/products'; m.remove(); }, badge: 'Sayfa' },
      { name: '＋ Yeni Ürün Ekle (Manuel)', action: () => { location.hash = '#/products'; m.remove(); setTimeout(() => $('#prod-add') && $('#prod-add').click(), 100); }, badge: 'Eylem' },
      { name: '🗂️ Kategori Mimarisi', action: () => { location.hash = '#/categories'; m.remove(); }, badge: 'Sayfa' },
      { name: '⭐ Yorum Onayları', action: () => { location.hash = '#/reviews'; m.remove(); }, badge: 'Sayfa' },
      { name: '🎟️ Kuponlar & İndirimler', action: () => { location.hash = '#/coupons'; m.remove(); }, badge: 'Sayfa' },
      { name: '👥 Müşteri & Kullanıcılar', action: () => { location.hash = '#/users'; m.remove(); }, badge: 'Sayfa' },
      { name: '💌 Gelen Kutusu Mesajları', action: () => { location.hash = '#/messages'; m.remove(); }, badge: 'Sayfa' },
      { name: '⚙️ Mağaza Ayarları', action: () => { location.hash = '#/settings'; m.remove(); }, badge: 'Sayfa' },
      { name: '🌙 Koyu / Açık Tema Değiştir', action: () => { setTheme(currentTheme === 'dark' ? 'light' : 'dark'); m.remove(); }, badge: 'Görünüm' },
      { name: '🔒 Müşteri Gizlilik Modu (Maske)', action: () => { setPrivacy(!privacyMode); m.remove(); }, badge: 'Güvenlik' },
      { name: '🏬 Canlı Mağazayı Aç', action: () => { window.open('/', '_blank'); m.remove(); }, badge: 'Dış Bağlantı' },
    ];

    function draw(q = '') {
      const kw = q.trim().toLowerCase();
      const filtered = COMMANDS.filter((c) => !kw || c.name.toLowerCase().includes(kw) || c.badge.toLowerCase().includes(kw));
      listEl.innerHTML = filtered.length ? filtered.map((c, i) => `
        <div class="cmd-item ${i === 0 ? 'selected' : ''}" data-idx="${i}">
          <span>${c.name}</span>
          <span class="cmd-badge">${c.badge}</span>
        </div>
      `).join('') : '<div class="empty" style="padding:20px">Sonuç bulunamadı</div>';

      $$('.cmd-item', listEl).forEach((item) => {
        item.addEventListener('click', () => {
          const idx = Number(item.dataset.idx);
          if (filtered[idx]) filtered[idx].action();
        });
      });
    }

    input.addEventListener('input', () => draw(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') m.remove();
      if (e.key === 'Enter') {
        const sel = $('.cmd-item.selected', listEl);
        if (sel) sel.click();
      }
    });

    draw();
    m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });
    setTimeout(() => input.focus(), 50);
  }

  // Global Keyboard Listener for Cmd+K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
  });

  function loginScreen(currentUser = null) {
    const isCustomer = currentUser && currentUser.role !== 'admin';
    $('#admin-root').innerHTML = `
    <div class="admin-login"><div class="al-card">
      <div class="logo">🔐</div>
      <h1>LOVE SHOP ADMIN</h1>
      <p class="sub">Yönetim Paneline yalnızca yetkilendirilmiş yöneticiler erişebilir</p>
      ${isCustomer ? `
        <div style="background:rgba(225,29,72,0.1);border:1px solid rgba(225,29,72,0.25);color:var(--text);padding:12px 14px;border-radius:10px;font-size:13px;margin-bottom:18px;line-height:1.5">
          ⚠️ <b>Yetkisiz Erişim:</b> <i>${esc(currentUser.email)}</i> hesabı müşteri statüsündedir. Bu panele yalnızca yönetici yetkisi verilmiş hesaplar girebilir.
          <div style="margin-top:8px"><a href="/hesap" style="color:var(--rose);font-weight:600;text-decoration:underline">→ Müşteri Hesabım Paneline Git</a></div>
        </div>
      ` : ''}
      <form id="adm-login">
        <div class="field"><label>Yönetici E-posta</label><input id="al-email" type="email" placeholder="admin@loveshop.com.tr" required></div>
        <div class="field"><label>Şifre</label><input id="al-pass" type="password" placeholder="••••••••" required></div>
        <button class="btn btn-primary" style="width:100%;margin-top:10px" type="submit">Yönetici Girişi Yap</button>
      </form>
      <div class="al-hint">
        <a href="/" style="color:var(--rose);font-weight:600;display:inline-block;margin-top:6px">← Mağazaya Dön</a>
        <span style="display:inline-block;margin:0 8px;color:var(--muted)">·</span>
        <a href="/hesap" style="color:var(--muted);display:inline-block;margin-top:6px">Müşteri Paneli</a>
      </div>
    </div></div>`;
    $('#adm-login').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const r = await api('/api/auth/login', { method: 'POST', body: { email: $('#al-email').value.trim(), password: $('#al-pass').value } });
        if (r.user.role !== 'admin') throw new Error('Bu hesap yönetici yetkisine sahip değil.');
        if (r.token) {
          localStorage.setItem('ls_auth_token', r.token);
          localStorage.setItem('ls_admin_token', r.token);
        }
        toast('Hoş geldiniz, ' + r.user.name);
        route();
      } catch (err) { toast(err.message, true); }
    });
  }

  /* ================= 2026 DRIBBBLE BENTO GRID & CHARTING ENGINE ================= */
  function renderSparklineSvg(values, color = '#FF4D6D', width = 105, height = 36) {
    if (!values || !values.length) {
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><line x1="0" y1="${height/2}" x2="${width}" y2="${height/2}" stroke="${color}" stroke-opacity="0.3" stroke-dasharray="3 3"/></svg>`;
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = (max - min) || 1;
    const pad = 4;
    const pts = values.map((v, i) => {
      const x = (i / (values.length - 1 || 1)) * width;
      const y = height - pad - ((v - min) / range) * (height - pad * 2);
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    });

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) * 0.16;
      const cp1y = p1.y + (p2.y - p0.y) * 0.16;
      const cp2x = p2.x - (p3.x - p1.x) * 0.16;
      const cp2y = p2.y - (p3.y - p1.y) * 0.16;
      d += ` C ${Math.round(cp1x*10)/10} ${Math.round(cp1y*10)/10} ${Math.round(cp2x*10)/10} ${Math.round(cp2y*10)/10} ${p2.x} ${p2.y}`;
    }

    const areaD = `${d} L ${pts[pts.length - 1].x} ${height} L 0 ${height} Z`;
    const gradId = 'spk-g-' + Math.random().toString(36).slice(2, 7);

    return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.35" />
          <stop offset="100%" stop-color="${color}" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#${gradId})" />
      <path d="${d}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${pts[pts.length - 1].x}" cy="${pts[pts.length - 1].y}" r="3" fill="${color}" />
    </svg>`;
  }

  function initSplineChart(containerEl, days30) {
    let activeRange = 7;

    function render() {
      const data = days30.slice(-activeRange);
      const values = data.map((d) => d.value);
      const orders = data.map((d) => d.orders || 0);
      const totalRev = values.reduce((a, b) => a + b, 0);
      const totalOrd = orders.reduce((a, b) => a + b, 0);
      const avgDaily = activeRange > 0 ? totalRev / activeRange : 0;
      const maxVal = Math.max(...values, 100);
      const peakIdx = values.indexOf(Math.max(...values));
      const peakDay = data[peakIdx] || { label: '—', value: 0 };

      const elRev = $('#sm-total-rev', containerEl);
      const elAvg = $('#sm-daily-avg', containerEl);
      const elPeak = $('#sm-peak-val', containerEl);
      const elOrd = $('#sm-total-ord', containerEl);
      if (elRev) elRev.textContent = fmt(totalRev);
      if (elAvg) elAvg.textContent = fmt(avgDaily);
      if (elPeak) elPeak.textContent = `${fmt(peakDay.value)} (${peakDay.label})`;
      if (elOrd) elOrd.textContent = `${totalOrd} sipariş`;

      const W = 800;
      const H = 220;
      const padTop = 20;
      const padBottom = 32;
      const padLeft = 14;
      const padRight = 14;
      const chartW = W - padLeft - padRight;
      const chartH = H - padTop - padBottom;

      const ceilMax = Math.ceil(maxVal * 1.18);
      const pts = data.map((d, i) => {
        const x = padLeft + (i / (data.length - 1 || 1)) * chartW;
        const y = padTop + chartH - (d.value / ceilMax) * chartH;
        return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, data: d };
      });

      let pathD = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];
        const cp1x = p1.x + (p2.x - p0.x) * 0.18;
        const cp1y = p1.y + (p2.y - p0.y) * 0.18;
        const cp2x = p2.x - (p3.x - p1.x) * 0.18;
        const cp2y = p2.y - (p3.y - p1.y) * 0.18;
        pathD += ` C ${Math.round(cp1x*10)/10} ${Math.round(cp1y*10)/10} ${Math.round(cp2x*10)/10} ${Math.round(cp2y*10)/10} ${p2.x} ${p2.y}`;
      }
      const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H - padBottom} L ${pts[0].x} ${H - padBottom} Z`;

      const gridLines = [0, 0.33, 0.66, 1].map((p) => {
        const y = padTop + chartH * (1 - p);
        const val = Math.round(ceilMax * p);
        return `
        <line x1="${padLeft}" y1="${y}" x2="${W - padRight}" y2="${y}" stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="4 4" />
        <text x="${padLeft}" y="${y - 4}" fill="currentColor" opacity="0.35" font-size="10" font-family="var(--font-display)">${val ? fmt(val).replace('₺','').trim() + ' ₺' : '0 ₺'}</text>`;
      }).join('');

      const step = activeRange === 30 ? 5 : (activeRange === 14 ? 2 : 1);
      const xLabels = pts.filter((_, idx) => idx % step === 0 || idx === pts.length - 1).map((p) => `
        <text x="${p.x}" y="${H - 8}" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="11" font-weight="500">${p.data.label}</text>
      `).join('');

      const svgWrap = $('#chart-svg-target', containerEl);
      if (!svgWrap) return;
      svgWrap.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="spline-fill-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FF4D6D" stop-opacity="0.38" />
            <stop offset="65%" stop-color="#FF4D6D" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#FF4D6D" stop-opacity="0.0" />
          </linearGradient>
          <filter id="spline-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#FF4D6D" flood-opacity="0.45" />
          </filter>
        </defs>
        ${gridLines}
        <path d="${areaD}" fill="url(#spline-fill-grad)" />
        <path d="${pathD}" fill="none" stroke="#FF4D6D" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#spline-glow)" />
        ${xLabels}
        <line id="chart-ch" x1="0" y1="${padTop}" x2="0" y2="${H - padBottom}" stroke="#FF4D6D" stroke-width="1.5" stroke-dasharray="3 3" opacity="0" />
        <circle id="chart-marker-halo" cx="0" cy="0" r="10" fill="#FF4D6D" fill-opacity="0.25" opacity="0" />
        <circle id="chart-marker" cx="0" cy="0" r="4.5" fill="#FFFFFF" stroke="#FF4D6D" stroke-width="2.5" opacity="0" />
      </svg>
      <div class="chart-tooltip" id="chart-tt"></div>`;

      const svgEl = svgWrap.querySelector('svg');
      const tt = $('#chart-tt', containerEl);
      const ch = $('#chart-ch', containerEl);
      const marker = $('#chart-marker', containerEl);
      const halo = $('#chart-marker-halo', containerEl);

      function onMove(e) {
        const rect = svgEl.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const relX = (clientX - rect.left) / rect.width;
        const svgX = relX * W;

        let nearest = pts[0];
        let minDist = Infinity;
        for (const p of pts) {
          const dist = Math.abs(p.x - svgX);
          if (dist < minDist) {
            minDist = dist;
            nearest = p;
          }
        }
        if (!nearest) return;

        ch.setAttribute('x1', nearest.x);
        ch.setAttribute('x2', nearest.x);
        ch.setAttribute('opacity', '0.8');

        marker.setAttribute('cx', nearest.x);
        marker.setAttribute('cy', nearest.y);
        marker.setAttribute('opacity', '1');

        halo.setAttribute('cx', nearest.x);
        halo.setAttribute('cy', nearest.y);
        halo.setAttribute('opacity', '1');

        tt.style.opacity = '1';
        tt.innerHTML = `
          <div class="tt-date">📅 ${nearest.data.label} (${nearest.data.shortLabel})</div>
          <div class="tt-rev">${fmt(nearest.data.value)}</div>
          <div class="tt-ord">📦 ${nearest.data.orders || 0} Sipariş</div>
        `;

        const ttX = (nearest.x / W) * rect.width;
        const ttY = (nearest.y / H) * rect.height;
        const clampedX = Math.max(10, Math.min(rect.width - 155, ttX - 75));
        tt.style.transform = `translate(${clampedX}px, ${Math.max(8, ttY - 80)}px)`;
      }

      function onLeave() {
        if (ch) ch.setAttribute('opacity', '0');
        if (marker) marker.setAttribute('opacity', '0');
        if (halo) halo.setAttribute('opacity', '0');
        if (tt) tt.style.opacity = '0';
      }

      svgEl.addEventListener('mousemove', onMove);
      svgEl.addEventListener('mouseleave', onLeave);
      svgEl.addEventListener('touchmove', onMove, { passive: true });
      svgEl.addEventListener('touchend', onLeave);
    }

    $$('.range-tab', containerEl).forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.range-tab', containerEl).forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeRange = Number(btn.dataset.range);
        render();
      });
    });

    render();
  }

  function renderDonutVisual(containerEl, categoriesDetailed) {
    if (!categoriesDetailed || !categoriesDetailed.length) {
      containerEl.innerHTML = '<div class="empty" style="padding:40px 0"><div class="big">📭</div>Henüz kategori satış verisi oluşmadı</div>';
      return;
    }

    const totalQty = categoriesDetailed.reduce((a, b) => a + b.qty, 0) || 1;
    const r = 52;
    const circ = 2 * Math.PI * r;
    let accumOffset = 0;

    const arcs = categoriesDetailed.map((c) => {
      const pct = c.qty / totalQty;
      const strokeLen = pct * circ;
      const offset = circ - accumOffset;
      accumOffset += strokeLen;
      return `
        <circle cx="70" cy="70" r="${r}" fill="transparent" stroke="${c.color}" stroke-width="16"
          stroke-dasharray="${strokeLen} ${circ - strokeLen}" stroke-dashoffset="${offset}"
          stroke-linecap="round" />
      `;
    }).join('');

    const legendList = categoriesDetailed.map((c) => `
      <div class="cat-item-row">
        <div class="cat-item-left">
          <span class="cat-dot" style="background:${c.color}"></span>
          <span class="cat-item-name">${esc(c.name)}</span>
        </div>
        <div class="cat-item-right">
          <span class="cat-item-pct">%${c.percentage}</span>
          <span class="cat-item-val">${c.qty} adet</span>
        </div>
      </div>
    `).join('');

    containerEl.innerHTML = `
    <div class="donut-container">
      <div class="donut-top-visual">
        <svg width="140" height="140" viewBox="0 0 140 140" style="transform: rotate(-90deg); overflow: visible">
          <circle cx="70" cy="70" r="${r}" fill="transparent" stroke="var(--card-2)" stroke-width="16" />
          ${arcs}
        </svg>
        <div class="donut-center-info">
          <span class="donut-center-val">${totalQty}</span>
          <span class="donut-center-lbl">Satılan Ürün</span>
        </div>
      </div>
      <div class="cat-breakdown-list">
        ${legendList}
      </div>
    </div>`;
  }

  /* ================= DASHBOARD CONTROLLER ================= */
  async function viewDashboard() {
    mount('dashboard', '<div style="text-align:center;padding:50px" class="loading">Bento Grid ve analitik verileri derleniyor…</div>');
    let d, ordersRes;
    try {
      [d, ordersRes] = await Promise.all([
        api('/api/admin/stats').then((r) => r.stats),
        api('/api/admin/orders').catch(() => ({ orders: [] }))
      ]);
    } catch (e) { return toast(e.message, true); }

    const days30 = d.days30 || [];
    const revHistory = days30.map((x) => x.value);
    const ordHistory = days30.map((x) => x.orders);
    const recentOrders = (ordersRes.orders || []).slice(0, 6);
    const aov = d.aov || (d.orders ? d.revenue / d.orders : 0);

    const AVATAR_COLORS = [
      'linear-gradient(135deg, #FF4D6D 0%, #FFA07A 100%)',
      'linear-gradient(135deg, #A78BFA 0%, #818CF8 100%)',
      'linear-gradient(135deg, #38BDF8 0%, #34D399 100%)',
      'linear-gradient(135deg, #FBBF24 0%, #F87171 100%)',
      'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)'
    ];

    mount('dashboard', `
    <!-- TOP ROW: BENTO 4x KPI CARDS WITH LIVE SPARKLINES -->
    <div class="bento-grid">
      <!-- KPI 1: REVENUE -->
      <div class="bento-card kpi-card bento-span-3">
        <div class="kpi-top">
          <div class="kpi-icon-wrap" style="color:var(--rose)">💰</div>
          <span class="kpi-badge up">▲ %${d.revGrowth >= 0 ? '+' : ''}${d.revGrowth} Haftalık</span>
        </div>
        <div class="kpi-mid">
          <div>
            <div class="kpi-val">${fmt(d.revenue)}</div>
            <div class="kpi-label">Toplam Net Ciro</div>
          </div>
          <div class="kpi-spark-wrap">
            ${renderSparklineSvg(revHistory.slice(-14), '#FF4D6D', 105, 38)}
          </div>
        </div>
        <div class="kpi-foot">
          <span>Ortalama Sepet (AOV):</span>
          <b>${fmt(aov)}</b>
        </div>
      </div>

      <!-- KPI 2: ORDERS -->
      <div class="bento-card kpi-card bento-span-3">
        <div class="kpi-top">
          <div class="kpi-icon-wrap" style="color:#A78BFA">📦</div>
          <span class="kpi-badge neutral">▲ %${d.ordGrowth >= 0 ? '+' : ''}${d.ordGrowth} Hacim</span>
        </div>
        <div class="kpi-mid">
          <div>
            <div class="kpi-val">${d.orders}</div>
            <div class="kpi-label">Toplam Sipariş</div>
          </div>
          <div class="kpi-spark-wrap">
            ${renderSparklineSvg(ordHistory.slice(-14), '#A78BFA', 105, 38)}
          </div>
        </div>
        <div class="kpi-foot">
          <span>Hazırlanan / Kargolanacak:</span>
          <b>${d.pendingOrders || 0} sipariş</b>
        </div>
      </div>

      <!-- KPI 3: CUSTOMERS -->
      <div class="bento-card kpi-card bento-span-3">
        <div class="kpi-top">
          <div class="kpi-icon-wrap" style="color:#38BDF8">👥</div>
          <span class="kpi-badge up">● Aktif Portföy</span>
        </div>
        <div class="kpi-mid">
          <div>
            <div class="kpi-val">${d.customers}</div>
            <div class="kpi-label">Kayıtlı Müşteri</div>
          </div>
          <div class="kpi-spark-wrap">
            ${renderSparklineSvg([1, 2, 2, 3, 4, 5, d.customers], '#38BDF8', 105, 38)}
          </div>
        </div>
        <div class="kpi-foot">
          <span>Bülten Aboneleri:</span>
          <b>${d.newsletter} üye</b>
        </div>
      </div>

      <!-- KPI 4: INVENTORY & HEALTH -->
      <div class="bento-card kpi-card bento-span-3">
        <div class="kpi-top">
          <div class="kpi-icon-wrap" style="color:#34D399">🛍️</div>
          <span class="kpi-badge ${d.lowStock.length ? 'warn' : 'up'}">${d.lowStock.length ? d.lowStock.length + ' Azalan' : '✓ Dengeli'}</span>
        </div>
        <div class="kpi-mid">
          <div>
            <div class="kpi-val">${d.products}</div>
            <div class="kpi-label">Aktif Katalog Ürünü</div>
          </div>
          <div class="kpi-spark-wrap">
            ${renderSparklineSvg([d.products, d.products, d.products, d.products], '#34D399', 105, 38)}
          </div>
        </div>
        <div class="kpi-foot">
          <span>Kritik Stok Uyarısı:</span>
          <b style="${d.lowStock.length ? 'color:var(--err)' : ''}">${d.lowStock.length ? d.lowStock.length + ' ürün kaldı' : 'Tam Stok'}</b>
        </div>
      </div>
    </div>

    <!-- MIDDLE ROW: INTERACTIVE SPLINE CHART (SPAN 8) & DONUT (SPAN 4) -->
    <div class="bento-grid">
      <!-- MAIN SPLINE CHART -->
      <div class="bento-card bento-span-8" id="spline-chart-panel">
        <div class="bento-card-header">
          <div class="bento-card-title">
            <h2>Hasılat & Büyüme Analitiği</h2>
            <span>Etkileşimli akıcı spline ciro eğrisi ve sipariş yoğunluğu</span>
          </div>
          <div class="range-tabs">
            <button type="button" class="range-tab active" data-range="7">7 Gün</button>
            <button type="button" class="range-tab" data-range="14">14 Gün</button>
            <button type="button" class="range-tab" data-range="30">30 Gün</button>
          </div>
        </div>

        <div class="spline-metrics-bar">
          <div class="sm-item">
            <span class="sm-label">Dönem Cirosu</span>
            <span class="sm-value" id="sm-total-rev">₺0</span>
          </div>
          <div class="sm-item">
            <span class="sm-label">Günlük Ortalama</span>
            <span class="sm-value" id="sm-daily-avg">₺0</span>
          </div>
          <div class="sm-item">
            <span class="sm-label">Dönem Zirvesi</span>
            <span class="sm-value" id="sm-peak-val">₺0</span>
          </div>
          <div class="sm-item">
            <span class="sm-label">Dönem Siparişleri</span>
            <span class="sm-value" id="sm-total-ord" style="color:var(--ok)">0 sipariş</span>
          </div>
        </div>

        <div class="chart-svg-container" id="chart-svg-target"></div>
      </div>

      <!-- DONUT CATEGORY BREAKDOWN -->
      <div class="bento-card bento-span-4">
        <div class="bento-card-header">
          <div class="bento-card-title">
            <h2>Kategori Dağılımı</h2>
            <span>Satış hacminin departmanlara göre payı</span>
          </div>
        </div>
        <div id="donut-target" style="height:100%"></div>
      </div>
    </div>

    <!-- BOTTOM ROW: REALTIME ORDER FEED (SPAN 7) & OPS RADAR (SPAN 5) -->
    <div class="bento-grid">
      <!-- REALTIME ORDER FEED -->
      <div class="bento-card bento-span-7">
        <div class="bento-card-header">
          <div class="bento-card-title">
            <h2>Canlı Sipariş Akışı</h2>
            <span>Son işlemler, teslimat adımları ve müşteri rotası</span>
          </div>
          <a href="#/orders" class="btn btn-ghost btn-sm">Tüm Siparişler →</a>
        </div>

        <div class="feed-list" id="dash-order-feed">
          ${recentOrders.length ? recentOrders.map((o, idx) => {
            const initials = (o.customerName || 'Müşteri').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
            const avBg = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            return `
            <div class="feed-item" data-ord-id="${esc(o.id)}">
              <div class="feed-user">
                <div class="feed-avatar" style="background:${avBg}">${initials}</div>
                <div class="feed-meta">
                  <div class="feed-name ${privacyMode ? 'privacy-masked' : ''}">${esc(o.customerName)}</div>
                  <div class="feed-id-time">
                    <span class="mono">${esc(o.id)}</span>
                    <span>·</span>
                    <span>${dShort(o.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div class="feed-right">
                <span class="pill s-${o.status}">${STATUS[o.status]}</span>
                <span class="feed-price">${fmt(o.total)}</span>
              </div>
            </div>`;
          }).join('') : '<div class="empty" style="padding:40px 0"><div class="big">📭</div>Henüz sipariş kaydı bulunmuyor</div>'}
        </div>
      </div>

      <!-- OPS RADAR & FAST SHORTCUTS -->
      <div class="bento-card bento-span-5">
        <div class="bento-card-header">
          <div class="bento-card-title">
            <h2>Operasyon Radarı & Hızlı Eylemler</h2>
            <span>Altyapı sağlığı ve acil aksiyon paneli</span>
          </div>
        </div>

        <div class="ops-grid">
          <div class="health-radar-box">
            <div class="hr-info">
              <span class="hr-title">Altyapı & Veritabanı Senkronizasyonu</span>
              <span class="hr-status">● Cloud Firestore Canlı</span>
            </div>
            <span class="hr-badge">%99.9 Uptime</span>
          </div>

          <!-- Quick Actions Grid -->
          <div class="quick-action-btns">
            <a href="#/products" class="action-btn-chip" id="qa-add-prod">
              <span class="ic">🛍️</span>
              <span>＋ Yeni Ürün</span>
            </a>
            <a href="#/coupons" class="action-btn-chip">
              <span class="ic">🎟️</span>
              <span>Yeni Kupon</span>
            </a>
            <button type="button" class="action-btn-chip" id="qa-cmd">
              <span class="ic">⚡</span>
              <span>Komutlar (⌘K)</span>
            </button>
            <a href="/" target="_blank" class="action-btn-chip">
              <span class="ic">🏬</span>
              <span>Mağaza Önizle</span>
            </a>
          </div>

          <!-- Low Stock Alert Radar -->
          <div style="margin-top:4px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
              <span style="font-size:12px;font-weight:600;color:var(--muted)">Kritik Stok Uyarısı (≤5)</span>
              <a href="#/products" style="font-size:11.5px;color:var(--rose)">Kataloğu Yönet</a>
            </div>
            ${d.lowStock.length ? `
            <div style="display:flex;flex-direction:column;gap:6px">
              ${d.lowStock.slice(0, 3).map((p) => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--card-2);border-radius:10px;font-size:12.5px;border:1px solid var(--line)">
                  <span style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:170px">${esc(p.name)}</span>
                  <span class="${p.stock === 0 ? 'no-stock' : 'low-stock'}" style="font-size:11.5px;font-weight:700">${p.stock === 0 ? 'TÜKENDİ ⚠️' : p.stock + ' adet'}</span>
                </div>
              `).join('')}
            </div>` : '<div style="font-size:12px;color:var(--ok);padding:10px 12px;background:var(--card-2);border-radius:10px;border:1px solid var(--line)">✓ Tüm envanter stok seviyeleri sağlıklı</div>'}
          </div>
        </div>
      </div>
    </div>`);

    // Initialize Interactive Spline Chart
    initSplineChart($('#spline-chart-panel'), days30);

    // Initialize Donut Chart
    renderDonutVisual($('#donut-target'), d.categoriesDetailed || []);

    // Bind Feed Items to Order Modal
    $$('#dash-order-feed [data-ord-id]').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.dataset.ordId;
        const target = (ordersRes.orders || []).find((x) => x.id === id);
        if (target) openOrderModal(target);
      });
    });

    // Bind Quick Action buttons
    const qaCmd = $('#qa-cmd');
    if (qaCmd) qaCmd.addEventListener('click', openCommandPalette);

    const qaAdd = $('#qa-add-prod');
    if (qaAdd) {
      qaAdd.addEventListener('click', (e) => {
        e.preventDefault();
        location.hash = '#/products';
        setTimeout(() => {
          const btn = $('#prod-add');
          if (btn) btn.click();
        }, 120);
      });
    }
  }

  /* ================= ORDERS ================= */
  async function viewOrders() {
    mount('orders', `
    <div class="toolbar">
      <div class="search-box"><span class="ic">🔍</span><input id="ord-q" placeholder="Sipariş no, müşteri veya e-posta ara…"></div>
      <select id="ord-status">
        <option value="">Tüm Sipariş Durumları</option>
        <option value="processing">Hazırlanıyor</option>
        <option value="shipped">Kargoda</option>
        <option value="delivered">Teslim Edildi</option>
        <option value="cancelled">İptal</option>
      </select>
      <button class="btn btn-ghost" id="ord-export" style="margin-left:auto">📥 Siparişleri CSV İndir</button>
      <button class="btn btn-ghost" id="ord-clear-all" style="color:var(--rose,#ff3366);border-color:rgba(255,51,102,0.3)">🗑️ Tümünü Temizle</button>
    </div>
    <div class="panel"><div class="panel-body flush">
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>Sipariş No & Tarih</th><th>Müşteri Bilgisi</th><th>Kalem</th><th>Tutar & Ödeme</th><th>Kargo Takip</th><th>Durum</th><th>Hızlı İşlemler</th></tr></thead>
          <tbody id="ord-body"></tbody>
        </table>
      </div>
    </div></div>`);

    let all = [];
    try { all = (await api('/api/admin/orders')).orders; } catch (e) { return toast(e.message, true); }

    function draw() {
      const kw = $('#ord-q').value.trim().toLowerCase();
      const st = $('#ord-status').value;
      const list = all.filter((o) => (!st || o.status === st) && (!kw || o.id.toLowerCase().includes(kw) || o.customerName.toLowerCase().includes(kw) || (o.userEmail || '').includes(kw)));

      $('#ord-body').innerHTML = list.length ? list.map((o) => `
      <tr>
        <td class="mono">
          <b>${esc(o.id)}</b>
          <div class="muted" style="font-size:11px">${dShort(o.createdAt)}</div>
        </td>
        <td>
          <div class="${privacyMode ? 'privacy-masked' : ''}"><b>${esc(o.customerName)}</b></div>
          <div class="muted ${privacyMode ? 'privacy-masked' : ''}" style="font-size:11px">${esc(o.address ? o.address.city : '')}${o.discreet ? ' · 📦 Gizli Paket' : ''}</div>
        </td>
        <td>${o.items.reduce((a, i) => a + i.qty, 0)} adet</td>
        <td>
          <b>${fmt(o.total)}</b>
          <div class="muted" style="font-size:11px">${esc(o.payment)}</div>
        </td>
        <td>
          ${o.trackingNumber ? `<span class="mono" style="color:var(--info);font-size:11px">${esc(o.carrier || 'Kargo')}: ${esc(o.trackingNumber)}</span>` : '<span class="muted" style="font-size:11px">Girilmedi</span>'}
        </td>
        <td><span class="pill s-${o.status}">${STATUS[o.status]}</span></td>
        <td style="white-space:nowrap">
          <button class="btn-icon" data-view="${esc(o.id)}" title="Sipariş Detayı & Kargo / Yazdır">👁️</button>
          <select data-status="${esc(o.id)}" style="background:var(--card-2);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:6px 10px;font-size:12px;outline:none">
            ${['processing', 'shipped', 'delivered', 'cancelled'].map((s) => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${STATUS[s]}</option>`).join('')}
          </select>
          <button class="btn-icon" data-del="${esc(o.id)}" title="Siparişi Sil" style="color:var(--rose,#ff3366);margin-left:4px">🗑️</button>
        </td>
      </tr>`).join('') : '<tr><td colspan="8"><div class="empty">Aramaya uygun sipariş bulunamadı</div></td></tr>';

      $$('[data-view]').forEach((b) => b.addEventListener('click', () => openOrderModal(all.find((o) => o.id === b.dataset.view))));
      $$('[data-del]').forEach((b) => b.addEventListener('click', async () => {
        const id = b.dataset.del;
        if (!confirm(`${id} numaralı siparişi silmek istediğinize emin misiniz?`)) return;
        try {
          await api('/api/admin/orders/' + encodeURIComponent(id), { method: 'DELETE' });
          toast('Sipariş başarıyla silindi');
          all = all.filter((x) => x.id !== id);
          draw();
        } catch (e) { toast(e.message, true); }
      }));
      $$('[data-status]').forEach((sel) => sel.addEventListener('change', async () => {
        try {
          await api('/api/admin/orders/' + encodeURIComponent(sel.dataset.status), { method: 'POST', body: { status: sel.value } });
          toast('Sipariş durumu güncellendi');
          const item = all.find((x) => x.id === sel.dataset.status);
          if (item) item.status = sel.value;
          draw();
        } catch (e) { toast(e.message, true); }
      }));
    }

    $('#ord-export').addEventListener('click', () => {
      const rows = [
        ['Siparis No', 'Tarih', 'Musteri', 'Telefon', 'Email', 'Tutar', 'Odeme', 'Durum', 'Kargo Kodu', 'Gizli Paket'],
        ...all.map((o) => [
          o.id, o.createdAt, o.customerName, o.phone || '', o.userEmail || '', o.total, o.payment, o.status, o.trackingNumber || '', o.discreet ? 'Evet' : 'Hayir'
        ])
      ];
      exportCSV(`loveshop-siparisler-${new Date().toISOString().slice(0,10)}.csv`, rows);
    });

    const clearAllBtn = $('#ord-clear-all');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', async () => {
        if (!all.length) return toast('Temizlenecek sipariş bulunmuyor.');
        if (!confirm('DİKKAT: Listedeki tüm siparişler kalıcı olarak silinecektir. Emin misiniz?')) return;
        try {
          await api('/api/admin/orders/clear-all', { method: 'POST' });
          toast('Tüm sipariş geçmişi temizlendi 🗑️');
          all = [];
          draw();
        } catch (e) { toast(e.message, true); }
      });
    }

    $('#ord-q').addEventListener('input', draw);
    $('#ord-status').addEventListener('change', draw);
    draw();
  }

  function openOrderModal(o) {
    if (!o) return;
    const m = document.createElement('div');
    m.className = 'modal-back open';
    
    // Create quick WhatsApp tracking notification message
    const waText = encodeURIComponent(`Merhaba ${o.customerName}, Love Shop'tan verdiğiniz ${o.id} numaralı siparişiniz hakkında bilgilendirme:\nDurum: ${STATUS[o.status] || o.status}\n${o.trackingNumber ? `Kargo Takip No: ${o.trackingNumber} (${o.carrier || 'Kargo'})\n` : ''}Toplam: ${fmt(o.total)}\nBizi tercih ettiğiniz için teşekkür ederiz! ❤️`);
    const waLink = `https://wa.me/${(o.phone || '').replace(/[^0-9]/g, '')}?text=${waText}`;

    m.innerHTML = `<div class="modal" style="max-width:700px">
      <div class="modal-head">
        <div>
          <h3>Sipariş İncelemesi: ${esc(o.id)}</h3>
          <span class="muted" style="font-size:12px">${dShort(o.createdAt)}</span>
        </div>
        <button class="modal-close">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" id="ord-print-btn">🖨️ Fiş / İrsaliye Yazdır</button>
          ${o.phone ? `<a href="${waLink}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="color:#25D366;border-color:rgba(37,211,102,.4)">💬 WhatsApp'tan Bilgilendir</a>` : ''}
        </div>

        <dl class="dl">
          <dt>Müşteri</dt><dd class="${privacyMode ? 'privacy-masked' : ''}">${esc(o.customerName)} · ${esc(o.userEmail || 'Misafir')}</dd>
          <dt>İletişim Tel</dt><dd class="${privacyMode ? 'privacy-masked' : ''}">${esc(o.phone || '—')}</dd>
          <dt>Teslimat Adresi</dt><dd class="${privacyMode ? 'privacy-masked' : ''}">${esc(o.address ? o.address.full + ', ' + o.address.city + ' ' + (o.address.zip || '') : '—')}</dd>
          <dt>Ödeme Yöntemi</dt><dd>${esc(o.payment)}</dd>
          <dt>Müşteri Notu</dt><dd>${esc(o.note || '—')}</dd>
          <dt>Gizli Paketleme</dt><dd>${o.discreet ? '📦 Evet (Dışarıdan içeriği belli olmayan isimsiz kutu)' : 'Standart'}</dd>
          <dt>Uygulanan Kupon</dt><dd>${o.coupon ? esc(o.coupon) : '—'}</dd>
        </dl>

        <div style="background:var(--card-2);border:1px solid var(--line);border-radius:var(--r-sm);padding:16px;margin:20px 0">
          <h4 style="font-size:12.5px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;color:var(--text)">🚚 Kargo ve Gönderi Bilgileri</h4>
          <div class="grid-2">
            <div class="field" style="margin-bottom:0">
              <label>Kargo Firması</label>
              <input id="om-carrier" value="${esc(o.carrier || 'Yurtiçi Kargo')}" placeholder="Yurtiçi, MNG, Aras...">
            </div>
            <div class="field" style="margin-bottom:0">
              <label>Takip Kodu</label>
              <input id="om-track" value="${esc(o.trackingNumber || '')}" placeholder="Takip numarası girin">
            </div>
          </div>
        </div>

        <h3 style="margin:20px 0 10px;font-family:var(--font-display);font-size:15px">Sipariş Edilen Ürünler</h3>
        <table class="tbl">
          <thead><tr><th></th><th>Ürün Adı</th><th>Adet</th><th>Birim Fiyat</th><th>Toplam</th></tr></thead>
          <tbody>
            ${o.items.map((i) => `
              <tr>
                <td><img src="${esc(i.image)}" style="width:40px;height:40px;border-radius:8px;object-fit:cover"></td>
                <td><b>${esc(i.name)}</b></td>
                <td>${i.qty}×</td>
                <td>${fmt(i.price)}</td>
                <td><b>${fmt(i.price * i.qty)}</b></td>
              </tr>`).join('')}
          </tbody>
        </table>

        <dl class="dl" style="margin-top:18px;border-top:1px solid var(--line);padding-top:14px">
          <dt>Ara Toplam</dt><dd>${fmt(o.subtotal)}</dd>
          <dt>Kargo Ücreti</dt><dd>${o.shipping ? fmt(o.shipping) : 'Ücretsiz'}</dd>
          <dt>Kupon İndirimi</dt><dd>${o.discount ? '-' + fmt(o.discount) : '—'}</dd>
          <dt style="font-size:16px;color:var(--rose)"><b>Genel Toplam</b></dt><dd style="font-size:16px;color:var(--rose)"><b>${fmt(o.total)}</b></dd>
        </dl>
      </div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="om-delete-order" style="color:var(--rose,#ff3366);margin-right:auto">🗑️ Siparişi Sil</button>
        <button type="button" class="btn btn-ghost" data-cancel="true">Kapat</button>
        <button type="button" class="btn btn-primary" id="om-save-track">Kargo Bilgisini Kaydet</button>
      </div>
    </div>`;
    document.body.appendChild(m);

    const closeModal = () => {
      window.removeEventListener('keydown', handleKey);
      m.remove();
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKey);

    $$('.modal-close, [data-cancel]', m).forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }));
    m.addEventListener('click', (e) => { if (e.target === m) closeModal(); });

    $('#ord-print-btn', m).addEventListener('click', () => window.print());

    const delOrderBtn = $('#om-delete-order', m);
    if (delOrderBtn) {
      delOrderBtn.addEventListener('click', async () => {
        if (!confirm(`${o.id} numaralı siparişi silmek istediğinize emin misiniz?`)) return;
        try {
          await api('/api/admin/orders/' + encodeURIComponent(o.id), { method: 'DELETE' });
          toast('Sipariş başarıyla silindi');
          closeModal();
          viewOrders();
        } catch (e) { toast(e.message, true); }
      });
    }

    $('#om-save-track', m).addEventListener('click', async () => {
      const carrier = $('#om-carrier', m).value.trim();
      const trackingNumber = $('#om-track', m).value.trim();
      try {
        await api('/api/admin/orders/' + encodeURIComponent(o.id), {
          method: 'POST',
          body: { carrier, trackingNumber, status: trackingNumber && o.status === 'processing' ? 'shipped' : o.status }
        });
        toast('Kargo takip bilgileri kaydedildi 🚚');
        closeModal();
        viewOrders();
      } catch (e) { toast(e.message, true); }
    });
  }

  /* ================= CATEGORY STATE MANAGER (CENTRALIZED) ================= */
  let ADMIN_CATEGORIES = null;
  let catFetchPromise = null;

  async function fetchCategories(forceRefresh = false) {
    if (!forceRefresh && ADMIN_CATEGORIES && ADMIN_CATEGORIES.length) {
      return ADMIN_CATEGORIES;
    }
    if (catFetchPromise && !forceRefresh) {
      return catFetchPromise;
    }
    catFetchPromise = (async () => {
      try {
        const res = await api('/api/admin/categories');
        ADMIN_CATEGORIES = Array.isArray(res.categories) ? res.categories : [];
        return ADMIN_CATEGORIES;
      } catch (err) {
        console.error('Kategori listesi senkronizasyon hatası:', err);
        return ADMIN_CATEGORIES || [];
      } finally {
        catFetchPromise = null;
      }
    })();
    return catFetchPromise;
  }

  function invalidateCategories() {
    ADMIN_CATEGORIES = null;
    catFetchPromise = null;
  }

  async function ensureCats() {
    return fetchCategories(true);
  }

  async function viewProducts() {
    mount('products', `
    <div class="toolbar">
      <div class="search-box"><span class="ic">🔍</span><input id="prod-q" placeholder="Ürün adı, kategori veya slug ara…"></div>
      <select id="prod-stock-filter">
        <option value="">Tüm Stok Durumları</option>
        <option value="low">Kritik Stok (≤ 5 adet)</option>
        <option value="out">Tükenenler (0 adet)</option>
      </select>
      <button class="btn btn-ghost" id="prod-export">📥 Ürünleri CSV İndir</button>
      <button class="btn btn-ghost" id="wheel-mgr" style="margin-left:auto">🎡 Çarkı Yönet</button>
      <button class="btn btn-ghost" id="prod-add">＋ Manuel Ekle</button>
    </div>
    <div class="panel"><div class="panel-body flush">
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>Ürün Görseli & Adı</th><th>Kategori</th><th>Fiyat</th><th>Stok Durumu</th><th>Etiketler</th><th>İşlem</th></tr></thead>
          <tbody id="prod-body"></tbody>
        </table>
      </div>
    </div></div>`);

    let all = [];
    let wheelIds = [];
    try { all = (await api('/api/admin/products')).products; } catch (e) { return toast(e.message, true); }
    try { wheelIds = (await api('/api/admin/wheel')).ids; } catch {}

    function draw() {
      const kw = $('#prod-q').value.trim().toLowerCase();
      const stFilter = $('#prod-stock-filter').value;
      const inWheel = new Set(wheelIds);
      
      const list = all.filter((p) => {
        if (stFilter === 'low' && p.stock > 5) return false;
        if (stFilter === 'out' && p.stock > 0) return false;
        if (kw && !p.name.toLowerCase().includes(kw) && !p.slug.includes(kw) && !(p.categoryName || '').toLowerCase().includes(kw)) return false;
        return true;
      });

      $('#prod-body').innerHTML = list.length ? list.map((p) => `
      <tr>
        <td>
          <div class="cell-prod">
            <img src="${esc(p.image)}" alt="${esc(p.name)}">
            <div>
              <div class="cp-name">${esc(p.name)}</div>
              <div class="cp-sub">/${esc(p.slug)}</div>
            </div>
          </div>
        </td>
        <td>${esc(p.categoryName || p.category)}</td>
        <td class="quick-edit-cell" data-quick-price="${p.id}" title="Çift tıklayarak fiyatı hızlı düzenleyin">
          <b>${fmt(p.price)}</b>
          ${p.oldPrice ? `<div class="muted" style="font-size:11px;text-decoration:line-through">${fmt(p.oldPrice)}</div>` : ''}
        </td>
        <td class="quick-edit-cell ${p.stock === 0 ? 'no-stock' : p.stock <= 5 ? 'low-stock' : ''}" data-quick-stock="${p.id}" title="Çift tıklayarak stoğu hızlı düzenleyin">
          <b>${p.stock === 0 ? 'TÜKENDİ' : p.stock + ' adet'}</b>
        </td>
        <td>
          ${p.featured ? '<span class="pill s-active">Öne çıkan</span>' : ''}
          ${p.bestSeller ? '<span class="pill s-shipped">Çok satan</span>' : ''}
          ${p.isNew ? '<span class="pill s-processing">Yeni</span>' : ''}
        </td>
        <td style="white-space:nowrap">
          <button class="btn-icon ${inWheel.has(p.id) ? 'on-wheel' : ''}" data-wheel="${p.id}" title="Ana Sayfa 3D Çarkına Ekle/Çıkar">🎡</button>
          <button class="btn-icon" data-edit="${p.id}" title="Ürünü Düzenle">✏️</button>
          <button class="btn-icon danger" data-del="${p.id}" title="Sil">🗑️</button>
        </td>
      </tr>`).join('') : '<tr><td colspan="6"><div class="empty">Kritere uygun ürün bulunamadı</div></td></tr>';

      $$('[data-quick-price]', $('#prod-body')).forEach((cell) => cell.addEventListener('dblclick', (e) => {
        if (cell.querySelector('input')) return;
        const pid = cell.dataset.quickPrice;
        const p = all.find((x) => x.id === pid);
        if (!p) return;
        const oldVal = p.price;
        cell.innerHTML = `<input class="quick-edit-input" type="number" value="${oldVal}">`;
        const inp = cell.querySelector('input');
        inp.focus();
        inp.select();
        const save = async () => {
          const val = Number(inp.value);
          if (!val || isNaN(val) || val < 0) {
            cell.innerHTML = `<b>${fmt(oldVal)}</b>${p.oldPrice ? `<div class="muted" style="font-size:11px;text-decoration:line-through">${fmt(p.oldPrice)}</div>` : ''}`;
            return;
          }
          try {
            await api('/api/admin/products/' + p.id, { method: 'POST', body: { price: val } });
            p.price = val;
            toast(`Fiyat güncellendi: ${fmt(val)} 💰`);
          } catch (err) { toast(err.message, true); }
          cell.innerHTML = `<b>${fmt(p.price)}</b>${p.oldPrice ? `<div class="muted" style="font-size:11px;text-decoration:line-through">${fmt(p.oldPrice)}</div>` : ''}`;
        };
        inp.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter') save();
          if (ev.key === 'Escape') cell.innerHTML = `<b>${fmt(oldVal)}</b>${p.oldPrice ? `<div class="muted" style="font-size:11px;text-decoration:line-through">${fmt(p.oldPrice)}</div>` : ''}`;
        });
        inp.addEventListener('blur', save);
      }));

      $$('[data-quick-stock]', $('#prod-body')).forEach((cell) => cell.addEventListener('dblclick', (e) => {
        if (cell.querySelector('input')) return;
        const pid = cell.dataset.quickStock;
        const p = all.find((x) => x.id === pid);
        if (!p) return;
        const oldVal = p.stock;
        cell.innerHTML = `<input class="quick-edit-input" type="number" value="${oldVal}">`;
        const inp = cell.querySelector('input');
        inp.focus();
        inp.select();
        const save = async () => {
          const val = Number(inp.value);
          if (isNaN(val) || val < 0) {
            cell.innerHTML = `<b>${oldVal === 0 ? 'TÜKENDİ' : oldVal + ' adet'}</b>`;
            return;
          }
          try {
            await api('/api/admin/products/' + p.id, { method: 'POST', body: { stock: val } });
            p.stock = val;
            toast(`Stok güncellendi: ${val} adet 📦`);
          } catch (err) { toast(err.message, true); }
          cell.className = `quick-edit-cell ${p.stock === 0 ? 'no-stock' : p.stock <= 5 ? 'low-stock' : ''}`;
          cell.innerHTML = `<b>${p.stock === 0 ? 'TÜKENDİ' : p.stock + ' adet'}</b>`;
        };
        inp.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter') save();
          if (ev.key === 'Escape') cell.innerHTML = `<b>${oldVal === 0 ? 'TÜKENDİ' : oldVal + ' adet'}</b>`;
        });
        inp.addEventListener('blur', save);
      }));

      $$('[data-wheel]', $('#prod-body')).forEach((b) => b.addEventListener('click', async () => {
        try {
          const r = await api('/api/admin/wheel', { method: 'POST', body: { toggle: b.dataset.wheel } });
          wheelIds = r.ids;
          toast(r.ids.includes(b.dataset.wheel) ? 'Ürün çarka eklendi 🎡' : 'Ürün çarktan çıkarıldı');
          draw();
        } catch (e) { toast(e.message, true); }
      }));
      $$('[data-edit]', $('#prod-body')).forEach((b) => b.addEventListener('click', () => openProductModal(all.find((p) => p.id === b.dataset.edit))));
      $$('[data-del]', $('#prod-body')).forEach((b) => b.addEventListener('click', () => {
        const p = all.find((x) => x.id === b.dataset.del);
        confirmDialog(`"${p.name}" ürününü silmek istediğinize emin misiniz?`, async () => {
          try { await api('/api/admin/products/' + p.id, { method: 'DELETE' }); toast('Ürün silindi'); viewProducts(); }
          catch (e) { toast(e.message, true); }
        });
      }));
    }

    $('#prod-export').addEventListener('click', () => {
      const rows = [
        ['ID', 'Slug', 'Urun Adi', 'Kategori', 'Fiyat', 'Eski Fiyat', 'Stok', 'Puan', 'One Cikan', 'Cok Satan', 'Yeni'],
        ...all.map((p) => [
          p.id, p.slug, p.name, p.categoryName || p.category, p.price, p.oldPrice || '', p.stock, p.rating || 0, p.featured ? 'Evet' : 'Hayir', p.bestSeller ? 'Evet' : 'Hayir', p.isNew ? 'Evet' : 'Hayir'
        ])
      ];
      exportCSV(`loveshop-urunler-${new Date().toISOString().slice(0,10)}.csv`, rows);
    });

    $('#wheel-mgr').addEventListener('click', () => openWheelModal());
        $('#prod-add').addEventListener('click', () => openProductModal(null));
    $('#prod-q').addEventListener('input', draw);
    $('#prod-stock-filter').addEventListener('change', draw);
    draw();
  }

  async function openWheelModal() {
    let sel = [], all = [];
    try { const w = await api('/api/admin/wheel'); sel = [...w.ids]; } catch (e) { return toast(e.message, true); }
    try { all = (await api('/api/admin/products')).products; } catch (e) { return toast(e.message, true); }
    const m = document.createElement('div');
    m.className = 'modal-back open';
    m.innerHTML = `<div class="modal" style="max-width:660px">
      <div class="modal-head">
        <div>
          <h3>🎡 3D Çark Ürünlerini Yönet</h3>
          <span class="muted" style="font-size:12px">Maksimum 8 ürün sırayla ana sayfada döner</span>
        </div>
        <button type="button" class="modal-close" aria-label="Kapat">✕</button>
      </div>
      <div class="modal-body">
        <div id="wm-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:18px"></div>
        <div class="field"><label>Çarka Yeni Ürün Ekle</label><input id="wm-q" placeholder="Ürün adı ile ara…"><div class="hint">Tıkladığınız ürün sıranın sonuna eklenir</div></div>
        <div id="wm-results" style="display:flex;flex-direction:column;gap:6px;max-height:180px;overflow-y:auto"></div>
      </div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" data-cancel="true">Vazgeç</button>
        <button type="button" class="btn btn-primary" id="wm-save">Çarkı Kaydet</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    
    const closeModal = () => {
      window.removeEventListener('keydown', handleKey);
      m.remove();
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKey);

    $$('.modal-close, [data-cancel]', m).forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }));
    m.addEventListener('click', (e) => { if (e.target === m) closeModal(); });

    function drawList() {
      $('#wm-list', m).innerHTML = sel.length ? sel.map((id, i) => {
        const p = all.find((x) => x.id === id);
        if (!p) return '';
        return `<div style="display:flex;align-items:center;gap:12px;padding:8px 12px;border:1px solid var(--line);border-radius:10px;background:var(--card-2)">
          <b style="font-family:'Playfair Display',serif;font-style:italic;width:24px;color:var(--rose)">0${i + 1}</b>
          <img src="${esc(p.image)}" style="width:38px;height:38px;object-fit:cover;border-radius:8px">
          <div style="flex:1;min-width:0"><div style="font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</div><div class="muted" style="font-size:11px">${fmt(p.price)}</div></div>
          <button class="btn-icon danger" data-wm-del="${id}" title="Çıkar">✕</button>
        </div>`;
      }).join('') : '<div class="empty" style="padding:16px">Çark boş — seçim yapmazsanız öne çıkan ürünler otomatik döner.</div>';
      $$('[data-wm-del]', m).forEach((b) => b.addEventListener('click', () => { sel = sel.filter((x) => x !== b.dataset.wmDel); drawList(); drawResults(); }));
    }

    function drawResults() {
      const kw = $('#wm-q', m).value.trim().toLowerCase();
      const inSel = new Set(sel);
      const list = all.filter((p) => !inSel.has(p.id) && (!kw || p.name.toLowerCase().includes(kw) || p.slug.includes(kw))).slice(0, 6);
      $('#wm-results', m).innerHTML = list.length ? list.map((p) => `
        <button data-wm-add="${p.id}" style="display:flex;align-items:center;gap:10px;width:100%;padding:8px 12px;border:1px dashed var(--line);border-radius:10px;background:transparent;cursor:pointer;text-align:left;color:var(--text);transition:border-color .2s">
          <img src="${esc(p.image)}" style="width:34px;height:34px;object-fit:cover;border-radius:8px">
          <div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</div><div class="muted" style="font-size:11px">${esc(p.categoryName)} · ${fmt(p.price)}</div></div>
          <span style="color:var(--rose);font-weight:700">＋ Ekle</span>
        </button>`).join('') : '<div class="muted" style="font-size:12px;text-align:center;padding:8px">Eklenecek ürün kalmadı</div>';
      $$('[data-wm-add]', m).forEach((b) => b.addEventListener('click', () => {
        if (sel.length >= 8) return toast('Çarkta en fazla 8 ürün bulunabilir', true);
        sel.push(b.dataset.wmAdd); drawList(); drawResults();
      }));
    }
    $('#wm-q', m).addEventListener('input', drawResults);
    drawList(); drawResults();

    $('#wm-save', m).addEventListener('click', async () => {
      try {
        await api('/api/admin/wheel', { method: 'POST', body: { ids: sel } });
        toast('3D Çark listesi kaydedildi 🎡');
        m.remove(); viewProducts();
      } catch (e) { toast(e.message, true); }
    });
  }

  /* ================= PRODUCT MODAL (WITH AI ASSIST & STUDIO CLEANER) ================= */
  async function openProductModal(p, prefillData = null) {
    const cats = await ensureCats();
    const isEdit = !!p;
    
    // Merge existing product or prefilled scraped data
    const initialData = p || prefillData || {};
    const v = {
      name: initialData.name || '',
      category: initialData.category || (cats[0] ? cats[0].slug : 'ciftler'),
      categoryName: initialData.categoryName || (cats[0] ? cats[0].name : ''),
      description: initialData.description || '',
      longDescription: initialData.longDescription || '',
      price: initialData.price !== undefined ? initialData.price : '',
      oldPrice: initialData.oldPrice !== undefined ? initialData.oldPrice : '',
      stock: initialData.stock !== undefined ? initialData.stock : 10,
      rating: initialData.rating || 4.5,
      featured: !!initialData.featured,
      isNew: initialData.isNew !== undefined ? !!initialData.isNew : true,
      bestSeller: !!initialData.bestSeller,
      image: initialData.image || '',
      highlights: Array.isArray(initialData.highlights) ? initialData.highlights.join(', ') : (initialData.highlights || ''),
      gallery: Array.isArray(initialData.gallery) ? initialData.gallery : (Array.isArray(initialData.images) ? initialData.images : [])
    };
    
    // Maintain gallery array and primary cover image
    let gallery = Array.isArray(v.gallery) && v.gallery.length ? [...v.gallery] : (v.image ? [v.image] : []);
    let coverImage = v.image || (gallery.length ? gallery[0] : '');
    if (coverImage && !gallery.includes(coverImage)) {
      gallery.unshift(coverImage);
    }

    const m = document.createElement('div');
    m.className = 'modal-back open';
    m.innerHTML = `<div class="modal" style="max-width:780px">
      <div class="modal-head">
        <div>
          <h3>${isEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Oluştur'}</h3>
          <span class="muted" style="font-size:12px">${isEdit ? esc(v.name) : 'Kataloğa yeni ürün ve görseller ekleyin veya linkten otomatik doldurun'}</span>
        </div>
        <button type="button" class="modal-close" id="pm-close-x" aria-label="Kapat">✕</button>
      </div>
      <div class="modal-body">
        <!-- AI Wholesaler Copywriter & Polisher Bar -->
        <div class="ai-polish-banner" id="pm-ai-box">
          <div class="ai-polish-header">
            <div class="ai-polish-title">
              <span class="ai-sparkle">✨</span>
              <span><b>Toptancı Metnini AI ile Dönüştür</b> (Kısa & Lüks Dil)</span>
            </div>
            <button type="button" class="btn-ai-subtle" id="pm-ai-toggle-btn">
              <span id="pm-ai-toggle-icon">📋</span>
              <span id="pm-ai-toggle-text">Ham Metin Yapıştır</span>
            </button>
          </div>
          <div id="pm-ai-paste-zone" style="display:none;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,123,114,0.15)">
            <div class="hint" style="margin-bottom:6px;font-size:11.5px">Toptancıdan kopyaladığınız ham metni buraya yapıştırın. Sistem gereksiz kelimeleri atıp kısa, akıcı ve lüks bir dile dönüştürecektir:</div>
            <textarea id="pm-ai-raw-text" placeholder="Örn: Bükülebilir Başlıklı Wand Vibratör, kadınların cinsel zevkini artırmak için özel olarak tasarlanmıştır. Bu vibratör 8 farklı hız ve 20 titreşim modu sunar..." style="width:100%;min-height:85px;background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:8px 10px;color:var(--text);font-size:12.5px;font-family:inherit;margin-bottom:8px"></textarea>
            <div style="display:flex;justify-content:flex-end;gap:8px">
              <button type="button" class="btn-ai-magic" id="pm-ai-run-paste-btn">
                <span>⚡ Metni Dönüştür ve Forma Aktar</span>
              </button>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="field"><label>Ürün Adı *</label><input id="pm-name" value="${esc(v.name)}"></div>
          <div class="field"><label>Kategori</label>
            <select id="pm-cat">${cats.map((c) => `<option value="${c.slug}" ${v.category === c.slug ? 'selected' : ''}>${esc(c.name)}</option>`).join('') || '<option value="ciftler">Genel</option>'}</select>
          </div>
        </div>
        <div class="grid-3">
          <div class="field"><label>Fiyat (₺) *</label><input id="pm-price" type="number" min="0" step="0.01" value="${esc(v.price)}"></div>
          <div class="field"><label>İndirim Öncesi Fiyat (₺)</label><input id="pm-old" type="number" min="0" step="0.01" value="${esc(v.oldPrice || '')}" placeholder="Yoksa boş bırakın"></div>
          <div class="field"><label>Stok Adedi</label><input id="pm-stock" type="number" min="0" value="${esc(v.stock)}"></div>
        </div>
        
        <div class="field">
          <label>Kısa Tanıtım / Vurgu</label>
          <input id="pm-desc" value="${esc(v.description)}" placeholder="Örn: Çiftlere özel 10 farklı titreşim modu">
        </div>

        <div class="field">
          <label>Öne Çıkan Rozet Özellikleri (Virgülle Ayırın)</label>
          <input id="pm-highlights" value="${esc(v.highlights)}" placeholder="Örn: %100 Medikal Silikon, IPX7 Su Geçirmez, Sessiz Motor, Manyetik Şarj">
          <div class="hint">Boş bırakırsanız kategoriye göre otomatik akıllı rozetler atanır.</div>
        </div>
        
        <div class="field">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <label style="margin-bottom:0">Detaylı Ürün Açıklaması (Özellikler & Gizlilik)</label>
            <button type="button" class="btn-ai-subtle" id="pm-ai-polish-inline-btn" title="Açıklamadaki ham toptancı metnini lüks e-ticaret diline dönüştürür">
              <span>✨</span>
              <span>Metni AI ile Cilala</span>
            </button>
          </div>
          <textarea id="pm-long" style="min-height:120px">${esc(v.longDescription)}</textarea>
        </div>
        
        <!-- Multi-photo management section -->
        <div class="field">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <label style="margin-bottom:0">Ürün Fotoğrafları & Galeri (<span id="pm-photo-count">0</span> Fotoğraf)</label>
            <div style="display:flex;gap:8px">
              <button type="button" class="btn btn-ghost btn-sm" id="pm-add-photo-btn" style="font-size:11.5px">＋ Fotoğraf Ekle</button>
            </div>
          </div>
          <input type="file" id="pm-file" accept="image/*" multiple style="display:none">
          <div class="img-drop" id="pm-drop">
            <div style="font-size:18px;margin-bottom:4px">📤</div>
            <b>Fotoğrafları seçin veya buraya sürükleyip bırakın</b>
            <div class="hint">Aynı anda birden fazla fotoğraf seçebilirsiniz (SVG, PNG, JPG, WebP - max 2MB / adet)</div>
          </div>
          <div class="gallery-grid" id="pm-gallery-grid"></div>
        </div>

        <div style="display:flex;gap:20px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:1px solid var(--line)">
          <label class="checkbox-row"><input type="checkbox" id="pm-featured" ${v.featured ? 'checked' : ''}> ✨ Öne Çıkanlar vitrinine ekle</label>
          <label class="checkbox-row"><input type="checkbox" id="pm-new" ${v.isNew ? 'checked' : ''}> 🆕 "YENİ" rozeti göster</label>
          <label class="checkbox-row"><input type="checkbox" id="pm-best" ${v.bestSeller ? 'checked' : ''}> 🔥 "ÇOK SATAN" rozeti göster</label>
        </div>
      </div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="pm-cancel" data-cancel="true">Vazgeç</button>
        <button type="button" class="btn btn-primary" id="pm-save">${isEdit ? 'Değişiklikleri Kaydet' : 'Ürünü Yayınla'}</button>
      </div>
    </div>`;
    document.body.appendChild(m);

    // Reliable modal closure helper
    const closeModal = () => {
      window.removeEventListener('keydown', handleKey);
      m.remove();
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKey);

    $$('.modal-close, [data-cancel]', m).forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }));
    m.addEventListener('click', (e) => {
      if (e.target === m) closeModal();
    });

    // Attach AI Copywriter & Polisher Event Handlers
    const aiToggleBtn = $('#pm-ai-toggle-btn', m);
    const aiPasteZone = $('#pm-ai-paste-zone', m);
    const aiRawText = $('#pm-ai-raw-text', m);
    const aiRunPasteBtn = $('#pm-ai-run-paste-btn', m);
    const aiPolishInlineBtn = $('#pm-ai-polish-inline-btn', m);

    let isAiPasteOpen = false;
    if (aiToggleBtn && aiPasteZone) {
      aiToggleBtn.addEventListener('click', () => {
        isAiPasteOpen = !isAiPasteOpen;
        aiPasteZone.style.display = isAiPasteOpen ? 'block' : 'none';
        $('#pm-ai-toggle-text', m).textContent = isAiPasteOpen ? 'Kapat' : 'Ham Metin Yapıştır';
        if (isAiPasteOpen && aiRawText) aiRawText.focus();
      });
    }

    const runAiPolish = async (rawInput, triggerBtn) => {
      const name = $('#pm-name', m).value.trim();
      const cat = $('#pm-cat', m).value;
      const desc = $('#pm-desc', m).value.trim();
      const long = $('#pm-long', m).value.trim();
      const textToPolish = rawInput || long || desc || name;

      if (!textToPolish) {
        return toast('Lütfen dönüştürülecek bir ürün adı, açıklama veya ham metin girin.', true);
      }

      const origText = triggerBtn.innerHTML;
      triggerBtn.disabled = true;
      triggerBtn.innerHTML = '<span>⏳</span> <span>AI Düzenliyor...</span>';

      try {
        const res = await api('/api/admin/ai-polish', {
          method: 'POST',
          body: {
            name: name,
            category: cat,
            rawText: textToPolish,
            description: desc,
            longDescription: long
          }
        });

        if (res && res.data) {
          const d = res.data;
          if (d.name && (!name || name.length < 10 || rawInput)) {
            $('#pm-name', m).value = d.name;
            $('#pm-name', m).classList.add('field-flash-success');
          }
          if (d.description) {
            $('#pm-desc', m).value = d.description;
            $('#pm-desc', m).classList.add('field-flash-success');
          }
          if (Array.isArray(d.highlights) && d.highlights.length) {
            $('#pm-highlights', m).value = d.highlights.join(', ');
            $('#pm-highlights', m).classList.add('field-flash-success');
          }
          if (d.longDescription) {
            $('#pm-long', m).value = d.longDescription;
            $('#pm-long', m).classList.add('field-flash-success');
          }

          setTimeout(() => {
            $$('.field-flash-success', m).forEach(el => el.classList.remove('field-flash-success'));
          }, 1500);

          if (isAiPasteOpen) {
            isAiPasteOpen = false;
            aiPasteZone.style.display = 'none';
            $('#pm-ai-toggle-text', m).textContent = 'Ham Metin Yapıştır';
            if (aiRawText) aiRawText.value = '';
          }

          toast('✨ Toptancı metni başarıyla lüks e-ticaret diline dönüştürüldü!');
        }
      } catch (err) {
        toast(err.message || 'AI metin dönüştürme işlemi başarısız oldu.', true);
      } finally {
        triggerBtn.disabled = false;
        triggerBtn.innerHTML = origText;
      }
    };

    if (aiRunPasteBtn) {
      aiRunPasteBtn.addEventListener('click', () => {
        runAiPolish(aiRawText ? aiRawText.value.trim() : '', aiRunPasteBtn);
      });
    }

    if (aiPolishInlineBtn) {
      aiPolishInlineBtn.addEventListener('click', () => {
        runAiPolish('', aiPolishInlineBtn);
      });
    }

    const drop = $('#pm-drop', m), fileIn = $('#pm-file', m), addPhotoBtn = $('#pm-add-photo-btn', m), grid = $('#pm-gallery-grid', m), countEl = $('#pm-photo-count', m);
    
    addPhotoBtn.addEventListener('click', () => fileIn.click());
    drop.addEventListener('click', () => fileIn.click());
    drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('drag'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('drag');
      if (e.dataTransfer.files && e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    });
    fileIn.addEventListener('change', () => {
      if (fileIn.files && fileIn.files.length) {
        handleFiles(fileIn.files);
        fileIn.value = '';
      }
    });

    async function handleFiles(files) {
      const fileArr = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (!fileArr.length) return toast('Lütfen geçerli resim dosyaları seçin', true);
      
      toast(`${fileArr.length} fotoğraf işleniyor... ⏳`);
      for (const file of fileArr) {
        try {
          const optimizedDataUrl = await optimizeImage(file, 1600, 0.88);
          gallery.push(optimizedDataUrl);
          if (!coverImage) coverImage = optimizedDataUrl;
          renderGallery();
        } catch (err) {
          console.error('Image processing failed:', err);
          toast(`"${file.name}" işlenirken sorun oluştu`, true);
        }
      }
      toast(`Fotoğraflar hazırlandı (${gallery.length} adet) ✨`);
    }

    function renderGallery() {
      if (countEl) countEl.textContent = gallery.length;
      if (!gallery.length) {
        grid.innerHTML = '<div class="muted" style="grid-column:1/-1;text-align:center;padding:16px;font-size:12.5px">Henüz fotoğraf eklenmedi. (Kayıtta varsayılan vektör atanır)</div>';
        return;
      }
      if (!coverImage || !gallery.includes(coverImage)) {
        coverImage = gallery[0];
      }

      grid.innerHTML = gallery.map((img, idx) => {
        const isCover = img === coverImage;
        return `
        <div class="photo-tile ${isCover ? 'is-cover' : ''}">
          <div class="photo-tile-img-wrap">
            <img src="${esc(img)}" alt="Fotoğraf ${idx + 1}">
            ${isCover ? '<span class="photo-tile-cover-badge">👑 Kapak</span>' : ''}
            <button type="button" class="photo-tile-del-btn" data-del-idx="${idx}" title="Bu Fotoğrafı Kaldır">✕</button>
          </div>
          <div class="photo-tile-actions" style="display:flex;flex-direction:column;gap:4px;width:100%">
            ${isCover
              ? '<span class="muted" style="font-size:10.5px;font-weight:600;text-align:center">Ana Görsel</span>'
              : `<button type="button" class="btn btn-ghost btn-sm" data-cover-idx="${idx}" style="font-size:10.5px;padding:2px 7px">⭐ Kapak Yap</button>`
            }
          </div>
        </div>`;
      }).join('');

      // Attach gallery tile event handlers

      $$('[data-del-idx]', grid).forEach((b) => b.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delIdx = parseInt(b.dataset.delIdx, 10);
        const removed = gallery.splice(delIdx, 1)[0];
        if (removed === coverImage) {
          coverImage = gallery[0] || '';
        }
        renderGallery();
        toast('Fotoğraf kaldırıldı');
      }));

      $$('[data-cover-idx]', grid).forEach((b) => b.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const covIdx = parseInt(b.dataset.coverIdx, 10);
        coverImage = gallery[covIdx];
        renderGallery();
        toast('Kapak fotoğrafı güncellendi ⭐');
      }));
    }

    renderGallery();

    const saveBtn = $('#pm-save', m);
    saveBtn.addEventListener('click', async () => {
      const catSlug = $('#pm-cat', m).value;
      const catObj = cats.find((c) => c.slug === catSlug);
      const name = $('#pm-name', m).value.trim();
      const price = Number($('#pm-price', m).value);

      if (!name) return toast('Ürün adı zorunludur', true);
      if (!price || price <= 0) return toast('Geçerli bir fiyat belirleyin', true);

      // Ensure cover photo is at the beginning of the gallery array
      if (coverImage) {
        const remaining = gallery.filter((img) => img !== coverImage);
        gallery = [coverImage, ...remaining];
      }

      const body = {
        name,
        category: catSlug, categoryName: catObj ? catObj.name : catSlug,
        price,
        oldPrice: $('#pm-old', m).value === '' ? null : Number($('#pm-old', m).value),
        stock: Number($('#pm-stock', m).value),
        description: $('#pm-desc', m).value.trim(),
        highlights: $('#pm-highlights', m).value.split(',').map(s => s.trim()).filter(Boolean),
        longDescription: $('#pm-long', m).value.trim(),
        image: coverImage || gallery[0] || '',
        gallery: gallery.length ? gallery : undefined,
        images: gallery.length ? gallery : undefined,
        featured: $('#pm-featured', m).checked, isNew: $('#pm-new', m).checked, bestSeller: $('#pm-best', m).checked
      };

      const originalBtnText = saveBtn.innerHTML;
      saveBtn.disabled = true;
      saveBtn.innerHTML = 'Kaydediliyor... ⏳';

      try {
        if (isEdit) await api('/api/admin/products/' + p.id, { method: 'POST', body });
        else await api('/api/admin/products', { method: 'POST', body });
        toast(isEdit ? 'Ürün başarıyla güncellendi' : 'Yeni ürün kataloğa eklendi');
        closeModal();
        viewProducts();
      } catch (e) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnText;
        toast(e.message || 'Ürün kaydedilirken hata oluştu', true);
      }
    });
  }

  /* ================= CATEGORIES ================= */
  async function viewCategories() {
    mount('categories', `
    <div class="toolbar">
      <div>
        <div style="font-weight:700;font-size:14px">Ana Sayfa Vitrini (Bento Grid) & Kategori Yönetimi</div>
        <div style="font-size:12.5px" class="muted">Ana sayfa vitrininde 1 adet <b>Büyük Ana Kart</b> ve 3 adet <b>Küçük Yan Kart</b> bulunur. Hangi kategorinin hangi kutuda duracağını doğrudan seçebilirsiniz.</div>
      </div>
      <button class="btn btn-primary" id="cat-add" style="margin-left:auto">＋ Yeni Kategori Ekle</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px" id="cat-grid"></div>`);
    let list = [];
    try { list = await fetchCategories(true); } catch (e) { return toast(e.message, true); }

    const slotNames = {
      1: '👑 1. Slot: BÜYÜK SOL KART (Ana Vitrin)',
      2: '🔹 2. Slot: Sağ Üst Kart',
      3: '🔹 3. Slot: Sağ Orta Kart',
      4: '🔹 4. Slot: Sağ Alt Kart'
    };

    $('#cat-grid').innerHTML = list.length ? list.map((c) => `
    <div class="panel" style="margin-bottom:0;overflow:hidden;border:${c.featuredOnHome ? (c.homeOrder === 1 ? '2px solid var(--rose)' : '1.5px solid #8b5cf6') : '1px solid var(--line)'}">
      <div style="aspect-ratio:16/10;background:var(--card-2);overflow:hidden;position:relative">
        ${c.image ? `<img src="${esc(c.image)}" style="width:100%;height:100%;object-fit:cover">` : '<div class="empty">Kapak Görseli Yok</div>'}
        ${c.featuredOnHome ? `<div style="position:absolute;top:8px;left:8px;background:${c.homeOrder === 1 ? 'var(--rose)' : '#7c3aed'};color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;box-shadow:0 2px 8px rgba(0,0,0,0.35)">${slotNames[c.homeOrder] || ('Slot #' + c.homeOrder)}</div>` : ''}
      </div>
      <div class="panel-body" style="padding:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <b style="font-size:15px">${esc(c.name)}</b>
          <span class="muted" style="font-size:11.5px">${c.count} ürün</span>
        </div>
        <div class="muted" style="font-size:12px;margin-bottom:12px">/${esc(c.slug)}</div>
        
        <div style="background:var(--card-2);padding:8px 10px;border-radius:8px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:8px">
          <span style="font-size:12px;font-weight:600">Vitrin Konumu:</span>
          <select class="cat-slot-select" data-slot-id="${c.id}" style="font-size:12px;padding:4px 8px;border-radius:6px;border:1px solid var(--line);background:var(--card);color:var(--text);font-weight:600">
            <option value="0" ${!c.featuredOnHome ? 'selected' : ''}>❌ Ana Sayfada Gösterme</option>
            <option value="1" ${c.featuredOnHome && c.homeOrder === 1 ? 'selected' : ''}>🌟 BÜYÜK SOL KART (1. Sıra)</option>
            <option value="2" ${c.featuredOnHome && c.homeOrder === 2 ? 'selected' : ''}>▫️ Küçük Yan Kart 1 (2. Sıra)</option>
            <option value="3" ${c.featuredOnHome && c.homeOrder === 3 ? 'selected' : ''}>▫️ Küçük Yan Kart 2 (3. Sıra)</option>
            <option value="4" ${c.featuredOnHome && c.homeOrder === 4 ? 'selected' : ''}>▫️ Küçük Yan Kart 3 (4. Sıra)</option>
          </select>
        </div>

        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn btn-ghost btn-sm" data-edit="${c.id}">✏️ Düzenle</button>
          <button class="btn-icon danger" data-del="${c.id}" title="Sil" style="margin-left:auto">🗑️</button>
        </div>
      </div>
    </div>`).join('') : '<div class="panel"><div class="empty"><div class="big">🗂️</div>Henüz kategori tanımlanmadı</div></div>';

    $('#cat-add').addEventListener('click', () => openCategoryModal(null));
    $$('[data-edit]', $('#cat-grid')).forEach((b) => b.addEventListener('click', () => openCategoryModal(list.find((c) => c.id === b.dataset.edit))));
    $$('.cat-slot-select', $('#cat-grid')).forEach((sel) => sel.addEventListener('change', async () => {
      const catId = sel.dataset.slotId;
      const val = parseInt(sel.value, 10);
      const featuredOnHome = val > 0;
      const homeOrder = val > 0 ? val : 99;
      try {
        await api('/api/admin/categories/' + catId, {
          method: 'POST',
          body: { featuredOnHome, homeOrder }
        });
        toast(val === 1 ? 'Kategori BÜYÜK SOL KART olarak vitrine yerleştirildi! 🌟' : (val > 0 ? `Kategori Küçük Yan Kart #${val - 1} olarak ayarlandı.` : 'Kategori ana sayfa vitrininden kaldırıldı.'));
        invalidateCategories();
        await viewCategories();
      } catch (e) {
        toast(e.message, true);
      }
    }));
    $$('[data-del]', $('#cat-grid')).forEach((b) => b.addEventListener('click', () => {
      const c = list.find((x) => x.id === b.dataset.del);
      confirmDialog(`"${c.name}" kategorisini silmek istiyor musunuz?`, async () => {
        try {
          await api('/api/admin/categories/' + c.id, { method: 'DELETE' });
          toast('Kategori silindi');
          invalidateCategories();
          await viewCategories();
        } catch (e) { toast(e.message, true); }
      });
    }));
  }

  async function openCategoryModal(cat) {
    const isEdit = !!cat;
    const v = cat || { name: '', slug: '', image: '', featuredOnHome: false, homeOrder: 2 };
    const m = document.createElement('div');
    m.className = 'modal-back open';
    m.innerHTML = `<div class="modal" style="max-width:540px">
      <div class="modal-head">
        <h3>${isEdit ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}</h3>
        <button type="button" class="modal-close" aria-label="Kapat">✕</button>
      </div>
      <div class="modal-body">
        <div class="field"><label>Kategori Adı *</label><input id="ct-name" value="${esc(v.name)}"></div>
        ${isEdit ? '' : '<div class="field"><label>URL Slug (boş bırakılırsa otomatik)</label><input id="ct-slug" placeholder="örn: ciftler"><div class="hint">Filtreleme linklerinde kullanılır</div></div>'}
        <div class="field"><label>Kapak Fotoğrafı</label>
          <input type="file" id="ct-file" accept="image/*" style="display:none">
          <div class="img-drop" id="ct-drop">📤 Fotoğraf seç veya sürükle-bırak (max 2MB)<div class="hint">Boş bırakılırsa ilk ürünün görseli kullanılır</div></div>
          <div class="img-preview" id="ct-prev">${v.image ? `<img src="${esc(v.image)}">` : ''}</div>
          <input type="hidden" id="ct-image" value="${esc(v.image || '')}">
        </div>
        ${isEdit ? '<label class="checkbox-row" style="margin-top:10px"><input type="checkbox" id="ct-auto"> Bu kategorideki ilk ürünün görselini kapak yap</label>' : ''}
        
        <div class="field" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line)">
          <label style="font-weight:700;font-size:13.5px">✨ Ana Sayfa Vitrin Konumu (Bento Grid)</label>
          <select id="ct-grid-pos" style="width:100%;margin-top:4px;padding:8px 12px;font-size:13px;font-weight:600">
            <option value="0" ${!v.featuredOnHome ? 'selected' : ''}>❌ Ana Sayfa Vitrininde Gösterme</option>
            <option value="1" ${v.featuredOnHome && v.homeOrder === 1 ? 'selected' : ''}>🌟 BÜYÜK SOL KART (Ana Vitrin - 1. Sıra)</option>
            <option value="2" ${v.featuredOnHome && v.homeOrder === 2 ? 'selected' : ''}>▫️ KÜÇÜK YAN KART 1 (2. Sıra)</option>
            <option value="3" ${v.featuredOnHome && v.homeOrder === 3 ? 'selected' : ''}>▫️ KÜÇÜK YAN KART 2 (3. Sıra)</option>
            <option value="4" ${v.featuredOnHome && v.homeOrder === 4 ? 'selected' : ''}>▫️ KÜÇÜK YAN KART 3 (4. Sıra)</option>
          </select>
          <div class="hint">Büyük Sol Kart ana vitrin kutusudur. Diğerleri sağ taraftaki 3 küçük kutudur.</div>
        </div>
      </div>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" id="ct-cancel" data-cancel="true">Vazgeç</button>
        <button type="button" class="btn btn-primary" id="ct-save">${isEdit ? 'Değişiklikleri Kaydet' : 'Kategoriyi Oluştur'}</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    
    const closeModal = () => {
      window.removeEventListener('keydown', handleKey);
      m.remove();
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKey);

    $$('.modal-close, [data-cancel]', m).forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }));
    m.addEventListener('click', (e) => { if (e.target === m) closeModal(); });

    const drop = $('#ct-drop', m), fileIn = $('#ct-file', m), prev = $('#ct-prev', m), hidden = $('#ct-image', m);
    drop.addEventListener('click', () => fileIn.click());
    drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('drag'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
    drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('drag'); if (e.dataTransfer.files[0]) readImg(e.dataTransfer.files[0]); });
    fileIn.addEventListener('change', () => { if (fileIn.files[0]) readImg(fileIn.files[0]); });
    async function readImg(file) {
      if (!file) return;
      try {
        toast('Kapak görseli işleniyor... ⏳');
        const optimized = await optimizeImage(file, 1600, 0.88);
        hidden.value = optimized;
        prev.innerHTML = `<img src="${optimized}">`;
        toast('Kapak görseli hazırlandı');
      } catch (err) {
        toast('Görsel yüklenirken hata oluştu', true);
      }
    }

    const catSaveBtn = $('#ct-save', m);
    catSaveBtn.addEventListener('click', async () => {
      const name = $('#ct-name', m).value.trim();
      if (!name) return toast('Kategori adı zorunludur', true);
      const autoCb = isEdit ? $('#ct-auto', m) : null;
      const posVal = parseInt($('#ct-grid-pos', m).value, 10);
      const featuredOnHome = posVal > 0;
      const homeOrder = posVal > 0 ? posVal : 99;
      const body = {
        name,
        image: hidden.value,
        slug: isEdit ? undefined : ($('#ct-slug', m).value || undefined),
        useAutoCover: autoCb ? autoCb.checked : undefined,
        featuredOnHome,
        homeOrder
      };
      const origText = catSaveBtn.innerHTML;
      catSaveBtn.disabled = true;
      catSaveBtn.innerHTML = 'Kaydediliyor... ⏳';
      try {
        if (isEdit) await api('/api/admin/categories/' + cat.id, { method: 'POST', body });
        else await api('/api/admin/categories', { method: 'POST', body });
        toast(isEdit ? 'Kategori güncellendi' : 'Yeni kategori eklendi');
        closeModal();
        invalidateCategories();
        await viewCategories();
      } catch (e) {
        catSaveBtn.disabled = false;
        catSaveBtn.innerHTML = origText;
        toast(e.message || 'Hata oluştu', true);
      }
    });
  }

  /* ================= REVIEWS ================= */
  async function viewReviews() {
    mount('reviews', '<div class="panel"><div class="panel-body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Ürün</th><th>Yazan Müşteri</th><th>Puan</th><th>Yorum İçeriği</th><th>Durum</th><th>İşlem</th></tr></thead><tbody id="rev-body"></tbody></table></div></div></div>');
    let list = [];
    try { list = (await api('/api/admin/reviews')).reviews; } catch (e) { return toast(e.message, true); }
    const prods = (await api('/api/admin/products')).products;
    const pname = (id) => { const p = prods.find((x) => x.id === id); return p ? p.name : '—'; };
    
    $('#rev-body').innerHTML = list.length ? list.map((r) => `
    <tr>
      <td><b>${esc(pname(r.productId))}</b></td>
      <td><span class="${privacyMode ? 'privacy-masked' : ''}">${esc(r.userName)}</span><div class="muted" style="font-size:11px">${dShort(r.createdAt)}</div></td>
      <td style="color:var(--gold);font-size:15px">${'★'.repeat(r.rating)}</td>
      <td style="max-width:340px;line-height:1.5">${esc(r.text)}</td>
      <td>${r.approved ? '<span class="pill s-active">Onaylı</span>' : '<span class="pill s-processing">Onay Bekliyor</span>'}</td>
      <td style="white-space:nowrap">
        ${r.approved ? '' : `<button class="btn btn-primary btn-sm" data-app="${r.id}">Yayınla</button>`}
        <button class="btn-icon danger" data-del="${r.id}" title="Yorumu Sil">🗑️</button>
      </td>
    </tr>`).join('') : '<tr><td colspan="6"><div class="empty"><div class="big">⭐</div>Henüz değerlendirme yok</div></td></tr>';

    $$('[data-app]').forEach((b) => b.addEventListener('click', async () => {
      try { await api('/api/admin/reviews/' + b.dataset.app + '/approve', { method: 'POST' }); toast('Yorum onaylandı ve puan güncellendi'); viewReviews(); }
      catch (e) { toast(e.message, true); }
    }));
    $$('[data-del]').forEach((b) => b.addEventListener('click', () => {
      confirmDialog('Bu yorum silinsin mi?', async () => {
        try { await api('/api/admin/reviews/' + b.dataset.del, { method: 'DELETE' }); toast('Yorum silindi'); viewReviews(); }
        catch (e) { toast(e.message, true); }
      });
    }));
  }

  /* ================= COUPONS ================= */
  async function viewCoupons() {
    mount('coupons', `
    <div class="panel">
      <div class="panel-head"><h2>Yeni Kupon & Kampanya Tanımla</h2></div>
      <div class="panel-body">
        <div class="grid-3" style="align-items:end">
          <div class="field"><label>Kupon Kodu</label><input id="cp-code" placeholder="ÖRN: LOVE2026" style="text-transform:uppercase;font-weight:700"></div>
          <div class="field"><label>İndirim Türü</label><select id="cp-type"><option value="percent">Yüzdelik Oran (%)</option><option value="fixed">Sabit Tutar (₺)</option></select></div>
          <div class="field"><label>İndirim Değeri</label><input id="cp-val" type="number" min="0" placeholder="Örn: 15"></div>
        </div>
        <div class="grid-3" style="align-items:end">
          <div class="field"><label>Minimum Sepet Tutarı (₺)</label><input id="cp-min" type="number" min="0" value="0"></div>
          <div class="field"><label>Kullanım Limiti (0 = Sınırsız)</label><input id="cp-max" type="number" min="0" value="0"></div>
          <div style="padding-bottom:16px"><label class="checkbox-row"><input type="checkbox" id="cp-active" checked> Hemen aktif et</label></div>
          <div style="padding-bottom:16px"><button class="btn btn-primary" id="cp-add" style="width:100%">＋ Kuponu Kaydet</button></div>
        </div>
      </div>
    </div>
    <div class="panel"><div class="panel-body flush">
      <div class="tbl-wrap">
        <table class="tbl"><thead><tr><th>Kupon Kodu</th><th>İndirim Türü</th><th>Değer</th><th>Min. Sepet</th><th>Kullanım</th><th>Limit</th><th>Durum</th><th>İşlem</th></tr></thead><tbody id="cp-body"></tbody></table>
      </div>
    </div></div>`);

    let list = [];
    async function load() {
      try { list = (await api('/api/admin/coupons')).coupons; } catch (e) { return toast(e.message, true); }
      $('#cp-body').innerHTML = list.length ? list.map((c) => `
      <tr>
        <td class="mono" style="font-size:13.5px;font-weight:700;letter-spacing:1px">${esc(c.code)}</td>
        <td>${c.type === 'percent' ? 'Yüzdelik' : 'Sabit Tutar'}</td>
        <td><b>${c.type === 'percent' ? '%' + c.value : fmt(c.value)}</b></td>
        <td>${c.minTotal ? fmt(c.minTotal) : 'Alt limitsiz'}</td>
        <td>${c.used} defa</td>
        <td>${c.maxUses > 0 ? c.maxUses : 'Sınırsız'}</td>
        <td>${c.active ? '<span class="pill s-active">Aktif</span>' : '<span class="pill s-passive">Pasif</span>'}</td>
        <td style="white-space:nowrap">
          <button class="btn-icon" data-tog="${c.id}" title="${c.active ? 'Pasifleştir' : 'Aktifleştir'}">${c.active ? '⏸️' : '▶️'}</button>
          <button class="btn-icon danger" data-del="${c.id}" title="Sil">🗑️</button>
        </td>
      </tr>`).join('') : '<tr><td colspan="7"><div class="empty">Henüz kupon tanımlanmadı</div></td></tr>';

      $$('[data-tog]').forEach((b) => b.addEventListener('click', async () => {
        const c = list.find((x) => x.id === b.dataset.tog);
        try { await api('/api/admin/coupons/' + c.id, { method: 'POST', body: { active: !c.active } }); toast(c.active ? 'Kupon duraklatıldı' : 'Kupon aktifleştirildi'); load(); }
        catch (e) { toast(e.message, true); }
      }));
      $$('[data-del]').forEach((b) => b.addEventListener('click', () => {
        confirmDialog('Kuponu silmek istediğinize emin misiniz?', async () => {
          try { await api('/api/admin/coupons/' + b.dataset.del, { method: 'DELETE' }); toast('Kupon silindi'); load(); }
          catch (e) { toast(e.message, true); }
        });
      }));
    }

    $('#cp-add').addEventListener('click', async () => {
      const body = { code: $('#cp-code').value.trim(), type: $('#cp-type').value, value: Number($('#cp-val').value), minTotal: Number($('#cp-min').value), active: $('#cp-active').checked };
      if (!body.code || body.code.length < 3) return toast('Geçerli bir kupon kodu girin (en az 3 karakter)', true);
      if (!body.value || body.value <= 0) return toast('İndirim değeri sıfırdan büyük olmalıdır', true);
      try { await api('/api/admin/coupons', { method: 'POST', body }); toast('Kupon başarıyla eklendi 🎉'); $('#cp-code').value = ''; $('#cp-val').value = ''; load(); }
      catch (e) { toast(e.message, true); }
    });
    load();
  }

  /* ================= USERS ================= */
  async function viewUsers() {
    mount('users', '<div class="panel"><div class="panel-body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kullanıcı Adı</th><th>E-posta</th><th>Sistem Rolü</th><th>Sipariş Sayısı</th><th>Kayıt Tarihi</th><th>İşlem</th></tr></thead><tbody id="usr-body"></tbody></table></div></div></div>');
    let list = [];
    try { list = (await api('/api/admin/users')).users; } catch (e) { return toast(e.message, true); }
    $('#usr-body').innerHTML = list.map((u) => `
    <tr>
      <td><b class="${privacyMode ? 'privacy-masked' : ''}">${esc(u.name)}</b></td>
      <td class="${privacyMode ? 'privacy-masked' : ''}">${esc(u.email)}</td>
      <td>${u.role === 'admin' ? '<span class="pill s-shipped">👑 Yönetici (Admin)</span>' : '<span class="pill s-passive">Müşteri</span>'}</td>
      <td><b>${u.orders}</b> sipariş</td>
      <td class="muted" style="font-size:12px">${new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
      <td style="white-space:nowrap">
        ${u.role === 'admin' ? '' : `<button class="btn btn-ghost btn-sm" data-role="${u.id}">Admin Yetkisi Ver</button>
        <button class="btn-icon danger" data-del="${u.id}" title="Kullanıcıyı Sil">🗑️</button>`}
      </td>
    </tr>`).join('');

    $$('[data-role]').forEach((b) => b.addEventListener('click', async () => {
      try { await api('/api/admin/users/' + b.dataset.role, { method: 'POST', body: { role: 'admin' } }); toast('Yönetici yetkisi atandı'); viewUsers(); }
      catch (e) { toast(e.message, true); }
    }));
    $$('[data-del]').forEach((b) => b.addEventListener('click', () => {
      confirmDialog('Kullanıcı hesabı silinsin mi?', async () => {
        try { await api('/api/admin/users/' + b.dataset.del, { method: 'DELETE' }); toast('Kullanıcı silindi'); viewUsers(); }
        catch (e) { toast(e.message, true); }
      });
    }));
  }

  /* ================= MESSAGES ================= */
  async function viewMessages() {
    mount('messages', '<div class="panel"><div class="panel-body" id="msg-body"><div class="loading">Mesajlar yükleniyor…</div></div></div>');
    let list = [];
    try { list = (await api('/api/admin/messages')).messages; } catch (e) { return toast(e.message, true); }
    $('#msg-body').innerHTML = list.length ? list.map((m) => `
    <div style="border:1px solid var(--line);border-radius:var(--r-sm);padding:20px;margin-bottom:14px;background:var(--card-2)">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">
        <b class="${privacyMode ? 'privacy-masked' : ''}">${esc(m.name)} · <span style="color:var(--rose)">${esc(m.email)}</span></b>
        <span class="muted" style="font-size:12px">${dShort(m.createdAt)}</span></div>
        <button class="btn btn-sm btn-ghost del-msg" data-id="${m.id || ''}" style="color:var(--danger)">Sil</button>
      </div>
      <div style="line-height:1.6;color:var(--text-2)">${esc(m.message)}</div>
      <div style="margin-top:12px">
        <a href="mailto:${esc(m.email)}?subject=Love%20Shop%20Yan%C4%B1t" class="btn btn-ghost btn-sm">✉️ E-posta ile Yanıtla</a>
      </div>
    </div>`).join('') : '<div class="empty"><div class="big">💌</div>Gelen kutusunda yeni mesaj yok</div>';

    $$('.del-msg').forEach((btn) => btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id') || e.currentTarget.dataset.id;
      if (!id || !confirm('Mesaj silinsin mi?')) return;
      try {
        await api('/api/admin/messages/' + id, { method: 'DELETE' });
        toast('Mesaj silindi');
        viewMessages();
      } catch (err) { toast(err.message, true); }
    }));
  }

  /* ================= SETTINGS ================= */
  async function viewSettings() {
    mount('settings', '<div class="loading" style="text-align:center;padding:50px">Ayarlar getiriliyor…</div>');
    let s;
    try { s = (await api('/api/admin/settings')).settings; } catch (e) { return toast(e.message, true); }

    mount('settings', `
    <div class="settings-container">
      
      <!-- Card 1: Mağaza Kimliği & Duyuru Bandı -->
      <div class="settings-card">
        <div class="settings-card-head">
          <div class="settings-card-icon">🏬</div>
          <div>
            <div class="settings-card-title">Mağaza Kimliği & Canlı Duyuru Bandı</div>
            <div class="settings-card-sub">Marka ünvanı, üst duyuru metni ve sosyal medya bağlantıları</div>
          </div>
        </div>
        <div class="settings-card-body">
          <div class="grid-2">
            <div class="field">
              <label>Mağaza Ünvanı *</label>
              <input id="st-name" value="${esc(s.storeName)}" placeholder="Örn: Love. Sex Shop">
              <div class="settings-hint">Ana sayfa, üst başlıklar ve fatura belgelerinde görünür.</div>
            </div>
            <div class="field">
              <label>Instagram Kullanıcı Adı</label>
              <input id="st-insta" value="${esc(s.instagram || '@loveshop.tr')}" placeholder="Örn: @loveshop.tr">
              <div class="settings-hint">Alt bilgi ve iletişim alanlarında sergilenir.</div>
            </div>
          </div>
          <div class="field" style="margin-bottom:0">
            <label>Üst Duyuru Bandı Metni (Canlı Önizleme)</label>
            <input id="st-announce" value="${esc(s.announcement)}" placeholder="Örn: WHATSAPP SİPARİŞ + GİZLİ PAKETLEME GARANTİSİ">
            <div class="announce-preview-box">
              <span>📢 CANLI DUYURU:</span>
              <span id="st-announce-preview">${esc(s.announcement)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Kargo & Fiyatlandırma Operasyonu -->
      <div class="settings-card">
        <div class="settings-card-head">
          <div class="settings-card-icon">🚚</div>
          <div>
            <div class="settings-card-title">Kargo, Fiyatlandırma & KDV Operasyonu</div>
            <div class="settings-card-sub">Sepet limitleri, kargo ücretleri ve yasal KDV oranları</div>
          </div>
        </div>
        <div class="settings-card-body">
          <div class="grid-3">
            <div class="field">
              <label>Ücretsiz Kargo Limiti (₺)</label>
              <input id="st-free" type="number" min="0" value="${esc(s.freeShippingThreshold)}">
              <div class="settings-hint">Bu tutarın üzerindeki sepetlerde kargo otomatik 0 ₺ olur.</div>
            </div>
            <div class="field">
              <label>Sabit Kargo Ücreti (₺)</label>
              <input id="st-ship" type="number" step="0.01" min="0" value="${esc(s.shippingFee)}">
              <div class="settings-hint">Limitin altındaki standart kargo bedeli.</div>
            </div>
            <div class="field">
              <label>Yasal KDV Oranı (%)</label>
              <input id="st-kdv" type="number" min="0" max="100" value="${esc(s.kdvRate)}">
              <div class="settings-hint">Fatura ve sistem içi tutar hesaplamaları.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Müşteri İletişim Kanalları -->
      <div class="settings-card">
        <div class="settings-card-head">
          <div class="settings-card-icon">📞</div>
          <div>
            <div class="settings-card-title">İletişim & Müşteri Destek Kanalları</div>
            <div class="settings-card-sub">E-posta, doğrudan telefon ve WhatsApp sipariş hatları</div>
          </div>
        </div>
        <div class="settings-card-body">
          <div class="grid-3">
            <div class="field">
              <label>Destek E-posta Adresi</label>
              <input id="st-mail" type="email" value="${esc(s.supportEmail)}">
              <div class="settings-hint">Sipariş onayları ve bildirim e-postaları.</div>
            </div>
            <div class="field">
              <label>İletişim Telefon Numarası</label>
              <input id="st-phone" value="${esc(s.supportPhone)}">
              <div class="settings-hint">Müşteri hizmetleri iletişim hattı.</div>
            </div>
            <div class="field">
              <label>WhatsApp Destek Bağlantısı</label>
              <input id="st-wa" value="${esc(s.whatsapp || '')}">
              <div class="settings-hint">Örn: https://wa.me/905436331325</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 4: Mağaza Adresi & Konum -->
      <div class="settings-card">
        <div class="settings-card-head">
          <div class="settings-card-icon">📍</div>
          <div>
            <div class="settings-card-title">Fiziksel Mağaza Adresi & Konum Bilgisi</div>
            <div class="settings-card-sub">Müşterilerin harita ve iletişim sayfasında göreceği açık adres</div>
          </div>
        </div>
        <div class="settings-card-body">
          <div class="grid-2">
            <div class="field">
              <label>Fiziksel Mağaza Açık Adresi</label>
              <input id="st-addr" value="${esc(s.address || '')}">
              <div class="settings-hint">İletişim sayfasında yer alacak adres detayları.</div>
            </div>
            <div class="field">
              <label>Google Haritalar Arama Terimi</label>
              <input id="st-maps" value="${esc(s.mapsQuery || '')}">
              <div class="settings-hint">Google Maps linki için arama metni.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 5: Admin Şifre Değiştirme -->
      <div class="settings-card">
        <div class="settings-card-head">
          <div class="settings-card-icon">🔑</div>
          <div>
            <div class="settings-card-title">Yönetici Şifresi & Hesabı Güvenliği</div>
            <div class="settings-card-sub">Giriş yaptığınız yönetici hesabınızın şifresini değiştirin</div>
          </div>
        </div>
        <div class="settings-card-body">
          <div class="grid-2">
            <div class="field">
              <label>Yeni Yönetici Şifresi *</label>
              <input id="st-pass" type="password" placeholder="En az 6 karakter">
              <div class="settings-hint">Güvenli ve karmaşık bir şifre seçmeniz önerilir.</div>
            </div>
            <div class="field">
              <label>Yeni Şifre (Tekrar) *</label>
              <input id="st-pass2" type="password" placeholder="Şifrenizi doğrulayın">
              <div class="settings-hint">Yeni şifrenizi birebir aynı şekilde girin.</div>
            </div>
          </div>
          <button class="btn btn-ghost" id="st-pass-btn" style="margin-top:10px;border-color:var(--line-strong)">🔒 Yönetici Şifresini Güncelle</button>
        </div>
      </div>

      <!-- Sticky Save Action Bar -->
      <div class="settings-action-bar">
        <div>
          <div style="font-weight:700;font-size:14px;color:var(--text)">Sistem & Operasyon Yapılandırması</div>
          <div style="font-size:12px;color:var(--muted)">Değişikliklerin canlı mağazada etkinleşmesi için kaydedin</div>
        </div>
        <button class="btn btn-primary" id="st-save" style="padding:11px 24px;font-size:14px">💾 Tüm Ayarları Güncelle ve Yayınla</button>
      </div>

    </div>`);

    const announceInput = $('#st-announce');
    const announcePreview = $('#st-announce-preview');
    if (announceInput && announcePreview) {
      announceInput.addEventListener('input', () => {
        announcePreview.textContent = announceInput.value || 'GİRİLEN DUYURU METNİ...';
      });
    }

    $('#st-pass-btn').addEventListener('click', async () => {
      const p1 = $('#st-pass').value;
      const p2 = $('#st-pass2').value;
      if (!p1 || p1.length < 6) return toast('Şifre en az 6 karakter olmalıdır', true);
      if (p1 !== p2) return toast('Girdiğiniz şifreler eşleşmiyor', true);
      const btn = $('#st-pass-btn');
      const origText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Güncelleniyor... ⏳';
      try {
        const res = await api('/api/admin/change-password', { method: 'POST', body: { password: p1 } });
        toast(res.message || 'Yönetici şifreniz güncellendi 🔑');
        $('#st-pass').value = '';
        $('#st-pass2').value = '';
      } catch (e) {
        toast(e.message, true);
      } finally {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
    });

    $('#st-save').addEventListener('click', async () => {
      const btn = $('#st-save');
      const origText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Kaydediliyor... ⏳';
      try {
        await api('/api/admin/settings', { method: 'POST', body: {
          storeName: $('#st-name').value, announcement: $('#st-announce').value, instagram: $('#st-insta').value,
          freeShippingThreshold: Number($('#st-free').value), shippingFee: Number($('#st-ship').value), kdvRate: Number($('#st-kdv').value),
          supportEmail: $('#st-mail').value, supportPhone: $('#st-phone').value, whatsapp: $('#st-wa').value,
          address: $('#st-addr').value, mapsQuery: $('#st-maps').value
        } });
        toast('Sistem ayarları başarıyla güncellendi ✅');
      } catch (e) {
        toast(e.message, true);
      } finally {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
    });
  }

  /* ================= ROUTER ================= */
  const VIEWS = { dashboard: viewDashboard, orders: viewOrders, products: viewProducts, categories: viewCategories, reviews: viewReviews, coupons: viewCoupons, users: viewUsers, messages: viewMessages, settings: viewSettings };
  async function route() {
    let sess;
    try { sess = await api('/api/session'); } catch { sess = { user: null }; }
    if (!sess.user || sess.user.role !== 'admin') return loginScreen(sess.user);
    window.__me = sess.user;
    try {
      const st = (await api('/api/admin/stats')).stats;
      window.__badges = { orders: st.pendingOrders || 0, reviews: st.pendingReviews || 0 };
    } catch { window.__badges = {}; }
    const page = (location.hash || '#/dashboard').split('/')[1] || 'dashboard';
    if (!VIEWS[page]) return (location.hash = '#/dashboard');
    VIEWS[page]();
  }
  addEventListener('hashchange', route);
  route();

  let lastPendingOrders = null;
  function playOrderChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.14, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  }

  setInterval(async () => {
    if (!window.__me) return;
    try {
      const res = await api('/api/admin/stats');
      if (!res || !res.stats) return;
      const st = res.stats;
      window.__badges = { orders: st.pendingOrders || 0, reviews: st.pendingReviews || 0 };
      
      if (lastPendingOrders !== null && st.pendingOrders > lastPendingOrders) {
        playOrderChime();
        toast('🛒 CANLI SİPARİŞ ALINDI! Lütfen siparişler sayfasını kontrol edin.', false);
      }
      lastPendingOrders = st.pendingOrders;

      // Update badge in DOM if it exists
      const ordersLink = document.querySelector('a[href="#/orders"]');
      if (ordersLink) {
        const existingBadge = ordersLink.querySelector('.pill');
        if (st.pendingOrders > 0) {
          if (existingBadge) existingBadge.textContent = st.pendingOrders;
          else {
            const badgeEl = document.createElement('span');
            badgeEl.className = 'pill';
            badgeEl.textContent = st.pendingOrders;
            ordersLink.appendChild(badgeEl);
          }
        } else if (existingBadge) {
          existingBadge.remove();
        }
      }
    } catch (e) {}
  }, 8000); // Check every 8 seconds
})();

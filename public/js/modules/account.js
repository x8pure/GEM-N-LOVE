import { api } from './api.js';
import { toast } from './ui.js';
import { performLogout } from './auth.js';

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  /* ================= ACCOUNT & PROFILE DASHBOARD (OPTION 1) ================= */
  async function renderLuxuryDashboard(rootEl, initialTab = 'orders') {
    if (!rootEl) return;
    rootEl.innerHTML = `<div class="spinner" style="grid-column: 1 / -1; margin: 40px auto;"></div>`;

    const s = await api('/api/session').catch(() => ({ user: null }));
    if (!s.user) { location.href = '/giris'; return; }

    const ordersRes = await api('/api/orders/mine').catch(() => ({ orders: [] }));
    const orders = ordersRes.orders || [];

    // Parse URL hash if present
    const hash = (location.hash || '').replace('#', '').toLowerCase();
    let activeTab = initialTab;
    if (['orders', 'siparisler', 'siparis'].includes(hash)) activeTab = 'orders';
    else if (['address', 'adres', 'teslimat'].includes(hash)) activeTab = 'address';
    else if (['profile', 'profil', 'bilgiler'].includes(hash)) activeTab = 'profile';
    else if (['security', 'guvenlik', 'sifre'].includes(hash)) activeTab = 'security';

    // User initials
    const nameParts = (s.user.name || 'U').trim().split(/\s+/);
    const initials = nameParts.length > 1
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : (nameParts[0].slice(0, 2)).toUpperCase();

    const isAdmin = s.user.role === 'admin';
    const roleBadge = isAdmin
      ? `<span class="acc-role-badge admin">👑 ${window.LS.t('acc.role_admin')}</span>`
      : `<span class="acc-role-badge">✨ ${window.LS.t('acc.role_user')}</span>`;

    const a = (s.user.addresses && s.user.addresses[0]) || { label: 'Ev', full: '', city: '', zip: '', phone: '', discreet: true };

    const statusTr = {
      processing: window.LS.t('st.processing'),
      shipped: window.LS.t('st.shipped'),
      delivered: window.LS.t('st.delivered'),
      cancelled: window.LS.t('st.cancelled')
    };

    rootEl.innerHTML = `
      <!-- LEFT SIDEBAR -->
      <aside class="acc-sidebar">
        <div class="acc-user-card">
          <div class="acc-avatar">${window.LS.esc(initials)}</div>
          <div class="acc-user-name">${window.LS.esc(s.user.name)}</div>
          <div class="acc-user-email">${window.LS.esc(s.user.email)}</div>
          ${roleBadge}
        </div>

        <nav class="acc-nav">
          <button class="acc-nav-btn ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders">
            <span class="nav-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              <span>${window.LS.t('acc.tab.orders')}</span>
            </span>
            <span class="acc-nav-badge">${orders.length}</span>
          </button>

          <button class="acc-nav-btn ${activeTab === 'address' ? 'active' : ''}" data-tab="address">
            <span class="nav-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${window.LS.t('acc.tab.address')}</span>
            </span>
          </button>

          <button class="acc-nav-btn ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
            <span class="nav-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>${window.LS.t('acc.tab.profile')}</span>
            </span>
          </button>

          <button class="acc-nav-btn ${activeTab === 'security' ? 'active' : ''}" data-tab="security">
            <span class="nav-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>${window.LS.t('acc.tab.security')}</span>
            </span>
          </button>

          <div class="acc-nav-divider"></div>

          <button class="acc-nav-btn acc-nav-logout" id="acc-logout-btn">
            <span class="nav-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              <span>${window.LS.t('acc.tab.logout')}</span>
            </span>
          </button>
        </nav>
      </aside>

      <!-- RIGHT MAIN CONTENT -->
      <main class="acc-main">
        <!-- TAB 1: ORDERS -->
        <section class="acc-panel ${activeTab === 'orders' ? 'active' : ''}" id="panel-orders">
          <div class="acc-metrics-strip">
            <div class="acc-metric-card">
              <div class="acc-metric-icon">📦</div>
              <div class="acc-metric-info">
                <div class="acc-metric-label">${window.LS.t('acc.stat.orders')}</div>
                <div class="acc-metric-value">${orders.length} ${window.LS.t('shop.count', { n: '' }).trim()}</div>
              </div>
            </div>
            <div class="acc-metric-card">
              <div class="acc-metric-icon">🔒</div>
              <div class="acc-metric-info">
                <div class="acc-metric-label">${window.LS.t('acc.stat.privacy')}</div>
                <div class="acc-metric-value">%100 İsimsiz Paket</div>
              </div>
            </div>
            <div class="acc-metric-card">
              <div class="acc-metric-icon">💬</div>
              <div class="acc-metric-info">
                <div class="acc-metric-label">${window.LS.t('acc.stat.support')}</div>
                <div class="acc-metric-value">7/24 WhatsApp</div>
              </div>
            </div>
          </div>

          ${orders.length ? `
            <div class="acc-orders-list">
              ${orders.map((o) => {
                const waText = encodeURIComponent(`Merhaba, ${o.id} numaralı siparişim hakkında bilgi almak istiyorum.`);
                return `
                <article class="acc-order-card">
                  <header class="acc-order-header">
                    <div class="acc-order-meta">
                      <span class="acc-order-id">#${window.LS.esc(o.id)}</span>
                      <span class="acc-order-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        ${window.LS.dateFmt(o.createdAt)}
                      </span>
                    </div>
                    <span class="status-pill st-${window.LS.esc(o.status)}">
                      ${o.status === 'processing' ? '⏳' : o.status === 'shipped' ? '🚚' : o.status === 'delivered' ? '✅' : '✕'}
                      ${window.LS.esc(statusTr[o.status] || o.status)}
                    </span>
                  </header>

                  <div class="acc-order-body">
                    ${(o.items || []).map((i) => `
                      <div class="acc-order-item">
                        <div class="acc-item-left">
                          <img class="acc-item-thumb" src="${window.LS.imgSrc(i.image)}" alt="${window.LS.esc(i.name)}" loading="lazy">
                          <div>
                            <div class="acc-item-title">${window.LS.esc(i.name)}</div>
                            <div class="acc-item-qty">${i.qty} adet × ${window.LS.fmt(i.price)}</div>
                          </div>
                        </div>
                        <div class="acc-item-price">${window.LS.fmt(i.price * i.qty)}</div>
                      </div>
                    `).join('')}
                  </div>

                  <footer class="acc-order-footer">
                    <div class="acc-order-flags">
                      <span class="acc-order-flag">💳 ${window.LS.esc(o.payment || 'WhatsApp')}</span>
                      ${o.discreet ? `<span class="acc-order-flag">🔒 ${window.LS.t('acc.discreet')}</span>` : ''}
                    </div>
                    <div class="acc-order-actions-total">
                      <a class="acc-wa-btn" href="https://wa.me/905436331325?text=${waText}" target="_blank" rel="noopener">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.072-.492-1.758-.727-2.887-2.518-2.975-2.634-.087-.116-.711-.945-.711-1.802 0-.857.449-1.277.608-1.45.16-.174.348-.217.464-.217.116 0 .232.001.333.006.107.005.25.04.39.377.145.348.493 1.202.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.182-.077.355.101.174.449.741.963 1.2 1.077.96 1.543.96 1.761 1.047.218.087.348.072.478-.073.13-.145.565-.652.71-.884.145-.232.29-.188.478-.116.188.072 1.203.565 1.406.667.203.101.339.152.39.239.051.087.051.507-.093.912z"/></svg>
                        <span>${window.LS.t('acc.ask_wa')}</span>
                      </a>
                      <div class="acc-order-total-block">
                        <div class="acc-total-label">${window.LS.t('cart.total')}</div>
                        <div class="acc-total-value">${window.LS.fmt(o.total)}</div>
                      </div>
                    </div>
                  </footer>
                </article>
                `;
              }).join('')}
            </div>
          ` : `
            <div class="acc-card-panel" style="text-align:center; padding: 60px 24px;">
              <div style="font-size: 54px; margin-bottom: 16px;">🛍️</div>
              <h3 style="font-size: 22px; margin-bottom: 8px;">${window.LS.t('acc.noorders')}</h3>
              <p class="sub" style="max-width: 460px; margin: 0 auto 24px;">${window.LS.t('acc.noorders.sub')}</p>
              <a class="btn btn-primary" href="/magaza">${window.LS.t('acc.start')} →</a>
            </div>
          `}
        </section>

        <!-- TAB 2: ADDRESS -->
        <section class="acc-panel ${activeTab === 'address' ? 'active' : ''}" id="panel-address">
          <div class="acc-card-panel">
            <h3>📍 ${window.LS.t('pf.title.address')}</h3>
            <p class="sub">${window.LS.t('pf.sub.address')}</p>

            <div class="field">
              <label>${window.LS.t('pf.addr')}</label>
              <textarea id="dash-ad-full" rows="3" placeholder="Mahalle, cadde, sokak, bina ve daire no...">${window.LS.esc(a.full || '')}</textarea>
            </div>

            <div class="grid-3" style="margin-top: 14px;">
              <div class="field">
                <label>${window.LS.t('pf.city')}</label>
                <input id="dash-ad-city" value="${window.LS.esc(a.city || '')}" placeholder="Örn: Eskişehir">
              </div>
              <div class="field">
                <label>${window.LS.t('pf.zip')}</label>
                <input id="dash-ad-zip" value="${window.LS.esc(a.zip || '')}" placeholder="Örn: 26100">
              </div>
              <div class="field">
                <label>${window.LS.t('pf.phone')}</label>
                <input id="dash-ad-phone" value="${window.LS.esc(a.phone || '')}" placeholder="05xx xxx xx xx">
              </div>
            </div>

            <div class="checkbox-row" style="margin: 20px 0 24px;">
              <input type="checkbox" id="dash-ad-discreet" ${a.discreet !== false ? 'checked' : ''}>
              <label for="dash-ad-discreet">${window.LS.t('pf.discreet')}</label>
            </div>

            <button class="btn btn-primary" id="dash-ad-save">
              <span>💾 ${window.LS.t('pf.saveaddr')}</span>
            </button>
          </div>
        </section>

        <!-- TAB 3: PROFILE -->
        <section class="acc-panel ${activeTab === 'profile' ? 'active' : ''}" id="panel-profile">
          <div class="acc-card-panel">
            <h3>👤 ${window.LS.t('pf.title.acc')}</h3>
            <p class="sub">${window.LS.t('pf.sub.acc')}</p>

            <div class="grid-2">
              <div class="field">
                <label>${window.LS.t('pf.name')}</label>
                <input id="dash-pf-name" value="${window.LS.esc(s.user.name || '')}">
              </div>
              <div class="field">
                <label>${window.LS.t('pf.email')} (${window.__LS_LANG__ === 'tr' ? 'Salt-okunur' : 'Read-only'})</label>
                <input value="${window.LS.esc(s.user.email || '')}" disabled style="opacity: 0.6; cursor: not-allowed;">
              </div>
            </div>

            <button class="btn btn-primary" id="dash-pf-save" style="margin-top: 20px;">
              <span>💾 ${window.LS.t('pf.save')}</span>
            </button>
          </div>
        </section>

        <!-- TAB 4: SECURITY -->
        <section class="acc-panel ${activeTab === 'security' ? 'active' : ''}" id="panel-security">
          <div class="acc-card-panel">
            <h3>🔒 ${window.LS.t('pf.title.pass')}</h3>
            <p class="sub">${window.LS.t('pf.sub.pass')}</p>

            <div class="grid-2">
              <div class="field">
                <label>${window.LS.t('pf.new')}</label>
                <input type="password" id="dash-pw-new" placeholder="${window.__LS_LANG__ === 'tr' ? 'En az 6 karakter' : 'Min. 6 characters'}">
              </div>
              <div class="field">
                <label>${window.LS.t('pf.new2')}</label>
                <input type="password" id="dash-pw-new2" placeholder="${window.__LS_LANG__ === 'tr' ? 'Şifrenizi tekrar girin' : 'Confirm new password'}">
              </div>
            </div>

            <button class="btn btn-primary" id="dash-pw-save" style="margin-top: 20px;">
              <span>🔒 ${window.LS.t('pf.update')}</span>
            </button>
          </div>
        </section>
      </main>
    `;

    // Interactive Tab Switching
    const tabBtns = $$('.acc-nav-btn[data-tab]', rootEl);
    const panels = $$('.acc-panel', rootEl);

    const activateTab = (tab) => {
      if (!tab) return;
      let cleanTab = tab.replace(/^#/, '');
      if (['orders', 'siparisler', 'siparis'].includes(cleanTab)) cleanTab = 'orders';
      else if (['address', 'adres', 'adresim'].includes(cleanTab)) cleanTab = 'address';
      else if (['profile', 'profil', 'bilgiler'].includes(cleanTab)) cleanTab = 'profile';
      else if (['security', 'guvenlik', 'sifre'].includes(cleanTab)) cleanTab = 'security';

      tabBtns.forEach((b) => b.classList.toggle('active', b.dataset.tab === cleanTab));
      panels.forEach((p) => p.classList.toggle('active', p.id === `panel-${cleanTab}`));
    };

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        activateTab(tab);
        try {
          history.replaceState(null, '', `#${tab}`);
        } catch {}
      });
    });

    window.addEventListener('hashchange', () => {
      if (location.hash) activateTab(location.hash);
    });

    // Save Address
    $('#dash-ad-save', rootEl)?.addEventListener('click', async () => {
      const btn = $('#dash-ad-save', rootEl);
      try {
        if (btn) btn.disabled = true;
        await api('/api/account/address', {
          method: 'POST',
          body: {
            label: 'Ev',
            full: $('#dash-ad-full', rootEl).value.trim(),
            city: $('#dash-ad-city', rootEl).value.trim(),
            zip: $('#dash-ad-zip', rootEl).value.trim(),
            phone: $('#dash-ad-phone', rootEl).value.trim(),
            discreet: $('#dash-ad-discreet', rootEl).checked
          }
        });
        toast(window.LS.t('pf.addrok'), '📍');
      } catch (err) {
        toast(err.message, '⚠️');
      } finally {
        if (btn) btn.disabled = false;
      }
    });

    // Save Profile
    $('#dash-pf-save', rootEl)?.addEventListener('click', async () => {
      const btn = $('#dash-pf-save', rootEl);
      try {
        if (btn) btn.disabled = true;
        const newName = $('#dash-pf-name', rootEl).value.trim();
        await api('/api/account', {
          method: 'POST',
          body: { name: newName }
        });
        const nameEl = $('.acc-user-name', rootEl);
        if (nameEl) nameEl.textContent = newName;
        toast(window.LS.t('pf.ok'), '✅');
      } catch (err) {
        toast(err.message, '⚠️');
      } finally {
        if (btn) btn.disabled = false;
      }
    });

    // Save Password
    $('#dash-pw-save', rootEl)?.addEventListener('click', async () => {
      const p1 = $('#dash-pw-new', rootEl).value;
      const p2 = $('#dash-pw-new2', rootEl).value;
      if (p1.length < 6) return toast(window.LS.t('auth.pass6'), '⚠️');
      if (p1 !== p2) return toast(window.LS.t('auth.passmismatch'), '⚠️');
      const btn = $('#dash-pw-save', rootEl);
      try {
        if (btn) btn.disabled = true;
        await api('/api/account/password', {
          method: 'POST',
          body: { password: p1 }
        });
        toast(window.LS.t('pf.passok'), '🔒');
        $('#dash-pw-new', rootEl).value = '';
        $('#dash-pw-new2', rootEl).value = '';
      } catch (err) {
        toast(err.message, '⚠️');
      } finally {
        if (btn) btn.disabled = false;
      }
    });

    // Logout
    $('#acc-logout-btn', rootEl)?.addEventListener('click', (e) => {
      e.preventDefault();
      performLogout('/');
    });
  }

  export async function initAccount() {
    const root = $('#account-root');
    if (!root) return;
    await renderLuxuryDashboard(root, 'orders');
  }

  export async function initProfile() {
    const root = $('#profile-root');
    if (!root) return;
    await renderLuxuryDashboard(root, 'profile');
  }

  /* ================= CONTACT ================= */

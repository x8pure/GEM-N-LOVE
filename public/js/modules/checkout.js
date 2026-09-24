import { api } from './api.js';
import { toast } from './ui.js?v=2.2.0';
import { getLocalCart, setLocalCart, updateCartBadge } from './cart.js';

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

export async function initCheckout() {
  const root = $('#checkout-root');
  if (!root) return;
  const local = getLocalCart();
  if (!local || !Array.isArray(local.items) || !local.items.length) {
    location.href = '/sepet';
    return;
  }
  const [c, s] = await Promise.all([
    api('/api/cart/calc', {
      method: 'POST',
      body: { items: local.items, coupon: local.coupon?.code || (typeof local.coupon === 'string' ? local.coupon : undefined) }
    }).catch(() => local),
    api('/api/session').catch(() => ({ user: null }))
  ]);
  if (!c || !c.items || !c.items.length) {
    setLocalCart(null);
    updateCartBadge(0);
    location.href = '/sepet';
    return;
  }
  setLocalCart(c);
  const u = s.user;
  const addr = (u && u.addresses && u.addresses[0]) || null;
  root.innerHTML = `
  <div class="check-layout" style="grid-column:1/-1">
    <div>
      <div class="check-step">
        <h3><span class="step-no">1</span> ${window.LS.t('ck.step1')}</h3>
        <div class="grid-2">
          <div class="field"><label>${window.LS.t('ck.name')}</label><input id="ck-name" value="${u ? u.name : ''}" placeholder="${window.LS.t('ck.name.ph')}"></div>
          <div class="field"><label>${window.LS.t('ck.phone')}</label><input id="ck-phone" value="${addr ? addr.phone || '' : ''}" placeholder="${window.LS.t('ck.phone.ph')}"></div>
        </div>
        <div class="checkbox-row"><input type="checkbox" id="ck-discreet" checked><label for="ck-discreet">${window.LS.t('ck.discreet')}</label></div>
        <div class="checkbox-row" style="margin-top:12px;align-items:flex-start;font-size:12px;line-height:1.4;">
          <input type="checkbox" id="ck-legal-consent" style="margin-top:3px;flex-shrink:0;">
          <label for="ck-legal-consent" style="color:var(--text);cursor:pointer;">
            ${window.LS.lang === 'en'
              ? 'I declare that I am 18 years of age or older; I have read and agree to the <a href="/terms-of-service" target="_blank" rel="noopener" style="text-decoration:underline;color:inherit;">Distance Sales Contract</a> and <a href="/privacy-policy" target="_blank" rel="noopener" style="text-decoration:underline;color:inherit;">Privacy Policy</a>.'
              : '18 yaşını doldurmuş reşit bir birey olduğumu beyan ederim; <a href="/kullanim-kosullari" target="_blank" rel="noopener" style="text-decoration:underline;color:inherit;">Mesafeli Satış Sözleşmesi</a> ve <a href="/gizlilik-politikasi" target="_blank" rel="noopener" style="text-decoration:underline;color:inherit;">Gizlilik & KVKK Aydınlatma Metni</a>\'ni okudum, onaylıyorum.'}
          </label>
        </div>
        <div class="field" style="margin-top:14px"><label>${window.LS.t('ck.note')}</label><input id="ck-note" placeholder="${window.LS.t('ck.note.ph')}"></div>
      </div>
      <div class="check-step">
        <h3><span class="step-no">2</span> ${window.LS.t('ck.step2')}</h3>
        <p class="muted" style="font-size:13px;margin-bottom:14px">${window.LS.t('ck.step2.note')}</p>
        <div class="pay-options">
          <label class="pay-option"><input type="radio" name="pay" value="whatsapp" checked> ${window.LS.t('ck.pay.wa')} <span class="muted" style="margin-left:auto;font-size:12px">${window.LS.t('ck.pay.wa.sub')}</span></label>
          <label class="pay-option"><input type="radio" name="pay" value="shop"> ${window.LS.t('ck.pay.shop')} <span class="muted" style="margin-left:auto;font-size:12px">${window.LS.t('ck.pay.shop.sub')}</span></label>
        </div>
        <div id="addr-block" style="margin-top:16px">
          <div class="field"><label>${window.LS.t('ck.address')}</label><textarea id="ck-address" placeholder="${window.LS.t('ck.address.ph')}">${addr && !addr.full.startsWith('MAĞAZA') ? addr.full : ''}</textarea></div>
          <div class="grid-2">
            <div class="field"><label>${window.LS.t('ck.city')}</label><input id="ck-city" value="${addr && addr.city ? addr.city : 'Eskişehir'}" placeholder="${window.LS.t('ck.city').replace(' *', '')}"></div>
            <div class="field"><label>${window.LS.t('ck.zip')}</label><input id="ck-zip" value="${addr && addr.zip ? addr.zip : '26100'}" placeholder="26000"></div>
          </div>
          <div id="ck-delivery-notice" style="margin-top:10px;padding:10px 14px;border-radius:var(--r-sm,8px);background:rgba(255,255,255,0.03);border:1px solid var(--line);font-size:12.5px;line-height:1.5;color:var(--text);display:flex;align-items:center;gap:10px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span id="ck-delivery-notice-text">Eskişehir İçi Adres: <strong>Ortalama 2 saatte</strong> isimsiz ve gizli özel kurye ile teslim edilir.</span>
          </div>
        </div>
      </div>
    </div>
    <div class="summary">
      <h3>${window.LS.t('ck.summary')}</h3>
      ${c.items.map((i) => `<div class="sum-row"><span>${i.name} ×${i.qty}</span><span>${window.LS.fmt(i.price * i.qty)}</span></div>`).join('')}
      <div class="sum-row"><span>${window.LS.t('ck.shipping')}</span><span id="pay-ship">${c.shipping ? window.LS.fmt(c.shipping) : window.LS.t('ck.free')}</span></div>
      ${c.discount ? `<div class="sum-row" style="color:var(--ok)"><span>${c.coupon ? c.coupon.code : ''}</span><span>-${window.LS.fmt(c.discount)}</span></div>` : ''}
      <div class="sum-row total"><span>${window.LS.t('ck.summary.total')}</span><span id="pay-total">${window.LS.fmt(c.total)}</span></div>
      <button class="btn btn-primary btn-block" id="ck-submit" style="margin-top:18px">${window.LS.t('ck.submit.wa')}</button>
      <p style="font-size:11px;color:var(--muted);margin-top:12px;text-align:center">${window.LS.t('ck.note.small')}</p>
    </div>
  </div>`;
  
  function refreshPay() {
    const m = document.querySelector('input[name=pay]:checked').value;
    $('#addr-block').style.display = m === 'whatsapp' ? '' : 'none';
    $('#pay-ship').textContent = m === 'shop' ? window.LS.t('ck.ship.pickup') : (c.shipping ? window.LS.fmt(c.shipping) : window.LS.t('ck.free'));
    $('#ck-submit').innerHTML = m === 'shop' ? window.LS.t('ck.submit.shop') : window.LS.t('ck.submit.wa');
    updateCityNotice();
  }

  function updateCityNotice() {
    const cityInput = $('#ck-city');
    const noticeEl = $('#ck-delivery-notice');
    const noticeText = $('#ck-delivery-notice-text');
    if (!cityInput || !noticeEl || !noticeText) return;
    const val = cityInput.value.trim().toLowerCase();
    if (val.includes('eskişehir') || val.includes('eskisehir') || !val) {
      noticeText.innerHTML = 'Eskişehir İçi Adres: <strong>Ortalama 2 saatte</strong> isimsiz ve gizli özel kurye ile kapınızda.';
    } else {
      noticeText.innerHTML = 'Türkiye Geneli: <strong>16:30\'a kadar aynı gün</strong> çift mühürlü nötr kutuda kargoda.';
    }
  }

  $$('input[name=pay]').forEach((r) => r.addEventListener('change', refreshPay));
  $('#ck-city')?.addEventListener('input', updateCityNotice);
  refreshPay();
  
  $('#ck-submit').addEventListener('click', async () => {
    const method = document.querySelector('input[name=pay]:checked').value;
    const curLocal = getLocalCart();
    const body = {
      name: $('#ck-name').value.trim(), phone: $('#ck-phone').value.trim(),
      payment: method, note: $('#ck-note').value.trim(),
      discreet: $('#ck-discreet').checked,
      items: (curLocal && Array.isArray(curLocal.items)) ? curLocal.items : [],
      coupon: curLocal?.coupon?.code || (typeof curLocal?.coupon === 'string' ? curLocal.coupon : undefined)
    };
    if (method === 'whatsapp') {
      body.address = $('#ck-address').value.trim();
      body.city = $('#ck-city').value.trim();
      body.zip = $('#ck-zip').value.trim();
    }
    if (!body.name || !body.phone) return toast(window.LS.t('ck.required'), '⚠️');
    if (method === 'whatsapp' && (!body.address || !body.city)) return toast(window.LS.t('ck.addrreq'), '⚠️');
    const legalCheckbox = $('#ck-legal-consent');
    if (legalCheckbox && !legalCheckbox.checked) {
      return toast(
        window.LS.lang === 'en'
          ? 'Please verify that you are at least 18 years old and accept the Distance Sales Contract.'
          : 'Lütfen 18 yaşından büyük olduğunuzu ve Mesafeli Satış Sözleşmesi\'ni onaylayınız.',
        '⚠️'
      );
    }
    body.ageAffirmed = true;
    body.legalConsentTimestamp = new Date().toISOString();
    const btn = $('#ck-submit'); btn.disabled = true; btn.textContent = window.LS.t('ck.preparing');
    try {
      const r = await api('/api/checkout', { method: 'POST', body });
      setLocalCart(null);
      updateCartBadge(0);
      toast(r.pickup ? window.LS.t('ck.ok.pickup') : window.LS.t('ck.ok.ship'), '💖');
      setTimeout(() => { location.href = '/tesekkurler/' + r.orderId; }, r.pickup ? 900 : 1200);
    } catch (e) { btn.disabled = false; refreshPay(); toast(e.message, '⚠️'); }
  });
}

export async function initThanks() {
  const el = $('#thanks-order');
  if (!el) return;
  const id = location.pathname.split('/').pop();
  try {
    const d = await api('/api/orders/' + id);
    el.textContent = d.order.id;
    const t = $('#thanks-total');
    if (t) t.textContent = window.LS.t('thanks.amount') + window.LS.fmt(d.order.total);
  } catch { el.textContent = id; }
}

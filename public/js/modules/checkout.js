import { api } from './api.js';
import { toast } from './ui.js';
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
            <div class="field"><label>${window.LS.t('ck.city')}</label><input id="ck-city" value="${addr && addr.city ? addr.city : ''}" placeholder="${window.LS.t('ck.city').replace(' *', '')}"></div>
            <div class="field"><label>${window.LS.t('ck.zip')}</label><input id="ck-zip" value="${addr && addr.zip ? addr.zip : ''}" placeholder="26000"></div>
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
  }
  $$('input[name=pay]').forEach((r) => r.addEventListener('change', refreshPay));
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

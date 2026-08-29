'use strict';
(() => {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const LANG = window.__LS_LANG__ || 'tr';
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const imgSrc = (s) => {
    if (!s) return '';
    const str = String(s);
    if (str.startsWith('data:') || str.startsWith('http://') || str.startsWith('https://') || str.includes('?')) return str;
    return str + '?v=transparent2';
  };
  const fmt = (n) => new Intl.NumberFormat(LANG === 'en' ? 'en-US' : 'tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
  const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
  const dateFmt = (s) => new Date(s).toLocaleDateString(LANG === 'en' ? 'en-GB' : 'tr-TR');

  const STR = {
    tr: {
      'nav.login': 'Giriş',
      'added': 'Sepete eklendi',
      'badge.new': 'Yeni', 'badge.hot': 'Çok Satan', 'badge.sale': 'İndirim', 'quickadd': 'Sepete Ekle',
      'nl.bad': 'Geçerli bir e-posta girin', 'nl.ok': 'Aramıza hoş geldin! %10 indirim kodun mailinde.',
      'shop.all': 'Tümü', 'shop.count': '{n} ürün', 'shop.empty': 'Aradığın kriterlere uyan ürün bulunamadı.<br>Filtreleri değiştirmeyi dene.',
      'pd.crumb.home': 'Anasayfa', 'pd.crumb.shop': 'Mağaza', 'pd.reviews': 'değerlendirme',
      'pd.notfound': 'Ürün bulunamadı.', 'pd.notfound.btn': 'Mağazaya Dön',
      'pd.add': '🛍️ Sepete Ekle', 'pd.buy': 'Hemen Al',
      'pd.stock.in': 'Stokta, 24 saat içinde kargoda', 'pd.stock.low': 'Son {n} adet — elini çabuk tut!', 'pd.stock.out': 'Tükendi',
      'pd.trust1': '📦 Gizli paketleme — dışarıdan içerik anlaşılmaz', 'pd.trust2': '🚚 750 TL üzeri ücretsiz kargo',
      'pd.trust3': '🔒 Güvenli ve anonim ödeme', 'pd.trust4': '↩️ Hijyen nedeniyle iade yok, hasarlı üründe yenisi gönderilir',
      'pd.tab.detail': 'Detaylar', 'pd.tab.reviews': 'Yorumlar', 'pd.similar': 'Benzer Ürünler', 'pd.all': 'Tümü →',
      'pd.noreviews': 'Bu ürün için henüz onaylanmış yorum yok. İlk yorumu sen yaz!', 'pd.reviewsfail': 'Yorumlar yüklenemedi.', 'pd.write': '✍️ Yorum Yaz',
      'rv.short': 'Lütfen en az 10 karakterlik bir yorum yaz', 'rv.ok': 'Yorumun alındı, onay sonrası yayınlanacak 💜',
      'cart.empty': 'Sepetin şimdilik boş.<br>Keşfetmeye hazır mısın?', 'cart.empty.btn': 'Mağazayı Keşfet',
      'cart.summary': 'Sipariş Özeti', 'cart.freeship.left': '🚚 Ücretsiz kargoya {x} kaldı!', 'cart.freeship.won': '🎉 Ücretsiz kargo hakkı kazandın!',
      'cart.coupon.ph': 'Kupon kodu', 'cart.apply': 'Uygula', 'cart.coupon.is': 'Kupon: {code}', 'cart.coupon.ok': 'Kupon uygulandı',
      'cart.subtotal': 'Ara toplam', 'cart.shipping': 'Kargo', 'cart.free': 'Ücretsiz', 'cart.discount': 'İndirim', 'cart.total': 'Toplam',
      'cart.checkout': 'Ödemeye Geç →', 'cart.continue': 'Alışverişe Devam Et',
      'cart.remove': 'Kaldır', 'cart.remove.confirm': 'Ürün sepetten kaldırılsın mı?', 'cart.per': '/ adet',
      'ck.step1': 'İletişim Bilgilerin', 'ck.name': 'Ad Soyad *', 'ck.name.ph': 'Adınız Soyadınız', 'ck.phone': 'Telefon *', 'ck.phone.ph': '05xx xxx xx xx',
      'ck.discreet': 'Gizli paketleme istiyorum (dış pakette içerik/mağaza adı yer almaz)',
      'ck.note': 'Sipariş Notu (opsiyonel)', 'ck.note.ph': 'Örn: telefonla ulaşabileceğiniz saat',
      'ck.step2': 'Sipariş & Ödeme Şekli',
      'ck.step2.note': 'Online ödeme altyapımız bulunmuyor. Siparişini <b>WhatsApp üzerinden</b> tamamlıyoruz — en gizli ve pratik yol bu. 💜',
      'ck.pay.wa': '💬 WhatsApp ile Sipariş', 'ck.pay.wa.sub': 'sepet özetin medyana hazırlanır',
      'ck.pay.shop': '🏬 Mağazadan Teslim & Ödeme', 'ck.pay.shop.sub': 'Ilgaz İş Hanı · Tepebaşı',
      'ck.address': 'Adres *', 'ck.address.ph': 'Mahalle, cadde, no, daire...', 'ck.city': 'Şehir *', 'ck.zip': 'Posta Kodu',
      'ck.summary': 'Özet', 'ck.shipping': 'Kargo', 'ck.summary.total': 'Toplam',
      'ck.submit.wa': '💬 Siparişi WhatsApp\u2019a Taşı', 'ck.submit.shop': '🏬 Mağazadan Teslim Sipariş Ver',
      'ck.ship.pickup': 'Yok — mağazadan teslim', 'ck.free': 'Ücretsiz',
      'ck.required': 'Ad soyad ve telefon zorunludur', 'ck.addrreq': 'Kargo için adres ve şehir zorunludur', 'ck.preparing': 'Hazırlanıyor…',
      'ck.note.small': '18+ satış politikamız gereği bilgileriniz şifreli iletilir.<br>Ödeme yalnızca WhatsApp üzerinden veya mağazamızda alınır.',
      'ck.ok.pickup': 'Siparişin alındı! Seni mağazada bekliyoruz 🏬', 'ck.ok.ship': 'Siparişin alındı! WhatsApp\u2019a yönlendiriliyorsun 🎉',
      'thanks.amount': 'Tutar: ',
      'auth.hi': 'Hoş geldin, {name}', 'auth.pass6': 'Şifre en az 6 karakter olmalı', 'auth.passmismatch': 'Şifreler eşleşmiyor',
      'auth.age': '18 yaşından büyük olduğunuzu onaylamalısınız', 'auth.created': 'Hesabın oluşturuldu 💜',
      'auth.google.login': 'Google ile Giriş Yap', 'auth.google.reg': 'Google ile Kayıt Ol',
      'auth.google.wait': 'Google bağlantısı kuruluyor…', 'auth.google.ok': 'Google ile başarıyla giriş yapıldı 💜',
      'acc.orders': '📦 Siparişlerim', 'acc.profile': '👤 Profilim', 'acc.logout': '🚪 Çıkış Yap',
      'acc.hello': 'Merhaba, {name} 💜',
      'acc.tab.orders': 'Siparişlerim', 'acc.tab.address': 'Kayıtlı Adresim', 'acc.tab.profile': 'Profil Bilgileri', 'acc.tab.security': 'Şifre & Güvenlik', 'acc.tab.logout': 'Güvenli Çıkış',
      'acc.role_admin': 'Yönetici', 'acc.role_user': 'Yetkin Üye (18+)',
      'acc.stat.orders': 'Toplam Sipariş', 'acc.stat.privacy': 'Gizlilik Güvencesi', 'acc.stat.support': 'Doğrudan Destek',
      'acc.ask_wa': 'Siparişi Sor', 'acc.noorders.sub': 'Love Shop ayrıcalıkları ve %100 gizli paketleme güvencesiyle ilk siparişinizi oluşturun.',
      'st.processing': 'Hazırlanıyor', 'st.shipped': 'Kargoda', 'st.delivered': 'Teslim Edildi', 'st.cancelled': 'İptal',
      'acc.discreet': 'Gizli paketleme', 'acc.noorders': 'Henüz siparişiniz bulunmuyor.', 'acc.start': 'Kataloğu Keşfet',
      'pf.acc': 'Hesap Bilgileri', 'pf.name': 'Ad Soyad', 'pf.email': 'E-posta', 'pf.save': 'Bilgileri Güncelle',
      'pf.address': 'Teslimat Adresi', 'pf.addr': 'Adres', 'pf.city': 'Şehir', 'pf.zip': 'Posta Kodu', 'pf.phone': 'Telefon',
      'pf.discreet': 'Bu adres için her zaman %100 gizli ve isimsiz paketleme kullan', 'pf.saveaddr': 'Adresi Kaydet',
      'pf.pass': 'Şifre Değiştir', 'pf.new': 'Yeni Şifre', 'pf.new2': 'Yeni Şifre (Tekrar)', 'pf.update': 'Şifreyi Güncelle',
      'pf.title.acc': 'Kişisel Bilgiler', 'pf.sub.acc': 'Hesabınıza kayıtlı ad ve e-posta bilgilerini görüntüleyin ve güncelleyin.',
      'pf.title.address': 'Teslimat & Kargo Adresi', 'pf.sub.address': 'Siparişlerinizin ulaştırılacağı birincil kargo adresinizi yönetin.',
      'pf.title.pass': 'Şifre & Güvenlik', 'pf.sub.pass': 'Hesap güvenliğiniz için güçlü bir şifre belirleyin.',
      'pf.ok': 'Profil güncellendi', 'pf.addrok': 'Adres kaydedildi', 'pf.passok': 'Şifre güncellendi',
      'contact.ok': 'Mesajın alındı, 24 saat içinde dönüş yapacağız 💌',
      'cf.hint': 'Sürükle · Dokun', 'cf.prev': 'Önceki ürün', 'cf.next': 'Sonraki ürün'
    },
    en: {
      'nav.login': 'Sign in',
      'added': 'Added to cart',
      'badge.new': 'New', 'badge.hot': 'Best Seller', 'badge.sale': 'Sale', 'quickadd': 'Add to Cart',
      'nl.bad': 'Please enter a valid e-mail', 'nl.ok': 'Welcome to the club! Your 10% discount code is in your inbox.',
      'shop.all': 'All', 'shop.count': '{n} products', 'shop.empty': 'No products match your criteria.<br>Try changing the filters.',
      'pd.crumb.home': 'Home', 'pd.crumb.shop': 'Shop', 'pd.reviews': 'reviews',
      'pd.notfound': 'Product not found.', 'pd.notfound.btn': 'Back to Shop',
      'pd.add': '🛍️ Add to Cart', 'pd.buy': 'Buy Now',
      'pd.stock.in': 'In stock, ships within 24 hours', 'pd.stock.low': 'Only {n} left — hurry!', 'pd.stock.out': 'Out of stock',
      'pd.trust1': '📦 Discreet packaging — contents never visible from outside', 'pd.trust2': '🚚 Free shipping over 750 TL',
      'pd.trust3': '🔒 Secure & anonymous payment', 'pd.trust4': '↩️ No returns for hygiene; damaged items are replaced',
      'pd.tab.detail': 'Details', 'pd.tab.reviews': 'Reviews', 'pd.similar': 'Similar Products', 'pd.all': 'All →',
      'pd.noreviews': 'No approved reviews for this product yet. Be the first to write one!', 'pd.reviewsfail': 'Reviews could not be loaded.', 'pd.write': '✍️ Write a Review',
      'rv.short': 'Please write a review of at least 10 characters', 'rv.ok': 'Your review has been received and will be published after approval 💜',
      'cart.empty': 'Your cart is empty for now.<br>Ready to explore?', 'cart.empty.btn': 'Explore the Shop',
      'cart.summary': 'Order Summary', 'cart.freeship.left': '🚚 {x} away from free shipping!', 'cart.freeship.won': '🎉 You unlocked free shipping!',
      'cart.coupon.ph': 'Coupon code', 'cart.apply': 'Apply', 'cart.coupon.is': 'Coupon: {code}', 'cart.coupon.ok': 'Coupon applied',
      'cart.subtotal': 'Subtotal', 'cart.shipping': 'Shipping', 'cart.free': 'Free', 'cart.discount': 'Discount', 'cart.total': 'Total',
      'cart.checkout': 'Proceed to Checkout →', 'cart.continue': 'Continue Shopping',
      'cart.remove': 'Remove', 'cart.remove.confirm': 'Remove item from cart?', 'cart.per': '/ each',
      'ck.step1': 'Contact Information', 'ck.name': 'Full Name *', 'ck.name.ph': 'Your full name', 'ck.phone': 'Phone *', 'ck.phone.ph': '05xx xxx xx xx',
      'ck.discreet': 'I want discreet packaging (no store/product name on the outside)',
      'ck.note': 'Order Note (optional)', 'ck.note.ph': 'e.g.: a time window we can reach you by phone',
      'ck.step2': 'Order & Payment Method',
      'ck.step2.note': 'We have no online payment infrastructure. Orders are completed <b>via WhatsApp</b> — the most private and practical way. 💜',
      'ck.pay.wa': '💬 Order via WhatsApp', 'ck.pay.wa.sub': 'your cart summary is prepared for you',
      'ck.pay.shop': '🏬 Pick Up & Pay in Store', 'ck.pay.shop.sub': 'Ilgaz İş Hanı · Tepebaşı',
      'ck.address': 'Address *', 'ck.address.ph': 'Neighborhood, street, no, apartment...', 'ck.city': 'City *', 'ck.zip': 'Postal Code',
      'ck.summary': 'Summary', 'ck.shipping': 'Shipping', 'ck.summary.total': 'Total',
      'ck.submit.wa': '💬 Send Order to WhatsApp', 'ck.submit.shop': '🏬 Place Store Pickup Order',
      'ck.ship.pickup': 'None — store pickup', 'ck.free': 'Free',
      'ck.required': 'Full name and phone are required', 'ck.addrreq': 'Address and city are required for shipping', 'ck.preparing': 'Preparing…',
      'ck.note.small': 'Per our 18+ sales policy, your details are transmitted encrypted.<br>Payment is accepted only via WhatsApp or at our store.',
      'ck.ok.pickup': 'Order received! We\u2019ll be waiting for you at the store 🏬', 'ck.ok.ship': 'Order received! Redirecting you to WhatsApp 🎉',
      'thanks.amount': 'Amount: ',
      'auth.hi': 'Welcome, {name}', 'auth.pass6': 'Password must be at least 6 characters', 'auth.passmismatch': 'Passwords do not match',
      'auth.age': 'You must confirm that you are over 18', 'auth.created': 'Your account has been created 💜',
      'auth.google.login': 'Continue with Google', 'auth.google.reg': 'Sign up with Google',
      'auth.google.wait': 'Connecting to Google…', 'auth.google.ok': 'Signed in with Google successfully 💜',
      'acc.orders': '📦 My Orders', 'acc.profile': '👤 My Profile', 'acc.logout': '🚪 Sign Out',
      'acc.hello': 'Hello, {name} 💜',
      'acc.tab.orders': 'My Orders', 'acc.tab.address': 'Delivery Address', 'acc.tab.profile': 'Profile Information', 'acc.tab.security': 'Password & Security', 'acc.tab.logout': 'Sign Out',
      'acc.role_admin': 'Admin', 'acc.role_user': 'Verified Member (18+)',
      'acc.stat.orders': 'Total Orders', 'acc.stat.privacy': 'Privacy Guarantee', 'acc.stat.support': 'Direct Support',
      'acc.ask_wa': 'Ask about Order', 'acc.noorders.sub': 'Place your first order with 100% discreet packaging and premium Love Shop perks.',
      'st.processing': 'Processing', 'st.shipped': 'Shipped', 'st.delivered': 'Delivered', 'st.cancelled': 'Cancelled',
      'acc.discreet': 'Discreet packaging', 'acc.noorders': 'You have no orders yet.', 'acc.start': 'Explore Catalog',
      'pf.acc': 'Account Information', 'pf.name': 'Full Name', 'pf.email': 'E-mail', 'pf.save': 'Update Info',
      'pf.address': 'Shipping Address', 'pf.addr': 'Address', 'pf.city': 'City', 'pf.zip': 'Postal Code', 'pf.phone': 'Phone',
      'pf.discreet': 'Always use 100% discreet and anonymous packaging for this address', 'pf.saveaddr': 'Save Address',
      'pf.pass': 'Change Password', 'pf.new': 'New Password', 'pf.new2': 'New Password (Again)', 'pf.update': 'Update Password',
      'pf.title.acc': 'Personal Information', 'pf.sub.acc': 'View and manage your account details and registered email.',
      'pf.title.address': 'Delivery & Shipping Address', 'pf.sub.address': 'Manage your primary shipping address for discrete parcel delivery.',
      'pf.title.pass': 'Password & Security', 'pf.sub.pass': 'Keep your account secure with a strong and unique password.',
      'pf.ok': 'Profile updated', 'pf.addrok': 'Address saved', 'pf.passok': 'Password updated',
      'contact.ok': 'Your message is received, we will reply within 24 hours 💌',
      'cf.hint': 'Drag · Touch', 'cf.prev': 'Previous product', 'cf.next': 'Next product'
    }
  };
  function t(key, vars) {
    let s = (STR[LANG] && STR[LANG][key]) || (STR.tr[key] !== undefined ? STR.tr[key] : key);
    if (vars) for (const v in vars) s = s.split('{' + v + '}').join(vars[v]);
    return s;
  }

  window.LS = { fmt, t, lang: LANG, dateFmt };

  /* ---------- i18n: live-update static text nodes from SSR markers ---------- */
  document.documentElement.lang = LANG;

  /* ---------- SVGs for modern navbar icons ---------- */
  const SUN_SVG = `<svg class="icon-svg icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
  const MOON_SVG = `<svg class="icon-svg icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
  const USER_SVG = `<svg class="icon-svg icon-user" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

  /* ---------- theme & language toggles ---------- */
  function persistTheme(dark) {
    try { localStorage.setItem('ls_theme', dark ? 'dark' : 'light'); } catch (e) {}
    document.cookie = 'ls_theme=' + (dark ? 'dark' : 'light') + '; Path=/; Max-Age=31536000; SameSite=Lax';
  }
  function syncThemeButtons(dark) {
    const themeBtn = $('#theme-toggle');
    if (themeBtn) {
      themeBtn.innerHTML = dark ? SUN_SVG : MOON_SVG;
      themeBtn.title = dark ? (LANG === 'tr' ? 'Aydınlık moda geç' : 'Switch to Light mode') : (LANG === 'tr' ? 'Karanlık moda geç' : 'Switch to Dark mode');
    }
    const mmSwitch = $('#mm-theme');
    if (mmSwitch) {
      mmSwitch.classList.toggle('active', dark);
      mmSwitch.setAttribute('aria-checked', String(dark));
    }
    const mmStatus = $('#mm-theme-status');
    if (mmStatus) {
      mmStatus.textContent = dark ? (LANG === 'tr' ? 'Açık' : 'On') : (LANG === 'tr' ? 'Kapalı' : 'Off');
    }
  }
  const darkNow = document.documentElement.classList.contains('dark');
  syncThemeButtons(darkNow);
  $$('#theme-toggle,#mm-theme').forEach((b) => b.addEventListener('click', () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    persistTheme(next);
    syncThemeButtons(next);
  }));
  $$('#lang-toggle,#mm-lang').forEach((b) => b.addEventListener('click', () => {
    const next = LANG === 'tr' ? 'en' : 'tr';
    document.cookie = 'ls_lang=' + next + '; Path=/; Max-Age=31536000; SameSite=Lax';
    try { sessionStorage.setItem('ls_just_switched', '1'); } catch (e) {}
    location.reload();
  }));
  try { sessionStorage.removeItem('ls_just_switched'); } catch (e) {}

  /* ---------- API helper ---------- */
  function getClientSid() {
    try {
      let sid = localStorage.getItem('ls_sid');
      if (!sid) {
        sid = 'sid_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('ls_sid', sid);
      }
      try {
        document.cookie = 'ls_sid=' + encodeURIComponent(sid) + '; Path=/; SameSite=Lax;' + (location.protocol === 'https:' ? ' Secure;' : '') + ' Max-Age=31536000';
      } catch {}
      return sid;
    } catch {
      return '';
    }
  }

  /* Cart local storage cache for instant rendering and resilient offline/iframe sync */
  function getLocalCart() {
    try {
      const raw = localStorage.getItem('ls_cart_data');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  function setLocalCart(cart) {
    try {
      if (cart && Array.isArray(cart.items)) {
        localStorage.setItem('ls_cart_data', JSON.stringify(cart));
      } else {
        localStorage.removeItem('ls_cart_data');
      }
    } catch {}
  }

  async function api(path, opts = {}) {
    const sid = getClientSid();
    const token = localStorage.getItem('ls_auth_token');
    const customHeaders = {
      'Content-Type': 'application/json',
      ...(sid ? { 'x-ls-sid': sid } : {}),
      ...(token ? { 'Authorization': 'Bearer ' + token, 'x-ls-token': token } : {}),
      ...(opts.headers || {})
    };
    const res = await fetch(path, {
      credentials: 'same-origin',
      ...opts,
      headers: customHeaders,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    const serverSid = res.headers.get('x-ls-sid');
    if (serverSid) {
      try {
        localStorage.setItem('ls_sid', serverSid);
        document.cookie = 'ls_sid=' + encodeURIComponent(serverSid) + '; Path=/; SameSite=Lax;' + (location.protocol === 'https:' ? ' Secure;' : '') + ' Max-Age=31536000';
      } catch {}
    }
    let data;
    try { data = await res.json(); } catch { data = { ok: false }; }
    if (!res.ok) throw Object.assign(new Error(data.error || 'Hata olustu'), { data });
    return data;
  }
  LS.api = api;

  /* ---------- global logout ---------- */
  async function performLogout(redirectUrl = '/') {
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
      document.cookie = 'ls_sid=; Path=/; SameSite=Lax;' + (location.protocol === 'https:' ? ' Secure;' : '') + ' Max-Age=0';
      document.cookie = 'ls_token=; Path=/; SameSite=Lax;' + (location.protocol === 'https:' ? ' Secure;' : '') + ' Max-Age=0';
      document.cookie = 'ls_auth_token=; Path=/; SameSite=Lax;' + (location.protocol === 'https:' ? ' Secure;' : '') + ' Max-Age=0';
    } catch (e) {}
    LS.session = null;
    document.dispatchEvent(new Event('ls:logout'));
    toast(LANG === 'tr' ? 'Başarıyla çıkış yapıldı' : 'Signed out successfully', '👋');
    setTimeout(() => {
      window.location.replace(redirectUrl);
    }, 200);
  }
  LS.logout = performLogout;

  /* ---------- toast ---------- */
  function toast(msg, icon = '💖') {
    const zone = $('#toast-zone') || document.body.insertAdjacentHTML('beforeend', '<div id="toast-zone"></div>') && $('#toast-zone');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
    zone.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 2600);
  }
  LS.toast = toast;

  /* ---------- age gate ---------- */
  const gate = $(`#age-gate`);

  const showGate = () => {
    if (!gate) return;
    gate.classList.remove(`hidden`, `passing`);
    document.body.classList.add(`gate-active`);
    document.documentElement.classList.add(`gate-active-init`);
  };
  const hideGate = () => {
    if (!gate) return;
    gate.classList.add(`passing`);
    document.body.classList.remove(`gate-active`);
    document.documentElement.classList.remove(`gate-active-init`);
    setTimeout(() => {
      gate.classList.add(`hidden`);
    }, 800);
  };

  if (gate) {
    const params = new URLSearchParams(location.search);
    const forceShow = params.has('age') || params.has('gate') || params.has('preview') || params.has('yas');
    if (localStorage.getItem(`ls_age_ok_v11`) === `1` && !forceShow) {
      gate.classList.add(`hidden`);
      document.body.classList.remove(`gate-active`);
      document.documentElement.classList.remove(`gate-active-init`);
    } else {
      showGate();
    }
    $(`#age-yes`)?.addEventListener(`click`, () => {
      localStorage.setItem(`ls_age_ok_v11`, `1`);
      hideGate();
    });
    $(`#age-no`)?.addEventListener(`click`, () => {
      location.href = `https://www.google.com`;
    });
  }

  LS.showAgeGate = () => {
    try { localStorage.removeItem(`ls_age_ok_v11`); } catch (e) {}
    showGate();
  };
  window.showAgeGate = LS.showAgeGate;

  /* ---------- cursor glow ---------- */
  const glow = $('#cursor-glow');
  if (glow && matchMedia('(hover: hover)').matches) {
    let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * 0.09; cy += (ty - cy) * 0.09;
      glow.style.left = cx + 'px'; glow.style.top = cy + 'px';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- nav ---------- */
  function renderNavUser(user) {
    const slot = $('#nav-user');
    if (!slot) return;
    if (user) {
      const displayName = user.name || user.email?.split('@')[0] || 'Kullanıcı';
      const initial = displayName.charAt(0).toUpperCase();
      const isAdmin = user.role === 'admin';
      const avatarHtml = user.avatar
        ? `<img src="${user.avatar}" alt="${esc(displayName)}" onerror="this.outerHTML='<span>${initial}</span>'">`
        : `<span>${initial}</span>`;
      
      slot.innerHTML = `
        <button type="button" class="user-btn ${isAdmin ? 'is-admin' : ''}" id="user-menu-btn" aria-haspopup="true" aria-expanded="false" title="${esc(displayName)}${isAdmin ? ' (Yönetici)' : ''}">
          <span class="user-btn-avatar">
            ${avatarHtml}
            ${isAdmin ? '<span class="user-btn-crown" title="Yönetici">👑</span>' : '<span class="user-btn-online" title="Aktif Oturum"></span>'}
          </span>
          <span class="user-btn-name">${esc(displayName)}</span>
          <svg class="user-btn-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>

        <div class="user-dropdown-menu" id="user-dropdown-menu" role="menu" aria-label="Kullanıcı Menüsü">
          <div class="user-dd-header">
            <div class="user-dd-avatar ${isAdmin ? 'is-admin' : ''}">${avatarHtml}</div>
            <div class="user-dd-info">
              <div class="user-dd-name">${esc(displayName)}</div>
              <div class="user-dd-email">${esc(user.email || '')}</div>
              <span class="user-dd-badge ${isAdmin ? 'admin' : ''}">${isAdmin ? '👑 ' + t('acc.role_admin') : '✨ ' + t('acc.role_user')}</span>
            </div>
          </div>

          ${isAdmin ? `
            <a href="/admin" class="user-dd-admin-card" role="menuitem">
              <span class="user-dd-admin-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </span>
              <div class="user-dd-admin-text">
                <span class="user-dd-admin-title">👑 ${LANG === 'tr' ? 'Yönetim Paneli' : 'Admin Panel'}</span>
                <span class="user-dd-admin-desc">${LANG === 'tr' ? 'Sipariş, ürün ve ayarlar' : 'Store & order control'}</span>
              </div>
              <svg class="user-dd-admin-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
            <div class="user-dd-divider"></div>
          ` : ''}

          <div class="user-dd-list">
            <a href="/hesap#orders" class="user-dd-item" role="menuitem">
              <span class="user-dd-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              </span>
              <span>${t('acc.tab.orders')}</span>
            </a>

            <a href="/hesap#address" class="user-dd-item" role="menuitem">
              <span class="user-dd-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              <span>${t('acc.tab.address')}</span>
            </a>

            <a href="/hesap#profile" class="user-dd-item" role="menuitem">
              <span class="user-dd-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <span>${t('acc.tab.profile')}</span>
            </a>

            <a href="/hesap#security" class="user-dd-item" role="menuitem">
              <span class="user-dd-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <span>${t('acc.tab.security')}</span>
            </a>

            <div class="user-dd-divider"></div>

            <button type="button" class="user-dd-item user-dd-logout" id="nav-logout-btn" role="menuitem">
              <span class="user-dd-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              </span>
              <span>${t('acc.tab.logout')}</span>
            </button>
          </div>
        </div>
      `;

      const btn = $('#user-menu-btn', slot);
      const menu = $('#user-dropdown-menu', slot);

      if (btn && menu) {
        const toggleMenu = (open) => {
          const isOpen = open !== undefined ? open : !menu.classList.contains('open');
          menu.classList.toggle('open', isOpen);
          btn.classList.toggle('active', isOpen);
          btn.setAttribute('aria-expanded', String(isOpen));
        };

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleMenu();
        });

        // Click menu items
        $$('.user-dd-item[href]', menu).forEach((item) => {
          item.addEventListener('click', () => {
            toggleMenu(false);
          });
        });

        // Logout from dropdown
        $('#nav-logout-btn', menu)?.addEventListener('click', (e) => {
          e.preventDefault();
          toggleMenu(false);
          performLogout(location.pathname.startsWith('/hesap') || location.pathname.startsWith('/admin') ? '/' : location.pathname);
        });

        // Outside click and ESC listener
        const onDocClick = (e) => {
          if (!slot.contains(e.target)) {
            toggleMenu(false);
          }
        };
        const onKeyDown = (e) => {
          if (e.key === 'Escape') toggleMenu(false);
        };

        document.removeEventListener('click', onDocClick);
        document.addEventListener('click', onDocClick);
        document.addEventListener('keydown', onKeyDown);
      }
    } else {
      slot.innerHTML = `<a href="/giris" class="icon-btn" title="${t('nav.login')}">${USER_SVG}</a>`;
    }
  }

  const nav = $('nav.top');
  if (nav) {
    addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });
    const burger = $('#burger');
    const mm = $('#mobile-menu');
    const mmClose = $('#mm-close');
    const mmBackdrop = $('#mm-backdrop');

    const toggleDrawer = (open) => {
      if (!mm) return;
      const isOpen = open !== undefined ? open : !mm.classList.contains('open');
      mm.classList.toggle('open', isOpen);
      if (mmBackdrop) mmBackdrop.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (burger && mm) {
      burger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDrawer(true);
      });
      if (mmClose) {
        mmClose.addEventListener('click', () => toggleDrawer(false));
      }
      if (mmBackdrop) {
        mmBackdrop.addEventListener('click', () => toggleDrawer(false));
      }
      $$('a', mm).forEach((a) => a.addEventListener('click', () => {
        toggleDrawer(false);
      }));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mm.classList.contains('open')) {
          toggleDrawer(false);
        }
      });
    }
    const updateNavSession = async () => {
      try {
        const s = await api('/api/session');
        renderNavUser(s.user);
        const mmAdminLink = $('#mm-admin-link');
        if (mmAdminLink) mmAdminLink.style.display = (s.user && s.user.role === 'admin') ? 'flex' : 'none';
        LS.session = s;
      } catch {}
    };
    updateNavSession();
    document.addEventListener('ls:session', updateNavSession);
  }
  document.addEventListener('ls:logout', () => {
    renderNavUser(null);
    const mmAdminLink = $('#mm-admin-link');
    if (mmAdminLink) mmAdminLink.style.display = 'none';
  });

  /* ---------- cart badge & magnetic micro-bounce ---------- */
  function updateCartBadge(count, isNewAdd = false) {
    const badges = $$('#cart-badge');
    if (!badges.length) return;
    const n = Math.max(0, parseInt(count, 10) || 0);
    badges.forEach((b) => {
      b.textContent = n;
      b.style.display = 'flex';
      if (isNewAdd) {
        b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
      }
    });

    if (isNewAdd) {
      // Top cart button spring bounce
      const topCartBtn = $('#nav-cart-btn, nav.top .cart-btn, nav.top a[href="/sepet"]');
      if (topCartBtn) {
        topCartBtn.classList.remove('cart-bounce');
        void topCartBtn.offsetWidth;
        topCartBtn.classList.add('cart-bounce');
        setTimeout(() => topCartBtn.classList.remove('cart-bounce'), 750);
      }
    }
  }
  LS.updateCartBadge = updateCartBadge;

  /* ---------- Quick Search Modal (Instant 2026 UX) ---------- */
  function initQuickSearch() {
    const modal = $('#quick-search-modal');
    const input = $('#qs-input');
    const results = $('#qs-results');
    const clearBtn = $('#qs-clear-btn');
    const closeBtn = $('#qs-close-btn');
    const backdrop = $('#qs-backdrop');
    const navSearchBtn = $('#nav-search-btn');
    const mmSearchBtn = $('#mm-search-btn');

    if (!modal || !input || !results) return;

    const trendingKeywords = LANG === 'en'
      ? ['Vibrators', 'Massage Oils', 'For Couples', 'Costumes', 'Games', 'New Arrivals']
      : ['Vibratör', 'Masaj Yağı', 'Çiftler İçin', 'Fantezi & Kostüm', 'Oyunlar', 'Yeni Gelenler'];

    function renderDefaultSearchState() {
      results.innerHTML = `
        <div class="qs-trending-wrap">
          <div class="qs-section-title">${LANG === 'en' ? 'Trending Searches' : 'Popüler Aramalar'}</div>
          <div class="qs-trending-chips">
            ${trendingKeywords.map((kw) => `<button type="button" class="qs-chip" data-query="${esc(kw)}">${esc(kw)}</button>`).join('')}
          </div>
        </div>
        <div class="qs-trending-wrap" style="margin-top:20px;">
          <div class="qs-section-title">${LANG === 'en' ? 'Quick Categories' : 'Hızlı Kategoriler'}</div>
          <div class="qs-quick-cats">
            <a href="/magaza?kat=vibratori" class="qs-cat-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>${LANG === 'en' ? 'Vibrators' : 'Vibratörler'}</span>
            </a>
            <a href="/magaza?kat=ciftler" class="qs-cat-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>${LANG === 'en' ? 'For Couples' : 'Çiftler İçin'}</span>
            </a>
            <a href="/magaza?kat=kozmetik" class="qs-cat-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              <span>${LANG === 'en' ? 'Cosmetics & Oils' : 'Kozmetik & Masaj'}</span>
            </a>
            <a href="/magaza?kat=fantasy" class="qs-cat-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
              <span>${LANG === 'en' ? 'Fantasy & Costume' : 'Fantezi & Kostüm'}</span>
            </a>
            <a href="/magaza?kat=oyunlar" class="qs-cat-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/></svg>
              <span>${LANG === 'en' ? 'Games & Accessories' : 'Oyunlar'}</span>
            </a>
          </div>
        </div>
      `;

      $$('.qs-chip', results).forEach((chip) => {
        chip.addEventListener('click', () => {
          const q = chip.dataset.query;
          if (q) {
            input.value = q;
            if (clearBtn) clearBtn.style.display = 'block';
            doSearch(q);
          }
        });
      });

      $$('.qs-cat-btn', results).forEach((btn) => {
        btn.addEventListener('click', () => {
          closeSearch();
        });
      });
    }

    function openSearch() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (!input.value.trim()) {
        renderDefaultSearchState();
      }
      setTimeout(() => input.focus(), 60);
    }

    function closeSearch() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      input.blur();
    }

    navSearchBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });

    mmSearchBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      $('#mobile-menu')?.classList.remove('open');
      openSearch();
    });

    closeBtn?.addEventListener('click', closeSearch);
    backdrop?.addEventListener('click', closeSearch);

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      renderDefaultSearchState();
      input.focus();
    });

    let searchTimer = null;
    async function doSearch(query) {
      const q = String(query || '').trim();
      if (!q) {
        if (clearBtn) clearBtn.style.display = 'none';
        renderDefaultSearchState();
        return;
      }
      if (clearBtn) clearBtn.style.display = 'block';
      results.innerHTML = `<div class="qs-loading"><div class="spinner"></div></div>`;

      try {
        const res = await api('/api/products?q=' + encodeURIComponent(q) + '&limit=12');
        const list = (res && Array.isArray(res.products)) ? res.products : [];
        if (list.length === 0) {
          results.innerHTML = `
            <div class="qs-empty-state">
              <div style="display:flex;justify-content:center;margin-bottom:12px"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>
              <p><b>"${esc(q)}"</b> ${t('qs.empty')}</p>
              <span style="font-size:12px;color:var(--muted);margin-top:6px;display:block;">${LANG === 'en' ? 'Try searching by category or another keyword.' : 'Kategori adı veya farklı bir anahtar kelime deneyebilirsiniz.'}</span>
            </div>
          `;
          return;
        }

        results.innerHTML = `
          <div class="qs-results-count">${LANG === 'en' ? `${list.length} products found for` : `${list.length} ürün bulundu:`} <b>"${esc(q)}"</b></div>
          <div class="qs-results-list">
            ${list.map((p) => `
              <a href="/urun/${esc(p.slug)}" class="qs-item" data-id="${p.id}" data-slug="${esc(p.slug)}">
                ${p.image ? `<img src="${imgSrc(p.image)}" alt="${esc(p.name)}" class="qs-item-img" loading="lazy">` : `<div class="qs-item-img" style="background:transparent"></div>`}
                <div class="qs-item-info">
                  <div class="qs-item-cat">${esc(p.categoryName || p.category)}</div>
                  <div class="qs-item-name">${esc(p.name)}</div>
                  <div class="qs-item-price-row">
                    <span class="qs-item-price">${fmt(p.price)}</span>
                    ${p.oldPrice ? `<span class="qs-item-old-price">${fmt(p.oldPrice)}</span>` : ''}
                    ${p.stock > 0 ? `<span class="qs-item-stock">● ${LANG === 'en' ? 'In Stock' : 'Stokta'}</span>` : `<span class="qs-item-stock out">● ${LANG === 'en' ? 'Out of Stock' : 'Tükendi'}</span>`}
                  </div>
                </div>
                <div class="qs-item-arrow">→</div>
              </a>
            `).join('')}
          </div>
          <a href="/magaza?q=${encodeURIComponent(q)}" class="qs-view-all-btn">
            ${LANG === 'en' ? 'View All in Catalog' : 'Tüm Sonuçları Katalogda Gör'} (${res.total || list.length}) →
          </a>
        `;

        $$('.qs-item, .qs-view-all-btn', results).forEach((link) => {
          link.addEventListener('click', () => {
            closeSearch();
          });
        });
      } catch (err) {
        results.innerHTML = `<div class="qs-empty-state"><p>${err.message || 'Arama hatası oluştu.'}</p></div>`;
      }
    }

    input.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        doSearch(input.value);
      }, 160);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const q = input.value.trim();
        if (q) {
          closeSearch();
          location.href = '/magaza?q=' + encodeURIComponent(q);
        }
      }
    });

    // Keyboard shortcut: Cmd+K or Ctrl+K opens quick search
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (modal.classList.contains('open')) closeSearch();
        else openSearch();
      }
    });
  }

  /* ---------- Mobile Bottom Navigation Bar ---------- */
  function initMobileBottomNav() {
    const mbNav = $('#mobile-bottom-nav');
    if (!mbNav) return;

    const currentPath = location.pathname;
    $$('.mb-nav-item[data-mb-path]', mbNav).forEach((item) => {
      const itemPath = item.getAttribute('data-mb-path');
      if (itemPath === '/' && (currentPath === '/' || currentPath === '')) {
        item.classList.add('active');
      } else if (itemPath !== '/' && currentPath.startsWith(itemPath)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  let activeCartFetchPromise = null;
  async function refreshCartBadge() {
    // 1. Immediately reflect local cart count if present (eliminates any UI flicker)
    const local = getLocalCart();
    if (local && Array.isArray(local.items)) {
      const localCount = local.items.reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
      updateCartBadge(localCount);
    } else {
      updateCartBadge(0);
    }

    if (!local || !Array.isArray(local.items) || local.items.length === 0) {
      return null;
    }

    // 2. Coalesce concurrent in-flight fetches so rapid triggers share a single network call
    if (activeCartFetchPromise) {
      return activeCartFetchPromise;
    }

    activeCartFetchPromise = (async () => {
      try {
        const c = await api('/api/cart/calc', {
          method: 'POST',
          body: { items: local.items, coupon: local.coupon?.code || (typeof local.coupon === 'string' ? local.coupon : undefined) }
        });
        if (c && Array.isArray(c.items)) {
          if (c.items.length > 0) {
            setLocalCart(c);
            const n = c.items.reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
            updateCartBadge(n);
          } else {
            setLocalCart(null);
            updateCartBadge(0);
          }
          return c;
        } else {
          setLocalCart(null);
          updateCartBadge(0);
        }
      } catch (err) {
        if (local && Array.isArray(local.items)) {
          const localCount = local.items.reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
          updateCartBadge(localCount);
        }
      } finally {
        activeCartFetchPromise = null;
      }
    })();

    return activeCartFetchPromise;
  }
  LS.refreshCartBadge = refreshCartBadge;
  document.addEventListener('ls:cart', refreshCartBadge);
  if ($('nav.top')) refreshCartBadge();

  async function addToCart(productId, qty = 1, variant = 'standart', btn = null) {
    if (!productId) return;
    if (btn && btn.dataset.busy === '1') return;
    if (btn) btn.dataset.busy = '1';

    try {
      // Haptic micro-feedback for mobile touch devices
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
      
      // In-place button feedback
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

      // On desktop (window > 860px), subtle toast notification
      if (window.innerWidth > 860) {
        toast(t('added'), '🛍️');
      }

      if (res && Array.isArray(res.items)) {
        setLocalCart(res);
        const n = res.items.reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
        updateCartBadge(n, true);
      }
    } catch (e) {
      if (btn) delete btn.dataset.busy;
      toast(e.message || 'Ürün sepete eklenemedi', '⚠️');
    }
  }
  LS.addToCart = addToCart;

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('vis'), io.unobserve(e.target))), { threshold: 0.08 });
  function refreshRevealObservers() {
    $$('.rv').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight + 100) && r.bottom > -100) {
        el.classList.add('vis');
      } else {
        io.observe(el);
      }
    });
  }
  LS.observe = refreshRevealObservers;

  /* ---------- 3D Card Parallax & Specular Sheen Physics ---------- */
  function initTiltPhysics() {
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

  /* ---------- product card template ---------- */
  function productCard(p) {
    const badges = [];
    if (p.isNew) badges.push(`<span class="badge new">${t('badge.new')}</span>`);
    if (p.bestSeller) badges.push(`<span class="badge hot">${t('badge.hot')}</span>`);
    if (p.oldPrice) badges.push(`<span class="badge sale">${t('badge.sale')}</span>`);
    return `
    <article class="prod-card rv" data-id="${p.id}" data-slug="${p.slug}">
      <a href="/urun/${p.slug}" class="prod-media" data-slug="${p.slug}">
        ${p.image ? `<img src="${imgSrc(p.image)}" alt="${p.name}" loading="lazy">` : `<div style="width:100%;height:100%;background:transparent"></div>`}
        <div class="card-sheen"></div>
        <div class="prod-badges">${badges.join('')}</div>
      </a>
      <div class="prod-actions">
        <button type="button" class="action-btn quick-add-btn" data-add="${p.id}" title="${t('quickadd')}" aria-label="${t('quickadd')}">
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
      <div class="prod-info">
        <div class="prod-cat">${catName(p.category, p.categoryName)}</div>
        <a href="/urun/${p.slug}" class="prod-name">${p.name}</a>
        <div class="prod-rating">${stars(p.rating || 0)} <span>(${p.reviewCount || 0})</span></div>
        <div class="prod-price-row">
          <span class="price">${fmt(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${fmt(p.oldPrice)}</span>` : ''}
        </div>
      </div>
    </article>`;
  }
  LS.productCard = productCard;

  /* ================= 2026 SPATIAL CARD ZOOM (MORPHING CANVAS) ================= */
  let activeOriginCard = null;
  let activeZoomRequestId = 0;

  async function openSpatialCardZoom(productIdOrSlug, originCard) {
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
      <button type="button" class="spatial-stage-close" id="spatial-stage-close" aria-label="Kapat">✕</button>
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
        ? `<span class="stock-pill in-stock">● ${LANG === 'en' ? 'In stock · Ships in 24h' : 'Stokta · 24 Saatte Kargoda'}</span>`
        : `<span class="stock-pill out-stock">● ${LANG === 'en' ? 'Out of stock' : 'Tükendi'}</span>`;

      const productGallery = (Array.isArray(p.gallery) && p.gallery.length) ? p.gallery : (p.image ? [p.image] : []);
      const hasMultipleImages = productGallery.length > 1;

      stage.innerHTML = `
        <button type="button" class="spatial-stage-close" id="spatial-stage-close" aria-label="${LANG === 'en' ? 'Close' : 'Kapat'}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="spatial-grid">
          <div class="spatial-visual-hero">
            <img id="spatial-main-image" src="${imgSrc(p.image)}" alt="${p.name}">
            <div class="spatial-badge-cluster">
              ${p.bestSeller ? `<span>${t('badge.hot')}</span>` : ''}
              ${p.isNew ? `<span>${t('badge.new')}</span>` : ''}
              ${p.oldPrice ? `<span>${t('badge.sale')}</span>` : ''}
            </div>
            ${hasMultipleImages ? `
              <div class="spatial-thumbs">
                ${productGallery.map((img, idx) => `
                  <button type="button" class="spatial-thumb-btn ${img === p.image ? 'active' : ''}" data-thumb-src="${esc(img)}" aria-label="${p.name} ${idx + 1}">
                    <img src="${imgSrc(img)}" alt="${p.name} - ${idx + 1}">
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <div class="spatial-content-pane">
            <div>
              <div class="spatial-top-meta">
                <span class="spatial-cat">${catName(p.category, p.categoryName)}</span>
                <div class="spatial-rating-row">
                  <span class="rating-stars">${stars(p.rating || 5)}</span>
                  <span class="count">(${p.reviewCount || 0} ${t('pd.reviews')})</span>
                </div>
              </div>

              <div class="spatial-title-group">
                <h1>${p.name}</h1>
                <div class="spatial-price-cluster">
                  <span class="spatial-price">${fmt(p.price)}</span>
                  ${p.oldPrice ? `<span class="spatial-price-old">${fmt(p.oldPrice)}</span>` : ''}
                  ${stockBadge}
                </div>
              </div>

              <p class="spatial-desc" style="margin-top:12px;">${p.description || ''}</p>
            </div>

            <!-- Minimal Quiet Luxury Spec Bar -->
            <div class="spatial-spec-deck">
              <div class="spatial-spec-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>%100 Medikal Silikon</span>
              </div>
              <div class="spatial-spec-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                <span>IPX7 Su Geçirmez</span>
              </div>
              <div class="spatial-spec-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>Manyetik USB Şarj</span>
              </div>
              <div class="spatial-spec-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                <span>&lt;40dB Fısıltı Motoru</span>
              </div>
            </div>

            <!-- Discreet Privacy Reassurance -->
            <div class="spatial-privacy-seal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              <div>
                <strong>%100 Gizli Paketleme & Anonim Fatura</strong>
                <p>Dış ambalajda ürün bilgisi yer almaz. Kart ekstrenizde yalnızca "LS TR Bilişim" görünür.</p>
              </div>
            </div>

            <!-- Spatial Actions Deck -->
            <div class="spatial-action-bar">
              <div class="spatial-qty-picker">
                <button type="button" class="spatial-qty-btn" id="spatial-qty-dec" aria-label="Azalt">−</button>
                <span class="spatial-qty-val" id="spatial-qty-val">1</span>
                <button type="button" class="spatial-qty-btn" id="spatial-qty-inc" aria-label="Artır">+</button>
              </div>
              <button type="button" class="spatial-add-btn" id="spatial-add-btn" data-product-id="${p.id}" ${!inStock ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span>${LANG === 'en' ? 'Add to Cart' : 'Sepete Ekle'}</span>
              </button>
              <a href="/urun/${p.slug}" class="spatial-full-link">
                <span>${LANG === 'en' ? 'Product Details →' : 'Ürün Detayları →'}</span>
              </a>
            </div>
          </div>
        </div>
      `;

      // Spatial gallery thumbnail switcher
      const spatialMain = $('#spatial-main-image', stage);
      
      // Mobile Pull-to-Zoom (Elastic Rubber-Band Effect)
      const spatialVisual = $('.spatial-visual-hero', stage);
      const spatialContent = $('.spatial-content-pane', stage);
      if (spatialVisual && spatialMain) {
        let startY = 0;
        let isPulling = false;
        
        spatialVisual.addEventListener('touchstart', (e) => {
          // Sadece sayfa/modal başındayken aktif olsun
          const scrollTop = spatialVisual.closest('.spatial-card-stage')?.scrollTop || window.scrollY;
          if (scrollTop <= 10) {
            startY = e.touches[0].clientY;
            isPulling = true;
            spatialMain.style.transition = 'none';
            spatialMain.style.transformOrigin = 'center center';
            if (spatialContent) {
              spatialContent.style.transition = 'none';
              // Bilgi kartını (yazılar + arkaplan) tek bir kütle yapmak için:
              spatialContent.style.backgroundColor = 'var(--card-solid)';
              spatialContent.style.position = 'relative';
              spatialContent.style.zIndex = '10';
            }
            // Görselin aşağıya taşabilmesi için overflow'u serbest bırak
            spatialVisual.style.overflow = 'visible';
          }
        }, { passive: true });

        spatialVisual.addEventListener('touchmove', (e) => {
          if (!isPulling) return;
          const currentY = e.touches[0].clientY;
          const deltaY = currentY - startY;
          
          if (deltaY > 0) {
            e.preventDefault(); // Tarayıcının varsayılan aşağı kaydırma (pull-to-refresh) hareketini engeller
            // Yaylanma direnci
            let scale = 1 + (deltaY / 300);
            if (scale > 1.3) {
               scale = 1.3 + (scale - 1.3) * 0.3; 
            }
            spatialMain.style.transform = `scale(${scale})`;
            
            // Bilgi kartını görselin merkezden büyümesi kadar aşağı doğru kaydır (translateY)
            if (spatialContent) {
               const moveY = (spatialMain.offsetHeight * (scale - 1)) / 2;
               spatialContent.style.transform = `translateY(${moveY}px)`;
            }
          } else {
            isPulling = false;
          }
        }, { passive: false });

        const resetZoom = () => {
          if (isPulling || spatialMain.style.transform !== '') {
            isPulling = false;
            spatialMain.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            spatialMain.style.transform = 'scale(1)';
            
            if (spatialContent) {
              spatialContent.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
              spatialContent.style.transform = 'translateY(0)';
            }
            
            setTimeout(() => {
              if (!isPulling) {
                spatialMain.style.transition = '';
                if (spatialContent) {
                  spatialContent.style.transition = '';
                  spatialContent.style.backgroundColor = '';
                  spatialContent.style.position = '';
                  spatialContent.style.zIndex = '';
                }
                spatialVisual.style.overflow = '';
              }
            }, 500);
          }
        };

        spatialVisual.addEventListener('touchend', resetZoom);
        spatialVisual.addEventListener('touchcancel', resetZoom);
      }

      $$('.spatial-thumb-btn', stage).forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetSrc = btn.dataset.thumbSrc;
          if (spatialMain && targetSrc) {
            spatialMain.src = imgSrc(targetSrc);
            $$('.spatial-thumb-btn', stage).forEach((b) => {
              b.classList.toggle('active', b === btn);
              b.style.borderColor = (b === btn) ? 'var(--rose)' : 'var(--line)';
            });
          }
        });
      });

      let currentQty = 1;
      const qtyVal = $('#spatial-qty-val');
      const addBtn = $('#spatial-add-btn');

      $('#spatial-qty-dec')?.addEventListener('click', () => {
        if (currentQty > 1) {
          currentQty--;
          if (qtyVal) qtyVal.textContent = currentQty;
        }
      });

      $('#spatial-qty-inc')?.addEventListener('click', () => {
        if (currentQty < (p.stock || 99)) {
          currentQty++;
          if (qtyVal) qtyVal.textContent = currentQty;
        }
      });

      $('#spatial-stage-close')?.addEventListener('click', closeSpatialCardZoom);

      addBtn?.addEventListener('click', async () => {
        const targetPid = addBtn.dataset.productId || p.id;
        await addToCart(targetPid, currentQty, 'standart', addBtn);
      });

    } catch (err) {
      if (reqId !== activeZoomRequestId) return;
      stage.innerHTML = `
        <button type="button" class="spatial-stage-close" id="spatial-stage-close">✕</button>
        <div class="empty-state" style="padding:60px 20px;">
          <p>${err.message || 'Ürün detayları yüklenemedi.'}</p>
        </div>`;
      $('#spatial-stage-close')?.addEventListener('click', closeSpatialCardZoom);
    }
  }

  function closeSpatialCardZoom() {
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
      activeOriginCard.style.opacity = '1';
      activeOriginCard.style.transform = 'none';
      activeOriginCard = null;
    }
  }

  function initQuickDrawerListeners() {
    if (initQuickDrawerListeners.initialized) return;
    initQuickDrawerListeners.initialized = true;

    $('#spatial-canvas-overlay')?.addEventListener('click', (e) => {
      if (e.target === $('#spatial-canvas-overlay')) closeSpatialCardZoom();
    });

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
        addToCart(pid, 1, 'standart', addBtn);
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

  /* ================= HOME ================= */
  async function initHome() {
    refreshRevealObservers();
    const featured = $('#featured-grid');
    if (featured) {
      const data = await api('/api/products?featured=1&limit=10').catch(() => ({ products: [] }));
      featured.innerHTML = data.products.slice(0, 10).map(productCard).join('');
      refreshRevealObservers();
    }
    const wheel = $('#cf-stage');
    if (wheel) initCoverflow(wheel);
    const best = $('#new-grid');
    if (best) {
      const data = await api('/api/products?sort=new&limit=5').catch(() => ({ products: [] }));
      best.innerHTML = data.products.slice(0, 5).map(productCard).join('');
      refreshRevealObservers();
    }
    const nlForm = $('#nl-form');
    if (nlForm && !nlForm.dataset.bound) {
      nlForm.dataset.bound = '1';
      nlForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = $('#nl-email').value.trim();
        if (!/^\S+@\S+\.\S+$/.test(email)) return toast(t('nl.bad'), '⚠️');
        try {
          await api('/api/newsletter', { method: 'POST', body: { email } });
          toast(t('nl.ok'), '🎁');
          nlForm.reset();
        } catch (err) { toast(err.message, '⚠️'); }
      });
    }
  }

  const CAT_EN = {
    'anal-urun': 'Anal Products',
    'dildo': 'Dildos',
    'erkek-cinsel-saglik-urunu': 'Men\u2019s Sexual Health',
    'fantezi-fetis-urunu': 'Fantasy & Fetish',
    'kadin-cinsel-saglik-urunu': 'Women\u2019s Sexual Health',
    'sisme-manken': 'Sex Dolls',
    'vajina-masturbator': 'Vaginas & Masturbators',
    'vibrator': 'Vibrators',
    'vibratori': 'Vibrators',
    'ciftler': 'For Couples', 'kozmetik': 'Cosmetics', 'fantasy': 'Fantasy', 'oyunlar': 'Games', 'knot': 'Knot'
  };
  function catName(slug, name) {
    if (LANG === 'en' && CAT_EN[slug]) return CAT_EN[slug];
    return name || CAT_EN[slug] || slug;
  }
  LS.catName = catName;

  /* ================= SHOP ================= */
  async function initShop() {
    const root = $('#shop-root');
    if (!root) return;
    const state = { cat: new URLSearchParams(location.search).get('kat') || 'hepsi', q: '', sort: 'onerilen' };
    const catWrap = $('#cat-chips');

    const cats = await api('/api/categories').catch(() => ({ categories: [] }));
    if (catWrap) {
      catWrap.innerHTML = [`<button class="chip ${state.cat === 'hepsi' ? 'on' : ''}" data-cat="hepsi">${t('shop.all')}</button>`]
        .concat(cats.categories.map((c) => `<button class="chip ${state.cat === c.slug ? 'on' : ''}" data-cat="${c.slug}">${catName(c.slug, c.name)}</button>`)).join('');
      $$('[data-cat]', catWrap).forEach((b) => b.addEventListener('click', () => {
        state.cat = b.dataset.cat;
        $$('[data-cat]', catWrap).forEach((x) => x.classList.toggle('on', x === b));
        load();
      }));
    }
    const search = $('#shop-search');
    if (search) {
      let t;
      search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = search.value.trim(); load(); }, 300); });
    }
    const sortSel = $('#shop-sort');
    if (sortSel) sortSel.addEventListener('change', () => { state.sort = sortSel.value; load(); });

    async function load() {
      root.innerHTML = '<div class="spinner"></div>';
      const p = new URLSearchParams();
      if (state.cat !== 'hepsi') p.set('cat', state.cat);
      if (state.q) p.set('q', state.q);
      p.set('sort', state.sort); p.set('limit', '50');
      const data = await api('/api/products?' + p).catch(() => ({ products: [], total: 0 }));
      const count = $('#results-count');
      if (count) count.textContent = t('shop.count', { n: data.total });
      root.innerHTML = data.products.length
        ? `<div class="prod-grid">${data.products.map(productCard).join('')}</div>`
        : `<div class="empty-state"><div class="big">🔍</div><p>${t('shop.empty')}</p></div>`;
      $$('article', root).forEach((el) => { el.classList.add('vis'); });
    }
    load();
  }

  /* ================= PRODUCT DETAIL ================= */
  async function initProduct() {
    const root = $('#product-root');
    if (!root) return;
    const parts = location.pathname.split('/').filter(Boolean);
    const rawSlug = parts.pop() || '';
    const slug = decodeURIComponent(rawSlug).replace(/\/+$/, '').trim();
    if (!slug || slug === 'urun') {
      root.innerHTML = `<div class="empty-state"><div class="big">💔</div><p>${t('pd.notfound')}</p><a class="btn btn-primary" href="/magaza" style="margin-top:16px">${t('pd.notfound.btn')}</a></div>`;
      return;
    }
    let p;
    try {
      const res = await api('/api/products/' + encodeURIComponent(slug));
      p = res.product || res;
      if (!p || !p.id) throw new Error('notfound');
    } catch {
      root.innerHTML = `<div class="empty-state"><div class="big">💔</div><p>${t('pd.notfound')}</p><a class="btn btn-primary" href="/magaza" style="margin-top:16px">${t('pd.notfound.btn')}</a></div>`;
      return;
    }
    document.title = p.name + ' — LOVE SHOP';
    const productGallery = (Array.isArray(p.gallery) && p.gallery.length) ? p.gallery : (p.image ? [p.image] : []);
    const hasMultipleImages = productGallery.length > 1;

    root.innerHTML = `
    <div class="page-head" style="padding-bottom:0"><div class="crumbs"><a href="/">${t('pd.crumb.home')}</a> / <a href="/magaza">${t('pd.crumb.shop')}</a> / <a href="/magaza?kat=${p.category}">${catName(p.category, p.categoryName)}</a></div></div>
    <div class="pd-layout">
      <div class="pd-gallery">
        <div class="pd-media"><img id="pd-main-image" src="${imgSrc(p.image)}" alt="${p.name}"></div>
        ${hasMultipleImages ? `
          <div class="pd-thumbs" style="display:flex;gap:10px;margin-top:14px;overflow-x:auto;padding-bottom:6px">
            ${productGallery.map((img, idx) => `
              <button type="button" class="pd-thumb-btn ${img === p.image ? 'active' : ''}" data-thumb-src="${esc(img)}" style="border-radius:10px;border:2px solid ${img === p.image ? 'var(--rose)' : 'var(--line)'};padding:2px;background:var(--card-2);cursor:pointer;width:58px;height:58px;flex-shrink:0;overflow:hidden;transition:all .18s ease">
                <img src="${imgSrc(img)}" alt="${p.name} - ${idx + 1}" style="width:100%;height:100%;object-fit:contain">
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <div class="pd-info">
        <div class="prod-cat">${catName(p.category, p.categoryName)}</div>
        <h1>${p.name}</h1>
        <div class="prod-rating">${stars(p.rating)} <span>· ${p.reviewCount} ${t('pd.reviews')}</span></div>
        <div class="pd-price"><span>${fmt(p.price)}</span>${p.oldPrice ? `<span class="price-old">${fmt(p.oldPrice)}</span>` : ''}</div>
        <p class="pd-desc">${p.description}</p>
        <div class="qty-row">
          <div class="qty-picker">
            <button id="q-minus" type="button">−</button>
            <input id="q-val" value="1" readonly>
            <button id="q-plus" type="button">+</button>
          </div>
          <button class="btn btn-primary" id="pd-add">${t('pd.add')}</button>
          <button class="btn btn-ghost" id="pd-buy">${t('pd.buy')}</button>
        </div>
        <div class="stock-line"><span class="dot" ${p.stock < 5 ? 'style="background:var(--warn);box-shadow:0 0 12px var(--warn)"' : ''}></span>
          ${p.stock > 0 ? (p.stock < 5 ? t('pd.stock.low', { n: p.stock }) : t('pd.stock.in')) : t('pd.stock.out')}
        </div>
        <div class="pd-trust">
          <div>${t('pd.trust1')}</div>
          <div>${t('pd.trust2')}</div>
          <div>${t('pd.trust3')}</div>
          <div>${t('pd.trust4')}</div>
        </div>
      </div>
    </div>
    <div class="tab-row">
      <button class="tab-btn on" data-tab="detay">${t('pd.tab.detail')}</button>
      <button class="tab-btn" data-tab="yorum">${t('pd.tab.reviews')}</button>
    </div>
    <div class="tab-panel" id="tab-panel"></div>
    <section class="block"><div class="section-head"><div><h2>${t('pd.similar')}</h2></div><a href="/magaza?kat=${p.category}" class="link-more">${t('pd.all')}</a></div><div class="prod-grid" id="related-grid"></div></section>`;

    // Gallery thumbnail switcher handler
    const mainImg = $('#pd-main-image');
    $$('.pd-thumb-btn', root).forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetSrc = btn.dataset.thumbSrc;
        if (mainImg && targetSrc) {
          mainImg.src = imgSrc(targetSrc);
          $$('.pd-thumb-btn', root).forEach((b) => {
            b.classList.toggle('active', b === btn);
            b.style.borderColor = (b === btn) ? 'var(--rose)' : 'var(--line)';
          });
        }
      });
    });

    let qty = 1;
    const qv = $('#q-val');
    $('#q-minus').addEventListener('click', () => { qty = Math.max(1, qty - 1); qv.value = qty; });
    $('#q-plus').addEventListener('click', () => { qty = Math.min(p.stock || 1, qty + 1); qv.value = qty; });
    $('#pd-add').addEventListener('click', (e) => addToCart(p.id, qty, 'standart', e.currentTarget));
    $('#pd-buy').addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      if (btn.disabled) return;
      btn.disabled = true;
      try {
        const local = getLocalCart();
        const currentItems = (local && Array.isArray(local.items)) ? local.items : [];
        const currentCoupon = local?.coupon?.code || (typeof local?.coupon === 'string' ? local.coupon : undefined);
        const res = await api('/api/cart/add', {
          method: 'POST',
          body: { productId: p.id, qty, variant: 'standart', items: currentItems, coupon: currentCoupon }
        });
        if (res && Array.isArray(res.items)) {
          setLocalCart(res);
          const n = res.items.reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
          updateCartBadge(n, true);
        }
        location.href = '/odeme';
      } catch (err) {
        btn.disabled = false;
        toast(err.message || 'Hata oluştu', '⚠️');
      }
    });

    const panels = { detay: p.longDescription || p.description };
    function showTab(name) {
      $$('.tab-btn').forEach((b) => b.classList.toggle('on', b.dataset.tab === name));
      const panel = $('#tab-panel');
      if (name === 'yorum') {
        panel.innerHTML = '<div class="spinner"></div>';
        api('/api/products/' + p.id + '/reviews').then((d) => {
          panels.yorum = d.reviews.length
            ? d.reviews.map((r) => `<div style="border-bottom:1px solid var(--line);padding:14px 0"><div style="color:var(--gold)">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div><div style="color:var(--text);margin:6px 0">${r.text}</div><small>— ${r.userName} · ${dateFmt(r.createdAt)}</small></div>`).join('')
            : t('pd.noreviews');
          panel.textContent = '';
          panel.innerHTML = panels.yorum + `<div style="margin-top:20px"><a class="btn btn-ghost btn-sm" href="/urun/${p.slug}/yorum">${t('pd.write')}</a></div>`;
        }).catch(() => { panel.textContent = t('pd.reviewsfail'); });
      } else {
        panel.textContent = panels.detay;
      }
    }
    $$('.tab-btn').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));
    showTab('detay');

    api('/api/products?cat=' + p.category + '&limit=6').then((d) => {
      const rel = d.products.filter((x) => x.id !== p.id).slice(0, 5);
      const g = $('#related-grid');
      g.innerHTML = rel.map(productCard).join('');
      $$('article', g).forEach((el) => el.classList.add('vis'));
    }).catch(() => {});
  }

  /* ================= REVIEW FORM ================= */
  function initReviewForm() {
    const f = $('#review-form');
    if (!f) return;
    const pid = f.dataset.product;
    $('#stars-row').addEventListener('click', (e) => {
      const b = e.target.closest('[data-star]'); if (!b) return;
      $('#stars-row input').value = b.dataset.star;
      $$('[data-star]', $('#stars-row')).forEach((s) => s.style.opacity = +s.dataset.star <= +b.dataset.star ? 1 : .3);
    });
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = {
        rating: +($('#stars-row input').value || 5),
        text: $('#rv-text').value.trim()
      };
      if (!body.text || body.text.length < 10) return toast(t('rv.short'), '⚠️');
      try {
        await api('/api/products/' + pid + '/reviews', { method: 'POST', body });
        toast(t('rv.ok'), '✨');
        setTimeout(() => location.href = '/urun/' + f.dataset.slug, 1200);
      } catch (err) { toast(err.message, '⚠️'); }
    });
  }

  /* ================= CART ================= */
  async function initCart() {
    const root = $('#cart-root');
    if (!root) return;
    async function render() {
      root.innerHTML = '<div class="spinner"></div>';
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
        root.innerHTML = `<div class="empty-state"><div class="big">🛒</div><p>${t('cart.empty')}</p><a class="btn btn-primary" href="/magaza" style="margin-top:18px">${t('cart.empty.btn')}</a></div>`;
        return;
      }

      setLocalCart(c);
      const badgeCount = c.items.reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
      updateCartBadge(badgeCount);

      const lines = c.items.map((i) => `
        <div class="cart-line">
          <img src="${i.image}?v=transparent2" alt="${i.name}">
          <div>
            <div class="cl-cat">${catName(i.category, i.categoryName)}</div>
            <a class="cl-name" href="/urun/${i.slug}">${i.name}</a>
            <div class="cl-price" style="margin-top:6px">${fmt(i.price)} <span class="muted" style="font-weight:400;font-size:12px">${t('cart.per')}</span></div>
          </div>
          <div class="cl-actions">
            <div class="qty-picker">
              <button data-dec="${i.productId}" type="button">−</button>
              <input value="${i.qty}" readonly>
              <button data-inc="${i.productId}" type="button">+</button>
            </div>
            <div class="cl-price">${fmt(i.price * i.qty)}</div>
            <button class="cl-remove" data-del="${i.productId}">${t('cart.remove')}</button>
          </div>
        </div>`).join('');
      const pct = Math.min(100, (c.subtotal / c.freeShippingThreshold) * 100);
      root.innerHTML = `
      <div class="cart-items">${lines}</div>
      <div class="summary">
        <h3>${t('cart.summary')}</h3>
        ${c.subtotal < c.freeShippingThreshold
          ? `<div class="free-ship-note">${t('cart.freeship.left', { x: '<b>' + fmt(c.freeShippingThreshold - c.subtotal) + '</b>' })}<div class="progress-bar"><i style="width:${pct}%"></i></div></div>`
          : `<div class="free-ship-note">${t('cart.freeship.won')}</div>`}
        <div class="coupon-row">
          <input id="coupon-input" class="field-input" placeholder="${t('cart.coupon.ph')}" value="${c.coupon ? c.coupon.code : ''}" style="background:var(--card-2);border:1px solid var(--line);border-radius:100px;padding:11px 18px;color:var(--text);outline:none">
          <button class="btn btn-ghost btn-sm" id="coupon-apply">${t('cart.apply')}</button>
        </div>
        ${c.coupon ? `<div class="sum-row" style="color:var(--ok)"><span>${t('cart.coupon.is', { code: c.coupon.code })}</span><span>-${fmt(c.discount)}</span></div>` : ''}
        <div class="sum-row"><span>${t('cart.subtotal')}</span><span>${fmt(c.subtotal)}</span></div>
        <div class="sum-row"><span>${t('cart.shipping')}</span><span>${c.shipping ? fmt(c.shipping) : t('cart.free')}</span></div>
        ${c.discount ? `<div class="sum-row" style="color:var(--ok)"><span>${t('cart.discount')}</span><span>-${fmt(c.discount)}</span></div>` : ''}
        <div class="sum-row total"><span>${t('cart.total')}</span><span>${fmt(c.total)}</span></div>
        <a href="/odeme" class="btn btn-primary btn-block" style="margin-top:18px">${t('cart.checkout')}</a>
        <a href="/magaza" class="btn btn-ghost btn-block" style="margin-top:10px">${t('cart.continue')}</a>
      </div>`;

      $$('[data-inc]').forEach((b) => b.addEventListener('click', async () => {
        if (b.disabled) return;
        b.disabled = true;
        try {
          const l = getLocalCart() || { items: [] };
          const res = await api('/api/cart/update', {
            method: 'POST',
            body: {
              productId: b.dataset.inc,
              qty: +b.nextElementSibling.value + 1,
              items: l.items,
              coupon: l.coupon?.code || (typeof l.coupon === 'string' ? l.coupon : undefined)
            }
          });
          if (res) {
            setLocalCart(res);
            const n = (res.items || []).reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
            updateCartBadge(n);
          }
          render();
        } catch (err) {
          b.disabled = false;
          toast(err.message || 'Hata oluştu', '⚠️');
        }
      }));

      $$('[data-dec]').forEach((b) => b.addEventListener('click', async () => {
        if (b.disabled) return;
        b.disabled = true;
        const q = +b.nextElementSibling.value - 1;
        try {
          const l = getLocalCart() || { items: [] };
          const currentCoupon = l.coupon?.code || (typeof l.coupon === 'string' ? l.coupon : undefined);
          let res;
          if (q < 1) {
            res = await api('/api/cart/remove', {
              method: 'POST',
              body: { productId: b.dataset.dec, items: l.items, coupon: currentCoupon }
            });
          } else {
            res = await api('/api/cart/update', {
              method: 'POST',
              body: { productId: b.dataset.dec, qty: q, items: l.items, coupon: currentCoupon }
            });
          }
          if (res) {
            setLocalCart(res);
            const n = (res.items || []).reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
            updateCartBadge(n);
          }
          render();
        } catch (err) {
          b.disabled = false;
          toast(err.message || 'Hata oluştu', '⚠️');
        }
      }));

      $$('[data-del]').forEach((b) => b.addEventListener('click', async () => {
        if (b.disabled) return;
        b.disabled = true;
        try {
          const l = getLocalCart() || { items: [] };
          const currentCoupon = l.coupon?.code || (typeof l.coupon === 'string' ? l.coupon : undefined);
          const res = await api('/api/cart/remove', {
            method: 'POST',
            body: { productId: b.dataset.del, items: l.items, coupon: currentCoupon }
          });
          if (res) {
            setLocalCart(res);
            const n = (res.items || []).reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
            updateCartBadge(n);
          }
          render();
        } catch (err) {
          b.disabled = false;
          toast(err.message || 'Hata oluştu', '⚠️');
        }
      }));

      const ca = $('#coupon-apply');
      if (ca) ca.addEventListener('click', async () => {
        const code = $('#coupon-input').value.trim().toUpperCase();
        if (!code) return;
        try {
          const l = getLocalCart() || { items: [] };
          const res = await api('/api/cart/coupon', {
            method: 'POST',
            body: { code, items: l.items }
          });
          toast(t('cart.coupon.ok'), '🎟️');
          if (res) {
            setLocalCart(res);
            const n = (res.items || []).reduce((a, i) => a + (parseInt(i.qty, 10) || 0), 0);
            updateCartBadge(n);
          }
          render();
        } catch (e) { toast(e.message, '⚠️'); }
      });
    }
    render();
  }

  /* ================= CHECKOUT ================= */
  async function initCheckout() {
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
          <h3><span class="step-no">1</span> ${t('ck.step1')}</h3>
          <div class="grid-2">
            <div class="field"><label>${t('ck.name')}</label><input id="ck-name" value="${u ? u.name : ''}" placeholder="${t('ck.name.ph')}"></div>
            <div class="field"><label>${t('ck.phone')}</label><input id="ck-phone" value="${addr ? addr.phone || '' : ''}" placeholder="${t('ck.phone.ph')}"></div>
          </div>
          <div class="checkbox-row"><input type="checkbox" id="ck-discreet" checked><label for="ck-discreet">${t('ck.discreet')}</label></div>
          <div class="field" style="margin-top:14px"><label>${t('ck.note')}</label><input id="ck-note" placeholder="${t('ck.note.ph')}"></div>
        </div>
        <div class="check-step">
          <h3><span class="step-no">2</span> ${t('ck.step2')}</h3>
          <p class="muted" style="font-size:13px;margin-bottom:14px">${t('ck.step2.note')}</p>
          <div class="pay-options">
            <label class="pay-option"><input type="radio" name="pay" value="whatsapp" checked> ${t('ck.pay.wa')} <span class="muted" style="margin-left:auto;font-size:12px">${t('ck.pay.wa.sub')}</span></label>
            <label class="pay-option"><input type="radio" name="pay" value="shop"> ${t('ck.pay.shop')} <span class="muted" style="margin-left:auto;font-size:12px">${t('ck.pay.shop.sub')}</span></label>
          </div>
          <div id="addr-block" style="margin-top:16px">
            <div class="field"><label>${t('ck.address')}</label><textarea id="ck-address" placeholder="${t('ck.address.ph')}">${addr && !addr.full.startsWith('MAĞAZA') ? addr.full : ''}</textarea></div>
            <div class="grid-2">
              <div class="field"><label>${t('ck.city')}</label><input id="ck-city" value="${addr && addr.city ? addr.city : ''}" placeholder="${t('ck.city').replace(' *', '')}"></div>
              <div class="field"><label>${t('ck.zip')}</label><input id="ck-zip" value="${addr && addr.zip ? addr.zip : ''}" placeholder="26000"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="summary">
        <h3>${t('ck.summary')}</h3>
        ${c.items.map((i) => `<div class="sum-row"><span>${i.name} ×${i.qty}</span><span>${fmt(i.price * i.qty)}</span></div>`).join('')}
        <div class="sum-row"><span>${t('ck.shipping')}</span><span id="pay-ship">${c.shipping ? fmt(c.shipping) : t('ck.free')}</span></div>
        ${c.discount ? `<div class="sum-row" style="color:var(--ok)"><span>${c.coupon ? c.coupon.code : ''}</span><span>-${fmt(c.discount)}</span></div>` : ''}
        <div class="sum-row total"><span>${t('ck.summary.total')}</span><span id="pay-total">${fmt(c.total)}</span></div>
        <button class="btn btn-primary btn-block" id="ck-submit" style="margin-top:18px">${t('ck.submit.wa')}</button>
        <p style="font-size:11px;color:var(--muted);margin-top:12px;text-align:center">${t('ck.note.small')}</p>
      </div>
    </div>`;

    function refreshPay() {
      const m = document.querySelector('input[name=pay]:checked').value;
      $('#addr-block').style.display = m === 'whatsapp' ? '' : 'none';
      $('#pay-ship').textContent = m === 'shop' ? t('ck.ship.pickup') : (c.shipping ? fmt(c.shipping) : t('ck.free'));
      $('#ck-submit').innerHTML = m === 'shop' ? t('ck.submit.shop') : t('ck.submit.wa');
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
      if (!body.name || !body.phone) return toast(t('ck.required'), '⚠️');
      if (method === 'whatsapp' && (!body.address || !body.city)) return toast(t('ck.addrreq'), '⚠️');
      const btn = $('#ck-submit'); btn.disabled = true; btn.textContent = t('ck.preparing');
      try {
        const r = await api('/api/checkout', { method: 'POST', body });
        setLocalCart(null);
        updateCartBadge(0);
        toast(r.pickup ? t('ck.ok.pickup') : t('ck.ok.ship'), '💖');
        setTimeout(() => { location.href = '/tesekkurler/' + r.orderId; }, r.pickup ? 900 : 1200);
      } catch (e) { btn.disabled = false; refreshPay(); toast(e.message, '⚠️'); }
    });
  }

  /* ================= THANKS ================= */
  async function initThanks() {
    const el = $('#thanks-order');
    if (!el) return;
    const id = location.pathname.split('/').pop();
    try {
      const d = await api('/api/orders/' + id);
      el.textContent = d.order.id;
      const t = $('#thanks-total');
      if (t) t.textContent = LS.t('thanks.amount') + fmt(d.order.total);
    } catch { el.textContent = id; }
  }

  /* ================= AUTH ================= */
    function initAuth() {
    const getAuthRedirect = (role) => {
      if (role === 'admin') return '/admin';
      const params = new URLSearchParams(location.search);
      const next = params.get('next') || params.get('redirect') || params.get('returnUrl');
      if (next && next.startsWith('/') && !next.startsWith('//')) return next;
      return '/';
    };

    const login = $('#login-form');
    if (login) login.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const r = await api('/api/auth/login', { method: 'POST', body: { email: $('#l-email').value.trim(), password: $('#l-pass').value } });
        toast(LS.t('auth.hi', { name: r.user.name }), '👋');
        document.dispatchEvent(new Event('ls:session'));
        setTimeout(() => { location.href = getAuthRedirect(r.user?.role); }, 500);
      } catch (err) { toast(err.message, '⚠️'); }
    });
    const reg = $('#register-form');
    if (reg) reg.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const r = await api('/api/auth/register', { method: 'POST', body: { name: $('#r-name').value.trim(), email: $('#r-email').value.trim(), password: $('#r-pass').value } });
        toast(LS.t('auth.hi', { name: r.user.name }), '🎉');
        document.dispatchEvent(new Event('ls:session'));
        setTimeout(() => { location.href = getAuthRedirect(r.user?.role); }, 500);
      } catch (err) { toast(err.message, '⚠️'); }
    });

    const gLogin = $('#btn-google-login');
    const gReg = $('#btn-google-reg');
    
    let tokenClient = null;

    const startGoogleFlow = () => {
      if (!window.__LS_GOOGLE_CLIENT_ID__) {
        toast('Google Client ID bulunamadı', '⚠️');
        return;
      }
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        if (!tokenClient) {
          tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: window.__LS_GOOGLE_CLIENT_ID__,
            scope: 'email profile openid',
            callback: async (resp) => {
              if (resp && resp.access_token) {
                try {
                  toast(LS.t('auth.google.wait') || 'Lütfen bekleyin...', '⏳');
                  const r = await api('/api/auth/google', {
                    method: 'POST',
                    body: { accessToken: resp.access_token }
                  });
                  if (r.token) {
                    localStorage.setItem('ls_auth_token', r.token);
                  }
                  toast((LS.t('auth.google.ok') || 'Giriş yapıldı'), '🎉');
                  document.dispatchEvent(new Event('ls:session'));
                  setTimeout(() => {
                    location.href = getAuthRedirect(r.user?.role);
                  }, 400);
                } catch (err) {
                  toast(err.message || 'Google ile giriş yapılamadı', '⚠️');
                }
              }
            }
          });
        }
        tokenClient.requestAccessToken();
      } else if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.prompt();
      } else {
        toast('Google servisleri hazırlanıyor, lütfen 1 saniye sonra tekrar deneyin...', '⏳');
      }
    };

    if (gLogin) gLogin.onclick = startGoogleFlow;
    if (gReg) gReg.onclick = startGoogleFlow;

    if (window.__LS_GOOGLE_CLIENT_ID__) {
       const handleCredentialResponse = async (response) => {
          try {
            toast(LS.t('auth.google.wait') || 'Lütfen bekleyin...', '⏳');
            const r = await api('/api/auth/google', {
              method: 'POST',
              body: { credential: response.credential }
            });
            if (r.token) {
              localStorage.setItem('ls_auth_token', r.token);
            }
            toast((LS.t('auth.google.ok') || 'Giriş yapıldı'), '🎉');
            document.dispatchEvent(new Event('ls:session'));
            setTimeout(() => {
              location.href = getAuthRedirect(r.user?.role);
            }, 400);
          } catch (err) {
            toast(err.message || 'Google ile giriş yapılamadı', '⚠️');
          }
       };
       
       const initGsi = () => {
         if (window.google && window.google.accounts && window.google.accounts.id) {
           window.google.accounts.id.initialize({
             client_id: window.__LS_GOOGLE_CLIENT_ID__,
             callback: handleCredentialResponse,
             auto_select: false,
             use_fedcm_for_prompt: false
           });

           if (window.self === window.top) {
             try {
               window.google.accounts.id.prompt((notification) => {});
             } catch (e) {}
           }
         }
       };
       
       if (window.google && window.google.accounts) {
         initGsi();
       } else {
         window.addEventListener('load', initGsi);
       }
    } else {
       if (gLogin) gLogin.style.display = 'none';
       if (gReg) gReg.style.display = 'none';
       const orDividers = document.querySelectorAll('.auth-or');
       orDividers.forEach(d => d.style.display = 'none');
    }
  }

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
      ? `<span class="acc-role-badge admin">👑 ${t('acc.role_admin')}</span>`
      : `<span class="acc-role-badge">✨ ${t('acc.role_user')}</span>`;

    const a = (s.user.addresses && s.user.addresses[0]) || { label: 'Ev', full: '', city: '', zip: '', phone: '', discreet: true };

    const statusTr = {
      processing: t('st.processing'),
      shipped: t('st.shipped'),
      delivered: t('st.delivered'),
      cancelled: t('st.cancelled')
    };

    rootEl.innerHTML = `
      <!-- LEFT SIDEBAR -->
      <aside class="acc-sidebar">
        <div class="acc-user-card">
          <div class="acc-avatar">${esc(initials)}</div>
          <div class="acc-user-name">${esc(s.user.name)}</div>
          <div class="acc-user-email">${esc(s.user.email)}</div>
          ${roleBadge}
        </div>

        <nav class="acc-nav">
          <button class="acc-nav-btn ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders">
            <span class="nav-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              <span>${t('acc.tab.orders')}</span>
            </span>
            <span class="acc-nav-badge">${orders.length}</span>
          </button>

          <button class="acc-nav-btn ${activeTab === 'address' ? 'active' : ''}" data-tab="address">
            <span class="nav-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${t('acc.tab.address')}</span>
            </span>
          </button>

          <button class="acc-nav-btn ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
            <span class="nav-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>${t('acc.tab.profile')}</span>
            </span>
          </button>

          <button class="acc-nav-btn ${activeTab === 'security' ? 'active' : ''}" data-tab="security">
            <span class="nav-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>${t('acc.tab.security')}</span>
            </span>
          </button>

          <div class="acc-nav-divider"></div>

          <button class="acc-nav-btn acc-nav-logout" id="acc-logout-btn">
            <span class="nav-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              <span>${t('acc.tab.logout')}</span>
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
                <div class="acc-metric-label">${t('acc.stat.orders')}</div>
                <div class="acc-metric-value">${orders.length} ${t('shop.count', { n: '' }).trim()}</div>
              </div>
            </div>
            <div class="acc-metric-card">
              <div class="acc-metric-icon">🔒</div>
              <div class="acc-metric-info">
                <div class="acc-metric-label">${t('acc.stat.privacy')}</div>
                <div class="acc-metric-value">%100 İsimsiz Paket</div>
              </div>
            </div>
            <div class="acc-metric-card">
              <div class="acc-metric-icon">💬</div>
              <div class="acc-metric-info">
                <div class="acc-metric-label">${t('acc.stat.support')}</div>
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
                      <span class="acc-order-id">#${esc(o.id)}</span>
                      <span class="acc-order-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        ${dateFmt(o.createdAt)}
                      </span>
                    </div>
                    <span class="status-pill st-${esc(o.status)}">
                      ${o.status === 'processing' ? '⏳' : o.status === 'shipped' ? '🚚' : o.status === 'delivered' ? '✅' : '✕'}
                      ${esc(statusTr[o.status] || o.status)}
                    </span>
                  </header>

                  <div class="acc-order-body">
                    ${(o.items || []).map((i) => `
                      <div class="acc-order-item">
                        <div class="acc-item-left">
                          <img class="acc-item-thumb" src="${imgSrc(i.image)}" alt="${esc(i.name)}" loading="lazy">
                          <div>
                            <div class="acc-item-title">${esc(i.name)}</div>
                            <div class="acc-item-qty">${i.qty} adet × ${fmt(i.price)}</div>
                          </div>
                        </div>
                        <div class="acc-item-price">${fmt(i.price * i.qty)}</div>
                      </div>
                    `).join('')}
                  </div>

                  <footer class="acc-order-footer">
                    <div class="acc-order-flags">
                      <span class="acc-order-flag">💳 ${esc(o.payment || 'WhatsApp')}</span>
                      ${o.discreet ? `<span class="acc-order-flag">🔒 ${t('acc.discreet')}</span>` : ''}
                    </div>
                    <div class="acc-order-actions-total">
                      <a class="acc-wa-btn" href="https://wa.me/905436331325?text=${waText}" target="_blank" rel="noopener">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.072-.492-1.758-.727-2.887-2.518-2.975-2.634-.087-.116-.711-.945-.711-1.802 0-.857.449-1.277.608-1.45.16-.174.348-.217.464-.217.116 0 .232.001.333.006.107.005.25.04.39.377.145.348.493 1.202.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.182-.077.355.101.174.449.741.963 1.2 1.077.96 1.543.96 1.761 1.047.218.087.348.072.478-.073.13-.145.565-.652.71-.884.145-.232.29-.188.478-.116.188.072 1.203.565 1.406.667.203.101.339.152.39.239.051.087.051.507-.093.912z"/></svg>
                        <span>${t('acc.ask_wa')}</span>
                      </a>
                      <div class="acc-order-total-block">
                        <div class="acc-total-label">${t('cart.total')}</div>
                        <div class="acc-total-value">${fmt(o.total)}</div>
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
              <h3 style="font-size: 22px; margin-bottom: 8px;">${t('acc.noorders')}</h3>
              <p class="sub" style="max-width: 460px; margin: 0 auto 24px;">${t('acc.noorders.sub')}</p>
              <a class="btn btn-primary" href="/magaza">${t('acc.start')} →</a>
            </div>
          `}
        </section>

        <!-- TAB 2: ADDRESS -->
        <section class="acc-panel ${activeTab === 'address' ? 'active' : ''}" id="panel-address">
          <div class="acc-card-panel">
            <h3>📍 ${t('pf.title.address')}</h3>
            <p class="sub">${t('pf.sub.address')}</p>

            <div class="field">
              <label>${t('pf.addr')}</label>
              <textarea id="dash-ad-full" rows="3" placeholder="Mahalle, cadde, sokak, bina ve daire no...">${esc(a.full || '')}</textarea>
            </div>

            <div class="grid-3" style="margin-top: 14px;">
              <div class="field">
                <label>${t('pf.city')}</label>
                <input id="dash-ad-city" value="${esc(a.city || '')}" placeholder="Örn: Eskişehir">
              </div>
              <div class="field">
                <label>${t('pf.zip')}</label>
                <input id="dash-ad-zip" value="${esc(a.zip || '')}" placeholder="Örn: 26100">
              </div>
              <div class="field">
                <label>${t('pf.phone')}</label>
                <input id="dash-ad-phone" value="${esc(a.phone || '')}" placeholder="05xx xxx xx xx">
              </div>
            </div>

            <div class="checkbox-row" style="margin: 20px 0 24px;">
              <input type="checkbox" id="dash-ad-discreet" ${a.discreet !== false ? 'checked' : ''}>
              <label for="dash-ad-discreet">${t('pf.discreet')}</label>
            </div>

            <button class="btn btn-primary" id="dash-ad-save">
              <span>💾 ${t('pf.saveaddr')}</span>
            </button>
          </div>
        </section>

        <!-- TAB 3: PROFILE -->
        <section class="acc-panel ${activeTab === 'profile' ? 'active' : ''}" id="panel-profile">
          <div class="acc-card-panel">
            <h3>👤 ${t('pf.title.acc')}</h3>
            <p class="sub">${t('pf.sub.acc')}</p>

            <div class="grid-2">
              <div class="field">
                <label>${t('pf.name')}</label>
                <input id="dash-pf-name" value="${esc(s.user.name || '')}">
              </div>
              <div class="field">
                <label>${t('pf.email')} (${LANG === 'tr' ? 'Salt-okunur' : 'Read-only'})</label>
                <input value="${esc(s.user.email || '')}" disabled style="opacity: 0.6; cursor: not-allowed;">
              </div>
            </div>

            <button class="btn btn-primary" id="dash-pf-save" style="margin-top: 20px;">
              <span>💾 ${t('pf.save')}</span>
            </button>
          </div>
        </section>

        <!-- TAB 4: SECURITY -->
        <section class="acc-panel ${activeTab === 'security' ? 'active' : ''}" id="panel-security">
          <div class="acc-card-panel">
            <h3>🔒 ${t('pf.title.pass')}</h3>
            <p class="sub">${t('pf.sub.pass')}</p>

            <div class="grid-2">
              <div class="field">
                <label>${t('pf.new')}</label>
                <input type="password" id="dash-pw-new" placeholder="${LANG === 'tr' ? 'En az 6 karakter' : 'Min. 6 characters'}">
              </div>
              <div class="field">
                <label>${t('pf.new2')}</label>
                <input type="password" id="dash-pw-new2" placeholder="${LANG === 'tr' ? 'Şifrenizi tekrar girin' : 'Confirm new password'}">
              </div>
            </div>

            <button class="btn btn-primary" id="dash-pw-save" style="margin-top: 20px;">
              <span>🔒 ${t('pf.update')}</span>
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
        toast(t('pf.addrok'), '📍');
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
        toast(t('pf.ok'), '✅');
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
      if (p1.length < 6) return toast(t('auth.pass6'), '⚠️');
      if (p1 !== p2) return toast(t('auth.passmismatch'), '⚠️');
      const btn = $('#dash-pw-save', rootEl);
      try {
        if (btn) btn.disabled = true;
        await api('/api/account/password', {
          method: 'POST',
          body: { password: p1 }
        });
        toast(t('pf.passok'), '🔒');
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

  async function initAccount() {
    const root = $('#account-root');
    if (!root) return;
    await renderLuxuryDashboard(root, 'orders');
  }

  async function initProfile() {
    const root = $('#profile-root');
    if (!root) return;
    await renderLuxuryDashboard(root, 'profile');
  }

  /* ================= CONTACT ================= */
  function initContact() {
    const f = $('#contact-form');
    if (!f) return;
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await api('/api/contact', { method: 'POST', body: { name: $('#c-name').value.trim(), email: $('#c-email').value.trim(), message: $('#c-msg').value.trim() } });
        toast(t('contact.ok'), '✅');
        f.reset();
      } catch (err) { toast(err.message, '⚠️'); }
    });
  }

  /* ================= DEPTHDECK COVERFLOW — Perspective Fan (2026) ================= */
  async function initCoverflow(stage) {
    let prods = [];
    try { prods = (await api('/api/products?wheel=1&limit=8')).products; } catch {}
    if (!prods.length) return;

    stage.innerHTML = `
      <div class="cf-ambient" id="cf-amb"></div>
      <div class="cf-scene" id="cf-scene">
        ${prods.map((p, i) => `
        <div class="cf-pos" data-i="${i}">
          <a class="cf-card" href="/urun/${p.slug}" aria-label="${p.name}">
            <img src="${p.image}?v=transparent2" alt="${p.name}" draggable="false">
            <span class="cf-cap"><b>${p.name}</b><em>${fmt(p.price)}${p.oldPrice ? ' <s style="color:#78716C;font-size:10px;font-weight:500">' + fmt(p.oldPrice) + '</s>' : ''}</em></span>
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
    const AUTO_PER_MS = reduced ? 0 : 1 / 4200;
    let center = 0;
    let target = 0;
    let auto = !reduced;
    let down = false, moved = 0, lastX = 0;
    let focusIdx = -1;
    let resumeTimer = null;
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
          colorCache[key] = `rgba(${r},${g},${b},.5)`;
          if (focusIdx >= 0 && prods[focusIdx] === p) apply();
        } catch {}
      };
      im.src = key;
    }

    const smoothF = new Array(N).fill(0);
    let lastLay = performance.now();
    function layout(t) {
      const nowT = t || performance.now();
      const layDt = Math.min(64, Math.max(0, nowT - lastLay)); lastLay = nowT;
      const fk = 1 - Math.exp(-9 * (layDt / 1000));
      const breath = reduced ? 0 : (Math.sin(nowT / 1000 * 1.25) * 0.5 + 0.5);
      const W = scene.clientWidth;
      const rx = W * 0.36;
      const rz = rx * 1.12;
      let best = -1, bestD = Infinity;
      positions.forEach((pos, i) => {
        let d = i - center;
        d = d - Math.round(d / N) * N;
        const theta = d * STEP;
        const depth = (Math.cos(theta) + 1) / 2;
        const fTarget = Math.max(0, 1 - Math.abs(d) / 0.5);
        smoothF[i] += (fTarget - smoothF[i]) * fk;
        const f = smoothF[i];
        const x = Math.sin(theta) * rx;
        const z = (Math.cos(theta) - 1) * rz;
        const y = -(1 - depth) * 22 - f * 6 * breath;
        const rotY = -Math.sin(theta) * 48;
        const scale = (0.70 + depth * 0.30) * (1 + f * 0.024 * breath);
        pos.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        pos.style.zIndex = Math.round(depth * 100);
        pos.style.opacity = (0.50 + depth * 0.50).toFixed(2);
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
      pauseThenResume(4);
    }

    let last = performance.now();
    (function loop(t) {
      const dt = Math.min(64, Math.max(0, t - last)); last = t;
      if (!down) {
        if (auto) { center += AUTO_PER_MS * dt; target = center; }
        else if (Math.abs(target - center) > 0.0004) {
          const k = 1 - Math.exp(-7 * (dt / 1000));
          center += (target - center) * k;
        }
      }
      layout(t);
      barTick();
      requestAnimationFrame(loop);
    })(last);

    scene.addEventListener('pointerdown', (e) => {
      down = true; moved = 0; lastX = e.clientX;
      scene.classList.add('drag');
    });
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      center -= dx / Math.max(140, scene.clientWidth * 0.30);
      target = center;
    };
    const up = () => {
      if (!down) return;
      down = false;
      scene.classList.remove('drag');
      target = Math.round(center);
      pauseThenResume(3);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    scene.addEventListener('click', (e) => { if (moved > 8) { e.preventDefault(); e.stopPropagation(); } }, true);

    cards.forEach((card, i) => card.addEventListener('click', (e) => {
      if (moved > 8) return;
      const d = wrapD(i);
      if (Math.abs(d) < 0.5) return;
      e.preventDefault();
      target = center + d;
      pauseThenResume(4.5);
    }));

    $('#cf-next', stage).addEventListener('click', () => go(1));
    $('#cf-prev', stage).addEventListener('click', () => go(-1));
    stage.setAttribute('tabindex', '0');
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    layout(performance.now());
  }

  /* ================= SOFT SPA NAVIGATION (Zero Flicker / Instant Smooth Transition) ================= */
  let isNavigating = false;
  async function navigateTo(url, pushState = true) {
    if (isNavigating) return;
    const targetUrl = new URL(url, location.origin);
    if (targetUrl.origin !== location.origin) {
      location.href = url;
      return;
    }
    if (targetUrl.pathname.startsWith('/admin') || targetUrl.pathname.startsWith('/api/')) {
      location.href = url;
      return;
    }

    // Always immediately close any open spatial card modal
    closeSpatialCardZoom();

    const mainEl = $('#app-main');
    if (!mainEl) {
      location.href = url;
      return;
    }

    isNavigating = true;
    mainEl.classList.add('is-transitioning');

    try {
      const resp = await fetch(url, {
        headers: {
          'X-Requested-With': 'SPA',
          'x-ls-sid': getClientSid()
        }
      });
      if (!resp.ok) throw new Error('Page fetch failed');
      const htmlText = await resp.text();
      const doc = new DOMParser().parseFromString(htmlText, 'text/html');
      const newMain = doc.querySelector('#app-main');

      if (!newMain) {
        location.href = url;
        return;
      }

      if (pushState) {
        history.pushState({}, '', url);
      }

      // Update document title & metadata
      if (doc.title) document.title = doc.title;

      // Update active nav link states
      $$('nav.top .nav-links a').forEach((a) => {
        const navPath = a.getAttribute('data-nav') || a.getAttribute('href');
        if (navPath) {
          const isActive = navPath === '/' ? targetUrl.pathname === '/' : targetUrl.pathname.startsWith(navPath);
          a.classList.toggle('active', isActive);
        }
      });

      // Update mobile bottom nav active state
      initMobileBottomNav();

      // Update cart count or badges
      refreshCartBadge();

      // Smooth swap
      mainEl.innerHTML = newMain.innerHTML;
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Trigger scroll reveal for newly injected content
      refreshRevealObservers();

      // Re-run page initializers for the active route
      const pageHandlers = [initHome, initShop, initProduct, initReviewForm, initCart, initCheckout, initThanks, initAuth, initAccount, initProfile, initContact];
      pageHandlers.forEach((f) => {
        try { f(); } catch (err) { console.error(err); }
      });

      // Close mobile menu if open
      $('#mobile-menu')?.classList.remove('open');

    } catch (err) {
      console.warn('Soft nav fallback:', err);
      location.href = url;
    } finally {
      setTimeout(() => {
        mainEl.classList.remove('is-transitioning');
        refreshRevealObservers();
        isNavigating = false;
      }, 40);
    }
  }

  function initSpaLinks() {
    if (initSpaLinks.initialized) return;
    initSpaLinks.initialized = true;

    document.addEventListener('click', (e) => {
      // Find closest anchor tag
      const link = e.target.closest('a');
      if (!link) return;

      // Ignore special clicks (new tab, modifiers, download, external, mailto, tel)
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target && link.target !== '_self') return;
      if (link.hasAttribute('download')) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me')) return;

      const dest = new URL(link.href, location.origin);
      if (dest.origin !== location.origin) return;
      if (dest.pathname.startsWith('/admin') || dest.pathname.startsWith('/api/')) return;

      // Prevent concurrent navigation race conditions
      if (isNavigating) return;

      // If user is clicking category chip inside shop page and already in /magaza, let shop filter handle it
      if (location.pathname === '/magaza' && dest.pathname === '/magaza' && dest.searchParams.has('kat')) {
        const cat = dest.searchParams.get('kat');
        const chip = $(`#cat-chips [data-cat="${cat}"]`);
        if (chip) {
          e.preventDefault();
          chip.click();
          history.pushState({}, '', link.href);
          return;
        }
      }

      e.preventDefault();
      navigateTo(link.href);
    });

    window.addEventListener('popstate', () => {
      navigateTo(location.href, false);
    });
  }

  /* boot */
  const globalInit = [initTiltPhysics, initQuickDrawerListeners, initSpaLinks, initQuickSearch, initMobileBottomNav, refreshRevealObservers];
  const pageInit = [initHome, initShop, initProduct, initReviewForm, initCart, initCheckout, initThanks, initAuth, initAccount, initProfile, initContact];

  function runBoot() {
    globalInit.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
    pageInit.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBoot);
  } else {
    runBoot();
  }
})();

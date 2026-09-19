'use strict';
import { initAccount, initProfile } from './modules/account.js?v=2.2.0';
import { initCheckout, initThanks } from './modules/checkout.js?v=2.2.0';
import { initSpatialAnimations, openSpatialCardZoom, closeSpatialCardZoom } from './modules/spatial.js?v=2.2.0';
import { getLocalCart, setLocalCart, updateCartBadge, addToCart, initCart } from './modules/cart.js?v=2.2.0';
import { performLogout, initAuth } from './modules/auth.js?v=2.2.0';
import { api, getClientSid } from './modules/api.js?v=2.2.0';
import { toast, lockBodyScroll, unlockBodyScroll } from './modules/ui.js?v=2.2.0';
import { initCoverflow, destroyCoverflow } from './modules/coverflow.js?v=2.2.0';
import { initContact } from './modules/contact.js?v=2.2.0';
import { initAutoCropNormalizer } from './modules/autocrop.js?v=2.2.0';



  // Gracefully handle browser internal view-transition rejections in iframe environments
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (e) => {
      if (e && e.reason && (String(e.reason).includes('Transition was skipped') || String(e.reason?.message || '').includes('Transition was skipped'))) {
        e.preventDefault();
      }
    });
  }
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
      'nav.login': 'Giriş', 'nav.account': 'Hesabım',
      'added': 'Sepete eklendi',
      'badge.new': 'Yeni', 'badge.hot': 'Çok Satan', 'badge.sale': 'İndirim', 'quickadd': 'Sepete Ekle',
      'nl.bad': 'Geçerli bir e-posta girin', 'nl.ok': 'Aramıza hoş geldin! %10 indirim kodun mailinde.',
      'shop.all': 'Tümü', 'shop.count': '{n} ürün', 'shop.empty': 'Aradığın kriterlere uyan ürün bulunamadı.<br>Filtreleri değiştirmeyi dene.',
      'pd.crumb.home': 'Anasayfa', 'pd.crumb.shop': 'Mağaza', 'pd.reviews': 'değerlendirme',
      'pd.notfound': 'Ürün bulunamadı.', 'pd.notfound.btn': 'Mağazaya Dön',
      'pd.add': 'Sepete Ekle', 'pd.buy': 'Hemen Al',
      'pd.stock.in': 'Stokta, 14:00 öncesi aynı gün kargoda (1-3 iş günü)', 'pd.stock.low': 'Son {n} adet — elini çabuk tut!', 'pd.stock.out': 'Tükendi',
      'pd.trust1': 'Gizli paketleme — dışarıdan içerik anlaşılmaz', 'pd.trust2': '2.000 TL üzeri ücretsiz kargo',
      'pd.trust3': 'Güvenli ve anonim ödeme', 'pd.trust4': 'Hijyen nedeniyle iade yok, hasarlı üründe yenisi gönderilir',
      'pd.tab.detail': 'Detaylar', 'pd.tab.reviews': 'Yorumlar', 'pd.similar': 'Benzer Ürünler', 'pd.all': 'Tümü →',
      'pd.noreviews': 'Bu ürün için henüz onaylanmış yorum yok. İlk yorumu sen yaz!', 'pd.reviewsfail': 'Yorumlar yüklenemedi.', 'pd.write': 'Yorum Yaz',
      'rv.short': 'Lütfen en az 10 karakterlik bir yorum yaz', 'rv.ok': 'Yorumun alındı, onay sonrası yayınlanacak.',
      'cart.empty': 'Sepetin şimdilik boş.<br>Keşfetmeye hazır mısın?', 'cart.empty.btn': 'Mağazayı Keşfet',
      'cart.summary': 'Sipariş Özeti', 'cart.freeship.left': 'Ücretsiz kargoya {x} kaldı!', 'cart.freeship.won': 'Ücretsiz kargo hakkı kazandın!',
      'cart.coupon.ph': 'Kupon kodu', 'cart.apply': 'Uygula', 'cart.coupon.is': 'Kupon: {code}', 'cart.coupon.ok': 'Kupon uygulandı',
      'cart.subtotal': 'Ara toplam', 'cart.shipping': 'Kargo', 'cart.free': 'Ücretsiz', 'cart.discount': 'İndirim', 'cart.total': 'Toplam',
      'cart.checkout': 'Ödemeye Geç →', 'cart.continue': 'Alışverişe Devam Et',
      'cart.remove': 'Kaldır', 'cart.remove.confirm': 'Ürün sepetten kaldırılsın mı?', 'cart.per': '/ adet',
      'ck.step1': 'İletişim Bilgilerin', 'ck.name': 'Ad Soyad *', 'ck.name.ph': 'Adınız Soyadınız', 'ck.phone': 'Telefon *', 'ck.phone.ph': '05xx xxx xx xx',
      'ck.discreet': 'Gizli paketleme istiyorum (dış pakette içerik/mağaza adı yer almaz)',
      'ck.note': 'Sipariş Notu (opsiyonel)', 'ck.note.ph': 'Örn: telefonla ulaşabileceğiniz saat',
      'ck.step2': 'Sipariş & Ödeme Şekli',
      'ck.step2.note': 'Online ödeme altyapımız bulunmuyor. Siparişini <b>WhatsApp üzerinden</b> tamamlıyoruz — en gizli ve pratik yol bu.',
      'ck.pay.wa': 'WhatsApp ile Sipariş', 'ck.pay.wa.sub': 'sepet özetin medyana hazırlanır',
      'ck.pay.shop': 'Mağazadan Teslim & Ödeme', 'ck.pay.shop.sub': 'Ilgaz İş Hanı · Tepebaşı',
      'ck.address': 'Adres *', 'ck.address.ph': 'Mahalle, cadde, no, daire...', 'ck.city': 'Şehir *', 'ck.zip': 'Posta Kodu',
      'ck.summary': 'Özet', 'ck.shipping': 'Kargo', 'ck.summary.total': 'Toplam',
      'ck.submit.wa': 'Siparişi WhatsApp’a Taşı', 'ck.submit.shop': 'Mağazadan Teslim Sipariş Ver',
      'ck.ship.pickup': 'Yok — mağazadan teslim', 'ck.free': 'Ücretsiz',
      'ck.required': 'Ad soyad ve telefon zorunludur', 'ck.addrreq': 'Kargo için adres ve şehir zorunludur', 'ck.preparing': 'Hazırlanıyor…',
      'ck.note.small': '18+ satış politikamız gereği bilgileriniz şifreli iletilir.<br>Ödeme yalnızca WhatsApp üzerinden veya mağazamızda alınır.',
      'ck.ok.pickup': 'Siparişin alındı! Seni mağazada bekliyoruz.', 'ck.ok.ship': 'Siparişin alındı! WhatsApp’a yönlendiriliyorsun.',
      'thanks.amount': 'Tutar: ',
      'auth.hi': 'Hoş geldin, {name}', 'auth.pass6': 'Şifre en az 6 karakter olmalı', 'auth.passmismatch': 'Şifreler eşleşmiyor',
      'auth.age': '18 yaşından büyük olduğunuzu onaylamalısınız', 'auth.created': 'Hesabın oluşturuldu.',
      'auth.google.login': 'Google ile Giriş Yap', 'auth.google.reg': 'Google ile Kayıt Ol',
      'auth.google.wait': 'Google bağlantısı kuruluyor…', 'auth.google.ok': 'Google ile başarıyla giriş yapıldı.',
      'acc.orders': 'Siparişlerim', 'acc.profile': 'Profilim', 'acc.logout': 'Çıkış Yap',
      'acc.hello': 'Merhaba, {name}',
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
      'contact.ok': 'Mesajın alındı, 24 saat içinde dönüş yapacağız.',
      'cf.hint': 'Sürükle · Dokun', 'cf.prev': 'Önceki ürün', 'cf.next': 'Sonraki ürün'
    },
    en: {
      'nav.login': 'Sign in', 'nav.account': 'My Account',
      'added': 'Added to cart',
      'badge.new': 'New', 'badge.hot': 'Best Seller', 'badge.sale': 'Sale', 'quickadd': 'Add to Cart',
      'nl.bad': 'Please enter a valid e-mail', 'nl.ok': 'Welcome to the club! Your 10% discount code is in your inbox.',
      'shop.all': 'All', 'shop.count': '{n} products', 'shop.empty': 'No products match your criteria.<br>Try changing the filters.',
      'pd.crumb.home': 'Home', 'pd.crumb.shop': 'Shop', 'pd.reviews': 'reviews',
      'pd.notfound': 'Product not found.', 'pd.notfound.btn': 'Back to Shop',
      'pd.add': 'Add to Cart', 'pd.buy': 'Buy Now',
      'pd.stock.in': 'In stock, same day dispatch before 14:00 (1-3 days)', 'pd.stock.low': 'Only {n} left — hurry!', 'pd.stock.out': 'Out of stock',
      'pd.trust1': 'Discreet packaging — contents never visible from outside', 'pd.trust2': 'Free shipping over 2,000 TL',
      'pd.trust3': 'Secure & anonymous payment', 'pd.trust4': 'No returns for hygiene; damaged items are replaced',
      'pd.tab.detail': 'Details', 'pd.tab.reviews': 'Reviews', 'pd.similar': 'Similar Products', 'pd.all': 'All →',
      'pd.noreviews': 'No approved reviews for this product yet. Be the first to write one!', 'pd.reviewsfail': 'Reviews could not be loaded.', 'pd.write': 'Write a Review',
      'rv.short': 'Please write a review of at least 10 characters', 'rv.ok': 'Your review has been received and will be published after approval.',
      'cart.empty': 'Your cart is empty for now.<br>Ready to explore?', 'cart.empty.btn': 'Explore the Shop',
      'cart.summary': 'Order Summary', 'cart.freeship.left': '{x} away from free shipping!', 'cart.freeship.won': 'You unlocked free shipping!',
      'cart.coupon.ph': 'Coupon code', 'cart.apply': 'Apply', 'cart.coupon.is': 'Coupon: {code}', 'cart.coupon.ok': 'Coupon applied',
      'cart.subtotal': 'Subtotal', 'cart.shipping': 'Shipping', 'cart.free': 'Free', 'cart.discount': 'Discount', 'cart.total': 'Total',
      'cart.checkout': 'Proceed to Checkout →', 'cart.continue': 'Continue Shopping',
      'cart.remove': 'Remove', 'cart.remove.confirm': 'Remove item from cart?', 'cart.per': '/ each',
      'ck.step1': 'Contact Information', 'ck.name': 'Full Name *', 'ck.name.ph': 'Your full name', 'ck.phone': 'Phone *', 'ck.phone.ph': '05xx xxx xx xx',
      'ck.discreet': 'I want discreet packaging (no store/product name on the outside)',
      'ck.note': 'Order Note (optional)', 'ck.note.ph': 'e.g.: a time window we can reach you by phone',
      'ck.step2': 'Order & Payment Method',
      'ck.step2.note': 'We have no online payment infrastructure. Orders are completed <b>via WhatsApp</b> — the most private and practical way.',
      'ck.pay.wa': 'Order via WhatsApp', 'ck.pay.wa.sub': 'your cart summary is prepared for you',
      'ck.pay.shop': 'Pick Up & Pay in Store', 'ck.pay.shop.sub': 'Ilgaz İş Hanı · Tepebaşı',
      'ck.address': 'Address *', 'ck.address.ph': 'Neighborhood, street, no, apartment...', 'ck.city': 'City *', 'ck.zip': 'Postal Code',
      'ck.summary': 'Summary', 'ck.shipping': 'Shipping', 'ck.summary.total': 'Total',
      'ck.submit.wa': 'Send Order to WhatsApp', 'ck.submit.shop': 'Place Store Pickup Order',
      'ck.ship.pickup': 'None — store pickup', 'ck.free': 'Free',
      'ck.required': 'Full name and phone are required', 'ck.addrreq': 'Address and city are required for shipping', 'ck.preparing': 'Preparing…',
      'ck.note.small': 'Per our 18+ sales policy, your details are transmitted encrypted.<br>Payment is accepted only via WhatsApp or at our store.',
      'ck.ok.pickup': 'Order received! We’ll be waiting for you at the store.', 'ck.ok.ship': 'Order received! Redirecting you to WhatsApp.',
      'thanks.amount': 'Amount: ',
      'auth.hi': 'Welcome, {name}', 'auth.pass6': 'Password must be at least 6 characters', 'auth.passmismatch': 'Passwords do not match',
      'auth.age': 'You must confirm that you are over 18', 'auth.created': 'Your account has been created.',
      'auth.google.login': 'Continue with Google', 'auth.google.reg': 'Sign up with Google',
      'auth.google.wait': 'Connecting to Google…', 'auth.google.ok': 'Signed in with Google successfully.',
      'acc.orders': 'My Orders', 'acc.profile': 'My Profile', 'acc.logout': 'Sign Out',
      'acc.hello': 'Hello, {name}',
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

  window.LS = { fmt, t, lang: LANG, dateFmt, imgSrc, esc, stars };

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
      const iconWrap = mmSwitch.querySelector('.mm-theme-icon-wrap');
      if (iconWrap) {
        iconWrap.innerHTML = dark ? SUN_SVG : MOON_SVG;
      }
      const pill = mmSwitch.querySelector('.mm-switch-pill');
      if (pill) {
        pill.classList.toggle('active', dark);
      }
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
  // getClientSid imported from modules/api.js
  window.getClientSid = getClientSid;

  /* Cart local storage cache for instant rendering and resilient offline/iframe sync */
  // getLocalCart imported from modules/cart.js
  window.getLocalCart = getLocalCart;
  // setLocalCart imported from modules/cart.js
  window.setLocalCart = setLocalCart;

  // api imported from modules/api.js
  window.api = api;
  LS.api = api;

  /* ---------- global logout ---------- */
  // performLogout imported from modules/auth.js
  window.performLogout = performLogout;
  LS.logout = performLogout;

  /* ---------- toast ---------- */
  // toast function is now imported from modules/ui.js
  window.toast = toast; // backward compatibility if needed
  LS.toast = toast;

  window.openSpatialCardZoom = openSpatialCardZoom;
  window.closeSpatialCardZoom = closeSpatialCardZoom;
  LS.openSpatialCardZoom = openSpatialCardZoom;
  LS.closeSpatialCardZoom = closeSpatialCardZoom;

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
    setTimeout(() => { gate.classList.add(`hidden`);
    }, 800);
  };

  if (gate) {
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse|pagespeed|pingdom|gtmetrix|headless/i.test(navigator.userAgent);
    const params = new URLSearchParams(location.search);
    const forceShow = params.has('age') || params.has('gate') || params.has('preview') || params.has('yas');
    if (isBot || (localStorage.getItem(`ls_age_ok_v11`) === `1` && !forceShow)) {
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
      slot.classList.add('has-user');
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
            ${isAdmin ? '<span class="user-btn-crown" title="Yönetici"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>' : '<span class="user-btn-online" title="Aktif Oturum"></span>'}
          </span>
          <span class="user-btn-name">${esc(displayName)}</span>
          <svg class="user-btn-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>

        <div class="user-dropdown-backdrop" id="user-dropdown-backdrop"></div>
        <div class="user-dropdown-menu" id="user-dropdown-menu" role="menu" aria-label="Kullanıcı Menüsü">
          <div class="user-dd-draghandle"></div>
          <div class="user-dd-header">
            <div class="user-dd-avatar ${isAdmin ? 'is-admin' : ''}">${avatarHtml}</div>
            <div class="user-dd-info">
              <div class="user-dd-name">${esc(displayName)}</div>
              <div class="user-dd-email">${esc(user.email || '')}</div>
            </div>
          </div>

          ${isAdmin ? `
            <a href="/admin" class="user-dd-item user-dd-admin-card" role="menuitem">
              <span class="user-dd-admin-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </span>
              <span class="user-dd-admin-title">${LANG === 'tr' ? 'Yönetim Paneli' : 'Admin Panel'}</span>
              <svg class="user-dd-admin-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:auto"><polyline points="9 18 15 12 9 6"></polyline></svg>
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

      // Update mobile menu account link
      const mmAccLink = $('#mm-account-link');
      const mmAccText = $('#mm-account-text');
      const mmLogoutLink = $('#mm-logout-link');
      if (mmAccLink) {
        mmAccLink.setAttribute('href', '/hesap');
        if (mmAccText) mmAccText.textContent = t('nav.account');
      }
      if (mmLogoutLink) mmLogoutLink.style.display = 'flex';

      const btn = $('#user-menu-btn', slot);
      const menu = $('#user-dropdown-menu', slot);
      const backdrop = $('#user-dropdown-backdrop', slot);

      if (btn && menu) {
        const toggleMenu = (open) => {
          const isOpen = open !== undefined ? open : !menu.classList.contains('open');
          menu.classList.toggle('open', isOpen);
          if (backdrop) backdrop.classList.toggle('open', isOpen);
          btn.classList.toggle('active', isOpen);
          btn.setAttribute('aria-expanded', String(isOpen));
        };

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleMenu();
        });
        
        if (backdrop) {
          backdrop.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(false);
          });
        }

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
      slot.classList.remove('has-user');
      slot.innerHTML = `<a href="/giris" class="icon-btn" title="${t('nav.login')}">${USER_SVG}</a>`;
      const mmAccLink = $('#mm-account-link');
      const mmAccText = $('#mm-account-text');
      const mmLogoutLink = $('#mm-logout-link');
      if (mmAccLink) {
        mmAccLink.setAttribute('href', '/giris');
        if (mmAccText) mmAccText.textContent = t('nav.login');
      }
      if (mmLogoutLink) mmLogoutLink.style.display = 'none';
    }
  }

  let resetNavScrolled = () => {};
  const nav = $('nav.top');
  const hdr = $('header');
  if (nav) {
    let isNavScrolled = false;
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      if (!isNavScrolled && y > 20) {
        isNavScrolled = true;
        nav.classList.add('scrolled');
        if (hdr) hdr.classList.add('scrolled');
        document.body.classList.add('scrolled');
      } else if (isNavScrolled && y <= 6) {
        isNavScrolled = false;
        nav.classList.remove('scrolled');
        if (hdr) hdr.classList.remove('scrolled');
        document.body.classList.remove('scrolled');
      }
    };
    resetNavScrolled = () => {
      isNavScrolled = false;
      nav.classList.remove('scrolled');
      if (hdr) hdr.classList.remove('scrolled');
      document.body.classList.remove('scrolled');
    };
    addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    const burger = $('#burger');
    const mm = $('#mobile-menu');
    const mmClose = $('#mm-close');
    const mmBackdrop = $('#mm-backdrop');

    const toggleDrawer = (open) => {
      if (!mm) return;
      const isOpen = open !== undefined ? open : !mm.classList.contains('open');
      mm.classList.toggle('open', isOpen);
      if (mmBackdrop) mmBackdrop.classList.toggle('open', isOpen);
      document.documentElement.classList.toggle('mm-open', isOpen);
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
      const mmLogoutBtn = $('#mm-logout-link');
      if (mmLogoutBtn) {
        mmLogoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          toggleDrawer(false);
          performLogout(location.pathname.startsWith('/hesap') || location.pathname.startsWith('/admin') ? '/' : location.pathname);
        });
      }
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
  // updateCartBadge imported from modules/cart.js
  window.updateCartBadge = updateCartBadge;
  /* ---------- Quick Search Modal (Apple-Grade Fullscreen Search Curtain) ---------- */
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

    let selectedIdx = -1;
    let currentQuery = '';
    let currentResultsList = [];
    let searchTimer = null;

    const quickLinks = LANG === 'en'
      ? [
          { label: 'New Arrivals', sort: 'yeni', url: '/magaza?sort=yeni' },
          { label: 'Bestsellers', filter: 'bestsellers', url: '/magaza?filter=bestsellers' },
          { label: 'Vibrators', cat: 'vibratorler', url: '/magaza?kat=vibratorler' },
          { label: 'Realistic Dildos', cat: 'realistik-dildolar', url: '/magaza?kat=realistik-dildolar' }
        ]
      : [
          { label: 'Yeni Gelenler', sort: 'yeni', url: '/magaza?sort=yeni' },
          { label: 'En Çok Tercih Edilenler', filter: 'bestsellers', url: '/magaza?filter=bestsellers' },
          { label: 'Vibratörler', cat: 'vibratorler', url: '/magaza?kat=vibratorler' },
          { label: 'Realistik Dildolar', cat: 'realistik-dildolar', url: '/magaza?kat=realistik-dildolar' }
        ];

    function renderDefaultSearchState() {
      selectedIdx = -1;
      currentResultsList = [];
      results.innerHTML = `
        <div class="qs-quick-section qs-fade-in">
          <div class="qs-section-heading">${LANG === 'en' ? 'QUICK LINKS' : 'HIZLI BAĞLANTILAR'}</div>
          <div class="qs-apple-list">
            ${quickLinks.map((item, idx) => `
              <button type="button" class="qs-apple-link" data-cat="${esc(item.cat || '')}" data-filter="${esc(item.filter || '')}" data-sort="${esc(item.sort || '')}" data-label="${esc(item.label)}" data-url="${esc(item.url)}" data-idx="${idx}">
                <span class="qs-apple-link-text">${esc(item.label)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      $$('.qs-apple-link', results).forEach((btn) => {
        btn.addEventListener('click', () => {
          const cat = btn.dataset.cat;
          const sort = btn.dataset.sort;
          const filter = btn.dataset.filter;
          const label = btn.dataset.label;
          const url = btn.dataset.url;
          if (label) {
            input.value = label;
            if (clearBtn) clearBtn.style.display = 'flex';
          }
          if (sort === 'yeni') {
            doSearch({ sort: 'yeni', label: label || 'Yeni Gelenler', url: url || '/magaza?sort=yeni' }, true);
          } else if (filter === 'bestsellers') {
            doSearch({ filter: 'bestsellers', label: label || 'En Çok Tercih Edilenler', url: url || '/magaza?filter=bestsellers' }, true);
          } else if (cat) {
            doSearch({ cat: cat, label: label, url: url || `/magaza?kat=${cat}` }, true);
          } else {
            doSearch(label, true);
          }
        });
      });
    }

    function openSearch() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('qs-open');
      lockBodyScroll();
      if (!input.value.trim()) {
        renderDefaultSearchState();
      }
      setTimeout(() => {
        if (modal.classList.contains('open')) {
          input.focus();
        }
      }, 100);
    }

    function closeSearch() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('qs-open');
      unlockBodyScroll();
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
      currentQuery = '';
      renderDefaultSearchState();
      input.focus();
    });

    function updateActiveItem() {
      const items = $$('.qs-item, .qs-apple-link', results);
      items.forEach((item, idx) => {
        const isSelected = idx === selectedIdx;
        item.classList.toggle('selected', isSelected);
        if (isSelected) {
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
    }

    async function doSearch(queryParam, immediate = false) {
      let apiUrl = '';
      let displayHeading = '';
      let viewAllUrl = '';
      let rawQueryText = '';

      if (typeof queryParam === 'object' && queryParam !== null) {
        if (queryParam.sort === 'yeni') {
          apiUrl = '/api/products?sort=yeni&limit=12';
          rawQueryText = queryParam.label || 'Yeni Gelenler';
          displayHeading = `${LANG === 'en' ? 'New Arrivals' : 'Yeni Gelen Ürünler'}`;
          viewAllUrl = queryParam.url || '/magaza?sort=yeni';
        } else if (queryParam.filter === 'bestsellers') {
          apiUrl = '/api/products?filter=bestsellers&limit=12';
          rawQueryText = queryParam.label || 'En Çok Tercih Edilenler';
          displayHeading = `${LANG === 'en' ? 'Bestsellers' : 'En Çok Tercih Edilenler'}`;
          viewAllUrl = queryParam.url || '/magaza?filter=bestsellers';
        } else if (queryParam.cat) {
          apiUrl = '/api/products?cat=' + encodeURIComponent(queryParam.cat) + '&limit=12';
          rawQueryText = queryParam.label || queryParam.cat;
          displayHeading = `${queryParam.label || queryParam.cat}`;
          viewAllUrl = queryParam.url || `/magaza?kat=${encodeURIComponent(queryParam.cat)}`;
        }
      } else {
        const q = String(queryParam || '').trim();
        rawQueryText = q;
        if (!q) {
          if (clearBtn) clearBtn.style.display = 'none';
          renderDefaultSearchState();
          return;
        }
        apiUrl = '/api/products?q=' + encodeURIComponent(q) + '&limit=12';
        displayHeading = `<b>"${esc(q)}"</b>`;
        viewAllUrl = '/magaza?q=' + encodeURIComponent(q);
      }

      currentQuery = rawQueryText;
      if (clearBtn) clearBtn.style.display = 'flex';

      const existingList = $('.qs-items-apple-list', results);
      if (!existingList && !results.querySelector('.qs-loading')) {
        results.innerHTML = `<div class="qs-loading"><div class="spinner"></div></div>`;
      } else if (existingList) {
        results.classList.add('qs-fetching');
      }

      try {
        const res = await api(apiUrl);
        if (currentQuery !== rawQueryText) return; // Prevent race conditions on rapid typing
        results.classList.remove('qs-fetching');

        const list = (res && Array.isArray(res.products)) ? res.products : [];
        currentResultsList = list;
        selectedIdx = -1;

        if (list.length === 0) {
          results.innerHTML = `
            <div class="qs-empty-state qs-fade-in">
              <p>${displayHeading} ${LANG === 'en' ? 'no products found' : 'için ürün bulunamadı'}</p>
              <span style="font-size:13px;color:#9CA3AF;margin-top:6px;display:block;">${LANG === 'en' ? 'Try searching by another keyword or category.' : 'Farklı bir kategori veya anahtar kelime deneyebilirsiniz.'}</span>
            </div>
          `;
          return;
        }

        results.innerHTML = `
          <div class="qs-results-meta qs-fade-in">
            <span>${LANG === 'en' ? `${list.length} products found:` : `${list.length} ürün listelendi:`} ${displayHeading}</span>
            <span class="qs-hint-esc">ESC</span>
          </div>
          <div class="qs-items-apple-list qs-fade-in">
            ${list.map((p, idx) => `
              <a href="/urun/${esc(p.slug)}" class="qs-item" data-id="${p.id}" data-slug="${esc(p.slug)}" data-idx="${idx}">
                <div class="qs-item-media">
                  ${p.image ? `<img src="${imgSrc(p.image)}" alt="${esc(p.name)}" class="qs-item-img" loading="lazy">` : `<div class="qs-item-img" style="background:transparent"></div>`}
                </div>
                <div class="qs-item-info">
                  <div class="qs-item-cat">${esc(p.categoryName || p.category)}</div>
                  <div class="qs-item-name">${esc(p.name)}</div>
                  <div class="qs-item-price-row">
                    <span class="qs-item-price">${fmt(p.price)}</span>
                    ${p.oldPrice ? `<span class="qs-item-old-price">${fmt(p.oldPrice)}</span>` : ''}
                    ${p.stock > 0 ? `<span class="qs-item-stock">● ${LANG === 'en' ? 'In Stock' : 'Stokta'}</span>` : `<span class="qs-item-stock out">● ${LANG === 'en' ? 'Out of Stock' : 'Tükendi'}</span>`}
                  </div>
                </div>
                <div class="qs-item-action">
                  <span class="qs-item-arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </div>
              </a>
            `).join('')}
          </div>
          <a href="${esc(viewAllUrl)}" class="qs-view-all-apple-link qs-fade-in">
            <span>${LANG === 'en' ? 'View all products in catalog' : 'Tüm sonuçları katalogda gör'} (${res.total || list.length})</span>
            <span>→</span>
          </a>
        `;

        $$('.qs-item', results).forEach((link) => {
          link.addEventListener('click', (e) => {
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
              e.preventDefault();
              e.stopPropagation();
              const slug = link.dataset.slug || link.dataset.id;
              closeSearch();
              if (slug && typeof openSpatialCardZoom === 'function') {
                openSpatialCardZoom(slug, null);
              }
            }
          });
        });

        $$('.qs-view-all-apple-link', results).forEach((link) => {
          link.addEventListener('click', () => {
            closeSearch();
          });
        });
      } catch (err) {
        if (currentQuery === rawQueryText) {
          results.classList.remove('qs-fetching');
          results.innerHTML = `<div class="qs-empty-state"><p>${err.message || 'Arama hatası oluştu.'}</p></div>`;
        }
      }
    }

    input.addEventListener('input', () => {
      clearTimeout(searchTimer);
      const val = input.value;
      if (!val.trim()) {
        if (clearBtn) clearBtn.style.display = 'none';
        renderDefaultSearchState();
      } else {
        if (clearBtn) clearBtn.style.display = 'flex';
        // 220ms debounce to prevent flicker on rapid typing
        searchTimer = setTimeout(() => {
          doSearch(val);
        }, 220);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const items = $$('.qs-item, .qs-apple-link', results);
        if (items.length > 0) {
          selectedIdx = (selectedIdx + 1) % items.length;
          updateActiveItem();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const items = $$('.qs-item, .qs-apple-link', results);
        if (items.length > 0) {
          selectedIdx = (selectedIdx - 1 + items.length) % items.length;
          updateActiveItem();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const items = $$('.qs-item, .qs-apple-link', results);
        if (selectedIdx >= 0 && items[selectedIdx]) {
          items[selectedIdx].click();
        } else {
          const q = input.value.trim();
          if (q) {
            closeSearch();
            location.href = '/magaza?q=' + encodeURIComponent(q);
          }
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

  // addToCart imported from modules/cart.js
  window.addToCart = addToCart;
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
  // initTiltPhysics logic moved to modules/spatial.js
  function cleanEditorialTitle(name) {
    if (!name) return '';
    let s = String(name).replace(/\s+/g, ' ').trim();
    s = s.replace(/[\s\-\–\—\:\/\|]+$/, '').trim();
    return s;
  }

  /* ---------- product card template ---------- */
  function productCard(p) {
    const displayName = cleanEditorialTitle(p.name);
    const rawNum = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: p.price % 1 ? 2 : 0 }).format(p.price);
    const priceHtml = `<span class="price"><span class="val">${rawNum}</span> <span class="cur">₺</span></span>`;

    return `
    <article class="prod-card rv vis" data-id="${p.id}" data-slug="${p.slug}">
      <a href="/urun/${p.slug}" class="prod-media" data-slug="${p.slug}">
        ${p.image ? `<img src="${imgSrc(p.image)}" alt="${p.name}" width="320" height="320" loading="lazy" decoding="async">` : `<div style="width:100%;height:100%;background:transparent"></div>`}
        <div class="card-sheen"></div>
      </a>
      <div class="prod-info">
        <a href="/urun/${p.slug}" class="prod-name" title="${esc(p.name)}">${esc(displayName)}</a>
        <div class="prod-price-row">
          ${priceHtml}
          <button type="button" class="editorial-add-btn action-btn" data-add="${p.id}" title="${t('quickadd')}" aria-label="${t('quickadd')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </article>`;
  }
  LS.productCard = productCard;

  function featuredCard(p) {
    return productCard(p);
  }
  LS.featuredCard = featuredCard;

  /* ================= 2026 SPATIAL CARD ZOOM ================= */
  // Spatial zoom and tilt physics moved to modules/spatial.js
  window.openSpatialCardZoom = openSpatialCardZoom;
  window.closeSpatialCardZoom = closeSpatialCardZoom;
  /* ================= HOME ================= */
  async function initHome() {
    refreshRevealObservers();
    const featured = $('#featured-grid');
    if (featured && featured.children.length === 0) {
      const data = await api('/api/products?featured=1&limit=10').catch(() => ({ products: [] }));
      if (data.products && data.products.length) {
        featured.innerHTML = data.products.slice(0, 10).map((p) => featuredCard(p)).join('');
        refreshRevealObservers();
      }
    }
    const wheel = $('#cf-stage');
    if (wheel) initCoverflow(wheel);
    const best = $('#new-grid');
    if (best && best.children.length === 0) {
      const data = await api('/api/products?sort=new&limit=6').catch(() => ({ products: [] }));
      if (data.products && data.products.length) {
        best.innerHTML = data.products.slice(0, 6).map(productCard).join('');
        refreshRevealObservers();
      }
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
    'anal-urunler': 'Anal Products',
    'anal-urun': 'Anal Products',
    'erkek-ve-kadinlar': 'Anal Products',
    'dildo': 'Dildos',
    'realistik-dildolar': 'Realistic Dildos',
    'erkek-cinsel-saglik-urunu': 'Men\u2019s Sexual Health',
    'erkek-cinsel-saglik': 'Men\u2019s Sexual Health',
    'erkekler': 'Men\u2019s Sexual Health',
    'fantezi-fetis-urunu': 'Fantasy & Fetish',
    'fetish-urunler': 'Fetish Products',
    'fantezi-ic-giyim': 'Fantasy Lingerie',
    'kadin-cinsel-saglik-urunu': 'Women\u2019s Sexual Health',
    'kadin-cinsel-saglik': 'Women\u2019s Sexual Health',
    'kadinlar': 'Women\u2019s Sexual Health',
    'sisme-manken': 'Sex Dolls',
    'realistik-mankenler': 'Realistic Dolls',
    'vajina-masturbator': 'Vaginas & Masturbators',
    'ciftler': 'Realistic Vaginas',
    'realistik-vajinalar': 'Realistic Vaginas',
    'vibrator': 'Vibrators',
    'vibratorler': 'Vibrators',
    'vibratori': 'Vibrators',
    'kozmetik': 'Cosmetics',
    'fantasy': 'Fantasy',
    'oyunlar': 'Games',
    'knot': 'Knot'
  };
  function catName(slug, name) {
    let res = name || CAT_EN[slug] || slug;
    if (slug === 'erkekler' || res === 'Erkek Sağlık' || res === 'Erkek Saglik') return 'Erkek Cinsel Sağlık';
    if (slug === 'erkek-ve-kadinlar' || slug === 'anal-urunler' || slug === 'anal-urun') return 'Anal Ürünler';
    if (LANG === 'en' && CAT_EN[slug]) return CAT_EN[slug];
    return res;
  }
  window.LS.catName = catName;
  LS.catName = catName;

  /* ================= SHOP ================= */
  async function initShop() {
    const root = $('#shop-root');
    if (!root) return;
    const urlParams = new URLSearchParams(location.search);
    const state = {
      cat: urlParams.get('kat') || urlParams.get('cat') || 'hepsi',
      subcat: urlParams.get('altkat') || urlParams.get('subcat') || '',
      q: urlParams.get('q') || '',
      sort: urlParams.get('sort') || 'onerilen',
      filter: urlParams.get('filter') || ''
    };
    const catWrap = $('#cat-chips');

    function matchCat(pCat, fCat) {
      if (!fCat || fCat === 'hepsi' || fCat === 'all') return true;
      if (!pCat) return false;
      if (pCat === fCat) return true;
      const norm = (s) => {
        const x = (s || '').toLowerCase().trim();
        if (x === 'vibratorler' || x === 'vibrator' || x === 'vibratori') return 'vibratorler';
        if (x === 'realistik-dildolar' || x === 'dildo' || x === 'dildolar') return 'realistik-dildolar';
        if (x === 'realistik-mankenler' || x === 'sisme-manken' || x === 'mankenler' || x === 'realistik-manken') return 'realistik-mankenler';
        if (x === 'ciftler' || x === 'realistik-vajinalar' || x === 'vajina-masturbator' || x === 'realistik-vajina') return 'ciftler';
        if (x === 'fetish-urunler' || x === 'fetish' || x === 'fetis') return 'fetish-urunler';
        if (x === 'fantezi-ic-giyim' || x === 'ic-giyim' || x === 'fantezi-giyim') return 'fantezi-ic-giyim';
        if (x === 'erkekler' || x === 'erkek-cinsel-saglik' || x === 'erkek-saglik') return 'erkekler';
        if (x === 'kadinlar' || x === 'kadin-cinsel-saglik' || x === 'kadin-saglik') return 'kadinlar';
        if (x === 'erkek-ve-kadinlar' || x === 'anal-urunler' || x === 'anal-urun' || x === 'anal') return 'anal-urunler';
        return x;
      };
      return norm(pCat) === norm(fCat);
    }

    function closeAccordion(groupEl) {
      if (!groupEl) return;
      const panel = groupEl.querySelector('.subcat-panel');
      const btn = groupEl.querySelector('.chip');
      const chevron = groupEl.querySelector('.chevron-icon');
      if (panel) {
        panel.style.maxHeight = '0px';
        panel.style.opacity = '0';
        panel.classList.remove('open');
      }
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.classList.remove('rotated');
    }

    function openAccordion(groupEl) {
      if (!groupEl) return;
      const panel = groupEl.querySelector('.subcat-panel');
      const btn = groupEl.querySelector('.chip');
      const chevron = groupEl.querySelector('.chevron-icon');
      if (panel) {
        panel.classList.add('open');
        panel.style.maxHeight = (panel.scrollHeight || 300) + 'px';
        panel.style.opacity = '1';
      }
      if (btn) btn.setAttribute('aria-expanded', 'true');
      if (chevron) chevron.classList.add('rotated');
    }

    function closeAllAccordions(exceptGroupEl = null) {
      if (!catWrap) return;
      $$('.cat-accordion-group', catWrap).forEach((g) => {
        if (g !== exceptGroupEl) {
          closeAccordion(g);
        }
      });
    }

    function updateMobileLabel() {
      const activeLabelEl = $('#mobile-filter-active-label');
      if (!activeLabelEl) return;
      if (state.cat === 'hepsi' || !state.cat) {
        activeLabelEl.textContent = t('shop.all');
        return;
      }
      let foundName = '';
      if (state.subcat && catWrap) {
        const activeSubBtn = catWrap.querySelector(`.subchip[data-subcat="${state.subcat}"]`);
        if (activeSubBtn) {
          foundName = activeSubBtn.textContent.trim();
        }
      }
      if (!foundName && catWrap) {
        const activeCatBtn = catWrap.querySelector(`.chip[data-cat="${state.cat}"] .chip-label, .chip[data-cat="${state.cat}"]`);
        if (activeCatBtn) {
          foundName = activeCatBtn.textContent.trim();
        } else {
          foundName = state.cat;
        }
      }
      activeLabelEl.textContent = foundName || t('shop.all');
    }

    function syncChipState() {
      if (!catWrap) return;
      const isHepsi = state.cat === 'hepsi' || !state.cat;

      // "Tümü" chip
      const hepsiChip = catWrap.querySelector('[data-cat="hepsi"]');
      if (hepsiChip) hepsiChip.classList.toggle('on', isHepsi);

      // Accordion groups
      $$('.cat-accordion-group', catWrap).forEach((group) => {
        const groupCat = group.dataset.groupCat;
        const isCatMatch = !isHepsi && matchCat(groupCat, state.cat);
        const mainChip = group.querySelector('.chip');
        if (mainChip) {
          mainChip.classList.toggle('on', isCatMatch);
        }

        // Subchips
        $$('.subchip', group).forEach((subBtn) => {
          const sSlug = subBtn.dataset.subcat;
          const isSubOn = isCatMatch && (state.subcat === sSlug);
          subBtn.classList.toggle('on', isSubOn);
        });

        // Ensure ONLY the active category accordion is open; others are strictly closed
        const hasSub = !!group.querySelector('.subcat-panel');
        if (isCatMatch && hasSub) {
          closeAllAccordions(group);
          openAccordion(group);
        } else if (!isCatMatch) {
          closeAccordion(group);
        }
      });

      // Update any stand-alone chips (without subcategories)
      $$('#cat-chips > .chip:not([data-cat="hepsi"])', catWrap).forEach((b) => {
        const bCat = b.dataset.cat;
        b.classList.toggle('on', !isHepsi && matchCat(bCat, state.cat));
      });

      updateMobileLabel();
    }

    function updateUrl() {
      const p = new URLSearchParams();
      if (state.cat && state.cat !== 'hepsi') p.set('kat', state.cat);
      if (state.subcat) p.set('altkat', state.subcat);
      if (state.q) p.set('q', state.q);
      if (state.sort && state.sort !== 'onerilen') p.set('sort', state.sort);
      if (state.filter) p.set('filter', state.filter);
      const qs = p.toString();
      history.replaceState(null, '', qs ? `/magaza?${qs}` : '/magaza');
    }

    // Mobile drawer controls
    const asideFilters = $('#shop-filters-aside');
    const backdrop = $('#filters-backdrop');
    const mobileTrigger = $('#mobile-filter-trigger');
    const closeBtn = $('#filters-drawer-close');

    function openMobileDrawer() {
      if (!asideFilters) return;
      asideFilters.classList.add('drawer-open');
      if (backdrop) backdrop.classList.add('active');
      lockBodyScroll();
    }

    function closeMobileDrawer() {
      if (!asideFilters) return;
      if (!asideFilters.classList.contains('drawer-open')) return;
      asideFilters.classList.remove('drawer-open');
      if (backdrop) backdrop.classList.remove('active');
      unlockBodyScroll();
    }

    if (mobileTrigger) {
      mobileTrigger.onclick = (e) => {
        e.preventDefault();
        openMobileDrawer();
      };
    }
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.preventDefault();
        closeMobileDrawer();
      };
    }
    if (backdrop) {
      backdrop.onclick = () => {
        closeMobileDrawer();
      };
      // Prevent any touch scrolling on the backdrop from propagating to underlying page
      backdrop.addEventListener('touchmove', (e) => {
        e.preventDefault();
      }, { passive: false });
    }

    if (asideFilters) {
      let touchStartY = 0;
      asideFilters.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length) {
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      asideFilters.addEventListener('touchmove', (e) => {
        if (!asideFilters.classList.contains('drawer-open')) return;
        if (!e.touches || !e.touches.length) return;
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - touchStartY;
        const isAtTop = asideFilters.scrollTop <= 0;
        const isAtBottom = asideFilters.scrollTop + asideFilters.clientHeight >= asideFilters.scrollHeight - 1;

        // Prevent iOS Safari rubber-band scrolling when pulling past top or bottom boundaries
        if (isAtTop && deltaY > 0) {
          e.preventDefault();
        } else if (isAtBottom && deltaY < 0) {
          e.preventDefault();
        }
      }, { passive: false });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && asideFilters && asideFilters.classList.contains('drawer-open')) {
        closeMobileDrawer();
      }
    });

    function bindChips() {
      if (!catWrap) return;

      // 1. "Tümü" button: resets cat to hepsi, closes any open accordion, filters all products
      const hepsiBtn = catWrap.querySelector('[data-cat="hepsi"]');
      if (hepsiBtn) {
        hepsiBtn.onclick = (e) => {
          e.preventDefault();
          state.cat = 'hepsi';
          state.subcat = '';
          closeAllAccordions();
          syncChipState();
          updateUrl();
          closeMobileDrawer();
          load();
        };
      }

      // 2. Category group buttons
      $$('.cat-accordion-group', catWrap).forEach((group) => {
        const chipBtn = group.querySelector('.chip');
        const panel = group.querySelector('.subcat-panel');
        const hasSub = chipBtn && chipBtn.classList.contains('has-sub') && !!panel;
        const targetCat = group.dataset.groupCat;

        if (chipBtn) {
          chipBtn.onclick = (e) => {
            e.preventDefault();
            if (!hasSub) {
              // Single-level category (no subcategories)
              closeAllAccordions();
              state.cat = targetCat;
              state.subcat = '';
              syncChipState();
              updateUrl();
              closeMobileDrawer();
              load();
              return;
            }

            // Category WITH subcategories
            const isCurrentlyOpen = panel.classList.contains('open');
            if (isCurrentlyOpen) {
              // If already open and clicked, toggle close, but preserve category filter
              closeAccordion(group);
            } else {
              // Close any other open category accordion! Only 1 can be open!
              closeAllAccordions(group);
              openAccordion(group);
              state.cat = targetCat;
              state.subcat = ''; // Reset subcategory when switching main category
              syncChipState();
              updateUrl();
              load();
            }
          };
        }

        // 3. Subcategory buttons
        $$('.subchip', group).forEach((subBtn) => {
          subBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parentCat = subBtn.dataset.cat || targetCat;
            const targetSub = subBtn.dataset.subcat;

            state.cat = parentCat;
            state.subcat = targetSub;

            // Make sure only this group is open
            closeAllAccordions(group);
            openAccordion(group);
            syncChipState();
            updateUrl();
            closeMobileDrawer();
            load();
          };
        });
      });

      // 4. Any direct chips not in an accordion group
      $$('#cat-chips > .chip:not([data-cat="hepsi"])', catWrap).forEach((b) => {
        b.onclick = (e) => {
          e.preventDefault();
          closeAllAccordions();
          state.cat = b.dataset.cat;
          state.subcat = '';
          syncChipState();
          updateUrl();
          closeMobileDrawer();
          load();
        };
      });
    }

    bindChips();
    syncChipState();

    const search = $('#shop-search');
    if (search) {
      if (state.q && search.value !== state.q) search.value = state.q;
      let tTimer;
      search.oninput = () => {
        clearTimeout(tTimer);
        tTimer = setTimeout(() => {
          state.q = search.value.trim();
          updateUrl();
          load();
        }, 300);
      };
    }

    const sortPill = $('#shop-sort-pill');
    const sortMenu = $('#shop-sort-menu');
    const sortSel = $('#shop-sort');

    function updateSortLabel() {
      const sortActiveLabel = $('#sort-active-label');
      const activeItem = sortMenu ? sortMenu.querySelector(`.sort-menu-item[data-val="${state.sort}"]`) : null;
      if (activeItem && sortActiveLabel) {
        const textSpan = activeItem.querySelector('span');
        if (textSpan) {
          sortActiveLabel.textContent = textSpan.textContent.trim();
        }
      }
      if (sortMenu) {
        $$('.sort-menu-item', sortMenu).forEach(item => {
          if (item.getAttribute('data-val') === state.sort) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
      if (sortSel) {
        sortSel.value = state.sort;
      }
    }

    if (sortPill && sortMenu) {
      sortPill.addEventListener('click', (e) => {
        const item = e.target.closest('.sort-menu-item');
        if (item) {
          const val = item.getAttribute('data-val');
          if (val && val !== state.sort) {
            state.sort = val;
            updateSortLabel();
            updateUrl();
            load();
          }
          sortPill.classList.remove('open');
          sortPill.setAttribute('aria-expanded', 'false');
          return;
        }
        const isOpen = sortPill.classList.contains('open');
        if (isOpen) {
          sortPill.classList.remove('open');
          sortPill.setAttribute('aria-expanded', 'false');
        } else {
          sortPill.classList.add('open');
          sortPill.setAttribute('aria-expanded', 'true');
        }
      });

      // Close on click outside
      document.addEventListener('click', (e) => {
        if (!sortPill.contains(e.target)) {
          sortPill.classList.remove('open');
          sortPill.setAttribute('aria-expanded', 'false');
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sortPill.classList.contains('open')) {
          sortPill.classList.remove('open');
          sortPill.setAttribute('aria-expanded', 'false');
        }
      });

      updateSortLabel();
    }

    async function load() {
      const hasCards = !!root.querySelector('.prod-grid');
      if (!hasCards) {
        root.innerHTML = '<div class="spinner"></div>';
      }
      const p = new URLSearchParams();
      if (state.cat && state.cat !== 'hepsi') p.set('cat', state.cat);
      if (state.subcat) p.set('subcat', state.subcat);
      if (state.q) p.set('q', state.q);
      if (state.filter) p.set('filter', state.filter);
      p.set('sort', state.sort);
      p.set('limit', '50');
      const data = await api('/api/products?' + p).catch(() => ({ products: [], total: 0 }));
      const count = $('#results-count');
      if (count) count.textContent = t('shop.count', { n: data.total });
      root.innerHTML = data.products.length
        ? `<div class="prod-grid">${data.products.map(productCard).join('')}</div>`
        : `<div class="empty-state"><div class="big"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div><p>${t('shop.empty')}</p></div>`;
      $$('article', root).forEach((el) => { el.classList.add('vis'); });
      refreshRevealObservers();
      updateMobileLabel();
      updateSortLabel();
    }

    // Handle browser popstate
    window.addEventListener('popstate', () => {
      const up = new URLSearchParams(location.search);
      state.cat = up.get('kat') || up.get('cat') || 'hepsi';
      state.subcat = up.get('altkat') || up.get('subcat') || '';
      state.q = up.get('q') || '';
      state.sort = up.get('sort') || 'onerilen';
      state.filter = up.get('filter') || '';
      if (sortSel) sortSel.value = state.sort;
      updateSortLabel();
      syncChipState();
      load();
    });

    // If root does not have server-rendered products or empty-state, fetch from API
    const hasInitialContent = root.querySelector('.prod-grid') || root.querySelector('.empty-state');
    if (!hasInitialContent) {
      load();
    } else {
      $$('article', root).forEach((el) => { el.classList.add('vis'); });
      refreshRevealObservers();
    }
  }

  /* ================= PRODUCT DETAIL ================= */
  async function initProduct() {
    const root = $('#product-root');
    if (!root) return;
    const parts = location.pathname.split('/').filter(Boolean);
    const rawSlug = parts.pop() || '';
    const slug = decodeURIComponent(rawSlug).replace(/\/+$/, '').trim();
    const notFoundSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;
    if (!slug || slug === 'urun') {
      root.innerHTML = `<div class="empty-state"><div class="big">${notFoundSvg}</div><p>${t('pd.notfound')}</p><a class="btn btn-primary" href="/magaza" style="margin-top:16px">${t('pd.notfound.btn')}</a></div>`;
      return;
    }
    let p;
    try {
      const res = await api('/api/products/' + encodeURIComponent(slug));
      p = res.product || res;
      if (!p || !p.id) throw new Error('notfound');
    } catch {
      root.innerHTML = `<div class="empty-state"><div class="big">${notFoundSvg}</div><p>${t('pd.notfound')}</p><a class="btn btn-primary" href="/magaza" style="margin-top:16px">${t('pd.notfound.btn')}</a></div>`;
      return;
    }
    document.title = p.name + ' — LOVE SHOP';
    const productGallery = (Array.isArray(p.gallery) && p.gallery.length) ? p.gallery : (p.image ? [p.image] : []);
    const hasMultipleImages = productGallery.length > 1;

    function getProductProfile(prod) {
      if (Array.isArray(prod.specsTable) && prod.specsTable.length > 0) {
        return {
          chips: Array.isArray(prod.specChips) ? prod.specChips : [],
          table: prod.specsTable,
          careTitle: prod.careTitle || 'Kullanım ve Güvenlik Rehberi',
          careText: prod.careText || ''
        };
      }

      const name = (prod.name || '').toLowerCase();
      const cat = (prod.category || '').toLowerCase();
      const rawDesc = `${prod.name || ''} ${prod.description || ''} ${prod.longDescription || ''}`;
      const text = rawDesc.toLowerCase();

      // ==========================================
      // STRICT NLP & REGEX TEXT EXTRACTOR HELPERS
      // ==========================================

      // 1. Extract explicit or context usage instructions
      function extractUsageInstruction(rawText) {
        if (!rawText) return null;
        // Priority 1: Match explicit usage label: "Kullanım Şekli: ...", "Kullanım Talimatı: ...", "Nasıl Kullanılır: ..."
        const explicitMatch = rawText.match(/(?:kullanım(?:\s*talimatı|\s*şekli|ı)?|nasıl\s+kullanılır|uygulama(?:\s*şekli)?)\s*[:：-]\s*([^\n\r]+)/i);
        if (explicitMatch && explicitMatch[1].trim().length > 6) {
          let s = explicitMatch[1].trim();
          // Trim at sentence end if it carries too many combined sentences
          const firstDot = s.indexOf('.');
          if (firstDot > 25 && firstDot < s.length - 1) {
            s = s.slice(0, firstDot + 1);
          }
          return s;
        }

        // Priority 2: Extract sentence containing direct action verbs
        const sentences = rawText.split(/(?<=[.!?])\s+|\n+/);
        for (const sen of sentences) {
          const s = sen.trim();
          const sLower = s.toLowerCase();
          if (
            (sLower.includes('damlatılır') || sLower.includes('damlatarak') || sLower.includes('dilaltı') ||
             sLower.includes('içecekle') || sLower.includes('tüketilir') || sLower.includes('içilir') ||
             sLower.includes('uygulanır') || sLower.includes('masaj') || sLower.includes('sürülür') || 
             sLower.includes('püskürtülür') || sLower.includes('öncesinde') || sLower.includes('kullanılır')) &&
            s.length >= 15 && s.length <= 250
          ) {
            return s;
          }
        }
        return null;
      }

      // 2. Extract exact Waterproof / IPX rating (NO HALLUCINATIONS)
      function extractWaterproof(rawText) {
        if (!rawText) return null;
        const ipxMatch = rawText.match(/\bip(?:x|v)?([0-9])\b/i);
        if (ipxMatch) {
          const lvl = ipxMatch[1];
          if (lvl === '0') return 'Su Dayanımı Bulunmuyor (Kuru Kullanım)';
          if (lvl === '1' || lvl === '2') return `IPX${lvl} (Damlama Korumalı)`;
          if (lvl === '3') return 'IPX3 (Sıçramalara Karşı Dayanıklı)';
          if (lvl === '4') return 'IPX4 (Sıçrama ve Ter Korumalı)';
          if (lvl === '5') return 'IPX5 (Su Püskürtmelerine Karşı Dayanıklı)';
          if (lvl === '6') return 'IPX6 (Güçlü Su Akıntılarına Karşı Dayanıklı)';
          if (lvl === '7') return 'IPX7 (1 Metreye Kadar Su Geçirmez)';
          if (lvl === '8') return 'IPX8 (Tamamen Su Altı Kullanımına Uygun Su Geçirmez)';
          return `IPX${lvl} Su Koruma Sertifikalı`;
        }
        if (rawText.includes('tamamen su geçirmez') || rawText.includes('100% su geçirmez') || rawText.includes('%100 su geçirmez') || rawText.includes('waterproof')) {
          return '100% Su Geçirmez (Duş ve Jakuzi Uyumlu)';
        }
        if (rawText.includes('suya dayanıklı') || rawText.includes('su sıçrama') || rawText.includes('splashproof')) {
          return 'Su Sıçramalarına Karşı Dayanıklı';
        }
        return null;
      }

      // 3. Extract exact Power / Battery mechanism
      function extractPower(rawText) {
        if (!rawText) return null;
        const t = rawText.toLowerCase();
        if (t.includes('manyetik') && (t.includes('şarj') || t.includes('usb'))) return 'Manyetik Hızlı USB Şarj';
        if (t.includes('type-c') || t.includes('type c')) return 'Type-C Hızlı USB Şarj';
        if (t.includes('usb') && (t.includes('şarj') || t.includes('kablo') || t.includes('şarjlı'))) return 'USB ile Şarj Edilebilir (Dahili Li-Ion Akü)';
        if (t.includes('şarj edilebilir') || t.includes('şarjlı')) return 'Şarj Edilebilir Dahili Batarya';
        if (t.includes('2xaaa') || t.includes('2 x aaa')) return '2x AAA İnce Pil ile Çalışır';
        if (t.includes('1xaaa') || t.includes('1 x aaa')) return '1x AAA İnce Pil ile Çalışır';
        if (t.includes('2xaa') || t.includes('2 x aa')) return '2x AA Kalem Pil ile Çalışır';
        if (t.includes('pilli') || t.includes('pil ile') || t.includes('aaa') || t.includes('aa pil') || t.includes('pille')) return 'Pille Çalışır (Değiştirilebilir Pil)';
        return null;
      }

      // 4. Extract Material accurately
      function extractMaterial(rawText) {
        if (!rawText) return null;
        const t = rawText.toLowerCase();
        if (t.includes('medikal platin') || t.includes('platinum silikon')) return 'Medikal Platinum Silikon';
        if (t.includes('medikal sıvı silikon') || t.includes('sıvı silikon') || t.includes('liquid silicone')) return 'Medikal Sınıf Sıvı Silikon';
        if (t.includes('medikal silikon')) return 'Medikal Gövde Silikonu';
        if (t.includes('silikon') || t.includes('silicone')) return 'Ten Dostu Biyo-Uyumlu Silikon';
        if (t.includes('tpe') || t.includes('cyberskin') || t.includes('tpr')) return 'Medikal Realistik TPE / TPR';
        if (t.includes('borosilikat') || t.includes('cam dildo') || t.includes('medikal cam')) return 'Borosilikat Medikal Cam';
        if (t.includes('paslanmaz çelik') || t.includes('çelik') || t.includes('metal')) return 'Medikal Paslanmaz Çelik';
        if (t.includes('akrilik') || t.includes('pleksi')) return 'Dayanıklı Şeffaf Medikal Akrilik';
        if (t.includes('vegan deri') || t.includes('suni deri')) return 'Premium Vegan Deri';
        if (t.includes('deri')) return 'Yüksek Kalite Deri & Krom';
        if (t.includes('lateks') || t.includes('latex')) return 'Klinik Onaylı Doğal Lateks';
        if (t.includes('silikon bazlı')) return 'Silikon Bazlı Formül';
        if (t.includes('su bazlı')) return 'Su Bazlı Formül';
        return null;
      }

      // 5. Extract Modes / Speeds
      function extractModes(rawText) {
        if (!rawText) return null;
        const match = rawText.match(/(\d+)\s*(?:farklı\s*)?(?:titreşim|hız|frekans|mod|program|fonksiyon)/i);
        if (match) return `${match[1]} Farklı Titreşim & Ritim Modu`;
        if (rawText.toLowerCase().includes('app') || rawText.toLowerCase().includes('telefon') || rawText.toLowerCase().includes('bluetooth')) {
          return 'Mobil Uygulama / Uzaktan Akıllı Kontrol';
        }
        return null;
      }

      // 6. Metric extractors
      const mlMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:ml|mililitre)/i);
      const mlVal = mlMatch ? `${mlMatch[1].replace(',', '.')} ml` : null;

      const cmMatch = text.match(/(\d+(?:[.,]\d+)?)\s*cm/i);
      const cmVal = cmMatch ? `${cmMatch[1].replace(',', '.')} cm` : null;

      const kgMatch = text.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
      const kgVal = kgMatch ? `${kgMatch[1].replace(',', '.')} Kg` : null;

      const countMatch = name.match(/(\d+)\s*['’]?(?:li|lı|lu|lü|adet)/i) || text.match(/(\d+)\s*(?:adet|lü|lı|li|lu)/i);
      const countVal = countMatch ? `${countMatch[1]} Adet` : null;

      const usesMatch = text.match(/(\d+\s*\+?\s*(?:kullanım|doz|puf|püskürtme|porsiyon))/i);
      const usesCount = usesMatch ? usesMatch[1].trim() : null;

      const detectedUsage = extractUsageInstruction(rawDesc);
      const detectedWaterproof = extractWaterproof(rawDesc);
      const detectedPower = extractPower(rawDesc);
      const detectedMaterial = extractMaterial(rawDesc);
      const detectedModes = extractModes(rawDesc);

      // ==========================================
      // CATEGORY & TYPE HANDLING
      // ==========================================

      // 1. CONDON / RING / SLEEVE
      const isRingOrSleeve = (
        name.includes('halka') || name.includes('ring') || name.includes('kılıf') ||
        name.includes('sleeve') || name.includes('prezervatif') || name.includes('kondom') ||
        text.includes('penis halka') || text.includes('ereksiyon halka') || text.includes('geciktirici halka')
      ) && !name.includes('sprey') && !name.includes('jel') && !name.includes('krem') && !name.includes('damla');

      if (isRingOrSleeve) {
        const isSleeve = name.includes('kılıf') || name.includes('sleeve');
        const isCondom = name.includes('prezervatif') || name.includes('kondom');

        if (isCondom) {
          const packText = countVal ? `${countVal} Paket İçeriği` : 'Özel Koruyucu Paket';
          return {
            chips: [
              { k: 'Ürün Tipi', v: 'Prezervatif & Koruyucu' },
              { k: 'Paket', v: packText },
              { k: 'Doku', v: text.includes('tırtıklı') ? 'Tırtıklı & Kabartmalı' : 'Ultra İnce & Doğal Hissiyat' },
              { k: 'Uyum', v: '%100 Standart Uyum' }
            ],
            table: [
              ['Ürün Adı', prod.name],
              ['Ürün Tipi', 'Koruyucu Prezervatif & Lateks Kılıf'],
              ['Paket İçeriği', packText],
              ['Malzeme Yapısı', detectedMaterial || 'Klinik Onaylı Doğal Lateks / Polyisoprene'],
              ['Kayganlaştırıcı', 'Rezervuar uçlu, ekstra kayganlaştırıcı kaplamalı'],
              ['Test & Kalite', '%100 Elektronik Olarak Test Edilmiş Hijyen Standartları']
            ],
            careTitle: 'Kullanım ve Güvenlik Rehberi',
            careText: 'Tek kullanımlıktır. Doğrudan güneş ışığı almayan, serin ve kuru bir ortamda son kullanma tarihine kadar muhafaza ediniz. Açarken kılıfa zarar vermemek için kesici aletler kullanmayınız.'
          };
        }

        return {
          chips: [
            { k: 'Ürün Tipi', v: isSleeve ? 'Erkeksi Uzatmalı Kılıf' : 'Ereksiyon & Destek Halkası' },
            { k: 'Malzeme', v: detectedMaterial || 'Ultra Esnek Medikal Silikon/TPR' },
            { k: 'Beden', v: '%100 Tüm Boyutlara Uyumlu' },
            { k: 'Temizlik', v: 'Ilık Sabunlu Su' }
          ],
          table: [
            ['Ürün Adı', prod.name],
            ['Ürün Tipi', isSleeve ? 'Erkeksi Uzatmalı & Dokulu Penil Kılıf' : 'Erkeksi Performans & Ereksiyon Destek Halkası'],
            ['Gövde Malzemesi', detectedMaterial || 'Yüksek elastikiyete sahip, ten dostu Medikal Silikon / TPR (Ftalatsız)'],
            ['Beden / Esneklik', 'Yüksek esneme kabiliyeti sayesinde tüm boyutlara %100 konforlu uyum sağlar'],
            ['Kullanım Amacı', isSleeve ? 'Ekstra hacim, doku ve haz artırıcı koruyucu yapı' : 'Ereksiyon süresini ve kan dolaşımını destekleyici ergonomik yapı'],
            ['Temizlik & Bakım', 'Ilık su ve nötr sabun ile yıkayıp kurutarak tekrar güvenle kullanabilirsiniz']
          ],
          careTitle: 'Kullanım ve Bakım Rehberi',
          careText: 'Konforlu kullanım ve kolay takma/çıkarma için su bazlı kayganlaştırıcı jel ile kullanılması tavsiye edilir. Kullanımdan önce ve sonra ılık sabunlu su ile yıkayınız. Aşırı germeden nazikçe takıp çıkarınız. Kuru, serin ve doğrudan güneş ışığı almayan bir yerde muhafaza ediniz.'
        };
      }

      // 2. COSMETICS / HEALTH / SPRAYS / CREAMS / LUBES / DROPS / OILS
      const isCosmetic = (
        name.includes('sprey') || name.includes('spray') || name.includes('jel') || name.includes('gel') ||
        name.includes('krem') || name.includes('cream') || name.includes('lube') || name.includes('kayganlaştırıcı') ||
        name.includes('damla') || name.includes('drop') || name.includes('yağ') || name.includes('oil') || name.includes('stag') ||
        name.includes('proling') || name.includes('parfüm') || name.includes('macun') || name.includes('glide') ||
        name.includes('takviye') || cat === 'kadin-cinsel-saglik' || cat === 'erkek-saglik'
      ) && !name.includes('pompa') && !name.includes('vakum') && !name.includes('dildo') && !name.includes('vibratör') && !name.includes('halka');

      if (isCosmetic) {
        const isSpray = name.includes('sprey') || name.includes('spray') || name.includes('stag');
        const isCream = name.includes('krem') || name.includes('cream');
        const isSerum = name.includes('serum');
        const isDrops = name.includes('damla') || name.includes('drop') || name.includes('takviye') || name.includes('macun') || (cat === 'kadin-cinsel-saglik' && !name.includes('jel'));
        const isOil = (name.includes('yağ') || name.includes('oil') || text.includes('masaj yağı')) && !isDrops;

        if (isSpray) {
          const usageStr = detectedUsage || 'Kullanım miktarı ve uygulama adımları için ürün ambalajı üzerindeki talimatları inceleyiniz.';
          const volStr = mlVal ? (usesCount ? `${mlVal} (~${usesCount})` : mlVal) : (usesCount ? `Doz Şişe (~${usesCount})` : 'Doz Ayarlı Şişe');
          const rows = [
            ['Ürün Adı', prod.name],
            ['Kullanım Amacı', 'Birliktelik Süresini Destekleme & Bölgesel Konfor'],
            ['Ürün Formu', 'Erkeklere Özel Bakım Spreyi'],
            ['Net Hacim', volStr],
            ['Kullanım Şekli', usageStr],
            ['Formül Niteliği', 'Birliktelik süresini ve konforunu desteklemeye yardımcı özel bakım formülü'],
            ['Kondom & Lateks Uyumu', 'Prezervatif ile %100 uyumludur, latekse zarar vermez'],
            ['Saklama Koşulları', '25°C altında oda sıcaklığında, güneş ışığından uzakta kapalı kutuda']
          ];

          return {
            chips: [
              { k: 'Kullanım Amacı', v: 'Süre & Konfor Desteği' },
              { k: 'Ürün Formu', v: 'Erkek Bakım Spreyi' },
              { k: 'Net Hacim', v: volStr },
              { k: 'Cilt Uyumu', v: 'Dermatolojik Onaylı' }
            ],
            table: rows,
            careTitle: 'Kullanım ve Saklama Talimatı',
            careText: `${usageStr} Prezervatif veya su bazlı kayganlaştırıcılar ile birlikte güvenle kullanılabilir. Gözle ve tahriş olmuş ciltle temasından kaçınınız. Çocukların erişemeyeceği, serin ve kuru bir ortamda kapağı kapalı olarak saklayınız.`
          };
        }

        if (isCream) {
          const usageStr = detectedUsage || 'Kullanım talimatı ve dozaj bilgisi için ürün ambalajını inceleyiniz.';
          const rows = [
            ['Ürün Adı', prod.name],
            ['Kullanım Amacı', 'Birliktelik Süresini Destekleme & Bölgesel Konfor'],
            ['Ürün Formu', 'Erkeklere Özel Bakım Kremi'],
            ['Net Miktar', mlVal || 'Standart Tüp'],
            ['Kullanım Şekli', usageStr],
            ['Formül Niteliği', 'Birliktelik süresini desteklemeye ve konfor sunmaya yardımcı ferahlatıcı bakım formülü'],
            ['Kondom Uyumu', 'Lateks prezervatifler ile %100 güvenle kullanılabilir'],
            ['Saklama Koşulları', 'Oda sıcaklığında, doğrudan ısı ve ışıktan uzakta saklayınız']
          ];

          return {
            chips: [
              { k: 'Kullanım Amacı', v: 'Süre & Konfor Desteği' },
              { k: 'Ürün Formu', v: 'Erkek Bakım Kremi' },
              { k: 'Net Miktar', v: mlVal || 'Standart Tüp' },
              { k: 'Cilt Uyumu', v: 'Dermatolojik Onaylı' }
            ],
            table: rows,
            careTitle: 'Kullanım ve Saklama Talimatı',
            careText: `${usageStr} Durulama gerektirmez. Çocukların ulaşamayacağı yerde ve kapağı sıkıca kapalı muhafaza ediniz.`
          };
        }

        if (isSerum) {
          const usageStr = detectedUsage || 'Birliktelik öncesinde ihtiyaç duyulan miktarda uygulayarak nazikçe masaj yapınız.';
          const volStr = mlVal || '15 ml';
          const rows = [
            ['Ürün Adı', prod.name],
            ['Kullanım Amacı', 'Birliktelik Süresini Destekleme & Bölgesel Konfor'],
            ['Ürün Formu', 'Erkeklere Özel Konsantre Silikon Serum'],
            ['Net Hacim', volStr],
            ['Kullanım Şekli', usageStr],
            ['Formül Niteliği', 'Birliktelik süresini ve kontrolü desteklemeye yardımcı silikon bazlı özel formül'],
            ['Cilt Uyumu', 'Dermatolojik testlerden geçmiş, yapışkan his bırakmayan doku'],
            ['Güvenlik', 'Yalnızca harici kullanım içindir; kesinlikle içilmez veya yutulmaz.']
          ];

          return {
            chips: [
              { k: 'Kullanım Amacı', v: 'Süre & Konfor Desteği' },
              { k: 'Ürün Formu', v: 'Silikon Serum' },
              { k: 'Net Hacim', v: volStr },
              { k: 'Cilt Uyumu', v: 'Dermatolojik Onaylı' }
            ],
            table: rows,
            careTitle: 'Kullanım ve Güvenlik Talimatı',
            careText: `${usageStr} Yalnızca harici bölgesel kullanım içindir. Kesinlikle içilmez veya yutulmaz. Güneş ışığından uzakta, oda sıcaklığında saklayınız.`
          };
        }

        if (isDrops) {
          // STRICT USAGE-BASED LOGIC:
          // Check if explicit oral instruction exists (içecek, suya damlat, dilaltı, içilir, tüketilir)
          const usageLower = (detectedUsage || '').toLowerCase();
          const isExplicitOral = (
            usageLower.includes('içecek') || usageLower.includes('suya') || usageLower.includes('dilaltı') ||
            usageLower.includes('dil altı') || usageLower.includes('içil') || usageLower.includes('tüket') ||
            text.includes('dilaltı') || text.includes('dil altı') || text.includes('içeceğe damlat') ||
            text.includes('suya damlat') || text.includes('oral damla') || text.includes('sıvı takviye edici')
          ) && !usageLower.includes('masaj') && !usageLower.includes('harici kullanım');

          if (isExplicitOral) {
            // ORAL LIQUID SUPPLEMENT (Orviax vb.)
            const usageText = detectedUsage || 'Tavsiye edilen miktarda asitsiz bir içeceğe karıştırılarak veya dilaltına damlatılarak ağızdan tüketilir.';
            const rows = [
              ['Ürün Adı', prod.name],
              ['Ürün Tipi', 'Kadınlara Özel Bitkisel Destek & Sıvı Takviye Damlası'],
              ['Net Hacim', mlVal || '30 ml Damlalıklı Şişe'],
              ['Kullanım Şekli', usageText],
              ['Tüketim Yolu', 'Ağız Yoluyla (İçeceğe veya Dilaltına Damlatılarak)'],
              ['Güvenlik & Saklama', 'Tavsiye edilen porsiyonu aşmayınız. 25°C altında doğrudan güneş ışığından uzakta saklayınız.']
            ];

            return {
              chips: [
                { k: 'Ürün Formu', v: 'Sıvı Destek Damlası' },
                { k: 'Net Hacim', v: mlVal || '30 ml' },
                { k: 'Kullanım', v: 'İçecek / Dilaltı' },
                { k: 'Tüketim', v: 'Ağız Yoluyla' }
              ],
              table: rows,
              careTitle: 'Kullanım ve Tüketim Rehberi',
              careText: `${usageText} Kullanmadan önce şişeyi hafifçe çalkalayınız. Çocukların ulaşamayacağı serin ve kuru bir yerde muhafaza ediniz.`
            };
          } else {
            // TOPICAL / EXTERNAL INTIMATE MASSAGE DROPS (Orgie vb.)
            const usageText = detectedUsage || 'Bölgesel harici masaj uygulaması içindir. Detaylı kullanım için ürün ambalajına bakınız.';
            const volText = mlVal ? (usesCount ? `${mlVal} (~${usesCount})` : mlVal) : (usesCount ? `Damlalıklı Şişe (~${usesCount})` : 'Damlalıklı Şişe');
            const rows = [
              ['Ürün Adı', prod.name],
              ['Ürün Tipi', 'İntim Bölgeye Özel Harici Masaj & Uyarıcı Damla'],
              ['Net Hacim', volText],
              ['Kullanım Şekli', `${usageText} — Yalnızca Harici Kullanım`],
              ['Kalite & Güvenlik', 'Yalnızca harici kullanım içindir. Kesinlikle içilmez, yutulmaz veya içeceklere karıştırılmaz.'],
              ['Saklama Koşulları', '25°C altında oda sıcaklığında, doğrudan ışık ve ısıdan uzakta saklayınız']
            ];

            return {
              chips: [
                { k: 'Ürün Tipi', v: 'Harici Uyarıcı Damla' },
                { k: 'Net Hacim', v: volText },
                { k: 'Uygulama', v: 'Bölgesel Masaj' },
                { k: 'Güvenlik', v: 'Yalnızca Harici Kullanım' }
              ],
              table: rows,
              careTitle: 'Harici Kullanım ve Güvenlik Talimatı',
              careText: `YALNIZCA HARİCİ KULLANIM İÇİNDİR. Kesinlikle içilmez, yutulmaz veya içeceklere damlatılarak tüketilmez. ${usageText} Gözle temasından kaçınınız. Çocukların ulaşamayacağı, oda sıcaklığında muhafaza ediniz.`
            };
          }
        }

        if (isOil) {
          const usageStr = detectedUsage || 'Kullanım şekli ve detaylı bilgi için ambalaj üzerindeki talimatları inceleyiniz.';
          return {
            chips: [
              { k: 'Ürün Formu', v: 'Masaj & Bakım Yağı' },
              { k: 'Net Hacim', v: mlVal || '100 ml' },
              { k: 'Doku', v: 'Besleyici & İpeksi' },
              { k: 'Kullanım', v: 'Harici Masaj' }
            ],
            table: [
              ['Ürün Adı', prod.name],
              ['Ürün Tipi', 'Besleyici Vücut & Masaj Yağı'],
              ['Net Hacim', mlVal || '100 ml'],
              ['Kullanım Şekli', `${usageStr} (Yalnızca Harici Kullanım)`],
              ['Formül Yapısı', 'Doğal bitkisel yağ kompleksi ile zenginleştirilmiş besleyici doku'],
              ['Cilt Uyumlu', 'Dermatolojik testlerden geçmiş, tüm cilt tiplerine uygun hafif yapılı formül'],
              ['Temizlik & Bakım', 'Ilık su ve duş jeli ile cildinizi zahmetsizce temizleyebilirsiniz']
            ],
            careTitle: 'Kullanım ve Masaj Rehberi',
            careText: `${usageStr} Harici kullanım içindir. Kesinlikle içilmez. Direkt güneş ışığından uzakta, serin ve kuru yerde saklayınız.`
          };
        }

        // Lube / Gel
        const usageStr = detectedUsage || 'İhtiyaç duyulan bölgeye veya yetişkin oyuncağının üzerine arzu edilen miktarda uygulayınız.';
        const isSiliconeLube = text.includes('silikon bazlı');
        return {
          chips: [
            { k: 'Formül', v: isSiliconeLube ? 'Silikon Bazlı' : 'Su Bazlı Formül' },
            { k: 'Net Hacim', v: mlVal || '250 ml' },
            { k: 'Doku', v: 'İpeksi & Yağsız' },
            { k: 'Uyum', v: 'Lateks & Oyuncak' }
          ],
          table: [
            ['Ürün Adı', prod.name],
            ['Ürün Tipi', isSiliconeLube ? 'Silikon Bazlı Medikal Kayganlaştırıcı Jel' : 'Su Bazlı Medikal Kayganlaştırıcı Jel'],
            ['Net Hacim', mlVal || '250 ml'],
            ['Kullanım Şekli', usageStr],
            ['Formül Yapısı', isSiliconeLube ? 'Uzun süreli kayganlık sağlayan silikon formülasyon' : 'Tamamen su bazlı, yağsız, leke bırakmayan ipeksi yapı'],
            ['Oyuncak & Kondom Uyumu', isSiliconeLube ? 'Lateks kondomlarla uyumlu (Silikon oyuncaklarla kullanılmaz)' : '%100 Uyumlu (Lateks kondomlar ve silikon ürünlerle güvenli)'],
            ['Temizlik Kolaylığı', isSiliconeLube ? 'Ilık sabunlu su ile temizlenir' : 'Yalnızca ılık su ile zahmetsizce ciltten ve kumaşlardan arınır']
          ],
          careTitle: 'Kullanım ve Hijyen Rehberi',
          careText: `${usageStr} Direkt güneş ışığından uzakta, oda sıcaklığında saklayınız.`
        };
      }

      // 3. VACUUM PUMP / ACCESSORY / FETISH
      const isFetishOrPump = (
        name.includes('pompa') || name.includes('vakum') || name.includes('kelepçe') ||
        name.includes('maske') || name.includes('kırbaç') || name.includes('harness') ||
        cat === 'fetish-urunler' || cat === 'fantezi-ic-giyim'
      );
      if (isFetishOrPump) {
        const isPump = name.includes('pompa') || name.includes('vakum');
        if (isPump) {
          return {
            chips: [
              { k: 'Gövde', v: 'Medikal Akrilik & Silikon' },
              { k: 'Mekanizma', v: detectedPower ? detectedPower : 'Manuel Vakum Sistemi' },
              { k: 'Güvenlik', v: 'Basınç Emniyet Valfi' },
              { k: 'Temizlik', v: 'Ayrılabilir Hijyenik Hazne' }
            ],
            table: [
              ['Ürün Adı', prod.name],
              ['Silindir Malzemesi', 'Yüksek dayanımlı şeffaf medikal akrilik'],
              ['Conta Malzemesi', 'Hava sızdırmaz ultra esnek medikal silikon manşon'],
              ['Emniyet Sistemi', 'Anında basınç tahliye emniyet valfi ile kontrollü kullanım'],
              ['Kullanım Amacı', 'Bölgesel kan dolaşımını ve hassasiyeti artıran vakum terapisi']
            ],
            careTitle: 'Vakum Pompası Kullanım & Güvenlik Rehberi',
            careText: 'Kullanmadan önce kenar silikon contasına hafifçe su bazlı jel sürerek hava sızdırmazlığını sağlayınız. Vakum uygularken basıncı daima kademeli olarak artırınız. Herhangi bir rahatsızlık hissettiğinizde tahliye butonuna basarak vakumu anında boşaltınız. Ilık sabunlu su ile yıkayıp durulayınız.'
          };
        }
        return {
          chips: [
            { k: 'Malzeme', v: detectedMaterial || 'Yüksek Kalite Vegan Deri & Metal' },
            { k: 'Ayar', v: 'Ayarlanabilir Beden' },
            { k: 'Kullanım', v: 'Çiftlere Özel Aksesuar' }
          ],
          table: [
            ['Ürün Adı', prod.name],
            ['Ana Malzeme', detectedMaterial || 'Yüksek Kalite Vegan Deri & Krom Detay'],
            ['Beden Uyumu', 'Tüm beden ve bilek ölçülerine göre tam ayarlanabilir'],
            ['Aksesuar Özelliği', 'Ten dostu, sürtünmede tahriş etmeyen konforlu iç kaplama']
          ],
          careTitle: 'Kullanım ve Muhafaza Rehberi',
          careText: 'Nemli bir bezle silip ardından kuru bir bezle kurulayınız. Aşırı nemli ortamlardan uzakta, serin ve kuru bir yerde muhafaza ediniz.'
        };
      }

      // 4. MANNEQUIN / MASTURBATOR / CUP / REALISTIC
      const isDollOrMasturbator = (
        name.includes('manken') || name.includes('doll') || name.includes('kalça') ||
        name.includes('suni vajina') || name.includes('mastürbatör') || name.includes('masturbator') ||
        name.includes('vajina') || name.includes('cup') || cat === 'realistik-mankenler'
      );
      if (isDollOrMasturbator) {
        const isBigDoll = name.includes('manken') || name.includes('doll') || cat === 'realistik-mankenler' || (cmMatch && parseInt(cmMatch[1], 10) > 100);
        const rows = [
          ['Ürün Adı', prod.name],
          ['Doku Malzemesi', detectedMaterial || 'Medikal Sınıf Ultra Yumuşak Gerçekçi TPE / CyberSkin']
        ];
        if (cmVal) rows.push(['Boyut / Ölçü', cmVal]);
        if (kgVal) rows.push(['Gövde Ağırlığı', kgVal]);
        if (detectedPower) rows.push(['Güç Kaynağı', detectedPower]);
        if (detectedModes) rows.push(['Titreşim / Fonksiyon', detectedModes]);
        rows.push(['Kayganlaştırıcı Uyumu', 'Yalnızca su bazlı kayganlaştırıcılar ile kullanıma uygundur']);

        return {
          chips: [
            { k: 'Doku Malzemesi', v: 'Medikal Realistik TPE' },
            { k: 'Ölçü / Boyut', v: cmVal || (kgVal || 'Ergonomik Tasarım') },
            { k: 'Temizlik', v: 'Yıkanabilir & Pudralanabilir' }
          ],
          table: rows,
          careTitle: 'TPE Bakım, Yıkama ve Pudralama Rehberi',
          careText: 'Ürünü her zaman bol miktarda su bazlı kayganlaştırıcı ile kullanınız. Kullanım sonrasında iç kanalları tazyikli ılık su ile durulayınız. Kuruduktan sonra dokuyu korumak için pudralayınız.'
        };
      }

      // 5. ELECTRONIC / VIBRATOR / DEVICE
      const isVibe = (
        name.includes('vibratör') || name.includes('vibrator') || name.includes('wand') ||
        name.includes('rabbit') || name.includes('şarjlı') || name.includes('telefon kontrollü') ||
        name.includes('g-spot') || cat === 'vibratorler' || text.includes('titreşimli') || text.includes('titreşim')
      );
      if (isVibe) {
        const rows = [
          ['Ürün Adı', prod.name],
          ['Gövde Malzemesi', detectedMaterial || '%100 Vücut Uyumlu Medikal Silikon & ABS']
        ];
        
        // ONLY ADD POWER IF ACTUALLY DETECTED
        if (detectedPower) {
          rows.push(['Şarj & Batarya', detectedPower]);
        }

        // ONLY ADD MODES IF ACTUALLY DETECTED
        if (detectedModes) {
          rows.push(['Titreşim Modları', detectedModes]);
        }

        // ONLY ADD WATERPROOF IF ACTUALLY DETECTED
        if (detectedWaterproof) {
          rows.push(['Su Dayanımı', detectedWaterproof]);
        }

        if (cmVal) {
          rows.push(['Boyut / Uzunluk', cmVal]);
        }

        if (detectedUsage) {
          rows.push(['Kullanım Talimatı', detectedUsage]);
        }

        rows.push(['Kayganlaştırıcı Uyumu', 'Yalnızca su bazlı kayganlaştırıcılar ile uyumludur']);

        // Build precise chips without inventing fake specs
        const vibeChips = [];
        if (detectedPower) vibeChips.push({ k: 'Güç / Şarj', v: detectedPower.split(' ')[0] + ' ' + (detectedPower.split(' ')[1] || '') });
        if (detectedModes) vibeChips.push({ k: 'Mod / Ritim', v: detectedModes.split(' ')[0] + ' ' + (detectedModes.split(' ')[1] || '') });
        if (detectedMaterial) vibeChips.push({ k: 'Gövde', v: detectedMaterial.split(' ')[0] + ' ' + (detectedMaterial.split(' ')[1] || '') });
        if (detectedWaterproof) vibeChips.push({ k: 'Su Dayanımı', v: detectedWaterproof.split('(')[0].trim() });

        if (vibeChips.length === 0) {
          vibeChips.push({ k: 'Kategori', v: 'Elektronik Masaj & Uyarı' });
          if (cmVal) vibeChips.push({ k: 'Boyut', v: cmVal });
        }

        return {
          chips: vibeChips,
          table: rows,
          careTitle: 'Elektronik Cihaz Bakım & Hijyen Rehberi',
          careText: 'Gövdenin ipeksi dokusunu korumak için daima su bazlı kayganlaştırıcılar ile kullanınız. Kullanım sonrasında cihazı kapatıp ılık su ve antibakteriyel sabun ile nazikçe yıkayınız. Şarj girişinin tamamen kuruduğundan emin olmadan şarja takmayınız.'
        };
      }

      // 6. DILDO / GLASS / METAL / PLUG (NO MOTOR)
      const isDildoOrPlug = name.includes('dildo') || name.includes('plug') || name.includes('vantuz') || name.includes('anal') || name.includes('prob') || text.includes('dildo') || text.includes('plug');
      if (isDildoOrPlug) {
        const mat = detectedMaterial || 'Medikal Platinum Silikon';
        let taban = 'Ergonomik Yüzey';
        if (text.includes('vantuz')) taban = 'Güçlü Sabitleme Vantuzu';
        else if (name.includes('plug') || text.includes('plug')) taban = 'Güvenli Taban (Flared Base)';

        const rows = [
          ['Ürün Adı', prod.name],
          ['Gövde Malzemesi', `${mat} (Vücut ile %100 biyo-uyumlu, ftalatsız)`]
        ];
        if (cmVal) rows.push(['Ölçü / Uzunluk', cmVal]);
        rows.push(['Taban Mimarisi', taban]);
        if (detectedWaterproof) rows.push(['Su Dayanımı', detectedWaterproof]);
        rows.push(['Hijyen & Temizlik', 'Ilık sabunlu suyla %100 arındırılabilir']);

        return {
          chips: [
            { k: 'Malzeme', v: mat.split(' ')[0] + ' ' + (mat.split(' ')[1] || '') },
            { k: 'Boyut', v: cmVal || 'Ergonomik Boyut' },
            { k: 'Taban / Yapı', v: taban }
          ],
          table: rows,
          careTitle: 'Kullanım ve Hijyen Rehberi',
          careText: 'Pürüzsüz ve konforlu bir deneyim için bol miktarda su bazlı kayganlaştırıcı ile kullanılması önerilir. Kullanımdan önce ve sonra ılık su ile nötr sabun ile yıkayınız.'
        };
      }

      // 7. GENERAL / PURE EXTRACTED FALLBACK (ZERO HALLUCINATIONS)
      const generalRows = [
        ['Ürün Adı', prod.name]
      ];
      if (detectedMaterial) generalRows.push(['Malzeme Yapısı', detectedMaterial]);
      if (cmVal) generalRows.push(['Ölçü / Boyut', cmVal]);
      if (mlVal) generalRows.push(['Net Hacim', mlVal]);
      if (countVal) generalRows.push(['Paket İçeriği', countVal]);
      if (detectedUsage) generalRows.push(['Kullanım Talimatı', detectedUsage]);
      if (detectedWaterproof) generalRows.push(['Su Dayanımı', detectedWaterproof]);
      if (detectedPower) generalRows.push(['Güç Kaynağı', detectedPower]);

      const generalChips = [];
      if (detectedMaterial) generalChips.push({ k: 'Malzeme', v: detectedMaterial.split(' ')[0] + ' ' + (detectedMaterial.split(' ')[1] || '') });
      if (cmVal || mlVal || countVal) generalChips.push({ k: 'Ölçü / Hacim', v: cmVal || mlVal || countVal });
      if (detectedUsage) generalChips.push({ k: 'Kullanım', v: 'Talimata Uygun' });

      if (generalChips.length === 0) {
        generalChips.push({ k: 'Kategori', v: catName(prod.category, prod.categoryName) });
      }

      return {
        chips: generalChips,
        table: generalRows,
        careTitle: 'Kullanım ve Hijyen Rehberi',
        careText: detectedUsage ? `${detectedUsage} Doğrudan güneş ışığı almayan, serin ve kuru bir yerde muhafaza ediniz.` : 'Ürünü kullanmadan önce ve sonra ılık su ve nötr sabun ile nazikçe temizleyiniz. Doğrudan güneş ışığı almayan, serin ve kuru bir yerde muhafaza ediniz.'
      };
    }

    const profile = getProductProfile(p);

    root.innerHTML = `
    <div class="page-head" style="padding-bottom:6px">
      <div class="crumbs">
        <a href="/">${t('pd.crumb.home')}</a> / 
        <a href="/magaza">${t('pd.crumb.shop')}</a> / 
        <a href="/magaza?kat=${p.category}">${catName(p.category, p.categoryName)}</a>
      </div>
    </div>
    <div class="pd-layout">
      <div class="pd-gallery" id="pd-gallery-wrap">
        <div class="pd-media" id="pd-media-stage" role="button" tabindex="0" aria-label="Görseli büyüt (Tam Ekran)">
          <img id="pd-main-image" src="${imgSrc(p.image)}" alt="${esc(p.name)}">
        </div>
        ${hasMultipleImages ? `
          <div class="pd-thumbs" role="tablist" aria-label="Ürün Görselleri">
            ${productGallery.map((img, idx) => `
              <button type="button" class="pd-thumb-btn ${idx === 0 ? 'active' : ''}" data-thumb-idx="${idx}" data-thumb-src="${esc(img)}" aria-label="Görsel ${idx + 1}">
                <img src="${imgSrc(img)}" alt="${esc(p.name)} - ${idx + 1}">
              </button>
            `).join('')}
          </div>
          <div class="pd-dots" role="tablist" aria-label="Görsel Sayfaları">
            ${productGallery.map((_, idx) => `
              <button type="button" class="pd-dot ${idx === 0 ? 'active' : ''}" data-dot-idx="${idx}" aria-label="Görsel ${idx + 1}"></button>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <div class="pd-info">
        <a href="/magaza?kat=${encodeURIComponent(p.category || '')}" class="pd-category-tag">${catName(p.category, p.categoryName)}</a>
        <h1 class="pd-title">${esc(String(p.name || '').replace(/\s+/g, ' ').trim())}</h1>

        ${p.reviewCount > 0 ? `
          <div class="pd-rating-bar">
            <span class="stars">${stars(p.rating)}</span>
            <span class="pd-rating-val">${p.rating.toFixed(1)}</span>
            <span class="pd-rating-count">(${p.reviewCount} ${t('pd.reviews')})</span>
          </div>
        ` : `
          <div class="pd-rating-bar pd-no-rating">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>Henüz değerlendirilmedi · İlk yorumu siz yapın</span>
          </div>
        `}

        <div class="pd-price-row">
          <span class="pd-price-current">${fmt(p.price)}</span>
          ${p.oldPrice && p.oldPrice > p.price ? `
            <span class="pd-price-old">${fmt(p.oldPrice)}</span>
            <span class="pd-discount-badge">%${Math.round((1 - p.price / p.oldPrice) * 100)} İndirim</span>
          ` : ''}
        </div>

        ${p.description ? `<p class="pd-lead-desc">${esc(p.description)}</p>` : ''}

        <div class="pd-quick-specs">
          ${profile.chips.map(chip => `
            <div class="pd-spec-chip">
              <span class="pd-spec-k">${esc(chip.k)}</span>
              <span class="pd-spec-v">${esc(chip.v)}</span>
            </div>
          `).join('')}
        </div>

        <div class="pd-actions-row">
          <div class="pd-qty-stepper">
            <button id="q-minus" type="button" aria-label="Azalt">−</button>
            <input id="q-val" value="1" readonly aria-label="Adet">
            <button id="q-plus" type="button" aria-label="Artır">+</button>
          </div>
          <button class="pd-btn-add" id="pd-add">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>${t('pd.add')}</span>
          </button>
          <button class="pd-btn-buy" id="pd-buy">${t('pd.buy')}</button>
        </div>

        <div class="pd-stock-badge">
          <span class="pd-stock-dot ${p.stock < 5 ? 'is-low' : ''}"></span>
          <span>${p.stock > 0 ? (p.stock < 5 ? t('pd.stock.low', { n: p.stock }) : (LANG === 'en' ? 'In Stock — Same Day Dispatch before 14:00 (1-3 Days)' : 'Stokta Mevcut — 14:00 Öncesi Aynı Gün Kargo (1-3 İş Günü)')) : t('pd.stock.out')}</span>
        </div>

        <div class="pd-trust-grid">
          <div class="pd-trust-item">
            <div class="pd-trust-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <div class="pd-trust-text">
              <strong>Gizli Paketleme</strong>
              <p>Dışarıdan içeriği kesinlikle anlaşılamaz, sade ambalaj</p>
            </div>
          </div>

          <div class="pd-trust-item">
            <div class="pd-trust-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <div class="pd-trust-text">
              <strong>Hızlı & Ücretsiz Kargo</strong>
              <p>2.000 TL üzeri siparişlerde aynı gün kargo (1-3 iş günü teslimat)</p>
            </div>
          </div>

          <div class="pd-trust-item">
            <div class="pd-trust-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div class="pd-trust-text">
              <strong>Anonim ve Güvenli Ödeme</strong>
              <p>256-Bit SSL şifreleme, ekstrede nötr şirket unvanı</p>
            </div>
          </div>

          <div class="pd-trust-item">
            <div class="pd-trust-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="pd-trust-text">
              <strong>Steril Orijinal Ürün</strong>
              <p>Güvenlik kilitli kutu, hijyen standartlarına %100 uygun</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pd-tabs-section">
      <div class="pd-tabs-nav">
        <button class="pd-tab-btn active" data-tab="detay">Ürün Açıklaması ve Detaylar</button>
        <button class="pd-tab-btn" data-tab="yorum">${t('pd.tab.reviews')} (${p.reviewCount || 0})</button>
      </div>
      <div class="pd-tab-content" id="tab-panel"></div>
    </div>

    <section class="block">
      <div class="section-head">
        <div><h2>${t('pd.similar')}</h2></div>
        <a href="/magaza?kat=${p.category}" class="link-more">${t('pd.all')}</a>
      </div>
      <div class="prod-grid" id="related-grid"></div>
    </section>`;

    // Gallery controller: switcher, swipe gestures, arrow navigation & fullscreen lightbox
    let activeImgIdx = 0;
    const mainImg = $('#pd-main-image', root);
    const mediaStage = $('#pd-media-stage', root);
    const curIdxEl = $('#pd-cur-idx', root);
    const thumbBtns = $$('.pd-thumb-btn', root);

    function updateGalleryImage(idx) {
      if (!productGallery[idx]) return;
      activeImgIdx = idx;
      const targetSrc = productGallery[idx];
      if (mainImg) {
        mainImg.style.opacity = '0.35';
        mainImg.src = imgSrc(targetSrc);
        mainImg.onload = () => { mainImg.style.opacity = '1'; };
      }
      if (curIdxEl) curIdxEl.textContent = String(idx + 1);
      thumbBtns.forEach((b, i) => {
        const isActive = i === idx;
        b.classList.toggle('active', isActive);
        if (isActive) {
          b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
      const dotBtns = $$('.pd-dot', root);
      dotBtns.forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    }

    thumbBtns.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateGalleryImage(idx);
      });
    });

    const dotBtns = $$('.pd-dot', root);
    dotBtns.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateGalleryImage(idx);
      });
    });

    const prevBtn = $('#pd-arrow-prev', root);
    const nextBtn = $('#pd-arrow-next', root);
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevIdx = (activeImgIdx - 1 + productGallery.length) % productGallery.length;
        updateGalleryImage(prevIdx);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIdx = (activeImgIdx + 1) % productGallery.length;
        updateGalleryImage(nextIdx);
      });
    }

    // Touch swipe for mobile gallery
    if (mediaStage && productGallery.length > 1) {
      let touchStartX = 0;
      let touchStartY = 0;
      mediaStage.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });
      mediaStage.addEventListener('touchend', (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.3) {
          if (dx < 0) {
            updateGalleryImage((activeImgIdx + 1) % productGallery.length);
          } else {
            updateGalleryImage((activeImgIdx - 1 + productGallery.length) % productGallery.length);
          }
        }
      }, { passive: true });
    }

    // Remove any leftover lightbox from DOM
    const oldLb = $('#pd-lightbox');
    if (oldLb) oldLb.remove();

    // Luxury Fullscreen Lightbox
    function openLightbox(startIdx) {
      let lbIdx = (typeof startIdx === 'number') ? startIdx : activeImgIdx;
      let lb = $('#pd-lightbox');
      if (!lb) {
        lb = document.createElement('div');
        lb.id = 'pd-lightbox';
        lb.className = 'pd-lightbox';
        lb.setAttribute('role', 'dialog');
        lb.setAttribute('aria-modal', 'true');
        lb.setAttribute('aria-hidden', 'true');
        lb.style.display = 'none';
        lb.innerHTML = `
          <div class="pd-lb-backdrop"></div>
          <div class="pd-lb-container">
            <button type="button" class="pd-lb-close" aria-label="Kapat" title="Kapat (ESC)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div class="pd-lb-img-wrap">
              <img id="pd-lb-img" src="" alt="${esc(p.name)}">
            </div>
            ${hasMultipleImages ? `
              <button type="button" class="pd-lb-nav pd-lb-prev" aria-label="Önceki Görsel">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button type="button" class="pd-lb-nav pd-lb-next" aria-label="Sonraki Görsel">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              <div class="pd-lb-counter"><span id="pd-lb-cur">1</span> / <span>${productGallery.length}</span></div>
            ` : ''}
          </div>
        `;
        document.body.appendChild(lb);
      }

      const lbImg = $('#pd-lb-img', lb);
      const lbCur = $('#pd-lb-cur', lb);

      function setLbImage(i) {
        lbIdx = (i + productGallery.length) % productGallery.length;
        if (lbImg) {
          lbImg.style.opacity = '0.35';
          lbImg.src = imgSrc(productGallery[lbIdx]);
          lbImg.onload = () => { lbImg.style.opacity = '1'; };
        }
        if (lbCur) lbCur.textContent = String(lbIdx + 1);
        updateGalleryImage(lbIdx);
      }

      setLbImage(lbIdx);
      lb.style.display = 'flex';
      lb.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => {
        lb.classList.add('open');
      });
      lockBodyScroll();

      const closeLb = () => {
        lb.classList.remove('open');
        lb.style.display = 'none';
        lb.setAttribute('aria-hidden', 'true');
        unlockBodyScroll();
        window.removeEventListener('keydown', onKey);
      };

      const onKey = (e) => {
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft' && hasMultipleImages) setLbImage(lbIdx - 1);
        if (e.key === 'ArrowRight' && hasMultipleImages) setLbImage(lbIdx + 1);
      };
      window.addEventListener('keydown', onKey);

      const closeBtn = $('.pd-lb-close', lb);
      if (closeBtn) closeBtn.onclick = closeLb;
      const backdrop = $('.pd-lb-backdrop', lb);
      if (backdrop) backdrop.onclick = closeLb;

      if (hasMultipleImages) {
        const prevLbBtn = $('.pd-lb-prev', lb);
        if (prevLbBtn) prevLbBtn.onclick = (e) => { e.stopPropagation(); setLbImage(lbIdx - 1); };
        const nextLbBtn = $('.pd-lb-next', lb);
        if (nextLbBtn) nextLbBtn.onclick = (e) => { e.stopPropagation(); setLbImage(lbIdx + 1); };
      }
    }

    if (mediaStage) {
      mediaStage.addEventListener('click', (e) => {
        if (e.target.closest('.pd-arrow-nav')) return;
        openLightbox(activeImgIdx);
      });
      mediaStage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(activeImgIdx);
        }
      });
    }

    const expandTrigger = $('#pd-expand-trigger', root);
    if (expandTrigger) {
      expandTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(activeImgIdx);
      });
    }

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

    function showTab(name) {
      $$('.pd-tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
      const panel = $('#tab-panel');
      if (name === 'yorum') {
        panel.innerHTML = '<div class="spinner"></div>';
        api('/api/products/' + p.id + '/reviews').then((d) => {
          if (d.reviews && d.reviews.length > 0) {
            panel.innerHTML = `
              <div class="review-list">
                ${d.reviews.map((r) => `
                  <div style="border-bottom:1px solid var(--line);padding:18px 0">
                    <div style="color:var(--gold);letter-spacing:2px;font-size:14px;margin-bottom:6px">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                    <div style="color:var(--text);margin-bottom:8px;font-size:14.5px;line-height:1.6">${esc(r.text)}</div>
                    <div style="color:var(--muted);font-size:12.5px">${esc(r.userName)} · ${dateFmt(r.createdAt)}</div>
                  </div>
                `).join('')}
              </div>
              <div style="margin-top:24px"><a class="btn btn-ghost btn-sm" href="/urun/${p.slug}/yorum">${t('pd.write')}</a></div>`;
          } else {
            panel.innerHTML = `
              <div style="padding:24px 0;color:var(--muted)">
                <p style="font-size:14.5px;margin-bottom:6px">Bu ürün için henüz müşteri değerlendirmesi bulunmuyor.</p>
                <p style="font-size:13px;opacity:0.8;margin-bottom:20px">Deneyiminizi paylaşarak diğer kullanıcılara yol gösterebilirsiniz.</p>
                <a class="btn btn-primary btn-sm" href="/urun/${p.slug}/yorum">${t('pd.write')}</a>
              </div>`;
          }
        }).catch(() => { panel.textContent = t('pd.reviewsfail'); });
      } else {
        const fullDesc = (p.longDescription || p.description || '').trim();
        const paragraphs = fullDesc.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
        
        panel.innerHTML = `
          <div class="pd-desc-paragraphs">
            ${paragraphs.map(para => `<p>${esc(para)}</p>`).join('')}
          </div>
          
          <div class="pd-specs-table-wrap">
            <table class="pd-specs-table">
              <tbody>
                ${profile.table.map(row => `
                  <tr>
                    <td>${esc(row[0])}</td>
                    <td>${esc(row[1])}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td>Kategori</td>
                  <td>${catName(p.category, p.categoryName)}</td>
                </tr>
                <tr>
                  <td>Paketleme & Gizlilik</td>
                  <td>Mühürlü steril koruma, içeriği belli olmayan %100 gizli kargo kutusu</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pd-care-box">
            <h4>${esc(profile.careTitle)}</h4>
            <p>${esc(profile.careText)}</p>
          </div>
        `;
      }
    }
    $$('.pd-tab-btn').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));
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
  // initCart imported from modules/cart.js
  window.initCart = initCart;
  

  /* ================= CHECKOUT ================= */
  // initCheckout and initThanks imported from modules/checkout.js
  window.initCheckout = initCheckout;
  window.initThanks = initThanks;
  /* ================= AUTH ================= */
    // initAuth imported from modules/auth.js
  // initAccount and initProfile imported from modules/account.js
  window.initAccount = initAccount;
  window.initProfile = initProfile;

  
  /* ================= 2026 INSTANT SPA ROUTER & ZERO-JITTER SCROLL ENGINE ================= */
  let activeNavAbort = null;
  const scrollPositions = new Map();

  // Configure native manual scroll restoration to eliminate browser scroll fighting
  if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Persist current scroll position on unload and pagehide
  const persistScroll = () => {
    try {
      const key = 'ls_scr_' + location.pathname + location.search;
      sessionStorage.setItem(key, String(window.scrollY || window.pageYOffset || 0));
    } catch (e) {}
  };
  window.addEventListener('beforeunload', persistScroll, { passive: true });
  window.addEventListener('pagehide', persistScroll, { passive: true });

  function restoreReloadScroll() {
    try {
      const key = 'ls_scr_' + location.pathname + location.search;
      const saved = sessionStorage.getItem(key);
      if (saved !== null) {
        const y = parseInt(saved, 10);
        if (y > 0) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, left: 0, behavior: 'instant' });
            setTimeout(() => {
              const currentY = window.scrollY || window.pageYOffset || 0;
              if (Math.abs(currentY - y) > 40) {
                window.scrollTo({ top: y, left: 0, behavior: 'instant' });
              }
            }, 80);
          });
        }
      }
    } catch (e) {}
  }

  function updateActiveNavIndicators(targetPath) {
    $$('nav.top .nav-links a').forEach((a) => {
      const navPath = a.getAttribute('data-nav') || a.getAttribute('href');
      if (navPath) {
        const isActive = navPath === '/' ? targetPath === '/' : targetPath.startsWith(navPath);
        a.classList.toggle('active', isActive);
      }
    });
    initMobileBottomNav();
  }

  function runRouteInit(pathname) {
    refreshRevealObservers();
    if (pathname === '/' || pathname === '') {
      initHome();
    } else if (pathname === '/magaza' || pathname.startsWith('/magaza')) {
      initShop();
    } else if (pathname.startsWith('/urun/')) {
      initProduct();
      initReviewForm();
    } else if (pathname === '/sepet') {
      initCart();
    } else if (pathname === '/odeme') {
      initCheckout();
    } else if (pathname === '/siparis-onay' || pathname.startsWith('/siparis-onay')) {
      initThanks();
    } else if (pathname === '/giris' || pathname === '/kayit' || pathname === '/hesap') {
      initAuth();
      initAccount();
      initProfile();
    } else if (pathname === '/iletisim') {
      initContact();
    }
  }

  let lastNavUrlStr = location.href;

  async function navigateTo(url, pushState = true) {
    const targetUrl = new URL(url, location.origin);
    lastNavUrlStr = targetUrl.href;
    if (targetUrl.origin !== location.origin) {
      location.href = url;
      return;
    }
    if (targetUrl.pathname.startsWith('/admin') || targetUrl.pathname.startsWith('/api/')) {
      location.href = url;
      return;
    }

    // Immediately close any open modal
    closeSpatialCardZoom();

    const mainEl = $('#app-main');
    if (!mainEl) {
      location.href = url;
      return;
    }

    // Clicking link to the exact current page
    if (pushState && targetUrl.pathname === location.pathname && targetUrl.search === location.search && !targetUrl.hash) {
      mainEl.classList.add('is-transitioning');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      resetNavScrolled();
      setTimeout(() => {
        mainEl.classList.remove('is-transitioning');
        refreshRevealObservers();
      }, 150);
      return;
    }

    // Save current scroll position before navigating away
    if (pushState) {
      const currentY = window.scrollY || window.pageYOffset || 0;
      scrollPositions.set(location.pathname + location.search, currentY);
      try {
        sessionStorage.setItem('ls_scr_' + location.pathname + location.search, currentY.toString());
      } catch (e) {}
    }

    // Cancel in-flight previous request if user clicks fast between tabs
    if (activeNavAbort) {
      try { activeNavAbort.abort(); } catch (e) {}
      activeNavAbort = null;
    }

    const abortCtrl = new AbortController();
    activeNavAbort = abortCtrl;

    // Instant UI feedback on navigation tabs
    updateActiveNavIndicators(targetUrl.pathname);
    mainEl.classList.add('is-transitioning');

    try {
      const resp = await fetch(url, {
        signal: abortCtrl.signal,
        headers: {
          'X-Requested-With': 'SPA',
          'x-ls-sid': getClientSid()
        }
      });
      if (!resp.ok) throw new Error('Page fetch failed: ' + resp.status);
      const htmlText = await resp.text();
      const doc = new DOMParser().parseFromString(htmlText, 'text/html');
      const newMain = doc.querySelector('#app-main');

      if (!newMain) {
        location.href = url;
        return;
      }

      // Cleanup previous active loops/components
      destroyCoverflow();

      if (pushState) {
        history.pushState({}, '', url);
      }

      // Update document title & metadata
      if (doc.title) document.title = doc.title;

      // Update cart badges
      refreshCartBadge();

      // Swap content cleanly
      mainEl.innerHTML = newMain.innerHTML;

      // Scroll handling: restore position on back/forward, or scroll to top on new page
      if (pushState) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        resetNavScrolled();
        try {
          sessionStorage.setItem('ls_scr_' + targetUrl.pathname + targetUrl.search, '0');
        } catch (e) {}
      } else {
        let savedY = scrollPositions.get(targetUrl.pathname + targetUrl.search);
        if (typeof savedY !== 'number') {
          try {
            const sy = sessionStorage.getItem('ls_scr_' + targetUrl.pathname + targetUrl.search);
            if (sy !== null) savedY = parseInt(sy, 10);
          } catch (e) {}
        }
        
        if (typeof savedY === 'number') {
          requestAnimationFrame(() => {
            window.scrollTo({ top: savedY, left: 0, behavior: 'instant' });
            setTimeout(() => window.scrollTo({ top: savedY, left: 0, behavior: 'instant' }), 50);
            setTimeout(() => window.scrollTo({ top: savedY, left: 0, behavior: 'instant' }), 120);
          });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }

      // Run route specific initializers
      runRouteInit(targetUrl.pathname);

      // Close mobile menu if open
      $('#mobile-menu')?.classList.remove('open');
      
      // Dispatch event for modals/overlays
      document.dispatchEvent(new CustomEvent('spa:navigated'));

    } catch (err) {
      if (err.name === 'AbortError') {
        // Silently ignore superseded rapid navigation
        return;
      }
      console.warn('Soft nav fallback:', err);
      location.href = url;
    } finally {
      if (activeNavAbort === abortCtrl) {
        activeNavAbort = null;
        setTimeout(() => {
          mainEl.classList.remove('is-transitioning');
          refreshRevealObservers();
        }, 40);
      }
    }
  }

  function initSpaLinks() {
    if (initSpaLinks.initialized) return;
    initSpaLinks.initialized = true;

    const originalPush = history.pushState;
    history.pushState = function(...args) {
      originalPush.apply(this, args);
      lastNavUrlStr = location.href;
    };
    const originalReplace = history.replaceState;
    history.replaceState = function(...args) {
      originalReplace.apply(this, args);
      lastNavUrlStr = location.href;
    };

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      if (link.hasAttribute('data-external')) return;

      // Ignore special clicks (new tab, modifiers, download, external, mailto, tel)
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target && link.target !== '_self') return;
      if (link.hasAttribute('download')) return;

      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#')) {
        if (href.length > 1) {
          const targetEl = document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
        return;
      }
      if (href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:') || href.includes('wa.me')) return;

      const dest = new URL(link.href, location.origin);
      if (dest.origin !== location.origin) return;
      if (dest.pathname.startsWith('/admin') || dest.pathname.startsWith('/api/')) return;

      // If user is clicking category chip/link inside shop page and already in /magaza, let shop filter handle it
      if (location.pathname === '/magaza' && dest.pathname === '/magaza' && (dest.searchParams.has('kat') || dest.searchParams.has('cat'))) {
        const cat = dest.searchParams.get('kat') || dest.searchParams.get('cat') || '';
        if (cat) {
          const allChips = $$('#cat-chips [data-cat]');
          const chip = allChips.find(el => el.dataset.cat === cat || el.dataset.cat.toLowerCase() === cat.toLowerCase());
          if (chip) {
            e.preventDefault();
            const currentY = window.scrollY || window.pageYOffset || 0;
            scrollPositions.set(location.pathname + location.search, currentY);
            try { sessionStorage.setItem('ls_scr_' + location.pathname + location.search, currentY.toString()); } catch(e) {}
            
            chip.click();
            history.pushState({}, '', link.href);
            lastNavUrlStr = link.href;
            return;
          }
        }
      }

      e.preventDefault();
      navigateTo(link.href);
    });

    window.addEventListener('popstate', () => {
      const currentUrl = new URL(location.href);
      const prevUrl = new URL(lastNavUrlStr);
      
      const currUrun = currentUrl.searchParams.get('urun');
      const prevUrun = prevUrl.searchParams.get('urun');
      
      currentUrl.searchParams.delete('urun');
      prevUrl.searchParams.delete('urun');
      
      if (currentUrl.href === prevUrl.href && currUrun !== prevUrun) {
        // Modal opened or closed, do not trigger full SPA page reload
        lastNavUrlStr = location.href;
        return;
      }
      
      // Update lastNavUrlStr before navigating
      lastNavUrlStr = location.href;
      navigateTo(location.href, false);
    });
  }

  /* boot */
  const globalInit = [initAutoCropNormalizer, initSpatialAnimations, initSpaLinks, initQuickSearch, initMobileBottomNav, refreshRevealObservers];

  function runBoot() {
    globalInit.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
    runRouteInit(location.pathname);
    restoreReloadScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBoot);
  } else {
    runBoot();
  }


'use strict';
import { initAccount, initProfile } from './modules/account.js';
import { initCheckout, initThanks } from './modules/checkout.js';
import { initSpatialAnimations, openSpatialCardZoom, closeSpatialCardZoom } from './modules/spatial.js';
import { getLocalCart, setLocalCart, updateCartBadge, addToCart, initCart } from './modules/cart.js';
import { performLogout, initAuth } from './modules/auth.js';
import { api, getClientSid } from './modules/api.js';
import { toast } from './modules/ui.js';
import { initCoverflow } from './modules/coverflow.js';
import { initContact } from './modules/contact.js';
import { initAutoCropNormalizer } from './modules/autocrop.js';



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
      'cart.summary': 'Sipariş Özeti', 'cart.freeship.left': 'Ücretsiz kargoya {x} kaldı!', 'cart.freeship.won': 'Ücretsiz kargo hakkı kazandın!',
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
      'cart.summary': 'Order Summary', 'cart.freeship.left': '{x} away from free shipping!', 'cart.freeship.won': 'You unlocked free shipping!',
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
  // updateCartBadge imported from modules/cart.js
  window.updateCartBadge = updateCartBadge;
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

      $('.qs-chip', results).forEach((chip) => {
        chip.addEventListener('click', () => {
          const q = chip.dataset.query;
          if (q) {
            input.value = q;
            if (clearBtn) clearBtn.style.display = 'block';
            doSearch(q);
          }
        });
      });

      $('.qs-cat-btn', results).forEach((btn) => {
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
      searchTimer = setTimeout(() => { doSearch(input.value);
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
  /* ---------- product card template ---------- */
  function productCard(p) {
    const badges = [];
    if (p.isNew) badges.push(`<span class="badge new">${t('badge.new')}</span>`);
    if (p.bestSeller) badges.push(`<span class="badge hot">${t('badge.hot')}</span>`);
    if (p.oldPrice) badges.push(`<span class="badge sale">${t('badge.sale')}</span>`);
    return `
    <article class="prod-card rv" data-id="${p.id}" data-slug="${p.slug}">
      <a href="/urun/${p.slug}" class="prod-media" data-slug="${p.slug}">
        ${p.image ? `<img src="${imgSrc(p.image)}" alt="${p.name}" loading="lazy" decoding="async">` : `<div style="width:100%;height:100%;background:transparent"></div>`}
        <div class="card-sheen"></div>
        <div class="prod-badges">${badges.join('')}</div>
      </a>
      <div class="prod-actions">
        <button type="button" class="action-btn quick-add-btn" data-add="${p.id}" title="${t('quickadd')}" aria-label="${t('quickadd')}">
          <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
      <div class="prod-info">
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

  /* ================= 2026 SPATIAL CARD ZOOM ================= */
  // Spatial zoom and tilt physics moved to modules/spatial.js
  window.openSpatialCardZoom = openSpatialCardZoom;
  window.closeSpatialCardZoom = closeSpatialCardZoom;
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
  window.LS.catName = catName;
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
        <div class="prod-cat"><a href="/magaza?kat=${encodeURIComponent(p.category || '')}" class="prod-cat-link">${catName(p.category, p.categoryName)}</a></div>
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
      setTimeout(() => { mainEl.classList.remove('is-transitioning');
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
  const globalInit = [initAutoCropNormalizer, initSpatialAnimations, initSpaLinks, initQuickSearch, initMobileBottomNav, refreshRevealObservers];
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


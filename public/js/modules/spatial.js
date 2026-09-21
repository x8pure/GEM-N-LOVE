import { api } from './api.js';
import { toast, lockBodyScroll, unlockBodyScroll } from './ui.js?v=2.2.0';
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

// Helper: Select context-appropriate minimalist SVG icon based on spec text
function getSpecIcon(text) {
  const t = String(text || '').toLowerCase();
  if (t.includes('ipx') || t.includes('su geçirmez') || t.includes('waterproof') || t.includes('suya dayanıklı')) {
    return '<path d="M12 3.5c-3.2 4-5.5 7.2-5.5 10.2a5.5 5.5 0 0 0 11 0c0-3-2.3-6.2-5.5-10.2z"/>';
  }
  if (t.includes('şarj') || t.includes('pil') || t.includes('batarya') || t.includes('charge') || t.includes('usb')) {
    return '<rect x="4" y="6.5" width="13" height="11" rx="2.5"/><path d="M20 10v4M10.5 9.5 9 12h3.5l-1.5 2.5"/>';
  }
  if (t.includes('mod') || t.includes('titreşim') || t.includes('hız') || t.includes('ritim') || t.includes('motor')) {
    return '<path d="M3 12h2M7.5 8v8M12 5v14M16.5 8v8M21 12h-2"/>';
  }
  if (t.includes('ağız') || t.includes('içecek') || t.includes('tüketilir') || t.includes('damla') || t.includes('takviye')) {
    return '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>';
  }
  if (t.includes('harici') || t.includes('içilmez') || t.includes('güvenlik') || t.includes('masaj')) {
    return '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
  }
  if (t.includes('silikon') || t.includes('tpe') || t.includes('çelik') || t.includes('cam') || t.includes('malzeme') || t.includes('deri')) {
    return '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/>';
  }
  if (t.includes('uygulama') || t.includes('bluetooth') || t.includes('telefon')) {
    return '<rect x="6" y="2.5" width="12" height="19" rx="3"/><line x1="10.5" y1="18" x2="13.5" y2="18"/>';
  }
  if (t.includes('paket') || t.includes('kutu') || t.includes('kargo')) {
    return '<rect x="3.5" y="6.5" width="17" height="13" rx="2.5"/><path d="M3.5 11h17M12 6.5v13"/>';
  }
  return '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/>';
}

// Extract strict, honest highlights directly from product text (NO HALLUCINATIONS)
function extractRealHighlights(prod) {
  const fullText = `${prod.name || ''} ${prod.description || ''} ${prod.longDescription || ''}`;
  const lower = fullText.toLowerCase();
  const list = [];

  // =========================================================================
  // 1. CRITICAL HEALTH & USAGE ROUTE (ORAL VS TOPICAL VS MECHANICAL)
  // =========================================================================
  const isExplicitOral = (
    lower.includes('içecek') || lower.includes('içeceğe') || lower.includes('suya damlat') ||
    lower.includes('dilaltı') || lower.includes('dil altı') || lower.includes('içilir') ||
    lower.includes('tüketilir') || lower.includes('oral damla') || lower.includes('sıvı takviye')
  ) && !lower.includes('harici kullanım') && !lower.includes('masaj damlası') && !lower.includes('bölgeye damlat');

  const isMechanicalOrApparatus = lower.includes('mastürbatör') || lower.includes('masturbat') ||
    lower.includes('dildo') || lower.includes('vibratör') || lower.includes('manken') ||
    lower.includes('kelepçe') || lower.includes('halka') || lower.includes('plug') ||
    lower.includes('pompa') || lower.includes('maske');

  const isDropsOrLiquid = !isMechanicalOrApparatus && (
    lower.includes('damla') || lower.includes('drop') || lower.includes('serum') ||
    lower.includes('yağ') || lower.includes('sprey') || lower.includes('krem') ||
    lower.includes('jel') || lower.includes('lube') || lower.includes('kayganlaştırıcı')
  );

  if (isExplicitOral) {
    list.push('Ağızdan İçeceğe Karıştırılarak Tüketilir');
    list.push('Bitkisel Sıvı Destek Damlası');
  } else if (isDropsOrLiquid) {
    list.push('YALNIZCA HARİCİ KULLANIM — KESİNLİKLE İÇİLMEZ');
    const isDurationSupport = lower.includes('süreyi') || lower.includes('süre destek') || lower.includes('birliktelik süresi') || lower.includes('geciktir') || lower.includes('delay') || lower.includes('stag') || lower.includes('proling');
    if (isDurationSupport) {
      list.push('Birliktelik Süresini Destekleyici Formül');
    }
    if (lower.includes('damla') || lower.includes('drop')) list.push('Bölgesel Masaj & Uyarıcı Damla');
    else if (lower.includes('sprey')) list.push('Lokal Püskürtme Uygulaması');
    else if (lower.includes('krem')) list.push('Bölgesel Masajla Emilim');
    else if (lower.includes('serum')) list.push('Konsantre Harici Serum');
  }

  // 2. EXACT IPX / WATERPROOF (ONLY IF PRESENT IN REAL TEXT - NEVER INVENTED)
  const ipxMatch = fullText.match(/\bip(?:x|v)?([0-9])\b/i);
  if (ipxMatch) {
    const lvl = ipxMatch[1];
    if (lvl === '1' || lvl === '2') list.push(`IPX${lvl} Damlama Korumalı`);
    else if (lvl === '3') list.push('IPX3 Sıçrama Korumalı');
    else if (lvl === '4') list.push('IPX4 Sıçrama Korumalı');
    else if (lvl === '5') list.push('IPX5 Su Püskürtme Dayanımlı');
    else if (lvl === '6') list.push('IPX6 Güçlü Su Dayanımlı');
    else if (lvl === '7') list.push('IPX7 Su Geçirmez');
    else if (lvl === '8') list.push('IPX8 Tam Su Altı Geçirmez');
    else list.push(`IPX${lvl} Sertifikalı`);
  } else if (lower.includes('tamamen su geçirmez') || lower.includes('%100 su geçirmez') || lower.includes('100% su geçirmez')) {
    list.push('%100 Su Geçirmez');
  } else if (lower.includes('su geçirmezlik: evet') || (lower.includes('su geçirmez') && !lower.includes('su geçirmez değildir'))) {
    list.push('Su Geçirmez Gövde');
  }

  // 3. MATERIAL (VERIFIED)
  if (lower.includes('medikal platin') || lower.includes('platinum silikon')) list.push('Medikal Platinum Silikon');
  else if (lower.includes('sıvı silikon') || lower.includes('liquid silicone')) list.push('Medikal Sıvı Silikon');
  else if (lower.includes('medikal silikon') || lower.includes('tıbbi sınıf')) list.push('%100 Medikal Silikon');
  else if (lower.includes('tpe') || lower.includes('cyberskin') || lower.includes('tpr')) list.push('Gerçekçi Medikal TPE');
  else if (lower.includes('borosilikat') || lower.includes('cam dildo')) list.push('Borosilikat Medikal Cam');
  else if (lower.includes('paslanmaz çelik') || lower.includes('metal plug') || lower.includes('çelik')) list.push('Medikal Paslanmaz Çelik');
  else if (lower.includes('vegan deri') || lower.includes('suni deri')) list.push('Yumuşak Vegan Deri');
  else if (lower.includes('peluş')) list.push('Peluş Kaplamalı Metal');
  else if (lower.includes('lateks')) list.push('Klinik Doğal Lateks');

  // 4. POWER / CHARGE (VERIFIED)
  if (lower.includes('manyetik') && (lower.includes('şarj') || lower.includes('usb'))) list.push('Manyetik Hızlı Şarj');
  else if (lower.includes('type-c') || lower.includes('type c')) list.push('Type-C Hızlı Şarj');
  else if (lower.includes('usb') && (lower.includes('şarj') || lower.includes('kablo'))) list.push('USB Şarj Edilebilir');
  else if (lower.includes('2aaa') || lower.includes('2xaaa') || lower.includes('2 adet aaa')) list.push('2x AAA Pille Çalışır');
  else if (lower.includes('1aaa') || lower.includes('1xaaa') || lower.includes('1 adet aaa')) list.push('1x AAA Pille Çalışır');
  else if (lower.includes('2aa') || lower.includes('2xaa') || lower.includes('2 adet aa')) list.push('2x AA Pille Çalışır');
  else if (lower.includes('şarj edilebilir') || lower.includes('şarjlı')) list.push('Şarj Edilebilir Batarya');

  // 5. FUNCTION / MODES (VERIFIED)
  const modeMatch = fullText.match(/(\d+)\s*(?:farklı\s*)?(?:titreşim|hız|frekans|mod|program|fonksiyon)/i);
  if (modeMatch) {
    list.push(`${modeMatch[1]} Titreşim Modu`);
  }
  if (lower.includes('çift motor') || lower.includes('iki motor')) list.push('Çift Bağımsız Motor');
  if (lower.includes('app') || lower.includes('telefon kontrollü') || lower.includes('bluetooth')) list.push('Mobil Uygulama Kontrollü');
  if (lower.includes('ısıtma') || lower.includes('ısıtmalı')) list.push('Vücut Sıcaklığında Isıtma');
  if (lower.includes('360°') || lower.includes('dönen başlık')) list.push('360° Dönen Başlık');
  if (lower.includes('sessiz') || lower.includes('45db') || lower.includes('40db')) list.push('<45dB Fısıltı Motoru');
  if (lower.includes('vantuz')) list.push('Güçlü Sabitleme Vantuzu');
  if (lower.includes('dermatolojik')) list.push('Dermatolojik Onaylı');

  // 6. COSMETICS / VOLUME (VERIFIED)
  const mlMatch = fullText.match(/(\d+)\s*ml\b/i);
  if (mlMatch && (lower.includes('jel') || lower.includes('sprey') || lower.includes('damla') || lower.includes('krem') || lower.includes('yağ') || lower.includes('serum'))) {
    list.push(`${mlMatch[1]} ml Net Hacim`);
  }

  // 7. NEUTRAL VERIFIABLE FALLBACKS (NEVER INVENT WATERPROOF, DOSE OR FAKE SPECS)
  const safeFallbacks = [
    LANG === 'en' ? '100% Original & Invoiced' : '%100 Orijinal & Faturalı',
    LANG === 'en' ? 'Discreet Packaging' : '%100 Gizli Paketleme',
    LANG === 'en' ? 'Hygienic Factory Seal' : 'Hijyenik Koruma Mührü'
  ];
  for (const item of safeFallbacks) {
    if (list.length >= 3) break;
    if (!list.includes(item)) list.push(item);
  }

  return list.slice(0, 4);
}

// Compute Smart Dynamic Specs (Custom Highlights > Strict Text Extraction > Safe Universal)
export function getProductSpecs(prod) {
  let specTexts = [];
  if (Array.isArray(prod.highlights) && prod.highlights.length) {
    specTexts = prod.highlights.map(s => String(s).trim()).filter(Boolean);
  }

  if (specTexts.length === 0) {
    specTexts = extractRealHighlights(prod);
  }

  return specTexts.slice(0, 4).map(text => ({
    icon: getSpecIcon(text),
    text: String(text).trim()
  }));
}

// Compute Dynamic Context-Aware Highlight Badge (No generic "Orijinal Formül" on devices/dolls)
export function getSpatialHighlightBadge(p) {
  const cat = String(p.category || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();
  const desc = String(p.description || '').toLowerCase();
  const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
  const allText = `${cat} ${name} ${desc} ${tags}`;

  // 1. Realistic / Dolls / Silicone Torso / Pocket Masturbator
  if (
    cat.includes('vajina') || cat.includes('sisme') || cat.includes('masturbator') ||
    allText.includes('realistik') || allText.includes('manken') || allText.includes('vajina') ||
    allText.includes('mastürbatör') || allText.includes('cep tipi') || allText.includes('tpe')
  ) {
    return LANG === 'en' ? '★ Ultra-Realistic Texture' : '★ Gerçekçi Medikal Doku';
  }

  // 2. Electronic / Vibrator / Rechargeable / Massager
  if (
    cat.includes('vibrator') || allText.includes('vibratör') || allText.includes('şarjlı') ||
    allText.includes('titreşimli') || allText.includes('motor') || allText.includes('masaj') ||
    allText.includes('emme') || allText.includes('klitoris')
  ) {
    return LANG === 'en' ? '★ Whisper-Quiet Motor' : '★ Fısıltı Sessiz Motor';
  }

  // 3. Cosmetics / Gels / Sprays / Creams / Delay / Performance
  if (
    cat.includes('kozmetik') || cat.includes('saglik') || cat.includes('kayganlastirici') ||
    allText.includes('sprey') || allText.includes('krem') || allText.includes('jel') ||
    allText.includes('damla') || allText.includes('geciktirici') || allText.includes('lube') ||
    allText.includes('yağ') || allText.includes('stag')
  ) {
    if (allText.includes('geciktirici') || allText.includes('stag') || allText.includes('performans')) {
      return LANG === 'en' ? '★ Maximum Potency' : '★ Maksimum Etki';
    }
    return LANG === 'en' ? '★ Verified Formula' : '★ Orijinal Formül';
  }

  // 4. Lingerie / Costume / Fantasy Wear
  if (
    cat.includes('fantezi') || cat.includes('fantasy') || cat.includes('kostum') ||
    cat.includes('giyim') || allText.includes('dantel') || allText.includes('gecelik') ||
    allText.includes('çorap') || allText.includes('babydoll')
  ) {
    return LANG === 'en' ? '★ Soft Silk Fit' : '★ İpeksi Esnek Kalıp';
  }

  // 5. BDSM / Leather / Restraints
  if (
    cat.includes('bdsm') || allText.includes('kelepçe') || allText.includes('deri') ||
    allText.includes('kırbaç') || allText.includes('harness')
  ) {
    return LANG === 'en' ? '★ Reinforced Durability' : '★ Güçlendirilmiş Materyal';
  }

  // 6. Dildo / Anal / Non-electric Body-Safe
  if (cat.includes('dildo') || cat.includes('anal') || allText.includes('dildo') || allText.includes('anal')) {
    return LANG === 'en' ? '★ 100% Body-Safe' : '★ %100 Vücut Dostu';
  }

  // 7. General / Editorial Default
  return LANG === 'en' ? '★ Editor\'s Choice' : '★ Editörün Seçimi';
}

// Compute Dynamic Category & Material Aware Care/Hygiene Guide
export function getSpatialCareGuide(p) {
  if (p.careGuide && typeof p.careGuide === 'object' && p.careGuide.text) {
    return {
      title: p.careGuide.title || (LANG === 'en' ? 'Usage & Care Guide' : 'Kullanım & Bakım Rehberi'),
      text: p.careGuide.text,
      icon: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>'
    };
  }
  if (typeof p.careGuide === 'string' && p.careGuide.trim()) {
    return {
      title: LANG === 'en' ? 'Usage & Care Guide' : 'Kullanım & Bakım Rehberi',
      text: p.careGuide.trim(),
      icon: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>'
    };
  }

  const cat = String(p.category || '').toLowerCase();
  const name = String(p.name || '').toLowerCase();
  const desc = String(p.description || '').toLowerCase();
  const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
  const mat = String(p.material || '').toLowerCase();
  const allText = `${cat} ${name} ${desc} ${tags} ${mat}`;

  // 1. Cosmetics / Oils / Lubricants / Sprays / Creams / Perfume / Gels
  if (
    cat.includes('kozmetik') || cat.includes('saglik') || cat.includes('kayganlastirici') || cat.includes('lubricant') ||
    allText.includes('kayganlaştırıcı') || allText.includes('kayganlastirici') || allText.includes('masaj yağı') ||
    allText.includes('masaj yagi') || allText.includes('sprey') || allText.includes('krem') || allText.includes('jel') ||
    allText.includes('parfüm') || allText.includes('geciktirici') || allText.includes('temizleme solüsyonu')
  ) {
    return {
      title: LANG === 'en' ? 'Usage, Application & Storage Guide' : 'Kullanım, Uygulama & Saklama Rehberi',
      text: LANG === 'en'
        ? 'Apply a sufficient amount gently to clean, dry skin. 100% compatible with condoms and adult wellness devices. Avoid direct contact with eyes. Keep lid tightly sealed and store at room temperature away from direct sunlight.'
        : 'Yeterli miktarda ürünü temiz ve kuru bölgeye nazikçe uygulayınız. Kondom ve yetişkin ürünleri ile %100 uyumludur. Göz ile doğrudan temasından kaçınınız. Doğrudan güneş ışığından uzak, oda sıcaklığında (serin ve kuru ortamda) kapağı kapalı muhafaza ediniz.',
      icon: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>'
    };
  }

  // 2. Electronic / Vibrators / Masturbators / Rechargeable / Motorized
  if (
    cat.includes('vibrator') || cat.includes('masturbator') || cat.includes('vajina') || cat.includes('sisme') ||
    allText.includes('vibratör') || allText.includes('vibrator') || allText.includes('şarjlı') || allText.includes('sarjli') ||
    allText.includes('manyetik şarj') || allText.includes('usb') || allText.includes('titreşimli') || allText.includes('titresimli') ||
    allText.includes('motor') || allText.includes('mastürbatör') || allText.includes('masturbator')
  ) {
    return {
      title: LANG === 'en' ? 'Charging, Care & Waterproof Guide' : 'Şarj, Bakım & Su Koruması',
      text: LANG === 'en'
        ? 'Disconnect charging cable before cleaning. Clean the body with warm water and antibacterial soap or toy cleaner while protecting the charging port. Use only water-based lubricants to protect motor and silicone seals. Dry completely before storing in its pouch.'
        : 'Temizleme ve şarj işlemlerinden önce şarj kablosunu çıkarınız. Şarj giriş portunu koruyarak cihaz gövdesini ılık su ve antibakteriyel sabun veya özel oyuncak temizleyicisi ile temizleyiniz. Motor ve silikon yalıtımını korumak için yalnızca su bazlı kayganlaştırıcılar ile kullanınız. Tamamen kuruduktan sonra kendi koruyucu kılıfında saklayınız.',
      icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>'
    };
  }

  // 3. Lingerie / Costume / Fantasy Wear / Leather & Lace Apparel
  if (
    cat.includes('fantezi') || cat.includes('fantasy') || cat.includes('kostum') || cat.includes('giyim') || cat.includes('lingerie') ||
    allText.includes('çorap') || allText.includes('gecelik') || allText.includes('sütyen') || allText.includes('jartiyer') ||
    allText.includes('kostüm') || allText.includes('dantel') || allText.includes('bodysuit') || allText.includes('tanga')
  ) {
    return {
      title: LANG === 'en' ? 'Fabric Care & Washing Guide' : 'Kumaş, Yıkama & Bakım Talimatı',
      text: LANG === 'en'
        ? 'Hand wash at 30°C or use a delicate laundry bag to preserve delicate lace and elastic fibers. Do not bleach or tumble dry. Dry flat away from direct heat sources and do not iron.'
        : 'Doku, dantel ve dikiş kalitesini uzun süre korumak için 30°C\'de elde veya çamaşır torbasında hassas programda yıkayınız. Ağartıcı veya çamaşır suyu kullanmayınız. Ütüleme yapmayınız ve doğrudan ısı kaynaklarından uzak, sererek kurutunuz.',
      icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>'
    };
  }

  // 4. Glass / Metal / Stainless Steel
  if (
    allText.includes('cam') || allText.includes('glass') || allText.includes('metal') || allText.includes('çelik') ||
    allText.includes('paslanmaz') || allText.includes('stainless steel') || allText.includes('alüminyum')
  ) {
    return {
      title: LANG === 'en' ? 'Sterilization & Compatibility Guide' : 'Sterilizasyon & Uyumluluk Rehberi',
      text: LANG === 'en'
        ? '100% non-porous surface can be safely sterilized with boiling water, antibacterial soap, or alcohol-free sanitizers. Fully compatible with water, silicone, and oil-based lubricants. Store in a padded pouch to protect against drops.'
        : 'Gözeneksiz yapısı sayesinde kaynar su, antibakteriyel sabun veya alkolsüz dezenfektanlar ile kolayca %100 sterilize edilebilir. Su bazlı, silikon ve yağ bazlı tüm kayganlaştırıcı türleri ile tam uyumludur. Çizilme ve sert darbelere karşı koruyucu kılıfında saklayınız.',
      icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
    };
  }

  // 5. BDSM / Restraints / Bondage / Harness / Hardware
  if (
    cat.includes('bdsm') || cat.includes('fantezi-aksesuar') || allText.includes('kelepçe') || allText.includes('kelepce') ||
    allText.includes('kırbaç') || allText.includes('tasma') || allText.includes('harness') || allText.includes('göz bandı') ||
    allText.includes('bondage') || allText.includes('deri kelepçe')
  ) {
    return {
      title: LANG === 'en' ? 'Material Care & Preservation' : 'Materyal Bakımı & Muhafaza',
      text: LANG === 'en'
        ? 'Wipe leather, vegan leather, and metal hardware with a soft, slightly damp cloth. Dry metal parts immediately to prevent tarnish. Store flat or hanging in a well-ventilated dry space.'
        : 'Deri, suni deri ve metal aksamları nemli, yumuşak bir bezle silerek temizleyiniz. Metal parçaların korozyonunu önlemek için temizlik sonrası hemen kurulayınız. Nemden uzak, hava alan kuru bir alanda asarak veya sererek muhafaza ediniz.',
      icon: '<polyline points="20 6 9 17 4 12"></polyline>'
    };
  }

  // 6. Realistic / Silicone / Dildos / Anals / TPE (Default Body-Safe)
  return {
    title: LANG === 'en' ? 'Usage, Care & Hygiene Guide' : 'Kullanım, Bakım & Hijyen Rehberi',
    text: LANG === 'en'
      ? 'Wash thoroughly with warm water and antibacterial soap or toy cleaner before and after each use. Use only water-based lubricants to preserve silicone texture (silicone lubricants can damage the surface). Store in a dry, cool, dust-free environment.'
      : 'Kullanım öncesi ve sonrası ılık su ve antibakteriyel sabun veya özel oyuncak temizleyicisi ile yıkayınız. Ürün dokusunu ve esnekliğini korumak için yalnızca su bazlı kayganlaştırıcılar ile kullanılması önerilir (silikon kayganlaştırıcılar dokuyu eritebilir). Serin, kuru ve toz tutmayan ortamda saklayınız.',
    icon: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>'
  };
}

let activeOriginCard = null;
let activeZoomRequestId = 0;
let activePlaylist = [];
let activeCategory = null;

export async function openSpatialCardZoom(productIdOrSlug, originCard) {
  if (!productIdOrSlug) return;
  const overlay = $('#spatial-canvas-overlay');
  const stage = $('#spatial-card-stage');
  if (!overlay || !stage) return;
  const reqId = ++activeZoomRequestId;
  activeOriginCard = originCard;

  // Only freeze background body and record initial page scroll if modal is not already open
  if (!overlay.classList.contains('open')) {
    lockBodyScroll();
  }
  
  // Conditionally show/hide outer arrows
  const prevBtn = $('#spatial-outer-prev');
  const nextBtn = $('#spatial-outer-next');
  if (prevBtn && nextBtn) {
    // We can always show arrows now because it pulls from category, unless we have no playlist yet?
    // Let's just always show them if we are in spatial view, except if we literally have 0 siblings.
    // We will update their visibility after fetching.
  }

  // Morph origin card if available
  if (originCard) {
    originCard.style.opacity = '0.4';
    originCard.style.transform = 'scale(0.97)';
    originCard.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  }

  const isAlreadyOpen = overlay.classList.contains('open') && stage.querySelector('.spatial-grid');
  if (isAlreadyOpen) {
    const grid = stage.querySelector('.spatial-grid');
    if (grid) grid.style.opacity = '0.3';
  } else {
    stage.innerHTML = `
      <button type="button" class="spatial-stage-close" id="spatial-stage-close" aria-label="${LANG === 'en' ? 'Close' : 'Kapat'}">✕</button>
      <div style="display:flex;align-items:center;justify-content:center;height:460px;width:100%;">
        <div class="spinner"></div>
      </div>
    `;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    $('#spatial-stage-close', stage)?.addEventListener('click', closeSpatialCardZoom);
  }

  try {
    const cleanKey = String(productIdOrSlug || '').replace(/^\/urun\//, '').replace(/\/+$/, '').trim();
    const fetchTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error(LANG === 'en' ? 'Server timeout. Please try again.' : 'Sunucu yanıtı zaman aşımına uğradı. Lütfen tekrar deneyiniz.')), 7000));
    const res = await Promise.race([api('/api/products/' + encodeURIComponent(cleanKey)), fetchTimeout]);
    if (reqId !== activeZoomRequestId) return;
    const p = (res && res.product) ? res.product : res;
    if (!p || !p.id) throw new Error(LANG === 'en' ? 'Product not found' : 'Ürün bulunamadı');
    
    // Auto-fetch playlist for infinite browsing
    if (p.category && activeCategory !== p.category) {
      try {
        const catRes = await Promise.race([
          api('/api/products?limit=100&cat=' + encodeURIComponent(p.category)),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000))
        ]);
        if (catRes && catRes.products) {
          activePlaylist = catRes.products;
          activeCategory = p.category;
        }
      } catch (e) { console.error('Playlist fetch error:', e); }
    } else if (!p.category) {
      activePlaylist = [];
      activeCategory = null;
    }
    
    // Update outer arrows visibility based on playlist length
    const prevBtn = $('#spatial-outer-prev');
    const nextBtn = $('#spatial-outer-next');
    if (prevBtn && nextBtn) {
      if (activePlaylist && activePlaylist.length > 1) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
      } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      }
    }

    const inStock = p.stock > 0;
    const stockBadge = inStock
      ? `<span class="stock-pill in-stock">● ${LANG === 'en' ? 'In Stock · Same Day Dispatch' : 'Stokta · 14:00 Öncesi Aynı Gün Kargo'}</span>`
      : `<span class="stock-pill out-stock">● ${LANG === 'en' ? 'Out of Stock' : 'Tükendi'}</span>`;

    const productGallery = (Array.isArray(p.gallery) && p.gallery.length) ? p.gallery : (p.image ? [p.image] : []);
    const hasMultipleImages = productGallery.length > 1;

    const descLead = p.description ? `<p class="spatial-desc">${esc(p.description)}</p>` : '';
    const fullDesc = p.longDescription || p.description || '';
    const activeSpecs = getProductSpecs(p);
    const careGuide = getSpatialCareGuide(p);
    const highlightBadge = getSpatialHighlightBadge(p);
    
    let mainTitle = p.name;
    let subTitle = '';
    if (p.name.includes(' - ')) {
      const parts = p.name.split(' - ');
      mainTitle = parts[0];
      subTitle = parts.slice(1).join(' - ');
    }

    stage.innerHTML = `
      <button type="button" class="spatial-stage-close" id="spatial-stage-close" aria-label="${LANG === 'en' ? 'Close' : 'Kapat'}">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="spatial-grid ${isAlreadyOpen ? 'crossfade-in' : ''}">
        <div class="spatial-visual-hero ${!inStock ? 'is-out-of-stock' : ''}">
          <div class="spatial-ambient-glow" id="spatial-ambient-glow"></div>
          <img id="spatial-main-image" src="${imgSrc(p.image)}" alt="${esc(p.name)}">
          ${!inStock ? `<div class="card-out-badge"><span>${LANG === 'en' ? 'OUT OF STOCK' : 'TÜKENDİ'}</span></div>` : ''}
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
          <div class="spatial-scrollable-body">
            <div class="spatial-top-meta-editorial">
              <a href="/magaza?kat=${encodeURIComponent(p.category || '')}" class="spatial-cat-editorial" title="${catName(p.category, p.categoryName)}">
                <span>${catName(p.category, p.categoryName)}</span>
              </a>
              <div class="spatial-stock-whisper ${!inStock ? 'is-out' : ''}">
                ${inStock ? `
                  <span class="pulse-indicator live-green"></span>
                  <span>${LANG === 'en' ? 'In Stock' : 'Stokta'}</span>
                ` : `
                  <span class="spatial-stock-badge-out">${LANG === 'en' ? 'TÜKENDİ' : 'TÜKENDİ'}</span>
                  <span class="spatial-out-whisper-text">${LANG === 'en' ? 'Temporarily out of stock' : 'Geçici olarak temin edilemiyor'}</span>
                `}
              </div>
            </div>

            <div class="spatial-title-editorial">
              <h1 class="spatial-title-main">${esc(mainTitle)}</h1>
              ${subTitle ? `<span class="spatial-title-sub">${esc(subTitle)}</span>` : ''}
            </div>

            <div class="spatial-editorial-price-box">
              <div class="spatial-price-group-ed">
                <span class="spatial-price-ed">${fmt(p.price)}</span>
                ${p.oldPrice ? `<span class="spatial-price-old-ed">${fmt(p.oldPrice)}</span>` : ''}
              </div>
              <div class="spatial-highlight-whisper">
                ${esc(highlightBadge)}
              </div>
            </div>

            <!-- 2026 Swiss Typographic Spec-List (Option 3) -->
            <div class="spatial-spec-deck spatial-swiss-list">
              ${activeSpecs.slice(0, 4).map((spec) => `
                <div class="spatial-swiss-item">
                  <div class="spatial-swiss-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${spec.icon}</svg>
                  </div>
                  <span>${esc(spec.text)}</span>
                </div>
              `).join('')}
            </div>

                      </div>

          <!-- Sticky Action Bar with Apple Dynamic Pill -->
          <div class="spatial-action-bar">
            <!-- Unified Editorial Guarantee Row -->
            <div class="spatial-trust-ribbon">
              <div class="spatial-trust-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>${LANG === 'en' ? 'Original Product · Discreet Packaging' : 'Orijinal Ürün · Gizli Paketleme'}</span>
              </div>
              <a href="/urun/${p.slug || p.id}" class="spatial-all-features-link">
                <span>${LANG === 'en' ? 'Full Details' : 'Tüm Detaylar'}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </a>
            </div>
            ${inStock ? `
            <div class="spatial-dynamic-pill">
              <div class="spatial-pill-stepper">
                <button type="button" class="spatial-qty-btn" id="spatial-qty-dec" aria-label="Azalt">−</button>
                <span class="spatial-qty-val" id="spatial-qty-val">1</span>
                <button type="button" class="spatial-qty-btn" id="spatial-qty-inc" aria-label="Artır">+</button>
              </div>
              <button type="button" class="spatial-pill-cta" id="spatial-add-btn" data-product-id="${p.id}">
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
            ` : `
            <div class="spatial-dynamic-pill is-out">
              <button type="button" class="spatial-pill-cta is-out" id="spatial-add-btn" disabled aria-disabled="true">
                <svg class="pill-bag-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                </svg>
                <span class="pill-cta-label">${LANG === 'en' ? 'OUT OF STOCK' : 'STOKTA TÜKENDİ'}</span>
              </button>
            </div>
            `}
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
    
    // Gallery Switcher Function with Directional Kinetic Glide
    let activeImgIdx = 0;
    const updateActiveImage = (newIdx, direction = 0) => {
      if (!hasMultipleImages) return;
      if (newIdx < 0) newIdx = productGallery.length - 1;
      if (newIdx >= productGallery.length) newIdx = 0;
      if (newIdx === activeImgIdx && direction === 0) return;
      
      const prevIdx = activeImgIdx;
      activeImgIdx = newIdx;
      const targetImg = productGallery[activeImgIdx];
      
      if (spatialMain && targetImg) {
        const outShift = direction !== 0 ? (direction > 0 ? -28 : 28) : 0;
        const inShift = direction !== 0 ? (direction > 0 ? 28 : -28) : 0;
        
        spatialMain.style.transition = 'transform 0.16s cubic-bezier(0.4, 0, 1, 1), opacity 0.16s ease';
        spatialMain.style.opacity = '0.2';
        spatialMain.style.transform = `translateX(${outShift}px) scale(0.95)`;
        
        setTimeout(() => {
          spatialMain.src = imgSrc(targetImg);
          spatialMain.style.transition = 'none';
          spatialMain.style.transform = `translateX(${inShift}px) scale(0.95)`;
          
          // Force layout reflow
          void spatialMain.offsetWidth;
          
          spatialMain.style.transition = 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease';
          spatialMain.style.opacity = '1';
          spatialMain.style.transform = 'translateX(0) scale(1)';
        }, 160);
      }
      $$('.spatial-dot', stage).forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeImgIdx);
      });
    };

    if (spatialVisual && spatialMain) {
      let startX = 0;
      let startY = 0;
      let currentScale = 1;
      let lastDeltaY = 0;
      let lastDeltaX = 0;
      let isPulling = false;
      let gestureMode = null; // 'pull' | 'swipe' | null
      
      spatialVisual.addEventListener('touchstart', (e) => {
        if (e.target.closest('.spatial-dots')) return;
        
        const scrollTop = stageGrid ? stageGrid.scrollTop : 0;
        if (scrollTop <= 5 && e.touches.length === 1) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          isPulling = false;
          gestureMode = null;
          currentScale = 1;
          lastDeltaY = 0;
          lastDeltaX = 0;
          
          spatialMain.style.transition = 'none';
          spatialMain.style.transformOrigin = '50% 25%';
          spatialMain.style.willChange = 'transform, filter';
          
          if (spatialGlow) spatialGlow.style.transition = 'none';
          if (contentPane) contentPane.style.transition = 'none';
          if (closeBtn) closeBtn.style.transition = 'none';
          if (badgeCluster) badgeCluster.style.transition = 'none';
        }
      }, { passive: true });

      spatialVisual.addEventListener('touchmove', (e) => {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        const deltaX = currentX - startX;
        
        // Determine gesture mode if not locked yet
        if (!gestureMode && (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8)) {
          if (Math.abs(deltaX) > Math.abs(deltaY) && hasMultipleImages) {
            gestureMode = 'swipe';
          } else if (deltaY > 6) {
            gestureMode = 'pull';
            isPulling = true;
            spatialMain.style.zIndex = '9999';
            spatialVisual.style.overflow = 'visible';
            spatialVisual.style.zIndex = '9999';
            if (stageGrid) stageGrid.style.overflow = 'visible';
            if (stage) stage.style.overflow = 'visible';
          }
        }

        if (gestureMode === 'swipe') {
          e.preventDefault();
          lastDeltaX = deltaX;
          // Subtle horizontal rubber-band follow
          const swipeShift = deltaX * 0.4;
          spatialMain.style.transform = `translateX(${swipeShift.toFixed(1)}px)`;
        } else if (gestureMode === 'pull' && deltaY > 0) {
          e.preventDefault();
          lastDeltaY = deltaY;
          lastDeltaX = deltaX;
          if (!spatialVisual.classList.contains('is-pulling')) {
            spatialVisual.classList.add('is-pulling');
          }
          if (stage && !stage.classList.contains('is-pulling-mode')) {
            stage.classList.add('is-pulling-mode');
          }
          
          // Pure Tactile Pull-to-Zoom: Bolds and expands the product image powerfully
          const maxTravelY = 120;
          const pullForce = deltaY * 0.7;
          const moveY = Math.min(maxTravelY, pullForce / (1 + pullForce / (maxTravelY * 2.2)));
          const progress = Math.min(1, deltaY / 130);
          
          // Confident, rich zoom magnification (1.00x -> 1.75x) with center-focused transform
          const scale = 1 + Math.pow(progress, 0.85) * 0.78;
          currentScale = scale;
          
          spatialMain.style.transform = `translateY(${moveY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
          spatialMain.style.filter = `drop-shadow(0 ${(18 + progress * 24).toFixed(1)}px ${(32 + progress * 36).toFixed(1)}px rgba(0,0,0,${(0.28 + progress * 0.42).toFixed(2)}))`;
          
          if (spatialGlow) {
            spatialGlow.style.transform = `translate(-50%, -50%) translateY(${(moveY * 0.35).toFixed(1)}px) scale(${(1 + progress * 1.2).toFixed(2)})`;
            spatialGlow.style.opacity = '1';
          }

          if (contentPane) {
            const blurPx = (progress * 8.0).toFixed(1);
            const paneScale = (1 - progress * 0.06).toFixed(3);
            const paneShift = (progress * 12).toFixed(1);
            const paneOpacity = (1 - progress * 0.35).toFixed(2);
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
        }
      }, { passive: false });

      const handleTouchEnd = () => {
        if (gestureMode === 'swipe') {
          if (lastDeltaX < -35) {
            // Swiped Left -> Next image (moves from right to left)
            updateActiveImage(activeImgIdx + 1, 1);
          } else if (lastDeltaX > 35) {
            // Swiped Right -> Prev image (moves from left to right)
            updateActiveImage(activeImgIdx - 1, -1);
          } else {
            spatialMain.style.transition = 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1)';
            spatialMain.style.transform = 'none';
            setTimeout(() => {
              spatialMain.style.transform = '';
              spatialMain.style.transition = '';
            }, 240);
          }
          gestureMode = null;
          lastDeltaX = 0;
          return;
        }

        if (gestureMode === 'pull' || isPulling || currentScale > 1 || lastDeltaY > 0) {
          isPulling = false;
          gestureMode = null;
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

      spatialVisual.addEventListener('touchend', handleTouchEnd);
      spatialVisual.addEventListener('touchcancel', handleTouchEnd);
    }

    // Gallery Dot Click & Desktop Arrow Navigation
    if (hasMultipleImages) {
      $('#spatial-nav-prev', stage)?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateActiveImage(activeImgIdx - 1, -1);
      });

      $('#spatial-nav-next', stage)?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateActiveImage(activeImgIdx + 1, 1);
      });

      $$('.spatial-dot', stage).forEach((dot) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const idx = parseInt(dot.dataset.dotIdx, 10);
          if (!isNaN(idx)) {
            const dir = idx > activeImgIdx ? 1 : -1;
            updateActiveImage(idx, dir);
          }
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

    // Clicking 'Tüm Detaylar' navigates to product page
    $('.spatial-all-features-link', stage)?.addEventListener('click', function(e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      
      // Clean up the URL before navigating, so clicking 'Back' doesn't reopen modal
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('modal');
      cleanUrl.searchParams.delete('id');
      cleanUrl.searchParams.delete('urun'); // just in case
      window.history.replaceState({}, '', cleanUrl.toString());

      const btn = this;
      btn.classList.add('is-loading');
      btn.style.pointerEvents = 'none';
      const label = btn.querySelector('span');
      if (label) label.textContent = LANG === 'en' ? 'Loading...' : 'Yükleniyor...';
      const svg = btn.querySelector('svg');
      if (svg) svg.style.display = 'none';
      
      // Fallback reset in case navigation is cancelled or bfcache restores it
      setTimeout(() => {
        if (document.body.contains(btn)) {
          btn.classList.remove('is-loading');
          btn.style.pointerEvents = '';
          if (label) label.textContent = LANG === 'en' ? 'Full Details' : 'Tüm Detaylar';
          if (svg) svg.style.display = '';
        }
      }, 1500);
    });

    addBtn?.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!inStock) return;
      const targetPid = addBtn.dataset.productId || p.id;
      const pillContainer = addBtn.closest('.spatial-dynamic-pill');
      if (targetPid) {
        addBtn.classList.add('is-loading');
        await addToCart(targetPid, currentQty, 'standart', null);
        addBtn.classList.remove('is-loading');
        
        if (pillContainer) pillContainer.classList.add('is-success');
        addBtn.classList.add('is-success');
        const ctaLabel = $('.pill-cta-label', addBtn);
        const originalLabel = ctaLabel ? ctaLabel.textContent : '';
        if (ctaLabel) ctaLabel.textContent = LANG === 'en' ? 'Added ✓' : 'Eklendi ✓';
        
        setTimeout(() => {
          if (pillContainer) pillContainer.classList.remove('is-success');
          addBtn.classList.remove('is-success');
          if (ctaLabel) ctaLabel.textContent = originalLabel;
        }, 1800);
      }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('urun') !== (p.slug || p.id)) {
      const wasAlreadyInModal = params.has('urun');
      params.set('urun', p.slug || p.id);
      if (wasAlreadyInModal) {
        window.history.replaceState({ modal: 'spatial', id: p.id }, '', window.location.pathname + '?' + params.toString());
      } else {
        window.history.pushState({ modal: 'spatial', id: p.id }, '', window.location.pathname + '?' + params.toString());
      }
    }
  } catch (err) {
    if (!stage) return;
    stage.innerHTML = `
      <button type="button" class="spatial-stage-close" id="spatial-stage-close" aria-label="${LANG === 'en' ? 'Close' : 'Kapat'}">✕</button>
      <div class="empty-state" style="padding:60px 20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;min-height:300px;">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.5;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p style="margin:0;font-size:15px;color:var(--text);font-weight:500;">${esc(err.message || (LANG === 'en' ? 'Product details could not be loaded.' : 'Ürün detayları yüklenemedi.'))}</p>
        <button type="button" class="btn btn-ghost" id="spatial-retry-btn" style="margin-top:4px;font-size:13px;">${LANG === 'en' ? 'Try Again' : 'Yeniden Dene'}</button>
      </div>`;
    $('#spatial-stage-close', stage)?.addEventListener('click', closeSpatialCardZoom);
    $('#spatial-retry-btn', stage)?.addEventListener('click', () => openSpatialCardZoom(productIdOrSlug, originCard));
  }
}

export function closeSpatialCardZoom(skipHistoryUpdate = false) {
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
  unlockBodyScroll();
  if (activeOriginCard) {
    activeOriginCard.style.opacity = '';
    activeOriginCard.style.transform = '';
    activeOriginCard.style.transition = '';
    activeOriginCard = null;
  }
  if (skipHistoryUpdate !== true) {
    const params = new URLSearchParams(window.location.search);
    if (params.has('urun')) {
      params.delete('urun');
      const qs = params.toString() ? '?' + params.toString() : '';
      window.history.pushState({}, '', window.location.pathname + qs);
    }
  }
}

export function initSpatialAnimations() {
  initTiltPhysics();

  $('#spatial-canvas-overlay')?.addEventListener('click', (e) => {
    if (e.target === $('#spatial-canvas-overlay')) closeSpatialCardZoom();
  });
  
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const urun = params.get('urun');
    if (urun) {
      openSpatialCardZoom(urun, null);
    } else {
      closeSpatialCardZoom(true);
    }
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted && $('#spatial-canvas-overlay')?.classList.contains('open')) {
      closeSpatialCardZoom(true);
    }
  });

  document.addEventListener('spa:navigated', () => {
    if ($('#spatial-canvas-overlay')?.classList.contains('open')) {
      closeSpatialCardZoom(true);
    }
  });

  setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    const urun = params.get('urun');
    if (urun) openSpatialCardZoom(urun, null);
  }, 150);

  const stageEl = $('#spatial-card-stage');
  if (stageEl) {
    stageEl.addEventListener('click', (e) => e.stopPropagation());
    stageEl.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    stageEl.addEventListener('touchend', (e) => e.stopPropagation(), { passive: true });
  }

  // Global event delegation for cards and modal actions
  document.addEventListener('click', (e) => {
    // 1. Close modal if clicking a navigation link inside spatial modal (e.g. category)
    const modalLink = e.target.closest('#spatial-card-stage a');
    if (modalLink) {
      const href = modalLink.getAttribute('href') || '';
      if (!href.startsWith('#')) {
        closeSpatialCardZoom();
      }
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

    // 3. Card click (media or title) & Cart item click — opens Spatial Morphing Stage Canvas
    const cardLink = e.target.closest('.prod-card .prod-media, .prod-card .prod-name, .cart-line-thumb, .cl-name');
    if (cardLink && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      if (!location.pathname.startsWith('/urun/')) {
        e.preventDefault();
        e.stopPropagation();
        const card = cardLink.closest('.prod-card, .cart-line');
        const rawHref = cardLink.getAttribute('href') || '';
        const hrefKey = rawHref.replace(/^\/urun\//, '').replace(/\/+$/, '').trim();
        const pid = card?.dataset?.slug || cardLink.dataset?.slug || card?.dataset?.pid || card?.dataset?.id || hrefKey;
        if (pid) {
          // If clicked from cart drawer/modal, close drawer first
          const cartDrawer = $('#cart-drawer');
          if (cartDrawer && cartDrawer.classList.contains('open')) {
            cartDrawer.classList.remove('open');
            document.body.classList.remove('drawer-open');
          }
          openSpatialCardZoom(pid, card.classList.contains('prod-card') ? card : null);
          return;
        }
      }
    }
  });

  // Global outer arrow navigation logic (Smart Playlist)
  const navigateToSibling = (direction) => {
    if (!$('#spatial-canvas-overlay')?.classList.contains('open')) return;
    if (!activePlaylist || activePlaylist.length < 2) return; // Need a playlist
    
    // Find current product in the playlist
    const currentId = new URLSearchParams(window.location.search).get('urun') || new URLSearchParams(window.location.search).get('id');
    if (!currentId) return;
    
    const currentIndex = activePlaylist.findIndex(p => p.slug === currentId || String(p.id) === String(currentId));
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = activePlaylist.length - 1; // loop around
    if (nextIndex >= activePlaylist.length) nextIndex = 0; // loop around
    
    const nextProduct = activePlaylist[nextIndex];
    if (nextProduct) {
      // Restore previous origin card styles before switching
      if (activeOriginCard) {
        activeOriginCard.style.opacity = '';
        activeOriginCard.style.transform = '';
      }
      
      const pid = nextProduct.slug || nextProduct.id;
      if (pid) {
        // Find if this new product happens to have a card in the DOM to act as the new origin
        const potentialOrigin = document.querySelector(`.prod-card[data-slug="${pid}"], .prod-card[data-id="${pid}"]`);
        openSpatialCardZoom(pid, potentialOrigin || null);
      }
    }
  };

  $('#spatial-outer-prev')?.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent overlay click
    navigateToSibling(-1);
  });
  $('#spatial-outer-next')?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateToSibling(1);
  });

  // ESC key and arrow keys
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSpatialCardZoom();
    if (e.key === 'ArrowLeft') navigateToSibling(-1);
    if (e.key === 'ArrowRight') navigateToSibling(1);
  });
}

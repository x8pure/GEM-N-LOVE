const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const legalPages = `
function pagePrivacy(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const title = C.lang === 'en' ? 'Privacy Policy' : 'Gizlilik Politikası';
  const html = \`<div class="rich">
    <h1 style="font-family:var(--font-display);font-size:clamp(30px,4vw,52px);line-height:1.1">\${title}</h1>
    <p><strong>Son Güncelleme: \${new Date().toLocaleDateString('tr-TR')}</strong></p>
    <h2>1. Veri Toplama</h2>
    <p>Size daha iyi hizmet verebilmek amacıyla adınız, e-posta adresiniz, fatura ve teslimat adresiniz gibi temel bilgileri topluyoruz.</p>
    <h2>2. Veri Kullanımı</h2>
    <p>Topladığımız veriler siparişlerinizin teslimatı, müşteri destek hizmetleri ve bilgilendirme amaçlı kullanılmaktadır.</p>
    <h2>3. Üçüncü Taraflarla Paylaşım</h2>
    <p>Kişisel bilgileriniz, yasal zorunluluklar veya kargo firmaları gibi hizmet sağlayıcılarımız haricinde hiçbir 3. taraf ile paylaşılmaz veya satılmaz.</p>
    <h2>4. Çerezler (Cookies)</h2>
    <p>Sitemizde oturum yönetimi ve site tercihlerini (dil, tema) hatırlamak için zorunlu çerezler kullanılmaktadır.</p>
    <h2>5. İletişim</h2>
    <p>Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz.</p>
  </div>\`;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(title, html, {}, C));
}

function pageTerms(req: http.IncomingMessage, res: http.ServerResponse) {
  const C = pageCtx(req);
  const title = C.lang === 'en' ? 'Terms of Service' : 'Kullanım Koşulları';
  const html = \`<div class="rich">
    <h1 style="font-family:var(--font-display);font-size:clamp(30px,4vw,52px);line-height:1.1">\${title}</h1>
    <p><strong>Son Güncelleme: \${new Date().toLocaleDateString('tr-TR')}</strong></p>
    <h2>1. Kabul Beyanı</h2>
    <p>Bu siteyi kullanarak ve alışveriş yaparak bu kullanım koşullarını kabul etmiş sayılırsınız.</p>
    <h2>2. Hizmet Kapsamı</h2>
    <p>Platformumuz üzerinden sunulan ürünler, stoklarla sınırlıdır ve firmamız ürün fiyatları ve özelliklerinde değişiklik yapma hakkını saklı tutar.</p>
    <h2>3. Kullanıcı Yükümlülükleri</h2>
    <p>Siteye üye olurken ve sipariş verirken doğru ve güncel bilgiler sağlamakla yükümlüsünüz. Hesabınızın güvenliği sizin sorumluluğunuzdadır.</p>
    <h2>4. İptal ve İade Koşulları</h2>
    <p>Alıcı, ürünü teslim aldıktan sonra mevzuatta belirtilen yasal süre içerisinde iade veya iptal hakkını kullanabilir.</p>
    <h2>5. Fikri Mülkiyet</h2>
    <p>Bu sitedeki tüm içerik, logo ve materyallerin telif hakları saklıdır.</p>
  </div>\`;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(layout(title, html, {}, C));
}
`;

code = code.replace(
  'function pageContact(req: http.IncomingMessage, res: http.ServerResponse) {',
  legalPages + '\nfunction pageContact(req: http.IncomingMessage, res: http.ServerResponse) {'
);

const routes = `
      if (pathname === '/gizlilik-politikasi' || pathname === '/privacy-policy') return pagePrivacy(req, res);
      if (pathname === '/kullanim-kosullari' || pathname === '/terms-of-service') return pageTerms(req, res);
`;

code = code.replace(
  'if (pathname === \'/admin\') return pageAdmin(req, res);',
  'if (pathname === \'/admin\') return pageAdmin(req, res);\n' + routes
);

fs.writeFileSync('server.ts', code);
console.log('Legal pages added');

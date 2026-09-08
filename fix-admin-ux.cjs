const fs = require('fs');

// 1. Fix admin.js modal close
let adminJs = fs.readFileSync('public/js/admin.js', 'utf8');
adminJs = adminJs.replace(
  `    m.addEventListener('click', (e) => {\n      if (e.target === m) closeModal();\n    });`,
  `    m.addEventListener('click', (e) => {\n      if (e.target === m) {\n        if (confirm('Kaydedilmemiş verileriniz olabilir, pencereyi kapatmak istediğinize emin misiniz?')) {\n          closeModal();\n        }\n      }\n    });`
);
adminJs = adminJs.replace(
  `    $$('.modal-close, [data-cancel]', m).forEach((b) => b.addEventListener('click', (e) => {\n      e.preventDefault();\n      e.stopPropagation();\n      closeModal();\n    }));`,
  `    $$('.modal-close, [data-cancel]', m).forEach((b) => b.addEventListener('click', (e) => {\n      e.preventDefault();\n      e.stopPropagation();\n      if (confirm('Kaydedilmemiş verileriniz olabilir, çıkmak istediğinize emin misiniz?')) {\n        closeModal();\n      }\n    }));`
);
fs.writeFileSync('public/js/admin.js', adminJs);

// 2. Fix server.ts AI Prompt & Fallback
let serverTs = fs.readFileSync('server.ts', 'utf8');

// Replace the fallback tag logic
serverTs = serverTs.replace(
  `    if (highlights.length < 3) highlights.push('Gövde Uyumlu Ergonomi', 'Sessiz ve Güçlü Motor', 'Kolay Temizlenebilir');`,
  `    if (highlights.length < 3 && category !== 'Realistik Dildolar' && category !== 'Realistik Mankenler') {\n      highlights.push('Gövde Uyumlu Ergonomi', 'Sessiz ve Güçlü Motor', 'Kolay Temizlenebilir');\n    } else if (highlights.length < 3) {\n      highlights.push('Gerçekçi Ten Hissi', 'Vücut Uyumlu Ergonomi', 'Kolay Temizlenebilir');\n    }`
);

// Replace AI Prompt
const oldPrompt = `          const prompt = \`Aşağıda toptancıdan veya tedarikçiden gelen ham ürün bilgisi yer almaktadır.
Lütfen bu metni Türkiye'nin en seçkin lüks yetişkin sağlık ve yaşam mağazası LOVE SHOP standartlarına uygun, cezbedici, net, toptancı tekrarlarından ve kaba ifadelerden arındırılmış bir e-ticaret metnine dönüştür.

Kurallar:
1. Ürün Adı: Net, estetik ve profesyonel olsun.
2. Kısa Açıklama (description): 1-2 cümlelik vurucu, öz, merak uyandıran ve kart altında/özette kullanılabilecek şık bir tanıtım cümlesi.
3. Öne Çıkan Özellikler (highlights): 4 ila 6 adet hap bilgi niteliğinde rozet özelliği (Örn: "%100 Medikal Silikon", "20 Titreşim Modu & 8 Hız", "Manyetik Şarj", "IPX7 Su Geçirmez").
4. Detaylı Açıklama (longDescription): Girişte akıcı ve lüks 1-2 paragraf; ardından 'Öne Çıkan Özellikler:' başlığı altında madde imleriyle (•) toparlanmış teknik detaylar.

Girdi Bilgileri:
Ürün Adı: \${name || 'Belirtilmedi'}
Kategori: \${category}
Ham İçerik:
\${rawText || name}\`;`;

const newPrompt = `          const prompt = \`Aşağıda toptancıdan veya senin yazdığın ham ürün bilgisi yer almaktadır.
Lütfen bu metni Türkiye'nin en seçkin lüks yetişkin sağlık ve yaşam mağazası LOVE SHOP standartlarına uygun, cezbedici, net, ve profesyonel bir e-ticaret metnine dönüştür.

ÖNEMLİ: Bu ürünün kategorisi "\${category}" dir. 
E�er ürün Realistik Dildolar, Realistik Mankenler veya Anal Ürünler ise, ASLA "Sessiz Motor", "Titreşim", "Manyetik Şarj" veya "Su Geçirmez Gövde" GİBİ ELEKTRONİK/MOTORLU ÖZELLİKLER YAZMA!
Sadece metinde gerçekten var olan ve ürünün doğasına uygun gerçek özelliklerini çıkar (Örn: "Gerçekçi Ten Hissi", "Güçlü Vantuz Taban", "%100 Medikal Silikon", "Gerçekçi Et Dokusu").
E�er ürün Vibratörler ise o zaman "Sessiz Motor", "20 Titreşim Modu" gibi özellikleri kullanabilirsin.

Kurallar:
1. Ürün Adı: Net, estetik ve profesyonel olsun.
2. Kısa Açıklama (description): 1-2 cümlelik vurucu, öz, merak uyandıran şık bir tanıtım cümlesi.
3. Öne Çıkan Özellikler (highlights): 4 ila 6 adet hap bilgi niteliğinde rozet özelliği. EZBERE KONUŞMA, SADECE HAM İÇERİKTEN VE KATEGORİYE UYGUN ÖZELLİKLERİ ÇIKAR!
4. Detaylı Açıklama (longDescription): Girişte akıcı ve lüks 1-2 paragraf; ardından madde imleriyle (•) toparlanmış detaylar.

Girdi Bilgileri:
Ürün Adı: \${name || 'Belirtilmedi'}
Kategori: \${category}
Ham İçerik:
\${rawText || name}\`;`;

serverTs = serverTs.replace(oldPrompt, newPrompt);

// Also we should ensure AI model uses valid name (e.g., gemini-2.5-flash or gemini-2.0-flash instead of gemini-3.8-flash)
serverTs = serverTs.replace(`model: 'gemini-3.8-flash',`, `model: 'gemini-2.5-flash',`);

fs.writeFileSync('server.ts', serverTs);

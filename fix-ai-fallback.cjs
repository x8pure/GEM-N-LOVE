const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

// 1. Fix the fallback function completely
const oldFallback = `  function fallbackPolishProduct(name: string, category: string, rawText: string) {
    const lines = rawText.split('\\n').map(l => l.trim()).filter(Boolean);
    const cleanTitle = name || (lines[0] ? lines[0].slice(0, 65) : 'Özel Seri Ürün');
    const lower = rawText.toLowerCase();

    const highlights: string[] = [];
    if (lower.includes('silikon') || lower.includes('medikal')) highlights.push('%100 Medikal Silikon');
    if (lower.includes('hız') || lower.includes('kademe')) highlights.push('Çok Kademeli Hız Kontrolü');
    if (lower.includes('titreşim') || lower.includes('mod')) highlights.push('Özelleştirilebilir Titreşim');
    if (lower.includes('şarj') || lower.includes('manyetik') || lower.includes('pil')) highlights.push('Manyetik Hızlı Şarj');
    if (lower.includes('su geçirmez') || lower.includes('ipx')) highlights.push('IPX Su Geçirmez Gövde');
    if (lower.includes('esnek') || lower.includes('bükülebilir')) highlights.push('Ergonomik & Esnek Başlık');
    if (highlights.length < 3 && category !== 'Realistik Dildolar' && category !== 'Realistik Mankenler') {
      highlights.push('Gövde Uyumlu Ergonomi', 'Sessiz ve Güçlü Motor', 'Kolay Temizlenebilir');
    } else if (highlights.length < 3) {
      highlights.push('Gerçekçi Ten Hissi', 'Vücut Uyumlu Ergonomi', 'Kolay Temizlenebilir');
    }

    const lead = \`\${cleanTitle}, vücut kıvrımlarına kusursuz uyum sağlayan ergonomik yapısı ve güçlü motoruyla beklentileri aşan lüks bir deneyim sunar.\`;
    
    const bulletItems = lines.filter(l => l.length > 5 && !l.toLowerCase().includes('bu vibratör') && !l.toLowerCase().includes('bu ürün')).slice(0, 6);
    const bulletText = bulletItems.length 
      ? \`\\n\\nÖne Çıkan Özellikler:\\n\` + bulletItems.map(b => \`• \${b.replace(/^[-•*:\\\d.]+\\s*/, '')}\`).join('\\n')
      : '';

    return {
      name: cleanTitle,
      description: lead,
      highlights: highlights.slice(0, 5),
      longDescription: \`\${lead}\${bulletText}\`
    };
  }`;

const newFallback = `  function fallbackPolishProduct(name: string, category: string, rawText: string) {
    const lines = rawText.split('\\n').map(l => l.trim()).filter(Boolean);
    const cleanTitle = name || (lines[0] ? lines[0].slice(0, 65) : 'Özel Seri Ürün');
    const lower = rawText.toLowerCase();

    const highlights: string[] = [];
    if (lower.includes('silikon') || lower.includes('medikal')) highlights.push('%100 Medikal Silikon');
    if (lower.includes('hız') || lower.includes('kademe')) highlights.push('Çok Kademeli Hız Kontrolü');
    if (lower.includes('titreşim') || lower.includes('mod')) highlights.push('Özelleştirilebilir Titreşim');
    if (lower.includes('şarj') || lower.includes('manyetik') || lower.includes('pil')) highlights.push('Manyetik Hızlı Şarj');
    if (lower.includes('su geçirmez') || lower.includes('ipx')) highlights.push('IPX Su Geçirmez Gövde');
    if (lower.includes('sprey') || lower.includes('geciktirici')) highlights.push('Klinik Testli', 'Hızlı Etki', 'Güvenilir Formül');
    if (lower.includes('esnek') || lower.includes('bükülebilir')) highlights.push('Ergonomik & Esnek Başlık');
    
    if (highlights.length < 3) {
      if (category.toLowerCase().includes('sprey') || category.toLowerCase().includes('sağlık') || category.toLowerCase().includes('krem')) {
        highlights.push('Özel Formül', 'Etkili Çözüm', 'Güvenli Kullanım');
      } else if (category.toLowerCase().includes('dildo') || category.toLowerCase().includes('manken') || category.toLowerCase().includes('anal')) {
        highlights.push('Gerçekçi Ten Hissi', 'Vücut Uyumlu Ergonomi', 'Kolay Temizlenebilir');
      } else {
        highlights.push('Ergonomik Tasarım', 'Premium Kalite', 'Kolay Kullanım');
      }
    }

    let lead = \`\${cleanTitle}, özel tasarımı ve premium kalitesiyle beklentileri aşan lüks bir deneyim sunar.\`;
    if (category.toLowerCase().includes('sprey') || category.toLowerCase().includes('sağlık')) {
       lead = \`\${cleanTitle}, özel formülü sayesinde beklentileri karşılayan ve güven veren etkili bir deneyim sunar.\`;
    }

    const bulletItems = lines.filter(l => l.length > 5 && !l.toLowerCase().includes('bu ürün')).slice(0, 6);
    const bulletText = bulletItems.length 
      ? \`\\n\\nÖne Çıkan Özellikler:\\n\` + bulletItems.map(b => \`• \${b.replace(/^[-•*:\\\d.]+\\s*/, '')}\`).join('\\n')
      : '';

    return {
      name: cleanTitle,
      description: lead,
      highlights: highlights.slice(0, 5),
      longDescription: \`\${lead}\${bulletText}\`
    };
  }`;

serverTs = serverTs.replace(oldFallback, newFallback);

// 2. Fix the AI Prompt typo and model version
const oldAiSection = `          const prompt = \`Aşağıda toptancıdan veya senin yazdığın ham ürün bilgisi yer almaktadır.
Lütfen bu metni Türkiye'nin en seçkin lüks yetişkin sağlık ve yaşam mağazası LOVE SHOP standartlarına uygun, cezbedici, net, ve profesyonel bir e-ticaret metnine dönüştür.

ÖNEMLİ: Bu ürünün kategorisi "\${category}" dir. 
Eer ürün Realistik Dildolar, Realistik Mankenler veya Anal Ürünler ise, ASLA "Sessiz Motor", "Titreşim", "Manyetik Şarj" veya "Su Geçirmez Gövde" GİBİ ELEKTRONİK/MOTORLU ÖZELLİKLER YAZMA!
Sadece metinde gerçekten var olan ve ürünün doğasına uygun gerçek özelliklerini çıkar (Örn: "Gerçekçi Ten Hissi", "Güçlü Vantuz Taban", "%100 Medikal Silikon", "Gerçekçi Et Dokusu").
Eer ürün Vibratörler ise o zaman "Sessiz Motor", "20 Titreşim Modu" gibi özellikleri kullanabilirsin.

Kurallar:
1. Ürün Adı: Net, estetik ve profesyonel olsun.
2. Kısa Açıklama (description): 1-2 cümlelik vurucu, öz, merak uyandıran şık bir tanıtım cümlesi.
3. Öne Çıkan Özellikler (highlights): 4 ila 6 adet hap bilgi niteliğinde rozet özelliği. EZBERE KONUŞMA, SADECE HAM İÇERİKTEN VE KATEGORİYE UYGUN ÖZELLİKLERİ ÇIKAR!
4. Detaylı Açıklama (longDescription): Girişte akıcı ve lüks 1-2 paragraf; ardından madde imleriyle (•) toparlanmış detaylar.

Girdi Bilgileri:
Ürün Adı: \${name || 'Belirtilmedi'}
Kategori: \${category}
Ham İçerik:
\${rawText || name}\`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',`;

const newAiSection = `          const prompt = \`Aşağıda toptancıdan veya senin yazdığın ham ürün bilgisi yer almaktadır.
Lütfen bu metni Türkiye'nin en seçkin lüks yetişkin sağlık ve yaşam mağazası LOVE SHOP standartlarına uygun, cezbedici, net, ve profesyonel bir e-ticaret metnine dönüştür.

ÖNEMLİ: Bu ürünün kategorisi "\${category}" dir. 
E�er ürün Realistik Dildolar, Realistik Mankenler, Sprey, Krem, Hap veya Anal Ürünler ise, ASLA "Sessiz Motor", "Titreşim", "Manyetik Şarj" veya "Su Geçirmez Gövde" GİBİ ELEKTRONİK/MOTORLU ÖZELLİKLER YAZMA!
Sprey veya sağlık ürünleri ise "Klinik Testli", "Hızlı Etki", "Özel Formül" gibi mantıklı terimler kullan.
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
\${rawText || name}\`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',`;

serverTs = serverTs.replace(oldAiSection, newAiSection);

fs.writeFileSync('server.ts', serverTs);
console.log('Done replacing strings.');

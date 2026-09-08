const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

const promptStart = `          const prompt = \`Aşağıda toptancıdan veya senin yazdığın ham ürün bilgisi yer almaktadır.`;
const promptEnd = `model: 'gemini-2.5-flash',`;

const indexStart = serverTs.indexOf(promptStart);
const indexEnd = serverTs.indexOf(promptEnd) + promptEnd.length;

if (indexStart !== -1 && indexEnd !== -1 && indexStart < indexEnd) {
    const newSection = `          const prompt = \`Aşağıda toptancıdan veya senin yazdığın ham ürün bilgisi yer almaktadır.
Lütfen bu metni Türkiye'nin en seçkin lüks yetişkin sağlık ve yaşam mağazası LOVE SHOP standartlarına uygun, cezbedici, net ve profesyonel bir e-ticaret metnine dönüştür.

ÖNEMLİ: Bu ürünün kategorisi "\${category}" dir. 
E�er ürün Realistik Dildolar, Realistik Mankenler, Erkek Cinsel Sağlık (Sprey/Krem) veya Anal Ürünler ise, ASLA "Sessiz Motor", "Titreşim", "Manyetik Şarj" veya "Su Geçirmez Gövde" GİBİ ELEKTRONİK/MOTORLU ÖZELLİKLER YAZMA!
Sprey veya sağlık ürünleri ise "Klinik Testli", "Hızlı Etki", "Özel Formül" gibi mantıklı terimler kullan.
Sadece metinde gerçekten var olan ve ürünün doğasına uygun gerçek özelliklerini çıkar (Örn: "Gerçekçi Ten Hissi", "Güçlü Vantuz Taban", "%100 Medikal Silikon").
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

    serverTs = serverTs.substring(0, indexStart) + newSection + serverTs.substring(indexEnd);
    fs.writeFileSync('server.ts', serverTs);
    console.log('Prompt successfully replaced!');
} else {
    console.log('Could not find prompt section.');
}

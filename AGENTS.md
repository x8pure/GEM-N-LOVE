# PROJE VE TASARIM YÖNETMELİĞİ (ANTI-SLOP ARCHITECTURE)

Bu dosyadaki kurallar, yapay zekanın tipik "AI Slop / Generic SaaS" tuzaklarına düşmesini engelleyen kalıcı sistem kurallarıdır.

## 1. YASAKLI "AI SLOP" ELEMANLARI (ASLA KULLANILMAYACAK)
- **Rozet / Eyebrow Kirliliği:** Başlıkların üstüne konan küçük kapsül/hap etiketler (`span.eyebrow`, `badge`, küçük kategorizasyon hapları) KESİNLİKLE yasaktır. Başlıklar doğrudan tok ve net başlar.
- **Kayan Yazı Bantları (Marquee / Tickers):** Yıldızlı (`✦`), kelimelerin aktığı, dikkat dağıtıcı şeritler yasaktır.
- **Yapay Yıldız / Sparkle İkonları:** `✦`, `✨`, `★` gibi AI şablon süsleri dekorasyon amacıyla metin aralarına serpiştirilmez.
- **Emoji Kirliliği (Native Emojis):** Başlıklarda, butonlarda, menülerde veya bilgilendirme kartlarında `🔥`, `🚀`, `✨`, `📦`, `🔒`, `💎`, `❤️`, `🎁` gibi hiçbir native sistem emojisi KULLANILAMAZ. Bu durum projeyi ucuzlaştırır.
- **Renkli / Dolgulu / 3D İkonlar:** Karikatürize, çok renkli veya çocuksu ikon setleri yasaktır.
- **Kutu İçinde Kutu (Nested Cards):** Kartların içine minik hap butonlar, kutu içinde kutucuklar dizilmez. Hiyerarşi saf tipografi, hafif opaklık ve negatif alanla sağlanır.
- **Ucuz Vurgu Renkleri:** Menülerde, butonlarda veya linklerde şeftali/mercan/kırmızı gibi çiğ renklerle hap butonlar yapılmaz. Tasarım lüks monokrom (saf beyaz, füme, titanyum gri, sıcak taş tonları) üzerinde yürütülür.

## 2. İKON STANDARDI (FLOATING DOCK KALİTESİ)
- **Lineer & Minimalist Vektörler:** Yalnızca yüzen adadaki (floating dock) gibi 1.5px / 1.75px stroke kalınlığına sahip, geometrik, kibar ve amaç odaklı minimalist SVG ikonlar kullanılır.
- **Dinamik Tema Uyumu (Contrast Perfection):** 
  - Koyu temada (Dark Mode): İkonlar saf beyaz (`#FFFFFF`), açık gümüş veya titanyum gri olur; `stroke: currentColor` veya `var(--text)` ile yönetilir.
  - Açık temada (Light Mode): İkonlar tok antrasit (`#18181B`) veya sıcak taş tonu (`#44403C`) olur.
  - Asla sönük, okunaksız veya zeminde kaybolan gri ikon bırakılmaz.

## 3. TASARIM VE ESTETİK İLKELERİ (LÜKS MİNİMALİZM)
- **Marka Dili:** Üst segment, sakin, özgüvenli, modern lüks e-ticaret (Apple, Acne Studios, Bottega Veneta, Aesop kalitesi).
- **Tipografik Derinlik:** Aktif elemanlar arka plan rengiyle değil; font ağırlığı, net beyazlık ve kontrast farkıyla ayrıştırılır.
- **Gereksiz Süsleme Yasağı:** "Sayfa boş kalmasın" veya "hareket olsun" diye hiçbir işlevsiz animasyon veya şerit eklenmez. Boşluk (negatif alan) bir lüks ögesidir.
- **Temiz Başlıklar:** Her bölüm doğrudan `h2` veya `h3` başlığı ve gerekiyorsa tek satır kibar alt açıklamasıyla başlar.

## 4. KARAR VE ÖNERİ PROTOKOLÜ
- Yeni bir UI/UX kararı alırken önce "Bu bir şablon AI alışkanlığı mı yoksa markanın ağırlığına yakışan bir fonksiyon mu?" sorgusu yapılır.
- Şüpheli her detayda şablon yerine sadeleşme (reduction) tercih edilir.

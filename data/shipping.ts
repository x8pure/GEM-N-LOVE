export interface ShippingRegion {
  region: string;
  cities: string;
  duration: string;
  method: string;
  notes: string;
}

export interface PackagingStep {
  step: number;
  title: string;
  desc: string;
}

export const SHIPPING_REGIONS: ShippingRegion[] = [
  {
    region: "Eskişehir (Merkez Lojistik & Mağaza)",
    cities: "Tepebaşı, Odunpazarı, Bağlar, Vişnelik, Batıkent ve Tüm Merkez",
    duration: "2 - 3 Saat",
    method: "Özel Gizli Kurye & Elden Mağazadan Teslim",
    notes: "Aynı gün gün içi teslimat. Mağazamızdan elden teslim seçeneği 10:00 - 02:00 saatleri arasında açıktır."
  },
  {
    region: "Komşu İller & Yakın Metropoller",
    cities: "Ankara, Bursa, Bilecik, Kütahya, Afyonkarahisar",
    duration: "24 Saat (1 İş Günü)",
    method: "Ekspres Kargo (Yurtiçi / Aras / MNG)",
    notes: "150-250 km mesafedeki illerimiz. Saat 16:30'a kadar verilen siparişler ertesi iş günü adreste veya şubede teslim."
  },
  {
    region: "Marmara & Ege Metropolleri",
    cities: "İstanbul (Avrupa & Anadolu), İzmir, Kocaeli, Sakarya, Balıkesir, Manisa",
    duration: "24 - 48 Saat (1-2 İş Günü)",
    method: "Ekspres Kargo (Merkez Transfer)",
    notes: "Büyük aktarma merkezleri sayesinde İstanbul ve İzmir merkez ilçelerine genelde 24 saatte ulaşır."
  },
  {
    region: "Akdeniz & İç Anadolu Doğusu",
    cities: "Antalya, Muğla, Aydın, Denizli, Konya, Kayseri, Adana, Mersin",
    duration: "1 - 2 İş Günü",
    method: "Ekspres Kargo",
    notes: "Otel, tatil beldesi, yazlık veya ev adreslerine gizli ambalajlı doğrudan teslimat."
  },
  {
    region: "Karadeniz & Doğu / Güneydoğu Anadolu",
    cities: "Samsun, Trabzon, Gaziantep, Diyarbakır, Şanlıurfa, Erzurum, Van ve Diğer Tüm İller",
    duration: "2 - 3 İş Günü",
    method: "Güvenli Standart Kargo",
    notes: "İlçe ve mobil alanlara göre teslim süresi 1 gün esneklik gösterebilir."
  }
];

export const PACKAGING_STEPS: PackagingStep[] = [
  {
    step: 1,
    title: "Işık ve Siluet Geçirmez Opak İç Katman",
    desc: "Siparişleriniz depomuzda hazırlanırken önce kalın, siyah veya opak koruyucu balonlu malzemeyle sarılır. Işığa tutulduğunda dahi ürünün formu veya konturu kesinlikle görünmez."
  },
  {
    step: 2,
    title: "Nötr Sert Dış Ambalaj (Sıfır İpucu)",
    desc: "Ürünler dokunulduğunda sertliği veya şekli anlaşılamayan mukavva kutulara konur. Kutunun dış yüzeyinde 'erotik shop', 'seks shop' veya herhangi bir hassas ibare/logo asla bulunmaz."
  },
  {
    step: 3,
    title: "Tamamen Nötr Kargo İrsaliyesi",
    desc: "Kargo barkodunda ve irsaliyesinde sadece yasal nötr şirket ticari unvanı ve adres bilgileri yer alır. Paket içeriği kısmında ürün adı yazmaz; kurye dahil hiç kimse kutuda ne olduğunu bilemez."
  },
  {
    step: 4,
    title: "Banka & Kredi Kartı Ekstresi Gizliliği",
    desc: "256-bit SSL şifrelemeli BDDK lisanslı güvenli ödeme altyapımızla yapılan çekimlerde, kart ekstrenizde yalnızca resmi ticari unvan görünür; cinsel sağlık veya marka çağrışımı yapan hiçbir ifade yer almaz."
  },
  {
    step: 5,
    title: "Şubeden veya Kargo Otomatından Anonim Teslim",
    desc: "Ev veya iş adresinizi paylaşmak istemiyorsanız, siparişinizi dilediğiniz Yurtiçi, MNG veya Aras Kargo şubesine yönlendirebilir ya da 7/24 teslimat otomatlarından TC kimlik/SMS koduyla teslim alabilirsiniz."
  }
];

export const SHIPPING_FAQS = [
  {
    q: "Kargo görevlisi paketin içinde ne olduğunu anlayabilir mi?",
    a: "Kesinlikle hayır. Paketlerimiz çift katlı, ışık geçirmez ve tamamen nötr kolilerde gönderilir. Kargo poşetinin veya kutusunun üzerinde ürün adı ya da sektörel hiçbir ifade bulunmaz."
  },
  {
    q: "Siparişimi aynı gün kargoya verir misiniz?",
    a: "Evet. Hafta içi saat 16:30'a, Cumartesi günleri ise saat 13:00'e kadar verilen tüm siparişler aynı gün kargo transfer merkezine teslim edilir."
  },
  {
    q: "Ev adresimi vermek istemiyorum, nasıl teslim alabilirim?",
    a: "Sipariş verirken teslimat adresi kısmına size en yakın kargo şubesinin adını yazıp (Örn: 'Yurtiçi Kargo Kadıköy Rıhtım Şubesi - Şubeden Teslim') notunu düşebilirsiniz. Paket şubeye ulaştığında gelen SMS ile kimliğinizi ibraz ederek şahsen alabilirsiniz."
  },
  {
    q: "Kargo takip numarasını nasıl öğrenebilirim?",
    a: "Siparişiniz kargo firmasına teslim edildiği an, sistemimize kayıtlı telefonunuza ve e-posta adresinize SMS/E-posta ile anlık takip linki gönderilir."
  },
  {
    q: "Hangi kargo firmaları ile çalışıyorsunuz?",
    a: "Yurtiçi Kargo, MNG Kargo ve Aras Kargo başta olmak üzere Türkiye'nin en yaygın ekspres lojistik ağları ile çalışmaktayız. Dilediğiniz özel bir kargo tercihi varsa sipariş notunda belirtebilirsiniz."
  },
  {
    q: "Kredi kartı ekstremde veya banka dekontunda ne yazacak?",
    a: "Banka ve kredi kartı dökümlerinizde sektör veya ürün çağrışımı yapan hiçbir ibare yer almaz. Yalnızca nötr yasal ticari unvanımız görünür."
  },
  {
    q: "Eskişehir içinde kurye teslimatı nasıl işler?",
    a: "Eskişehir Tepebaşı ve Odunpazarı ilçelerinde kendi özel saha kuryemiz hizmet vermektedir. Siparişiniz 2-3 saat içerisinde gizli mühürlü kutu ile kapınıza ulaştırılır. İsterseniz kapıda nakit veya kartla ödeme yapabilirsiniz."
  }
];

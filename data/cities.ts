export interface CityLanding {
  slug: string;
  name: string;
  title: string;
  heroSub: string;
  metaTitle: string;
  metaDesc: string;
  deliveryTime: string;
  deliveryBadge: string;
  logisticsDetail: string;
  districts: string[];
  keyBenefits: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export const ESKISEHIR_STORE: CityLanding = {
  slug: 'eskisehir',
  name: 'Eskişehir',
  title: 'Eskişehir Sexual Wellness & 15 Yıllık Köklü Mağaza',
  heroSub: '15 yıldır aynı adreste hizmet veren Eskişehir\'in en güvenilir cinsel sağlık mağazası. Tepebaşı ve Odunpazarı içi 2-3 saatte özel gizli kurye veya mağazamızdan elden teslim alma.',
  metaTitle: 'Eskişehir Sexual Wellness & Erotik Shop | 2-3 Saatte Gizli Kurye',
  metaDesc: 'Eskişehir\'in 15 yıllık köklü cinsel sağlık mağazası. Tepebaşı ve Odunpazarı içi 2-3 saatte özel gizli kurye veya İsmet İnönü-1 Cd. mağazamızdan elden teslim.',
  deliveryTime: '2-3 Saatte Kurye / Elden Teslim',
  deliveryBadge: 'Eskişehir İçi 2-3 Saatte Kurye',
  logisticsDetail: 'Tepebaşı, Odunpazarı, Bağlar, Vişnelik, Batıkent ve üniversite bölgelerine özel gizli kuryemizle 2 ila 3 saatte doğrudan adrese teslimat; veya İsmet İnönü Tramvay Durağı karşısı Ilgaz İş Hanı Kat:1 D:2 adresindeki mağazamızdan randevusuz elden teslim alabilirsiniz.',
  districts: ['Tepebaşı', 'Odunpazarı', 'Bağlar', 'Vişnelik', 'Batıkent', 'Sümer', 'Yenibağlar', 'Uluönder', 'Tüm Eskişehir'],
  keyBenefits: [
    {
      title: '2-3 Saatte Özel Gizli Kurye',
      desc: 'Eskişehir merkez ilçelerine mesai saatleri içinde birkaç saatte mühürlü, dışarıdan anlaşılmayan nötr ambalajla kapıda teslimat.'
    },
    {
      title: 'Fiziksel Mağazadan Elden Teslim',
      desc: 'İsmet İnönü Tramvay Durağı karşısındaki Ilgaz İş Hanı Kat:1 mağazamızı ziyaret edip ürünleri yakından inceleyerek güvenle elden teslim alabilirsiniz.'
    },
    {
      title: '15 Yıllık Kesintisiz Güven',
      desc: '2012 yılından bu yana aynı fiziksel adreste 15 yıldır binlerce müşterimize sunduğumuz kesintisiz dürüst esnaflık ve uzman danışmanlık.'
    },
    {
      title: 'Kredi Kartı ve Nakit Kolaylığı',
      desc: 'İster mağazada elden nakit/temassız kartla, ister kurye teslimatında kapıda güvenle ödeyin. Ekstrede hassas unvan yer almaz.'
    }
  ],
  faqs: [
    {
      q: "Eskişehir içi kurye ne kadar sürede getirir?",
      a: "Siparişiniz ambalajlama ekibimiz tarafından mühürlü nötr kutuya alındıktan sonra özel saha kuryemiz 2 ila 3 saat içinde doğrudan adresinize teslim eder."
    },
    {
      q: "Fiziksel mağazanız nerede ve çalışma saatleri nedir?",
      a: "İsmet İnönü-1 Caddesi No:52/2 Ilgaz İş Hanı Kat:1 Daire:2 adresindeyiz (İsmet İnönü Tramvay Durağı karşısı, Watsons ve Yves Rocher yanı). Haftanın her günü 10:00 - 02:00 saatleri arasında açığız."
    },
    {
      q: "Kurye teslimatında kapıda nakit veya kartla ödeme var mı?",
      a: "Evet. Sipariş verirken kapıda nakit veya kuryede mobil POS ile temassız ödeme seçeneğini tercih edebilirsiniz."
    },
    {
      q: "Kurye paketin içeriğini bilir mi?",
      a: "Hayır. Saha kuryelerimiz ürünlerin içeriğinden habersizdir. Paketler çift kat korumalı, opak ve dışarıdan asla açılmamış mühürlü nötr kutulardadır."
    }
  ]
};

// Sadece fiziksel mağazanın bulunduğu Eskişehir tutulur (Doorway page riskini önlemek için sanal şehirler kaldırılmıştır)
export const CITIES: CityLanding[] = [ESKISEHIR_STORE];

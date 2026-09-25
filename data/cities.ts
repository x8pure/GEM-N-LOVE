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
  heroSub: '15 yıldır aynı adreste hizmet veren Eskişehir\'in en güvenilir cinsel sağlık mağazası. Kadınlar, erkekler ve çiftler için sokaktan görünmeyen vitrinsiz 1. kat daire konseptiyle %100 yargısız ve güvenli ortam; Tepebaşı ve Odunpazarı genelinde 30-120 dakikada özel jet kurye teslimatı.',
  metaTitle: 'Eskişehir Sexual Wellness & Erotik Shop | 30-120 Dk Gizli Kurye & Mağaza',
  metaDesc: 'Eskişehir\'in 15 yıllık köklü cinsel sağlık mağazası. Kadınlar ve çiftler için %100 yargısız vitrinsiz daire ortamı. Tepebaşı ve Odunpazarı\'na 30-120 dakikada özel ekspres gizli kurye.',
  deliveryTime: '30-120 Dakikada Jet Kurye / Elden Teslim',
  deliveryBadge: 'Eskişehir İçi 30-120 Dk Ekspres Kurye',
  logisticsDetail: 'Tepebaşı, Odunpazarı, Bağlar, Vişnelik, Batıkent ve üniversite bölgelerine özel gizli kuryemizle ortalama 30 ila 120 dakikada doğrudan adrese teslimat; veya İsmet İnönü Tramvay Durağı karşısı Ilgaz İş Hanı Kat:1 D:2 adresindeki vitrinsiz mağazamızdan randevusuz elden teslim alabilirsiniz.',
  districts: ['Tepebaşı', 'Odunpazarı', 'Bağlar', 'Vişnelik', 'Batıkent', 'Sümer', 'Yenibağlar', 'Uluönder', 'Tüm Eskişehir'],
  keyBenefits: [
    {
      title: '30-120 Dakikada Özel Gizli Kurye',
      desc: 'Eskişehir merkez mahallelerine gün içi anında paketleme ile ortalama 30-120 dakika içinde sivil kuryeyle mühürlü, nötr ambalajda kapıya teslimat.'
    },
    {
      title: 'Kadınlar ve Çiftler İçin %100 Yargısız Ortam',
      desc: 'Vitrinsiz 1. kat daire konseptimiz sayesinde sokaktan kimsenin sizi görmeyeceği, kadın müşterilerimizin ve çiftlerin son derece rahat ettiği yargısız, saygılı ve profesyonel danışmanlık.'
    },
    {
      title: 'Fiziksel Mağazadan Güvenle Elden Teslim',
      desc: 'İsmet İnönü Tramvay Durağı karşısındaki Ilgaz İş Hanı Kat:1 mağazamızı ziyaret edip ürünleri yakından inceleyerek güvenle elden teslim alabilirsiniz.'
    },
    {
      title: '15 Yıllık Kesintisiz Güven & Esnaflık',
      desc: '2012 yılından bu yana aynı fiziksel adreste 15 yıldır binlerce müşterimize sunduğumuz kesintisiz dürüst esnaflık, medikal kalite ve uzman danışmanlık.'
    },
    {
      title: 'Kredi Kartı ve Nakit Kolaylığı',
      desc: 'İster mağazada elden nakit/temassız kartla, ister kurye teslimatında kapıda güvenle ödeyin. Ekstrede asla hassas unvan yer almaz.'
    }
  ],
  faqs: [
    {
      q: "Eskişehir'de kadınlar ve çiftler için en rahat ve güvenli erotik shop neresidir?",
      a: "Love Erotik Shop, İsmet İnönü-1 Tramvay Durağı karşısındaki Ilgaz İş Hanı'nda 1. kat vitrinsiz daire konseptiyle hizmet verir. Sokaktan veya caddeden görünmeyen yapısıyla kadın müşterilerin, gençlerin ve çiftlerin hiçbir çekince duymadan, yargılanmadan rahatça alışveriş yapabileceği Eskişehir'deki en güvenli ve saygın mağazadır."
    },
    {
      q: "Eskişehir içi motor kurye ile gizli teslimat kaç dakikada gelir?",
      a: "Siparişiniz ekibimiz tarafından çift mühürlü nötr kutuya alındıktan sonra özel saha kuryemiz ortalama 30 ila 120 dakika (yaklaşık 1 saat) içerisinde Tepebaşı, Odunpazarı, Bağlar ve tüm merkez mahallelerde doğrudan kapınıza teslim eder."
    },
    {
      q: "Fiziksel mağazanız nerede ve çalışma saatleri nedir?",
      a: "İsmet İnönü-1 Caddesi No:52/2 Ilgaz İş Hanı Kat:1 Daire:2 adresindeyiz (İsmet İnönü Tramvay Durağı karşısı, Watsons ve Yves Rocher yanı). Haftanın her günü 10:00 - 02:00 saatleri arasında randevusuz gelebilirsiniz."
    },
    {
      q: "Kurye paketin içeriğini veya nereden geldiğini bilir mi?",
      a: "Hayır. Saha kuryelerimiz sivil giyimlidir ve paket içeriğinden habersizdir. Ürünler çift kat korumalı, opak, üzerinde logo veya ibare bulunmayan mühürlü nötr ambalajdadır."
    },
    {
      q: "Kurye teslimatında kapıda nakit veya kartla ödeme yapabilir miyim?",
      a: "Evet. Kapıda nakit ödeyebilir veya kuryenin getirdiği mobil POS cihazıyla temassız kredi kartı kullanabilirsiniz. Ekstrenizde hassas mağaza adı veya ibare kesinlikle yazmaz."
    }
  ]
};

// Sadece fiziksel mağazanın bulunduğu Eskişehir tutulur (Doorway page riskini önlemek için sanal şehirler kaldırılmıştır)
export const CITIES: CityLanding[] = [ESKISEHIR_STORE];

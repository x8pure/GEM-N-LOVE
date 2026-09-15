/**
 * Centralized Store Commerce, Shipping & Return Policy Configuration
 * Used for Schema.org Structured Data (JSON-LD), Product Feeds, and Site Policies
 */

export interface ShippingPolicyConfig {
  country: string;
  currency: string;
  defaultShippingFee: number;
  freeShippingThreshold: number;
  handlingTime: {
    minDays: number;
    maxDays: number;
    cutoffTime: string; // e.g. 14:00
    sameDayBeforeCutoff: boolean;
  };
  transitTime: {
    minDays: number;
    maxDays: number;
    note: string;
  };
}

export interface ReturnPolicyConfig {
  applicableCountry: string;
  returnPolicyCountry: string;
  returnPolicyCategory: string; // schema.org URI
  merchantReturnDays: number;
  returnMethod: string; // schema.org URI
  returnFees: string; // schema.org URI
  returnShippingFeesAmount?: number;
  policyUrl: string;
  description: string;
}

export const COMMERCE_CONFIG = {
  shipping: {
    country: 'TR',
    currency: 'TRY',
    defaultShippingFee: 150,
    freeShippingThreshold: 2000,
    handlingTime: {
      minDays: 0,
      maxDays: 1,
      cutoffTime: '14:00',
      sameDayBeforeCutoff: true
    },
    transitTime: {
      minDays: 1,
      maxDays: 3,
      note: 'Türkiye geneli anlaşmalı kargo (Aras/Yurtiçi/MNG) ile 1-3 iş günü teslimat'
    }
  } as ShippingPolicyConfig,

  // Return policy grounded directly in the store's "Hakkımızda" terms:
  // - 14 gün içinde açılmamış / güvenlik şeridi bozulmamış ürünlerde iade imkanı
  // - Posta / Kargo ile iade (ReturnByMail)
  // - Ayıplı / hasarlı teslimatlarda ücretsiz değişim, müşteri cayma hakkı iadelerinde kargo müşteri sorumluluğunda
  returnPolicy: {
    applicableCountry: 'TR',
    returnPolicyCountry: 'TR',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
    policyUrl: 'https://loveeroticshop.com/hakkimizda#iade',
    description: 'Güvenlik şeridi açılmamış ve ambalajı bozulmamış ürünlerde 14 gün içinde kargo ile iade imkanı. Taşıma hasarlı veya arızalı çıkan ürünlerde derhal birebir değişim sağlanır.'
  } as ReturnPolicyConfig
};

/**
 * Generates Schema.org OfferShippingDetails for a product offer.
 * Rules:
 * - Orders/Products >= 2000 TRY: Free Shipping (0 TRY)
 * - Orders/Products < 2000 TRY: Standard Shipping (150 TRY)
 * Handling time: 0-1 business days (same-day dispatch for orders before 14:00)
 * Transit time: 1-3 business days (standard express courier in Turkey)
 */
export function getProductShippingDetailsSchema(productPrice?: number) {
  const cfg = COMMERCE_CONFIG.shipping;
  const isFree = typeof productPrice === 'number' && productPrice >= cfg.freeShippingThreshold;

  const deliveryTime = {
    "@type": "ShippingDeliveryTime",
    "handlingTime": {
      "@type": "QuantitativeValue",
      "minValue": cfg.handlingTime.minDays,
      "maxValue": cfg.handlingTime.maxDays,
      "unitCode": "DAY"
    },
    "transitTime": {
      "@type": "QuantitativeValue",
      "minValue": cfg.transitTime.minDays,
      "maxValue": cfg.transitTime.maxDays,
      "unitCode": "DAY"
    }
  };

  return {
    "@type": "OfferShippingDetails",
    "@id": isFree ? "https://loveeroticshop.com/#shipping-free" : "https://loveeroticshop.com/#shipping-standard",
    "shippingRate": {
      "@type": "MonetaryAmount",
      "value": isFree ? "0" : String(cfg.defaultShippingFee),
      "currency": cfg.currency
    },
    "shippingDestination": {
      "@type": "DefinedRegion",
      "addressCountry": cfg.country
    },
    "deliveryTime": deliveryTime
  };
}

/**
 * Generates Schema.org MerchantReturnPolicy object grounded in the store's About page.
 */
export function getMerchantReturnPolicySchema() {
  const ret = COMMERCE_CONFIG.returnPolicy;
  return {
    "@type": "MerchantReturnPolicy",
    "@id": "https://loveeroticshop.com/#return-policy",
    "applicableCountry": ret.applicableCountry,
    "returnPolicyCountry": ret.returnPolicyCountry,
    "returnPolicyCategory": ret.returnPolicyCategory,
    "merchantReturnDays": ret.merchantReturnDays,
    "returnMethod": ret.returnMethod,
    "returnFees": ret.returnFees,
    "url": ret.policyUrl
  };
}

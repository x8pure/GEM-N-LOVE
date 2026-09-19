/**
 * Hukuki Metinler: 2026 Mevzuatına (6698 Sayılı KVKK, 6502 Sayılı TKHK,
 * Mesafeli Sözleşmeler Yönetmeliği) Uygun Gizlilik Politikası & Mesafeli Satış Sözleşmesi
 * loveeroticshop.com — Sektöre Özel, Eksiksiz ve Prestijli Hukuki Dokümantasyon
 */

function esc(s: any): string {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const PH = {
  company: '{ŞİRKET_UNVANI}',
  address: '{ADRES}',
  email: '{EPOSTA}',
  taxNo: '{VERGİ_NO}',
  mersis: '{MERSIS_NO}',
  kep: '{KEP_ADRESI}'
};

function phBadge(text: string): string {
  return `<code class="legal-ph" title="Bu alan düzenlenecektir">${esc(text)}</code>`;
}

export function getPrivacyPolicyHtml(C: any, dbSettings: any): string {
  const isEn = C.lang === 'en';
  const updatedDate = '19.09.2026';
  const supportEmail = dbSettings?.supportEmail || 'info@loveeroticshop.com';
  const supportPhone = dbSettings?.supportPhone || '+90 543 633 13 25';
  const storeAddress = dbSettings?.address || 'İsmet İnönü-1 Cd. No:52/2, Ilgaz İş Hanı Kat:1 Daire:2, 26170 Tepebaşı/Eskişehir';

  if (isEn) {
    return `
<div class="rich rich-legal" id="privacy-policy-doc">
  <div class="legal-header">
    <div class="legal-nav-crumbs">
      <a href="/">Home</a> / <a href="/kullanim-kosullari">Terms of Service</a> / <span>Privacy Policy</span>
    </div>
    <h1 class="legal-h1">Privacy Policy & KVKK Clarification Text</h1>
    <p class="legal-lead">Official Personal Data Protection (Law No. 6698) Statement and Absolute Privacy Commitment for loveeroticshop.com</p>
    <div class="legal-meta-bar">
      <span>Effective Date: <strong>${updatedDate}</strong></span>
      <span>Document Version: <strong>2026.1</strong></span>
      <span>Legal Basis: <strong>Law No. 6698 (KVKK) Art. 10</strong></span>
    </div>
  </div>

  <div class="legal-discreet-banner">
    <div class="legal-discreet-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    </div>
    <div>
      <h3 class="legal-discreet-title">Sector-Specific Absolute Discretion Guarantee</h3>
      <p class="legal-discreet-desc">Due to the intimate nature of wellness and intimacy items, all orders are dispatched in <strong>100% neutral, unbranded, double-sealed opaque packaging</strong>. No product descriptions, sex shop branding, or revealing logos ever appear on cargo waybills, bank statements, or exterior carton labels.</p>
    </div>
  </div>

  <nav class="legal-toc" aria-label="Table of contents">
    <div class="legal-toc-title">Table of Contents</div>
    <ol class="legal-toc-list">
      <li><a href="#sec-1">1. Data Controller Identity</a></li>
      <li><a href="#sec-2">2. Collected Personal Data Categories & Channels</a></li>
      <li><a href="#sec-3">3. Processing Purposes & Legal Grounds (KVKK Art. 5 & 6)</a></li>
      <li><a href="#sec-4">4. Data Retention & Destruction Periods</a></li>
      <li><a href="#sec-5">5. Transfer of Data to Third Parties</a></li>
      <li><a href="#sec-6">6. Cross-Border Data Transfers (KVKK Art. 9)</a></li>
      <li><a href="#sec-7">7. Rights of the Data Subject (KVKK Art. 11)</a></li>
      <li><a href="#sec-8">8. Application Procedure & Contact</a></li>
      <li><a href="#sec-9">9. Cookies (Cookie Preferences & Wall Policy)</a></li>
      <li><a href="#sec-10">10. Technical & Administrative Security Measures</a></li>
      <li><a href="#sec-11">11. Data Breach Notification (72-Hour Rule)</a></li>
      <li><a href="#sec-12">12. Intimacy & Discreet Packaging Commitment</a></li>
    </ol>
  </nav>

  <section class="legal-section" id="sec-1">
    <h2>1. Data Controller Identity</h2>
    <p>Pursuant to Article 10 of Law No. 6698 on the Protection of Personal Data ("KVKK"), this Clarification Text is published by ${phBadge(PH.company)} ("Company" or "Data Controller"), operating the e-commerce platform at <code>https://loveeroticshop.com</code>.</p>
    <ul class="legal-specs">
      <li><strong>Commercial Title:</strong> ${phBadge(PH.company)}</li>
      <li><strong>Physical Store / Operational Address:</strong> ${phBadge(PH.address)} (Registered Store: ${esc(storeAddress)})</li>
      <li><strong>Tax Office & ID:</strong> ${phBadge(PH.taxNo)}</li>
      <li><strong>MERSIS No:</strong> ${phBadge(PH.mersis)}</li>
      <li><strong>Registered Electronic Mail (KEP):</strong> ${phBadge(PH.kep)}</li>
      <li><strong>Official Support E-Mail:</strong> <a href="mailto:${esc(supportEmail)}">${esc(supportEmail)}</a> / ${phBadge(PH.email)}</li>
      <li><strong>Direct Support Phone:</strong> <a href="tel:${esc(supportPhone.replace(/[^0-9+]/g, ''))}">${esc(supportPhone)}</a></li>
    </ul>
  </section>

  <section class="legal-section" id="sec-2">
    <h2>2. Collected Personal Data Categories & Collection Methods</h2>
    <p>We process personal data strictly necessary for order fulfillment, customer satisfaction, and statutory compliance via electronic forms and automated channels:</p>
    <div class="legal-table-wrap">
      <table class="legal-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Processed Data Elements</th>
            <th>Collection Channel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Identity Data</strong></td>
            <td>Full name; National Identity Number (T.C. Kimlik No / Tax ID) strictly when requested for formal e-Archive invoice issuance.</td>
            <td>Checkout form, user registration form.</td>
          </tr>
          <tr>
            <td><strong>Contact Data</strong></td>
            <td>Delivery address, invoice address, mobile phone number, personal e-mail address.</td>
            <td>Order placement screen, user profile, WhatsApp assistance.</td>
          </tr>
          <tr>
            <td><strong>Customer Transaction Data</strong></td>
            <td>Order number, order date, purchased product inventory, order total, chosen payment/delivery mode, customer delivery notes, return/support correspondence.</td>
            <td>Automated order registry, customer service records.</td>
          </tr>
          <tr>
            <td><strong>Technical & Security Data</strong></td>
            <td>IP address, session tokens, browser agent, operating system, server access timestamps, salted cryptographic password hashes.</td>
            <td>Web application firewall, server log mechanisms, essential cookies.</td>
          </tr>
          <tr>
            <td><strong>Marketing & Preference Data</strong></td>
            <td>Commercial electronic message consents, opt-in cookie logs, wishlist items, browsing telemetry (only subject to explicit consent).</td>
            <td>Cookie preference modal, newsletter opt-in checks.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="legal-section" id="sec-3">
    <h2>3. Processing Purposes & Legal Grounds (KVKK Art. 5)</h2>
    <p>Personal data is processed in accordance with the fundamental principles laid down in KVKK Art. 4, clearly distinguishing between transactions requiring explicit consent and those processed under statutory grounds:</p>
    
    <div class="legal-box">
      <h3>A. Execution of Contract (KVKK Art. 5/2-c) — Explicit Consent Not Required</h3>
      <p>Processing is directly related to the establishment or performance of the sales contract concluded with the Buyer:</p>
      <ul>
        <li>Receipt, confirmation, discreet packaging, and courier delivery of product orders,</li>
        <li>Management of in-store pickup reservations,</li>
        <li>Customer account creation, authentication, and session continuity,</li>
        <li>Execution of statutory return, defective product, and warranty evaluations.</li>
      </ul>
    </div>

    <div class="legal-box">
      <h3>B. Statutory Obligations (KVKK Art. 5/2-ç) — Explicit Consent Not Required</h3>
      <p>Compliance with mandatory Turkish legal frameworks:</p>
      <ul>
        <li>Mandatory 3-year preservation of sales contracts and pre-information forms under the Regulation on Distance Contracts (Art. 20),</li>
        <li>Mandatory 10-year retention of invoices and fiscal books under the Tax Procedure Law (Law No. 213) and Turkish Commercial Code (Law No. 6102),</li>
        <li>Providing lawful information to judicial authorities and regulatory ministries upon formal notice.</li>
      </ul>
    </div>

    <div class="legal-box">
      <h3>C. Legitimate Interests of Data Controller (KVKK Art. 5/2-f)</h3>
      <ul>
        <li>Maintaining website uptime, preventing fraud, and hardening transactional cyber-defenses,</li>
        <li>Facilitating responsive customer concierge and order support.</li>
      </ul>
    </div>

    <div class="legal-box">
      <h3>D. Explicit Consent (KVKK Art. 5/1) — Strictly Opt-In</h3>
      <ul>
        <li>Transmission of promotional SMS or e-mail newsletters regarding seasonal campaigns,</li>
        <li>Activation of non-essential analytics and targeted advertising cookies.</li>
      </ul>
    </div>
  </section>

  <section class="legal-section" id="sec-4">
    <h2>4. Data Retention Periods & Destruction Process</h2>
    <p>Personal data is stored for the specified periods in strict compliance with the KVKK Article 4 proportionality principle, and systematically destroyed (erased, purged, or anonymized) pursuant to the Regulation on Deletion, Destruction, or Anonymization of Personal Data:</p>
    <ul class="legal-specs">
      <li><strong>Tax & Fiscal Invoicing Records:</strong> 10 Years (Tax Procedure Law Art. 253, Turkish Commercial Code Art. 82 — mandatory statutory retention for purchasers with invoices).</li>
      <li><strong>Distance Sales Contracts & Order Files:</strong> 3 Years (Distance Contracts Regulation Art. 20 and consumer dispute limitation period).</li>
      <li><strong>User Membership Profiles (Accounts without purchases or terminated accounts):</strong> Retained only for the duration of active membership. In accordance with KVKK proportionality, upon account deletion or termination, profile records (passwords, addresses, cart items) are purged or anonymized within <strong>30 days</strong> (retained up to at most 1 year strictly for dispute logging; non-purchasing accounts are never retained for 10 years).</li>
      <li><strong>Commercial Electronic Communication Consents:</strong> 3 Years from withdrawal of consent (Regulation on Commercial Communication Art. 13).</li>
      <li><strong>Internet Server Access Logs:</strong> 2 Years (Law No. 5651 Art. 7).</li>
      <li><strong>Cookies:</strong> Session duration or up to a maximum of 12 months (clearable by the user at any time).</li>
    </ul>
  </section>

  <section class="legal-section" id="sec-5">
    <h2>5. Transfer of Personal Data to Third Parties</h2>
    <p>Under strict confidentiality undertakings and the data minimization principle, data is shared solely with the following authorized partners:</p>
    <ul>
      <li><strong>Domestic Courier Companies (Yurtiçi Kargo / Contracted Couriers):</strong> Recipient name, address, and phone number solely for delivery. <em>Product descriptions or sex shop identifiers are NEVER disclosed to couriers.</em></li>
      <li><strong>Banking & Payment Processors:</strong> Transaction confirmation for wire transfers and in-store POS settlements.</li>
      <li><strong>Cloud Infrastructure & Hosting (Google Cloud / Firebase Firestore):</strong> Encrypted database hosting and secure server execution governed by the Google Cloud Data Processing Addendum (Cloud DPA).</li>
      <li><strong>Customer Communication Infrastructure (WhatsApp Business / Meta Platforms Ireland Ltd.):</strong> Dedicated channel for order verification and wire/EFT bank slip verification initiated upon customer request. Bank transfer slips shared via WhatsApp are processed solely for payment reconciliation and systematically cleared from chat archives into formal accounting records.</li>
      <li><strong>Fiscal & Legal Auditors:</strong> Certified financial advisors and attorneys bound by statutory professional secrecy.</li>
      <li><strong>Public Authorities & Courts:</strong> Exclusively upon legally binding subpoenas or judicial orders.</li>
    </ul>
  </section>

  <section class="legal-section" id="sec-6">
    <h2>6. Cross-Border Data Transfers (KVKK Art. 9)</h2>
    <p>Our web servers and persistent databases leverage enterprise cloud services provided by Google Cloud Platform / Firebase. Because these secure data centers may be physically situated in the European Union or other jurisdictions, personal data transfers across borders are safeguarded under Article 9 of the KVKK (as amended by Law No. 7499) through Google Cloud's Data Processing Addendum (Cloud DPA), Standard Contractual Clauses (SCC), ISO/IEC 27001 certifications, and technical end-to-end encryption controls.</p>
  </section>

  <section class="legal-section" id="sec-7">
    <h2>7. Rights of the Data Subject (KVKK Art. 11)</h2>
    <p>Every individual whose personal data is processed by loveeroticshop.com holds the following statutory rights under Article 11 of the KVKK:</p>
    <ol class="legal-numbered-list">
      <li>To learn whether personal data is being processed,</li>
      <li>To request information if personal data has been processed,</li>
      <li>To learn the purpose of the processing of personal data and whether they are used in accordance with their purpose,</li>
      <li>To know the third parties to whom personal data is transferred domestically or abroad,</li>
      <li>To request rectification in the event personal data is incomplete or inaccurately processed,</li>
      <li>To request erasure or destruction of personal data under the conditions provided for in Article 7 of the KVKK,</li>
      <li>To request notification of the operations carried out pursuant to sub-paragraphs (5) and (6) to third parties to whom personal data has been transferred,</li>
      <li>To object to the occurrence of a result against the person himself/herself by analyzing the processed data exclusively through automated systems,</li>
      <li>To demand compensation for damages in the event of suffering damage due to unlawful processing of personal data.</li>
    </ol>
  </section>

  <section class="legal-section" id="sec-8">
    <h2>8. Application Procedure to the Data Controller</h2>
    <p>Pursuant to the "Communiqué on the Principles and Procedures for the Request to the Data Controller", you may exercise your rights by submitting your formal request:</p>
    <ul>
      <li>In writing with wet signature to: <strong>${phBadge(PH.address)}</strong>,</li>
      <li>Via Registered Electronic Mail (KEP) to: <strong>${phBadge(PH.kep)}</strong>,</li>
      <li>Via your verified e-mail registered in our system to: <a href="mailto:${esc(supportEmail)}">${esc(supportEmail)}</a> / <strong>${phBadge(PH.email)}</strong> with the subject line <em>"KVKK Data Subject Request"</em>.</li>
    </ul>
    <p>Your application will be concluded free of charge as soon as possible and within <strong>30 (thirty) days</strong> at the latest. If a separate cost is incurred by the transaction, the fee specified in the tariff determined by the Personal Data Protection Board may be charged.</p>
  </section>

  <section class="legal-section" id="sec-9">
    <h2>9. Cookies & Cookie Preferences Management</h2>
    <p>Our website respects your autonomy. <strong>We do not deploy cookie walls</strong>: declining non-essential cookies does not restrict access to our store or ordering capabilities. Accept and Reject actions are provided with identical visual prominence.</p>
    
    <div class="cookie-mgmt-card" id="cookie-preferences-widget">
      <div class="cookie-mgmt-head">
        <h3>Cookie Preference Control Panel</h3>
        <p>You can adjust your cookie choices at any time below. Essential cookies are required for shopping basket functionality and cannot be disabled.</p>
      </div>

      <div class="cookie-mgmt-grid">
        <div class="cookie-item">
          <div class="cookie-item-info">
            <strong>1. Strictly Necessary Cookies (Always Active)</strong>
            <span>Preserves shopping cart tokens, theme mode, language selection, and session security.</span>
          </div>
          <span class="cookie-status-badge active">Required</span>
        </div>

        <div class="cookie-item">
          <div class="cookie-item-info">
            <strong>2. Analytics & Performance Cookies (Default: OFF)</strong>
            <span>Measures anonymous page views to improve responsiveness. No personal profiles are created.</span>
          </div>
          <label class="cookie-switch">
            <input type="checkbox" id="ck-toggle-analytics" aria-label="Enable Analytics Cookies">
            <span class="cookie-slider"></span>
          </label>
        </div>

        <div class="cookie-item">
          <div class="cookie-item-info">
            <strong>3. Marketing & Personalization Cookies (Default: OFF)</strong>
            <span>Displays tailored recommendations. Strictly opt-in; never active without consent.</span>
          </div>
          <label class="cookie-switch">
            <input type="checkbox" id="ck-toggle-marketing" aria-label="Enable Marketing Cookies">
            <span class="cookie-slider"></span>
          </label>
        </div>
      </div>

      <div class="cookie-actions-row">
        <button type="button" class="btn btn-ghost" id="ck-btn-reject-all">Reject All Non-Essential</button>
        <button type="button" class="btn btn-primary" id="ck-btn-save-prefs">Save Preferences</button>
        <button type="button" class="btn btn-outline" id="ck-btn-accept-all">Accept All</button>
      </div>
      <div id="cookie-pref-feedback" class="cookie-feedback-msg" style="display:none;">Preferences saved successfully.</div>
    </div>
  </section>

  <section class="legal-section" id="sec-10">
    <h2>10. Technical & Administrative Security Measures</h2>
    <p>To prevent unlawful processing, unauthorized access, and loss of personal data, the following institutional safeguards are implemented:</p>
    <ul>
      <li>End-to-end 256-bit TLS/SSL encryption for all web communications,</li>
      <li>Cryptographic one-way hashing for authentication credentials,</li>
      <li>Multi-layer role-based access control and principle of least privilege for store staff,</li>
      <li>Continuous vulnerability scanning and automated DDoS mitigation.</li>
    </ul>
  </section>

  <section class="legal-section" id="sec-11">
    <h2>11. Data Breach Notification Protocol</h2>
    <p>In the unlikely event of an unauthorized security breach compromising personal data, the Data Controller undertakes to notify the Personal Data Protection Authority (KVKK Kurulu) within <strong>72 hours</strong> and inform affected users without undue delay, in full accordance with KVKK Article 12/5.</p>
  </section>

  <section class="legal-section" id="sec-12">
    <h2>12. Sector-Specific Discretion & Anonymized Packaging</h2>
    <p>Physical privacy is our foundational brand pillar. We guarantee:</p>
    <ul>
      <li>All packages are boxed in unprinted, opaque, double-sealed neutral cartons.</li>
      <li>The cargo tracking label lists only the corporate sender name ${phBadge(PH.company)} without any erotic, sex shop, or adult wellness wording.</li>
      <li>Bank receipts and account statements record only standard commercial codes, completely free of product titles.</li>
    </ul>
    <p class="legal-cross-link">For detailed return conditions and hygiene exemptions, please review our <a href="/kullanim-kosullari">Terms of Service & Distance Sales Agreement</a>.</p>
  </section>
</div>
`;
  }

  // TURKISH VERSION (Primary, authoritative text)
  return `
<div class="rich rich-legal" id="privacy-policy-doc">
  <div class="legal-header">
    <div class="legal-nav-crumbs">
      <a href="/">Ana Sayfa</a> / <a href="/kullanim-kosullari">Mesafeli Satış & Kullanım Koşulları</a> / <span>Gizlilik Politikası</span>
    </div>
    <h1 class="legal-h1">Gizlilik Politikası ve KVKK Aydınlatma Metni</h1>
    <p class="legal-lead">6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) m. 10 Kapsamında Aydınlatma Bildirimi ve loveeroticshop.com Mahremiyet İlkeleri</p>
    <div class="legal-meta-bar">
      <span>Yürürlük Tarihi: <strong>${updatedDate}</strong></span>
      <span>Doküman Sürümü: <strong>2026.1</strong></span>
      <span>Hukuki Dayanak: <strong>6698 Sayılı KVKK Madde 10</strong></span>
    </div>
  </div>

  <div class="legal-discreet-banner">
    <div class="legal-discreet-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    </div>
    <div>
      <h3 class="legal-discreet-title">Sektöre Özel %100 Nötr & Gizli Paketleme Garantisi</h3>
      <p class="legal-discreet-desc">Ürünlerimizin kişisel ve hassas mahiyeti sebebiyle, tüm siparişler <strong>içeriği dışarıdan kesinlikle anlaşılamayan, çift mühürlü, nötr kraft koli veya opak kargo ambalajı</strong> içerisinde sevk edilir. Kargo fişinde, fatura dış yüzeyinde veya banka ekstrelerinde mağaza türünü ele veren ("Erotik", "Love Shop", "Sex Shop") hiçbir ibare veya ürün adı yer almaz.</p>
    </div>
  </div>

  <nav class="legal-toc" aria-label="İçindekiler">
    <div class="legal-toc-title">İçindekiler Rehberi</div>
    <ol class="legal-toc-list">
      <li><a href="#sec-1">1. Veri Sorumlusunun Kimliği</a></li>
      <li><a href="#sec-2">2. İşlenen Kişisel Veri Kategorileri ve Toplama Kanalları</a></li>
      <li><a href="#sec-3">3. Kişisel Veri İşleme Amaçları ve Hukuki Sebepleri (KVKK m. 5 ve 6)</a></li>
      <li><a href="#sec-4">4. Veri Saklama ve Periyodik İmha Süreleri</a></li>
      <li><a href="#sec-5">5. Kişisel Verilerin Aktarıldığı Üçüncü Taraflar ve Amaçları</a></li>
      <li><a href="#sec-6">6. Yurt Dışına Veri Aktarımı (KVKK m. 9)</a></li>
      <li><a href="#sec-7">7. İlgili Kişinin (Veri Sahibinin) Kanuni Hakları (KVKK m. 11)</a></li>
      <li><a href="#sec-8">8. Veri Sorumlusuna Başvuru Usulü ve İletişim</a></li>
      <li><a href="#sec-9">9. Çerezler (Cookies) ve Çerez Tercih Yönetimi (Çerez Duvarı Yasağı)</a></li>
      <li><a href="#sec-10">10. Bilgi Güvenliği ve Alınan Teknik / İdari Tedbirler</a></li>
      <li><a href="#sec-11">11. Kişisel Veri İhlali Bildirimi Taahhüdü (72 Saat Kuralı)</a></li>
      <li><a href="#sec-12">12. Sektöre Özel Mahremiyet, Fatura ve Kargo Güvencesi</a></li>
    </ol>
  </nav>

  <section class="legal-section" id="sec-1">
    <h2>1. Veri Sorumlusunun Kimliği</h2>
    <p>6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, <code>https://loveeroticshop.com</code> internet sitesi üzerinden toplanan kişisel verileriniz; veri sorumlusu sıfatıyla aşağıda unvanı ve iletişim bilgileri yer alan ${phBadge(PH.company)} ("Şirket" veya "Veri Sorumlusu") tarafından işlenmektedir.</p>
    <ul class="legal-specs">
      <li><strong>Veri Sorumlusu Ticari Unvanı:</strong> ${phBadge(PH.company)}</li>
      <li><strong>Fiziksel Faaliyet / Mağaza Adresi:</strong> ${phBadge(PH.address)} (Kayıtlı Mağaza: ${esc(storeAddress)})</li>
      <li><strong>Vergi Dairesi ve Vergi Kimlik No:</strong> ${phBadge(PH.taxNo)}</li>
      <li><strong>MERSİS Numarası:</strong> ${phBadge(PH.mersis)}</li>
      <li><strong>Kayıtlı Elektronik Posta (KEP):</strong> ${phBadge(PH.kep)}</li>
      <li><strong>Resmi Müşteri Destek E-Postası:</strong> <a href="mailto:${esc(supportEmail)}">${esc(supportEmail)}</a> / ${phBadge(PH.email)}</li>
      <li><strong>Telefon & WhatsApp Canlı Destek:</strong> <a href="tel:${esc(supportPhone.replace(/[^0-9+]/g, ''))}">${esc(supportPhone)}</a></li>
    </ul>
  </section>

  <section class="legal-section" id="sec-2">
    <h2>2. İşlenen Kişisel Veri Kategorileri ve Toplama Kanalları</h2>
    <p>Platformumuz üzerinden alışveriş yaparken, üye olurken veya iletişim kurarken aşağıdaki veri kategorileri toplanmakta ve işlenmektedir:</p>
    <div class="legal-table-wrap">
      <table class="legal-table">
        <thead>
          <tr>
            <th>Veri Kategorisi</th>
            <th>İşlenen Somut Veriler</th>
            <th>Toplama Kanalı ve Form</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Kimlik Verisi</strong></td>
            <td>Ad ve soyad; mevzuat gereği talep edilmesi durumunda yasal fatura tanzimi için T.C. Kimlik Numarası veya Vergi Kimlik Numarası.</td>
            <td>Sipariş formu, üyelik kayıt formu, fatura talep alanı.</td>
          </tr>
          <tr>
            <td><strong>İletişim Verisi</strong></td>
            <td>Teslimat adresi, fatura adresi, cep telefonu numarası, e-posta adresi.</td>
            <td>Sipariş tamamlama ekranı, üye profil sayfası, WhatsApp teyit hattı.</td>
          </tr>
          <tr>
            <td><strong>Müşteri İşlem Verisi</strong></td>
            <td>Sipariş numarası, sipariş tarihi, satın alınan ürün kalemleri, sepet tutarı, indirim kuponları, seçilen teslimat ve ödeme türü, sipariş notları, iptal/iade ve müşteri destek kayıtları.</td>
            <td>Elektronik sipariş oluşturma süreci, WhatsApp sipariş görüşmeleri, müşteri hizmetleri logları.</td>
          </tr>
          <tr>
            <td><strong>İşlem Güvenliği ve Teknik Veri</strong></td>
            <td>IP adresi, oturum belirteçleri (session tokens), tarayıcı bilgisi, işletim sistemi, site içi erişim tarih ve saat damgaları, tek yönlü şifrelenmiş parola özetleri.</td>
            <td>Otomatik sunucu erişim günlükleri (server logs), teknik oturum çerezleri.</td>
          </tr>
          <tr>
            <td><strong>Pazarlama ve Tercih Verisi</strong></td>
            <td>(Yalnızca açık rıza bulunması halinde) Ticari elektronik ileti onay kayıtları, analitik çerez verileri, favori listeleri.</td>
            <td>Çerez tercih paneli, bülten onay kutucuğu.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="legal-section" id="sec-3">
    <h2>3. Kişisel Veri İşleme Amaçları ve Hukuki Sebepleri (KVKK m. 5 ve m. 6)</h2>
    <p>Kişisel verileriniz, KVKK’nın 4. maddesindeki temel ilkelere sadık kalınarak, açık rıza gerektiren ve gerektirmeyen hukuki dayanaklar ayrıştırılarak işlenmektedir:</p>
    
    <div class="legal-box">
      <h3>A. Bir Sözleşmenin Kurulması veya İfasıyla Doğrudan İlgili Olması (KVKK m. 5/2-c)</h3>
      <p>Bu bent uyarınca açık rıza aranmaksızın yürütülen işlemler:</p>
      <ul>
        <li>Verilen siparişlerin işleme alınması, nötr/gizli şekilde ambalajlanması ve kargo ile tesliminin gerçekleştirilmesi,</li>
        <li>Mağazadan teslim seçeneğinde ürünlerin hazırlanması ve teslimat teyidinin sağlanması,</li>
        <li>Kullanıcı üyeliğinin kurulması, profil ve sipariş takibinin yönetilmesi,</li>
        <li>Tüketici mevzuatı gereği ayıplı mal, değişim ve yasal cayma taleplerinin sonuçlandırılması.</li>
      </ul>
    </div>

    <div class="legal-box">
      <h3>B. Veri Sorumlusunun Hukuki Yükümlülüğünü Yerine Getirmesi (KVKK m. 5/2-ç)</h3>
      <p>Bu bent uyarınca kanuni zorunluluk nedeniyle yürütülen işlemler:</p>
      <ul>
        <li>6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği (m. 20) uyarınca sipariş, sözleşme ve ön bilgilendirme kayıtlarının <strong>3 yıl süreyle saklanması</strong>,</li>
        <li>213 sayılı Vergi Usul Kanunu ve Türk Ticaret Kanunu gereğince e-Arşiv/e-Fatura düzenlenmesi ve yasal mali defterlerin <strong>10 yıl süreyle muhafazası</strong>,</li>
        <li>Yetkili kamu kurumları, emniyet birimleri ve adli mercilerin yasal bilgi/belge taleplerinin yerine getirilmesi.</li>
      </ul>
    </div>

    <div class="legal-box">
      <h3>C. Veri Sorumlusunun Meşru Menfaatleri (KVKK m. 5/2-f)</h3>
      <ul>
        <li>Web sitesinin siber güvenliğinin sağlanması, şüpheli işlemlerin ve dolandırıcılık teşebbüslerinin tespiti,</li>
        <li>Müşteri memnuniyetinin ölçülmesi ve satış sonrası müşteri destek kalitesinin iyileştirilmesi.</li>
      </ul>
    </div>

    <div class="legal-box">
      <h3>D. İlgili Kişinin Açık Rızası (KVKK m. 5/1) — Tamamen İsteğe Bağlı</h3>
      <ul>
        <li>Kullanıcı onay verdiği takdirde yeni ürün lansmanları, indirim ve kampanyalara ilişkin SMS ve e-posta (Ticari Elektronik İleti) gönderimi,</li>
        <li>Zorunlu olmayan performans, analitik ve hedefleme çerezlerinin etkinleştirilmesi.</li>
      </ul>
    </div>
  </section>

  <section class="legal-section" id="sec-4">
    <h2>4. Veri Saklama ve Periyodik İmha Süreleri</h2>
    <p>Toplanan kişisel veriler, KVKK'nın 4. maddesinde düzenlenen "amacıyla bağlantılı, sınırlı ve ölçülü olma" ilkesine tam uyumlu olarak belirlenen yasal süreler boyunca saklanmakta; saklama süresinin sona ermesiyle Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hale Getirilmesi Hakkında Yönetmelik gereğince periyodik imha takviminde silinmekte veya anonimleştirilmektedir:</p>
    <ul class="legal-specs">
      <li><strong>Mali ve Muhasebe Kayıtları (Fatura / e-Arşiv):</strong> 10 Yıl (213 Sayılı Vergi Usul Kanunu m. 253, 6102 Sayılı TTK m. 82 — sipariş veren kullanıcılara ait yasal zorunlu saklama süresi).</li>
      <li><strong>Mesafeli Satış Sözleşmesi ve Sipariş Kayıtları:</strong> 3 Yıl (Mesafeli Sözleşmeler Yönetmeliği m. 20 ve tüketici uyuşmazlıkları zamanaşımı).</li>
      <li><strong>Kullanıcı Üyelik ve Profil Verileri (Siparişi Olmayan veya Hesabını Kapatan Kullanıcılar):</strong> Aktif üyelik süresince saklanır. KVKK'nın ölçülülük ilkesi uyarınca; üyelik iptali veya hesap silme talebi durumunda, bekleyen bir uyuşmazlık bulunmaması kaydıyla profil ve hesap verileri azami <strong>30 gün içinde silinir veya anonim hale getirilir</strong> (olası üyelik iptali itirazlarının teyidi amacıyla bu süre en fazla 1 yılla sınırlandırılır; sipariş ve faturası bulunmayan kullanıcıların verileri kesinlikle 10 yıl saklanmaz).</li>
      <li><strong>Ticari Elektronik İleti Onay Kayıtları:</strong> İznin geri alındığı tarihten itibaren 3 Yıl (Ticari İletişim ve Ticari Elektronik İletiler Hakkında Yönetmelik m. 13).</li>
      <li><strong>İnternet Trafik ve Erişim Logları:</strong> 2 Yıl (5651 Sayılı Kanun m. 7).</li>
      <li><strong>Çerez Verileri:</strong> Oturum süresince veya azami 12 Ay (Kullanıcı tarafından tarayıcı ayarlarından veya sitemizdeki çerez tercih panelinden her zaman silinebilir).</li>
    </ul>
  </section>

  <section class="legal-section" id="sec-5">
    <h2>5. Kişisel Verilerin Aktarıldığı Üçüncü Taraflar</h2>
    <p>Kişisel verileriniz, asgari veri prensibi (data minimization) gözetilerek ve sıkı gizlilik sözleşmeleri akdedilerek yalnızca aşağıdaki iş ortaklarımızla paylaşılmaktadır:</p>
    <ul>
      <li><strong>Kargo ve Lojistik Sağlayıcıları (Yurtiçi Kargo ve Anlaşmalı Kargo Şirketleri):</strong> Siparişin alıcıya teslim edilebilmesi için zorunlu olan ad, soyad, adres ve telefon bilgisi aktarılır. <em>Kargo şirketine hiçbir koşulda paket içeriği veya ürün açıklaması bildirilmez.</em></li>
      <li><strong>Ödeme Kuruluşları ve Bankalar:</strong> Havale/EFT kontrolü ve fiziksel mağaza POS tahsilat süreçlerinde ilgili banka kuruluşları.</li>
      <li><strong>Bulut Altyapı ve Veritabanı Sağlayıcısı (Google Cloud / Firebase Firestore):</strong> Google Cloud Data Processing Addendum (Cloud DPA) sözleşme koşulları altında şifreli ve yüksek güvenlikli sunucu barındırma hizmeti.</li>
      <li><strong>Müşteri İletişim Altyapısı (WhatsApp Business / Meta Platforms Ireland Ltd.):</strong> Müşterinin kendi açık talebi ve inisiyatifiyle WhatsApp destek hattımıza başvurması durumunda sipariş teyidi ve havale/EFT dekont kontrolü amacıyla kullanılır. Paylaşılan banka dekontları yalnızca ödeme mutabakatı için incelenir; muhasebe eşleşmesi akabinde dekontlar yasal muhasebe arşivine aktarılır ve WhatsApp mesajlaşma geçmişi periyodik olarak temizlenir.</li>
      <li><strong>Mali ve Hukuk Danışmanları:</strong> Şirketimizin yasal muhasebe ve hukuki işlemlerinin takibi kapsamında mesleki sır saklama yükümlülüğü altındaki mali müşavir ve avukatlarımız.</li>
      <li><strong>Yetkili Kamu Kurumları:</strong> Kanunların açıkça emrettiği durumlarda mahkemeler, tüketici hakem heyetleri ve adli makamlar.</li>
    </ul>
  </section>

  <section class="legal-section" id="sec-6">
    <h2>6. Yurt Dışına Veri Aktarımı (KVKK m. 9)</h2>
    <p>Web sitemizin altyapısı ve güvenli veritabanı, Google Cloud Platform / Firebase sistemleri üzerinden yürütülmektedir. Bu bulut altyapısının sunucularının fiziksel olarak Avrupa Birliği (AB) veya diğer ülkelerdeki güvenli veri merkezlerinde bulunabilmesi sebebiyle, KVKK m. 9 kapsamında yurt dışına veri aktarımı gündeme gelebilmektedir.</p>
    <p>7499 sayılı Kanun ile yenilenen KVKK m. 9 uyarınca söz konusu aktarımlar; Google Cloud ile akdedilen Veri İşleme Eki (Cloud DPA), Kişisel Verileri Koruma Kurulu'nun 10 Temmuz 2024 tarihli Yönetmeliği'ne uygun Standart Sözleşmeler (Standard Contractual Clauses - SCC), ISO/IEC 27001 bilgi güvenliği standartları ve teknik şifreleme mekanizmaları ile güvence altına alınmaktadır.</p>
  </section>

  <section class="legal-section" id="sec-7">
    <h2>7. İlgili Kişinin (Veri Sahibinin) Kanuni Hakları (KVKK m. 11)</h2>
    <p>KVKK'nın 11. maddesi uyarınca veri sahibi olarak aşağıdaki haklara sahipsiniz:</p>
    <ol class="legal-numbered-list">
      <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
      <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
      <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
      <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
      <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
      <li>KVKK’nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,</li>
      <li>Düzeltme ve silme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
      <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
      <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
    </ol>
  </section>

  <section class="legal-section" id="sec-8">
    <h2>8. Veri Sorumlusuna Başvuru Usulü ve İletişim</h2>
    <p>"Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ" hükümleri uyarınca yukarıda belirtilen haklarınıza ilişkin taleplerinizi:</p>
    <ul>
      <li>Islak imzalı dilekçe ile şahsen veya noter kanalıyla: <strong>${phBadge(PH.address)}</strong> adresine,</li>
      <li>Kayıtlı Elektronik Posta (KEP) adresimiz olan: <strong>${phBadge(PH.kep)}</strong> adresine,</li>
      <li>Sistemimizde kayıtlı bulunan e-posta adresinizden: <a href="mailto:${esc(supportEmail)}">${esc(supportEmail)}</a> / <strong>${phBadge(PH.email)}</strong> adresine <em>"KVKK İlgili Kişi Başvurusu"</em> konu başlığıyla iletebilirsiniz.</li>
    </ul>
    <p>Başvurunuzda ad-soyad, T.C. kimlik no, tebligat adresi ve talep konusunun bulunması zorunludur. Başvurularınız en geç <strong>30 (otuz) gün</strong> içerisinde ücretsiz olarak neticelendirilecektir.</p>
  </section>

  <section class="legal-section" id="sec-9">
    <h2>9. Çerezler (Cookies) ve Çerez Tercih Yönetimi</h2>
    <p>Web sitemizde kullanıcı deneyimini zedeleyen <strong>çerez duvarı (cookie wall) KULLANILMAMAKTADIR</strong>. Çerezleri reddetme hakkınız, kabul etme seçeneği ile tamamen eşit görünürlükte sunulur ve çerezleri reddetmek siteden alışveriş yapmanıza engel teşkil etmez.</p>
    
    <div class="cookie-mgmt-card" id="cookie-preferences-widget">
      <div class="cookie-mgmt-head">
        <h3>Çerez Tercih Yönetim Paneli</h3>
        <p>Aşağıdaki panel üzerinden çerez tercihlerinizi dilediğiniz an inceleyebilir ve güncelleyebilirsiniz. Zorunlu çerezler sitenin çalışması için teknik olarak elzemdir.</p>
      </div>

      <div class="cookie-mgmt-grid">
        <div class="cookie-item">
          <div class="cookie-item-info">
            <strong>1. Kesinlikle Zorunlu Çerezler (Her Zaman Aktif)</strong>
            <span>Sepet içeriği, karanlık/aydınlık tema seçimi, dil tercihi ve güvenlik oturumu için zorunludur. Kapatılamaz.</span>
          </div>
          <span class="cookie-status-badge active">Zorunlu</span>
        </div>

        <div class="cookie-item">
          <div class="cookie-item-info">
            <strong>2. Analitik ve Performans Çerezleri (Varsayılan: KAPALI)</strong>
            <span>Ziyaretçi sayılarını ve gezinme akışlarını anonim olarak ölçer. Açık onayınız olmadan ASLA aktif edilmez.</span>
          </div>
          <label class="cookie-switch">
            <input type="checkbox" id="ck-toggle-analytics" aria-label="Analitik Çerezleri Aç/Kapat">
            <span class="cookie-slider"></span>
          </label>
        </div>

        <div class="cookie-item">
          <div class="cookie-item-info">
            <strong>3. Pazarlama ve Hedefleme Çerezleri (Varsayılan: KAPALI)</strong>
            <span>Size özel kampanya ve teklifler sunulmasını sağlar. Açık onayınız olmadan ASLA aktif edilmez.</span>
          </div>
          <label class="cookie-switch">
            <input type="checkbox" id="ck-toggle-marketing" aria-label="Pazarlama Çerezleri Aç/Kapat">
            <span class="cookie-slider"></span>
          </label>
        </div>
      </div>

      <div class="cookie-actions-row">
        <button type="button" class="btn btn-ghost" id="ck-btn-reject-all">Zorunlu Olmayanları Reddet</button>
        <button type="button" class="btn btn-primary" id="ck-btn-save-prefs">Tercihleri Kaydet</button>
        <button type="button" class="btn btn-outline" id="ck-btn-accept-all">Tümünü Kabul Et</button>
      </div>
      <div id="cookie-pref-feedback" class="cookie-feedback-msg" style="display:none;">Çerez tercihleriniz başarıyla güncellendi.</div>
    </div>
  </section>

  <section class="legal-section" id="sec-10">
    <h2>10. Bilgi Güvenliği ve Alınan Teknik / İdari Tedbirler</h2>
    <p>Kişisel verilerinizin yetkisiz erişime, kayba veya ifşaya karşı korunması amacıyla yürürlükteki en ileri güvenlik tedbirleri uygulanmaktadır:</p>
    <ul>
      <li>Tüm veri trafiği 256-bit SSL/TLS sertifikası ile uçtan uca şifrelenir.</li>
      <li>Kullanıcı şifreleri sunucularımızda açık metin olarak değil, tek yönlü kriptografik özet algoritmaları (salted hashing) ile saklanır.</li>
      <li>Veritabanı erişimleri yetkilendirme matrislerine bağlıdır; yetkisiz personele kapalıdır.</li>
      <li>Düzenli güvenlik testleri ve güvenlik duvarı (WAF) filtrelemeleri aktiftir.</li>
    </ul>
  </section>

  <section class="legal-section" id="sec-11">
    <h2>11. Kişisel Veri İhlali Bildirimi Taahhüdü (72 Saat Kuralı)</h2>
    <p>Alınan tüm teknik ve idari tedbirlere rağmen meydana gelebilecek olası bir siber saldırı veya kişisel veri ihlali durumunda Veri Sorumlusu; KVKK m. 12/5 uyarınca durumu öğrendiği andan itibaren en geç <strong>72 saat içerisinde</strong> Kişisel Verileri Koruma Kurulu'na ve etkilenen ilgili kişilere gecikmeksizin bildirimde bulunmayı taahhüt eder.</p>
  </section>

  <section class="legal-section" id="sec-12">
    <h2>12. Sektöre Özel Mahremiyet, Fatura ve Kargo Güvencesi</h2>
    <p>Love Shop olarak müşterilerimizin kişisel mahremiyetini en temel iş ahlakı sayıyoruz:</p>
    <ul>
      <li>Paketler dışarıdan bakıldığında hiçbir ipucu vermeyen dayanıklı, nötr kraft kutularda kargolanır.</li>
      <li>Kargo takip barkodunda ve koli etiketinde yalnızca şirket unvanımız ${phBadge(PH.company)} yazar; mağaza adı veya ürün kategorisi bulunmaz.</li>
      <li>Kurye, kargo görevlisi veya üçüncü şahıslar paket içeriğini kesinlikle bilemez.</li>
    </ul>
    <p class="legal-cross-link">İade koşulları, cayma hakkı ve hijyen istisnaları hakkında detaylı bilgi için lütfen <a href="/kullanim-kosullari">Kullanım Koşulları ve Mesafeli Satış Sözleşmesi</a> sayfamızı inceleyiniz.</p>
  </section>
</div>

<script>
(function() {
  const PREF_KEY = 'ls_cookie_preferences_v1';
  function loadPrefs() {
    try {
      const val = localStorage.getItem(PREF_KEY);
      return val ? JSON.parse(val) : { analytics: false, marketing: false, essential: true };
    } catch(e) {
      return { analytics: false, marketing: false, essential: true };
    }
  }
  function savePrefs(p) {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(p));
      const fb = document.getElementById('cookie-pref-feedback');
      if (fb) {
        fb.style.display = 'block';
        setTimeout(() => { fb.style.display = 'none'; }, 3500);
      }
    } catch(e) {}
  }
  function syncUI() {
    const p = loadPrefs();
    const an = document.getElementById('ck-toggle-analytics');
    const mk = document.getElementById('ck-toggle-marketing');
    if (an) an.checked = !!p.analytics;
    if (mk) mk.checked = !!p.marketing;
  }
  const btnSave = document.getElementById('ck-btn-save-prefs');
  const btnReject = document.getElementById('ck-btn-reject-all');
  const btnAccept = document.getElementById('ck-btn-accept-all');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const an = document.getElementById('ck-toggle-analytics');
      const mk = document.getElementById('ck-toggle-marketing');
      savePrefs({
        essential: true,
        analytics: an ? an.checked : false,
        marketing: mk ? mk.checked : false,
        updatedAt: new Date().toISOString()
      });
    });
  }
  if (btnReject) {
    btnReject.addEventListener('click', () => {
      const an = document.getElementById('ck-toggle-analytics');
      const mk = document.getElementById('ck-toggle-marketing');
      if (an) an.checked = false;
      if (mk) mk.checked = false;
      savePrefs({ essential: true, analytics: false, marketing: false, updatedAt: new Date().toISOString() });
    });
  }
  if (btnAccept) {
    btnAccept.addEventListener('click', () => {
      const an = document.getElementById('ck-toggle-analytics');
      const mk = document.getElementById('ck-toggle-marketing');
      if (an) an.checked = true;
      if (mk) mk.checked = true;
      savePrefs({ essential: true, analytics: true, marketing: true, updatedAt: new Date().toISOString() });
    });
  }
  syncUI();
})();
</script>
`;
}

export function getTermsOfServiceHtml(C: any, dbSettings: any): string {
  const isEn = C.lang === 'en';
  const updatedDate = '19.09.2026';
  const supportEmail = dbSettings?.supportEmail || 'info@loveeroticshop.com';
  const supportPhone = dbSettings?.supportPhone || '+90 543 633 13 25';
  const storeAddress = dbSettings?.address || 'İsmet İnönü-1 Cd. No:52/2, Ilgaz İş Hanı Kat:1 Daire:2, 26170 Tepebaşı/Eskişehir';

  if (isEn) {
    return `
<div class="rich rich-legal" id="terms-of-service-doc">
  <div class="legal-header">
    <div class="legal-nav-crumbs">
      <a href="/">Home</a> / <a href="/gizlilik-politikasi">Privacy Policy</a> / <span>Terms & Distance Sales</span>
    </div>
    <h1 class="legal-h1">Terms of Service & Distance Sales Contract</h1>
    <p class="legal-lead">Statutory Distance Sales Agreement pursuant to Law No. 6502 on Consumer Protection and the Regulation on Distance Contracts</p>
    <div class="legal-meta-bar">
      <span>Effective Date: <strong>${updatedDate}</strong></span>
      <span>Contract Code: <strong>MSS-2026.1</strong></span>
      <span>Governing Law: <strong>Republic of Turkey (Law No. 6502)</strong></span>
    </div>
  </div>

  <div class="legal-critical-banner">
    <div class="legal-critical-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    </div>
    <div>
      <h3 class="legal-critical-title">Crucial Statutory Notice: Health & Hygiene Exemption (Regulation Art. 15/1-ç)</h3>
      <p class="legal-critical-desc">Pursuant to Article 15/1-ç of the Regulation on Distance Contracts: <strong>Items whose protective packaging, seal, tape, or vacuum wrapping has been opened following delivery and whose return is inappropriate for reasons of health and personal hygiene CANNOT BE RETURNED under the statutory right of withdrawal.</strong> For details, see Article 7 below.</p>
    </div>
  </div>

  <nav class="legal-toc" aria-label="Table of contents">
    <div class="legal-toc-title">Contract Articles</div>
    <ol class="legal-toc-list">
      <li><a href="#art-1">Article 1 — Contracting Parties</a></li>
      <li><a href="#art-2">Article 2 — Subject & Scope of the Contract</a></li>
      <li><a href="#art-3">Article 3 — Preliminary Information & Order Process</a></li>
      <li><a href="#art-4">Article 4 — Intellectual Property & Prohibited Use</a></li>
      <li><a href="#art-5">Article 5 — Mandatory +18 Age Verification & Representation</a></li>
      <li><a href="#art-6">Article 6 — Statutory Right of Withdrawal (General Rule)</a></li>
      <li><a href="#art-7">Article 7 — Hygiene Exemption to Right of Withdrawal (Sector-Specific)</a></li>
      <li><a href="#art-8">Article 8 — Defective Goods & Consumer Rights</a></li>
      <li><a href="#art-9">Article 9 — Payment Terms & Invoicing</a></li>
      <li><a href="#art-10">Article 10 — Delivery & 100% Discreet Packaging</a></li>
      <li><a href="#art-11">Article 11 — Dispute Resolution & Competent Consumer Courts</a></li>
      <li><a href="#art-12">Article 12 — Document Retention & Evidentiary Undertaking</a></li>
      <li><a href="#art-13">Article 13 — Enforcement & Binding Consent</a></li>
    </ol>
  </nav>

  <section class="legal-section" id="art-1">
    <h2>Article 1 — Contracting Parties</h2>
    <div class="legal-box">
      <h3>1.1. Seller (Service Provider)</h3>
      <ul class="legal-specs">
        <li><strong>Commercial Title:</strong> ${phBadge(PH.company)}</li>
        <li><strong>Physical Address:</strong> ${phBadge(PH.address)} (Registered: ${esc(storeAddress)})</li>
        <li><strong>Phone & WhatsApp:</strong> <a href="tel:${esc(supportPhone.replace(/[^0-9+]/g, ''))}">${esc(supportPhone)}</a></li>
        <li><strong>Customer Support E-Mail:</strong> <a href="mailto:${esc(supportEmail)}">${esc(supportEmail)}</a> / ${phBadge(PH.email)}</li>
        <li><strong>Tax Office & Number:</strong> ${phBadge(PH.taxNo)}</li>
        <li><strong>MERSIS Number:</strong> ${phBadge(PH.mersis)}</li>
        <li><strong>Web Domain:</strong> <code>https://loveeroticshop.com</code></li>
      </ul>
    </div>

    <div class="legal-box" style="margin-top:16px">
      <h3>1.2. Buyer (Consumer)</h3>
      <p>Any natural person aged 18 years or older who places an order, registers, or transacts on <code>loveeroticshop.com</code>. The identity, delivery address, phone, and e-mail submitted by the Buyer during checkout shall be deemed legally binding.</p>
    </div>
  </section>

  <section class="legal-section" id="art-2">
    <h2>Article 2 — Subject & Scope of the Contract</h2>
    <p>This Contract regulates the rights and obligations of the parties in accordance with Law No. 6502 on Consumer Protection and the Regulation on Distance Contracts regarding the electronic order, payment, and discreet physical delivery of adult sexual wellness, personal massage, body cosmetics, and fantasy apparel items displayed on <code>loveeroticshop.com</code>.</p>
  </section>

  <section class="legal-section" id="art-3">
    <h2>Article 3 — Preliminary Information & Order Process</h2>
    <p>Prior to confirming the order on the checkout screen, the Buyer is provided with clear preliminary information detailing:</p>
    <ul>
      <li>Essential specifications, models, and quantities of the selected goods,</li>
      <li>The total price including all applicable taxes (VAT),</li>
      <li>Delivery costs (or free shipping thresholds),</li>
      <li>Payment method and estimated delivery timeframe (standard 1–3 business days; statutory maximum of 30 days).</li>
    </ul>
    <p>By clicking the checkout confirmation button, the Buyer acknowledges having read and electronically affirmed this preliminary information.</p>
  </section>

  <section class="legal-section" id="art-4">
    <h2>Article 4 — Intellectual Property & Prohibited Use</h2>
    <p>All trademarks, graphics, photographs, editorial texts, software codes, and layouts appearing on <code>loveeroticshop.com</code> are the exclusive property of the Seller. Unauthorized scraping, copying, reverse-engineering, reproduction, or public dissemination is strictly prohibited under Law No. 5846 on Intellectual and Artistic Works and the Turkish Criminal Code.</p>
  </section>

  <section class="legal-section" id="art-5">
    <h2>Article 5 — Mandatory +18 Age Verification, Technical Gate & Legal Warranty</h2>
    <p><code>loveeroticshop.com</code> strictly caters to mature adults aged 18 years and older. To prevent unauthorized access by minors pursuant to Law No. 5651 and Turkish Criminal Code Art. 226, the Seller enforces a <strong>two-tier technical age verification barrier</strong>:</p>
    <ul>
      <li><strong>Tier 1 (Site-Wide Age Gate):</strong> Every initial visitor is intercepted by a mandatory age verification gate requiring active adult confirmation prior to viewing content.</li>
      <li><strong>Tier 2 (Checkout Affirmation & Electronic Evidence Log):</strong> Upon order placement, the Buyer must actively tick the mandatory legal consent checkbox declaring adulthood. The Buyer's affirmative assertion, transaction timestamp, IP address, and browser metadata are recorded as electronic evidence pursuant to Turkish Code of Civil Procedure (Law No. 6100) Art. 199.</li>
    </ul>
    <p>By confirming an order, the Buyer irrevocably represents and warrants that they are at least 18 years of age. Individuals under the age of 18 are legally prohibited from purchasing adult wellness items. Full civil, criminal, and administrative liability arising from inaccurate or deceptive age declarations rests entirely with the individual submitting false information.</p>
  </section>

  <section class="legal-section" id="art-6">
    <h2>Article 6 — Statutory Right of Withdrawal (General Rule)</h2>
    <p>Pursuant to Article 9 of the Regulation on Distance Contracts, the Consumer has the right to withdraw from the contract within <strong>14 (fourteen) days</strong> from the date of physical receipt of the goods without providing any justification and without paying any contractual penalty.</p>
    <p>To exercise the right of withdrawal, notice must be given to the Seller in writing (via email to <a href="mailto:${esc(supportEmail)}">${esc(supportEmail)}</a> or registered mail) within the 14-day window. The goods must be returned within 10 days of notice with their original invoice.</p>
  </section>

  <section class="legal-section" id="art-7">
    <h2>Article 7 — Hygiene Exemption to the Right of Withdrawal (Crucial Sector Notice)</h2>
    <p>Pursuant to <strong>Article 15, Paragraph 1, Sub-paragraph (ç) of the Regulation on Distance Contracts (published in the Official Gazette No. 29188 dated November 27, 2014)</strong>:</p>
    <blockquote class="legal-quote">
      "Contracts relating to the delivery of goods whose protective elements such as packaging, tape, seal, or vacuum packet have been opened following delivery; and whose return is not appropriate on grounds of health and hygiene."
    </blockquote>
    <p>Because items sold on <code>loveeroticshop.com</code> directly touch sensitive personal skin and mucous membranes, the following product lines fall strictly under this statutory hygiene exemption:</p>
    <ul>
      <li><strong>All vibrators, personal massage devices, masturbators, dildos, kegel exercise weights, and electronic/analog sexual wellness apparatuses whose protective seal, vacuum film, or box packaging has been unsealed;</strong></li>
      <li><strong>Fantasy lingerie, bodysuits, stockings, and intimate apparel whose sanitary hygiene strip or sealed polybag has been opened or tried on;</strong></li>
      <li><strong>Intimate lubricants, massage oils, sprays, balms, and personal hygiene washes whose bottle seal, safety tab, or outer foil has been breached.</strong></li>
    </ul>
    <div class="legal-box" style="background:var(--bg-subtle, rgba(255,255,255,0.04));">
      <strong>Scope of Valid Returns:</strong> The 14-day statutory right of withdrawal applies strictly to products whose outer cellophane, manufacturer security seal, box tape, and vacuum packaging remain completely intact, unopened, and uncompromised.
    </div>
  </section>

  <section class="legal-section" id="art-8">
    <h2>Article 8 — Defective Goods & Consumer Rights</h2>
    <p>The hygiene exemption set forth in Article 7 does NOT apply to defective, broken, or non-conforming items. If a product arrives with a manufacturing fault, physical defect, or transit damage, the Buyer retains all rights under Article 11 of Law No. 6502:</p>
    <ol class="legal-numbered-list">
      <li>Rescission of contract and full refund,</li>
      <li>Proportional reduction in purchase price,</li>
      <li>Free repair of the product at Seller's expense,</li>
      <li>Replacement with a non-defective equivalent item.</li>
    </ol>
    <p>The Buyer is advised to inspect the exterior shipping package upon delivery and request a formal Damage Assessment Protocol from the courier if visible crushing or tearing is observed.</p>
  </section>

  <section class="legal-section" id="art-9">
    <h2>Article 9 — Payment Terms & Invoicing</h2>
    <p>In order to maximize customer anonymity, transactions are finalized via WhatsApp-assisted bank transfer (EFT/Havale) or in-store Cash/POS settlement upon physical pickup. An official e-Archive invoice is prepared for every completed sale and dispatched electronically to the Buyer's submitted e-mail address.</p>
  </section>

  <section class="legal-section" id="art-10">
    <h2>Article 10 — Delivery & 100% Discreet Packaging</h2>
    <p>The Seller guarantees absolute delivery discretion across Turkey:</p>
    <ul>
      <li>All items are enclosed within neutral, opaque, double-sealed protective packaging.</li>
      <li>The outer label lists only the legal entity ${phBadge(PH.company)} and never reveals adult wellness terminology, product names, or shop titles.</li>
      <li>Standard dispatch takes place within 1 business day, with courier transit completing in 1–3 business days.</li>
    </ul>
  </section>

  <section class="legal-section" id="art-11">
    <h2>Article 11 — Dispute Resolution & Competent Consumer Courts</h2>
    <p>In disputes arising from this Contract, the Consumer Arbitration Committees (Tüketici Hakem Heyetleri) and Consumer Courts (Tüketici Mahkemeleri) situated at the domicile of the Buyer or where the consumer transaction took place are authorized within the annual monetary limits announced by the Ministry of Trade.</p>
  </section>

  <section class="legal-section" id="art-12">
    <h2>Article 12 — Document Retention & Evidentiary Agreement</h2>
    <p>The Seller undertakes to preserve this Contract, preliminary disclosure forms, and order records for <strong>3 (three) years</strong> pursuant to Article 20 of the Regulation on Distance Contracts. The digital logs, WhatsApp records, and server timestamps of the Seller shall constitute conclusive evidence pursuant to Article 193 of the Code of Civil Procedure.</p>
  </section>

  <section class="legal-section" id="art-13">
    <h2>Article 13 — Enforcement & Binding Consent</h2>
    <p>Comprising 13 articles, this Contract enters into full legal effect immediately upon the Buyer submitting and confirming their order electronically. For personal data inquiries, please consult our <a href="/gizlilik-politikasi">Privacy Policy & KVKK Clarification Text</a>.</p>
  </section>
</div>
`;
  }

  // TURKISH VERSION (Primary, authoritative text)
  return `
<div class="rich rich-legal" id="terms-of-service-doc">
  <div class="legal-header">
    <div class="legal-nav-crumbs">
      <a href="/">Ana Sayfa</a> / <a href="/gizlilik-politikasi">Gizlilik Politikası & KVKK</a> / <span>Mesafeli Satış & Kullanım Koşulları</span>
    </div>
    <h1 class="legal-h1">Kullanım Koşulları ve Mesafeli Satış Sözleşmesi</h1>
    <p class="legal-lead">6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği Hükümleri Uyarınca Tanzim Edilen Yasal Satış Sözleşmesi</p>
    <div class="legal-meta-bar">
      <span>Yürürlük Tarihi: <strong>${updatedDate}</strong></span>
      <span>Sözleşme Kodu: <strong>MSS-2026.1</strong></span>
      <span>Yetkili Hukuk: <strong>Türkiye Cumhuriyeti Mevzuatı (6502 Sayılı Kanun)</strong></span>
    </div>
  </div>

  <div class="legal-critical-banner">
    <div class="legal-critical-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    </div>
    <div>
      <h3 class="legal-critical-title">Kritik Yasal Uyarı: Sağlık ve Hijyen İstisnası (Yönetmelik Madde 15/1-ç)</h3>
      <p class="legal-critical-desc">Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin 1. fıkrasının (ç) bendi uyarınca: <strong>Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan mallardan; iadesi sağlık ve hijyen açısından uygun olmayan ürünlerde tüketici cayma hakkını kullanamaz.</strong> Ambalajı veya güvenlik mührü açılmış cinsel sağlık ve hijyen ürünlerinin iadesi yasa gereği kabul edilmemektedir. Ayrıntılar için Madde 7'yi inceleyiniz.</p>
    </div>
  </div>

  <nav class="legal-toc" aria-label="İçindekiler">
    <div class="legal-toc-title">Sözleşme Maddeleri</div>
    <ol class="legal-toc-list">
      <li><a href="#art-1">Madde 1 — Taraflar (Satıcı ve Alıcı)</a></li>
      <li><a href="#art-2">Madde 2 — Sözleşmenin Konusu ve Kapsamı</a></li>
      <li><a href="#art-3">Madde 3 — Ön Bilgilendirme ve Sipariş Süreci</a></li>
      <li><a href="#art-4">Madde 4 — Fikri Mülkiyet Hakları ve Yasak Kullanımlar</a></li>
      <li><a href="#art-5">Madde 5 — +18 Yaş Sınırı ve Yasal Reşitlik Beyanı</a></li>
      <li><a href="#art-6">Madde 6 — Cayma Hakkı (Genel Kural ve Süre)</a></li>
      <li><a href="#art-7">Madde 7 — Cayma Hakkının İstisnaları (Sağlık ve Hijyen Kuralı)</a></li>
      <li><a href="#art-8">Madde 8 — Ayıplı Mal ve Tüketici Hakları</a></li>
      <li><a href="#art-9">Madde 9 — Ödeme Usulü ve e-Fatura Düzenlenmesi</a></li>
      <li><a href="#art-10">Madde 10 — Teslimat Esasları ve %100 Nötr Paketleme Taahhüdü</a></li>
      <li><a href="#art-11">Madde 11 — Uyuşmazlıkların Çözümü ve Tüketici Hakem Heyetleri</a></li>
      <li><a href="#art-12">Madde 12 — Belge Saklama Yükümlülüğü ve Delil Sözleşmesi</a></li>
      <li><a href="#art-13">Madde 13 — Yürürlük ve Elektronik Onay</a></li>
    </ol>
  </nav>

  <section class="legal-section" id="art-1">
    <h2>Madde 1 — Taraflar</h2>
    
    <div class="legal-box">
      <h3>1.1. Satıcı Bilgileri</h3>
      <ul class="legal-specs">
        <li><strong>Ticari Unvan:</strong> ${phBadge(PH.company)}</li>
        <li><strong>Fiziksel Mağaza / Faaliyet Adresi:</strong> ${phBadge(PH.address)} (Kayıtlı Adres: ${esc(storeAddress)})</li>
        <li><strong>Telefon & WhatsApp:</strong> <a href="tel:${esc(supportPhone.replace(/[^0-9+]/g, ''))}">${esc(supportPhone)}</a></li>
        <li><strong>E-Posta:</strong> <a href="mailto:${esc(supportEmail)}">${esc(supportEmail)}</a> / ${phBadge(PH.email)}</li>
        <li><strong>Vergi Dairesi ve No:</strong> ${phBadge(PH.taxNo)}</li>
        <li><strong>MERSİS Numarası:</strong> ${phBadge(PH.mersis)}</li>
        <li><strong>Web Sitesi:</strong> <code>https://loveeroticshop.com</code></li>
      </ul>
    </div>

    <div class="legal-box" style="margin-top:16px">
      <h3>1.2. Alıcı (Tüketici) Bilgileri</h3>
      <p><code>loveeroticshop.com</code> internet sitesine üye olan veya üye olmadan sipariş oluşturan, 18 yaşını doldurmuş gerçek kişidir ("Alıcı"). Alıcı'nın sipariş oluştururken beyan ettiği ad-soyad, teslimat adresi, telefon ve e-posta bilgileri esas alınır.</p>
    </div>
  </section>

  <section class="legal-section" id="art-2">
    <h2>Madde 2 — Sözleşmenin Konusu ve Kapsamı</h2>
    <p>İşbu Sözleşme, Alıcı'nın Satıcı'ya ait <code>loveeroticshop.com</code> internet sitesi üzerinden elektronik ortamda siparişini verdiği yetişkin cinsel sağlık, masaj aparatları, vücut kozmetikleri ve fantezi giyim ürünlerinin satışı, bedelinin tahsili, gizli paketleme ile adrese teslimi ve tarafların 6502 sayılı Tüketicinin Korunması Hakkında Kanun ile Mesafeli Sözleşmeler Yönetmeliği kapsamındaki karşılıklı hak ve yükümlülüklerini düzenler.</p>
  </section>

  <section class="legal-section" id="art-3">
    <h2>Madde 3 — Ön Bilgilendirme ve Sipariş Süreci</h2>
    <p>Alıcı, siparişi onaylamadan evvel ödeme ve sepet ekranında açıkça sunulan Ön Bilgilendirme Formu'nu okuyup teyit ettiğini kabul eder. Bu kapsamda:</p>
    <ul>
      <li>Ürünlerin temel özellikleri (cinsi, miktarı, rengi ve kullanım nitelikleri),</li>
      <li>Tüm vergiler dahil toplam satış bedeli,</li>
      <li>Varsa kargo ve teslimat masrafları (veya ücretsiz kargo baremi),</li>
      <li>Ödeme ve teslimat şekli ile tahmini teslimat süresi (yasal azami süre 30 gün olup olağan teslimat 1-3 iş günüdür) Alıcı tarafından elektronik ortamda incelenmiş ve onaylanmıştır.</li>
    </ul>
  </section>

  <section class="legal-section" id="art-4">
    <h2>Madde 4 — Fikri Mülkiyet Hakları ve Yasak Kullanımlar</h2>
    <p><code>loveeroticshop.com</code> alan adlı sitede yer alan tüm ticari markalar, logolar, ürün çekimleri, editoryal metinler, yazılım kodları, veri tabanı ve görsel tasarımlar Satıcı'nın fikri mülkiyetindedir. 5846 sayılı Fikir ve Sanat Eserleri Kanunu ile 6769 sayılı Sınai Mülkiyet Kanunu uyarınca izinsiz kopyalanamaz, çoğaltılamaz, tersine mühendislikle işlenemez ve bot/otomasyon sistemleriyle taranamayacağı.</p>
  </section>

  <section class="legal-section" id="art-5">
    <h2>Madde 5 — +18 Yaş Sınırı, İki Kademeli Teknik Doğrulama ve Yasal Reşitlik Beyanı</h2>
    <p><code>loveeroticshop.com</code> platformu münhasıran 18 yaş ve üzeri yetişkinlere yönelik cinsel sağlık ve masaj ürünleri sunmaktadır. 5651 sayılı Kanun ve Türk Ceza Kanunu (TCK) m. 226 uyarınca küçüklerin korunması amacıyla platformda <strong>iki kademeli teknik yaş doğrulama sistemi</strong> uygulanmaktadır:</p>
    <ul>
      <li><strong>1. Kademe (Site Geneli Yaş Kapısı - Age Gate):</strong> Siteyi ilk kez ziyaret eden her kullanıcı, içeriklere erişmeden önce aktif olarak reşit olduğunu beyan etmek zorunda olduğu teknik bir yaş filtresiyle karşılanır.</li>
      <li><strong>2. Kademe (Sipariş Ekranı Elektronik İspat Kaydı):</strong> Sipariş aşamasında Alıcı, 18 yaşını doldurduğunu ve sözleşme şartlarını kabul ettiğini belirten yasal onay kutucuğunu bizzat işaretler. Alıcı'nın bu beyanı, işlem zaman damgası, IP adresi ve işlem loglarıyla birlikte 6100 sayılı Hukuk Muhakemeleri Kanunu m. 199 uyarınca elektronik delil olarak kayıt altına alınır.</li>
    </ul>
    <p>Alıcı, sipariş verdiği andan itibaren 18 yaşını doldurmuş reşit bir birey olduğunu gayrikabili rücu kabul, beyan ve taahhüt eder. 18 yaşından küçüklerin site üzerinden sipariş vermesi kanunen yasaktır. Gerçeğe aykırı yaş beyanında bulunarak işlem yapılmasından doğabilecek her türlü hukuki, idari ve cezai sorumluluk münhasıran Alıcı'ya aittir; Satıcı'nın bu hususta hiçbir sorumluluğu bulunmamaktadır.</p>
  </section>

  <section class="legal-section" id="art-6">
    <h2>Madde 6 — Cayma Hakkı (Genel Kural ve Süre)</h2>
    <p>6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği m. 9 uyarınca Alıcı, malın kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren <strong>14 (on dört) gün</strong> içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.</p>
    <p>Cayma hakkının kullanılması için 14 günlük yasal süre içinde Satıcı'ya <a href="mailto:${esc(supportEmail)}">${esc(supportEmail)}</a> e-posta adresi üzerinden yazılı bildirimde bulunulması gerekmektedir. Cayma bildirimini takip eden 10 gün içinde ürün, faturası ve tüm parçaları ile birlikte Satıcı'ya gönderilmeli; ürünün Satıcı'ya ulaşmasını izleyen 14 gün içinde ürün bedeli Alıcı'ya iade edilir.</p>
  </section>

  <section class="legal-section" id="art-7">
    <h2>Madde 7 — Cayma Hakkının İstisnaları (Sağlık ve Hijyen Kuralı)</h2>
    <p><strong>27 Kasım 2014 tarih ve 29188 sayılı Resmî Gazete'de yayımlanan Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin 1. fıkrasının (ç) bendi</strong> uyarınca:</p>
    <blockquote class="legal-quote">
      "Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan mallardan; iadesi sağlık ve hijyen açısından uygun olmayanların teslimine ilişkin sözleşmelerde tüketici cayma hakkını kullanamaz."
    </blockquote>
    <p>Platformumuz üzerinden satılan ürünler nitelikleri ve kullanım amaçları itibarıyla doğrudan cilt, vücut ve mukoza ile temas eden hassas ürünlerdir. Bu doğrultuda:</p>
    <ul>
      <li><strong>Koruyucu emniyet jelatini, vakumu, kutu mühür bandı veya koruma kapağı açılmış olan tüm vibratörler, masaj aletleri, mastürbatörler, dildolar, kegel egzersiz topları, analog/elektronik cinsel sağlık cihazları ve aparatları;</strong></li>
      <li><strong>Hijyen koruma bandı açılmış, denenmiş veya ambalajından çıkarılmış fantezi iç giyim, kostüm, çorap ve tenle temas eden tekstil ürünleri;</strong></li>
      <li><strong>Güvenlik folyosu, emniyet kilidi veya ambalajı açılmış olan kayganlaştırıcı jeller, masaj yağları, geciktirici spreyler, kremler ve bakım kozmetikleri;</strong></li>
    </ul>
    <p><strong>SAĞLIK VE HİJYEN MEVZUATI GEREĞİNCE CAYMA HAKKI KAPSAMI DIŞINDADIR VE KESİNLİKLE İADE ALINAMAZ.</strong></p>
    <div class="legal-box" style="background:var(--bg-subtle, rgba(255,255,255,0.04));">
      <strong>Geçerli İade Kriteri:</strong> Cayma hakkı yalnızca dış şeffaf jelatini, kutu emniyet bandı, ambalaj mührü ve koruma kapağı hiçbir şekilde açılmamış, bozulmamış, denenmemiş ve hasar görmemiş orijinal ürünler için geçerlidir.
    </div>
  </section>

  <section class="legal-section" id="art-8">
    <h2>Madde 8 — Ayıplı Mal ve Tüketici Hakları</h2>
    <p>Madde 7'de belirtilen hijyen istisnası, ürünün <strong>ayıplı, fabrikasyon hatalı, kırık, eksik veya arızalı</strong> olması durumunu KAPSAMAZ. Teslimat anında kusurlu veya arızalı olduğu tespit edilen ürünlerde Alıcı; 6502 sayılı Kanun'un 11. maddesindeki yasal seçimlik haklara sahiptir:</p>
    <ol class="legal-numbered-list">
      <li>Sözleşmeden dönerek bedel iadesi talep etme,</li>
      <li>Ayıp oranında satış bedelinden indirim talep etme,</li>
      <li>Aşırı masraf gerektirmediği sürece ücretsiz onarım talep etme,</li>
      <li>İmkân varsa satılanın ayıpsız bir misli ile değiştirilmesini talep etme.</li>
    </ol>
    <p>Alıcı teslimat sırasında kargo paketini kontrol etmeli; kolide açık ezik, ıslanma veya yırtık tespit ettiğinde kargo görevlisine "Hasar Tespit Tutanağı" düzenletmelidir.</p>
  </section>

  <section class="legal-section" id="art-9">
    <h2>Madde 9 — Ödeme Usulü ve e-Fatura Düzenlenmesi</h2>
    <p>Kullanıcı gizliliğini azami düzeyde korumak amacıyla sipariş tahsilatları WhatsApp teyitli Banka Havalesi/EFT veya mağazadan teslimatta Nakit / Kredi Kartı POS aracılığıyla kabul edilmektedir. Havale/EFT işlemlerinde paylaşılan banka dekontları yalnızca mali mutabakat amacıyla yetkili muhasebe personeli tarafından incelenir, teyit akabinde yasal defterlere aktarılır ve mesajlaşma ortamında kalıcı arşiv tutulmaz. Siparişe istinaden mevzuata uygun e-Arşiv Fatura tanzim edilerek Alıcı'nın e-posta adresine iletilir.</p>
  </section>

  <section class="legal-section" id="art-10">
    <h2>Madde 10 — Teslimat Esasları ve %100 Nötr Paketleme Taahhüdü</h2>
    <p>Satıcı, sipariş edilen ürünleri Alıcı'nın belirttiği teslimat adresine anlaşmalı kargo firmaları marifetiyle ulaştırır:</p>
    <ul>
      <li>Tüm ürünler çift katlı, dışarıdan içeriği belli etmeyen nötr kraft koli veya opak kargo poşetlerinde mühürlenir.</li>
      <li>Kargo takip fişinde yalnızca şirket unvanı ${phBadge(PH.company)} yer alır; cinsel sağlık, erotik shop veya ürün detayına dair hiçbir ifade yer almaz.</li>
      <li>Siparişler olağan şartlarda 1 iş günü içinde kargoya verilir ve kargo şirketi aracılığıyla 1-3 iş günü içinde teslim edilir.</li>
    </ul>
  </section>

  <section class="legal-section" id="art-11">
    <h2>Madde 11 — Uyuşmazlıkların Çözümü ve Tüketici Hakem Heyetleri</h2>
    <p>İşbu Sözleşme'nin uygulanmasından ve yorumlanmasından doğabilecek uyuşmazlıklarda; Ticaret Bakanlığı tarafından her yıl Aralık ayında ilan edilen parasal sınırlar dahilinde Alıcı'nın yerleşim yerindeki veya tüketici işleminin yapıldığı yerdeki <strong>İl veya İlçe Tüketici Hakem Heyetleri</strong>, söz konusu parasal sınırları aşan uyuşmazlıklarda ise <strong>Tüketici Mahkemeleri</strong> yetkilidir.</p>
  </section>

  <section class="legal-section" id="art-12">
    <h2>Madde 12 — Belge Saklama Yükümlülüğü ve Delil Sözleşmesi</h2>
    <p>Satıcı, Mesafeli Sözleşmeler Yönetmeliği m. 20 gereğince işbu sözleşmeyi, ön bilgilendirme formunu ve sipariş belgelerini <strong>3 (üç) yıl</strong> süreyle saklar. Taraflar, doğabilecek ihtilaflarda Satıcı'ya ait elektronik kayıtların, sunucu loglarının, sistem kayıtlarının ve WhatsApp yazışmalarının Hukuk Muhakemeleri Kanunu m. 193 uyarınca kesin delil teşkil edeceğini kabul eder.</p>
  </section>

  <section class="legal-section" id="art-13">
    <h2>Madde 13 — Yürürlük ve Elektronik Onay</h2>
    <p>13 (on üç) maddeden ibaret işbu Kullanım Koşulları ve Mesafeli Satış Sözleşmesi, Alıcı tarafından elektronik ortamda siparişin onaylandığı tarihte yürürlüğe girmiştir. Kişisel verilerinizin işlenmesi hakkında bilgi almak için <a href="/gizlilik-politikasi">Gizlilik Politikası ve KVKK Aydınlatma Metni</a>'ni inceleyebilirsiniz.</p>
  </section>
</div>
`;
}

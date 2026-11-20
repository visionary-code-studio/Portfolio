'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import RazorpayButton from '@/components/ui/RazorpayButton';
import styles from './CollabSection.module.css';

interface MenuItem {
  name: string;
  price: string;
  priceNumeric: number;
  note?: string;
  tag?: string;
}

interface MenuCategory {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: string;
  isPopular?: boolean;
  accentColor: string;
  items: MenuItem[];
  deliverables: string[];
}

const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'graphic-designing',
    title: 'Graphic Designing',
    subtitle: 'Canva Pro & Figma Creative Direction',
    badge: 'Fast Turnaround (24 - 48h)',
    accentColor: '#e2e8f0',
    items: [
      {
        name: 'Figma [Basic UI Layouts & Components]',
        price: 'Rs. 99',
        priceNumeric: 99,
        tag: 'Starter Tier',
      },
      {
        name: 'Logo Design [Vector, Concept & Monogram]',
        price: 'Rs. 249',
        priceNumeric: 249,
        tag: 'Brand Identity',
      },
      {
        name: 'Pamphlets & Marketing Brochures',
        price: 'Rs. 349',
        priceNumeric: 349,
      },
      {
        name: 'Posters & Event / Promo Flyers',
        price: 'Rs. 999',
        priceNumeric: 999,
        tag: 'High Impact',
      },
      {
        name: 'Academic Presentation (Research & Seminars)',
        price: 'Rs. 999',
        priceNumeric: 999,
        note: 'For Academic',
      },
      {
        name: 'Business Presentation (Investor Pitch Decks)',
        price: 'Rs. 2,999',
        priceNumeric: 2999,
        note: 'For Business',
        tag: 'Investor Ready',
      },
    ],
    deliverables: [
      'Fully editable Canva Pro & Figma source files',
      'High-resolution PNG, JPG, PDF & SVG vector formats',
      'Modern typography, custom color palette & branding rules',
      'Rapid revisions until scope satisfaction',
    ],
  },
  {
    id: 'website-development',
    title: 'Website Development',
    subtitle: 'Modern Full-Stack Engineering & Conversion UI',
    badge: 'MOST POPULAR · HIGH DEMAND',
    isPopular: true,
    accentColor: '#f5a623',
    items: [
      {
        name: 'Portfolio & Static Website',
        price: 'Rs. 14,999',
        priceNumeric: 14999,
        tag: 'Signature Build',
        note: 'Next.js 14, Smooth Animations, 99+ Lighthouse speed',
      },
      {
        name: 'E-commerce Website',
        price: 'Rs. 19,999',
        priceNumeric: 19999,
        tag: 'Full Turnkey',
        note: 'Dynamic catalogs, cart & checkout. Modification and Cards will be discussed',
      },
    ],
    deliverables: [
      'Tailored Next.js 14, React & TypeScript architecture',
      'Mobile-first responsive layout (smartphones, tablets, 4K desktops)',
      'SEO optimization, schema tags & zero-latency global CDN deployment',
      'Payment gateway readiness & custom interaction design',
      'Detailed scope discussion & ongoing iteration',
    ],
  },
  {
    id: 'saas-products',
    title: 'SaaS & Custom Products',
    subtitle: 'Custom Software, Automations & Intelligent Tools',
    badge: 'Engineered Solutions',
    accentColor: '#60a5fa',
    items: [
      {
        name: 'Chrome & Browser Extensions',
        price: 'Based on Extension Scope',
        priceNumeric: 0,
        note: 'Custom scrapers, productivity shortcuts, API integrations',
        tag: 'Bespoke',
      },
      {
        name: 'Python-Based Products & AI Tools',
        price: 'Based on Product Scope',
        priceNumeric: 0,
        note: 'AI/ML pipelines, automated backend bots, data utilities',
        tag: 'AI Powered',
      },
    ],
    deliverables: [
      'Clean, documented, scalable & unit-tested codebase',
      'Packaging, store manifest & deployment instructions',
      'API webhooks, cloud database sync & credential security',
      'Direct developer consultation & architecture walkthrough',
    ],
  },
];

const VALID_OWNER_KEYS = [
  'VSNU2026',
  'VAIBHAV',
  'VAIBHAV2026',
  'OWNER2026',
  'QR2026',
  'PORTFOLIO2026',
  'ADMIN2026',
];

interface CollabSectionProps {
  profileEmail?: string;
  resumeUrl?: string;
  services?: any;
}

export default function CollabSection({
  profileEmail = 'vaibhavsnu2025@gmail.com',
  resumeUrl = '/resume1.pdf',
  services,
}: CollabSectionProps) {
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'inquiry' | 'payment' | 'qr'>('inquiry');
  const [selectedServiceTitle, setSelectedServiceTitle] = useState<string>('Portfolio & Static Website');
  const [customAmount, setCustomAmount] = useState<number>(14999);

  // Inquiry Form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientBrief, setClientBrief] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // QR Unlock state
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [qrUnlocked, setQrUnlocked] = useState(false);
  const [qrKeyError, setQrKeyError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const openServiceModal = (category: MenuCategory, item?: MenuItem) => {
    const title = item ? `${category.title}: ${item.name}` : category.title;
    setSelectedServiceTitle(title);
    if (item && item.priceNumeric > 0) {
      setCustomAmount(item.priceNumeric);
    }
    setModalTab('inquiry');
    setInquirySubmitted(false);
    setModalOpen(true);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project Inquiry: ${selectedServiceTitle} — from ${clientName}`);
    const body = encodeURIComponent(
      `Hello Vaibhav,\n\nI would like to discuss and collaborate on: ${selectedServiceTitle}.\n\nClient Name: ${clientName}\nClient Email: ${clientEmail}\nCompany / Organization: ${clientCompany || 'N/A'}\nTarget Budget / Agreed Amount: Rs. ${customAmount}\n\nProject Scope & Requirements:\n${clientBrief}\n\nLooking forward to your discussion and allowance.\n\nBest regards,\n${clientName}`
    );
    window.location.href = `mailto:${profileEmail}?subject=${subject}&body=${body}`;
    setInquirySubmitted(true);
  };

  const handleUnlockQr = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = secretKeyInput.trim().toUpperCase();
    if (VALID_OWNER_KEYS.includes(normalized)) {
      setQrUnlocked(true);
      setQrKeyError(null);
    } else {
      setQrKeyError('Invalid Secret Key. Please contact Vaibhav Shaw to obtain an allowance passcode.');
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('vaibhavsnu2025@okaxis');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  return (
    <section id="collab" className={styles.collabSectionWrapper} aria-label="Services Menu & Collaboration">
      <div className={styles.collabInnerContainer}>
        {/* Atmospheric Lighting */}
        <div className={styles.lightBeam} aria-hidden="true" />
        <div className={styles.goldAmbientGlow} aria-hidden="true" />

        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.topStatusBadge}>
            <span className={styles.pulseDot} />
            <span>Available for Q4 2026 Collaboration</span>
          </div>

          <h2 className={styles.mainTitle}>
            SERVICES <span className={styles.titleGoldHighlight}>MENU CARD</span> &amp; SHOWCASE
          </h2>

          <p className={styles.subDescription}>
            TRANSPARENT VALUE. BESPOKE EXECUTION. EXPLORE SHOWCASE PRICING BELOW.
          </p>

          {/* ATTENTIVE & APPROACHING NOTICE BANNER */}
          <div className={styles.officialNoticeBanner}>
            <div className={styles.noticeIconWrap}>
              <span className={styles.noticeShieldIcon}>🛡️</span>
            </div>
            <div className={styles.noticeTextWrap}>
              <h4 className={styles.noticeTitle}>Official Collaboration &amp; Payment Notice</h4>
              <p className={styles.noticeBody}>
                <strong>Menu pricing is indicative for showcase only.</strong> All project pricing can be modified based on your specific requirements, timeline, and feature complexity. 
                Payment is <strong>strictly processed from this official portfolio</strong> and <strong>only after direct discussion &amp; mutual agreement with Vaibhav Shaw</strong>.
              </p>
            </div>
            <button
              type="button"
              className={styles.noticeActionBtn}
              onClick={() => {
                setSelectedServiceTitle('General Project Consultation');
                setModalTab('inquiry');
                setModalOpen(true);
              }}
              data-cursor-hover
            >
              Send Inquiry First ➔
            </button>
          </div>
        </div>

        {/* 3-Pillar Creative Menu Showcase Grid */}
        <div className={styles.menuGrid}>
          {MENU_CATEGORIES.map((category) => (
            <article
              key={category.id}
              className={`${styles.menuCard} ${category.isPopular ? styles.menuCardPopular : ''}`}
            >
              {/* Popular Badge */}
              {category.isPopular && (
                <div className={styles.popularBadgeWrap}>
                  <span className={styles.popularBadgeText}>{category.badge}</span>
                </div>
              )}

              {/* Card Header */}
              <div className={styles.cardHeaderArea}>
                <span className={styles.cardPillarTag}>{category.badge}</span>
                <h3 className={styles.cardMainTitle}>{category.title}</h3>
                <p className={styles.cardSubtitle}>{category.subtitle}</p>
              </div>

              {/* Detailed Menu Items Showcase */}
              <div className={styles.menuItemsList}>
                <div className={styles.menuListHeader}>
                  <span>Service Package</span>
                  <span>Baseline Rate</span>
                </div>

                {category.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={styles.menuItemRow}
                    onClick={() => openServiceModal(category, item)}
                    title="Click to discuss this package"
                    data-cursor-hover
                  >
                    <div className={styles.itemLeft}>
                      <div className={styles.itemNameWrap}>
                        <span className={styles.itemBullet}>✦</span>
                        <span className={styles.itemName}>{item.name}</span>
                        {item.tag && <span className={styles.itemTagPill}>{item.tag}</span>}
                      </div>
                      {item.note && <span className={styles.itemNoteText}>{item.note}</span>}
                    </div>
                    <div className={styles.itemRight}>
                      <span className={styles.itemPriceBadge}>{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Deliverables Checklist */}
              <div className={styles.deliverablesSection}>
                <h4 className={styles.deliverablesTitle}>What&apos;s Included:</h4>
                <ul className={styles.deliverablesList}>
                  {category.deliverables.map((item, dIdx) => (
                    <li key={dIdx} className={styles.deliverableItem}>
                      <span className={styles.checkIcon}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Card Action */}
              <div className={styles.cardFooterActions}>
                <button
                  type="button"
                  className={category.isPopular ? styles.primaryActionBtnGold : styles.primaryActionBtn}
                  onClick={() => openServiceModal(category)}
                  data-cursor-hover
                >
                  <span>Discuss &amp; Inquire</span>
                  <span className={styles.btnArrow}>➔</span>
                </button>
                <span className={styles.cardDisclaimer}>*Custom modifications discussed per scope</span>
              </div>
            </article>
          ))}
        </div>

        {/* Recruiter & Direct Fast-Track Section */}
        <div className={styles.recruiterBanner}>
          <div className={styles.recruiterContent}>
            <div className={styles.recruiterEyebrow}>FAST-TRACK RECRUITMENT &amp; HIRING</div>
            <h3 className={styles.recruiterHeading}>Direct Engineering &amp; Team Collaboration</h3>
            <p className={styles.recruiterDesc}>
              Looking for an AI/ML engineer, creative frontend developer, or technical lead? 
              I maintain high academic honors (9.38 CGPA) at Sister Nivedita University, combining strong research discipline with hackathon-tested speed and practical execution.
            </p>
            <div className={styles.recruiterPills}>
              <span className={styles.recruiterPillItem}>📍 Kolkata / Hybrid / Remote</span>
              <span className={styles.recruiterPillItem}>🎓 B.Tech CSE (AIML Track)</span>
              <span className={styles.recruiterPillItem}>⚡ Immediate Availability</span>
            </div>
          </div>

          <div className={styles.recruiterActions}>
            <a
              href={`mailto:${profileEmail}?subject=Direct%20Collaboration%20Inquiry%20%E2%80%94%20Vaibhav%20Shaw`}
              className={styles.recruiterPrimaryBtn}
              data-cursor-hover
            >
              <span>✉ Direct Mail Connect</span>
            </a>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.recruiterSecondaryBtn}
              data-cursor-hover
            >
              <span>📄 View Official Resume</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── HIGH-CONVERSION POP-UP WINDOW (NOTICE, INQUIRY & PROTECTED PAYMENT) ── */}
      {modalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            {/* Modal Close Button */}
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setModalOpen(false)}
              aria-label="Close pop up"
              data-cursor-hover
            >
              ×
            </button>

            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <span className={styles.modalBadge}>OFFICIAL PORTFOLIO GATEWAY</span>
              <h3 className={styles.modalTitle}>Project Consultation &amp; Booking</h3>
              <p className={styles.modalSelectedService}>Selected Scope: <strong>{selectedServiceTitle}</strong></p>
            </div>

            {/* Policy & Notice Callout Box */}
            <div className={styles.modalNoticeBox}>
              <div className={styles.modalNoticeHeader}>
                <span className={styles.noticePinIcon}>📌</span>
                <strong>Important Policy Notice:</strong>
              </div>
              <ul className={styles.modalNoticeBullets}>
                <li><strong>Send Inquiry First:</strong> Pricing on the menu is baseline. Pricing can be modified and tailored based on discussion.</li>
                <li><strong>Allowance Required:</strong> Payments are processed <strong>only from this portfolio</strong> once allowance is explicitly granted by Vaibhav Shaw.</li>
                <li><strong>Zero Predefined Lock-in:</strong> No blind or unverified payment is required. You can enter the exact agreed amount discussed.</li>
              </ul>
            </div>

            {/* Modal Tabs */}
            <div className={styles.modalNavTabs}>
              <button
                type="button"
                className={`${styles.modalTabBtn} ${modalTab === 'inquiry' ? styles.modalTabBtnActive : ''}`}
                onClick={() => setModalTab('inquiry')}
              >
                1. Send Inquiry First
              </button>
              <button
                type="button"
                className={`${styles.modalTabBtn} ${modalTab === 'payment' ? styles.modalTabBtnActive : ''}`}
                onClick={() => setModalTab('payment')}
              >
                2. Razorpay Gateway
              </button>
              <button
                type="button"
                className={`${styles.modalTabBtn} ${modalTab === 'qr' ? styles.modalTabBtnActive : ''}`}
                onClick={() => setModalTab('qr')}
              >
                3. Direct QR Code (Key-Locked)
              </button>
            </div>

            {/* TAB 1: INQUIRY FORM */}
            {modalTab === 'inquiry' && (
              <div className={styles.tabContent}>
                {inquirySubmitted ? (
                  <div className={styles.inquirySuccessBox}>
                    <span className={styles.successTick}>✓</span>
                    <h4>Inquiry Dispatched via Mail Client</h4>
                    <p>
                      Your email client has opened with your project scope. Vaibhav will review your requirements and reply with tailored pricing and allowance.
                    </p>
                    <button
                      type="button"
                      className={styles.secondaryTabSwitchBtn}
                      onClick={() => setModalTab('payment')}
                    >
                      Already Agreed on Pricing? Proceed to Payment ➔
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className={styles.inquiryForm}>
                    <div className={styles.formGridTwo}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Morgan"
                          className={styles.formInput}
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Your Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="alex@example.com"
                          className={styles.formInput}
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.formGridTwo}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Company / Org (Optional)</label>
                        <input
                          type="text"
                          placeholder="Company, Startup or Studio"
                          className={styles.formInput}
                          value={clientCompany}
                          onChange={(e) => setClientCompany(e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Estimated Budget / Target (Rs.)</label>
                        <input
                          type="number"
                          min="99"
                          step="1"
                          className={styles.formInput}
                          value={customAmount}
                          onChange={(e) => setCustomAmount(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Project Scope &amp; Deliverables *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Describe your vision, target timeline, key features, and any custom cards or modifications..."
                        className={styles.formTextarea}
                        value={clientBrief}
                        onChange={(e) => setClientBrief(e.target.value)}
                      />
                    </div>

                    <button type="submit" className={styles.modalSubmitBtn} data-cursor-hover>
                      <span>Dispatch Inquiry to Vaibhav ➔</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: RAZORPAY PAYMENT (CUSTOM / DYNAMIC AMOUNT) */}
            {modalTab === 'payment' && (
              <div className={styles.tabContent}>
                <div className={styles.paymentNoticeBox}>
                  <p>
                    💳 <strong>Custom Agreed Deposit:</strong> Enter the exact amount in INR discussed with Vaibhav. 
                    No predefined lock-in payment is enforced.
                  </p>
                </div>

                <div className={styles.paymentForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Agreed Amount (in INR ₹) *</label>
                    <div className={styles.amountInputWrap}>
                      <span className={styles.currencyPrefix}>₹</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className={styles.amountInput}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(Math.max(1, Number(e.target.value)))}
                      />
                    </div>
                    <span className={styles.inputHintText}>
                      Agreed deposit for: {selectedServiceTitle}
                    </span>
                  </div>

                  <div className={styles.formGridTwo}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Client Name</label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className={styles.formInput}
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Client Email</label>
                      <input
                        type="email"
                        placeholder="Your Email"
                        className={styles.formInput}
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.razorpayActionWrap}>
                    <RazorpayButton
                      amount={customAmount * 100} // Convert INR to paise
                      currency="INR"
                      name="Vaibhav Shaw · Collaboration"
                      description={`Agreed deposit: ${selectedServiceTitle}`}
                      buttonText={`Pay ₹${customAmount.toLocaleString('en-IN')} with Razorpay`}
                      prefill={{
                        name: clientName,
                        email: clientEmail,
                      }}
                      notes={{
                        service: selectedServiceTitle,
                        client_name: clientName,
                        client_email: clientEmail,
                        approved_amount: `Rs. ${customAmount}`,
                      }}
                      onSwitchToQr={() => setModalTab('qr')}
                    />
                  </div>

                  <div className={styles.qrFallbackRow}>
                    <span>Razorpay experiencing gateway delay or verification check?</span>
                    <button
                      type="button"
                      className={styles.qrInlineLink}
                      onClick={() => setModalTab('qr')}
                    >
                      Use Direct UPI QR Code (Key-Secured) ➔
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: KEY-SECRET PROTECTED QR CODE */}
            {modalTab === 'qr' && (
              <div className={styles.tabContent}>
                {!qrUnlocked ? (
                  <div className={styles.qrLockContainer}>
                    <div className={styles.qrLockShield}>
                      <span className={styles.lockIcon}>🔐</span>
                      <h4>Direct QR Code Payment is Protected</h4>
                      <p>
                        To ensure payments occur <strong>only after allowance is granted</strong>, direct QR Code payment requires the Owner Authorization Passcode provided by Vaibhav Shaw.
                      </p>
                    </div>

                    <form onSubmit={handleUnlockQr} className={styles.qrUnlockForm}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Owner Authorization Key-Secret *</label>
                        <div className={styles.keyInputRow}>
                          <input
                            type="text"
                            required
                            placeholder="Enter Key-Secret (e.g. VSNU2026)"
                            className={styles.formInput}
                            value={secretKeyInput}
                            onChange={(e) => {
                              setSecretKeyInput(e.target.value);
                              setQrKeyError(null);
                            }}
                          />
                          <button type="submit" className={styles.unlockBtn}>
                            Unlock QR ➔
                          </button>
                        </div>
                        {qrKeyError && <span className={styles.keyErrorText}>{qrKeyError}</span>}
                      </div>
                    </form>

                    <div className={styles.requestKeyArea}>
                      <span>Don&apos;t have the authorization key yet?</span>
                      <a
                        href={`mailto:${profileEmail}?subject=Request%20QR%20Code%20Allowance%20Key%20%E2%80%94%20${encodeURIComponent(selectedServiceTitle)}&body=Hi%20Vaibhav,%20I%20would%20like%20to%20request%20the%20Owner%20Allowance%20Key%20to%20complete%20my%20deposit%20payment%20for%20${encodeURIComponent(selectedServiceTitle)}.%20Agreed%20amount:%20Rs.%20${customAmount}.`}
                        className={styles.requestKeyBtn}
                        data-cursor-hover
                      >
                        Request Key from Vaibhav via Mail ✉
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className={styles.qrRevealedContainer}>
                    <div className={styles.qrSuccessBanner}>
                      <span>✓ Key-Secret Verified: Owner Allowance Granted</span>
                    </div>

                    <div className={styles.qrCardBox}>
                      <div className={styles.qrImageWrap}>
                        <Image
                          src="/images/QrCode.jpeg"
                          alt="Official UPI QR Code — Vaibhav Shaw"
                          width={260}
                          height={260}
                          className={styles.qrImg}
                          priority
                        />
                      </div>

                      <div className={styles.qrMetaDetails}>
                        <span className={styles.upiLabel}>Official UPI Virtual Address</span>
                        <div className={styles.upiCopyBox}>
                          <code className={styles.upiCode}>vaibhavsnu2025@okaxis</code>
                          <button
                            type="button"
                            className={styles.copyBtn}
                            onClick={copyUpiId}
                          >
                            {copiedUpi ? 'Copied! ✓' : 'Copy UPI'}
                          </button>
                        </div>

                        <div className={styles.qrDepositRow}>
                          <span>Target Deposit:</span>
                          <strong>₹{customAmount.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    </div>

                    <div className={styles.qrInstructions}>
                      <ol>
                        <li>Scan with Google Pay, PhonePe, Paytm, or any BHIM UPI application.</li>
                        <li>Enter the agreed amount (₹{customAmount.toLocaleString('en-IN')}) and mention your project name in the UPI notes.</li>
                        <li>After transferring, dispatch your transaction reference or screenshot to <strong>{profileEmail}</strong>.</li>
                      </ol>
                    </div>

                    <button
                      type="button"
                      className={styles.lockAgainBtn}
                      onClick={() => setQrUnlocked(false)}
                    >
                      🔒 Lock QR Code
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

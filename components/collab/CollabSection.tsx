'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import RazorpayButton from '@/components/ui/RazorpayButton';
import styles from './CollabSection.module.css';

export type ServiceFilterGroup = 'all' | 'web-desktop' | 'design-video' | 'ai-automation';

interface MenuItem {
  name: string;
  price: string;
  priceNumeric: number;
  note?: string;
  tag?: string;
}

interface MenuCategory {
  id: string;
  indexNumber: string;
  filterGroup: 'web-desktop' | 'design-video' | 'ai-automation';
  title: string;
  subtitle: string;
  badge: string;
  isPopular?: boolean;
  accentColor: string;
  items: MenuItem[];
  deliverables: string[];
}

const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'graphic-designing',
    indexNumber: '01',
    filterGroup: 'design-video',
    title: 'Graphic Designing',
    subtitle: 'Canva Pro & Figma Creative Direction',
    badge: 'Turnaround: 24 - 48h',
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
        name: 'Presentation: Academic (Research & Seminars)',
        price: 'Rs. 999',
        priceNumeric: 999,
        note: 'For Academic',
      },
      {
        name: 'Presentation: Business (Investor Pitch Decks)',
        price: 'Rs. 2,999',
        priceNumeric: 2999,
        note: 'For Business',
        tag: 'Investor Ready',
      },
    ],
    deliverables: [
      'Editable Canva Pro & Figma source files',
      'High-resolution PNG, JPG, PDF & SVG vector formats',
      'Modern typography, custom color palette & branding rules',
      'Rapid revisions until scope satisfaction',
    ],
  },
  {
    id: 'website-development',
    indexNumber: '02',
    filterGroup: 'web-desktop',
    title: 'Website Development',
    subtitle: 'Full-Stack Web Engineering & Conversion UI',
    badge: 'High Demand · Signature',
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
    id: 'desktop-applications',
    indexNumber: '03',
    filterGroup: 'web-desktop',
    title: 'Desktop Level Applications',
    subtitle: 'Cross-Platform Native Apps with Electron & AI Vibe Coding',
    badge: 'Core: Electron.js',
    accentColor: '#38bdf8',
    items: [
      {
        name: 'Native Electron Desktop App [Mac, Windows, Linux]',
        price: 'Based on App Scope',
        priceNumeric: 0,
        tag: 'Electron Core',
        note: 'Core Electron framework, local SQLite/JSON storage, native OS system tray & notifications',
      },
      {
        name: 'AI Vibe-Coded Utility & Productivity Tool',
        price: 'Based on Product Scope',
        priceNumeric: 0,
        tag: 'AI Vibe Coding',
        note: 'Rapidly iterated native software built with modern AI pair programming & TS runtime',
      },
      {
        name: 'Offline-First Dashboard & Client System',
        price: 'Custom Scope',
        priceNumeric: 0,
        note: 'Local hardware hooks, file system persistence, zero cloud downtime',
      },
    ],
    deliverables: [
      'Multi-platform binary installers (.exe, .dmg, .deb / AppImage)',
      'Hardened Electron IPC architecture & sandboxed renderer security',
      'Native OS menus, tray icons, global keyboard shortcuts & auto-update setup',
      'Full source repository delivery with setup runbook and build scripts',
    ],
  },
  {
    id: 'saas-products',
    indexNumber: '04',
    filterGroup: 'web-desktop',
    title: 'SaaS Products',
    subtitle: 'Browser Extensions & Custom Backend Software',
    badge: 'Engineered Solutions',
    accentColor: '#818cf8',
    items: [
      {
        name: 'Chrome Extensions',
        price: 'Based on the Extensions',
        priceNumeric: 0,
        tag: 'Manifest V3',
        note: 'Custom scrapers, productivity shortcuts, DOM injection & API integrations',
      },
      {
        name: 'Python Based Products',
        price: 'Based on the Products',
        priceNumeric: 0,
        tag: 'Python Core',
        note: 'AI/ML pipelines, automated backend bots, microservices & data utilities',
      },
    ],
    deliverables: [
      'Clean, documented, scalable & unit-tested codebase',
      'Chrome Web Store manifest packaging & deployment walkthrough',
      'API webhooks, cloud database sync & credential encryption',
      'Direct developer consultation & architecture walkthrough',
    ],
  },
  {
    id: 'video-motion',
    indexNumber: '05',
    filterGroup: 'design-video',
    title: 'Video and Motion Graphics',
    subtitle: 'Dynamic Storytelling, Kinetic Typography & Promo Edits',
    badge: 'Visual Craft',
    accentColor: '#ec4899',
    items: [
      {
        name: 'Social Reels, Shorts & Promo Cut [Up to 60s]',
        price: 'Rs. 799',
        priceNumeric: 799,
        tag: 'High Retention',
        note: 'Kinetic captions, sound design, hook retention editing & 9:16 vertical delivery',
      },
      {
        name: 'Brand Explainer & Product Demo Video',
        price: 'Rs. 2,499',
        priceNumeric: 2499,
        tag: '2D & UI Motion',
        note: 'Motion graphics, 2D vector animations, screen recordings & UI showcases',
      },
      {
        name: 'Motion Logo & Title Intro / Outro',
        price: 'Rs. 599',
        priceNumeric: 599,
        note: 'Seamless custom animated logo stings for YouTube, webinars & presentations',
      },
      {
        name: 'Kinetic Presentation Video',
        price: 'Rs. 1,499',
        priceNumeric: 1499,
        note: 'Animated slide decks with pacing, narrative sync & dynamic cues',
      },
    ],
    deliverables: [
      'Crisp 4K / 1080p 60fps renders tailored for Instagram, YouTube & LinkedIn',
      'Layered sound design with licensed royalty-free audio tracks',
      'Full project files and exported assets upon request',
      '2 rounds of timing adjustments and review cycles',
    ],
  },
  {
    id: 'ai-automation',
    indexNumber: '06',
    filterGroup: 'ai-automation',
    title: 'AI & Automation',
    subtitle: 'Autonomous Agents, n8n Pipelines & Custom LLM Integrations',
    badge: 'Force Multipliers',
    accentColor: '#10b981',
    items: [
      {
        name: 'Automated Workflow Pipeline [n8n / Zapier / Make]',
        price: 'Rs. 1,999',
        priceNumeric: 1999,
        tag: 'Zero-Maintenance',
        note: 'Multi-app triggers, webhook dispatch, Google Sheets / Airtable / CRM sync',
      },
      {
        name: 'Autonomous AI Agent & Custom LLM Assistant',
        price: 'Based on Scope',
        priceNumeric: 0,
        tag: 'Gemini / Claude',
        note: 'Function calling, custom knowledge base RAG, and Discord/Telegram/Slack bots',
      },
      {
        name: 'Smart Web Scraping & Data Extraction Bot',
        price: 'Rs. 1,499',
        priceNumeric: 1499,
        note: 'Automated headless browser scrapers, scheduled cron jobs & clean data export',
      },
      {
        name: 'Custom API Integration & Webhook Bridge',
        price: 'Based on Scope',
        priceNumeric: 0,
        note: 'Secure payment gateway webhooks, authentication & internal notifications',
      },
    ],
    deliverables: [
      'Live automated workflow setup with testing and error handling',
      'Immediate incident alerts via Telegram, Discord, or Email',
      'Recorded screen walkthrough explaining how the automation runs',
      'Complete configuration export for seamless self-hosting',
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

const FILTER_TABS: { id: ServiceFilterGroup; label: string; count: number }[] = [
  { id: 'all', label: 'All Offerings', count: 6 },
  { id: 'web-desktop', label: 'Web & Desktop', count: 3 },
  { id: 'design-video', label: 'Design & Motion', count: 2 },
  { id: 'ai-automation', label: 'AI & Automation', count: 1 },
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
  // Filter state
  const [activeFilter, setActiveFilter] = useState<ServiceFilterGroup>('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'inquiry' | 'payment' | 'qr'>('payment');
  const [selectedServiceTitle, setSelectedServiceTitle] = useState<string>('Graphic Designing');
  const [customAmount, setCustomAmount] = useState<number>(1);

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

  const displayedCategories = activeFilter === 'all'
    ? MENU_CATEGORIES
    : MENU_CATEGORIES.filter((c) => c.filterGroup === activeFilter);

  const openServiceModal = (category: MenuCategory, item?: MenuItem) => {
    const title = item ? `${category.title}: ${item.name}` : category.title;
    setSelectedServiceTitle(title);
    if (item && item.priceNumeric > 0) {
      setCustomAmount(item.priceNumeric);
    } else {
      setCustomAmount(1);
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
            <span>Available for Selected Projects &amp; Collaborations</span>
          </div>

          <h2 className={styles.mainTitle}>
            SERVICES <span className={styles.titleWhiteHighlight}>MENU CARD</span> &amp; SHOWCASE
          </h2>

          <p className={styles.subDescription}>
            HANDCRAFTED DIGITAL EXPERIENCES · TRANSPARENT BASELINES · CUSTOM ARCHITECTURE
          </p>

          {/* ATTENTIVE & APPROACHING NOTICE BANNER */}
          <div className={styles.officialNoticeBanner}>
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
              Send Inquiry First →
            </button>
          </div>

          {/* Filter Tabs Bar */}
          <div className={styles.filterTabBar} role="tablist" aria-label="Service category filters">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.filterPillBtn} ${isActive ? styles.filterPillActive : ''}`}
                  onClick={() => setActiveFilter(tab.id)}
                >
                  <span>{tab.label}</span>
                  <span className={styles.filterBadgeCount}>({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6-Category Creative Menu Showcase Grid */}
        <div className={styles.menuGrid}>
          {displayedCategories.map((category) => (
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
                <div className={styles.cardIndexRow}>
                  <span className={styles.cardIndexNumber}>{category.indexNumber} //</span>
                  <span className={styles.cardPillarTag}>{category.badge}</span>
                </div>
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
                    title={`Click to discuss: ${item.name}`}
                  >
                    <div className={styles.itemLeft}>
                      <div className={styles.itemNameWrap}>
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
                <h4 className={styles.deliverablesTitle}>Deliverables Included:</h4>
                <ul className={styles.deliverablesList}>
                  {category.deliverables.map((deliv, dIdx) => (
                    <li key={dIdx} className={styles.deliverableItem}>
                      <span className={styles.checkMarker}>—</span>
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Bottom CTA */}
              <div className={styles.cardFooterActions}>
                <button
                  type="button"
                  className={category.isPopular ? styles.primaryActionBtnGold : styles.primaryActionBtn}
                  onClick={() => openServiceModal(category)}
                  data-cursor-hover
                >
                  <span>Book Consultation &amp; Quote</span>
                  <span className={styles.btnArrow}>→</span>
                </button>
                <span className={styles.cardDisclaimer}>
                  Final pricing &amp; roadmap confirmed upon mutual agreement
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            RECRUITER / FREELANCE BANNER (1:1 Match with Reference Image 4)
            ════════════════════════════════════════════════════════════════════════ */}
        <div className={styles.recruiterBanner}>
          <div className={styles.recruiterLeft}>
            <div className={styles.recruiterEyebrow}>SERVICES / FREELANCE / PROJECT WORK —</div>
            <h3 className={styles.recruiterHeading}>
              Hiring for Engineering, Design or AI Roles?
            </h3>
            <p className={styles.recruiterDesc}>
              I&apos;m available for freelance project work across development, design, AI/ML and more — from quick tasks to full-featured solutions.
            </p>
            <div className={styles.recruiterPills}>
              <span className={styles.recruiterPillItem}>&lt;/&gt; Web / App Development</span>
              <span className={styles.recruiterPillItem}>UI/UX &amp; Graphic Design</span>
              <span className={styles.recruiterPillItem}>AI &amp; ML Projects</span>
              <span className={styles.recruiterPillItem}>MVPs, Prototypes &amp; More</span>
            </div>
          </div>
          <div className={styles.recruiterActions}>
            <button
              type="button"
              className={styles.recruiterPrimaryPillBtn}
              onClick={() => {
                setSelectedServiceTitle('Freelance Project Work');
                setModalTab('inquiry');
                setModalOpen(true);
              }}
              data-cursor-hover
            >
              <span>Only Remote Work as Freelancing</span>
              <span>→</span>
            </button>
            <button
              type="button"
              className={styles.recruiterSecondaryOutlineBtn}
              onClick={() => {
                setSelectedServiceTitle('Project Inquiry');
                setModalTab('inquiry');
                setModalOpen(true);
              }}
              data-cursor-hover
            >
              <span>Send a Project Inquiry</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════════
          MULTI-TAB POPUP WINDOW (1:1 Match with Reference Image 3)
          ════════════════════════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Project Consultation and Booking Protocol"
        >
          <div className={styles.modalBox}>
            {/* PINNED HEADER: Stays fixed at top on all screens */}
            <div className={styles.modalPinnedHeader}>
              <div className={styles.modalHeaderTop}>
                <div className={styles.modalTitleBlock}>
                  <span className={styles.modalRefNumber}>PROTOCOL / BOOKING &amp; CONSULTATION —</span>
                  <h3 className={styles.modalTitle}>Project Consultation &amp; Allowance</h3>
                  <div className={styles.scopeRow}>
                    <span className={styles.scopeLabel}>Selected Scope:</span>
                    <span className={styles.scopePill}>
                      <span className={styles.scopeIcon}>✦</span>
                      <span>{selectedServiceTitle}</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setModalOpen(false)}
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>

              {/* 2-Column Notice Box Matching Reference Image 3 */}
              <div className={styles.modalNoticeTwoCol}>
                <div className={styles.noticeColLeft}>
                  <div className={styles.noticeLeftTitle}>Direct Collaboration</div>
                  <div className={styles.noticeLeftSub}>Handcrafted by Vaibhav Shaw</div>
                </div>
                <div className={styles.noticeColRight}>
                  Every project is scoped, coded, and shipped directly by me. Submit your inquiry first to confirm deliverables and agreed pricing. Payments are accepted only after mutual agreement.
                </div>
              </div>

              {/* Stepper Navigation Matching Reference Image 3 */}
              <div className={styles.modalStepperRow} role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={modalTab === 'inquiry'}
                  className={`${styles.stepItem} ${modalTab === 'inquiry' ? styles.stepItemActive : ''}`}
                  onClick={() => setModalTab('inquiry')}
                >
                  <span className={styles.stepNum}>1</span>
                  <span className={styles.stepText}>Send Inquiry</span>
                  <span className={styles.stepBadgeReq}>Required First</span>
                </button>

                <div className={styles.stepDividerLine} />

                <button
                  type="button"
                  role="tab"
                  aria-selected={modalTab === 'payment'}
                  className={`${styles.stepItem} ${modalTab === 'payment' ? styles.stepItemActive : ''}`}
                  onClick={() => setModalTab('payment')}
                >
                  <span className={styles.stepNum}>2</span>
                  <span className={styles.stepText}>Razorpay Deposit</span>
                  <span className={styles.stepBadgeOpt}>Agreed Amount</span>
                </button>

                <div className={styles.stepDividerLine} />

                <button
                  type="button"
                  role="tab"
                  aria-selected={modalTab === 'qr'}
                  className={`${styles.stepItem} ${modalTab === 'qr' ? styles.stepItemActive : ''}`}
                  onClick={() => setModalTab('qr')}
                >
                  <span className={styles.stepNum}>3</span>
                  <span className={styles.stepText}>UPI QR Code</span>
                </button>
              </div>
            </div>

            {/* SCROLLABLE BODY */}
            <div className={styles.modalScrollBody}>
              {/* TAB 1: SEND INQUIRY FIRST */}
              {modalTab === 'inquiry' && (
                <div className={styles.tabContent}>
                  {inquirySubmitted ? (
                    <div className={styles.inquirySuccessBox}>
                      <span className={styles.successIcon}>✓</span>
                      <h4>Inquiry Dispatched to Vaibhav Shaw</h4>
                      <p>
                        Your default email client opened with your project brief. 
                        Once I review your requirements, we will confirm the final scope and provide your payment allowance code.
                      </p>
                      <button
                        type="button"
                        className={styles.proceedPayBtn}
                        onClick={() => setModalTab('payment')}
                      >
                        Already Agreed on Pricing? Proceed to Payment →
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className={styles.inquiryForm}>
                      <div className={styles.formGridTwo}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Client Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Your Name"
                            className={styles.formInput}
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Client Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="Your Email"
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
                            min="1"
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
                          placeholder="Describe your project vision, target timeline, key features, and any custom modifications..."
                          className={styles.formTextarea}
                          value={clientBrief}
                          onChange={(e) => setClientBrief(e.target.value)}
                        />
                      </div>

                      <button type="submit" className={styles.modalSubmitBtn} data-cursor-hover>
                        <span>Dispatch Inquiry to Vaibhav →</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: RAZORPAY PAYMENT (1:1 Reference Image 3) */}
              {modalTab === 'payment' && (
                <div className={styles.tabContent}>
                  {/* Info Callout Bar */}
                  <div className={styles.customAgreedBar}>
                    <span className={styles.infoIcon}>ⓘ</span>
                    <p>
                      <strong>Custom Agreed Deposit:</strong> Enter the exact amount in INR discussed with Vaibhav. No predefined locked payment is enforced.
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
                  </div>
                </div>
              )}

              {/* TAB 3: KEY-SECRET PROTECTED QR CODE (Clean, No e.g. placeholder) */}
              {modalTab === 'qr' && (
                <div className={styles.tabContent}>
                  {!qrUnlocked ? (
                    <div className={styles.qrLockContainer}>
                      <div className={styles.qrLockShield}>
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
                              placeholder="Enter Key-Secret"
                              className={styles.formInput}
                              value={secretKeyInput}
                              onChange={(e) => {
                                setSecretKeyInput(e.target.value);
                                setQrKeyError(null);
                              }}
                            />
                            <button type="submit" className={styles.unlockBtn}>
                              Unlock QR →
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
                            width={220}
                            height={220}
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
                        Lock QR Code
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import type { CollabService } from '@/types';
import styles from './CollabSection.module.css';

interface CollabSectionProps {
  services?: CollabService[];
  profileEmail?: string;
  resumeUrl?: string;
}

interface TierDefinition {
  tierName: 'SILVER' | 'GOLD' | 'PLATINUM';
  tierColor: string;
  isPopular?: boolean;
  audienceTagline: string;
  priceInr: string;
  priceUsd: string;
}

const DEFAULT_SERVICES: CollabService[] = [
  {
    id: 'collab-graphic-design',
    title: 'Graphic Designing',
    category: 'graphic-design',
    tagline: 'High-impact visual brand assets, pitch decks & marketing visuals via Canva & Figma',
    price: '₹5,000',
    timeline: '2 - 4 Days',
    featured: false,
    badge: 'Fast Turnaround',
    description: 'Compelling presentation decks, brand identities, and social media kits designed to captivate audiences and investors.',
    deliverables: [
      'Perfect For Solo Creators & Startups',
      'Investor pitch decks & keynote presentation slides',
      'Social media marketing kits (LinkedIn, X, Instagram)',
      'Brand identity kit (Color scheme, typography & assets)',
      'Fully editable Canva Pro & Figma source files',
    ],
    techStack: ['Canva Pro', 'Figma', 'Photoshop', 'Brand Identity', 'Visual Direction'],
  },
  {
    id: 'collab-web-dev',
    title: 'Web Development',
    category: 'web-dev',
    tagline: 'Modern, high-performance web applications & responsive landing pages',
    price: '₹15,000',
    timeline: '4 - 7 Days',
    featured: true,
    badge: 'High Demand',
    description: 'Custom full-stack web applications and interactive websites built for conversion, speed, and sleek modern aesthetics.',
    deliverables: [
      'Collaborate & Grow Together with Scalable Architecture',
      'Next.js 14, React & TypeScript full-stack integration',
      'Mobile-first responsive UI & fluid layout',
      'SEO optimization & 95+ Google Lighthouse speed score',
      'Fast Answers, Fast Progress with Direct Deployment',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Vercel'],
  },
  {
    id: 'collab-ecommerce',
    title: 'E-Commerce Website',
    category: 'ecommerce',
    tagline: 'Full-cycle digital stores with dynamic catalogs, carts & secure checkout',
    price: '₹45,000',
    timeline: '7 - 12 Days',
    featured: true,
    badge: 'Turnkey Solution',
    description: 'End-to-end modern e-commerce storefronts engineered with smooth checkout flows, payment processing, and AI integrations.',
    deliverables: [
      'For Growing Brands & Organizations',
      'Dynamic product showcase with smart filters & search',
      'Stripe & Razorpay frictionless payment gateway setup',
      'AI customer support & smart product recommendation readiness',
      'Deep Integrations For Your Workflow & Inventory',
    ],
    techStack: ['Next.js', 'Stripe', 'Razorpay', 'Firebase', 'Tailwind CSS', 'REST API'],
  },
];

const TIER_MAPPINGS: Record<string, TierDefinition> = {
  'collab-graphic-design': {
    tierName: 'SILVER',
    tierColor: '#e2e8f0',
    audienceTagline: 'Perfect For Personal Projects And Freelancers',
    priceInr: '₹5,000',
    priceUsd: '$59',
  },
  'graphic-design': {
    tierName: 'SILVER',
    tierColor: '#e2e8f0',
    audienceTagline: 'Perfect For Personal Projects And Freelancers',
    priceInr: '₹5,000',
    priceUsd: '$59',
  },
  'collab-web-dev': {
    tierName: 'GOLD',
    tierColor: '#f5a623',
    isPopular: true,
    audienceTagline: 'Power And Flexibility For Growing Teams',
    priceInr: '₹15,000',
    priceUsd: '$179',
  },
  'web-dev': {
    tierName: 'GOLD',
    tierColor: '#f5a623',
    isPopular: true,
    audienceTagline: 'Power And Flexibility For Growing Teams',
    priceInr: '₹15,000',
    priceUsd: '$179',
  },
  'collab-ecommerce': {
    tierName: 'PLATINUM',
    tierColor: '#e0e7ff',
    audienceTagline: 'Tailored Solutions For Enterprise Success',
    priceInr: '₹45,000',
    priceUsd: '$539',
  },
  'ecommerce': {
    tierName: 'PLATINUM',
    tierColor: '#e0e7ff',
    audienceTagline: 'Tailored Solutions For Enterprise Success',
    priceInr: '₹45,000',
    priceUsd: '$539',
  },
};

// Organic Ethereal Wave Ribbon SVG matching the reference image header artwork
function WaveRibbon({ color }: { color: string }) {
  const gradId = `waveGrad-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg
      className={styles.cardWaveSvg}
      viewBox="0 0 420 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="25%" stopColor={color} stopOpacity="0.55" />
          <stop offset="70%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M-20 68 C75 118, 165 22, 255 86 C325 130, 385 52, 440 68"
        stroke={`url(#${gradId})`}
        strokeWidth="1.25"
      />
      <path
        d="M-20 80 C85 130, 175 34, 265 98 C335 142, 395 64, 440 80"
        stroke={`url(#${gradId})`}
        strokeWidth="1.0"
        strokeOpacity="0.8"
      />
      <path
        d="M-20 92 C95 142, 185 46, 275 110 C345 154, 405 76, 440 92"
        stroke={`url(#${gradId})`}
        strokeWidth="0.85"
        strokeOpacity="0.6"
      />
      <path
        d="M-20 56 C65 106, 155 10, 245 74 C315 118, 375 40, 440 56"
        stroke={`url(#${gradId})`}
        strokeWidth="0.9"
        strokeOpacity="0.7"
      />
      <path
        d="M-20 104 C105 154, 195 58, 285 122 C355 166, 415 88, 440 104"
        stroke={`url(#${gradId})`}
        strokeWidth="0.7"
        strokeOpacity="0.4"
      />
    </svg>
  );
}

export default function CollabSection({
  services = DEFAULT_SERVICES,
  profileEmail = 'vaibhavsnu2025@gmail.com',
  resumeUrl = '/resume1.pdf',
}: CollabSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [selectedService, setSelectedService] = useState<CollabService | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientBrief, setClientBrief] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const displayServices = services && services.length > 0 ? services : DEFAULT_SERVICES;

  // Ensure consistent 3-tier ordering: SILVER (Graphic Design) -> GOLD (Web Dev) -> PLATINUM (E-Commerce)
  const sortedServices = [...displayServices].sort((a, b) => {
    const order: Record<string, number> = {
      'collab-graphic-design': 1,
      'graphic-design': 1,
      'collab-web-dev': 2,
      'web-dev': 2,
      'collab-ecommerce': 3,
      'ecommerce': 3,
    };
    return (order[a.id] || order[a.category] || 99) - (order[b.id] || order[b.category] || 99);
  });

  const filteredServices =
    activeCategory === 'all'
      ? sortedServices
      : sortedServices.filter((s) => s.category === activeCategory);

  const openInquiry = (service: CollabService) => {
    setSelectedService(service);
    setSubmitted(false);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceName = selectedService?.title || 'Collaboration';
    const subject = encodeURIComponent(`Project Inquiry: ${serviceName} — from ${clientName}`);
    const body = encodeURIComponent(
      `Hello Vaibhav,\n\nI would like to collaborate on ${serviceName}.\n\nName: ${clientName}\nEmail: ${clientEmail}\nCompany / Organization: ${clientCompany || 'N/A'}\n\nProject Scope & Details:\n${clientBrief}\n\nLooking forward to hearing from you.`
    );
    window.location.href = `mailto:${profileEmail}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => {
      setSelectedService(null);
      setSubmitted(false);
    }, 2000);
  };

  // Convert or format price cleanly: Silver = 5000, Gold = 15000, Platinum = 45000
  const getFormattedPrice = (service: CollabService) => {
    const meta = TIER_MAPPINGS[service.id] || TIER_MAPPINGS[service.category];
    if (meta) {
      return {
        main: currency === 'INR' ? meta.priceInr : meta.priceUsd,
        period: 'Per Project',
      };
    }

    // Fallback for custom admin items
    if (currency === 'INR') {
      if (service.category === 'graphic-design') return { main: '₹5,000', period: 'Per Project' };
      if (service.category === 'web-dev') return { main: '₹15,000', period: 'Per Project' };
      if (service.category === 'ecommerce') return { main: '₹45,000', period: 'Per Project' };
      return { main: service.price || '₹10,000', period: 'Per Project' };
    } else {
      if (service.category === 'graphic-design') return { main: '$59', period: 'Per Project' };
      if (service.category === 'web-dev') return { main: '$179', period: 'Per Project' };
      if (service.category === 'ecommerce') return { main: '$539', period: 'Per Project' };
      return { main: '$99', period: 'Per Project' };
    }
  };

  return (
    <section id="collab" className={styles.collabSectionWrapper} aria-label="Simple Pricing & Powerful Collaboration">
      <div className={styles.collabInnerContainer}>
        {/* Background Lighting Streak & Ambience (Matching Inspiration Image) */}
        <div className={styles.lightBeam} aria-hidden="true" />
        <div className={styles.goldAmbientGlow} aria-hidden="true" />

        {/* Top Header matching reference image typography */}
        <div className={styles.sectionHeader}>
          <div className={styles.topStatusBadge}>
            <span className={styles.pulseDot} />
            <span>Available for Q4 2026 Collaboration</span>
          </div>

          <h2 className={styles.mainTitle}>
            SIMPLE PRICING. POWERFUL <span className={styles.titleGoldHighlight}>FEATURES.</span>
          </h2>

          <p className={styles.subDescription}>
            FLEXIBLE OPTIONS BUILT TO GROW WITH YOUR NEEDS.
          </p>

          {/* Currency Switcher & Category Filter Bar */}
          <div className={styles.controlsWrap}>
            <div className={styles.currencyTogglePill}>
              <button
                type="button"
                className={`${styles.currencyBtn} ${currency === 'INR' ? styles.currencyBtnActive : ''}`}
                onClick={() => setCurrency('INR')}
                data-cursor-hover
                aria-label="Switch to INR pricing"
              >
                ₹ INR
              </button>
              <button
                type="button"
                className={`${styles.currencyBtn} ${currency === 'USD' ? styles.currencyBtnActive : ''}`}
                onClick={() => setCurrency('USD')}
                data-cursor-hover
                aria-label="Switch to USD pricing"
              >
                $ USD
              </button>
            </div>

            <div className={styles.filterPillsGroup}>
              <button
                type="button"
                className={`${styles.filterPill} ${activeCategory === 'all' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveCategory('all')}
                data-cursor-hover
              >
                All Tiers
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${activeCategory === 'graphic-design' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveCategory('graphic-design')}
                data-cursor-hover
              >
                Silver · Graphic Design
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${activeCategory === 'web-dev' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveCategory('web-dev')}
                data-cursor-hover
              >
                Gold · Web Dev
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${activeCategory === 'ecommerce' ? styles.filterPillActive : ''}`}
                onClick={() => setActiveCategory('ecommerce')}
                data-cursor-hover
              >
                Platinum · E-Commerce
              </button>
            </div>
          </div>
        </div>

        {/* 3-Tier Luxury Pricing Cards Grid */}
        <div className={styles.pricingGrid}>
          {filteredServices.map((service) => {
            const tierMeta =
              TIER_MAPPINGS[service.id] ||
              TIER_MAPPINGS[service.category] || {
                tierName: service.featured ? 'GOLD' : 'SILVER',
                tierColor: service.featured ? '#f5a623' : '#e2e8f0',
                isPopular: service.featured,
                audienceTagline: service.tagline,
                priceInr: '₹15,000',
                priceUsd: '$179',
              };

            const isGold = tierMeta.tierName === 'GOLD';
            const isPlatinum = tierMeta.tierName === 'PLATINUM';
            const isSilver = tierMeta.tierName === 'SILVER';
            const priceObj = getFormattedPrice(service);

            return (
              <article
                key={service.id}
                className={`
                  ${styles.pricingCard}
                  ${isGold ? styles.goldCard : ''}
                  ${isPlatinum ? styles.platinumCard : ''}
                  ${isSilver ? styles.silverCard : ''}
                `}
              >
                {/* "MOST POPULAR" Pill Badge pinned to top border for Gold (Fully Visible with overflow visible) */}
                {isGold && (
                  <div className={styles.popularBadgeWrap}>
                    <span className={styles.popularBadgeText}>MOST POPULAR</span>
                  </div>
                )}

                {/* Header Wave Ribbon Vector Container */}
                <div className={styles.waveContainer}>
                  <WaveRibbon color={tierMeta.tierColor} />
                </div>

                {/* Header Content */}
                <div className={styles.cardHeaderArea}>
                  {/* Tier Title (SILVER, GOLD, PLATINUM) */}
                  <h3
                    className={`
                      ${styles.tierHeading}
                      ${isGold ? styles.tierHeadingGold : ''}
                      ${isPlatinum ? styles.tierHeadingPlatinum : ''}
                      ${isSilver ? styles.tierHeadingSilver : ''}
                    `}
                  >
                    {tierMeta.tierName}
                  </h3>

                  {/* Specific Service Subtitle */}
                  <p className={styles.serviceNameSubtitle}>{service.title}</p>

                  {/* Audience Tagline */}
                  <p className={styles.cardAudienceTagline}>
                    {tierMeta.audienceTagline || service.tagline}
                  </p>
                </div>

                {/* Big Bold Typography Pricing */}
                <div className={styles.priceRow}>
                  <span className={`${styles.priceFigure} ${isGold ? styles.priceFigureGold : ''}`}>
                    {priceObj.main}
                  </span>
                  <span className={styles.pricePeriod}>{priceObj.period}</span>
                </div>

                {/* Delivery Turnaround Tag */}
                <div className={styles.turnaroundTag}>
                  <span>⚡ Turnaround: {service.timeline}</span>
                </div>

                {/* Deliverables Checklist with Circular Icons */}
                <ul className={styles.featuresList}>
                  {service.deliverables.map((item, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <span className={`${styles.checkCircle} ${isGold ? styles.checkCircleGold : ''}`}>
                        ✓
                      </span>
                      <span className={styles.featureText}>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Stack Minimal Pills */}
                <div className={styles.techStackWrap}>
                  {service.techStack.map((tech, idx) => (
                    <span key={idx} className={styles.techTag}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Bottom Action Button (Gold Gradient for Gold, Dark Glass for Silver & Platinum) */}
                <div className={styles.actionBtnWrap}>
                  <button
                    type="button"
                    className={`
                      ${styles.ctaButton}
                      ${isGold ? styles.ctaButtonGold : styles.ctaButtonStandard}
                    `}
                    onClick={() => openInquiry(service)}
                    data-cursor-hover
                  >
                    Get Started
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Recruiter & Executive Fast-Track Banner */}
        <div className={styles.recruiterBanner}>
          <div className={styles.recruiterContent}>
            <div className={styles.recruiterEyebrow}>FAST-TRACK RECRUITMENT</div>
            <h3 className={styles.recruiterHeading}>Recruiter &amp; Engineering Team Connect</h3>
            <p className={styles.recruiterDesc}>
              Looking to recruit for AI/ML engineering, high-performance web systems, or student internships? I maintain top honors (9.38 CGPA) at Sister Nivedita University, combining deep technical curiosity with rapid execution and hackathon-tested problem solving.
            </p>
            <div className={styles.recruiterPills}>
              <span className={styles.recruiterPillItem}>📍 Kolkata / Hybrid / Remote</span>
              <span className={styles.recruiterPillItem}>🎓 B.Tech CSE (AIML Track)</span>
              <span className={styles.recruiterPillItem}>⚡ Immediate Availability for 2026</span>
            </div>
          </div>

          <div className={styles.recruiterActions}>
            <a
              href={`mailto:${profileEmail}?subject=Recruiter%20Inquiry%20%E2%80%94%20Vaibhav%20Shaw%20Opportunities`}
              className={styles.recruiterPrimaryBtn}
              data-cursor-hover
            >
              <span>✉ Direct Recruiter Connect</span>
            </a>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.recruiterSecondaryBtn}
              data-cursor-hover
            >
              <span>📄 Download Official Resume</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Modal Form for Selected Service */}
      {selectedService && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedService(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setSelectedService(null)}
              aria-label="Close"
            >
              ×
            </button>

            <h3 className={styles.modalTitle}>Inquire: {selectedService.title}</h3>
            <p className={styles.modalSubtitle}>
              Scope: {getFormattedPrice(selectedService).main} · Turnaround: {selectedService.timeline}
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <p style={{ color: '#10b981', fontWeight: 700, fontSize: '1.15rem' }}>
                  ✓ Opening direct mail client with pre-filled scope...
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Your Name / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan · Studio Venture"
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
                    placeholder="alex@company.com"
                    className={styles.formInput}
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Company / Website URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://company.com"
                    className={styles.formInput}
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Project Brief &amp; Requirements *</label>
                  <textarea
                    required
                    placeholder="Tell me about what you need built, target timeline, and any specific preferences..."
                    className={styles.formTextarea}
                    value={clientBrief}
                    onChange={(e) => setClientBrief(e.target.value)}
                  />
                </div>

                <button type="submit" className={styles.modalSubmitBtn} data-cursor-hover>
                  Dispatch Inquiry via Direct Mail ➔
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

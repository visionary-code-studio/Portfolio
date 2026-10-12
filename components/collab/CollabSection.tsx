'use client';

import React, { useState } from 'react';
import type { CollabService } from '@/types';
import styles from './CollabSection.module.css';

interface CollabSectionProps {
  services?: CollabService[];
  profileEmail?: string;
  resumeUrl?: string;
}

const DEFAULT_SERVICES: CollabService[] = [
  {
    id: 'collab-web-dev',
    title: 'Web Development',
    category: 'web-dev',
    tagline: 'Modern, high-performance web applications & responsive landing pages',
    price: '$299 - $599',
    timeline: '4 - 7 Days',
    featured: true,
    badge: 'High Demand',
    description: 'Custom full-stack web applications and interactive websites built for conversion, speed, and sleek modern aesthetics.',
    deliverables: [
      'Custom Next.js & React scalable architecture',
      'Mobile-first responsive UI & fluid layout',
      'SEO optimization & 95+ Google Lighthouse speed score',
      'Smooth micro-animations & interactive UI elements',
      'Clean repository, API integration & deployment',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Vercel'],
  },
  {
    id: 'collab-graphic-design',
    title: 'Graphic Designing',
    category: 'graphic-design',
    tagline: 'High-impact visual brand assets, pitch decks & marketing visuals via Canva & Figma',
    price: '$149 - $299',
    timeline: '2 - 4 Days',
    featured: false,
    badge: 'Fast Turnaround',
    description: 'Compelling presentation decks, brand identities, and social media kits designed to captivate audiences and investors.',
    deliverables: [
      'Investor pitch decks & keynote presentation slides',
      'Social media marketing kits (Instagram, LinkedIn, X)',
      'Brand identity package (Color scheme, typography, assets)',
      'Print-ready & web-optimized exports (PDF, PNG, SVG)',
      'Fully editable Canva Pro & Figma source files',
    ],
    techStack: ['Canva Pro', 'Figma', 'Photoshop', 'Brand Identity', 'Visual Direction'],
  },
  {
    id: 'collab-ecommerce',
    title: 'E-Commerce Website',
    category: 'ecommerce',
    tagline: 'Full-cycle digital stores with dynamic catalogs, carts & secure checkout',
    price: '$499 - $899',
    timeline: '7 - 12 Days',
    featured: true,
    badge: 'Turnkey Solution',
    description: 'End-to-end modern e-commerce storefronts engineered with smooth checkout flows, payment processing, and AI integrations.',
    deliverables: [
      'Dynamic product showcase with smart filters & search',
      'Frictionless cart & multi-currency checkout system',
      'Stripe / Razorpay payment gateway integration',
      'AI customer support & smart product recommendation readiness',
      'Inventory management & automated order tracking',
    ],
    techStack: ['Next.js', 'Stripe', 'Razorpay', 'Firebase', 'Tailwind CSS', 'REST API'],
  },
];

export default function CollabSection({
  services = DEFAULT_SERVICES,
  profileEmail = 'vaibhavsnu2025@gmail.com',
  resumeUrl = '/resume1.pdf',
}: CollabSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<CollabService | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientBrief, setClientBrief] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const displayServices = services && services.length > 0 ? services : DEFAULT_SERVICES;

  const filteredServices =
    activeCategory === 'all'
      ? displayServices
      : displayServices.filter((s) => s.category === activeCategory);

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

  return (
    <section id="collab" className={styles.collabSection} aria-label="Collaboration & Services Catalogue">
      <div className={styles.ambientGlow} />

      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrowBadge}>
          <span className={styles.pulseDot} />
          <span>Showcase &amp; Hire · Available for Q4 2026 Projects</span>
        </div>
        <h2 className={styles.mainTitle}>
          Collab <span className={styles.titleGradient}>Showcase</span>
        </h2>
        <p className={styles.subDescription}>
          Tailored service menus designed for founders, engineering teams, and recruiters. From responsive full-stack web applications to AI commerce and high-impact visual design.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className={styles.filterBar}>
        <button
          type="button"
          className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterBtnActive : ''}`}
          onClick={() => setActiveCategory('all')}
          data-cursor-hover
        >
          All Catalogues ({displayServices.length})
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${activeCategory === 'web-dev' ? styles.filterBtnActive : ''}`}
          onClick={() => setActiveCategory('web-dev')}
          data-cursor-hover
        >
          Web Development
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${activeCategory === 'graphic-design' ? styles.filterBtnActive : ''}`}
          onClick={() => setActiveCategory('graphic-design')}
          data-cursor-hover
        >
          Graphic Designing
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${activeCategory === 'ecommerce' ? styles.filterBtnActive : ''}`}
          onClick={() => setActiveCategory('ecommerce')}
          data-cursor-hover
        >
          E-Commerce Website
        </button>
      </div>

      {/* Services Grid */}
      <div className={styles.servicesGrid}>
        {filteredServices.map((service) => (
          <article
            key={service.id}
            className={`${styles.serviceCard} ${service.featured ? styles.serviceCardFeatured : ''}`}
          >
            <div className={styles.cardTopHeader}>
              <span className={styles.badgePill}>
                {service.badge || (service.featured ? 'Featured' : 'Available')}
              </span>
              <span className={styles.timelineTag}>
                ⏱ {service.timeline}
              </span>
            </div>

            <h3 className={styles.serviceTitle}>{service.title}</h3>
            <p className={styles.serviceTagline}>{service.tagline}</p>

            {/* Pricing Tag */}
            <div className={styles.pricingContainer}>
              <span className={styles.priceLabel}>Starting at</span>
              <span className={styles.priceValue}>{service.price}</span>
              <span className={styles.priceScope}>/ project</span>
            </div>

            {/* Deliverables Checklist */}
            <ul className={styles.deliverablesList}>
              {service.deliverables.map((item, idx) => (
                <li key={idx} className={styles.deliverableItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Tech Stack Tags */}
            <div className={styles.techStackWrap}>
              {service.techStack.map((tech, idx) => (
                <span key={idx} className={styles.techPill}>
                  {tech}
                </span>
              ))}
            </div>

            {/* Inquire CTA Button */}
            <button
              type="button"
              className={styles.cardActionBtn}
              onClick={() => openInquiry(service)}
              data-cursor-hover
            >
              <span>Approach for {service.title}</span>
              <span>→</span>
            </button>
          </article>
        ))}
      </div>

      {/* Recruiter Fast-Track Bento Banner */}
      <div className={styles.recruiterBanner}>
        <div className={styles.recruiterContent}>
          <h3>Recruiter &amp; Team Fast-Track</h3>
          <p>
            Looking to recruit for summer internships, AI/ML engineering, or contract development roles? I am an AIML student at Sister Nivedita University maintaining top honors (9.38 CGPA), experienced in rapid execution and full-stack software delivery.
          </p>
          <div className={styles.recruiterPills}>
            <span className={styles.recruiterPillItem}>📍 Kolkata / Hybrid / Remote</span>
            <span className={styles.recruiterPillItem}>🎓 B.Tech CSE (AIML Track)</span>
            <span className={styles.recruiterPillItem}>⚡ Available for 2026 Cohorts</span>
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
              Estimated Scope: {selectedService.price} · Turnaround: {selectedService.timeline}
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p style={{ color: '#10b981', fontWeight: 600, fontSize: '1.1rem' }}>
                  ✓ Opening email client with pre-filled details...
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Your Name / Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan · Acme Studio"
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
                  <label className={styles.formLabel}>Company / Project URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://company.com"
                    className={styles.formInput}
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Project Brief &amp; Timeline *</label>
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

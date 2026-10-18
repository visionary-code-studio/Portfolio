'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import styles from './Certifications.module.css';
import type { Certification } from '@/types';

interface Props {
  items: Certification[];
  onOpen: (item: Certification) => void;
}

export default function CertificationsSection({ items, onOpen }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Compute category counts dynamically
  const catCounts = useMemo(() => {
    const counts: { [key: string]: number } = { All: items.length };
    items.forEach((c) => {
      if (c.category) {
        counts[c.category] = (counts[c.category] || 0) + 1;
      }
    });
    return counts;
  }, [items]);

  // Standard ordered categories matching reference image
  const categories = useMemo(() => {
    const preferredOrder = [
      'All',
      'Campus Ambassador',
      'Hackathon',
      'Academic',
      'Bootcamp & Workshops',
    ];
    const presentCats = Object.keys(catCounts);
    const extras = presentCats.filter((cat) => !preferredOrder.includes(cat));
    return [...preferredOrder.filter((cat) => cat === 'All' || catCounts[cat] !== undefined), ...extras];
  }, [catCounts]);

  // Filter items by category and real-time search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.issuer?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        String(item.year || '').includes(q) ||
        item.credentialId?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  // Helper to detect if file is a real raster image
  const isRasterImage = (url?: string) =>
    Boolean(
      url &&
        (url.startsWith('data:image/') ||
          /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(url)) &&
        !url.startsWith('data:image/svg+xml')
    );

  return (
    <section className={styles.section} id="certs">
      {/* Cosmic Dust Background & Constellation Stars */}
      <div className={styles.cosmicBackdrop} />
      <div className={styles.cosmicStar} style={{ top: '8%', left: '4%', fontSize: '1.2rem', opacity: 0.6 }}>✦</div>
      <div className={styles.cosmicStar} style={{ top: '22%', right: '6%', fontSize: '1.4rem', opacity: 0.5 }}>★</div>
      <div className={styles.cosmicStar} style={{ top: '65%', right: '3%', fontSize: '1.1rem', opacity: 0.45 }}>✦</div>
      <div className={styles.cosmicStar} style={{ bottom: '12%', left: '5%', fontSize: '1.3rem', opacity: 0.55 }}>★</div>



      {/* Left Pinned Curiosity Paper Note */}
      <div className={styles.curiosityNoteWrap} aria-hidden="true">
        <div className={styles.curiosityTape} />
        <div className={styles.curiosityNote}>
          <span>SAME</span>
          <span>CURIOSITY</span>
          <span>BIGGER</span>
          <span>HORIZONS.</span>
          <div className={styles.curiositySketch}>
            {/* Astronaut Helmet Sketch */}
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#222222" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="22" cy="18" r="12" />
              <path d="M14 18c0-3.5 3.5-6 8-6s8 2.5 8 6-3.5 5-8 5-8-1.5-8-5z" fill="rgba(0,0,0,0.06)" />
              <path d="M10 28c0 4 5 7 12 7s12-3 12-7" />
              <path d="M6 38c4-2 9-3 16-3s12 1 16 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Top Right Handwritten Cursive Annotation */}
      <div className={styles.handwrittenScript} aria-hidden="true">
        Collecting<br />
        Proofs<br />
        of Progress.
      </div>

      {/* Right Side Vertical Micro-Annotation */}
      <div className={styles.rightRailText} aria-hidden="true">
        Small<br />
        Steps<br />
        Bigger<br />
        Horizons<br />
        ...
      </div>

      <div className={styles.container}>
        {/* ── 1. RIPPED PAPER HEADER BANNER (1:1 REFERENCE) ── */}
        <div className={styles.rippedBannerWrapper}>
          <div className={styles.rippedBanner}>
            <div className={styles.bannerLeft}>
              <div className={styles.bannerTitleCol}>
                <span className={styles.bannerMetaPrefix}>05 --</span>
                <h2 className={styles.bannerMainTitle}>THE PROOF</h2>
              </div>
              {/* Saturn / Planet with Rings Line Art SVG */}
              <svg className={styles.planetLineIcon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="32" cy="32" r="15" />
                <ellipse cx="32" cy="32" rx="27" ry="9" transform="rotate(-25 32 32)" />
                <circle cx="48" cy="18" r="1.5" fill="currentColor" />
                <circle cx="15" cy="46" r="1" fill="currentColor" />
              </svg>
            </div>

            <div className={styles.bannerCenter}>
              <p className={styles.bannerDescPrimary}>
                Verified engineering, ambassador and academic credentials.
              </p>
              <p className={styles.bannerDescSecondary}>
                Certificates, achievements and milestones that mark the journey of continuous learning.
              </p>
            </div>

            <div className={styles.bannerRight}>
              {/* 4-point star SVG */}
              <svg className={styles.starIconLarge} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
              </svg>

              <div className={styles.bannerKeywordStack}>
                <span className={styles.bannerKeyword}>IDEAS</span>
                <span className={styles.bannerKeyword}>LEARNING</span>
                <span className={styles.bannerKeyword}>BUILDING</span>
                <span className={styles.bannerKeyword}>ACHIEVEMENTS</span>
                <span className={styles.bannerKeyword}>REPEATING ...</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. CONTROLS ROW: FILTER PILLS + SEARCH BOX + MODE BUTTONS ── */}
        <div className={styles.controlsRow}>
          {/* Category Filter Pills with Item Counts */}
          <div className={styles.filterPills} role="tablist" aria-label="Certificate categories">
            {categories.map((cat) => {
              const count = catCounts[cat] || 0;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span>{cat}</span>
                  <span className={styles.filterCount}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Real-time Search Input & View Mode Toggles */}
          <div className={styles.controlsRight}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search certificates"
              />
            </div>

            {/* Target Reticle Button */}
            <button
              type="button"
              className={styles.iconCircleBtn}
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              aria-label="Reset filters"
              title="Reset filters"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
            </button>

            {/* Grid / List View Toggle */}
            <button
              type="button"
              className={styles.iconCircleBtn}
              onClick={() => setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))}
              aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
              title="Toggle View Mode"
            >
              {viewMode === 'grid' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── 3. THREE-COLUMN CARDS GRID (1:1 REFERENCE) ── */}
        <div className={`${styles.grid} ${viewMode === 'list' ? styles.gridList : ''}`}>
          {filteredItems.map((cert) => {
            const hasRealImage =
              (cert.preview && isRasterImage(cert.preview)) ||
              (cert.file && isRasterImage(cert.file));
            const imageSource =
              cert.preview && isRasterImage(cert.preview)
                ? cert.preview
                : cert.file && isRasterImage(cert.file)
                ? cert.file
                : null;

            // Detect format badge text & style
            const fileTarget = cert.file || cert.preview || '';
            let formatText = 'PNG';
            let formatClass = styles.formatBadgePng;
            if (fileTarget.toLowerCase().includes('.pdf')) {
              formatText = 'PDF';
              formatClass = styles.formatBadgePdf;
            } else if (fileTarget.toLowerCase().includes('.jpg') || fileTarget.toLowerCase().includes('.jpeg')) {
              formatText = 'JPG';
              formatClass = styles.formatBadgeJpg;
            }

            // Detect card archetype
            const isVerifiedOnboarding =
              cert.category === 'Campus Ambassador' ||
              cert.title.toLowerCase().includes('onboarding');

            const isThumbnailUnavailable =
              cert.title.toUpperCase().includes('ISRO') ||
              cert.title.toLowerCase().includes('thumbnail');

            return (
              <div
                key={cert.id}
                className={styles.card}
                onClick={() => onOpen(cert)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpen(cert)}
                aria-label={`View certificate: ${cert.title}`}
              >
                {/* Top Row: Category Pill + Format Badge + Year */}
                <div className={styles.cardTopRow}>
                  <div className={styles.cardCategoryPill}>
                    <span
                      className={styles.catDot}
                      style={{
                        background:
                          cert.category === 'Campus Ambassador'
                            ? '#38bdf8'
                            : cert.category === 'Hackathon'
                            ? '#fb923c'
                            : cert.category === 'Academic'
                            ? '#a855f7'
                            : '#34d399',
                      }}
                    />
                    <span>{cert.category || 'Certificate'}</span>
                  </div>

                  <span className={`${styles.formatBadge} ${formatClass}`}>
                    {formatText}
                  </span>

                  <span className={styles.cardYear}>{cert.year || 2026}</span>
                </div>

                {/* Body Preview Stage (Matching the 4 Reference Archetypes) */}
                <div className={styles.previewStage}>
                  {/* Archetype 1: Verified Interactive Credential (Card 2 Reference) */}
                  {isVerifiedOnboarding ? (
                    <div className={styles.verifiedOrbitalStage}>
                      {/* Orbital SVG Circles */}
                      <svg className={styles.orbitalRingsSvg} viewBox="0 0 200 200" fill="none">
                        <ellipse cx="100" cy="100" rx="90" ry="40" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" transform="rotate(-20 100 100)" />
                        <ellipse cx="100" cy="100" rx="70" ry="30" stroke="#0ea5e9" strokeWidth="0.8" transform="rotate(35 100 100)" />
                      </svg>

                      <div className={styles.checkCircleLarge}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>

                      <h4 className={styles.verifiedHeading}>Certificate Verified</h4>
                      <p className={styles.verifiedPerson}>Vaibhav Shaw</p>
                      <span className={styles.verifiedDocumentSub}>Onboarding Letter</span>

                      <div className={styles.verifiedActionsRow}>
                        <button
                          type="button"
                          className={styles.actionPillBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(cert);
                          }}
                        >
                          View Certificate →
                        </button>
                        <button
                          type="button"
                          className={styles.iconCircleMini}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(cert);
                          }}
                          aria-label="Inspect certificate details"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : hasRealImage && imageSource ? (
                    /* Archetype 2: Real Certificate Image with Pushpin & Corner Tape (Cards 1, 3, 5 Reference) */
                    <div className={styles.realImageWrap}>
                      <div className={styles.tapeTopLeft} />
                      <div className={styles.tapeBottomRight} />
                      <svg className={styles.cornerPushPin} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="6" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                        <circle cx="11" cy="11" r="2" fill="#ffffff" />
                      </svg>
                      <Image
                        src={imageSource}
                        alt={cert.title}
                        fill
                        unoptimized={true}
                        className={styles.realCertImg}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : isThumbnailUnavailable ? (
                    /* Archetype 3: Thumbnail Placeholder (Card 6 ISRO Reference) */
                    <div className={styles.docPlaceholderStage}>
                      <svg className={styles.docIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <h4 className={styles.docHeading}>Thumbnail Not Available</h4>
                      <p className={styles.docSub}>Open the certificate to view.</p>
                      <div className={styles.verifiedActionsRow}>
                        <button
                          type="button"
                          className={styles.actionPillBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(cert);
                          }}
                        >
                          View Certificate →
                        </button>
                        <a
                          href={cert.file || '#'}
                          download
                          className={styles.iconCircleMini}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Download certificate"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ) : (
                    /* Archetype 4: PDF Preview Unavailable (Card 4 Reference) */
                    <div className={styles.docPlaceholderStage}>
                      <svg className={styles.docIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      <h4 className={styles.docHeading}>Certificate Preview Unavailable</h4>
                      <p className={styles.docSub}>This certificate is in PDF format. Click to view or download.</p>
                      <div className={styles.verifiedActionsRow}>
                        <button
                          type="button"
                          className={styles.actionPillBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(cert);
                          }}
                        >
                          View PDF →
                        </button>
                        <a
                          href={cert.file || '#'}
                          download
                          className={styles.iconCircleMini}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Download certificate"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Row: Certificate Title + External Link Arrow Circle */}
                <div className={styles.cardBottomRow}>
                  <span className={styles.cardTitleText} title={cert.title}>
                    {cert.title}
                  </span>
                  <div className={styles.cardExternalBtn} aria-hidden="true">
                    ↗
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 4. SUB-FOOTER LINE (1:1 REFERENCE) ── */}
        <div className={styles.subFooterLine}>
          <span className={styles.subFooterLeft}>06 / DOCUMENTING PROGRESS.</span>
          <span className={styles.subFooterRight}>CERTIFICATES • ACHIEVEMENTS • MILESTONES</span>
        </div>
      </div>
    </section>
  );
}

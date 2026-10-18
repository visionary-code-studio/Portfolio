'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import styles from './PptShelf.module.css';
import type { Presentation } from '@/types';

interface Props {
  items: Presentation[];
  onOpen: (item: Presentation) => void;
}

export default function PptShelf({ items, onOpen }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Compute category counts dynamically
  const catCounts = useMemo(() => {
    const counts: { [key: string]: number } = { All: items.length };
    items.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [items]);

  const categories = useMemo(() => {
    const preferredOrder = [
      'All',
      'AI / ML',
      'Technology',
      'Entrepreneurship',
      'Hackathon',
    ];
    const presentCats = Object.keys(catCounts);
    const extras = presentCats.filter((cat) => !preferredOrder.includes(cat));
    return [...preferredOrder.filter((cat) => cat === 'All' || catCounts[cat] !== undefined), ...extras];
  }, [catCounts]);

  // Filter items by category and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.event?.toLowerCase().includes(q) ||
        String(item.year || '').includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  const isRasterImage = (url?: string) =>
    Boolean(
      url &&
        (url.startsWith('data:image/') ||
          /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(url)) &&
        !url.startsWith('data:image/svg+xml')
    );

  return (
    <section className={styles.section} id="ppt">
      {/* Background Cosmic Star Dust */}
      <div className={styles.cosmicBackdrop} />
      <div className={styles.cosmicStar} style={{ top: '10%', right: '5%', fontSize: '1.3rem', opacity: 0.55 }}>✦</div>
      <div className={styles.cosmicStar} style={{ top: '30%', left: '4%', fontSize: '1.1rem', opacity: 0.45 }}>★</div>
      <div className={styles.cosmicStar} style={{ bottom: '15%', right: '7%', fontSize: '1.2rem', opacity: 0.5 }}>✦</div>



      {/* Left Pinned Research Curiosity Note */}
      <div className={styles.curiosityNoteWrap} aria-hidden="true">
        <div className={styles.curiosityTape} />
        <div className={styles.curiosityNote}>
          <span>RESEARCH</span>
          <span>DRIVEN</span>
          <span>DEEPER</span>
          <span>INSIGHTS.</span>
          <div className={styles.curiositySketch}>
            {/* Presentation Blueprint Sketch */}
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#222222" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="8" width="32" height="24" rx="3" />
              <line x1="6" y1="16" x2="38" y2="16" />
              <line x1="22" y1="32" x2="22" y2="38" />
              <line x1="14" y1="38" x2="30" y2="38" />
              <circle cx="12" cy="12" r="1.5" fill="#222222" />
              <line x1="12" y1="22" x2="24" y2="22" />
              <line x1="12" y1="26" x2="20" y2="26" />
            </svg>
          </div>
        </div>
      </div>

      {/* Top Right Handwritten Cursive Annotation */}
      <div className={styles.handwrittenScript} aria-hidden="true">
        Documenting<br />
        Research<br />
        & Presentations.
      </div>

      {/* Right Side Vertical Micro-Annotation */}
      <div className={styles.rightRailText} aria-hidden="true">
        Decks<br />
        Studies<br />
        Bigger<br />
        Horizons<br />
        ...
      </div>

      <div className={styles.container}>
        {/* ── 1. RIPPED PAPER HEADER BANNER ── */}
        <div className={styles.rippedBannerWrapper}>
          <div className={styles.rippedBanner}>
            <div className={styles.bannerLeft}>
              <div className={styles.bannerTitleCol}>
                <span className={styles.bannerMetaPrefix}>04 --</span>
                <h2 className={styles.bannerMainTitle}>THE ARCHIVE</h2>
              </div>
              {/* Geometric Blueprint / Technical Deck SVG */}
              <svg className={styles.blueprintLineIcon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="8" y="10" width="48" height="34" rx="4" />
                <path d="M8 20h48" />
                <path d="M32 44v10M20 54h24" />
                <path d="M16 28h18M16 34h12" />
                <circle cx="44" cy="31" r="5" />
              </svg>
            </div>

            <div className={styles.bannerCenter}>
              <p className={styles.bannerDescPrimary}>
                Designing technical ideas into research presentations.
              </p>
              <p className={styles.bannerDescSecondary}>
                Decks, case studies and pitch presentations crafted with precision.
              </p>
            </div>

            <div className={styles.bannerRight}>
              <svg className={styles.starIconLarge} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
              </svg>

              <div className={styles.bannerKeywordStack}>
                <span className={styles.bannerKeyword}>RESEARCH</span>
                <span className={styles.bannerKeyword}>STRUCTURE</span>
                <span className={styles.bannerKeyword}>DESIGN</span>
                <span className={styles.bannerKeyword}>DELIVERY</span>
                <span className={styles.bannerKeyword}>IMPACT ...</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. CONTROLS ROW: FILTER PILLS + SEARCH BOX + MODE BUTTONS ── */}
        <div className={styles.controlsRow}>
          <div className={styles.filterPills} role="tablist" aria-label="Presentation categories">
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

          <div className={styles.controlsRight}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search presentations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search presentations"
              />
            </div>

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

        {/* ── 3. THREE-COLUMN CARDS GRID ── */}
        <div className={`${styles.grid} ${viewMode === 'list' ? styles.gridList : ''}`}>
          {filteredItems.map((ppt) => {
            const hasRealImage =
              (ppt.preview && isRasterImage(ppt.preview)) ||
              (ppt.file && isRasterImage(ppt.file));
            const imageSource =
              ppt.preview && isRasterImage(ppt.preview)
                ? ppt.preview
                : ppt.file && isRasterImage(ppt.file)
                ? ppt.file
                : null;

            const isPptx =
              ppt.file?.toLowerCase().endsWith('.pptx') ||
              ppt.file?.toLowerCase().endsWith('.ppt');
            const formatText = isPptx ? 'PPTX' : 'PDF';
            const formatClass = isPptx ? styles.formatBadgePptx : styles.formatBadgePdf;

            return (
              <div
                key={ppt.id}
                className={styles.card}
                onClick={() => onOpen(ppt)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpen(ppt)}
                aria-label={`View presentation: ${ppt.title}`}
              >
                {/* Top Row: Category Pill + Format Badge + Year */}
                <div className={styles.cardTopRow}>
                  <div className={styles.cardCategoryPill}>
                    <span
                      className={styles.catDot}
                      style={{
                        background:
                          ppt.category === 'AI / ML'
                            ? '#38bdf8'
                            : ppt.category === 'Technology'
                            ? '#a855f7'
                            : ppt.category === 'Entrepreneurship'
                            ? '#fb923c'
                            : '#34d399',
                      }}
                    />
                    <span>{ppt.category || 'Deck'}</span>
                  </div>

                  <span className={`${styles.formatBadge} ${formatClass}`}>
                    {formatText}
                  </span>

                  <span className={styles.cardYear}>{ppt.year || 2026}</span>
                </div>

                {/* Body Preview Stage */}
                <div className={styles.previewStage}>
                  {hasRealImage && imageSource ? (
                    <div className={styles.realImageWrap}>
                      <div className={styles.tapeTopLeft} />
                      <div className={styles.tapeBottomRight} />
                      <svg className={styles.cornerPushPin} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="6" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                        <circle cx="11" cy="11" r="2" fill="#ffffff" />
                      </svg>
                      <Image
                        src={imageSource}
                        alt={ppt.title}
                        fill
                        unoptimized={true}
                        className={styles.realSlideImg}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className={styles.docPlaceholderStage}>
                      <svg className={styles.docIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                        <path d="M7 8h10M7 11h6" />
                      </svg>
                      <h4 className={styles.docHeading}>{ppt.title}</h4>
                      <p className={styles.docSub}>{ppt.event || ppt.description || 'Interactive Presentation Deck'}</p>
                      <div className={styles.verifiedActionsRow}>
                        <button
                          type="button"
                          className={styles.actionPillBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(ppt);
                          }}
                        >
                          View Presentation →
                        </button>
                        <a
                          href={ppt.file || '#'}
                          download
                          className={styles.iconCircleMini}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Download presentation"
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

                {/* Bottom Row: Presentation Title + Link Arrow */}
                <div className={styles.cardBottomRow}>
                  <span className={styles.cardTitleText} title={ppt.title}>
                    {ppt.title}
                  </span>
                  <div className={styles.cardExternalBtn} aria-hidden="true">
                    ↗
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 4. SUB-FOOTER LINE ── */}
        <div className={styles.subFooterLine}>
          <span className={styles.subFooterLeft}>05 / THE ARCHIVE ARCHITECTURE.</span>
          <span className={styles.subFooterRight}>PRESENTATIONS • RESEARCH • PITCH DECKS</span>
        </div>
      </div>
    </section>
  );
}

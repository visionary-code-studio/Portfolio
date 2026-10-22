'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from '@/components/ui/ScrollTriggered';
import PhilosophyCardStack from './PhilosophyCardStack';
import styles from './AboutSection.module.css';

interface AboutProps {
  data?: {
    shortIntro?: string;
    philosophy?: string;
    tagline?: string;
    university?: {
      name?: string;
      degree?: string;
      year?: string;
      semester?: string;
      cgpa?: string;
      sem1?: string;
      sem2?: string;
    };
    school?: {
      name?: string;
      class10?: string;
      class12?: string;
    };
  };
}

const identityPillars = [
  {
    num: '01',
    label: 'STUDENT & CONTINUOUS LEARNER',
    sub: 'EXPLORE · LEARN · GROW',
    tag: 'LEARN',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    art: (
      <div className={styles.rowArtWrap} aria-hidden="true">
        <svg className={styles.rowArtSvg} viewBox="0 0 280 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bookFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#111115" stopOpacity="1" />
              <stop offset="35%" stopColor="#111115" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#111115" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <g opacity="0.32" stroke="#d4d4d8" strokeWidth="1">
            <path d="M150 75 C 180 69, 215 71, 275 58" />
            <path d="M150 70 C 182 64, 215 66, 275 53" />
            <path d="M150 65 C 184 59, 218 61, 275 48" />
            <path d="M150 60 C 186 54, 220 56, 275 43" />
            <path d="M150 55 C 188 48, 222 50, 275 37" />
            <path d="M148 18 Q 150 50 150 75" strokeWidth="1.5" />
            <path d="M150 18 C 185 12, 220 14, 275 6 L 275 58 C 220 71, 185 69, 150 75 Z" fill="#222228" opacity="0.45" />
            <line x1="170" y1="26" x2="255" y2="18" strokeDasharray="3 3" opacity="0.4" />
            <line x1="170" y1="34" x2="260" y2="26" strokeDasharray="3 3" opacity="0.4" />
            <line x1="170" y1="42" x2="258" y2="34" strokeDasharray="3 3" opacity="0.4" />
            <line x1="170" y1="50" x2="250" y2="42" strokeDasharray="3 3" opacity="0.4" />
          </g>
          <rect width="280" height="90" fill="url(#bookFade)" />
        </svg>
      </div>
    ),
  },
  {
    num: '02',
    label: 'FULL-STACK DEVELOPER',
    sub: 'BUILD · DEVELOP · SOLVE',
    tag: 'CODE',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
    art: (
      <div className={styles.rowArtWrap} aria-hidden="true">
        <svg className={styles.rowArtSvg} viewBox="0 0 280 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="codeFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#111115" stopOpacity="1" />
              <stop offset="35%" stopColor="#111115" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#111115" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <g opacity="0.36">
            <polygon points="135,80 275,66 270,14 145,23" fill="#18181e" stroke="#52525b" strokeWidth="1" />
            <line x1="160" y1="33" x2="190" y2="31" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="195" y1="31" x2="235" y2="28" stroke="#71717a" strokeWidth="1.5" />
            <line x1="165" y1="41" x2="210" y2="38" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="215" y1="37" x2="255" y2="34" stroke="#52525b" strokeWidth="1.5" />
            <line x1="170" y1="49" x2="225" y2="45" stroke="#e4e4e7" strokeWidth="1.5" />
            <line x1="170" y1="57" x2="200" y2="54" stroke="#71717a" strokeWidth="1.5" />
            <polygon points="125,86 278,80 275,66 135,80" fill="#202027" stroke="#3f3f46" strokeWidth="0.8" />
          </g>
          <rect width="280" height="90" fill="url(#codeFade)" />
        </svg>
      </div>
    ),
  },
  {
    num: '03',
    label: 'AI/ML ENGINEER',
    sub: 'MODEL · INNOVATE · APPLY',
    tag: 'AI/ML',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="5" y="5" rx="2" />
        <rect width="6" height="6" x="9" y="9" rx="1" />
        <path d="M15 2v3" />
        <path d="M15 19v3" />
        <path d="M2 15h3" />
        <path d="M2 9h3" />
        <path d="M19 15h3" />
        <path d="M19 9h3" />
        <path d="M9 2v3" />
        <path d="M9 19v3" />
      </svg>
    ),
    art: (
      <div className={styles.rowArtWrap} aria-hidden="true">
        <svg className={styles.rowArtSvg} viewBox="0 0 280 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="aiFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#111115" stopOpacity="1" />
              <stop offset="35%" stopColor="#111115" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#111115" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <g opacity="0.38" stroke="#a1a1aa" strokeWidth="0.8">
            <line x1="150" y1="65" x2="185" y2="35" />
            <line x1="185" y1="35" x2="220" y2="55" />
            <line x1="185" y1="35" x2="235" y2="25" />
            <line x1="220" y1="55" x2="260" y2="40" />
            <line x1="190" y1="75" x2="220" y2="55" />
            <line x1="235" y1="25" x2="260" y2="40" />
            <circle cx="150" cy="65" r="2.5" fill="#ffffff" />
            <circle cx="185" cy="35" r="3.5" fill="#ffffff" />
            <circle cx="220" cy="55" r="3" fill="#ffffff" />
            <circle cx="235" cy="25" r="2.5" fill="#ffffff" />
            <circle cx="260" cy="40" r="3" fill="#ffffff" />
            <circle cx="190" cy="75" r="2" fill="#a1a1aa" />
            <circle cx="165" cy="20" r="1.2" fill="#a1a1aa" />
            <circle cx="205" cy="18" r="1.4" fill="#ffffff" />
            <circle cx="250" cy="68" r="1.2" fill="#71717a" />
            <circle cx="225" cy="78" r="1" fill="#a1a1aa" />
            <circle cx="175" cy="80" r="1" fill="#52525b" />
          </g>
          <rect width="280" height="90" fill="url(#aiFade)" />
        </svg>
      </div>
    ),
  },
  {
    num: '04',
    label: 'GRAPHIC DESIGNER',
    sub: 'DESIGN · VISUALIZE · EXPRESS',
    tag: 'VISUAL',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 19 7-7 3 3-7 7-3-3z" />
        <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="m2 2 7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    art: (
      <div className={styles.rowArtWrap} aria-hidden="true">
        <svg className={styles.rowArtSvg} viewBox="0 0 280 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="typeFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#111115" stopOpacity="1" />
              <stop offset="35%" stopColor="#111115" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#111115" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <g opacity="0.32">
            <text x="180" y="66" fontFamily="Georgia, 'Cormorant Garamond', serif" fontSize="56" fontWeight="bold" fill="#ffffff" opacity="0.75">Aa</text>
            <line x1="145" y1="20" x2="265" y2="20" stroke="#71717a" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="145" y1="66" x2="265" y2="66" stroke="#a1a1aa" strokeWidth="0.8" />
            <line x1="170" y1="10" x2="170" y2="80" stroke="#52525b" strokeWidth="0.8" strokeDasharray="2 2" />
            <text x="184" y="78" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#a1a1aa" letterSpacing="2">AUTO. OPTICAL</text>
          </g>
          <rect width="280" height="90" fill="url(#typeFade)" />
        </svg>
      </div>
    ),
  },
  {
    num: '05',
    label: 'UI & UX DESIGNER',
    sub: 'DESIGN · CRAFT · IMPROVE',
    tag: 'SYSTEM',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
    art: (
      <div className={styles.rowArtWrap} aria-hidden="true">
        <svg className={styles.rowArtSvg} viewBox="0 0 280 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lensFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#111115" stopOpacity="1" />
              <stop offset="35%" stopColor="#111115" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#111115" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="silverRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#52525b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <g opacity="0.42">
            <circle cx="240" cy="45" r="42" stroke="url(#silverRing)" strokeWidth="1.5" fill="none" />
            <circle cx="240" cy="45" r="32" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 2" fill="none" />
            <circle cx="240" cy="45" r="22" stroke="url(#silverRing)" strokeWidth="1.2" fill="none" />
            <circle cx="240" cy="45" r="12" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.6" />
            <line x1="198" y1="45" x2="282" y2="45" stroke="#71717a" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="240" y1="3" x2="240" y2="87" stroke="#71717a" strokeWidth="0.8" strokeDasharray="3 3" />
          </g>
          <rect width="280" height="90" fill="url(#lensFade)" />
        </svg>
      </div>
    ),
  },
];

export default function AboutSection({ data }: AboutProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const universityName = data?.university?.name || 'Sister Nivedita University';
  const degree = data?.university?.degree || 'B.Tech CSE — AIML';
  const yearSem = data?.university?.year ? `${data.university.year} · ${data.university.semester || '3rd Sem'}` : '2nd Year · 3rd Sem';
  const cgpa = data?.university?.cgpa
    ? `${data.university.cgpa} (Sem 1: ${data.university.sem1 || '9.43'} · Sem 2: ${data.university.sem2 || '9.35'})`
    : '9.38 (Sem 1: 9.43 · Sem 2: 9.35)';
  const schoolName = data?.school?.name || 'Bholananda National Vidyalaya';
  const schoolScores = data?.school?.class10 ? `${data.school.class10} · ${data.school.class12 || '75.8%'}` : '85.5% · 75.8%';
  const tagline = data?.tagline || 'Learning with Curiosity, Innovate with Passion';
  const shortIntro = data?.shortIntro || 'Student of Sister Nivedita University pursuing B.Tech CSE in AIML. Building ideas through curiosity and turning research into reality.';

  const academic = [
    { label: 'University', value: universityName },
    { label: 'Degree Track', value: degree },
    { label: 'Term', value: yearSem },
    { label: 'Overall CGPA', value: cgpa },
    { label: 'School', value: schoolName },
    { label: 'Senior Secondary', value: schoolScores },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // 5 progressive steps matching scroll depth through the pinned track
    if (latest <= 0.08) {
      setCurrentStep(0);
    } else if (latest <= 0.28) {
      setCurrentStep(1);
    } else if (latest <= 0.52) {
      setCurrentStep(2);
    } else if (latest <= 0.76) {
      setCurrentStep(3);
    } else {
      setCurrentStep(4);
    }
  });

  return (
    <section className={styles.section} id="about">
      {/* Scroll-Pinned Track Container for 1-by-1 Hangtag Reveal */}
      <div ref={trackRef} className={styles.scrollPinnedWrapper}>
        <div className={styles.sectionGrid}>
          {/* Left Column: Manifesto & Narrative + Philosophy Stack */}
          <div className={styles.left}>
            <ScrollReveal variant="fadeUp">
              <div className={styles.sectionMeta}>02 — Personal Philosophy</div>
              <div className={styles.statementBlock}>
                <h2 className={styles.statementQuote}>
                  I like to build things I don&apos;t yet know{' '}
                  <span className={styles.statementAccent}>how to build.</span>
                </h2>
                <p className={styles.narrativeText}>{shortIntro}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.15}>
              <PhilosophyCardStack tagline={tagline} />
            </ScrollReveal>

            {/* Kolkata Heritage Postcard Card (Relocated to About Left Column) */}
            <ScrollReveal variant="fadeUp" delay={0.25}>
              <div className={styles.kolkataCardContainer}>
                <div className={styles.kolkataCardMeta}>
                  <div className={styles.kolkataMetaLeft}>
                    <span className={styles.kolkataPulseDot} />
                    <span className={styles.kolkataCityTag}>KOLKATA, WEST BENGAL</span>
                  </div>
                  <span className={styles.kolkataHeritageTag}>WHERE HERITAGE MEETS TOMORROW</span>
                </div>
                <div
                  className={styles.kolkataCardWrap}
                  title="Kolkata, West Bengal — Where Heritage Meets Tomorrow"
                  data-cursor-hover
                >
                  <img
                    src="/images/kolkata_card.jpg"
                    alt="Kolkata, West Bengal — Where Heritage Meets Tomorrow"
                    className={styles.kolkataCardImg}
                  />
                  <div className={styles.kolkataCardGlassOverlay} />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Industrial Hangtag Card with Scroll-driven Hover Effect */}
          <div className={styles.right}>
            <div className={styles.hangtagCard}>
              {/* Top Cord Assembly (Reference: Ribbed Lanyard Strap & Swivel Clasp Loop) */}
              <div className={styles.tagCordAssembly} aria-hidden="true">
                <div className={styles.tagLanyardStrap} />
                <div className={styles.tagClaspRing}>
                  <div className={styles.tagClaspInner} />
                </div>
              </div>

              {/* Main Hangtag Card Body (Deep Charcoal & Brushed Silver Identity Card) */}
              <div className={styles.tagBody}>
                {/* 4 Corner Crosshairs */}
                <span className={styles.crosshairTL} aria-hidden="true">+</span>
                <span className={styles.crosshairTR} aria-hidden="true">+</span>
                <span className={styles.crosshairBL} aria-hidden="true">+</span>
                <span className={styles.crosshairBR} aria-hidden="true">+</span>

                {/* Metallic Grommet Eyelet */}
                <div className={styles.tagEyelet} aria-hidden="true" />

                {/* Tag Header Metadata */}
                <div className={styles.tagHeader}>
                  <div className={styles.tagHeaderTopRow}>
                    <span className={styles.tagSpecText}>SPEC. NO. 2026</span>
                    <span className={styles.tagRoleTagBadge}>
                      ROLE TAG{' '}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className={styles.sparkleIcon}>
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                      </svg>
                    </span>
                  </div>

                  <div className={styles.tagHeaderDivider} />

                  <div className={styles.tagNameRow}>
                    <div className={styles.tagNameCol}>
                      <h3 className={styles.tagBrandName}>VAIBHAV SHAW</h3>
                      <p className={styles.tagDescriptor}>BUILDER / LEARNER / CREATIVE THINKER</p>
                    </div>

                    <div className={styles.tagVerifiedBadge}>
                      <span className={styles.verifiedDot} />
                      <span className={styles.verifiedText}>VERIFIED · 5/5</span>
                    </div>
                  </div>
                </div>

                {/* 5 Identity Role Tags (One by One Scroll Reveal + Hover State) */}
                <div className={styles.tagList}>
                  <AnimatePresence initial={false}>
                    {identityPillars.map((item, idx) => {
                      const isRevealed = !mounted || idx <= currentStep;
                      const isCurrentActive = hoveredIndex === idx || (hoveredIndex === null && currentStep === idx);
                      const isFifth = idx === 4;

                      if (!isRevealed) return null;

                      return (
                        <motion.div
                          key={item.num}
                          layout
                          className={`${styles.tagRow} ${isCurrentActive ? styles.tagRowActive : ''} ${isFifth ? styles.tagRowFifth : ''}`}
                          initial={{ opacity: 0, y: 16, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{
                            duration: 0.34,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          {/* Monochromatic Background Art Layer */}
                          {item.art}

                          {/* Left: Index, Divider, Icon, Titles */}
                          <div className={styles.tagRowLeft}>
                            <span className={styles.tagRowNum}>{item.num}</span>
                            <span className={styles.tagRowDivider} />
                            <span className={styles.tagRowIcon}>{item.icon}</span>
                            <div className={styles.tagRowTextCol}>
                              <span className={styles.tagRowLabel}>{item.label}</span>
                              <span className={styles.tagRowSubline}>{item.sub}</span>
                            </div>
                          </div>

                          {/* Right: Category Pill & Arrow */}
                          <div className={styles.tagRowRight}>
                            <span className={isFifth ? styles.tagBadgeSystem : styles.tagBadgeDefault}>
                              {item.tag}
                            </span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={styles.tagRowArrow}
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Bottom Industrial Barcode & Spec Stamp (Reference Image) */}
                <div className={styles.tagFooter}>
                  <div className={styles.tagFooterLeft}>
                    <div className={styles.barcodeTrack} aria-hidden="true">
                      <svg width="156" height="24" viewBox="0 0 156 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="2" height="24" fill="#d4d4d8" />
                        <rect x="4" y="0" width="1" height="24" fill="#d4d4d8" />
                        <rect x="7" y="0" width="3" height="24" fill="#d4d4d8" />
                        <rect x="12" y="0" width="2" height="24" fill="#d4d4d8" />
                        <rect x="16" y="0" width="4" height="24" fill="#d4d4d8" />
                        <rect x="22" y="0" width="1" height="24" fill="#d4d4d8" />
                        <rect x="25" y="0" width="2" height="24" fill="#d4d4d8" />
                        <rect x="29" y="0" width="4" height="24" fill="#d4d4d8" />
                        <rect x="35" y="0" width="1" height="24" fill="#d4d4d8" />
                        <rect x="38" y="0" width="3" height="24" fill="#d4d4d8" />
                        <rect x="43" y="0" width="2" height="24" fill="#d4d4d8" />
                        <rect x="47" y="0" width="4" height="24" fill="#d4d4d8" />
                        <rect x="53" y="0" width="1" height="24" fill="#d4d4d8" />
                        <rect x="56" y="0" width="2" height="24" fill="#d4d4d8" />
                        <rect x="60" y="0" width="4" height="24" fill="#d4d4d8" />
                        <rect x="66" y="0" width="1" height="24" fill="#d4d4d8" />
                        <rect x="69" y="0" width="3" height="24" fill="#d4d4d8" />
                        <rect x="74" y="0" width="2" height="24" fill="#d4d4d8" />
                        <rect x="78" y="0" width="4" height="24" fill="#d4d4d8" />
                        <rect x="84" y="0" width="1" height="24" fill="#d4d4d8" />
                        <rect x="87" y="0" width="3" height="24" fill="#d4d4d8" />
                        <rect x="92" y="0" width="2" height="24" fill="#d4d4d8" />
                        <rect x="96" y="0" width="4" height="24" fill="#d4d4d8" />
                        <rect x="102" y="0" width="1" height="24" fill="#d4d4d8" />
                        <rect x="105" y="0" width="2" height="24" fill="#d4d4d8" />
                        <rect x="109" y="0" width="3" height="24" fill="#d4d4d8" />
                        <rect x="114" y="0" width="1" height="24" fill="#d4d4d8" />
                        <rect x="117" y="0" width="4" height="24" fill="#d4d4d8" />
                        <rect x="123" y="0" width="2" height="24" fill="#d4d4d8" />
                        <rect x="127" y="0" width="1" height="24" fill="#d4d4d8" />
                        <rect x="130" y="0" width="3" height="24" fill="#d4d4d8" />
                        <rect x="135" y="0" width="2" height="24" fill="#d4d4d8" />
                        <rect x="139" y="0" width="4" height="24" fill="#d4d4d8" />
                        <rect x="145" y="0" width="1" height="24" fill="#d4d4d8" />
                        <rect x="148" y="0" width="2" height="24" fill="#d4d4d8" />
                        <rect x="152" y="0" width="3" height="24" fill="#d4d4d8" />
                      </svg>
                    </div>
                    <div className={styles.tagFooterSerial}>
                      <span className={styles.hollowDot} />
                      <span>ALL 5 ROLES REVEALED</span>
                    </div>
                  </div>

                  <div className={styles.tagFooterDivider} />

                  <div className={styles.tagFooterRight}>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.globeIcon}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span className={styles.tagFooterOrigin}>SNU · KOLKATA, IN</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.diagonalArrow}
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Overview Showcase */}
      <div className={styles.academicWrapper}>
        <ScrollReveal variant="card" delay={0.15} className={styles.academicCard}>
          {/* Header Row */}
          <div className={styles.academicHeader}>
            <div className={styles.academicHeaderLeft}>
              <span className={styles.academicEyebrow}>03 — Education &amp; Academics</span>
              <h3 className={styles.academicTitle}>Academic Overview</h3>
            </div>
            <div className={styles.academicHeaderRight}>
              <span className={styles.academicMetaTrack}>Sister Nivedita University · B.Tech CSE (AIML Track)</span>
            </div>
          </div>

          {/* Core UI Bento Grid */}
          <div className={styles.academicBentoGrid}>
            {/* Card 1: University & Degree Track */}
            <div className={styles.bentoCol}>
              <div className={styles.bentoCard}>
                <div className={styles.bentoCardTop}>
                  <span className={styles.bentoTag}>Undergraduate Degree</span>
                  <div className={styles.bentoIconWrap}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                </div>
                <h4 className={styles.bentoHeading}>{universityName}</h4>
                <p className={styles.bentoSubtext}>{degree}</p>
                <div className={styles.bentoMetaPill}>
                  <span className={styles.metaLabel}>Current Term</span>
                  <span className={styles.metaVal}>{yearSem}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Cumulative CGPA Performance */}
            <div className={styles.bentoCol}>
              <div className={`${styles.bentoCard} ${styles.bentoCardHighlight}`}>
                <div className={styles.bentoCardTop}>
                  <span className={styles.bentoTag}>Academic Performance</span>
                  <div className={styles.bentoIconWrap}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
                <div className={styles.cgpaBlock}>
                  <span className={styles.cgpaNumber}>{data?.university?.cgpa || '9.38'}</span>
                  <span className={styles.cgpaScale}>/ 10.0 CGPA</span>
                </div>
                <p className={styles.cgpaCaption}>Cumulative Academic Performance</p>
                <div className={styles.semScoresRow}>
                  <span className={styles.semPill}>Sem 1: <strong>{data?.university?.sem1 || '9.43'}</strong></span>
                  <span className={styles.semPill}>Sem 2: <strong>{data?.university?.sem2 || '9.35'}</strong></span>
                </div>
              </div>
            </div>

            {/* Card 3: Foundational Schooling */}
            <div className={styles.bentoCol}>
              <div className={styles.bentoCard}>
                <div className={styles.bentoCardTop}>
                  <span className={styles.bentoTag}>Foundational Schooling</span>
                  <div className={styles.bentoIconWrap}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                      <path d="M6 6h10" />
                      <path d="M6 10h10" />
                    </svg>
                  </div>
                </div>
                <h4 className={styles.bentoHeading}>{schoolName}</h4>
                <p className={styles.bentoSubtext}>Senior Secondary Board Curriculum</p>
                <div className={styles.schoolScorePill}>
                  <span className={styles.scoreItem}>Class 10: <strong>{data?.school?.class10 || '85.5%'}</strong></span>
                  <span className={styles.scoreDivider}>•</span>
                  <span className={styles.scoreItem}>Class 12: <strong>{data?.school?.class12 || '75.8%'}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

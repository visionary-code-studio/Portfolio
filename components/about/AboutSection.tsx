'use client';

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
    tag: 'LEARN',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    ),
  },
  {
    num: '02',
    label: 'FULL-STACK DEVELOPER',
    tag: 'CODE',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    num: '03',
    label: 'AIML ENGINEER',
    tag: 'AI/ML',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <rect width="6" height="6" x="9" y="9" rx="1" />
        <path d="M15 2v2" />
        <path d="M15 20v2" />
        <path d="M2 15h2" />
        <path d="M2 9h2" />
        <path d="M20 15h2" />
        <path d="M20 9h2" />
        <path d="M9 2v2" />
        <path d="M9 20v2" />
      </svg>
    ),
  },
  {
    num: '04',
    label: 'GRAPHIC DESIGNER',
    tag: 'VISUAL',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 19 7-7 3 3-7 7-3-3z" />
        <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="m2 2 7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    num: '05',
    label: 'UI & UX DESIGNER',
    tag: 'SYSTEM',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
];

export default function AboutSection({ data }: AboutProps) {
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

  return (
    <section className={styles.section} id="about">
      {/* Left Column: Manifesto & Narrative */}
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
      </div>

      {/* Right Column: Identity Hangtag Card + Academic Track */}
      <div className={styles.right}>
        <ScrollReveal variant="fadeUp">
          <div className={styles.hangtagCard}>
            {/* Top Cord Assembly (Inspired by Reference Image 1) */}
            <div className={styles.tagCordAssembly} aria-hidden="true">
              <div className={styles.tagPin} />
              <div className={styles.tagCord} />
            </div>

            {/* Main Tag Body in Archival Cream with Black and White Interplay */}
            <div className={styles.tagBody}>
              {/* Grommet Eyelet */}
              <div className={styles.tagEyelet} aria-hidden="true" />

              {/* Tag Header Metadata */}
              <div className={styles.tagHeader}>
                <div className={styles.tagMetaLeft}>
                  <span className={styles.tagLabelSmall}>SPEC. NO 2026 // ROLE TAG</span>
                  <span className={styles.tagBrandSmall}>VAIBHAV SHAW</span>
                </div>
                <div className={styles.tagMetaRight}>
                  <span className={styles.tagStatusDot} />
                  <span className={styles.tagStatusText}>VERIFIED</span>
                </div>
              </div>

              {/* 5 Identity Role Rows */}
              <div className={styles.tagList}>
                {identityPillars.map((item) => (
                  <div key={item.num} className={styles.tagRow}>
                    <div className={styles.tagRowLeft}>
                      <span className={styles.tagRowNum}>{item.num}</span>
                      <span className={styles.tagRowIcon}>{item.icon}</span>
                      <span className={styles.tagRowLabel}>{item.label}</span>
                    </div>
                    <span className={styles.tagRowBadge}>{item.tag}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Industrial Barcode & Spec Stamp (Reference Image 1) */}
              <div className={styles.tagFooter}>
                <div className={styles.barcodeTrack} aria-hidden="true">
                  <span className={styles.b1} />
                  <span className={styles.b3} />
                  <span className={styles.b2} />
                  <span className={styles.b1} />
                  <span className={styles.b4} />
                  <span className={styles.b1} />
                  <span className={styles.b2} />
                  <span className={styles.b3} />
                  <span className={styles.b1} />
                  <span className={styles.b2} />
                  <span className={styles.b4} />
                  <span className={styles.b1} />
                  <span className={styles.b3} />
                  <span className={styles.b2} />
                  <span className={styles.b1} />
                  <span className={styles.b4} />
                  <span className={styles.b2} />
                  <span className={styles.b1} />
                  <span className={styles.b3} />
                  <span className={styles.b1} />
                  <span className={styles.b4} />
                  <span className={styles.b2} />
                </div>
                <div className={styles.tagFooterMeta}>
                  <span className={styles.tagFooterSerial}>VS-2026 // DEV SPECIFICATION</span>
                  <span className={styles.tagFooterOrigin}>SNU · KOLKATA, IN</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="card" delay={0.15} className={styles.academic}>
          <div className={styles.academicHeader}>
            <span className={styles.academicTitle}>Academic Dossier</span>
            <span className={styles.academicStatus}>Active Standing</span>
          </div>
          <ScrollStagger staggerDelay={0.05}>
            {academic.map((row) => (
              <ScrollStaggerItem key={row.label} className={styles.academicRow}>
                <span className={styles.academicLabel}>{row.label}</span>
                <span className={styles.academicValue}>{row.value}</span>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>
        </ScrollReveal>
      </div>
    </section>
  );
}

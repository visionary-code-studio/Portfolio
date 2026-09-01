'use client';

import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from '@/components/ui/ScrollTriggered';
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
  { num: '01', label: 'Student & Researcher' },
  { num: '02', label: 'Full-Stack Developer' },
  { num: '03', label: 'AIML Pipeline Builder' },
  { num: '04', label: 'Product & Visual Designer' },
  { num: '05', label: 'Continuous Problem Solver' },
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
          <div className={styles.philosophy}>
            <p className={styles.philosophyText}>
              &ldquo;{tagline}&rdquo;
            </p>
            <p className={styles.philosophyAttr}>— Operational Mantra</p>
          </div>
        </ScrollReveal>
      </div>

      {/* Right Column: Identity Pillars + Academic Track */}
      <div className={styles.right}>
        <ScrollStagger staggerDelay={0.07} className={styles.identityList}>
          {identityPillars.map((item) => (
            <ScrollStaggerItem key={item.num}>
              <div className={styles.identityItem}>
                <span className={styles.identityNum}>{item.num}</span>
                <span className={styles.identityLabel}>{item.label}</span>
              </div>
            </ScrollStaggerItem>
          ))}
        </ScrollStagger>

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

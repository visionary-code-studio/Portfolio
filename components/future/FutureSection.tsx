'use client';

import Card3D from '@/components/ui/Card3D';
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from '@/components/ui/ScrollTriggered';
import styles from './FutureSection.module.css';

interface Pillar {
  num: string;
  label: string;
  text: string;
}

interface FutureProps {
  items?: Pillar[];
}

const defaultPillars: Pillar[] = [
  {
    num: '01',
    label: 'Build',
    text: "AI systems that actually solve real problems. Products that start as ideas at 2am and ship before the semester ends. Tools that make other developers' lives 10x easier.",
  },
  {
    num: '02',
    label: 'Learn',
    text: 'Physics-informed machine learning. The mathematics behind why models work. System design at scale. The intersection of engineering and art that most people never find.',
  },
  {
    num: '03',
    label: 'Explore',
    text: 'Blockchain development beyond the hype. Agentic AI workflows. Game development as a medium for ideas. Research that turns curiosity into something publishable.',
  },
  {
    num: '04',
    label: 'Become',
    text: 'An engineer who builds things that last. A creator who communicates ideas visually. Someone who bridges the gap between technical depth and human clarity.',
  },
];

export default function FutureSection({ items }: FutureProps) {
  const pillars = items && items.length > 0 ? items : defaultPillars;

  return (
    <section className={styles.section} id="future">
      <ScrollReveal variant="fadeUp" className={styles.intro}>
        <div className={styles.sectionMeta}>
          <span className={styles.starMotif}>✦</span>
          <span>07 — What&apos;s Next</span>
        </div>
        <h2 className={styles.sectionTitle}>What&apos;s Next?</h2>
        <p className={styles.openingLine}>
          I don&apos;t have every answer.{' '}
          <strong>I have better questions.</strong>
        </p>
      </ScrollReveal>

      <ScrollStagger staggerDelay={0.1} className={styles.pillars}>
        {pillars.map((p) => (
          <ScrollStaggerItem key={p.num} style={{ display: 'flex' }}>
            <Card3D className={styles.card3DWrap} intensity={10} glare={true}>
              <div className={styles.pillarInner}>
                <div className={styles.pillarTop}>
                  <span className={styles.pillarNum}>{p.num} // MANIFESTO</span>
                  <span className={styles.pillarTag}>Future Pillar</span>
                </div>
                <h3 className={styles.pillarLabel}>{p.label}</h3>
                <span className={styles.pillarAccent} />
                <p className={styles.pillarText}>{p.text}</p>
              </div>
            </Card3D>
          </ScrollStaggerItem>
        ))}
      </ScrollStagger>
    </section>
  );
}

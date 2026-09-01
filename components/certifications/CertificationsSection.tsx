'use client';

import { useState } from 'react';
import Image from 'next/image';
import Card3D from '@/components/ui/Card3D';
import ScrollImageReveal from '@/components/ui/ScrollImageReveal';
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from '@/components/ui/ScrollTriggered';
import styles from './Certifications.module.css';
import type { Certification } from '@/types';

interface Props {
  items: Certification[];
  onOpen: (item: Certification) => void;
}

export default function CertificationsSection({ items, onOpen }: Props) {
  const [active, setActive] = useState('All');

  // Compute category counts dynamically
  const catCounts: { [key: string]: number } = { All: items.length };
  items.forEach((c) => {
    catCounts[c.category] = (catCounts[c.category] || 0) + 1;
  });

  const categories = Object.keys(catCounts);

  const filtered = active === 'All'
    ? items
    : items.filter((c) => c.category === active);

  return (
    <section className={styles.section} id="certs">
      <div className={styles.header}>
        <div className={styles.sectionMeta}>
          <span className={styles.starMotif}>✦</span>
          <span>05 — The Proof</span>
        </div>
        <h2 className={styles.sectionTitle}>The Proof</h2>
        <p className={styles.subtitle}>Verified engineering and academic credentials.</p>

        {/* Category Filters with Counts */}
        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${active === cat ? styles.active : ''}`}
              onClick={() => setActive(cat)}
              data-cursor-hover
            >
              <span>{cat}</span>
              <span className={styles.filterCount}>[{catCounts[cat]}]</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Perspective Document Grid */}
      <ScrollStagger staggerDelay={0.09} className={styles.grid}>
        {filtered.map((cert, i) => (
          <ScrollStaggerItem key={cert.id} style={{ display: 'flex' }}>
            <Card3D
              className={styles.card3DWrap}
              intensity={12}
              onClick={() => onOpen(cert)}
              glare={true}
            >
              <div
                className={styles.cardInner}
                data-cursor-hover
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpen(cert)}
                aria-label={`View certificate: ${cert.title}`}
              >
                <div className={styles.cardTop}>
                  <span className={styles.verifiedBadge}>
                    <span>✓</span>
                    <span>Verified Artifact</span>
                  </span>
                  <span className={styles.cardYear}>{cert.year}</span>
                </div>

                <div className={styles.cardThumb}>
                  {cert.preview ? (
                    <ScrollImageReveal direction="up" delay={(i % 3) * 120} glare={true}>
                      <Image
                        src={cert.preview}
                        alt={cert.title}
                        fill
                        className={styles.cardThumbImg}
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      />
                    </ScrollImageReveal>
                  ) : (
                    <div className={styles.thumbPlaceholder}>
                      <span className={styles.thumbLetter}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                  <div className={styles.cardOverlay}>
                    <span className={styles.viewLabel}>Inspect Document ↗</span>
                  </div>
                </div>

                <div className={styles.cardInfo}>
                  <span className={styles.cardIssuer}>{cert.issuer}</span>
                  <h3 className={styles.cardTitle}>{cert.title}</h3>
                  {cert.credentialId && (
                    <span className={styles.credentialId}>ID: {cert.credentialId}</span>
                  )}
                </div>
              </div>
            </Card3D>
          </ScrollStaggerItem>
        ))}
      </ScrollStagger>
    </section>
  );
}

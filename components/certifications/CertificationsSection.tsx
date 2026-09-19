'use client';

import { useState } from 'react';
import Image from 'next/image';
import Card3D from '@/components/ui/Card3D';
import ScrollImageReveal from '@/components/ui/ScrollImageReveal';
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from '@/components/ui/ScrollTriggered';
import { resolveAutoPreview, generateDocumentPreviewSvg } from '@/lib/previewEngine';
import styles from './Certifications.module.css';
import type { Certification } from '@/types';

interface Props {
  items: Certification[];
  onOpen: (item: Certification) => void;
}

function CertCardThumb({
  previewSrc,
  fallbackSrc,
  title,
  delay,
}: {
  previewSrc: string;
  fallbackSrc: string;
  title: string;
  delay: number;
}) {
  const [imgSrc, setImgSrc] = useState(previewSrc);
  const [errored, setErrored] = useState(false);

  return (
    <div className={styles.cardThumb}>
      <ScrollImageReveal direction="up" delay={delay} glare={true}>
        <Image
          src={errored ? fallbackSrc : imgSrc}
          alt={title}
          fill
          unoptimized={true}
          onError={() => {
            if (!errored) {
              setErrored(true);
              setImgSrc(fallbackSrc);
            }
          }}
          className={styles.cardThumbImg}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        />
      </ScrollImageReveal>
      <div className={styles.cardOverlay}>
        <span className={styles.viewLabel}>Inspect Document ↗</span>
      </div>
    </div>
  );
}

export default function CertificationsSection({ items, onOpen }: Props) {
  const [active, setActive] = useState('All');

  // Base standard categories ensuring "Campus Ambassador" is prominently featured
  const standardCategories = ['All', 'Campus Ambassador', 'AI / ML', 'Hackathon', 'Academic', 'Bootcamp & Workshops'];

  // Compute category counts dynamically
  const catCounts: { [key: string]: number } = { All: items.length, 'Campus Ambassador': 0 };
  items.forEach((c) => {
    if (c.category) {
      catCounts[c.category] = (catCounts[c.category] || 0) + 1;
    }
  });

  // Merge standard list and any dynamic categories discovered from uploaded items
  const dynamicCategories = Object.keys(catCounts);
  const categories = Array.from(new Set([...standardCategories, ...dynamicCategories])).filter(
    (cat) => cat === 'All' || cat === 'Campus Ambassador' || (catCounts[cat] && catCounts[cat] > 0)
  );

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
        <p className={styles.subtitle}>Verified engineering, ambassador and academic credentials.</p>

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
              <span className={styles.filterCount}>[{catCounts[cat] || 0}]</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Perspective Document Grid */}
      <ScrollStagger staggerDelay={0.09} className={styles.grid}>
        {filtered.map((cert, i) => {
          const autoResolved = resolveAutoPreview(
            cert.preview || cert.file,
            cert.title,
            cert.issuer,
            cert.category
          );
          const previewSrc = autoResolved.previewUrl;
          const fallbackVector = generateDocumentPreviewSvg({
            title: cert.title,
            issuer: cert.issuer || 'Verified Credential',
            category: cert.category,
            format: autoResolved.detectedFormat.ext,
          });

          return (
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
                    <div className={styles.cardTopLeft}>
                      <span className={styles.verifiedBadge}>
                        <span>✓</span>
                        <span>{cert.category || 'Verified Artifact'}</span>
                      </span>
                      <span
                        className={styles.formatTag}
                        style={{
                          borderColor: autoResolved.detectedFormat.color,
                          color: autoResolved.detectedFormat.color,
                        }}
                      >
                        {autoResolved.detectedFormat.ext.toUpperCase()}
                      </span>
                    </div>
                    <span className={styles.cardYear}>{cert.year}</span>
                  </div>

                  <CertCardThumb
                    previewSrc={previewSrc}
                    fallbackSrc={fallbackVector}
                    title={cert.title}
                    delay={(i % 3) * 120}
                  />

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
          );
        })}
      </ScrollStagger>
    </section>
  );
}

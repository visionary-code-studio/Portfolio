'use client';

import { useState } from 'react';
import styles from './Interests.module.css';

interface InterestItem {
  text: string;
  size: string;
  desc?: string;
  category?: string;
  subdomains?: string[];
}

const defaultInterests: InterestItem[] = [
  {
    text: 'AI / Machine Learning',
    size: 'xl',
    desc: 'Deep Learning, LLMs, Neural Networks, Computer Vision & Transformers.',
    category: 'AI / ML',
    subdomains: ['Transformers', 'Autonomous Agents', 'Computer Vision', 'PyTorch'],
  },
  {
    text: 'Agentic Workflows',
    size: 'lg',
    desc: 'Autonomous multi-agent orchestration, tool use, and cognitive memory chains.',
    category: 'AI / ML',
    subdomains: ['LangChain', 'Function Calling', 'RAG Pipelines', 'Evaluations'],
  },
  {
    text: 'Distributed Systems',
    size: 'md',
    desc: 'Scalable backend architectures, fault tolerance, microservices, and databases.',
    category: 'Systems',
    subdomains: ['Next.js', 'REST APIs', 'PostgreSQL', 'Docker'],
  },
  {
    text: 'Creative Technology',
    size: 'xl',
    desc: 'Interactive 3D WebGL, modern editorial UI/UX, and generative motion design.',
    category: 'Creative',
    subdomains: ['Three.js', 'Canvas 2D/3D', 'Motion Physics', 'Editorial Systems'],
  },
  {
    text: 'Open Source',
    size: 'md',
    desc: 'Contributing to developer tooling, community hackathons, and reproducible research.',
    category: 'Community',
    subdomains: ['GitHub', 'Hackathons', 'Community Mentoring'],
  },
  {
    text: 'Product Engineering',
    size: 'lg',
    desc: 'Taking research ideas from concept to deployed production-ready applications.',
    category: 'Systems',
    subdomains: ['Full-Stack', 'UI Architecture', 'User Journey Mapping'],
  },
  {
    text: 'Mathematical Modeling',
    size: 'sm',
    desc: 'Linear algebra, calculus, statistical inference, and algorithmic optimizations.',
    category: 'AI / ML',
    subdomains: ['Matrix Calculus', 'Gradient Descent', 'Probability'],
  },
  {
    text: 'Spatial Computing',
    size: 'sm',
    desc: '3D scene graph rendering, interactive shaders, and immersive viewport interfaces.',
    category: 'Creative',
    subdomains: ['Perspective Projections', 'GLSL Shaders', 'WebGL'],
  },
];

interface Props {
  items?: InterestItem[];
}

const filterCategories = ['All', 'AI / ML', 'Systems', 'Creative', 'Community'];

export default function InterestsSection({ items }: Props) {
  const data = items && items.length > 0 ? items : defaultInterests;
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedWord, setSelectedWord] = useState<InterestItem>(data[0]);

  const filtered = activeFilter === 'All'
    ? data
    : data.filter((item) => (item.category || 'AI / ML') === activeFilter);

  return (
    <section className={styles.section} id="interests">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.sectionMeta}>
            <span className={styles.starMotif}>✦</span>
            <span>06 — What I&apos;m Into</span>
          </div>
          <h2 className={styles.sectionTitle}>What I&apos;m Into</h2>
          <p className={styles.subtitle}>
            A kinetic domain cloud of technical obsession and creative curiosity.
          </p>
        </div>

        {/* Filter chips */}
        <div className={styles.filters}>
          {filterCategories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
              onClick={() => setActiveFilter(cat)}
              data-cursor-hover
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Typographic Word Cloud */}
      <div className={styles.cloudContainer}>
        {filtered.map((item, idx) => {
          const isSelected = selectedWord.text === item.text;
          const sizeClass = styles[`size-${item.size || 'md'}`] || styles['size-md'];

          return (
            <button
              key={idx}
              className={`${styles.wordItem} ${sizeClass} ${isSelected ? styles.activeWord : ''}`}
              onClick={() => setSelectedWord(item)}
              data-cursor-hover
              aria-label={`Explore ${item.text}`}
            >
              <span>{item.text}</span>
            </button>
          );
        })}
      </div>

      {/* Progressive Disclosure: Engineering Detail Box */}
      {selectedWord && (
        <div className={styles.detailBox}>
          <div className={styles.detailLeft}>
            <span className={styles.detailBadge}>
              Domain Focus // {selectedWord.category || 'Technology'}
            </span>
            <h3 className={styles.detailTitle}>{selectedWord.text}</h3>
            <p className={styles.detailDesc}>
              {selectedWord.desc || 'Active research and technical engineering exploration.'}
            </p>
          </div>

          <div className={styles.detailPills}>
            {(selectedWord.subdomains || ['Research', 'Engineering', 'Architecture']).map((sub) => (
              <span key={sub} className={styles.detailPill}>
                {sub}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/ScrollTriggered';
import styles from './Interests.module.css';

export interface InterestItem {
  text: string;
  size: string;
  desc?: string;
  category?: string;
  subdomains?: string[];
}

export function getEffectiveCategory(cat?: string): 'AI / ML' | 'Systems' | 'Creative' | 'Community' {
  if (!cat) return 'AI / ML';
  const c = cat.toLowerCase();
  if (
    c.includes('ai') ||
    c.includes('ml') ||
    c.includes('learn') ||
    c.includes('neural') ||
    c.includes('science') ||
    c.includes('research') ||
    c.includes('piml') ||
    c.includes('model')
  ) {
    return 'AI / ML';
  }
  if (
    c.includes('system') ||
    c.includes('tech') ||
    c.includes('web') ||
    c.includes('block') ||
    c.includes('soft') ||
    c.includes('full') ||
    c.includes('back') ||
    c.includes('data')
  ) {
    return 'Systems';
  }
  if (
    c.includes('creat') ||
    c.includes('design') ||
    c.includes('game') ||
    c.includes('visual') ||
    c.includes('spatial') ||
    c.includes('shader') ||
    c.includes('ui')
  ) {
    return 'Creative';
  }
  if (
    c.includes('commun') ||
    c.includes('open') ||
    c.includes('start') ||
    c.includes('biz') ||
    c.includes('business') ||
    c.includes('innov') ||
    c.includes('hack')
  ) {
    return 'Community';
  }
  return 'AI / ML';
}

const defaultInterests: InterestItem[] = [
  {
    text: 'AI & Deep Learning',
    size: 'xl',
    desc: 'Neural networks, transformer architectures, computer vision, and foundation models.',
    category: 'AI / ML',
    subdomains: ['Transformers', 'PyTorch', 'Computer Vision', 'Fine-Tuning'],
  },
  {
    text: 'Agentic Workflows',
    size: 'lg',
    desc: 'Autonomous multi-agent orchestration, tool use, and cognitive memory chains.',
    category: 'AI / ML',
    subdomains: ['Autonomous Agents', 'LangChain', 'Tool Calling', 'RAG Pipelines'],
  },
  {
    text: 'Distributed Systems',
    size: 'xl',
    desc: 'Resilient backend architectures, microservices, databases, and high-throughput APIs.',
    category: 'Systems',
    subdomains: ['Microservices', 'PostgreSQL', 'Docker', 'REST & GraphQL'],
  },
  {
    text: 'Full-Stack Web',
    size: 'lg',
    desc: 'Next.js applications, serverless edge runtimes, modern state management, and real-time sockets.',
    category: 'Systems',
    subdomains: ['Next.js', 'React', 'TypeScript', 'Node.js'],
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
    subdomains: ['GitHub', 'Hackathons', 'Community Mentoring', 'Documentation'],
  },
  {
    text: 'Blockchain & Web3',
    size: 'md',
    desc: 'Cryptographic trust, smart contracts, deterministic state machines, and decentralized protocols.',
    category: 'Systems',
    subdomains: ['Smart Contracts', 'EVM', 'Cryptography', 'Solidity'],
  },
  {
    text: 'Product Innovation',
    size: 'lg',
    desc: 'Taking research ideas from concept to deployed production-ready applications.',
    category: 'Community',
    subdomains: ['Product Strategy', 'UI Architecture', 'Rapid Prototyping'],
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
  {
    text: 'Game Development',
    size: 'md',
    desc: 'Interactive physics loops, mechanics design, shader math, and procedural generation.',
    category: 'Creative',
    subdomains: ['Game Loops', 'Shaders', 'Physics Engines'],
  },
  {
    text: 'Physics-Informed ML',
    size: 'lg',
    desc: 'Differential equations embedded inside neural operators for physical and scientific simulations.',
    category: 'AI / ML',
    subdomains: ['Differential Equations', 'Neural Operators', 'Scientific Computing'],
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
    : data.filter((item) => getEffectiveCategory(item.category) === activeFilter);

  const handleFilterChange = (cat: string) => {
    setActiveFilter(cat);
    const newFiltered = cat === 'All'
      ? data
      : data.filter((item) => getEffectiveCategory(item.category) === cat);
    if (newFiltered.length > 0) {
      // If current selection is not in the new filtered items, select first item
      const stillInList = newFiltered.find((item) => item.text === selectedWord?.text);
      if (!stillInList) {
        setSelectedWord(newFiltered[0]);
      }
    }
  };

  return (
    <section className={styles.section} id="interests">
      <div className={styles.header}>
        <ScrollReveal variant="fadeUp" className={styles.headerLeft}>
          <div className={styles.sectionMeta}>
            <span className={styles.starMotif}>✦</span>
            <span>06 — What I&apos;m Into</span>
          </div>
          <h2 className={styles.sectionTitle}>What I&apos;m Into</h2>
          <p className={styles.subtitle}>
            A kinetic domain cloud of technical obsession and creative curiosity.
          </p>
        </ScrollReveal>

        {/* Filter chips */}
        <div className={styles.filters}>
          {filterCategories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
              onClick={() => handleFilterChange(cat)}
              data-cursor-hover
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Typographic Word Cloud */}
      <div className={styles.cloudContainer}>
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => {
            const isSelected = selectedWord?.text === item.text;
            const sizeClass = styles[`size-${item.size || 'md'}`] || styles['size-md'];

            return (
              <motion.button
                key={item.text}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -8 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className={`${styles.wordItem} ${sizeClass} ${isSelected ? styles.activeWord : ''}`}
                onClick={() => setSelectedWord(item)}
                data-cursor-hover
                aria-label={`Explore ${item.text}`}
              >
                <span>{item.text}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Progressive Disclosure: Engineering Detail Box */}
      {selectedWord && (
        <div className={styles.detailBox}>
          <div className={styles.detailLeft}>
            <span className={styles.detailBadge}>
              Domain Focus — {getEffectiveCategory(selectedWord.category)}
            </span>
            <h3 className={styles.detailTitle}>{selectedWord.text}</h3>
            <p className={styles.detailDesc}>
              {selectedWord.desc || 'Active research and technical engineering exploration.'}
            </p>
          </div>

          <div className={styles.detailPills}>
            {(selectedWord.subdomains && selectedWord.subdomains.length > 0
              ? selectedWord.subdomains
              : ['Engineering', 'Architecture', 'Innovation']
            ).map((sub) => (
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

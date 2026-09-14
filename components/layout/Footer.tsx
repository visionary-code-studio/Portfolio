'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

interface ProfileData {
  fullName?: string;
  email?: string;
  location?: string;
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
    board?: string;
  };
  socials?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    x?: string;
  };
}

interface FooterProps {
  data?: ProfileData;
  socials?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    x?: string;
  };
}

// Open-source Tech Stack with SVGs for the dynamic hover ribbon
const techStack = [
  {
    name: 'Python',
    category: 'AI & Core',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.753h5.814v.826H3.896S0 5.787 0 11.905c0 6.12 3.402 5.908 3.402 5.908h2.033v-2.857s-.11-3.402 3.346-3.402h5.758v-.848h-8.08s-2.42-.275-2.42-3.606c0-3.332 2.91-3.23 2.91-3.23h10.965S24 3.65 24 9.77c0 6.12-3.415 5.93-3.415 5.93h-1.077v-2.857s.07-3.402-3.385-3.402h-5.758v.848h8.08s2.42.276 2.42 3.607c0 3.33-2.91 3.23-2.91 3.23H6.99S0 17.35 0 11.23C0 5.11 3.402 5.3 3.402 5.3h1.077v2.858s-.07 3.4 3.385 3.4h5.758v-.847H5.542s-2.42-.276-2.42-3.607c0-3.33 2.91-3.23 2.91-3.23h11.914z"/>
      </svg>
    ),
  },
  {
    name: 'PyTorch',
    category: 'Deep Learning',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.783 0a.375.375 0 0 0-.276.12L9.27 3.357a.375.375 0 0 0 .265.64h2.518a.375.375 0 0 1 .375.375v2.81a.375.375 0 0 0 .64.266l3.237-3.238A.375.375 0 0 0 16.039 4h-2.88a.375.375 0 0 1-.376-.375V.375A.375.375 0 0 0 12.408 0h.375zM12.004 5.96a8.04 8.04 0 1 0 7.828 9.878.375.375 0 0 0-.73-.173 7.29 7.29 0 1 1-7.098-9.705h.001c.207 0 .375-.168.375-.375v-.018a.375.375 0 0 0-.376-.375v.768z"/>
      </svg>
    ),
  },
  {
    name: 'Next.js',
    category: 'Framework',
    icon: (
      <svg width="24" height="24" viewBox="0 0 180 180" fill="currentColor">
        <mask height="180" id="mask0" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
          <circle cx="90" cy="90" fill="black" r="90" />
        </mask>
        <g mask="url(#mask0)">
          <circle cx="90" cy="90" data-circle="true" fill="currentColor" r="90" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
          <rect fill="white" height="72" width="12" x="115" y="54" />
        </g>
      </svg>
    ),
  },
  {
    name: 'React',
    category: 'UI Architecture',
    icon: (
      <svg width="24" height="24" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
        <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    category: 'Languages',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm16.516 15.047c.29-.02.576.03.842.148.266.117.492.293.66.516.168.223.277.48.316.758.04.277.012.56-.082.824-.094.266-.25.5-.453.691-.203.192-.445.336-.71.426-.266.09-.547.125-.829.102-.281-.024-.555-.106-.797-.242a2.3 2.3 0 0 1-.617-.551 2.5 2.5 0 0 1-.375-.762l1.64-.672c.04.145.117.278.223.387.106.11.238.188.383.227.145.04.297.043.441.011.145-.03.274-.097.375-.195.102-.098.168-.223.192-.359.023-.137.004-.278-.055-.403a.75.75 0 0 0-.25-.308c-.11-.082-.238-.137-.375-.164l-.945-.219c-.395-.086-.762-.27-1.063-.535-.3-.266-.516-.617-.625-1.016a3.06 3.06 0 0 1-.031-1.219c.078-.395.258-.758.523-1.055.266-.297.605-.516.992-.633.387-.117.797-.129 1.192-.035.394.094.75.297 1.031.59.281.293.477.66.566 1.063l-1.602.664a1.23 1.23 0 0 0-.32-.477 1.04 1.04 0 0 0-.523-.234 1.02 1.02 0 0 0-.578.078c-.168.082-.297.215-.367.383-.07.168-.07.355 0 .523.07.168.199.301.367.383.168.082.355.125.547.125l.89.207zm-7.668-5.32h5.137v1.547h-1.71v6.797H11.66v-6.797H9.973V9.727z"/>
      </svg>
    ),
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
      </svg>
    ),
  },
  {
    name: 'Docker',
    category: 'DevOps & Systems',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.714h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.186.186 0 00-.185.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185M23.99 12.03c-.115-.815-.77-1.427-1.574-1.503-.314-.03-.63.023-.915.15-.41-.54-.993-.935-1.67-.98-.828-.054-1.657.34-2.102 1.026-.065-.008-.13-.013-.197-.013H18.7c-.15 0-.294.03-.427.085-1.127.466-2.17.697-3.097.697-.68 0-1.258-.124-1.72-.37-.894-.476-1.543-1.378-1.737-2.41a4.27 4.27 0 00-.47-1.218 5.62 5.62 0 00-.915-1.19c-.352-.338-.763-.61-1.22-.806A3.87 3.87 0 007.41 5.2c-.378 0-.75.06-1.106.177-.66.216-1.23.63-1.637 1.192-.41.56-.63 1.24-.63 1.942v4.86c0 1.27.35 2.5 1.01 3.56.66 1.05 1.6 1.88 2.7 2.4 1.1.52 2.34.8 3.63.8 1.48 0 2.92-.37 4.16-1.07a10.9 10.9 0 003.12-2.73c.96-1.24 1.54-2.7 1.67-4.22h3.66z"/>
      </svg>
    ),
  },
  {
    name: 'OpenCV',
    category: 'Computer Vision',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="6.5" cy="16.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="17.5" cy="16.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    name: 'Hugging Face',
    category: 'Neural Models',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
      </svg>
    ),
  },
];

export default function Footer({ data, socials }: FooterProps) {
  const [copied, setCopied] = useState(false);

  const email = data?.email || 'vaibhavsnu@2029';
  const fullName = data?.fullName || 'Vaibhav Shaw';
  const university = data?.university?.name || 'Sister Nivedita University';
  const degree = data?.university?.degree || 'B.Tech CSE — AIML';
  const cgpa = data?.university?.cgpa || '9.38';
  const school = data?.school?.name || 'Bholananda National Vidyalaya';
  const classScores = data?.school?.class10 ? `10th: ${data.school.class10} · 12th: ${data.school.class12 || '75.8%'}` : '10th: 85.5% · 12th: 75.8%';
  const location = data?.location || 'Kolkata, India';

  const linkedin = socials?.linkedin || data?.socials?.linkedin || 'https://linkedin.com/in/vaibhav-shaw';
  const github = socials?.github || data?.socials?.github || 'https://github.com/visionary-code-studio';
  const instagram = socials?.instagram || data?.socials?.instagram || 'https://instagram.com/visionary_code_studio';
  const x = socials?.x || data?.socials?.x || 'https://x.com/vaibhavshaw';

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className={styles.footerWrap} id="contact">
      {/* ── 1. Top Curved Dark CTA Banner (Matching User Reference Image) ── */}
      <div className={styles.topCardWrap}>
        <div className={styles.topCardAura} aria-hidden="true" />
        <div className={styles.topCard}>
          <div className={styles.availPill}>
            <span className={styles.availDot} />
            <span>Available for Projects &amp; Research</span>
          </div>

          <h2 className={styles.ctaHeading}>
            Need an intelligent AI system or high-performance frontend build?
          </h2>

          <p className={styles.ctaSub}>
            I build fast, scalable web applications, intelligent neural systems, and practical automated solutions for modern teams and brands.
          </p>

          <a
            href={`mailto:${email}`}
            className={styles.inquiryBtn}
            data-cursor-hover
          >
            <span>Send Inquiry</span>
            <span className={styles.inquiryArrow}>↗</span>
          </a>
        </div>
      </div>

      {/* ── 2. Dynamic Kinetic Tech Stack Ribbon (Hover Interactive) ────── */}
      <div className={styles.ribbonSection}>
        <div className={styles.ribbonLabel}>
          <span>Core Engineering &amp; AI Stack</span>
          <span className={styles.ribbonDivider} />
        </div>

        <div className={styles.ribbonTrackWrapper}>
          <div className={styles.ribbonTrack}>
            {/* Duplicated list for seamless infinite marquee loop */}
            {[...techStack, ...techStack].map((item, idx) => (
              <div key={`${item.name}-${idx}`} className={styles.ribbonItem} data-cursor-hover>
                <div className={styles.ribbonIcon}>{item.icon}</div>
                <div className={styles.ribbonMeta}>
                  <span className={styles.ribbonName}>{item.name}</span>
                  <span className={styles.ribbonCategory}>{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Bottom Light Stage (Matching User Reference Image) ───────── */}
      <div className={styles.bottomStage}>
        <div className={styles.bottomGrid}>
          {/* Left Block: Display Name & Personal Message */}
          <div className={styles.leftSignoff}>
            <h3 className={styles.displayName}>{fullName}</h3>
            <p className={styles.signoffText}>
              Thank you for exploring my portfolio! I hope you found some interesting insights here and we could get to know each other from a personal perspective — See you soon!
            </p>

            <div className={styles.actionBtnGroup}>
              <a
                href={`mailto:${email}`}
                className={styles.scheduleBtn}
                data-cursor-hover
              >
                <span>Schedule a discussion</span>
                <span>📅</span>
              </a>

              <button
                onClick={copyEmail}
                className={styles.copyBtn}
                data-cursor-hover
              >
                <span>{copied ? '✓ Email Copied' : 'Direct Email'}</span>
              </button>
            </div>
          </div>

          {/* Right Block: Nav Links, Scroll-to-Top, and Social Icons */}
          <div className={styles.rightNavBlock}>
            <div className={styles.navRow}>
              <nav className={styles.footerNavLinks}>
                <button onClick={() => scrollToSection('about')} className={styles.navLinkItem} data-cursor-hover>About</button>
                <button onClick={() => scrollToSection('ppt')} className={styles.navLinkItem} data-cursor-hover>Archive</button>
                <button onClick={() => scrollToSection('certs')} className={styles.navLinkItem} data-cursor-hover>Proof</button>
                <button onClick={() => scrollToSection('contact')} className={styles.navLinkItem} data-cursor-hover>Contacts</button>
                <Link href="/admin" className={styles.navLinkItem} data-cursor-hover>Admin</Link>
              </nav>

              {/* Square Scroll-To-Top Button */}
              <button
                onClick={scrollToTop}
                className={styles.scrollTopSquare}
                aria-label="Scroll to Top"
                data-cursor-hover
              >
                ↑
              </button>
            </div>

            {/* Square Rounded Dark Social Buttons */}
            <div className={styles.socialButtonsRow}>
              {/* GitHub */}
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.squareSocialBtn}
                aria-label="GitHub Profile"
                data-cursor-hover
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.squareSocialBtn}
                aria-label="LinkedIn Profile"
                data-cursor-hover
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.squareSocialBtn}
                aria-label="Instagram Profile"
                data-cursor-hover
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* X */}
              <a
                href={x}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.squareSocialBtn}
                aria-label="X Profile"
                data-cursor-hover
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Academic Dossier Ticker Ribbon */}
        <div className={styles.academicTicker}>
          <div className={styles.academicItem}>
            <span className={styles.academicLabel}>Institution</span>
            <span className={styles.academicValue}>{university} ({degree})</span>
          </div>
          <div className={styles.academicItem}>
            <span className={styles.academicLabel}>Academic Standing</span>
            <span className={styles.academicValue}>{cgpa} CGPA (Top Honors)</span>
          </div>
          <div className={styles.academicItem}>
            <span className={styles.academicLabel}>Senior Secondary</span>
            <span className={styles.academicValue}>{school} ({classScores})</span>
          </div>
          <div className={styles.academicItem}>
            <span className={styles.academicLabel}>Location</span>
            <span className={styles.academicValue}>{location}</span>
          </div>
        </div>

        {/* Bottom Copyright & Colophon Bar */}
        <div className={styles.colophonBar}>
          <span className={styles.copyrightText}>© 2026 {fullName}</span>
          <span className={styles.colophonNote}>Handcrafted with Next.js &amp; PyTorch</span>
        </div>
      </div>
    </footer>
  );
}

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

export default function Footer({ data, socials }: FooterProps) {
  const [currentTime, setCurrentTime] = useState('10:46:01 AM, GMT +5:30');
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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      });
      setCurrentTime(`${timeStr.toUpperCase()}, GMT +5:30`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
      <div className={styles.footerCard}>
        <div className={styles.ambientGlow} aria-hidden="true" />

        {/* ── 1. Top Floating Capsule Bar ────────────────────────── */}
        <div className={styles.topPillBar}>
          <div className={styles.pillLeft}>
            <div className={styles.pillLogoMark}>V</div>
            <div className={styles.pillDivider} />
            <span className={styles.pillSlogan}>
              Your next idea, beautifully designed and flawlessly built
            </span>
          </div>

          <div className={styles.pillSocials} aria-label="Official Social Networks">
            {/* Globe / Live Home */}
            <button
              onClick={scrollToTop}
              className={styles.pillSocialBtn}
              title="Live Portfolio Home"
              aria-label="Live Portfolio Home"
              data-cursor-hover
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>

            {/* LinkedIn */}
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pillSocialBtn}
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
              data-cursor-hover
            >
              <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
              </svg>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className={styles.pillSocialBtn}
              title="Send Direct Email"
              aria-label="Email Vaibhav"
              data-cursor-hover
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pillSocialBtn}
              title="Instagram Profile"
              aria-label="Instagram Profile"
              data-cursor-hover
            >
              <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pillSocialBtn}
              title="GitHub Profile"
              aria-label="GitHub Profile"
              data-cursor-hover
            >
              <svg width="14" height="14" viewBox="0 0 496 512" fill="currentColor">
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
              </svg>
            </a>

            {/* X */}
            <a
              href={x}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pillSocialBtn}
              title="X (Twitter) Profile"
              aria-label="X Profile"
              data-cursor-hover
            >
              <svg width="13" height="13" viewBox="0 0 512 512" fill="currentColor">
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── 2. Middle Main Grid ───────────────────────────── */}
        <div className={styles.mainGrid}>
          {/* Big Headline & CTA Buttons */}
          <div className={styles.calloutCol}>
            <div className={styles.headlineBlock}>
              <span className={styles.sectionTag}>08 // Direct Communication &amp; Finale</span>
              <h2 className={styles.bigHeadline}>
                LET&apos;S MAKE IT<br />HAPPEN NOW
              </h2>
              <div className={styles.emailDirectBox}>
                <span className={styles.emailPill}>{email}</span>
              </div>
            </div>

            <div className={styles.ctaGroup}>
              <a
                href={`mailto:${email}`}
                className={styles.startBtn}
                data-cursor-hover
              >
                <span>⚡ Start Now</span>
              </a>
              <button
                onClick={copyEmail}
                className={`${styles.callBtn} ${copied ? styles.copied : ''}`}
                data-cursor-hover
              >
                <span>{copied ? '✓ Email Copied' : 'Copy Email'}</span>
              </button>
            </div>
          </div>

          {/* NAVIGATE Column */}
          <div className={styles.navCol}>
            <span className={styles.colHeader}>NAVIGATE</span>
            <ul className={styles.linkList}>
              <li>
                <button onClick={() => scrollToSection('home')} className={styles.linkItem} data-cursor-hover>
                  <span className={styles.starIcon}>★</span>
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('identity')} className={styles.linkItem} data-cursor-hover>
                  <span className={styles.starIcon}>★</span>
                  <span>Me &amp; Identity</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className={styles.linkItem} data-cursor-hover>
                  <span className={styles.starIcon}>★</span>
                  <span>Philosophy</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('ppt')} className={styles.linkItem} data-cursor-hover>
                  <span className={styles.starIcon}>★</span>
                  <span>The Archive</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('certs')} className={styles.linkItem} data-cursor-hover>
                  <span className={styles.starIcon}>★</span>
                  <span>The Proof</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('interests')} className={styles.linkItem} data-cursor-hover>
                  <span className={styles.starIcon}>★</span>
                  <span>What I&apos;m Into</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('future')} className={styles.linkItem} data-cursor-hover>
                  <span className={styles.starIcon}>★</span>
                  <span>Future Vision</span>
                </button>
              </li>
            </ul>
          </div>

          {/* RESOURCES Column */}
          <div className={styles.navCol}>
            <span className={styles.colHeader}>RESOURCES</span>
            <ul className={styles.linkList}>
              <li>
                <a
                  href="/certs/cert-01.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkItem}
                  data-cursor-hover
                >
                  <span className={styles.starIcon}>★</span>
                  <span>Download CV / Resume</span>
                </a>
              </li>
              <li>
                <button onClick={() => scrollToSection('certs')} className={styles.linkItem} data-cursor-hover>
                  <span className={styles.starIcon}>★</span>
                  <span>Verified Credentials</span>
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('ppt')} className={styles.linkItem} data-cursor-hover>
                  <span className={styles.starIcon}>★</span>
                  <span>Presentation Decks</span>
                </button>
              </li>
              <li>
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkItem}
                  data-cursor-hover
                >
                  <span className={styles.starIcon}>★</span>
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <Link href="/admin" className={styles.linkItem} data-cursor-hover>
                  <span className={styles.starIcon}>★</span>
                  <span>Admin Control Center</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Academic Dossier Ticker Ribbon */}
        <div className={styles.academicTicker}>
          <div className={styles.academicItem}>
            <span className={styles.academicLabel}>University &amp; Degree</span>
            <span className={styles.academicValue}>{university} ({degree})</span>
          </div>
          <div className={styles.academicItem}>
            <span className={styles.academicLabel}>Cumulative CGPA</span>
            <span className={styles.academicValue}>{cgpa} (Top Standing)</span>
          </div>
          <div className={styles.academicItem}>
            <span className={styles.academicLabel}>Senior Secondary School</span>
            <span className={styles.academicValue}>{school} ({classScores})</span>
          </div>
          <div className={styles.academicItem}>
            <span className={styles.academicLabel}>Base Location</span>
            <span className={styles.academicValue}>{location}</span>
          </div>
        </div>

        {/* ── 3. Bottom Bar ─────────────────────────────────── */}
        <div className={styles.bottomBar}>
          <div className={styles.copyrightBlock}>
            <span className={styles.rightsLabel}>ALL RIGHTS RESERVED.</span>
            <h3 className={styles.brandCopyright}>© 2026 {fullName.toUpperCase()}</h3>
          </div>

          <div className={styles.bottomRight}>
            <div className={styles.timeBlock}>
              <span className={styles.timeLabel}>LOCAL TIME</span>
              <div className={styles.timeValue}>
                <span style={{ color: '#3b82f6' }}>★</span>
                <span>{currentTime}</span>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className={styles.scrollTopBtn}
              aria-label="Scroll back to top"
              title="Scroll to Top"
              data-cursor-hover
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

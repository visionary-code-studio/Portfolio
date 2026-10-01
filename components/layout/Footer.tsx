'use client';

import { useEffect, useState } from 'react';
import InquiryModal from '@/components/contact/InquiryModal';
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

// Skills & Tools with authentic vector icons for the dynamic hover ribbon
const techStack = [
  {
    name: 'AIML Engineer',
    category: 'Machine Learning & AI',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V11a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V9.5C7.8 8.8 7 7.5 7 6a4 4 0 0 1 4-4z" />
        <path d="M6 18a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2z" />
        <circle cx="12" cy="6" r="1.5" fill="currentColor" />
        <path d="M4 11h2M18 11h2M2 6h2M20 6h2" />
      </svg>
    ),
  },
  {
    name: 'Full-Stack Development',
    category: 'Web & Systems',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <path d="M7 8l-2 2 2 2M17 8l2 2-2 2M13 7l-2 6" />
      </svg>
    ),
  },
  {
    name: 'Graphic Designing',
    category: 'Visual & Creative',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 10 10 0 0 0 9.54-13.46M7.5 10.5h.01M16.5 10.5h.01M12 15h.01" />
      </svg>
    ),
  },
  {
    name: 'Canva',
    category: 'Brand & Visuals',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.2c3.12 0 5.38 1.95 5.38 4.75 0 2.92-2.58 5.75-6.52 7.15l-.66-1.52c3.12-1.12 4.96-3.15 4.96-5.18 0-1.68-1.28-2.82-3.16-2.82-2.78 0-5.22 2.5-5.22 5.58 0 1.98 1.25 3.12 2.82 3.12.85 0 1.62-.35 2.18-.85l.78 1.4c-.95.82-2.12 1.28-3.4 1.28-3.05 0-5.18-2.22-5.18-5.32 0-4.65 3.82-7.59 8.02-7.59z"/>
      </svg>
    ),
  },
  {
    name: 'MS Office',
    category: 'Productivity & Docs',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.5 2H3a1 1 0 0 0-1 1v8.5h9.5V2zm1 0v9.5H22V3a1 1 0 0 0-1-1h-8.5zM2 12.5V21a1 1 0 0 0 1 1h8.5v-9.5H2zm10.5 0V22H21a1 1 0 0 0 1-1v-8.5h-9.5z"/>
      </svg>
    ),
  },
  {
    name: 'Github',
    category: 'Version Control',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'Figma',
    category: 'UI/UX Prototyping',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm-8 4a4 4 0 0 1 4-4h4v4a4 4 0 0 1-4 4 4 4 0 0 1-4-4zm0-8a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zm8-4h4a4 4 0 1 1 0 8h-4V4zm-4 16a4 4 0 0 1-4-4h4v4z"/>
      </svg>
    ),
  },
  {
    name: 'Python',
    category: 'AI & Computational Core',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.753h5.814v.826H3.896S0 5.787 0 11.905c0 6.12 3.402 5.908 3.402 5.908h2.033v-2.857s-.11-3.402 3.346-3.402h5.758v-.848h-8.08s-2.42-.275-2.42-3.606c0-3.332 2.91-3.23 2.91-3.23h10.965S24 3.65 24 9.77c0 6.12-3.415 5.93-3.415 5.93h-1.077v-2.857s.07-3.402-3.385-3.402h-5.758v.848h8.08s2.42.276 2.42 3.607c0 3.33-2.91 3.23-2.91 3.23H6.99S0 17.35 0 11.23C0 5.11 3.402 5.3 3.402 5.3h1.077v2.858s-.07 3.4 3.385 3.4h5.758v-.847H5.542s-2.42-.276-2.42-3.607c0-3.33 2.91-3.23 2.91-3.23h11.914z"/>
      </svg>
    ),
  },
  {
    name: 'Tableau',
    category: 'Data Visualization',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.25 1.5h1.5v3.75h-1.5zM11.25 18.75h1.5V22.5h-1.5zM18.75 11.25H22.5v1.5h-3.75zM1.5 11.25h3.75v1.5H1.5zM6.5 6.5h1.5v3.25H6.5zM16 6.5h1.5v3.25H16zM6.5 14.25h1.5V17.5H6.5zM16 14.25h1.5V17.5H16zM10.5 7.5h3v9h-3z"/>
      </svg>
    ),
  },
  {
    name: 'XAMP PHP',
    category: 'Backend & Database',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-5 15.5H5V8.5h2.5c1.8 0 2.7.8 2.7 2.2 0 1.5-.9 2.3-2.7 2.3h-.5v2.5zm7 0h-2V8.5h2v2.8h1.8v-2.8h2v7h-2v-2.6H14v2.6zm6 0h-2V8.5h2.5c1.8 0 2.7.8 2.7 2.2 0 1.5-.9 2.3-2.7 2.3h-.5v2.5z"/>
      </svg>
    ),
  },
  {
    name: 'Firebase',
    category: 'Cloud & Auth',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.89 15.672L6.255.875A.75.75 0 0 1 7.63.593l3.208 6.012-6.948 9.067zm16.22 0l-1.93-12.21a.75.75 0 0 0-1.328-.358L3.25 18.067l8.28 4.673a1 1 0 0 0 .94 0l7.64-7.068zM14.07 8.78L12.56 5.95a.75.75 0 0 0-1.32.035L8.74 11.23l5.33-2.45z"/>
      </svg>
    ),
  },
  {
    name: 'Firebase Studio',
    category: 'App Development',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Campus Ambassador',
    category: 'Outreach & Community',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    name: 'Leadership',
    category: 'Strategy & Direction',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Google Cloud',
    category: 'Cloud Infrastructure',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/>
      </svg>
    ),
  },
  {
    name: 'ChatGPT',
    category: 'GenAI & Prompting',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.28 9.82a6.43 6.43 0 0 0-.53-5.06 6.57 6.57 0 0 0-6.17-3.23 6.46 6.46 0 0 0-4.63 2.05A6.5 6.5 0 0 0 6.3 2.14 6.58 6.58 0 0 0 1.7 5.38a6.45 6.45 0 0 0-.53 5.06 6.56 6.56 0 0 0 1.55 6.13 6.5 6.5 0 0 0 1.52 4.6 6.58 6.58 0 0 0 4.6 2.06 6.46 6.46 0 0 0 4.63-2.05 6.5 6.5 0 0 0 4.65 1.44 6.58 6.58 0 0 0 4.6-3.24 6.45 6.45 0 0 0 .53-5.06 6.56 6.56 0 0 0-.97-4.5zM12 14.5a2.5 2.5 0 1 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5z"/>
      </svg>
    ),
  },
  {
    name: 'Claude',
    category: 'Anthropic Reasoning',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
      </svg>
    ),
  },
  {
    name: 'Antigravity',
    category: 'Agentic AI & Ideation',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-30 12 12)" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Gemini',
    category: 'Google DeepMind AI',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"/>
      </svg>
    ),
  },
];

export default function Footer({ data, socials }: FooterProps) {
  const [copied, setCopied] = useState(false);
  const [timeString, setTimeString] = useState('');
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

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
            <span>Available for Projects &amp; Collaborations</span>
          </div>

          <h2 className={styles.ctaHeading}>
            Need a Website, Design, or AI/ML Solution?
          </h2>

          <p className={styles.ctaSub}>
            I build full-stack web applications, create professional graphics and designs with Canva, and develop practical AI/ML projects for students, startups, and modern teams.
          </p>

          <button
            type="button"
            onClick={() => setIsInquiryOpen(true)}
            className={styles.inquiryBtn}
            data-cursor-hover
          >
            <span>Send Inquiry</span>
            <span className={styles.inquiryArrow}>↗</span>
          </button>
        </div>
      </div>

      {/* ── 2. Dynamic Kinetic Tech Stack Ribbon (Hover Interactive) ────── */}
      <div className={styles.ribbonSection}>
        <div className={styles.ribbonLabel}>
          <span>Skills &amp; Tools</span>
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
                <a href="/terms" className={styles.navLinkItem} data-cursor-hover>Terms &amp; Conditions</a>
                <a href="/disclaimer" className={styles.navLinkItem} data-cursor-hover>Disclaimer</a>
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
          <div className={styles.legalLinks}>
            <a href="/terms" className={styles.legalLink} data-cursor-hover>Terms &amp; Conditions</a>
            <span className={styles.legalDivider}>•</span>
            <a href="/disclaimer" className={styles.legalLink} data-cursor-hover>Disclaimer</a>
          </div>
        </div>
      </div>

      {/* Interactive Mobile Inquiry & Notification Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        defaultEmail={email}
      />
    </footer>
  );
}

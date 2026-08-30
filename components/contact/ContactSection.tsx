'use client';

import { useState } from 'react';
import Card3D from '@/components/ui/Card3D';
import styles from './Contact.module.css';

interface ContactProps {
  data?: {
    email?: string;
    location?: string;
    university?: {
      name?: string;
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
  };
}

export default function ContactSection({ data }: ContactProps) {
  const [copied, setCopied] = useState(false);

  const email = data?.email || 'vaibhavsnu@2029';
  const university = data?.university?.name || 'Sister Nivedita University';
  const school = data?.school?.name || 'Bholananda National Vidyalaya';
  const class10 = data?.school?.class10 ? `${data.school.class10} — ${data.school.board || 'CBSE'}` : '85.5% — CBSE';
  const class12 = data?.school?.class12 ? `${data.school.class12} — ${data.school.board || 'CBSE'}` : '75.8% — CBSE';
  const cgpa = data?.university?.cgpa
    ? `${data.university.cgpa} (Sem 1: ${data.university.sem1 || '9.43'} · Sem 2: ${data.university.sem2 || '9.35'})`
    : '9.38 (Sem 1: 9.43 · Sem 2: 9.35)';
  const location = data?.location || 'Kolkata, West Bengal, India';

  const info = [
    { label: 'University', value: university },
    { label: 'School', value: school },
    { label: 'Class 10', value: class10 },
    { label: 'Class 12', value: class12 },
    { label: 'Cumulative CGPA', value: cgpa },
    { label: 'Base Location', value: location },
  ];

  // Authentic vector SVG social icons
  const socialPlatforms = [
    {
      name: 'LinkedIn',
      handle: 'vaibhav-shaw',
      href: data?.socials?.linkedin || 'https://linkedin.com/in/vaibhav-shaw',
      icon: (
        <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor">
          <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      handle: 'visionary-code-studio',
      href: data?.socials?.github || 'https://github.com/visionary-code-studio',
      icon: (
        <svg width="18" height="18" viewBox="0 0 496 512" fill="currentColor">
          <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      handle: '@visionary_code_studio',
      href: data?.socials?.instagram || 'https://instagram.com/visionary_code_studio',
      icon: (
        <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor">
          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      handle: '@vaibhavshaw',
      href: data?.socials?.x || 'https://x.com/vaibhavshaw',
      icon: (
        <svg width="17" height="17" viewBox="0 0 512 512" fill="currentColor">
          <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z" />
        </svg>
      ),
    },
  ];

  const copy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={styles.section} id="contact">
      <div className={styles.sectionMeta}>
        <span className={styles.starMotif}>✦</span>
        <span>08 — Let&apos;s Talk</span>
      </div>

      <div className={styles.heading}>
        <span className={styles.headLine}>Let&apos;s</span>
        <span className={`${styles.headLine} ${styles.dim}`}>Connect.</span>
      </div>

      <div className={styles.grid}>
        {/* Email Direct Station with 3D Perspective Depth */}
        <Card3D intensity={8} glare={true} className={styles.card3DEmailWrap}>
          <div className={styles.emailBlock}>
            <span className={styles.emailLabel}>
              <span className={styles.liveIndicator} />
              Direct Communications
            </span>
            <span className={styles.emailAddress}>{email}</span>
            <div className={styles.emailActions}>
              <a
                href={`mailto:${email}`}
                className={`${styles.emailBtn} ${styles.primary}`}
                aria-label="Send email direct"
                data-cursor-hover
              >
                <span>Send Email</span>
                <span>↗</span>
              </a>
              <button
                className={`${styles.emailBtn} ${copied ? styles.copied : ''}`}
                onClick={copy}
                aria-label="Copy email address"
                data-cursor-hover
              >
                {copied ? '✓ Copied to Clipboard' : 'Copy Address'}
              </button>
            </div>
          </div>
        </Card3D>

        {/* Info & Socials */}
        <div className={styles.rightCol}>
          <div className={styles.infoBlock}>
            {info.map((row) => (
              <div key={row.label} className={styles.infoRow}>
                <span className={styles.infoLabel}>{row.label}</span>
                <span className={styles.infoValue}>{row.value}</span>
              </div>
            ))}
          </div>

          <div>
            <div className={styles.socialsHeader}>Official Network Channels</div>
            <div className={styles.socialGrid}>
              {socialPlatforms.map((s) => (
                <Card3D key={s.name} intensity={10} glare={true} className={styles.card3DSocialWrap}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialCard}
                    aria-label={s.name}
                    data-cursor-hover
                  >
                    <div className={styles.socialCardLeft}>
                      <span className={styles.socialIconWrap}>{s.icon}</span>
                      <div>
                        <div className={styles.socialName}>{s.name}</div>
                        <div className={styles.socialSub}>{s.handle}</div>
                      </div>
                    </div>
                    <span className={styles.socialArrow}>↗</span>
                  </a>
                </Card3D>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

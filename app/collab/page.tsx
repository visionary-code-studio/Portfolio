import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import CollabSection from '@/components/collab/CollabSection';
import portfolioData from '@/data/portfolio-content.json';
import styles from './collabPage.module.css';

export const metadata: Metadata = {
  title: 'Collab & Services Showcase — Vaibhav Shaw',
  description: 'Explore collaboration menus and hire Vaibhav Shaw for Web Development, AI + E-Commerce, and Graphic Design. Transparent pricing, turnarounds, and recruiter fast-track.',
};

export default function CollabPage() {
  const profileEmail = portfolioData.profile?.email || 'vaibhavsnu2025@gmail.com';
  const resumeUrl = portfolioData.profile?.resumeUrl || '/resume1.pdf';
  const collabServices = (portfolioData as any).collabServices || [];

  return (
    <div className={styles.pageWrap}>
      {/* Top Header Bar */}
      <header className={styles.topHeader}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logoLink} aria-label="Return to Vaibhav Shaw Home">
            <div className={styles.logoImgWrap}>
              <Image
                src="/images/logo_emblem.png"
                alt="Vaibhav Shaw"
                width={36}
                height={36}
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <span className={styles.logoText}>Vaibhav Shaw</span>
          </Link>

          <Link href="/" className={styles.backBtn} aria-label="Return to Portfolio">
            <span>← Back to Portfolio</span>
          </Link>
        </div>
      </header>

      {/* Main Collab Section */}
      <main className={styles.mainArea}>
        <CollabSection
          services={collabServices}
          profileEmail={profileEmail}
          resumeUrl={resumeUrl}
        />
      </main>

      {/* Minimal Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Vaibhav Shaw · All rights reserved.</p>
        <div className={styles.footerLinks}>
          <Link href="/terms">Terms</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <Link href="/">Home</Link>
        </div>
      </footer>
    </div>
  );
}

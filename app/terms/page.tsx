import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './terms.module.css';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Vaibhav Shaw',
  description: 'Terms and Conditions of Use governing the personal portfolio and digital work of Vaibhav Shaw.',
};

export default function TermsPage() {
  return (
    <div className={styles.pageContainer}>
      {/* ── Top Navigation Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logoLink} aria-label="Return to Vaibhav Shaw Portfolio">
            <span className={styles.logoDot} />
            <span>Vaibhav Shaw</span>
          </Link>
          <Link href="/" className={styles.backBtn}>
            <span>← Back to Portfolio</span>
          </Link>
        </div>
      </header>

      {/* ── Main Legal Editorial Body ── */}
      <main className={styles.mainContent}>
        <div className={styles.heroBox}>
          <div className={styles.metaBadge}>
            <span>✦ Legal &amp; Governance</span>
          </div>
          <h1 className={styles.pageTitle}>Terms &amp; Conditions</h1>
          <p className={styles.lastUpdated}>Effective Date: October 1, 2026 · Location: Kolkata, West Bengal, India</p>
        </div>

        <p className={styles.introText}>
          Welcome to the personal engineering, research, and design portfolio of <strong>Vaibhav Shaw</strong>.
          By accessing or interacting with this website (including its interactive 3D WebGL experiences, presentation archives, and contact inquiry systems), you agree to comply with and be bound by the following Terms and Conditions.
        </p>

        {/* Section 1 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>01.</span> Acceptance of Terms
          </h2>
          <p className={styles.sectionText}>
            These Terms of Use constitute a binding agreement between you (the visitor, client, recruiter, or collaborator) and Vaibhav Shaw. If you do not agree with any part of these terms, please discontinue browsing this portfolio.
          </p>
        </section>

        {/* Section 2 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>02.</span> Intellectual Property Rights
          </h2>
          <p className={styles.sectionText}>
            All intellectual property rights in the portfolio codebase, interactive shaders, design layouts, written manifestos, typography styling, research presentation decks (PPTs), and creative media belong exclusively to Vaibhav Shaw, unless otherwise credited to third-party open-source libraries or institutional collaborators.
          </p>
          <ul className={styles.bulletList}>
            <li className={styles.bulletItem}>
              <strong>Personal &amp; Non-Commercial Review:</strong> You may view, download for offline academic study, and reference code or presentations solely for personal review, recruitment assessment, or non-commercial evaluation.
            </li>
            <li className={styles.bulletItem}>
              <strong>No Unauthorized Redistribution:</strong> You may not scrape, mirror, resell, or distribute the design systems, source code, or proprietary presentation decks without prior explicit written permission.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>03.</span> Projects, Freelance &amp; Collaborations
          </h2>
          <p className={styles.sectionText}>
            Any inquiries submitted through the interactive inquiry portal or direct messaging channels (WhatsApp, Gmail, LinkedIn) regarding website builds, graphic design with Canva, hackathon partnerships, or AI/ML student guidance are preliminary expressions of interest.
          </p>
          <div className={styles.cardCallout}>
            <p className={styles.calloutText}>
              Formal engagements, development milestones, intellectual property transfers, and project deliverables shall be governed by mutually agreed project specifications or service agreements upon mutual confirmation.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>04.</span> Open Source &amp; Third-Party Services
          </h2>
          <p className={styles.sectionText}>
            Certain interactive components and animations leverage open-source frameworks including Next.js, React, Three.js, and Framer Motion under their respective open-source licenses (MIT/Apache 2.0). External tool trademarks (such as GitHub, Figma, Canva, Python, Firebase, and Google Cloud) are acknowledged and remain the exclusive property of their respective owners.
          </p>
        </section>

        {/* Section 5 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>05.</span> Limitation of Liability
          </h2>
          <p className={styles.sectionText}>
            This website and all included technical demonstrations, architectural models, and sample code snippets are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind. Under no circumstances shall Vaibhav Shaw be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use this site.
          </p>
        </section>

        {/* Section 6 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>06.</span> Governing Law
          </h2>
          <p className={styles.sectionText}>
            These Terms shall be interpreted and governed in accordance with the laws of the Republic of India. Any disputes arising in connection with this site shall be subject to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal, India.
          </p>
        </section>

        {/* Section 7 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>07.</span> Contact &amp; Legal Notices
          </h2>
          <p className={styles.sectionText}>
            For any questions, permissions, or concerns regarding these Terms and Conditions, please contact:
          </p>
          <p className={styles.sectionText}>
            <strong>Email:</strong> vaibhavsnu2025@gmail.com<br />
            <strong>Institution:</strong> Sister Nivedita University, Kolkata, India
          </p>
        </section>
      </main>

      {/* ── Footer Bar ── */}
      <footer className={styles.footerBar}>
        <div className={styles.footerInner}>
          <span>© 2026 Vaibhav Shaw. All rights reserved.</span>
          <div className={styles.footerNav}>
            <Link href="/" className={styles.footerNavLink}>Home</Link>
            <Link href="/disclaimer" className={styles.footerNavLink}>Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

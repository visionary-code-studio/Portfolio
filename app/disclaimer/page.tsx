import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './disclaimer.module.css';

export const metadata: Metadata = {
  title: 'Disclaimer — Vaibhav Shaw',
  description: 'Professional, academic, and technical disclaimer for the personal portfolio of Vaibhav Shaw.',
};

export default function DisclaimerPage() {
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
            <span>✦ Disclosure &amp; Notice</span>
          </div>
          <h1 className={styles.pageTitle}>Disclaimer</h1>
          <p className={styles.lastUpdated}>Effective Date: October 1, 2026 · Location: Kolkata, West Bengal, India</p>
        </div>

        <p className={styles.introText}>
          This website serves as the personal professional portfolio, academic dossier, and creative showcase of <strong>Vaibhav Shaw</strong>.
          Please read this Disclaimer carefully to understand the scope and intent of the projects, representations, and technical materials presented herein.
        </p>

        {/* Section 1 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>01.</span> General Information &amp; Portfolio Nature
          </h2>
          <p className={styles.sectionText}>
            All materials published on this website—including project descriptions, architectural diagrams, interactive 3D WebGL scenes, and presentation slides—are presented solely for informational, educational, and professional portfolio demonstration purposes. They do not constitute formal commercial, investment, or legal advice.
          </p>
        </section>

        {/* Section 2 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>02.</span> Academic &amp; Institutional Representation
          </h2>
          <p className={styles.sectionText}>
            Academic credentials, cumulative Grade Point Averages (9.38 CGPA), semester scores, and secondary school achievements (Bholananda National Vidyalaya) represent authentic records from Sister Nivedita University and the Central Board of Secondary Education (CBSE).
          </p>
          <div className={styles.cardCallout}>
            <p className={styles.calloutText}>
              This portfolio is an independent personal initiative and is not an official portal or sanctioned voice of Sister Nivedita University. Views, opinions, and extracurricular engineering projects expressed here belong entirely to Vaibhav Shaw.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>03.</span> Code Snippets, Prototypes &amp; Hackathon Builds
          </h2>
          <p className={styles.sectionText}>
            Many software projects highlighted—including hackathon submissions, AI agent prototypes, and full-stack demonstrators—are rapid experimental builds developed in fast-paced collaborative environments. While engineered with high standards of performance and clean architecture, they are provided &ldquo;as is&rdquo; without implied warranties regarding uninterrupted operation or fitness for production enterprise deployment.
          </p>
        </section>

        {/* Section 4 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>04.</span> Artificial Intelligence &amp; Machine Learning Notice
          </h2>
          <p className={styles.sectionText}>
            Research and projects in AI/ML (including Physics-Informed Machine Learning, Agentic Workflows, and Neural Network pipelines) involve stochastic and heuristic machine learning models. Algorithmic outputs, prompt evaluations, and model inferences may produce approximations and should be validated prior to mission-critical or clinical application.
          </p>
        </section>

        {/* Section 5 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>05.</span> Trademarks &amp; Third-Party Brand Acknowledgment
          </h2>
          <p className={styles.sectionText}>
            All brand logos, product names, and company trademarks featured across the skills ticker and project documentation (such as Canva, GitHub, Figma, Python, Tableau, Firebase, Google Cloud, ChatGPT, Claude, and Gemini) belong to their respective registered trademark holders. Their depiction denotes technical proficiency, skill utilization, and tooling expertise, and does not imply direct institutional affiliation or official endorsement.
          </p>
        </section>

        {/* Section 6 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>06.</span> Inquiries &amp; Communication Accuracy
          </h2>
          <p className={styles.sectionText}>
            Inquiries transmitted via the on-site WhatsApp or Gmail contact drawers are routed directly to personal communication endpoints. Vaibhav Shaw commits to privacy and data protection; your contact information will never be sold, rented, or repurposed for unsolicited marketing.
          </p>
        </section>

        {/* Section 7 */}
        <section className={styles.legalSection}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNum}>07.</span> Contact Information
          </h2>
          <p className={styles.sectionText}>
            If you have questions regarding this Disclaimer or require academic verification, please reach out via:
          </p>
          <p className={styles.sectionText}>
            <strong>Email:</strong> vaibhavsnu2025@gmail.com<br />
            <strong>Location:</strong> Kolkata, West Bengal, India
          </p>
        </section>
      </main>

      {/* ── Footer Bar ── */}
      <footer className={styles.footerBar}>
        <div className={styles.footerInner}>
          <span>© 2026 Vaibhav Shaw. All rights reserved.</span>
          <div className={styles.footerNav}>
            <Link href="/" className={styles.footerNavLink}>Home</Link>
            <Link href="/terms" className={styles.footerNavLink}>Terms &amp; Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

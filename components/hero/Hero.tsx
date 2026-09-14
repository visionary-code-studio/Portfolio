'use client';

import Image from 'next/image';
import styles from './Hero.module.css';

interface HeroProps {
  data?: {
    firstName?: string;
    lastName?: string;
    role?: string;
    posterImage?: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const posterImage = data?.posterImage || '/images/profile_update.png';
  const firstName = data?.firstName || 'Vaibhav';
  const lastName = data?.lastName || 'Shaw';
  const role = data?.role || 'AIML Engineer & Full Stack Developer';

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} id="home">
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <div className={styles.availabilityBadge}>
          <span className={styles.greenDot} />
          <span>Available for New Project</span>
        </div>
        
        <div className={styles.navLinks}>
          <a href="#work">Work [46]</a>
          <a href="#service">Service [4]</a>
          <a href="#experience">Experience [9+]</a>
          <a href="#contact">Contact</a>
        </div>

        <button className={styles.letsTalkBtn} onClick={scrollToContact}>
          Let&apos;s Talk ↗
        </button>
      </div>

      {/* ── Main Content Area ── */}
      <div className={styles.mainContent}>
        
        {/* Background Huge Text */}
        <div className={styles.backgroundText}>
          <span className={styles.firstName}>{firstName}</span>
          <span className={styles.lastName}>{lastName}</span>
        </div>

        {/* Center Profile Image */}
        <div className={styles.profileImageContainer}>
          <Image 
            src={posterImage} 
            alt={`${firstName} ${lastName} Profile`}
            fill 
            priority
            className={styles.profileImage}
          />
        </div>

        {/* Left Side Content */}
        <div className={styles.leftContent}>
          <h2 className={styles.roleTitle}>{role}</h2>
          <p className={styles.roleDescription}>
            Designing digital products that are clear, usable, and conversion focused.
          </p>
          <button className={styles.collaborateBtn} onClick={scrollToContact}>
            Let&apos;s collaborate ↗
          </button>
        </div>

        {/* Right Side Socials */}
        <div className={styles.rightContent}>
          <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.socialLink}>
            <span className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </span> 
            Github
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.socialLink}>
            <span className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </span> 
            LinkedIn
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink}>
            <span className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </span> 
            Instagram
          </a>
          <a href="https://dribbble.com" target="_blank" rel="noreferrer" className={styles.socialLink}>
            <span className={styles.socialIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path></svg>
            </span> 
            Dribbble
          </a>
        </div>
      </div>
    </section>
  );
}

'use client';

import Hero3DCanvas from '@/components/3d/Hero3DCanvas';
import styles from './Hero.module.css';

interface HeroProps {
  data?: {
    eyebrow?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    posterImage?: string;
    location?: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const posterImage = data?.posterImage || '/images/vaibhav_speaker.png';
  const firstName = data?.firstName || 'VAIBHAV';
  const lastName = data?.lastName || 'SHAW';
  const role = data?.role || 'AIML Student · Full Stack Developer';
  const location = data?.location || 'Kolkata, West Bengal, India';

  const scrollToIdentity = () => {
    const el = document.getElementById('identity');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroBox}>
        {/* Interactive 3D Particle Space Coordinate Layer */}
        <Hero3DCanvas />

        {/* ── Top Row: Massive Centered Headline "VAIBHAV SHAW" ── */}
        <div className={styles.headlineRow}>
          <h1 className={styles.massiveTitle}>
            <span className={styles.massiveOutline}>{firstName}</span>{' '}
            <span className={styles.massiveSolid}>{lastName}</span>
          </h1>
        </div>

        {/* ── Center Stage: Portrait (Anchored Center) + Left Editorial + Right Socials ── */}
        <div className={styles.stageGrid}>
          {/* Left Column: Role & CTA */}
          <div className={styles.leftCol}>
            <div className={styles.roleBadge}>
              <span className={styles.livePulse} />
              <span>AIML Engineer &amp; Full Stack Developer</span>
            </div>

            <p className={styles.heroBio}>
              Architecting intelligent neural systems, high-performance web applications, and next-generation digital experiences.
            </p>

            <div className={styles.ctaGroup}>
              <button
                className={styles.primaryBtn}
                onClick={scrollToIdentity}
                data-cursor-hover
              >
                <span>Explore Portfolio</span>
                <span className={styles.btnArrow}>↓</span>
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={scrollToContact}
                data-cursor-hover
              >
                <span>Let&apos;s Connect</span>
                <span>⚡</span>
              </button>
            </div>
          </div>

          {/* Center Portrait Anchor */}
          <div className={styles.portraitWrap}>
            <img
              src={posterImage}
              alt={`${firstName} ${lastName}`}
              className={styles.portraitImg}
            />
          </div>
        </div>

        {/* ── Bottom HUD Status Bar ────────────────────────── */}
        <div className={styles.bottomBar}>
          <div className={styles.hudRole}>
            <span className={styles.hudRoleTitle}>Primary Focus</span>
            <span className={styles.hudRoleDesc}>{role}</span>
          </div>

          <button
            className={styles.scrollCue}
            onClick={scrollToIdentity}
            aria-label="Scroll down to explore"
            data-cursor-hover
          >
            <span className={styles.scrollLabel}>Scroll</span>
            <span className={styles.scrollLine} />
          </button>

          <div className={styles.hudRole} style={{ textAlign: 'right' }}>
            <span className={styles.hudRoleTitle}>Base Location</span>
            <span className={styles.hudRoleDesc}>{location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

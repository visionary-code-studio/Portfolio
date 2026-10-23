'use client';

import React from 'react';
import Image from 'next/image';
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
  const firstName = data?.firstName || 'VAIBHAV';
  const lastName = data?.lastName || 'SHAW';
  const role = data?.role || 'Developer · AIML Engineer · Innovator · Designer';
  const location = data?.location || 'Kolkata, West Bengal, India';

  const scrollToIdentity = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} id="home">
      {/* ── 1. Cosmic 3D Particle Formation (Preserved in Center Background) ── */}
      <Hero3DCanvas />

      <div className={styles.heroContainer}>
        {/* ── 2. Two-Column Hero Composition ── */}
        <div className={styles.mainGrid}>
          {/* ── Left Column: Typography, Badges, Manifesto Card & CTAs ── */}
          <div className={styles.leftCol}>
            {/* ── Oversized 2-Line Headline: VAIBHAV SHAW with Sticker Doodles ── */}
            <div className={styles.headlineWrapper}>
              {/* Line 1: VAIBHAV */}
              <div className={styles.headingLineOne}>
                {/* Left Sparkle Doodles */}
                <div className={styles.sparkleDoodleLeft} aria-hidden="true">
                  <span className={styles.sparkleSmall}>✦</span>
                  <span className={styles.sparkleLarge}>✦</span>
                </div>

                <h1 className={styles.titleVaibhav}>
                  {firstName}
                </h1>

                {/* Top-Right Sketch Rays */}
                <svg className={styles.topRightSketchRays} width="32" height="24" viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 18L2 12" />
                  <path d="M14 14L15 4" />
                  <path d="M22 17L27 9" />
                </svg>
              </div>

              {/* Line 2: SHAW */}
              <div className={styles.headingLineTwo}>
                <span className={styles.titleShaw}>
                  {lastName}
                </span>

                {/* Right Sparkle Doodles */}
                <div className={styles.sparkleDoodleRight} aria-hidden="true">
                  <span className={styles.sparkleLarge}>✦</span>
                  <span className={styles.sparkleSmall}>✦</span>
                </div>
              </div>
            </div>

            {/* ── Professional Segmented Pill Badges ── */}
            <div className={styles.badgeRowsContainer}>
              {/* Badge Row 1: AI/ML ENGINEERING | STUDENT (SISTER NIVEDITA UNIVERSITY) */}
              <div className={styles.badgeRowOneWrap}>
                {/* Left doodle tick marks */}
                <svg className={styles.badgeRowDoodle} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 12L7 3" />
                  <path d="M8 14L14 7" />
                </svg>

                <div className={styles.segmentedCapsule}>
                  <span className={styles.capsuleSegment}>AI/ML ENGINEERING</span>
                  <span className={styles.capsuleDivider} aria-hidden="true" />
                  <span className={styles.capsuleSegment}>STUDENT (SISTER NIVEDITA UNIVERSITY)</span>
                </div>
              </div>

              {/* Badge Row 2: GRAPHIC DESIGNING | CANVA & FIGMA | FULL-STACK DEVELOPMENT */}
              <div className={styles.segmentedCapsule}>
                <span className={styles.capsuleSegment}>GRAPHIC DESIGNING</span>
                <span className={styles.capsuleDivider} aria-hidden="true" />
                <span className={styles.capsuleSegment}>CANVA &amp; FIGMA</span>
                <span className={styles.capsuleDivider} aria-hidden="true" />
                <span className={styles.capsuleSegment}>FULL-STACK DEVELOPMENT</span>
              </div>
            </div>

            {/* ── Manifesto Card Section ── */}
            <div className={styles.manifestoSection}>
              {/* Green Pulse Status Indicator Pill */}
              <div className={styles.statusPill}>
                <span className={styles.greenPulseDot} aria-hidden="true" />
                <span className={styles.statusPillText}>AIML ENGINEER &amp; FULL STACK DEVELOPER</span>
              </div>

              {/* Die-Cut Torn Paper Card */}
              <div className={styles.tornCard}>
                <div className={styles.cardHeaderWrap}>
                  <h2 className={styles.cardHeadline}>I CODE. I BUILD. I COMPETE.</h2>
                  {/* Two sketch marks on top-right of headline */}
                  <svg className={styles.headlineDoodle} width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M3 11L9 3" />
                    <path d="M10 11L16 3" />
                  </svg>
                </div>

                <p className={styles.cardDescription}>
                  Exploring AI/ML and full-stack development through hackathons, coding challenges, and case competitions.
                </p>
                <p className={styles.cardSupportingCopy}>
                  Blending technology, creativity and curiosity to build impactful digital experiences.
                </p>
              </div>
            </div>

            {/* ── CTA Action Buttons ── */}
            <div className={styles.ctaRow}>
              {/* Primary Button: Explore Portfolio with left sketch doodle */}
              <div className={styles.primaryCtaWrap}>
                <svg className={styles.ctaLeftDoodle} width="20" height="18" viewBox="0 0 20 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 14L1 9" />
                  <path d="M8 11L6 3" />
                  <path d="M15 13L16 5" />
                </svg>
                <button
                  className={styles.primaryBtn}
                  onClick={scrollToIdentity}
                  data-cursor-hover
                >
                  <span>Explore Portfolio</span>
                  <span className={styles.btnArrow}>→</span>
                </button>
              </div>

              {/* Secondary Button: Let's Connect */}
              <button
                className={styles.secondaryBtn}
                onClick={scrollToContact}
                data-cursor-hover
              >
                <span>Let&apos;s Connect</span>
                <span className={styles.btnLightning}>⚡</span>
              </button>
            </div>
          </div>

          {/* ── Right Column: Large Die-Cut Portrait Sticker with Paper Accents ── */}
          <div className={styles.rightCol}>
            <div className={styles.portraitStickerCard}>
              {/* Washi Masking Tape Accent on Top-Right Corner */}
              <div className={styles.washiTapeTopRight} aria-hidden="true">
                <span className={styles.washiTexture} />
              </div>

              {/* Top-Right Radiating Sketch Doodles */}
              <svg className={styles.portraitTopDoodle} width="28" height="24" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 18L1 11" />
                <path d="M12 14L13 3" />
                <path d="M20 16L26 8" />
              </svg>

              {/* Cutout Monochrome Portrait Image */}
              <div className={styles.portraitImgWrap}>
                <Image
                  src="/images/vaibhav_sticker_portrait_cutout.png"
                  alt={`${firstName} ${lastName}`}
                  width={580}
                  height={680}
                  className={styles.portraitStickerImg}
                  priority
                />
              </div>

              {/* Bottom-Right Sparkle Stars */}
              <div className={styles.portraitBottomSparkles} aria-hidden="true">
                <span className={styles.sparkleLarge}>✦</span>
                <span className={styles.sparkleSmall}>✦</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Bottom Information HUD Row ── */}
        <div className={styles.bottomBar}>
          {/* Left Column: Primary Focus */}
          <div className={styles.hudBlockLeft}>
            <span className={styles.hudLabel}>PRIMARY FOCUS</span>
            <span className={styles.hudValue}>{role}</span>
          </div>

          {/* Center Column: Scroll Indicator */}
          <button
            className={styles.hudScrollCue}
            onClick={scrollToIdentity}
            aria-label="Scroll down to explore"
            data-cursor-hover
          >
            <span className={styles.hudLabel}>SCROLL</span>
            <span className={styles.hudScrollTick}>|</span>
          </button>

          {/* Right Column: Base Location */}
          <div className={styles.hudBlockRight}>
            <span className={styles.hudLabel}>BASE LOCATION</span>
            <span className={styles.hudValue}>{location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

interface ProfileProps {
  fullName?: string;
  roleTitle?: string;
  profileImage?: string;
  email?: string;
}

interface NavbarProps {
  profile?: ProfileProps;
}

const navItems = [
  { num: '01', label: 'Home', sub: 'Hero & 3D Particle Space', href: '#home' },
  { num: '02', label: 'Identity', sub: 'Autographed Signature & Badge', href: '#identity' },
  { num: '03', label: 'Philosophy', sub: 'Core Principles & Values', href: '#about' },
  { num: '04', label: 'The Archive', sub: 'Research Presentations Shelf', href: '#ppt' },
  { num: '05', label: 'The Proof', sub: 'Verified Certifications Gallery', href: '#certs' },
  { num: '06', label: "What I'm Into", sub: 'Kinetic Domain Cloud', href: '#interests' },
  { num: '07', label: "What's Next", sub: 'Future Vision & Manifesto', href: '#future' },
  { num: '08', label: "Let's Talk", sub: 'Direct Communication & Finale', href: '#contact' },
];

export default function Navbar({ profile }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState('');

  const fullName = profile?.fullName || 'Vaibhav Shaw';
  const roleTitle = profile?.roleTitle || 'AIML Student · Full Stack Developer';
  const profileImage = profile?.profileImage || '/images/profile_update.png';
  const email = profile?.email || 'vaibhavsnu@2029';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const t = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      });
      setTime(`INDIA TIME — ${t.toUpperCase()}`);
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };

  return (
    <>
      {/* ── Fixed Top Bar ───────────────────────────────────── */}
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <a
          className={styles.wordmark}
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNav('#home');
          }}
          data-cursor-hover
        >
          <span>VAIBHAV</span>
          <span className={styles.wordmarkDot} />
        </a>

        <span className={styles.center}>{time}</span>

        <button
          className={styles.menuBtn}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          data-cursor-hover
        >
          <span className={`${styles.menuIcon} ${open ? styles.open : ''}`}>
            <span />
            <span />
            <span />
          </span>
          <span>{open ? 'CLOSE' : 'MENU'}</span>
        </button>
      </header>

      {/* ── Fullscreen Executive Menu Drawer ────────────────── */}
      <div className={`${styles.overlay} ${open ? styles.open : ''}`} aria-hidden={!open}>
        <div className={styles.menuGlow} aria-hidden="true" />

        <div className={styles.menuContainer}>
          <div className={styles.menuGrid}>
            {/* ── Left Column: Toukir Rahman Reference Profile Card ── */}
            <div className={styles.profileCard}>
              <div className={styles.avatarRing}>
                <Image
                  src={profileImage}
                  alt={fullName}
                  width={96}
                  height={96}
                  className={styles.avatarImg}
                  priority
                />
              </div>

              <div className={styles.profileMeta}>
                <span className={styles.welcomeBadge}>Welcome to Portfolio</span>
                <h3 className={styles.profileName}>{fullName}</h3>
                <p className={styles.profileRole}>{roleTitle}</p>
              </div>

              <div className={styles.statusBadge}>
                <span className={styles.liveDot} />
                <span>Available for AI Projects</span>
              </div>

              <div className={styles.cardActions}>
                <a
                  href={`mailto:${email}`}
                  className={styles.actionPillPrimary}
                  data-cursor-hover
                >
                  <span>⚡ Quick Connect</span>
                </a>
                <a
                  href="/certs/cert-01.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionPillSecondary}
                  data-cursor-hover
                >
                  <span>Download CV / Resume</span>
                </a>
              </div>
            </div>

            {/* ── Right Column: Chapter Navigation List ─────────── */}
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.num} className={styles.navItem}>
                  <a
                    href={item.href}
                    className={styles.navLink}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(item.href);
                    }}
                    data-cursor-hover
                  >
                    <div className={styles.linkLeft}>
                      <span className={styles.navNum}>{item.num}</span>
                      <div className={styles.navTitleGroup}>
                        <span className={styles.navLabel}>{item.label}</span>
                        <span className={styles.navSub}>{item.sub}</span>
                      </div>
                    </div>

                    <div className={styles.linkRight}>
                      <span className={styles.arrowIcon}>→</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

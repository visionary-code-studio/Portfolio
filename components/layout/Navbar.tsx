'use client';

import { useState, useEffect } from 'react';
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

interface DockItem {
  id: string;
  label: string;
  href: string;
}

const dockItems: DockItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'ppt', label: 'The Archive', href: '#ppt' },
  { id: 'certs', label: 'The Proof', href: '#certs' },
  { id: 'contact', label: "Let's Talk", href: '#contact' },
];

export default function Navbar({ profile }: NavbarProps) {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrolled, setScrolled] = useState(false);
  const [timeString, setTimeString] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);

  const fullName = profile?.fullName || 'Vaibhav Shaw';
  const roleTitle = profile?.roleTitle || 'AIML Student · Full Stack Developer';
  const profileImage = profile?.profileImage || '/images/profile_update.png';
  const email = profile?.email || 'vaibhavsnu@2029';

  // Live real-time Indian Standard Time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      });
      setTimeString(formatted.toUpperCase());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll spy & navbar background blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Detect active section
      const sections = ['contact', 'certs', 'ppt', 'about', 'home'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = openDrawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openDrawer]);

  const scrollToSection = (href: string, id: string) => {
    setActiveSection(id);
    setOpenDrawer(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ── Fixed Top Navigation Bar ─────────────────────────── */}
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        {/* Left: Brand Monogram & Wordmark */}
        <a
          href="#home"
          className={styles.brandLink}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('#home', 'home');
          }}
          data-cursor-hover
        >
          <div className={styles.brandLogoGlyph} aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.18.05l9.9-6.13a2 2 0 0 0 .99-1.7V9.74a2 2 0 0 0-.88-1.66Z" />
              <polyline points="3.29 7 12 12.67 20.71 8" />
              <line x1="12" y1="22.76" x2="12" y2="12.56" />
            </svg>
          </div>
          <span className={styles.brandText}>Vaibhav</span>
        </a>

        {/* Center: Floating Pill Dock (Inspired by Reference) */}
        <nav className={styles.centerDock} aria-label="Primary Navigation">
          {dockItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.dockItem} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => scrollToSection(item.href, item.id)}
              data-cursor-hover
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Rightmost: Standalone Live Clock Capsule & Mobile Toggle */}
        <div className={styles.rightArea}>
          <div
            className={styles.clockPill}
            title="Live Indian Standard Time (GMT +5:30)"
            data-cursor-hover
          >
            <span className={styles.pulseDot} aria-hidden="true" />
            <span className={styles.clockText}>{timeString || '10:45:00 PM'}</span>
            <span className={styles.clockZone}>IST</span>
          </div>

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setOpenDrawer(!openDrawer)}
            aria-label={openDrawer ? 'Close menu' : 'Open menu'}
            data-cursor-hover
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {openDrawer ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* ── Fullscreen Executive Drawer (for Mobile & Deep Discovery) ── */}
      <div className={`${styles.overlay} ${openDrawer ? styles.open : ''}`} aria-hidden={!openDrawer}>
        <div className={styles.menuContainer}>
          <div className={styles.menuGrid}>
            <div className={styles.profileCard}>
              <div className={styles.avatarRing}>
                <Image
                  src={profileImage}
                  alt={fullName}
                  width={90}
                  height={90}
                  className={styles.avatarImg}
                  priority
                />
              </div>

              <div className={styles.profileMeta}>
                <span className={styles.welcomeBadge}>Welcome to Portfolio</span>
                <h3 className={styles.profileName}>{fullName}</h3>
                <p className={styles.profileRole}>{roleTitle}</p>
              </div>

              <div className={styles.cardActions}>
                <a
                  href={`mailto:${email}`}
                  className={styles.actionPillPrimary}
                  data-cursor-hover
                >
                  <span>⚡ Direct Connect</span>
                </a>
              </div>
            </div>

            <ul className={styles.drawerNavList}>
              {dockItems.map((item, index) => (
                <li key={item.id}>
                  <button
                    className={styles.drawerLink}
                    onClick={() => scrollToSection(item.href, item.id)}
                    data-cursor-hover
                  >
                    <div>
                      <span className={styles.drawerNum}>0{index + 1}</span>
                      <span className={styles.drawerLabel}>{item.label}</span>
                    </div>
                    <span>→</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

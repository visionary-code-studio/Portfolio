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
  { id: 'collab', label: 'Collab', href: '#collab' },
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
      const sections = ['contact', 'collab', 'certs', 'ppt', 'about', 'home'];
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
        {/* Left: Brand Monogram & Wordmark with Sketch Doodles */}
        <a
          href="#home"
          className={styles.brandLink}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('#home', 'home');
          }}
          data-cursor-hover
        >
          <div className={styles.brandSignatureLogoWrap} aria-label="Vaibhav Shaw">
            {/* Hand-drawn sketch rays on top-left of signature */}
            <svg className={styles.signatureDoodle} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 14L1 11" />
              <path d="M6 8L3 4" />
              <path d="M12 5L12 1" />
            </svg>
            <Image
              src="/images/brand-signature-logo.png"
              alt="Vaibhav Shaw"
              width={160}
              height={53}
              className={styles.navbarSignatureImg}
              priority
            />
          </div>
        </a>

        {/* Center: Individual Sticker Pill Navigation Dock */}
        <nav className={styles.centerDock} aria-label="Primary Navigation">
          {/* Sketch rays doodle on top-left of Home button */}
          <div className={styles.navDoodleTopLeft} aria-hidden="true">
            <svg width="22" height="18" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 16L1 11" />
              <path d="M8 12L6 5" />
              <path d="M14 11L15 4" />
            </svg>
          </div>

          {dockItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.dockItem} ${activeSection === item.id ? styles.active : ''} ${item.id === 'contact' ? styles.contactSticker : ''}`}
              onClick={() => scrollToSection(item.href, item.id)}
              data-cursor-hover
            >
              {/* Sticker Icon */}
              {item.id === 'home' && (
                <svg className={styles.dockIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              )}
              {item.id === 'about' && (
                <svg className={styles.dockIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
              {item.id === 'ppt' && (
                <svg className={styles.dockIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              )}
              {item.id === 'certs' && (
                <svg className={styles.dockIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              )}
              {item.id === 'collab' && (
                <svg className={styles.dockIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              )}
              {item.id === 'contact' && (
                <svg className={styles.dockIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              )}

              <span className={styles.dockLabel}>{item.label}</span>

              {/* Sparkle doodle on top-right of Let's Talk */}
              {item.id === 'contact' && (
                <span className={styles.talkDoodleSparkle} aria-hidden="true">✦</span>
              )}
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
            <span className={styles.clockText}>{timeString || '09:45:15 PM'}</span>
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

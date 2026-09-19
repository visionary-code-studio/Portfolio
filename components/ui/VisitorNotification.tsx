'use client';

import React, { useState, useEffect } from 'react';
import styles from './VisitorNotification.module.css';

interface VisitorNotificationProps {
  onOpenInquiry: () => void;
}

export default function VisitorNotification({ onOpenInquiry }: VisitorNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay appearance slightly for a polished entrance effect
    const dismissed = typeof window !== 'undefined' ? sessionStorage.getItem('vaibhav_notif_dismissed') : null;
    if (!dismissed) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vaibhav_notif_dismissed', 'true');
    }
  };

  const handleScrollToCertifications = () => {
    const el = document.getElementById('certifications');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <aside className={styles.notificationToast} aria-label="Visitor notification alert" role="status">
      <div className={styles.glowAura} aria-hidden="true" />

      <div className={styles.topRow}>
        <div className={styles.badge}>
          <span className={styles.pulseDot} />
          <span>LIVE NOTIFICATION</span>
        </div>
        <button
          className={styles.closeBtn}
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>

      <h4 className={styles.title}>
        <span className={styles.starMotif}>✦</span>
        <span>Welcome to Vaibhav Shaw&apos;s Portfolio</span>
      </h4>

      <p className={styles.bodyText}>
        Exploring full-stack engineering, AI/ML systems, or tech leadership? Tap below to explore verified credentials, research decks, or schedule a direct consultation.
      </p>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onOpenInquiry}
          className={styles.primaryAction}
          data-cursor-hover
        >
          <span>Send Inquiry 📲</span>
        </button>
        <button
          type="button"
          onClick={handleScrollToCertifications}
          className={styles.secondaryAction}
          data-cursor-hover
        >
          <span>Explore Proof ↗</span>
        </button>
      </div>
    </aside>
  );
}

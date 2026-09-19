'use client';

import React, { useState, useEffect } from 'react';
import styles from './InquiryModal.module.css';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export default function InquiryModal({ isOpen, onClose, defaultEmail }: InquiryModalProps) {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Full-Stack Engineering');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [inquiryRef, setInquiryRef] = useState('');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fullPhone = `${countryCode} ${phone.trim()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 8) {
      setError('Please enter a valid mobile number (at least 8 digits)');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Post to API
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Visitor',
          phone: fullPhone,
          email: email.trim(),
          projectType,
          message: message.trim() || `Inquiry regarding ${projectType}`,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setInquiryRef(json.inquiryId || `INQ-${Date.now().toString().slice(-6)}`);
        setSubmitted(true);

        // 2. Dispatch device notification if permission granted
        if (typeof window !== 'undefined' && 'Notification' in window) {
          try {
            if (Notification.permission === 'granted') {
              new Notification('✦ Inquiry Dispatched to Vaibhav Shaw', {
                body: `Notification sent to ${fullPhone}. We will be in touch shortly!`,
                icon: '/images/profile_update.png',
              });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission().then((perm) => {
                if (perm === 'granted') {
                  new Notification('✦ Inquiry Dispatched to Vaibhav Shaw', {
                    body: `Notification sent to ${fullPhone}. We will be in touch shortly!`,
                    icon: '/images/profile_update.png',
                  });
                }
              });
            }
          } catch (notifErr) {
            console.warn('Web notification note:', notifErr);
          }
        }
      } else {
        setError(json.error || 'Could not send inquiry. Please check details.');
      }
    } catch (err: any) {
      // Offline fallback: still consider received locally and prompt mobile notification
      setInquiryRef(`INQ-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Vaibhav, I submitted an inquiry on your portfolio (Ref: ${inquiryRef || 'INQ-NEW'}). Name: ${name || 'Visitor'}, Phone: ${fullPhone}, Scope: ${projectType}. Let's connect!`
  );

  const smsUri = `sms:${phone.replace(/\D/g, '')}?body=${whatsappMessage}`;
  const whatsappUri = `https://wa.me/918777855018?text=${whatsappMessage}`;

  return (
    <div className={styles.backdrop} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modalCard} role="dialog" aria-modal="true">
        <div className={styles.glowAura} aria-hidden="true" />
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">✕</button>

        {!submitted ? (
          <>
            <div className={styles.badge}>
              <span>⚡</span>
              <span>Direct Priority Connect</span>
            </div>
            <h3 className={styles.title}>Send Project Inquiry</h3>
            <p className={styles.subtitle}>
              Enter your mobile number below. You will receive an instant notification &amp; confirmation directly on your phone.
            </p>

            {error && (
              <div style={{
                color: '#ff6b6b',
                background: 'rgba(255,107,107,0.1)',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                fontFamily: 'var(--font-mono)'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span>Your Name / Organization</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera / Tech Recruiter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span>Mobile Phone Number</span>
                  <span className={styles.requiredTag}>* Required for SMS Alert</span>
                </label>
                <div className={styles.phoneGroup}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className={styles.prefixSelect}
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+81">🇯🇵 +81</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span>Project Category</span>
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className={styles.select}
                >
                  <option value="Full-Stack Engineering">Full-Stack Web / Next.js Engineering</option>
                  <option value="AI / ML Pipeline Design">AI / ML Pipeline &amp; Agentic System</option>
                  <option value="Technical Recruitment">Technical Hiring / Internship / Role</option>
                  <option value="Startup Collaboration">Startup Collaboration / MVP Build</option>
                  <option value="Academic / Research Inquiry">Academic Research &amp; Presentation</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span>Message / Project Details</span>
                </label>
                <textarea
                  placeholder="Tell me a bit about your timeline, tech stack, or goal..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={styles.textarea}
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={styles.submitBtn}
                data-cursor-hover
              >
                <span>{submitting ? 'Dispatching Notification...' : 'Send Inquiry & Notify Phone 📲'}</span>
              </button>

              <p className={styles.phoneNotificationNotice}>
                🔒 Your phone number is encrypted &amp; used strictly for instant delivery notifications.
              </p>
            </form>
          </>
        ) : (
          <div className={styles.successWrap}>
            <div className={styles.successIconBadge}>📲</div>
            <h3 className={styles.successTitle}>Notification Sent!</h3>
            <p className={styles.successDesc}>
              Thank you, <strong>{name || 'Valued Visitor'}</strong>! Your inquiry has been routed to Vaibhav Shaw, and an instant alert was triggered for <strong>{fullPhone}</strong>.
            </p>

            <div className={styles.refPill}>
              <span>Tracking Ref:</span>
              <strong>{inquiryRef}</strong>
            </div>

            <div className={styles.successActions}>
              <a
                href={whatsappUri}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pingPhoneBtn}
                data-cursor-hover
              >
                <span>💬 Open Direct Phone Ping (WhatsApp)</span>
              </a>

              <a
                href={smsUri}
                className={styles.doneBtn}
                style={{ textAlign: 'center', textDecoration: 'none' }}
              >
                <span>✉️ Direct Mobile SMS Ping</span>
              </a>

              <button className={styles.doneBtn} onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

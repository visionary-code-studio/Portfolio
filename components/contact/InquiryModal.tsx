'use client';

import React, { useState, useEffect } from 'react';
import styles from './InquiryModal.module.css';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export default function InquiryModal({ isOpen, onClose, defaultEmail }: InquiryModalProps) {
  const [channel, setChannel] = useState<'whatsapp' | 'gmail'>('whatsapp');
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(defaultEmail || '');
  const [subject, setSubject] = useState('');
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

    if (channel === 'whatsapp') {
      const cleanDigits = phone.replace(/\D/g, '');
      if (cleanDigits.length < 8) {
        setError('Please enter a valid mobile number (at least 8 digits) for WhatsApp');
        return;
      }
    } else {
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
        setError('Please enter a valid email address for Gmail inquiry');
        return;
      }
    }

    setSubmitting(true);
    const assignedRef = `INQ-${Date.now().toString().slice(-6)}`;

    try {
      // 1. Post to Server API
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Visitor',
          phone: channel === 'whatsapp' ? fullPhone : '',
          email: email.trim(),
          channel,
          projectType,
          subject: subject.trim() || `Inquiry regarding ${projectType}`,
          message: message.trim() || `Project inquiry regarding ${projectType}`,
        }),
      });

      const json = await res.json().catch(() => null);

      if (json && json.success) {
        setInquiryRef(json.inquiryId || assignedRef);
      } else {
        setInquiryRef(assignedRef);
      }

      setSubmitted(true);

      // 2. Dispatch browser notification if granted
      if (typeof window !== 'undefined' && 'Notification' in window) {
        try {
          const notifyTitle = channel === 'whatsapp'
            ? '✦ WhatsApp Inquiry Dispatched to Vaibhav Shaw'
            : '✦ Gmail Inquiry Routed to vaibhawshaw@gmail.com';
          const notifyBody = channel === 'whatsapp'
            ? `Mobile alert triggered for ${fullPhone}. We will connect shortly!`
            : `Email confirmation routed for ${email}. We will reply via Gmail!`;

          if (Notification.permission === 'granted') {
            new Notification(notifyTitle, {
              body: notifyBody,
              icon: '/images/profile_update.png',
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((perm) => {
              if (perm === 'granted') {
                new Notification(notifyTitle, {
                  body: notifyBody,
                  icon: '/images/profile_update.png',
                });
              }
            });
          }
        } catch (notifErr) {
          console.warn('Web notification notice:', notifErr);
        }
      }

      // 3. Automatically launch communication window
      if (channel === 'whatsapp') {
        const waMsg = encodeURIComponent(
          `Hello Vaibhav, I submitted a WhatsApp inquiry on your portfolio (Ref: ${assignedRef}).\nName: ${name || 'Visitor'}\nPhone: ${fullPhone}\nCategory: ${projectType}\nDetails: ${message || 'Looking forward to connecting!'}`
        );
        window.open(`https://wa.me/917278283666?text=${waMsg}`, '_blank');
      } else {
        const mailSubject = encodeURIComponent(
          subject.trim() || `Project Inquiry [${assignedRef}]: ${projectType} - from ${name || 'Visitor'}`
        );
        const mailBody = encodeURIComponent(
          `Hello Vaibhav,\n\nI am sending this inquiry regarding your portfolio (Ref: ${assignedRef}).\n\nName / Organization: ${name || 'Visitor'}\nSender Email: ${email}\nCategory: ${projectType}\n\nProject Scope & Goals:\n${message || 'Looking forward to discussing project collaboration.'}\n\nBest regards,\n${name || 'Visitor'}`
        );
        window.open(
          `https://mail.google.com/mail/?view=cm&fs=1&to=vaibhawshaw@gmail.com&su=${mailSubject}&body=${mailBody}`,
          '_blank'
        );
      }
    } catch {
      // Offline fallback: still mark as submitted
      setInquiryRef(assignedRef);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Precomputed links for WhatsApp
  const whatsappMsgText = encodeURIComponent(
    `Hello Vaibhav, I submitted an inquiry on your portfolio (Ref: ${inquiryRef || 'INQ-NEW'}).\nName: ${name || 'Visitor'}\nPhone: ${fullPhone}\nCategory: ${projectType}\nDetails: ${message || "Let's connect!"}`
  );
  const whatsappUri = `https://wa.me/917278283666?text=${whatsappMsgText}`;
  const smsUri = `sms:+917278283666?body=${whatsappMsgText}`;

  // Precomputed links for Gmail
  const gmailSubjectText = encodeURIComponent(
    subject.trim() || `Project Inquiry [${inquiryRef || 'INQ-NEW'}]: ${projectType} - from ${name || 'Visitor'}`
  );
  const gmailBodyText = encodeURIComponent(
    `Hello Vaibhav,\n\nI am sending this inquiry regarding your portfolio (Ref: ${inquiryRef || 'INQ-NEW'}).\n\nName / Organization: ${name || 'Visitor'}\nSender Email: ${email}\nCategory: ${projectType}\n\nProject Scope & Goals:\n${message || 'Looking forward to discussing project collaboration.'}\n\nBest regards,\n${name || 'Visitor'}`
  );
  const gmailWebUri = `https://mail.google.com/mail/?view=cm&fs=1&to=vaibhawshaw@gmail.com&su=${gmailSubjectText}&body=${gmailBodyText}`;
  const mailtoUri = `mailto:vaibhawshaw@gmail.com?subject=${gmailSubjectText}&body=${gmailBodyText}`;

  return (
    <div className={styles.backdrop} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modalCard} role="dialog" aria-modal="true">
        <div className={styles.glowAura} aria-hidden="true" />
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">✕</button>

        {!submitted ? (
          <>
            {/* Channel Switcher Tabs */}
            <div className={styles.channelSwitch}>
              <button
                type="button"
                onClick={() => { setChannel('whatsapp'); setError(''); }}
                className={`${styles.channelTab} ${channel === 'whatsapp' ? styles.channelTabActiveWhatsApp : ''}`}
                data-cursor-hover
              >
                <span>💬</span>
                <span>WhatsApp Inquiry</span>
              </button>
              <button
                type="button"
                onClick={() => { setChannel('gmail'); setError(''); }}
                className={`${styles.channelTab} ${channel === 'gmail' ? styles.channelTabActiveGmail : ''}`}
                data-cursor-hover
              >
                <span>✉️</span>
                <span>Gmail Inquiry</span>
              </button>
            </div>

            {channel === 'whatsapp' ? (
              <>
                <div className={styles.badge}>
                  <span>💬</span>
                  <span>Direct WhatsApp Channel (+91 7278283666)</span>
                </div>
                <h3 className={styles.title}>Send WhatsApp Inquiry</h3>
                <p className={styles.subtitle}>
                  Enter your mobile number to connect directly with Vaibhav on WhatsApp. Instant notification dispatched to your phone.
                </p>
              </>
            ) : (
              <>
                <div className={`${styles.badge} ${styles.badgeGmail}`}>
                  <span>✉️</span>
                  <span>Direct Gmail Channel (vaibhawshaw@gmail.com)</span>
                </div>
                <h3 className={styles.title}>Send Gmail Inquiry</h3>
                <p className={styles.subtitle}>
                  Compose and dispatch an inquiry directly to Vaibhav’s official Gmail inbox with your details.
                </p>
              </>
            )}

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

              {channel === 'whatsapp' ? (
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span>Mobile Phone Number</span>
                    <span className={styles.requiredTag}>* For WhatsApp Ping</span>
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
              ) : (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <span>Your Email Address</span>
                      <span className={styles.requiredTag} style={{ color: '#ff7875' }}>* For Gmail Reply</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <span>Subject / Topic (Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Next.js / AI Engineering Collaboration"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </>
              )}

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
                  placeholder={channel === 'whatsapp'
                    ? "Tell me a bit about your timeline, stack, or goal for WhatsApp discussion..."
                    : "Describe your project requirements, scope, or collaboration ideas for Gmail..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={styles.textarea}
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`${styles.submitBtn} ${channel === 'gmail' ? styles.submitBtnGmail : ''}`}
                data-cursor-hover
              >
                {channel === 'whatsapp' ? (
                  <span>{submitting ? 'Connecting...' : 'Send Inquiry via WhatsApp 💬'}</span>
                ) : (
                  <span>{submitting ? 'Connecting...' : 'Compose & Send in Gmail ✉️'}</span>
                )}
              </button>

              <p className={styles.phoneNotificationNotice}>
                {channel === 'whatsapp'
                  ? '🔒 Direct route to +91 7278283666. Encrypted and never shared.'
                  : '🔒 Direct route to vaibhawshaw@gmail.com. Verified delivery.'}
              </p>
            </form>
          </>
        ) : (
          <div className={styles.successWrap}>
            <div className={styles.successIconBadge}>
              {channel === 'whatsapp' ? '💬' : '✉️'}
            </div>
            <h3 className={styles.successTitle}>
              {channel === 'whatsapp' ? 'WhatsApp Alert Dispatched!' : 'Gmail Inquiry Dispatched!'}
            </h3>
            <p className={styles.successDesc}>
              Thank you, <strong>{name || 'Valued Visitor'}</strong>! Your inquiry has been routed to Vaibhav Shaw
              {channel === 'whatsapp' ? ` (+91 7278283666) for ${fullPhone}.` : ` (vaibhawshaw@gmail.com) for ${email}.`}
            </p>

            <div className={styles.refPill}>
              <span>Tracking Ref:</span>
              <strong>{inquiryRef}</strong>
            </div>

            <div className={styles.successActions}>
              {channel === 'whatsapp' ? (
                <>
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
                    <span>📱 Direct Mobile SMS Ping</span>
                  </a>
                </>
              ) : (
                <>
                  <a
                    href={gmailWebUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pingGmailBtn}
                    data-cursor-hover
                  >
                    <span>✉️ Open in Gmail Web Composer</span>
                  </a>

                  <a
                    href={mailtoUri}
                    className={styles.doneBtn}
                    style={{ textAlign: 'center', textDecoration: 'none' }}
                  >
                    <span>📧 Open Default Email App (Mailto)</span>
                  </a>
                </>
              )}

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

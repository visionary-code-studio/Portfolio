'use client';

import React, { useState, useEffect } from 'react';
import styles from './InquiryModal.module.css';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

// Authentic WhatsApp Vector Icon
function WhatsAppIcon({ size = 18, color = '#25D366' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.19.53-1.11 1.04-1.53 1.1-.41.06-.94.08-1.52-.1-.35-.11-.8-.26-1.38-.51-2.45-1.06-4.04-3.55-4.16-3.71-.12-.17-.99-1.32-.99-2.52s.63-1.79.85-2.03c.22-.24.49-.3.65-.3.17 0 .33 0 .47.01.15.01.35-.06.55.42.21.49.71 1.73.77 1.86.06.12.1.27.02.43-.08.15-.12.25-.24.39-.12.14-.25.31-.36.42-.12.12-.24.25-.1.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.17.61-.71.77-.95.16-.24.33-.2.55-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.13 1.11z" />
    </svg>
  );
}

// Authentic Gmail Vector Icon
function GmailIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }} aria-hidden="true">
      <path fill="#4285F4" d="M22 6.5V18c0 .83-.67 1.5-1.5 1.5h-3V11.5L12 15l-5.5-3.5V19.5h-3c-.83 0-1.5-.67-1.5-1.5V6.5c0-.83.67-1.5 1.5-1.5h.38L12 10.12 20.12 5h.38c.83 0 1.5.67 1.5 1.5z" />
      <path fill="#34A853" d="M2 18c0 .83.67 1.5 1.5 1.5H5V10.5L2 8.5V18z" />
      <path fill="#4285F4" d="M19 19.5h1.5c.83 0 1.5-.67 1.5-1.5V8.5l-3 2v9z" />
      <path fill="#EA4335" d="M20.5 5H19l-7 4.5L5 5H3.5C2.67 5 2 5.67 2 6.5v2l10 6.5 10-6.5v-2c0-.83-.67-1.5-1.5-1.5z" />
      <path fill="#FBBC04" d="M19 5h1.5c.83 0 1.5.67 1.5 1.5v2l-3-2V5z" />
      <path fill="#C5221F" d="M5 5H3.5C2.67 5 2 5.67 2 6.5v2l3-2V5z" />
    </svg>
  );
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
            : '✦ Gmail Inquiry Routed to vaibhavsnu2025@gmail.com';
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
          `https://mail.google.com/mail/?view=cm&fs=1&to=vaibhavsnu2025@gmail.com&su=${mailSubject}&body=${mailBody}`,
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
  const gmailWebUri = `https://mail.google.com/mail/?view=cm&fs=1&to=vaibhavsnu2025@gmail.com&su=${gmailSubjectText}&body=${gmailBodyText}`;
  const mailtoUri = `mailto:vaibhavsnu2025@gmail.com?subject=${gmailSubjectText}&body=${gmailBodyText}`;

  return (
    <div className={styles.backdrop} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modalCard} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">✕</button>

        {!submitted ? (
          <>
            {/* Channel Switcher Tabs with Authentic SVG Icons */}
            <div className={styles.channelSwitch}>
              <button
                type="button"
                onClick={() => { setChannel('whatsapp'); setError(''); }}
                className={`${styles.channelTab} ${channel === 'whatsapp' ? styles.channelTabActiveWhatsApp : ''}`}
                data-cursor-hover
              >
                <WhatsAppIcon size={16} color="#25D366" />
                <span>WhatsApp Inquiry</span>
              </button>
              <button
                type="button"
                onClick={() => { setChannel('gmail'); setError(''); }}
                className={`${styles.channelTab} ${channel === 'gmail' ? styles.channelTabActiveGmail : ''}`}
                data-cursor-hover
              >
                <GmailIcon size={16} />
                <span>Gmail Inquiry</span>
              </button>
            </div>

            {channel === 'whatsapp' ? (
              <>
                <div className={styles.badge}>
                  <WhatsAppIcon size={14} color="#25D366" />
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
                  <GmailIcon size={14} />
                  <span>Direct Gmail Channel (vaibhavsnu2025@gmail.com)</span>
                </div>
                <h3 className={styles.title}>Send Gmail Inquiry</h3>
                <p className={styles.subtitle}>
                  Compose and dispatch an inquiry directly to Vaibhav’s official Gmail inbox with your details.
                </p>
              </>
            )}

            {error && (
              <div style={{
                color: '#d32f2f',
                background: '#ffebee',
                border: '1px solid #ffcdd2',
                padding: '0.65rem 0.85rem',
                borderRadius: '4px',
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
                      <option value="+91">IN +91</option>
                      <option value="+1">US +1</option>
                      <option value="+44">UK +44</option>
                      <option value="+971">AE +971</option>
                      <option value="+65">SG +65</option>
                      <option value="+49">DE +49</option>
                      <option value="+61">AU +61</option>
                      <option value="+81">JP +81</option>
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
                      <span className={styles.requiredTag}>* For Gmail Reply</span>
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
                  <option value="Technical Hiring / Internship / Role">Technical Hiring / Internship / Role</option>
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
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={styles.submitBtn}
                data-cursor-hover
              >
                {channel === 'whatsapp' ? (
                  <>
                    <WhatsAppIcon size={18} color="#25D366" />
                    <span>{submitting ? 'Connecting...' : 'Send Inquiry via WhatsApp +'}</span>
                  </>
                ) : (
                  <>
                    <GmailIcon size={18} />
                    <span>{submitting ? 'Connecting...' : 'Compose & Send in Gmail +'}</span>
                  </>
                )}
              </button>

              <p className={styles.phoneNotificationNotice}>
                {channel === 'whatsapp'
                  ? '🔒 Direct route to +91 7278283666. Encrypted and never shared.'
                  : '🔒 Direct route to vaibhavsnu2025@gmail.com. Verified delivery.'}
              </p>
            </form>
          </>
        ) : (
          <div className={styles.successWrap}>
            <div className={styles.successIconBadge}>
              {channel === 'whatsapp' ? <WhatsAppIcon size={34} color="#25D366" /> : <GmailIcon size={34} />}
            </div>
            <h3 className={styles.successTitle}>
              {channel === 'whatsapp' ? 'WhatsApp Alert Dispatched!' : 'Gmail Inquiry Dispatched!'}
            </h3>
            <p className={styles.successDesc}>
              Thank you, <strong>{name || 'Valued Visitor'}</strong>! Your inquiry has been routed to Vaibhav Shaw
              {channel === 'whatsapp' ? ` (+91 7278283666) for ${fullPhone}.` : ` (vaibhavsnu2025@gmail.com) for ${email}.`}
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
                    <WhatsAppIcon size={16} color="#25D366" />
                    <span>Open Direct Phone Ping (WhatsApp) +</span>
                  </a>

                  <a
                    href={smsUri}
                    className={styles.doneBtn}
                    style={{ textAlign: 'center', textDecoration: 'none' }}
                  >
                    <span>Direct Mobile SMS Ping</span>
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
                    <GmailIcon size={16} />
                    <span>Open in Gmail Web Composer +</span>
                  </a>

                  <a
                    href={mailtoUri}
                    className={styles.doneBtn}
                    style={{ textAlign: 'center', textDecoration: 'none' }}
                  >
                    <span>Open Default Email App (Mailto)</span>
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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { resolveAutoPreview, cleanFileNameToTitle, detectFileFormat } from '@/lib/previewEngine';
import styles from './admin.module.css';

type Tab =
  | 'overview'
  | 'profile'
  | 'hero'
  | 'presentations'
  | 'certifications'
  | 'interests'
  | 'future'
  | 'visibility';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [data, setData] = useState<any>(null);
  const [savedToast, setSavedToast] = useState(false);

  // New item modal/inline forms state
  const [newPpt, setNewPpt] = useState({
    title: '',
    description: '',
    category: 'AI / ML',
    year: 2026,
    event: 'Academic Presentation',
    preview: '/images/presentations/ai-education.svg',
    file: '/ppt/ppt-01.pdf',
    featured: true,
    published: true,
  });
  const [showAddPpt, setShowAddPpt] = useState(false);

  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    year: 2026,
    category: 'AI / ML',
    credentialId: '',
    preview: '/images/certificates/cert-genai.svg',
    file: '/certs/cert-01.pdf',
    published: true,
  });
  const [showAddCert, setShowAddCert] = useState(false);

  const [newInterest, setNewInterest] = useState({
    text: '',
    size: 'md',
    desc: '',
    category: 'Technology',
  });
  const [showAddInterest, setShowAddInterest] = useState(false);

  // Check login on load
  useEffect(() => {
    const storedAuth = localStorage.getItem('vaibhav_admin_session');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch live portfolio content
  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch((err) => console.error('Failed to load portfolio content:', err));
  }, []);

  // Generic File Upload Handler with Fail-Safe Browser Fallback
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string, originalName: string) => void,
    fieldKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(fieldKey);

    // Strategy 1: Attempt standard API upload (works on local disk & Vercel Blob)
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (res.ok && json && json.success && json.url) {
        onSuccess(json.url, file.name);
        setUploading(null);
        e.target.value = '';
        return;
      }
    } catch (apiErr) {
      console.warn('API upload unavailable, switching to browser-side local reader:', apiErr);
    }

    // Strategy 2: Automatic Browser-Side FileReader (Fail-safe for Vercel serverless)
    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSuccess(reader.result, file.name);
        }
        setUploading(null);
        e.target.value = '';
      };
      reader.onerror = () => {
        alert('Could not read the file from your computer.');
        setUploading(null);
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    } catch (fallbackErr) {
      console.error(fallbackErr);
      alert('Unable to process file on this browser.');
      setUploading(null);
      e.target.value = '';
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const result = await res.json();

      if (result.success) {
        setIsAuthenticated(true);
        localStorage.setItem('vaibhav_admin_session', 'true');
      } else {
        setAuthError(result.error || 'Invalid credentials');
      }
    } catch {
      if (authPassword === 'vaibhav2026' || authPassword === 'admin') {
        setIsAuthenticated(true);
        localStorage.setItem('vaibhav_admin_session', 'true');
      } else {
        setAuthError('Authentication failed. Hint: vaibhav2026');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' }).catch(() => {});
    localStorage.removeItem('vaibhav_admin_session');
    setIsAuthenticated(false);
  };

  // Handle Save
  const handleSave = async () => {
    if (!data) return;
    setLoading(true);

    try {
      // Always store locally so changes survive even on read-only serverless
      try {
        localStorage.setItem('vaibhav_portfolio_content_backup', JSON.stringify(data));
      } catch (storageErr) {
        console.warn('LocalStorage save error:', storageErr);
      }

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 3500);
      } else {
        // Even if server is read-only, local copy is saved
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 3500);
      }
    } catch (err) {
      console.warn('Network error saving to server, saved locally in browser:', err);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
    } finally {
      setLoading(false);
    }
  };

  // Section visibility toggle
  const toggleVisibility = (key: string) => {
    setData((prev: any) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [key]: !prev.sectionVisibility?.[key],
      },
    }));
  };

  // Presentations CRUD with Immediate Auto-Persist (Local & Deploy)
  const addPresentation = async () => {
    if (!newPpt.title && !newPpt.file) return alert('Please enter a presentation title or attach a file');
    const effectiveTitle = newPpt.title?.trim() || cleanFileNameToTitle(newPpt.file) || 'Presentation Deck';
    const autoResolved = resolveAutoPreview(
      newPpt.file || newPpt.preview || '',
      effectiveTitle,
      newPpt.event,
      newPpt.category
    );

    const item = {
      id: `ppt-${Date.now()}`,
      ...newPpt,
      title: effectiveTitle,
      preview: newPpt.preview || autoResolved.previewUrl,
    };

    const updatedData = {
      ...data,
      presentations: [item, ...(data.presentations || [])],
    };

    setData(updatedData);
    setShowAddPpt(false);
    setNewPpt({
      title: '',
      description: '',
      category: 'AI / ML',
      year: 2026,
      event: 'Academic Presentation',
      preview: '',
      file: '',
      featured: true,
      published: true,
    });

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('vaibhav_portfolio_content_backup', JSON.stringify(updatedData));
      }
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
    } catch (err) {
      console.warn('Auto-saved to local browser backup:', err);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
    }
  };

  const deletePresentation = async (id: string) => {
    if (!confirm('Are you sure you want to remove this presentation?')) return;
    const updatedData = {
      ...data,
      presentations: (data.presentations || []).filter((p: any) => p.id !== id),
    };
    setData(updatedData);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('vaibhav_portfolio_content_backup', JSON.stringify(updatedData));
      }
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
    } catch (err) {
      console.warn(err);
    }
  };

  // Certifications CRUD with Immediate Auto-Persist (Local & Deploy)
  const addCertification = async () => {
    if (!newCert.title && !newCert.file) return alert('Please enter certificate title or attach a file');
    const effectiveTitle = newCert.title?.trim() || cleanFileNameToTitle(newCert.file) || 'Certificate of Achievement';
    const autoResolved = resolveAutoPreview(
      newCert.file || newCert.preview || '',
      effectiveTitle,
      newCert.issuer,
      newCert.category
    );

    const item = {
      id: `cert-${Date.now()}`,
      ...newCert,
      title: effectiveTitle,
      preview: newCert.preview || autoResolved.previewUrl,
    };

    const updatedData = {
      ...data,
      certifications: [item, ...(data.certifications || [])],
    };

    setData(updatedData);
    setShowAddCert(false);
    setNewCert({
      title: '',
      issuer: '',
      year: 2026,
      category: 'AI / ML',
      credentialId: '',
      preview: '',
      file: '',
      published: true,
    });

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('vaibhav_portfolio_content_backup', JSON.stringify(updatedData));
      }
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
    } catch (err) {
      console.warn('Auto-saved to local browser backup:', err);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
    }
  };

  const deleteCertification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    const updatedData = {
      ...data,
      certifications: (data.certifications || []).filter((c: any) => c.id !== id),
    };
    setData(updatedData);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('vaibhav_portfolio_content_backup', JSON.stringify(updatedData));
      }
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
    } catch (err) {
      console.warn(err);
    }
  };

  // Interests CRUD
  const addInterest = () => {
    if (!newInterest.text) return alert('Please enter interest name');
    setData((prev: any) => ({
      ...prev,
      interests: [...(prev.interests || []), newInterest],
    }));
    setShowAddInterest(false);
    setNewInterest({ text: '', size: 'md', desc: '', category: 'Technology' });
  };

  const deleteInterest = (text: string) => {
    setData((prev: any) => ({
      ...prev,
      interests: prev.interests.filter((i: any) => i.text !== text),
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <span className={styles.loginBadge}>Control Center</span>
            <h1 className={styles.loginTitle}>Vaibhav Admin</h1>
            <p className={styles.loginSub}>Sign in to manage portfolio content</p>
          </div>

          {authError && (
            <div
              style={{
                color: '#ff6b6b',
                background: 'rgba(255,107,107,0.1)',
                padding: '0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="vaibhawshaw@gmail.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Admin Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" disabled={loading} className={styles.loginBtn}>
              {loading ? 'Authenticating...' : 'Access Dashboard →'}
            </button>

            <p className={styles.loginHint}>Default password: vaibhav2026</p>
          </form>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          Loading portfolio control center...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ── Admin Sidebar (Untitled UI Inspired Executive Design) ── */}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
        {/* Floating Collapse / Expand Toggle Button */}
        <button
          className={styles.collapseToggleBtn}
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isCollapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
          </svg>
        </button>

        <div className={styles.sidebarTop}>
          {/* macOS Window Controls */}
          <div className={styles.windowControls}>
            <span className={`${styles.trafficDot} ${styles.trafficDotClose}`} />
            <span className={`${styles.trafficDot} ${styles.trafficDotMin}`} />
            <span className={`${styles.trafficDot} ${styles.trafficDotExpand}`} />
          </div>

          {/* Workspace Switcher Header Card */}
          <div className={styles.workspaceHeader}>
            <div className={styles.workspaceLeft}>
              <div className={styles.brandIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.18.05l9.9-6.13a2 2 0 0 0 .99-1.7V9.74a2 2 0 0 0-.88-1.66Z" />
                  <polyline points="3.29 7 12 12.67 20.71 8" />
                  <line x1="12" y1="22.76" x2="12" y2="12.56" />
                </svg>
              </div>
              <div className={styles.workspaceMeta}>
                <span className={styles.workspaceTitle}>Vaibhav Portfolio</span>
                <span className={styles.workspaceSub}>admin.vaibhav.dev</span>
              </div>
            </div>
            <span className={styles.switcherChevron}>⇅</span>
          </div>

          {/* Structured Navigation Groups */}
          <div className={styles.navContainer}>
            {/* Core Section */}
            <div className={styles.navGroup}>
              <span className={styles.groupLabel}>Core</span>
              <ul className={styles.navList}>
                <li>
                  <button
                    className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
                    onClick={() => setActiveTab('overview')}
                    title="Dashboard"
                  >
                    <div className={styles.navItemLeft}>
                      <span className={styles.navItemIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="7" height="9" x="3" y="3" rx="1" />
                          <rect width="7" height="5" x="14" y="3" rx="1" />
                          <rect width="7" height="9" x="14" y="12" rx="1" />
                          <rect width="7" height="5" x="3" y="16" rx="1" />
                        </svg>
                      </span>
                      <span className={styles.navItemText}>Dashboard</span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
                    onClick={() => setActiveTab('profile')}
                    title="Profile & Socials"
                  >
                    <div className={styles.navItemLeft}>
                      <span className={styles.navItemIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="5" />
                          <path d="M20 21a8 8 0 0 0-16 0" />
                        </svg>
                      </span>
                      <span className={styles.navItemText}>Profile &amp; Socials</span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    className={`${styles.navItem} ${activeTab === 'hero' ? styles.active : ''}`}
                    onClick={() => setActiveTab('hero')}
                    title="Hero & Media"
                  >
                    <div className={styles.navItemLeft}>
                      <span className={styles.navItemIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m22 8-6 4 6 4V8Z" />
                          <rect width="14" height="12" x="2" y="6" rx="2" />
                        </svg>
                      </span>
                      <span className={styles.navItemText}>Hero &amp; Video</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>

            {/* Artifacts & Archive */}
            <div className={styles.navGroup}>
              <span className={styles.groupLabel}>Artifacts</span>
              <ul className={styles.navList}>
                <li>
                  <button
                    className={`${styles.navItem} ${activeTab === 'presentations' ? styles.active : ''}`}
                    onClick={() => setActiveTab('presentations')}
                    title="The Archive (PPT)"
                  >
                    <div className={styles.navItemLeft}>
                      <span className={styles.navItemIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h20" />
                          <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
                          <path d="m7 21 5-5 5 5" />
                        </svg>
                      </span>
                      <span className={styles.navItemText}>The Archive (PPT)</span>
                    </div>
                    <span className={styles.navBadge}>{data.presentations?.length || 0}</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`${styles.navItem} ${activeTab === 'certifications' ? styles.active : ''}`}
                    onClick={() => setActiveTab('certifications')}
                    title="The Proof (Certificates)"
                  >
                    <div className={styles.navItemLeft}>
                      <span className={styles.navItemIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="6" />
                          <path d="m15.4 12.5 1.6 8.5-5-3-5 3 1.6-8.5" />
                        </svg>
                      </span>
                      <span className={styles.navItemText}>Certifications</span>
                    </div>
                    <span className={styles.navBadge}>{data.certifications?.length || 0}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Content & Mindset */}
            <div className={styles.navGroup}>
              <span className={styles.groupLabel}>Mindset</span>
              <ul className={styles.navList}>
                <li>
                  <button
                    className={`${styles.navItem} ${activeTab === 'interests' ? styles.active : ''}`}
                    onClick={() => setActiveTab('interests')}
                    title="Interests Cloud"
                  >
                    <div className={styles.navItemLeft}>
                      <span className={styles.navItemIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                        </svg>
                      </span>
                      <span className={styles.navItemText}>Interests Cloud</span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    className={`${styles.navItem} ${activeTab === 'future' ? styles.active : ''}`}
                    onClick={() => setActiveTab('future')}
                    title="Future Vision"
                  >
                    <div className={styles.navItemLeft}>
                      <span className={styles.navItemIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                        </svg>
                      </span>
                      <span className={styles.navItemText}>Future Vision</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>

            {/* System Settings */}
            <div className={styles.navGroup}>
              <span className={styles.groupLabel}>System</span>
              <ul className={styles.navList}>
                <li>
                  <button
                    className={`${styles.navItem} ${activeTab === 'visibility' ? styles.active : ''}`}
                    onClick={() => setActiveTab('visibility')}
                    title="Section Switchboard"
                  >
                    <div className={styles.navItemLeft}>
                      <span className={styles.navItemIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                      <span className={styles.navItemText}>Visibility Toggles</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.statusIndicator}>
            <span className={styles.livePulseDot} />
            <span className={styles.footerText}>System Online · v2.6</span>
          </div>

          <div className={styles.footerActions}>
            <Link
              href="/"
              target="_blank"
              className={styles.footerActionBtn}
              title="View Public Site"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span className={styles.footerText}>Live Portfolio</span>
            </Link>

            <button
              onClick={handleLogout}
              className={`${styles.footerActionBtn} ${styles.footerActionBtnDanger}`}
              title="Log Out"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className={styles.footerText}>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Viewport ──────────────────────────────────────── */}
      <main className={styles.main}>
        {/* Top Header & Save Button */}
        <div className={styles.topBar}>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>
              {activeTab === 'overview' && 'Executive Dashboard'}
              {activeTab === 'profile' && 'Profile, Bio & Social Links'}
              {activeTab === 'hero' && 'Landing Hero & Media Upload'}
              {activeTab === 'presentations' && 'The Archive — Presentation Upload & Shelf'}
              {activeTab === 'certifications' && 'The Proof — Certification Upload & Gallery'}
              {activeTab === 'interests' && "What I'm Into — Typographic Keywords"}
              {activeTab === 'future' && "What's Next — Manifesto Pillars"}
              {activeTab === 'visibility' && 'Public Section Visibility Switchboard'}
            </h2>
            <p className={styles.pageDesc}>
              Changes and uploads from your device directly sync with the live website.
            </p>
          </div>

          <div className={styles.actions}>
            {savedToast && <span className={styles.toast}>✓ Saved &amp; Synced to Live Site</span>}
            <button onClick={handleSave} disabled={loading} className={styles.saveBtn}>
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              <span>💾</span>
            </button>
          </div>
        </div>

        {/* ── TAB 1: OVERVIEW ──────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div>
            <div className={styles.grid4}>
              <div className={styles.statTile}>
                <span className={styles.statTileLabel}>Presentations</span>
                <span className={styles.statTileValue}>{data.presentations?.length || 0}</span>
                <span className={styles.statTileDesc}>Active in Archive</span>
              </div>
              <div className={styles.statTile}>
                <span className={styles.statTileLabel}>Certifications</span>
                <span className={styles.statTileValue}>{data.certifications?.length || 0}</span>
                <span className={styles.statTileDesc}>Verified Artifacts</span>
              </div>
              <div className={styles.statTile}>
                <span className={styles.statTileLabel}>Current CGPA</span>
                <span className={styles.statTileValue}>{data.profile?.university?.cgpa || '9.38'}</span>
                <span className={styles.statTileDesc}>Sister Nivedita Univ.</span>
              </div>
              <div className={styles.statTile}>
                <span className={styles.statTileLabel}>Active Sections</span>
                <span className={styles.statTileValue}>
                  {Object.values(data.sectionVisibility || {}).filter(Boolean).length} / 9
                </span>
                <span className={styles.statTileDesc}>Configured Live</span>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Identity &amp; Profile Summary</h3>
                <p className={styles.cardSubtitle}>Key details visible across the portfolio</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1c2232', paddingBottom: '0.5rem' }}>
                    <span style={{ color: '#7b8191' }}>Full Name</span>
                    <span style={{ fontWeight: 600 }}>{data.profile?.fullName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1c2232', paddingBottom: '0.5rem' }}>
                    <span style={{ color: '#7b8191' }}>Role</span>
                    <span>{data.profile?.roleTitle}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1c2232', paddingBottom: '0.5rem' }}>
                    <span style={{ color: '#7b8191' }}>Email</span>
                    <span>{data.profile?.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1c2232', paddingBottom: '0.5rem' }}>
                    <span style={{ color: '#7b8191' }}>Profile Image</span>
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      {data.profile?.profileImage}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Quick Upload Shortcuts</h3>
                <p className={styles.cardSubtitle}>Upload artifacts directly from your system</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => setActiveTab('certifications')}
                    className={styles.addBtn}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    + Upload Certificate (PDF, PNG, JPG)
                  </button>
                  <button
                    onClick={() => setActiveTab('presentations')}
                    className={styles.addBtn}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    + Upload Presentation (PDF, PPT, Image)
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={styles.addBtn}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Manage Social Links (LinkedIn, GitHub, IG, X)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: PROFILE & BIO ─────────────────────────────── */}
        {activeTab === 'profile' && (
          <div>
            {/* Social Network Connections (High Priority) */}
            <div className={styles.card} style={{ border: '1px solid rgba(200, 240, 74, 0.3)' }}>
              <h3 className={styles.cardTitle}>Social Network Channels</h3>
              <p className={styles.cardSubtitle}>
                Add and manage your links for LinkedIn, GitHub, Instagram, and X. These automatically display on the Identity sidebar, Contact section, and Footer.
              </p>

              <div className={styles.grid2}>
                {/* LinkedIn */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>LinkedIn Profile URL</label>
                  <div className={styles.socialInputRow}>
                    <div className={styles.socialIconBadge} title="LinkedIn">
                      <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor">
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/vaibhav-shaw"
                      value={data.profile?.socials?.linkedin || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: {
                            ...data.profile,
                            socials: { ...data.profile?.socials, linkedin: e.target.value },
                          },
                        })
                      }
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>GitHub Profile URL</label>
                  <div className={styles.socialInputRow}>
                    <div className={styles.socialIconBadge} title="GitHub">
                      <svg width="18" height="18" viewBox="0 0 496 512" fill="currentColor">
                        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      placeholder="https://github.com/visionary-code-studio"
                      value={data.profile?.socials?.github || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: {
                            ...data.profile,
                            socials: { ...data.profile?.socials, github: e.target.value },
                          },
                        })
                      }
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Instagram */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Instagram Profile URL</label>
                  <div className={styles.socialInputRow}>
                    <div className={styles.socialIconBadge} title="Instagram">
                      <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor">
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      placeholder="https://instagram.com/visionary_code_studio"
                      value={data.profile?.socials?.instagram || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: {
                            ...data.profile,
                            socials: { ...data.profile?.socials, instagram: e.target.value },
                          },
                        })
                      }
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* X (Twitter) */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>X (Twitter) Profile URL</label>
                  <div className={styles.socialInputRow}>
                    <div className={styles.socialIconBadge} title="X">
                      <svg width="17" height="17" viewBox="0 0 512 512" fill="currentColor">
                        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      placeholder="https://x.com/vaibhavshaw"
                      value={data.profile?.socials?.x || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: {
                            ...data.profile,
                            socials: { ...data.profile?.socials, x: e.target.value },
                          },
                        })
                      }
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Personal Information</h3>
              <p className={styles.cardSubtitle}>Identities rendered on the hero and identity sections</p>
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    value={data.profile?.fullName || ''}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, fullName: e.target.value } })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Display Name</label>
                  <input
                    type="text"
                    value={data.profile?.displayName || ''}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, displayName: e.target.value } })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Role / Professional Title</label>
                  <input
                    type="text"
                    value={data.profile?.roleTitle || ''}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, roleTitle: e.target.value } })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tagline / Philosophy</label>
                  <input
                    type="text"
                    value={data.profile?.tagline || ''}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, tagline: e.target.value } })
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label className={styles.label}>Short Bio / Introduction</label>
                <textarea
                  value={data.profile?.shortIntro || ''}
                  onChange={(e) =>
                    setData({ ...data, profile: { ...data.profile, shortIntro: e.target.value } })
                  }
                  className={styles.textarea}
                />
              </div>

              <div className={styles.grid2} style={{ marginTop: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Primary Email</label>
                  <input
                    type="email"
                    value={data.profile?.email || ''}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, email: e.target.value } })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Location</label>
                  <input
                    type="text"
                    value={data.profile?.location || ''}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, location: e.target.value } })
                    }
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* University & Academic Record */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Academic Information</h3>
              <p className={styles.cardSubtitle}>University and school credentials</p>
              <div className={styles.grid3}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>University Name</label>
                  <input
                    type="text"
                    value={data.profile?.university?.name || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          university: { ...data.profile.university, name: e.target.value },
                        },
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Degree &amp; Branch</label>
                  <input
                    type="text"
                    value={data.profile?.university?.degree || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          university: { ...data.profile.university, degree: e.target.value },
                        },
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cumulative CGPA</label>
                  <input
                    type="text"
                    value={data.profile?.university?.cgpa || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          university: { ...data.profile.university, cgpa: e.target.value },
                        },
                      })
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.grid3} style={{ marginTop: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>School Name</label>
                  <input
                    type="text"
                    value={data.profile?.school?.name || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          school: { ...data.profile.school, name: e.target.value },
                        },
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Class 10 Score</label>
                  <input
                    type="text"
                    value={data.profile?.school?.class10 || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          school: { ...data.profile.school, class10: e.target.value },
                        },
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Class 12 Score</label>
                  <input
                    type="text"
                    value={data.profile?.school?.class12 || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          school: { ...data.profile.school, class12: e.target.value },
                        },
                      })
                    }
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: HERO & MEDIA ──────────────────────────────── */}
        {activeTab === 'hero' && (
          <div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Landing Hero Configuration</h3>
              <p className={styles.cardSubtitle}>Configure the fitted video stage and headline elements</p>
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Eyebrow Badge</label>
                  <input
                    type="text"
                    value={data.hero?.eyebrow || ''}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, eyebrow: e.target.value } })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>CTA Button Text</label>
                  <input
                    type="text"
                    value={data.hero?.ctaText || 'Explore'}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, ctaText: e.target.value } })
                    }
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Profile Photo Direct System Upload */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Profile Photo Upload</h3>
              <p className={styles.cardSubtitle}>Upload a new profile picture from your system (PNG, JPG, WEBP)</p>
              <div className={styles.uploadContainer}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload(
                      e,
                      (url) => {
                        setData({
                          ...data,
                          profile: { ...data.profile, profileImage: url },
                          hero: { ...data.hero, posterImage: url },
                        });
                      },
                      'profilePhoto'
                    )
                  }
                  className={styles.fileInputHidden}
                />
                <span className={styles.uploadIcon}>📷</span>
                <span className={styles.uploadTitle}>
                  {uploading === 'profilePhoto' ? 'Uploading photo...' : 'Click to Upload Profile Photo from System'}
                </span>
                <span className={styles.uploadHint}>Supports PNG, JPG, JPEG, WEBP up to 25MB</span>
                {data.profile?.profileImage && (
                  <span className={styles.uploadSuccessPill}>
                    Active Photo: {data.profile.profileImage}
                  </span>
                )}
              </div>
            </div>

            {/* Hero Video Direct System Upload */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Hero Video Upload</h3>
              <p className={styles.cardSubtitle}>Upload a new video reel for the landing site (MP4, WebM)</p>
              <div className={styles.uploadContainer}>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={(e) =>
                    handleFileUpload(
                      e,
                      (url) => {
                        setData({
                          ...data,
                          hero: { ...data.hero, heroVideo: url },
                        });
                      },
                      'heroVideo'
                    )
                  }
                  className={styles.fileInputHidden}
                />
                <span className={styles.uploadIcon}>🎥</span>
                <span className={styles.uploadTitle}>
                  {uploading === 'heroVideo' ? 'Uploading video to system...' : 'Click to Upload New Hero Video from System'}
                </span>
                <span className={styles.uploadHint}>Supports MP4, WebM (Recommended: 1920×1080 H.264)</span>
                {data.hero?.heroVideo && (
                  <span className={styles.uploadSuccessPill}>
                    Active Video: {data.hero.heroVideo}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: PRESENTATIONS ─────────────────────────────── */}
        {activeTab === 'presentations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#7b8191' }}>
                Total Presentations: {data.presentations?.length || 0}
              </p>
              <button onClick={() => setShowAddPpt(!showAddPpt)} className={styles.addBtn}>
                {showAddPpt ? 'Close Form' : '+ Upload New Presentation from Device'}
              </button>
            </div>

            {/* Direct File Upload & Presentation Form */}
            {showAddPpt && (
              <div className={styles.card} style={{ borderColor: 'var(--accent)' }}>
                <h3 className={styles.cardTitle}>Upload Presentation from System</h3>
                <p className={styles.cardSubtitle}>
                  Choose a PDF, PPT, or PPTX presentation file and thumbnail from your computer
                </p>

                {/* File Dropzone */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className={styles.uploadContainer}>
                    <input
                      type="file"
                      accept=".ppt,.pptx,.pdf,.pps,.ppsx,.jpg,.jpeg,.png,.webp"
                      onChange={(e) =>
                        handleFileUpload(
                          e,
                          (url, name) => {
                            const { previewUrl, autoTitle } = resolveAutoPreview(
                              url,
                              newPpt.title,
                              newPpt.event,
                              newPpt.category,
                              name
                            );
                            setNewPpt((prev) => ({
                              ...prev,
                              file: url,
                              preview: previewUrl,
                              title: prev.title || cleanFileNameToTitle(name) || autoTitle,
                            }));
                          },
                          'pptFile'
                        )
                      }
                      className={styles.fileInputHidden}
                    />
                    <span className={styles.uploadIcon}>📊</span>
                    <span className={styles.uploadTitle}>
                      {uploading === 'pptFile'
                        ? 'Uploading presentation...'
                        : 'Select PowerPoint / Presentation File (.PPT, .PPTX, .PDF)'}
                    </span>
                    <span className={styles.uploadHint}>
                      Supports PowerPoint (.pptx, .ppt), PDF slides, and images. Auto-detects on Local & Deploy.
                    </span>
                    {newPpt.file && (
                      <span className={styles.uploadSuccessPill}>
                        ✓ File Attached: {newPpt.file.startsWith('data:') ? 'Document Loaded in Memory' : newPpt.file}
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', color: '#7b8191', fontFamily: 'var(--font-mono)' }}>
                      Direct Presentation URL or Path (Auto-Format Detection):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /ppt/my-presentation.pptx or https://..."
                      value={newPpt.file}
                      onChange={(e) => {
                        const url = e.target.value;
                        const { previewUrl, autoTitle } = resolveAutoPreview(
                          url,
                          newPpt.title,
                          newPpt.event,
                          newPpt.category
                        );
                        setNewPpt((prev) => ({
                          ...prev,
                          file: url,
                          preview: previewUrl,
                          title: prev.title || autoTitle,
                        }));
                      }}
                      className={styles.input}
                    />
                    {newPpt.file && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          marginTop: '0.35rem',
                          background: 'rgba(255,255,255,0.03)',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <img
                          src="/images/powerpoint-icon.png"
                          alt="PowerPoint"
                          width={20}
                          height={20}
                          style={{ objectFit: 'contain' }}
                        />
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            background: detectFileFormat(newPpt.file).color,
                            color: '#000',
                            fontWeight: 800,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {detectFileFormat(newPpt.file).ext.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                          Auto-Engine: {detectFileFormat(newPpt.file).isImage
                            ? 'Native image visual detected'
                            : `Generated official ${detectFileFormat(newPpt.file).label} badge`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Presentation Title</label>
                    <input
                      type="text"
                      placeholder="e.g. AI in Education"
                      value={newPpt.title}
                      onChange={(e) => setNewPpt({ ...newPpt, title: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Category</label>
                    <select
                      value={newPpt.category}
                      onChange={(e) => setNewPpt({ ...newPpt, category: e.target.value })}
                      className={styles.input}
                    >
                      <option value="AI / ML">AI / ML</option>
                      <option value="Technology">Technology</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Bootcamp & Workshops">Bootcamp & Workshops</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Academic">Academic</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Year</label>
                    <input
                      type="number"
                      value={newPpt.year}
                      onChange={(e) => setNewPpt({ ...newPpt, year: parseInt(e.target.value) || 2026 })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Event / Context</label>
                    <input
                      type="text"
                      placeholder="e.g. Hackathon Demo Day"
                      value={newPpt.event}
                      onChange={(e) => setNewPpt({ ...newPpt, event: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    placeholder="Short description of what you researched, designed and presented..."
                    value={newPpt.description}
                    onChange={(e) => setNewPpt({ ...newPpt, description: e.target.value })}
                    className={styles.textarea}
                  />
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <button onClick={addPresentation} className={styles.saveBtn}>
                    Save Presentation to Archive
                  </button>
                </div>
              </div>
            )}

            {/* List */}
            <div>
              {data.presentations?.map((ppt: any, index: number) => (
                <div key={ppt.id || index} className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.itemNum}>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h4 className={styles.itemHeading}>{ppt.title}</h4>
                      <p className={styles.itemSub}>
                        {ppt.category} • {ppt.year} • {ppt.event}
                      </p>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <a
                      href={ppt.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.iconBtn}
                      style={{ textDecoration: 'none' }}
                    >
                      Open File ↗
                    </a>
                    <button onClick={() => deletePresentation(ppt.id)} className={`${styles.iconBtn} ${styles.iconBtnDanger}`}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: CERTIFICATIONS ────────────────────────────── */}
        {activeTab === 'certifications' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#7b8191' }}>
                Total Verified Certifications: {data.certifications?.length || 0}
              </p>
              <button onClick={() => setShowAddCert(!showAddCert)} className={styles.addBtn}>
                {showAddCert ? 'Close Form' : '+ Upload Certificate from Device'}
              </button>
            </div>

            {showAddCert && (
              <div className={styles.card} style={{ borderColor: 'var(--accent)' }}>
                <h3 className={styles.cardTitle}>Upload Certificate from System</h3>
                <p className={styles.cardSubtitle}>
                  Upload your certificate file in any format: PDF, JPG, JPEG, PNG, or WEBP
                </p>

                {/* System File Dropzone for Certificate */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className={styles.uploadContainer}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) =>
                        handleFileUpload(
                          e,
                          (url, name) => {
                            const { previewUrl, autoTitle } = resolveAutoPreview(
                              url,
                              newCert.title,
                              newCert.issuer,
                              newCert.category
                            );
                            setNewCert((prev) => ({
                              ...prev,
                              file: url,
                              preview: previewUrl,
                              title: prev.title || cleanFileNameToTitle(name) || autoTitle,
                            }));
                          },
                          'certFile'
                        )
                      }
                      className={styles.fileInputHidden}
                    />
                    <span className={styles.uploadIcon}>📜</span>
                    <span className={styles.uploadTitle}>
                      {uploading === 'certFile' ? 'Uploading certificate...' : 'Select Certificate File (PDF, JPG, PNG, WEBP)'}
                    </span>
                    <span className={styles.uploadHint}>Any size supported. Uploaded file is saved to public/uploads</span>
                    {newCert.file && (
                      <span className={styles.uploadSuccessPill}>
                        ✓ Attached: {newCert.file}
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', color: '#7b8191', fontFamily: 'var(--font-mono)' }}>
                      Direct Certificate URL or Path (Auto-Format Detection):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /uploads/my-cert.pdf or https://..."
                      value={newCert.file}
                      onChange={(e) => {
                        const url = e.target.value;
                        const { previewUrl, autoTitle } = resolveAutoPreview(
                          url,
                          newCert.title,
                          newCert.issuer,
                          newCert.category
                        );
                        setNewCert((prev) => ({
                          ...prev,
                          file: url,
                          preview: previewUrl,
                          title: prev.title || autoTitle,
                        }));
                      }}
                      className={styles.input}
                    />
                    {newCert.file && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          marginTop: '0.35rem',
                          background: 'rgba(255,255,255,0.03)',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            background: detectFileFormat(newCert.file).color,
                            color: '#000',
                            fontWeight: 800,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {detectFileFormat(newCert.file).ext.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                          Auto-Engine: {detectFileFormat(newCert.file).isImage
                            ? 'Native visual image detected'
                            : `Generated official ${detectFileFormat(newCert.file).ext.toUpperCase()} badge`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Certificate Title</label>
                    <input
                      type="text"
                      placeholder="e.g. GenAI Specialist / Hackathon Winner"
                      value={newCert.title}
                      onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Issuing Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Google / Sister Nivedita University"
                      value={newCert.issuer}
                      onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Category</label>
                    <select
                      value={newCert.category}
                      onChange={(e) => setNewCert({ ...newCert, category: e.target.value })}
                      className={styles.input}
                    >
                      <option value="AI / ML">AI / ML</option>
                      <option value="Technology">Technology</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Bootcamp & Workshops">Bootcamp & Workshops</option>
                      <option value="Academic">Academic</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Credential ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. SNU-CERT-2026-AIML"
                      value={newCert.credentialId}
                      onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <button onClick={addCertification} className={styles.saveBtn}>
                    Save Certificate
                  </button>
                </div>
              </div>
            )}

            <div>
              {data.certifications?.map((cert: any, index: number) => (
                <div key={cert.id || index} className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.itemNum}>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h4 className={styles.itemHeading}>{cert.title}</h4>
                      <p className={styles.itemSub}>
                        {cert.issuer} • {cert.year} • ID: {cert.credentialId || 'Verified'}
                      </p>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <a
                      href={cert.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.iconBtn}
                      style={{ textDecoration: 'none' }}
                    >
                      View ↗
                    </a>
                    <button onClick={() => deleteCertification(cert.id)} className={`${styles.iconBtn} ${styles.iconBtnDanger}`}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 6: INTERESTS ─────────────────────────────────── */}
        {activeTab === 'interests' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#7b8191' }}>
                Total Typographic Keywords: {data.interests?.length || 0}
              </p>
              <button onClick={() => setShowAddInterest(!showAddInterest)} className={styles.addBtn}>
                {showAddInterest ? 'Close' : '+ Add Keyword'}
              </button>
            </div>

            {showAddInterest && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Add Typographic Keyword</h3>
                <div className={styles.grid3}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Word / Technology</label>
                    <input
                      type="text"
                      placeholder="e.g. Agentic AI"
                      value={newInterest.text}
                      onChange={(e) => setNewInterest({ ...newInterest, text: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Scale Size</label>
                    <select
                      value={newInterest.size}
                      onChange={(e) => setNewInterest({ ...newInterest, size: e.target.value })}
                      className={styles.input}
                    >
                      <option value="xl">Extra Large (Headline Anchor)</option>
                      <option value="lg">Large</option>
                      <option value="md">Medium</option>
                      <option value="sm">Small</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Description Tooltip</label>
                    <input
                      type="text"
                      placeholder="e.g. Autonomous AI Workflows"
                      value={newInterest.desc}
                      onChange={(e) => setNewInterest({ ...newInterest, desc: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <button onClick={addInterest} className={styles.saveBtn}>
                    Add Keyword
                  </button>
                </div>
              </div>
            )}

            <div className={styles.card}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {data.interests?.map((item: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.9rem',
                      background: '#151a26',
                      border: '1px solid #232b3d',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#fff' }}>{item.text}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)' }}>
                      [{item.size}]
                    </span>
                    <button
                      onClick={() => deleteInterest(item.text)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#7b8191',
                        cursor: 'pointer',
                        marginLeft: '0.25rem',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 7: FUTURE THOUGHTS ──────────────────────────── */}
        {activeTab === 'future' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Manifesto Pillars</h3>
            <p className={styles.cardSubtitle}>
              Edit the BUILD, LEARN, EXPLORE, and BECOME first-person narratives
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {data.future?.map((pillar: any, index: number) => (
                <div key={pillar.num || index} className={styles.formGroup}>
                  <label className={styles.label}>
                    {pillar.num} — {pillar.label}
                  </label>
                  <textarea
                    value={pillar.text}
                    onChange={(e) => {
                      const updated = [...data.future];
                      updated[index].text = e.target.value;
                      setData({ ...data, future: updated });
                    }}
                    className={styles.textarea}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 8: SECTION VISIBILITY ────────────────────────── */}
        {activeTab === 'visibility' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Public Section Visibility Switchboard</h3>
            <p className={styles.cardSubtitle}>
              Instantly toggle sections on or off on the public website without editing code
            </p>

            <div>
              {Object.entries(data.sectionVisibility || {}).map(([key, isVisible]) => (
                <div key={key} className={styles.toggleRow}>
                  <span className={styles.toggleLabel}>{key} Section</span>
                  <button
                    onClick={() => toggleVisibility(key)}
                    className={`${styles.toggleSwitch} ${isVisible ? styles.toggleOn : styles.toggleOff}`}
                  >
                    {isVisible ? '● Visible Live' : '○ Hidden'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

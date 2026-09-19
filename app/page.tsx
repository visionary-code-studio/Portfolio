'use client';

import { useState, useEffect } from 'react';

import CustomCursor from '@/components/ui/CustomCursor';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/hero/Hero';
import IdentitySection from '@/components/hero/IdentitySection';
import Marquee from '@/components/ui/Marquee';
import AboutSection from '@/components/about/AboutSection';
import PptShelf from '@/components/presentations/PptShelf';
import CertificationsSection from '@/components/certifications/CertificationsSection';
import InterestsSection from '@/components/interests/InterestsSection';
import FutureSection from '@/components/future/FutureSection';
import ContactSection from '@/components/contact/ContactSection';
import Footer from '@/components/layout/Footer';
import ModalViewer from '@/components/ui/ModalViewer';
import ScrollProgressHUD from '@/components/ui/ScrollProgressHUD';
import WebGLSplashReveal from '@/components/splash/WebGLSplashReveal';

import fallbackData from '@/data/portfolio-content.json';
import type { Presentation, Certification } from '@/types';
import {
  loadPortfolioContentLocally,
  subscribeToPortfolioSync,
} from '@/lib/storageSync';

export default function Home() {
  const [content, setContent] = useState(fallbackData);
  const [pptModal, setPptModal] = useState<Presentation | null>(null);
  const [certModal, setCertModal] = useState<Certification | null>(null);

  // Sync with live data from API and Admin multi-tab events
  useEffect(() => {
    // 1. Initial fast hydration from local customized data
    const localData = loadPortfolioContentLocally(fallbackData);
    if (localData) {
      setContent(localData);
    }

    // 2. Real-time multi-tab listener (instant update when Admin changes anything)
    const unsubscribeSync = subscribeToPortfolioSync((newData) => {
      if (newData) {
        setContent((prev) => ({ ...prev, ...newData }));
      }
    });

    // 3. Fetch fresh live data from server API
    fetch('/api/content')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const rawLocal = typeof window !== 'undefined' ? localStorage.getItem('vaibhav_portfolio_content_backup') : null;
          let parsedLocal: any = null;
          if (rawLocal) {
            try { parsedLocal = JSON.parse(rawLocal); } catch {}
          }

          // If local backup was customized by admin and is newer, keep user's changes!
          const localIsUserEdited = parsedLocal && parsedLocal._userEdited;
          const localTime = parsedLocal?._updatedAt || 0;
          const serverTime = json.data._updatedAt || 0;

          if (localIsUserEdited && localTime >= serverTime) {
            setContent((prev) => ({ ...prev, ...parsedLocal }));
          } else {
            setContent(json.data);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('vaibhav_portfolio_content_backup', JSON.stringify(json.data));
              } catch (e) {}
            }
          }
        }
      })
      .catch((err) => console.log('Using default portfolio data', err));

    return () => {
      unsubscribeSync();
    };
  }, []);

  const visibility = content.sectionVisibility || {};

  return (
    <>
      <WebGLSplashReveal />
      <CustomCursor />
      <ScrollProgressHUD />
      <Navbar profile={content.profile} />

      <main>
        {/* 01 — Fitted Cinematic Hero Landing Stage */}
        {visibility.hero !== false && (
          <Hero
            data={{
              eyebrow: content.hero?.eyebrow,
              firstName: content.hero?.firstName,
              lastName: content.hero?.lastName,
              role: content.hero?.role,
              heroVideo: content.hero?.heroVideo,
              posterImage: content.hero?.posterImage,
              location: content.profile?.location,
            }}
          />
        )}

        {/* 02 — Identity: Welcoming intro video with scroll auto-play + technical badge + stats */}
        {visibility.identity !== false && (
          <IdentitySection
            data={{
              ...content.profile,
              heroVideo: content.hero?.heroVideo || content.profile?.heroVideo || '/video/Intro.mp4',
            }}
          />
        )}

        {/* Kinetic marquee separator */}
        {visibility.marquee !== false && <Marquee />}

        {/* 03 — About: Statement + identity pillars + academic track */}
        {visibility.about !== false && (
          <AboutSection data={content.profile} />
        )}

        {/* Minimalist Divider */}
        <div
          aria-hidden="true"
          style={{ height: '1px', background: 'var(--text-dim)', margin: '0 6vw' }}
        />

        {/* 04 — PPT Shelf (The Archive) */}
        {visibility.presentations !== false && (
          <PptShelf
            items={content.presentations || []}
            onOpen={(p) => setPptModal(p)}
          />
        )}

        {/* 05 — Certifications (The Proof) */}
        {visibility.certifications !== false && (
          <CertificationsSection
            items={content.certifications || []}
            onOpen={(c) => setCertModal(c)}
          />
        )}

        {/* 06 — Interests (What I'm Into) */}
        {visibility.interests !== false && (
          <InterestsSection items={content.interests} />
        )}

        {/* 07 — Future (What's Next) */}
        {visibility.future !== false && (
          <FutureSection items={content.future} />
        )}

        {/* 08 — Contact & Executive Finale (Merged Master Footer) */}
        {visibility.contact !== false && (
          <Footer data={content.profile} socials={content.profile?.socials} />
        )}
      </main>

      {/* Modals for PPT and Certificates */}
      {pptModal && (
        <ModalViewer
          item={pptModal}
          type="ppt"
          onClose={() => setPptModal(null)}
        />
      )}
      {certModal && (
        <ModalViewer
          item={certModal}
          type="cert"
          onClose={() => setCertModal(null)}
        />
      )}
    </>
  );
}

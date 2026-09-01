'use client';

import Image from 'next/image';
import Card3D from '@/components/ui/Card3D';
import ScrollImageReveal from '@/components/ui/ScrollImageReveal';
import styles from './IdentitySection.module.css';

interface ProfileProps {
  data?: {
    fullName?: string;
    headline?: string;
    tagline?: string;
    shortIntro?: string;
    profileImage?: string;
    university?: {
      name?: string;
      degree?: string;
      year?: string;
      semester?: string;
      cgpa?: string;
    };
    socials?: {
      github?: string;
      linkedin?: string;
      instagram?: string;
      x?: string;
    };
  };
}

export default function IdentitySection({ data }: ProfileProps) {
  const fullName = data?.fullName || 'Vaibhav Shaw';
  const profileImage = data?.profileImage || '/images/profile_update.png';
  const cgpa = data?.university?.cgpa || '9.38';
  const yearSem = data?.university?.year ? `${data.university.year} · ${data.university.semester || 'Sem 3'}` : '2nd Year · 3rd Sem';
  const shortIntro = data?.shortIntro || 'Student of Sister Nivedita University pursuing B.Tech CSE in AIML. Building ideas through curiosity and turning research into reality.';

  const stats = [
    { value: cgpa, label: 'CGPA (Cumulative)' },
    { value: yearSem, label: 'Current Term' },
    { value: 'AIML', label: 'B.Tech CSE Track' },
  ];

  const pills = ['Developer', 'AIML Engineer', 'Innovator', 'Designer', 'Builder'];

  const socials = [
    {
      label: 'GitHub',
      href: data?.socials?.github || 'https://github.com/visionary-code-studio',
      icon: (
        <svg width="17" height="17" viewBox="0 0 496 512" fill="currentColor">
          <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: data?.socials?.linkedin || 'https://linkedin.com/in/vaibhav-shaw',
      icon: (
        <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor">
          <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: data?.socials?.instagram || 'https://instagram.com/visionary_code_studio',
      icon: (
        <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor">
          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
        </svg>
      ),
    },
    {
      label: 'X',
      href: data?.socials?.x || 'https://x.com/vaibhavshaw',
      icon: (
        <svg width="15" height="15" viewBox="0 0 512 512" fill="currentColor">
          <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z" />
        </svg>
      ),
    },
  ];

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className={styles.section} id="identity">
        {/* Photo Column with Autographed Signature Badge */}
        <div className={styles.photoCol}>
          <Card3D intensity={10} glare={true} className={styles.card3DPhotoWrap}>
            <div className={styles.photoWrap}>
              <ScrollImageReveal direction="up" delay={150} glare={true}>
                <Image
                  src={profileImage}
                  alt={fullName}
                  fill
                  priority
                  className={styles.photo}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </ScrollImageReveal>
              {/* Authentic Autographed Signature Badge */}
              <div className={styles.signatureBadge} aria-label="Personal Signature">
                <div className={styles.signatureScript}>Vaibhav Shaw</div>
                <div className={styles.signatureDetails}>
                  <span className={styles.sigSubLine}>AIML Student</span>
                  <span className={styles.sigSubLine}>Full Stack Developer</span>
                </div>
              </div>
            </div>
          </Card3D>
        </div>

        {/* Content Column */}
        <div className={styles.contentCol}>
          <div className={styles.greeting}>
            <span className={styles.hi}>02 — Digital Identity</span>
            <h2 className={styles.fullName}>{fullName}</h2>
          </div>

          <div className={styles.pills}>
            {pills.map((p) => (
              <span key={p} className={styles.pill}>{p}</span>
            ))}
          </div>

          <p className={styles.bioText}>{shortIntro}</p>

          <button className={styles.ctaBtn} onClick={scrollToAbout} data-cursor-hover>
            <span>Explore Archive</span>
            <span className={styles.ctaArrow}>→</span>
          </button>

          <div className={styles.stats}>
            {stats.map((s) => (
              <Card3D key={s.label} intensity={8} glare={false} className={styles.card3DStatWrap}>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Vertical Social Rail */}
      <aside className={styles.socialSidebar} aria-label="Social connections">
        <span className={styles.socialLine} />
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className={styles.socialLink}
            data-cursor-hover
          >
            {s.icon}
          </a>
        ))}
        <span className={styles.socialLine} />
      </aside>
    </>
  );
}

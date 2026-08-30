# Tech Stack
# Personal Portfolio — Vaibhav

## 1. Architecture Philosophy

The portfolio should use a modern frontend architecture optimized for:

- visual quality
- animation
- maintainability
- performance
- accessibility
- fast deployment
- simple content updates

The recommended architecture is intentionally **frontend-first and content-driven**. A database or CMS is not necessary for the first version because PPTs and certifications can be managed as structured local data and static assets.

---

# 2. Core Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js | Application framework |
| Language | TypeScript | Type safety and maintainability |
| UI | React | Component architecture |
| Styling | Tailwind CSS | Rapid responsive styling |
| Animation | GSAP | Scroll-driven cinematic animation |
| Smooth Scroll | Lenis | Premium scrolling behavior |
| Micro-interactions | Motion | Component-level animations |
| Icons | Lucide React | Lightweight icon system |
| Fonts | Next/font | Optimized typography |
| Hosting | Vercel | Deployment |
| Version Control | Git + GitHub | Source control |
| Media | Local static assets / CDN | Video, PPTs, certificates |
| Data | TypeScript / JSON | Portfolio content |

---

# 3. Next.js

Use the Next.js App Router.

Recommended structure:

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
└── components/
```

Reasons:

- excellent production performance
- server and client component separation
- image optimization
- font optimization
- simple Vercel deployment
- scalable architecture

The portfolio should remain primarily a single-page experience even though the application can support secondary routes later.

---

# 4. TypeScript

TypeScript should be used throughout the project.

Benefits:

- strongly typed content
- safer component props
- predictable certificate/PPT metadata
- easier future maintenance

Example:

```ts
export interface Presentation {
  id: string
  title: string
  description: string
  category: string
  year: number
  thumbnail: string
  file: string
}
```

---

# 5. Tailwind CSS

Tailwind should be used for:

- layout
- responsive behavior
- spacing
- typography
- grids
- borders
- visibility
- utility styling

Avoid placing every visual rule into giant component-specific CSS files.

Use custom CSS only for:

- complex animation
- special typography
- masks
- custom cursors
- advanced visual effects
- scroll systems

---

# 6. GSAP

GSAP is the primary animation engine.

Use GSAP for:

- hero text entrance
- section reveal
- horizontal scrolling
- pinned sections
- image/video transformations
- scroll-linked movement
- editorial transitions
- large-scale choreography

Recommended modules:

```text
GSAP
ScrollTrigger
```

Do not animate everything.

The animation hierarchy should be:

```text
Major animation
      ↓
Section transitions
      ↓
Component motion
      ↓
Micro interaction
```

---

# 7. Lenis

Use Lenis for smooth scrolling.

Architecture:

```text
User Scroll
     ↓
Lenis
     ↓
GSAP ScrollTrigger
     ↓
Section Animation
```

GSAP and Lenis must be synchronized correctly to prevent scroll-jank and inconsistent animation timing.

---

# 8. Motion

Motion can be used for small UI interactions that do not require ScrollTrigger.

Examples:

- menu opening
- buttons
- cards
- modal
- fade
- hover state
- mobile navigation

Rule:

```text
GSAP = cinematic / scroll-driven
Motion = UI-level animation
```

Avoid using two animation libraries for the same interaction.

---

# 9. Video

Use native HTML5 video wherever possible.

Example capabilities:

```text
autoplay
muted
loop
playsInline
preload
poster
```

Recommended:

```html
<video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
/>
```

## Video Optimization

The supplied video should preferably have:

- compressed MP4/WebM versions
- reasonable resolution
- optimized bitrate
- a poster frame
- mobile fallback where necessary

Avoid loading a huge 4K video before the visitor reaches the hero.

---

# 10. Media Strategy

Recommended directory:

```text
public/
├── video/
│   ├── hero.mp4
│   └── hero.webm
│
├── images/
│   ├── profile/
│   ├── ppt/
│   └── certificates/
│
├── presentations/
│   └── *.pdf
│
└── certificates/
    ├── *.pdf
    ├── *.png
    ├── *.jpg
    └── *.jpeg
```

---

# 11. PPT Architecture

Do not hardcode every presentation directly inside JSX.

Use structured content.

```ts
export const presentations = [
  {
    id: "ppt-001",
    title: "Presentation Title",
    description: "Short overview",
    category: "AI",
    year: 2026,
    thumbnail: "/images/ppt/ppt-001.jpg",
    file: "/presentations/ppt-001.pdf",
  },
]
```

This makes the shelf scalable.

---

# 12. Certification Architecture

Use the same pattern.

```ts
export interface Certification {
  id: string
  title: string
  issuer: string
  date?: string
  year: number
  category: string
  type: "pdf" | "image"
  preview: string
  file: string
}
```

The frontend can then automatically render both PDF and image certifications.

---

# 13. PDF Handling

For certificates and presentations:

### MVP

Use the browser's native PDF viewer / new-tab viewing.

### Enhanced Version

Use a dedicated preview modal with a PDF renderer.

Do not unnecessarily render every PDF on the page simultaneously.

Lazy-load document previews.

---

# 14. Component Architecture

Recommended structure:

```text
components/
│
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ScrollProgress.tsx
│
├── hero/
│   ├── Hero.tsx
│   ├── HeroVideo.tsx
│   └── HeroIntro.tsx
│
├── about/
│   └── AboutSection.tsx
│
├── presentations/
│   ├── PptShelf.tsx
│   ├── PptCard.tsx
│   ├── PptFilter.tsx
│   └── PptViewer.tsx
│
├── certifications/
│   ├── CertificationGrid.tsx
│   ├── CertificationCard.tsx
│   ├── CertificationFilter.tsx
│   └── CertificateViewer.tsx
│
├── interests/
│   └── InterestsSection.tsx
│
├── future/
│   └── FutureSection.tsx
│
└── contact/
    └── ContactSection.tsx
```

---

# 15. Utility Architecture

```text
lib/
├── animations/
├── constants/
├── helpers/
└── metadata/
```

Keep animation code modular.

Do not put all GSAP timelines inside `page.tsx`.

---

# 16. Performance Architecture

## Important Rules

### Use Server Components by Default

Only use `"use client"` when interaction or browser APIs require it.

### Lazy Load

Lazy-load:

- certificate viewers
- PPT viewers
- below-the-fold media
- expensive interactive sections

### Images

Use Next.js image optimization where possible.

### Video

Do not automatically download multiple video formats simultaneously when unnecessary.

---

# 17. Animation Performance

Prefer:

```text
transform
opacity
clip-path
scale
x/y
```

Avoid repeatedly animating layout properties such as:

```text
width
height
top
left
margin
padding
```

where possible.

The objective is to keep animation GPU-friendly.

---

# 18. Accessibility

Required:

```text
semantic HTML
ARIA labels where required
keyboard navigation
visible focus states
reduced-motion handling
alt text
sufficient color contrast
```

For users preferring reduced motion:

```css
@media (prefers-reduced-motion: reduce)
```

Animations should be significantly reduced or disabled.

---

# 19. SEO

Use:

- metadata
- Open Graph tags
- Twitter/X card metadata
- semantic headings
- descriptive page title
- canonical URL
- favicon
- structured content

Suggested title:

```text
Vaibhav — Developer, Creator & Builder
```

The exact title should reflect Vaibhav's final positioning.

---

# 20. Analytics

Optional.

Recommended lightweight analytics:

- Vercel Analytics
- privacy-conscious analytics

Track:

- page views
- section engagement
- outbound social clicks
- PPT opens
- certificate opens
- contact interaction

Do not let analytics scripts hurt the initial experience.

---

# 21. Deployment

Recommended:

```text
GitHub
   ↓
Vercel
   ↓
Production
```

Use a custom domain when available.

Recommended deployment environments:

```text
main → production
dev → development
feature/* → preview
```

---

# 22. Environment Variables

Only use environment variables for configuration that actually requires them.

Example:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_EMAIL=
```

Do not place sensitive credentials in the frontend.

---

# 23. Recommended Folder Structure

```text
vaibhav-portfolio/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── navigation/
│   ├── hero/
│   ├── about/
│   ├── presentations/
│   ├── certifications/
│   ├── interests/
│   ├── future/
│   └── contact/
│
├── data/
│   ├── profile.ts
│   ├── presentations.ts
│   ├── certifications.ts
│   ├── interests.ts
│   └── future.ts
│
├── lib/
│   ├── animations/
│   └── utils/
│
├── public/
│   ├── video/
│   ├── images/
│   ├── presentations/
│   └── certificates/
│
├── types/
│   └── index.ts
│
└── package.json
```

---

# 24. Architectural Principle

> **Keep the content static, the components reusable, the animations modular, and the experience cinematic.**

There is no reason to introduce a backend, database, authentication, or CMS until the portfolio actually requires dynamic editing.
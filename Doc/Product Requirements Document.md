# Product Requirements Document
# Personal Portfolio — Vaibhav

## 1. Product Overview

### Product Name
**Vaibhav — Personal Portfolio**

### Product Type
Personal portfolio / digital identity website

### Primary Objective
Build a highly polished, cinematic, interactive portfolio that presents Vaibhav as a student, developer, creator, and technology enthusiast through a visually engaging single-page experience.

The website should not feel like a conventional résumé website. It should feel like a **personal digital space** where visitors progressively discover:

- Who Vaibhav is
- What he has worked on
- What he has created
- What he has learned
- What he is interested in
- What he wants to build in the future
- How to connect with him

### Design Inspiration
The visual direction is inspired by the supplied reference website:

`https://vaibhav-create.vercel.app/`

The inspiration should be treated as a **design reference**, not something to duplicate. The portfolio must develop its own visual identity, content hierarchy, animations, copy, and layout.

The reference demonstrates strong use of cinematic typography, scroll storytelling, section-based progression, large visual compositions, social links, and immersive transitions.

---

# 2. Product Vision

> **A portfolio that feels like entering Vaibhav's digital world rather than opening his CV.**

The experience should communicate:

**Curiosity → Capability → Creativity → Personality → Ambition**

The visitor should understand the person behind the achievements, not merely see a list of credentials.

---

# 3. Target Audience

## Primary Users

### Recruiters
People evaluating Vaibhav for internships, placements, jobs, or professional opportunities.

### Developers / Technical Peers
People interested in his technical work, projects, presentations, experimentation, and interests.

### Faculty / University
Professors, mentors, judges, or university representatives reviewing his academic and extracurricular profile.

### Collaborators
People who may want to work with him on projects, competitions, startups, research, or technology initiatives.

### General Visitors
Anyone discovering the portfolio through LinkedIn, Instagram, X, GitHub, or direct sharing.

---

# 4. Core Product Goals

1. Create a memorable first impression within the first 5–10 seconds.
2. Present Vaibhav's identity clearly without requiring visitors to read large blocks of text.
3. Make the website visually distinctive while preserving usability.
4. Make documents and achievements easy to discover.
5. Make the PPT collection feel like a curated digital shelf rather than a plain list of files.
6. Make certifications browsable and previewable.
7. Present future ambitions as part of the identity instead of treating them as an afterthought.
8. Provide frictionless contact and social discovery.
9. Maintain high performance despite video, animations, PDFs, and media.
10. Work beautifully on desktop, tablet, and mobile.

---

# 5. Information Architecture

The portfolio is primarily a **single scrolling landing experience**.

```text
ROOT
│
├── HOME
│   ├── Hero
│   ├── Identity
│   ├── Intro / Snapshot
│   └── Scroll transition
│
├── ABOUT / OVERVIEW OF ME
│   ├── Introduction
│   ├── Academic identity
│   ├── Technical identity
│   ├── Creative identity
│   └── Personal traits / philosophy
│
├── PPT SHELF
│   ├── Section introduction
│   ├── PPT collection
│   ├── Categories / filters
│   ├── PPT preview
│   └── Open / download
│
├── CERTIFICATIONS
│   ├── Certification overview
│   ├── Certification gallery
│   ├── PDF certificates
│   ├── Image certificates
│   └── Preview / open
│
├── INTERESTS
│   ├── Current interests
│   ├── Topics I explore
│   ├── Technologies / domains
│   └── Creative interests
│
├── FUTURE THOUGHTS
│   ├── What I want to build
│   ├── What I want to learn
│   ├── Long-term direction
│   └── Personal vision
│
└── CONTACT
    ├── Email
    ├── University
    ├── School
    ├── Scores / Marks
    ├── LinkedIn
    ├── Instagram
    └── X
```

---

# 6. Navigation

## Desktop Navigation

Use a minimal floating navigation.

Example:

```text
VAIBHAV                         MENU / INDEX
```

Possible navigation items:

```text
01 HOME
02 ME
03 PPT SHELF
04 CERTIFICATIONS
05 INTERESTS
06 FUTURE
07 CONTACT
```

The navigation should remain lightweight and should not occupy excessive screen space.

## Mobile Navigation

Use a compact menu button.

Opening the menu should reveal a full-screen navigation overlay.

---

# 7. Home / Hero Section

The hero is the most important visual section.

## Required Elements

### Primary Identity

```text
VAIBHAV
[LAST NAME / PERSONAL BRAND]
```

### Positioning Statement

Use a concise statement such as:

```text
Student • Developer • Creator • Builder
```

or a personalized equivalent.

### Supporting Statement

A short 1–2 sentence introduction.

Example structure:

```text
I build, experiment, learn and document my journey
through technology, design and ideas.
```

### Hero Video

The user-provided video will be the primary visual animation.

The video should:

- Occupy a major visual area
- Feel integrated with the typography
- Autoplay when technically permitted
- Start muted
- Loop where appropriate
- Use `playsInline`
- Load efficiently
- Have a fallback poster image
- Respect reduced-motion preferences

### Hero Interaction

Possible interaction sequence:

```text
Page Load
   ↓
Typography reveal
   ↓
Video enters viewport
   ↓
Hero content settles
   ↓
Scroll indicator appears
   ↓
Scroll-driven transition begins
```

---

# 8. Overview of Me

This section should answer:

> "Who is Vaibhav when the hero disappears?"

Do not create a traditional biography wall.

Instead use short visual statements.

Suggested structure:

```text
WHO AM I?

A student.
A developer.
A problem solver.
A builder.
A learner.
A person obsessed with turning ideas into things that work.
```

Follow with a concise personal introduction.

---

# 9. PPT Shelf

## Purpose

Create a dedicated visual archive for presentations created by Vaibhav.

The section should communicate:

> "These are ideas I've researched, structured, designed and presented."

## Presentation Card

Each PPT item should support:

```text
Title
Short Description
Category
Year
Context / Event
Preview Thumbnail
File Type
```

Example:

```text
01

AI IN EDUCATION
Exploring how AI can transform personalized learning.

Academic Presentation
2026

[OPEN PPT]
```

## Categories

Suggested categories:

- Academic
- Technology
- AI / ML
- Entrepreneurship
- Innovation
- Hackathon
- Research
- Business
- Personal

## Interactions

Card hover:

- Slight movement
- Thumbnail scaling
- Metadata reveal
- Cursor interaction
- Accent animation

On click:

Open a dedicated modal or detail view with:

- Cover
- Title
- Description
- Metadata
- PPT preview if available
- Download button
- External/open action

---

# 10. Certifications

## Supported Files

The portfolio must support:

```text
PDF
PNG
JPG
JPEG
WEBP
```

## Certification Card

Each certificate should include:

```text
Certificate Title
Issuer
Date / Year
Category
Credential ID (optional)
Preview
Open / View
```

## UX

Visitors should be able to:

1. Browse certificates
2. Filter them
3. Preview them
4. Open the original document
5. Download where appropriate

## Display Modes

Desktop:

```text
Grid / Masonry / Editorial Gallery
```

Mobile:

```text
Stacked cards / horizontal gallery
```

---

# 11. Interests

This section should represent things Vaibhav genuinely explores.

Possible structure:

```text
WHAT I'M INTO

01 Technology
02 Artificial Intelligence
03 Full-Stack Development
04 UI / UX
05 Innovation
06 Presentations & Storytelling
07 Entrepreneurship
08 Emerging Technologies
```

The actual list should be populated with Vaibhav's real interests.

Instead of conventional tags, interests can appear as:

- large typographic labels
- animated words
- floating cards
- horizontal scrolling rows
- interactive categories

---

# 12. Future Thoughts

This section is intentionally different from a résumé.

It should answer:

> "Where is Vaibhav going?"

Possible subsections:

### BUILD

What I want to create.

### LEARN

What I want to understand.

### EXPLORE

Fields and ideas I want to experiment with.

### BECOME

The kind of technologist / creator I want to become.

The content should be written in first person.

---

# 13. Contact

## Required Information

The contact section must include:

- Email
- University
- School
- Scores / marks
- LinkedIn
- Instagram
- X

## Contact Hierarchy

Primary CTA:

```text
LET'S CONNECT →
```

Then:

```text
EMAIL
UNIVERSITY
SCHOOL
SCORES / MARKS
```

Followed by social links.

## Email Interaction

Clicking the email should trigger:

```text
mailto:
```

Optionally provide a copy-email interaction.

---

# 14. Footer

The footer should be minimal.

Suggested structure:

```text
VAIBHAV

Built with curiosity.
Designed with intention.

LinkedIn
Instagram
X
Email

© 2026 Vaibhav
```

Optional closing statement:

```text
KEEP SCROLLING.
KEEP BUILDING.
```

---

# 15. Functional Requirements

## FR-01 Hero Video

The hero must display the provided video correctly across desktop and mobile.

## FR-02 Smooth Scrolling

Scrolling should feel intentional and fluid.

## FR-03 Section Navigation

Navigation links should smoothly scroll to the corresponding section.

## FR-04 Media Viewer

PPT and certificate items must support preview/open interactions.

## FR-05 File Filtering

Certificates and presentations should be filterable by category.

## FR-06 Responsive Layout

All sections must adapt to:

- Mobile
- Tablet
- Laptop
- Large desktop

## FR-07 Accessibility

Support:

- keyboard navigation
- readable contrast
- semantic HTML
- reduced-motion preference
- accessible buttons
- accessible links
- appropriate alt text

## FR-08 Performance

The portfolio must minimize:

- layout shifts
- unnecessary JavaScript
- oversized media
- blocking assets

---

# 16. Non-Functional Requirements

## Performance

Target:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

The visual experience must not come at the expense of basic web performance.

## Responsiveness

Minimum supported:

```text
360px → 2560px+
```

## Browser Support

Modern:

- Chrome
- Edge
- Safari
- Firefox

---

# 17. Content Management Strategy

The initial version can be **content-driven without requiring a CMS**.

Recommended data structure:

```text
/data
   profile.ts
   presentations.ts
   certifications.ts
   interests.ts
   future.ts
```

This makes future updates easy without changing component logic.

Example:

```ts
{
  title: "Presentation Name",
  description: "Short description",
  category: "AI",
  year: 2026,
  thumbnail: "/ppt/preview.jpg",
  file: "/ppt/presentation.pdf"
}
```

---

# 18. Success Criteria

The portfolio is successful when:

- A visitor immediately understands who Vaibhav is.
- The hero creates a strong first impression.
- The video feels purposeful rather than decorative.
- Visitors can explore content without feeling overwhelmed.
- PPTs and certificates are easy to discover.
- The site feels personal rather than template-generated.
- Navigation remains intuitive despite the cinematic presentation.
- Mobile experience is equally polished.
- The website is memorable enough that visitors can recall it after leaving.

---

# 19. MVP Scope

### Must Have

- Hero
- Video animation
- Overview of Me
- PPT Shelf
- Certifications
- Interests
- Future Thoughts
- Contact
- Social links
- Responsive design
- Smooth scrolling

### Nice to Have

- Scroll progress indicator
- Magnetic cursor
- Custom cursor
- Section transition overlays
- Certificate filtering
- PPT filtering
- Lightbox viewer
- Page-load sequence

### Future

- CMS
- Analytics dashboard
- Search
- Personal blog
- Project archive
- downloadable résumé
- guestbook / visitor notes
- AI-powered portfolio assistant

---

# 20. Product Principle

**Do not build a website that merely proves Vaibhav has achievements. Build a website that makes visitors curious about what Vaibhav will build next.**
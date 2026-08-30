# UI / UX Specification
# Vaibhav Portfolio

## 1. UX Goal

The portfolio should create an experience where visitors naturally progress through the site without feeling that they are reading a résumé.

The intended mental model is:

```text
Discover → Explore → Understand → Verify → Connect
```

---

# 2. Primary User Journey

```text
LANDING
   ↓
WHO IS VAIBHAV?
   ↓
WHAT HAS HE CREATED?
   ↓
WHAT HAS HE LEARNED?
   ↓
WHAT DOES HE CARE ABOUT?
   ↓
WHERE IS HE GOING?
   ↓
HOW DO I CONTACT HIM?
```

---

# 3. Landing Experience

## Before Interaction

The visitor sees:

```text
VAIBHAV
Positioning statement
Hero video
Scroll indicator
```

No excessive text.

The first viewport should communicate identity rather than details.

---

# 4. Navigation UX

Navigation should support two modes.

### Passive Mode

Small, unobtrusive navigation.

### Active Mode

Expanded section index.

Example:

```text
01 HOME
02 ME
03 PPT SHELF
04 CERTIFICATIONS
05 INTERESTS
06 FUTURE
07 CONTACT
```

Active item should indicate current position.

---

# 5. Scroll Progress

A thin progress indicator can appear along the side.

Concept:

```text
│
│
●
│
│
```

Or:

```text
03 / 07
```

This tells users how much of the experience remains.

---

# 6. Hero UX

The hero video must never block the primary message.

Layer hierarchy:

```text
BACKGROUND
    ↓
VIDEO
    ↓
GRADIENT / CONTRAST LAYER
    ↓
TYPOGRAPHY
    ↓
CTA / SCROLL
```

Text should remain readable against every video frame.

---

# 7. Hero Video Behavior

### Desktop

Video can occupy most or all of the screen.

### Mobile

Use a cropped composition or optimized mobile video.

### Reduced Motion

Use a poster image or very limited playback.

### Loading

Display poster image before video is ready.

---

# 8. CTA Design

Primary CTA:

```text
EXPLORE
```

or:

```text
ENTER
```

Secondary interaction:

```text
SCROLL TO DISCOVER
```

The CTA should not compete with the identity text.

---

# 9. About UX

Instead of presenting everything at once:

```text
Paragraph
Paragraph
Paragraph
```

Reveal information in layers.

Example:

```text
BUILD
CREATE
LEARN
EXPLORE
```

Then reveal the explanation underneath.

This creates progressive disclosure.

---

# 10. Typography UX

Hierarchy:

```text
H1
    ↓
H2
    ↓
supporting statement
    ↓
metadata
```

Visitors should understand the page structure even if they only scan the large typography.

---

# 11. PPT Shelf UX

The PPT shelf is an **exploration interface**.

The user should be able to:

```text
SEE
   ↓
SCAN
   ↓
FILTER
   ↓
SELECT
   ↓
PREVIEW
   ↓
OPEN / DOWNLOAD
```

---

# 12. PPT Shelf Initial State

Show the most relevant or recent presentations first.

Sort priority:

```text
featured
↓
recent
↓
other
```

---

# 13. PPT Filtering

Filter chips:

```text
ALL
AI
TECH
ACADEMIC
INNOVATION
HACKATHON
BUSINESS
OTHER
```

On filter change:

- do not reload page
- animate result transition
- preserve scroll position

---

# 14. PPT Card UX

Each card should have:

```text
Presentation number
Title
Category
Year
Thumbnail
View action
```

Avoid putting entire descriptions on every card.

The card should encourage opening.

---

# 15. PPT Preview UX

Clicking a PPT:

```text
Card
 ↓
Modal / Detail page
 ↓
Cover
Title
Description
Metadata
Preview
 ↓
OPEN / DOWNLOAD
```

The modal must:

- trap focus
- support Escape
- support close button
- work on keyboard
- not create a second unwanted scroll context

---

# 16. Certification UX

Users should immediately understand that the certification section contains actual evidence.

Use:

```text
issuer
title
date
preview
```

not merely:

```text
Certificate #01
Certificate #02
```

---

# 17. Certification Filters

Possible filters:

```text
ALL
TECHNICAL
ACADEMIC
WORKSHOPS
HACKATHONS
LEADERSHIP
OTHER
```

Filters should remain accessible on mobile.

Use horizontal scrolling chips rather than a giant dropdown where appropriate.

---

# 18. Certificate Viewer

When opening an image:

```text
Image
+
zoom
+
close
```

When opening a PDF:

```text
PDF viewer
+
open full
+
download
+
close
```

The viewer should not immediately download the document.

---

# 19. Interests UX

The interests section should feel exploratory.

Interaction options:

### Hover

Interest grows slightly.

### Scroll

Words shift at different speeds.

### Click

Optional details appear.

Example:

```text
AI
```

expands into:

```text
LLMs
Agents
Computer Vision
AI Products
```

This makes the section informative without becoming a long list.

---

# 20. Future Thoughts UX

Treat this as the emotional conclusion before contact.

Possible interaction:

```text
WHAT I WANT TO BUILD
        ↓
WHAT I WANT TO LEARN
        ↓
WHAT I WANT TO EXPLORE
        ↓
WHAT I WANT TO BECOME
```

Each statement should appear as the previous one moves away.

---

# 21. Contact UX

The contact section should minimize friction.

Primary action:

```text
EMAIL ME →
```

Secondary:

```text
LINKEDIN
INSTAGRAM
X
```

Academic information can appear beneath or beside the social information.

---

# 22. Contact Information Layout

Recommended:

```text
LET'S TALK.

EMAIL
example@email.com

UNIVERSITY
University Name

SCHOOL
School Name

SCORES
Academic information
```

Then:

```text
LINKEDIN   INSTAGRAM   X
```

---

# 23. Email UX

When the email is clicked:

```text
mailto:
```

Optionally show:

```text
Copied to clipboard
```

for a dedicated copy button.

Never force the visitor to manually select the address.

---

# 24. External Links

LinkedIn, Instagram, and X should:

- be clearly recognizable
- open in a new tab where appropriate
- include accessible labels
- provide hover/focus feedback

---

# 25. Scroll Behavior

The page should feel continuous.

Recommended:

```text
smooth scrolling
+
section snapping only where appropriate
+
ScrollTrigger-based choreography
```

Avoid aggressive full-page snap because it can make exploration frustrating.

---

# 26. Mouse Interaction

Desktop interactions may include:

```text
magnetic buttons
custom cursor
hover previews
parallax
image movement
```

Do not use all of them simultaneously.

---

# 27. Touch UX

On mobile:

Remove or simplify:

- custom cursor
- magnetic buttons
- hover-only information
- excessive parallax

Everything important must remain accessible through tap and scroll.

---

# 28. Loading UX

The site should have a deliberate but short loading state.

Possible:

```text
VAIBHAV
01
02
03
```

Then transition into the hero.

Do not use a long cinematic loader merely for aesthetics.

---

# 29. Error UX

If a certificate or PPT cannot load:

Show:

```text
DOCUMENT UNAVAILABLE

Open original file
```

Never leave a blank modal or broken image.

---

# 30. Empty State

For future categories with no content:

```text
Nothing here yet.

More coming soon.
```

This can reinforce the evolving nature of the portfolio.

---

# 31. Accessibility UX

Keyboard users must be able to:

```text
Tab
↓
navigate
↓
open PPT
↓
open certificate
↓
close modal
```

Focus must remain visible.

Interactive elements must have clear labels.

---

# 32. Responsive UX

## Desktop

Experience:

```text
cinematic
horizontal
asymmetric
immersive
```

## Tablet

Experience:

```text
balanced
less extreme animation
```

## Mobile

Experience:

```text
vertical
typographic
content-first
touch-friendly
```

---

# 33. Mobile Navigation

Recommended:

```text
☰
```

Opening it:

```text
────────────────
HOME
ME
PPT SHELF
CERTIFICATIONS
INTERESTS
FUTURE
CONTACT
────────────────
```

Clicking an item should close the menu and scroll to the section.

---

# 34. Visual Feedback

Every interactive element should provide at least one clear response:

```text
hover
focus
press
transition
```

Example:

```text
VIEW →
```

becomes:

```text
VIEW ↗
```

with a subtle motion.

---

# 35. UX Anti-Patterns to Avoid

Do not:

- autoplay sound
- hide important content behind hover
- make navigation difficult to find
- overuse scroll-jacking
- make every section fullscreen
- put huge paragraphs in the hero
- use tiny typography for metadata
- create extremely long loading animations
- rely entirely on animations for meaning
- sacrifice accessibility for aesthetics

---

# 36. UX Content Strategy

Use short copy.

Instead of:

```text
I am a highly motivated and passionate student who is deeply
interested in multiple domains of technology...
```

Prefer:

```text
I like building things,
understanding how they work,
and asking what comes next.
```

The website should visually carry some of the storytelling so the copy doesn't need to.

---

# 37. Interaction Priority

When designing an interaction, use this priority:

```text
CONTENT
↓
USABILITY
↓
HIERARCHY
↓
MOTION
↓
DECORATION
```

Never reverse this order.

---

# 38. Ideal User Session

A successful first-time visitor should naturally experience:

```text
0–5 sec
WHO IS THIS?

5–15 sec
WHAT DOES HE DO?

15–30 sec
WHAT HAS HE CREATED?

30–60 sec
WHAT HAS HE LEARNED?

60–90 sec
WHAT DOES HE CARE ABOUT?

90+ sec
WHERE IS HE GOING?

END
HOW DO I CONTACT HIM?
```

---

# 39. Final UX Principle

> **Every scroll should answer one question and create the next one.**
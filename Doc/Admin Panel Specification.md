# Admin Panel Specification
# Vaibhav Portfolio

## 1. Overview

The portfolio will have a private **Admin Panel** that allows Vaibhav to manage the portfolio content without modifying the source code.

The public portfolio remains the polished, cinematic frontend.

The Admin Panel becomes the **control center** for:

- Personal information
- Academic information
- Social links
- PPT uploads
- Certification uploads
- Interests
- Future thoughts
- Homepage content
- Portfolio visibility
- Featured content

### Core Principle

> **The public website should display content. The Admin Panel should control that content.**

---

# 2. Admin Architecture

Recommended architecture:

```text
                    ┌──────────────────┐
                    │   PUBLIC WEBSITE │
                    │                  │
                    │   Next.js        │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │    BACKEND / API │
                    └────────┬─────────┘
                             │
             ┌───────────────┼────────────────┐
             ↓               ↓                ↓
       ┌──────────┐    ┌───────────┐    ┌──────────┐
       │ Database │    │  Storage  │    │  Auth    │
       └──────────┘    └───────────┘    └──────────┘
             ↑
             │
       ┌─────┴──────┐
       │ ADMIN PANEL │
       └────────────┘
```

---

# 3. Recommended Technology

For the upgraded portfolio architecture:

| Requirement | Recommended Technology |
|---|---|
| Frontend | Next.js + React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | GSAP |
| Authentication | Supabase Auth / Auth.js |
| Database | PostgreSQL |
| Backend | Next.js Server Actions / API Routes |
| File Storage | Supabase Storage / Cloudinary |
| Hosting | Vercel |
| Database ORM | Drizzle ORM / Prisma |
| Validation | Zod |
| Rich Text | Tiptap |
| Icons | Lucide React |

### Recommended Simplified Stack

```text
Next.js
+
TypeScript
+
Tailwind CSS
+
GSAP
+
Supabase
+
Vercel
```

Supabase can provide:

```text
Authentication
Database
Storage
```

This reduces architectural complexity considerably.

---

# 4. Admin URL

Use a protected route:

```text
/admin
```

Possible structure:

```text
/admin
/admin/login
/admin/dashboard
/admin/profile
/admin/home
/admin/presentations
/admin/certifications
/admin/interests
/admin/future
/admin/settings
```

The entire `/admin/*` route must require authentication.

---

# 5. Authentication

Admin access must never be exposed publicly.

### Login

```text
┌─────────────────────────────┐
│                             │
│          VAIBHAV            │
│        ADMIN PANEL          │
│                             │
│   Email                     │
│   [____________________]    │
│                             │
│   Password                  │
│   [____________________]    │
│                             │
│       [ LOGIN ]             │
│                             │
└─────────────────────────────┘
```

Use secure authentication rather than a hardcoded username/password in frontend code.

---

# 6. Authorization

The system should support roles even if only one role is needed initially.

```text
ADMIN
EDITOR
```

### ADMIN

Full control:

- upload
- edit
- delete
- publish
- manage settings
- manage account

### EDITOR

Optional future role:

- create content
- edit content
- upload files

Cannot:

- manage authentication
- change admin permissions
- delete the entire account

For the MVP, only the `ADMIN` role is necessary.

---

# 7. Admin Dashboard

After login:

```text
┌────────────────────────────────────────────────────┐
│ VAIBHAV ADMIN                         VIEW WEBSITE ↗│
├────────────────────────────────────────────────────┤
│                                                    │
│ DASHBOARD                                          │
│                                                    │
│ ┌────────────┐ ┌─────────────┐ ┌───────────────┐  │
│ │ PPTs       │ │ Certificates│ │ Sections      │  │
│ │    24      │ │     37      │ │      07       │  │
│ └────────────┘ └─────────────┘ └───────────────┘  │
│                                                    │
│ Recent Activity                                    │
│                                                    │
│ + Certificate uploaded                             │
│ + PPT updated                                      │
│ + Profile changed                                  │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

# 8. Dashboard Features

The dashboard should provide:

### Content Statistics

```text
PPTs
Certificates
Published items
Draft items
```

### Quick Actions

```text
+ Add PPT
+ Add Certificate
Edit Profile
Edit Homepage
```

### Recent Activity

Show recent changes.

Example:

```text
Today
Certificate "AI Workshop" uploaded

Yesterday
PPT "Smart Cities" updated

Aug 25
Profile information changed
```

---

# 9. Admin Sidebar

Desktop:

```text
VAIBHAV ADMIN

Dashboard

CONTENT
  Home
  Profile
  Presentations
  Certifications
  Interests
  Future Thoughts
  Contact

SYSTEM
  Settings
  Media Library
  Activity Log

────────────────

View Website ↗
Logout
```

Mobile:

Use a drawer navigation.

---

# 10. Profile Management

Admin must be able to change all personal information displayed on the website.

Fields:

```text
Full Name
Display Name
Headline
Short Bio
Long Bio
University
School
Academic Information
Email
LinkedIn
Instagram
X
```

Example:

```text
Display Name
[ Vaibhav ]

Headline
[ Developer • Creator • Builder ]

Short Bio
[ ... ]

Email
[ ... ]

University
[ ... ]
```

---

# 11. Academic Information

Create a dedicated structured section.

Fields:

```text
University
Program / Degree
Department
Year / Semester
School
Academic Scores
Additional Academic Information
```

Scores should support structured entries.

Example:

```text
Academic Record

Class / Program     Score
---------------------------
10th                92%
12th                89%
CGPA                8.7
```

The admin should be able to add, edit, reorder, hide, or delete entries.

---

# 12. Social Links

Admin-editable:

```text
LinkedIn
Instagram
X
Email
```

Each social field should support:

```text
URL
Display Name
Enabled / Disabled
```

Example:

```text
LinkedIn
https://linkedin.com/in/...

[✓] Show

Instagram
https://instagram.com/...

[✓] Show

X
https://x.com/...

[✓] Show
```

This means inactive platforms do not need to appear publicly.

---

# 13. Homepage Management

Admin should be able to control the hero content.

Fields:

```text
Name
Headline
Hero Description
Hero Video
Poster Image
CTA Text
CTA Destination
Scroll Label
```

Example:

```text
HERO

Name
VAIBHAV

Headline
Student • Developer • Creator

Description
Building ideas through technology.

Hero Video
[ hero.mp4 ]

Poster
[ Upload ]

CTA
[ Explore ]

Destination
[ #about ]
```

---

# 14. Hero Video Upload

The admin must be able to replace the homepage hero video.

Supported:

```text
MP4
WebM
```

Recommended constraints:

```text
Maximum file size
Configurable

Recommended resolution
1920 × 1080

Recommended encoding
H.264
```

The system should display:

```text
Upload
Processing
Ready
```

Never publish a partially uploaded file.

---

# 15. Presentation Management

The admin should have complete CRUD control.

```text
Create
Read
Update
Delete
Publish
Unpublish
```

---

# 16. Add PPT

Form:

```text
Presentation Title
Short Description
Category
Year
Event / Context
Thumbnail
Presentation File
Featured
Published
Display Order
```

Example:

```text
TITLE
[ AI in Education ]

DESCRIPTION
[ Exploring... ]

CATEGORY
[ AI ]

YEAR
[ 2026 ]

EVENT
[ Academic Presentation ]

THUMBNAIL
[ Upload ]

FILE
[ Upload PDF ]

[ ] Featured
[✓] Published

DISPLAY ORDER
[ 01 ]

        SAVE
```

---

# 17. PPT File Support

Recommended primary format:

```text
PDF
```

Optional:

```text
PPT
PPTX
```

For consistent browser viewing, converting PPT/PPTX to PDF before public viewing is recommended.

The original file can still optionally be retained for download.

---

# 18. PPT List

Admin view:

```text
PRESENTATIONS

──────────────────────────────────────────
01  AI in Education       AI       2026
    Published              Edit Delete

02  Smart Cities          Tech     2026
    Published              Edit Delete

03  Entrepreneurship      Business 2025
    Draft                  Edit Delete
──────────────────────────────────────────
```

Support:

- search
- filter
- sorting
- drag-to-reorder
- publish/unpublish

---

# 19. Featured Presentation

Every presentation should have:

```text
Featured: ON / OFF
```

Featured PPTs may appear in a special area of the public shelf.

This allows the admin to change the portfolio's emphasis without modifying frontend code.

---

# 20. Certification Management

Certification management follows the same CRUD model.

```text
Create
Read
Update
Delete
Publish
Unpublish
```

---

# 21. Add Certification

Fields:

```text
Certificate Title
Issuer
Category
Date
Year
Credential ID
Description
Certificate File
Preview Image
Featured
Published
Display Order
```

---

# 22. Certificate File Upload

Supported:

```text
PDF
PNG
JPG
JPEG
WEBP
```

The system should automatically determine the file type.

Example:

```text
type = "pdf"
```

or:

```text
type = "image"
```

---

# 23. Certificate Preview Generation

For PDFs, the system may generate a thumbnail / preview image automatically.

Flow:

```text
PDF Upload
     ↓
File Storage
     ↓
PDF Processing
     ↓
Preview Generation
     ↓
Database Record
     ↓
Public Gallery
```

This avoids requiring the frontend to render all PDFs just to create thumbnails.

---

# 24. Certificate List

Admin interface:

```text
CERTIFICATIONS

┌───────────────────────────────────────────────┐
│ [Preview]                                     │
│ AI Certification                              │
│ Microsoft                                     │
│ 2026                                          │
│                                               │
│ Published   Featured                          │
│                                               │
│ Edit     Preview     Delete                   │
└───────────────────────────────────────────────┘
```

Use either a compact table or visual grid.

---

# 25. Interests Management

The admin can manage the interests section.

Fields:

```text
Interest Name
Short Description
Icon / Image
Category
Priority
Published
```

Example:

```text
Artificial Intelligence
Technology
Innovation
UI / UX
Entrepreneurship
Web Development
```

The order should be controllable.

---

# 26. Future Thoughts Management

Create editable entries rather than hardcoding them.

Fields:

```text
Title
Content
Category
Year
Featured
Published
Display Order
```

Example:

```text
Category:
BUILD

Title:
Products I Want to Create

Content:
...
```

Possible categories:

```text
BUILD
LEARN
EXPLORE
BECOME
```

---

# 27. Contact Management

The admin should be able to modify:

```text
Email
University
School
Academic Information
LinkedIn
Instagram
X
Contact CTA
```

This means the portfolio does not require source-code updates when contact information changes.

---

# 28. Media Library

Create one centralized media library.

It should contain:

```text
Videos
Images
PPT files
Certificates
```

Admin capabilities:

```text
Upload
Search
Preview
Replace
Delete
Copy path / URL
```

Media can display:

```text
Filename
Type
Size
Upload date
Used by
```

---

# 29. Content Status

Every content object should support:

```text
DRAFT
PUBLISHED
ARCHIVED
```

### Draft

Visible only inside the Admin Panel.

### Published

Visible on public portfolio.

### Archived

Not publicly visible but retained in database/storage.

This is safer than immediately deleting content.

---

# 30. Soft Delete

Do not permanently delete important content immediately.

Recommended flow:

```text
Delete
  ↓
Archive
  ↓
Restore / Permanently Delete
```

This provides protection against accidental deletion.

---

# 31. Reordering

Admin should be able to rearrange:

- PPTs
- certificates
- interests
- future thoughts

Use drag-and-drop.

Example:

```text
01 AI
02 Web Development
03 Innovation
04 Entrepreneurship
```

Dragging item 04 to position 01 automatically updates the display order.

---

# 32. Visibility Controls

Each major section should have:

```text
Visible
Hidden
```

Example:

```text
PPT SHELF
[✓] Visible

CERTIFICATIONS
[✓] Visible

FUTURE THOUGHTS
[ ] Hidden
```

A hidden section must not appear on the public site.

This allows temporary removal without deleting its content.

---

# 33. Section Settings

Admin should be able to control:

```text
Section title
Section subtitle
Visibility
Display order
```

Example:

```text
Current:

PPT SHELF
THE ARCHIVE

Change to:

PRESENTATIONS
THINGS I'VE MADE
```

This makes the visual identity editable without redeployment.

---

# 34. Site-wide Settings

Admin Settings:

```text
Site Title
Site Description
Favicon
OG Image
Primary Email
Default Social Links
Copyright Text
Analytics
Maintenance Mode
```

---

# 35. Maintenance Mode

Optional but useful.

Admin can enable:

```text
Maintenance Mode: ON
```

Public visitors see:

```text
VAIBHAV

Something new is being built.

Back soon.
```

Admin panel remains accessible.

---

# 36. Preview Before Publishing

This is important.

Every editable section should support:

```text
SAVE DRAFT
PREVIEW
PUBLISH
```

Recommended flow:

```text
Edit
 ↓
Save Draft
 ↓
Preview Public Version
 ↓
Publish
```

The admin should never have to publish content just to check how it looks.

---

# 37. Public Preview

When clicking:

```text
PREVIEW
```

open a preview version of the real portfolio.

Possible URL:

```text
/admin/preview
```

or a protected preview token.

---

# 38. Version History

For important content, retain previous versions.

Example:

```text
PROFILE HISTORY

Aug 30, 2026
Current

Aug 24, 2026
Previous

Aug 10, 2026
Previous
```

Admin can:

```text
View
Restore
```

This is particularly useful for biography, contact information, and homepage copy.

---

# 39. Activity Log

Record important admin operations:

```text
LOGIN
UPLOAD
CREATE
UPDATE
DELETE
PUBLISH
UNPUBLISH
ARCHIVE
RESTORE
```

Example:

```text
14:32
Certificate uploaded

14:28
Homepage headline updated

14:10
PPT published
```

---

# 40. Security Requirements

Admin functionality must be protected.

### Never:

- expose admin credentials in frontend code
- store passwords in plaintext
- allow unauthenticated `/admin` APIs
- expose service-role database keys to the browser
- trust client-side authorization alone

### Use:

- secure authentication
- server-side authorization
- protected routes
- database row-level security
- secure file permissions
- HTTPS
- environment variables
- validation

---

# 41. File Validation

Every upload should be validated.

Example:

```text
Certificate:
PDF / PNG / JPG / JPEG / WEBP

PPT:
PDF / PPT / PPTX

Hero:
MP4 / WebM
```

Validate:

```text
file type
file size
filename
upload completion
```

Do not trust only the file extension; validate the actual MIME type where possible.

---

# 42. Image Optimization

Uploaded images should be optimized before public delivery.

Possible pipeline:

```text
Upload
 ↓
Validate
 ↓
Resize / Optimize
 ↓
Storage
 ↓
CDN
 ↓
Public Website
```

Generate appropriate variants when needed:

```text
thumbnail
medium
large
```

---

# 43. Database Model

Recommended PostgreSQL entities:

```text
User
Profile
SocialLink
AcademicRecord
SiteSection
Presentation
Certification
Interest
FutureThought
Media
SiteSetting
ActivityLog
```

---

# 44. Simplified Database Relationships

```text
User
 │
 └── Profile
      │
      ├── AcademicRecord[]
      └── SocialLink[]

Presentation[]
Certification[]
Interest[]
FutureThought[]

Media[]
SiteSection[]
SiteSetting[]
ActivityLog[]
```

---

# 45. Presentation Schema

Example:

```ts
type Presentation = {
  id: string
  title: string
  description: string
  category: string
  year: number
  event?: string

  fileUrl: string
  thumbnailUrl?: string

  featured: boolean
  published: boolean
  order: number

  createdAt: Date
  updatedAt: Date
}
```

---

# 46. Certification Schema

```ts
type Certification = {
  id: string
  title: string
  issuer: string
  category: string

  date?: string
  year?: number
  credentialId?: string

  fileUrl: string
  previewUrl?: string

  fileType: "pdf" | "image"

  featured: boolean
  published: boolean
  order: number

  createdAt: Date
  updatedAt: Date
}
```

---

# 47. Profile Schema

```ts
type Profile = {
  name: string
  headline: string
  shortBio: string
  longBio?: string

  university?: string
  school?: string
  email: string

  heroVideoUrl?: string
  heroPosterUrl?: string

  updatedAt: Date
}
```

---

# 48. Public / Admin Separation

The application should conceptually have two interfaces.

```text
PUBLIC
─────────────────────
/
```

and

```text
PRIVATE
─────────────────────
/admin/*
```

The admin panel should not visually resemble the public portfolio.

### Public

Cinematic.
Experimental.
Animated.

### Admin

Functional.
Clear.
Dense.
Fast.

Do not waste animation resources inside the Admin Panel.

---

# 49. Admin UI Design

Recommended style:

```text
Dark / Light neutral interface
Sidebar navigation
Cards
Tables
Forms
Modals
Toasts
Confirmation dialogs
```

Prioritize usability over cinematic design.

---

# 50. Notifications

After actions, display clear feedback.

Example:

```text
✓ Certificate uploaded successfully.
```

or:

```text
✓ Presentation published.
```

Errors:

```text
⚠ Upload failed.
File must be smaller than 50 MB.
```

---

# 51. Confirmation Dialogs

Destructive actions should require confirmation.

Example:

```text
Archive "AI Certificate"?

This will remove it from
the public portfolio.

[ Cancel ]     [ Archive ]
```

Permanent deletion should require stronger confirmation.

---

# 52. Unsaved Changes

If the admin modifies a form and attempts to leave:

```text
You have unsaved changes.

Leave without saving?

[Stay] [Leave]
```

This prevents accidental data loss.

---

# 53. Search

Admin search should cover:

```text
Presentations
Certificates
Interests
Future Thoughts
Media
```

Example:

```text
Search "AI"
```

returns:

```text
3 presentations
7 certificates
2 interests
```

---

# 54. Bulk Operations

Future enhancement.

Support:

```text
Select multiple
Publish
Unpublish
Archive
Delete
Change category
```

This becomes particularly valuable once the portfolio contains dozens of certificates.

---

# 55. Backup Strategy

Database:

```text
automated backups
```

Storage:

```text
redundant storage
```

Important data should not exist only on the local development machine.

---

# 56. Admin Workflow

### Add Certificate

```text
Login
 ↓
Dashboard
 ↓
Certifications
 ↓
Add Certificate
 ↓
Upload
 ↓
Enter Metadata
 ↓
Save Draft
 ↓
Preview
 ↓
Publish
```

### Add PPT

```text
Login
 ↓
Presentations
 ↓
Add PPT
 ↓
Upload
 ↓
Metadata
 ↓
Save
 ↓
Preview
 ↓
Publish
```

### Update Personal Information

```text
Login
 ↓
Profile
 ↓
Edit
 ↓
Save
 ↓
Preview
 ↓
Publish
```

---

# 57. Content Ownership

The portfolio should treat the admin account as the single authoritative content owner.

The frontend must not contain duplicate hardcoded versions of:

- email
- social links
- profile text
- presentations
- certificates
- interests

Instead:

```text
Admin Data
    ↓
Database / Storage
    ↓
Public Portfolio
```

---

# 58. Caching Strategy

Because the public portfolio changes less frequently than the admin panel, use caching/revalidation.

Example concept:

```text
Admin Update
     ↓
Database Change
     ↓
Revalidate Portfolio Data
     ↓
Public Site Reflects Change
```

The objective is to make the portfolio fast without requiring a full redeploy after every content update.

---

# 59. Draft / Publish Architecture

A recommended content model:

```text
draft data
published data
```

The frontend reads only:

```text
published = true
```

The admin can edit drafts without affecting the public website.

---

# 60. Future Expansion

The Admin Panel should be designed so that additional content can be introduced later.

Potential additions:

```text
Projects
Experience
Blog
Research
Achievements
Hackathons
Awards
Gallery
GitHub Projects
Testimonials
Resume
```

These should be new content modules rather than redesigning the entire backend.

---

# 61. MVP Admin Features

### Required

```text
✓ Authentication
✓ Dashboard
✓ Edit profile
✓ Edit contact information
✓ Edit academic information
✓ Upload hero video
✓ Upload PPT
✓ Edit PPT
✓ Delete/archive PPT
✓ Upload certificate
✓ Edit certificate
✓ Delete/archive certificate
✓ Manage interests
✓ Manage future thoughts
✓ Publish/unpublish
✓ Reorder content
✓ Media library
```

---

# 62. Phase 2

```text
Version history
Activity log
Bulk operations
Advanced search
Automatic PDF thumbnails
PPT/PPTX → PDF conversion
Analytics
Advanced media processing
```

---

# 63. Phase 3

```text
CMS-like content builder
Multiple admin users
Role management
Scheduled publishing
AI-assisted content writing
SEO management
Portfolio analytics
```

---

# 64. Admin Success Criteria

The Admin Panel is successful when Vaibhav can perform the following without touching the codebase:

### Personal Information

> Change my university, bio, email, social links, or scores.

### PPT

> Upload a new presentation and make it appear on the portfolio.

### Certificate

> Upload a PDF/JPG/PNG certificate and make it appear in the certification gallery.

### Ordering

> Move a presentation or certificate to a different position.

### Visibility

> Hide a section without deleting its content.

### Homepage

> Replace the hero video or change the headline.

### Publishing

> Prepare content privately, preview it, and publish it when ready.

---

# 65. Final Architecture Principle

The complete system should follow:

```text
                    VAIBHAV
                       │
             ┌─────────┴─────────┐
             │                   │
         ADMIN PANEL        PUBLIC SITE
             │                   │
       Manage Content       Present Content
             │                   │
             └─────────┬─────────┘
                       │
                 PostgreSQL
                       │
                  File Storage
```

The most important architectural decision is:

> **Content should be data, not code.**

That single principle ensures that when Vaibhav wants to add a certificate, upload a new PPT, change his university, update his marks, replace his hero video, or rewrite his future thoughts, he can do it from the Admin Panel without rebuilding the portfolio.
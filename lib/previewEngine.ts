/**
 * ── Auto-Detect & Document Preview Generator Engine ──────────────
 * Intelligently analyzes any file URL, path, or filename.
 * Automatically extracts clean titles and generates branded vector
 * preview cards with official format badges (PDF, PNG, JPG, PPTX, etc.)
 */

export interface FormatMeta {
  ext: string;
  label: string;
  isImage: boolean;
  color: string;
  accentColor: string;
  bgGradient: [string, string];
  iconType: 'pdf' | 'image' | 'presentation' | 'doc' | 'archive';
}

export const PPT_ICON_BASE64 = 'data:image/png;base64,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';

export function detectFileFormat(urlOrFilename: string, originalName?: string): FormatMeta {
  if (!urlOrFilename && !originalName) {
    return {
      ext: 'file',
      label: 'DOCUMENT',
      isImage: false,
      color: '#c8f04a',
      accentColor: '#95b828',
      bgGradient: ['#0f172a', '#1e293b'],
      iconType: 'doc',
    };
  }

  // If originalName is supplied, check its extension first for data URIs
  const effectiveName = originalName || urlOrFilename;

  // Handle data URIs
  if (urlOrFilename.startsWith('data:image/')) {
    const mime = urlOrFilename.substring(5, urlOrFilename.indexOf(';'));
    const sub = mime.replace('image/', '').toUpperCase();
    return {
      ext: sub.toLowerCase(),
      label: sub,
      isImage: true,
      color: '#38bdf8',
      accentColor: '#0284c7',
      bgGradient: ['#082f49', '#0c4a6e'],
      iconType: 'image',
    };
  }

  if (urlOrFilename.startsWith('data:application/pdf')) {
    return {
      ext: 'pdf',
      label: 'PDF DOCUMENT',
      isImage: false,
      color: '#ef4444',
      accentColor: '#b91c1c',
      bgGradient: ['#2b0d0d', '#180808'],
      iconType: 'pdf',
    };
  }

  if (
    urlOrFilename.includes('presentationml') ||
    urlOrFilename.includes('ms-powerpoint') ||
    effectiveName.toLowerCase().endsWith('.ppt') ||
    effectiveName.toLowerCase().endsWith('.pptx')
  ) {
    return {
      ext: 'pptx',
      label: 'POWERPOINT SLIDES',
      isImage: false,
      color: '#f97316',
      accentColor: '#ea580c',
      bgGradient: ['#2d1204', '#180a02'],
      iconType: 'presentation',
    };
  }

  // Extract extension from URL, path, or filename (stripping query string and hashes)
  const cleanUrl = effectiveName.split('?')[0].split('#')[0];
  const lastDot = cleanUrl.lastIndexOf('.');
  const ext = lastDot !== -1 ? cleanUrl.substring(lastDot + 1).toLowerCase() : '';

  switch (ext) {
    case 'pdf':
      return {
        ext: 'pdf',
        label: 'PDF DOCUMENT',
        isImage: false,
        color: '#ef4444',
        accentColor: '#b91c1c',
        bgGradient: ['#2b0d0d', '#180808'],
        iconType: 'pdf',
      };
    case 'png':
      return {
        ext: 'png',
        label: 'PNG ARTIFACT',
        isImage: true,
        color: '#10b981',
        accentColor: '#059669',
        bgGradient: ['#062419', '#041710'],
        iconType: 'image',
      };
    case 'jpg':
    case 'jpeg':
      return {
        ext: ext,
        label: `${ext.toUpperCase()} IMAGE`,
        isImage: true,
        color: '#f59e0b',
        accentColor: '#d97706',
        bgGradient: ['#291804', '#170e02'],
        iconType: 'image',
      };
    case 'webp':
      return {
        ext: 'webp',
        label: 'WEBP VISUAL',
        isImage: true,
        color: '#06b6d4',
        accentColor: '#0891b2',
        bgGradient: ['#042329', '#021519'],
        iconType: 'image',
      };
    case 'svg':
      return {
        ext: 'svg',
        label: 'VECTOR SVG',
        isImage: true,
        color: '#c8f04a',
        accentColor: '#a3d922',
        bgGradient: ['#172007', '#0d1204'],
        iconType: 'image',
      };
    case 'ppt':
    case 'pptx':
      return {
        ext: ext,
        label: 'PPTX SLIDES',
        isImage: false,
        color: '#f97316',
        accentColor: '#ea580c',
        bgGradient: ['#2d1204', '#180a02'],
        iconType: 'presentation',
      };
    case 'doc':
    case 'docx':
      return {
        ext: ext,
        label: 'WORD DOC',
        isImage: false,
        color: '#3b82f6',
        accentColor: '#1d4ed8',
        bgGradient: ['#0b1a38', '#060e20'],
        iconType: 'doc',
      };
    default:
      return {
        ext: ext || 'file',
        label: (ext || 'VERIFIED').toUpperCase(),
        isImage: false,
        color: '#94a3b8',
        accentColor: '#64748b',
        bgGradient: ['#0f172a', '#090d16'],
        iconType: 'doc',
      };
  }
}

/**
 * Strips technical hashes, timestamps, and formatting artifacts from filenames
 * to extract human-readable titles.
 */
export function cleanFileNameToTitle(urlOrFilename: string): string {
  if (!urlOrFilename) return '';

  // Get raw basename
  const cleanUrl = urlOrFilename.split('?')[0].split('#')[0];
  const parts = cleanUrl.split('/');
  let rawName = parts[parts.length - 1] || '';

  // Remove extension
  const dotIdx = rawName.lastIndexOf('.');
  if (dotIdx !== -1) {
    rawName = rawName.substring(0, dotIdx);
  }

  // Strip trailing epoch timestamps (e.g. _1788273565947 or -1788273565947)
  rawName = rawName.replace(/[_-]\d{12,14}$/, '');

  // Strip random hashes/UUIDs if attached
  rawName = rawName.replace(/_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i, '');

  // Replace underscores and consecutive dashes with spaces
  let formatted = rawName.replace(/[_-]+/g, ' ').trim();

  // If camelCase or PascalCase, insert space
  formatted = formatted.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Collapse multiple spaces
  formatted = formatted.replace(/\s+/g, ' ').trim();

  // Capitalize words nicely
  if (formatted.length > 0 && !formatted.includes(' ')) {
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  return formatted || 'Artifact Document';
}

/**
 * Converts raw SVG string safely to RFC-compliant Base64 Data URI
 * for 100% reliable rendering in Next.js Image and all modern browsers.
 */
function svgToBase64Uri(svgStr: string): string {
  try {
    if (typeof Buffer !== 'undefined') {
      return `data:image/svg+xml;base64,${Buffer.from(svgStr).toString('base64')}`;
    }
    if (typeof window !== 'undefined' && window.btoa) {
      return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`;
    }
  } catch (e) {
    console.warn('Base64 encoding fallback:', e);
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
}

/**
 * Escapes XML entities in text to prevent SVG parse errors.
 */
function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates a luxury, high-contrast credential certificate card vector preview (4:3 aspect ratio 800x600)
 * with official format badges (PDF, PPTX, etc.), verification seal, and clean typography.
 */
export function generateDocumentPreviewSvg(params: {
  title: string;
  format?: string;
  issuer?: string;
  category?: string;
}): string {
  const meta = detectFileFormat(params.format || 'pdf');
  const rawTitle = params.title || 'Official Credential';
  const rawIssuer = params.issuer || 'Academic & Technical Dossier';
  const rawCategory = params.category || 'Verified Artifact';

  const cleanTitle = escapeXml(rawTitle.trim());
  const cleanIssuer = escapeXml(rawIssuer.trim());
  const cleanCategory = escapeXml(rawCategory.trim().toUpperCase());

  // Split title into 1 or 2 lines for high legibility
  let line1 = cleanTitle;
  let line2 = '';
  if (cleanTitle.length > 28) {
    const words = cleanTitle.split(' ');
    const mid = Math.ceil(words.length / 2);
    line1 = words.slice(0, mid).join(' ');
    line2 = words.slice(mid).join(' ');
    if (line2.length > 36) {
      line2 = line2.substring(0, 33) + '...';
    }
  }

  const isPpt = meta.iconType === 'presentation';
  const isPdf = meta.ext === 'pdf';

  // Primary accent colors
  const primaryAccent = isPdf ? '#f43f5e' : isPpt ? '#f97316' : '#38bdf8';
  const badgeBg = isPdf ? 'rgba(244, 63, 94, 0.16)' : isPpt ? 'rgba(249, 115, 22, 0.16)' : 'rgba(56, 189, 248, 0.16)';
  const badgeBorder = isPdf ? '#f43f5e' : isPpt ? '#f97316' : '#38bdf8';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <!-- Deep Executive Dark Gradients -->
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#050811"/>
    </linearGradient>

    <!-- Certificate Border Guilloche Glow -->
    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.75"/>
      <stop offset="35%" stop-color="${primaryAccent}" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.8"/>
    </linearGradient>

    <!-- Center Radial Glow -->
    <radialGradient id="centerGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${primaryAccent}" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#090d16" stop-opacity="0"/>
    </radialGradient>

    <!-- Subtle Archival Security Grid -->
    <pattern id="secGrid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      <circle cx="15" cy="15" r="1" fill="rgba(255,255,255,0.04)"/>
    </pattern>

    <!-- Seal Drop Shadow -->
    <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.6)"/>
    </filter>
  </defs>

  <!-- Base Canvas & Background -->
  <rect width="800" height="600" fill="url(#cardBg)"/>
  <rect width="800" height="600" fill="url(#centerGlow)"/>
  <rect width="800" height="600" fill="url(#secGrid)"/>

  <!-- Official Dual-Line Certificate Border -->
  <rect x="24" y="24" width="752" height="552" rx="20" fill="none" stroke="url(#goldBorder)" stroke-width="2"/>
  <rect x="36" y="36" width="728" height="528" rx="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="8 6"/>

  <!-- Corner Security Accents -->
  <path d="M 28 48 L 48 48 L 48 28" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
  <path d="M 772 48 L 752 48 L 752 28" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
  <path d="M 28 552 L 48 552 L 48 572" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
  <path d="M 772 552 L 752 552 L 752 572" fill="none" stroke="#fbbf24" stroke-width="2.5"/>

  <!-- Top Header Telemetry -->
  <g transform="translate(60, 68)">
    <!-- Format Badge (PDF / PPTX) -->
    <rect x="0" y="0" width="145" height="34" rx="17" fill="${badgeBg}" stroke="${badgeBorder}" stroke-width="1.2"/>
    <circle cx="18" cy="17" r="4.5" fill="${primaryAccent}"/>
    <text x="32" y="22" fill="#ffffff" font-family="'JetBrains Mono', 'Space Grotesk', monospace" font-size="12" font-weight="800" letter-spacing="1.5">✦ ${meta.ext.toUpperCase()} DOC</text>

    <!-- Category Tag -->
    <rect x="520" y="0" width="160" height="34" rx="17" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="600" y="22" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1.2">${cleanCategory.substring(0, 18)}</text>
  </g>

  <!-- Central Crest / Document Emblem -->
  <g transform="translate(400, 215)" filter="url(#sealShadow)">
    ${isPpt ? `
    <!-- PowerPoint Presentation Visual Badge -->
    <circle cx="0" cy="0" r="54" fill="#1e130c" stroke="#f97316" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="46" fill="#2a180e" stroke="rgba(249,115,22,0.3)" stroke-width="1" stroke-dasharray="4 3"/>
    <image href="${PPT_ICON_BASE64}" x="-36" y="-36" width="72" height="72" preserveAspectRatio="xMidYMid meet"/>
    ` : isPdf ? `
    <!-- Luxury PDF Seal Crest -->
    <circle cx="0" cy="0" r="54" fill="#200d14" stroke="#f43f5e" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="46" fill="#15060b" stroke="rgba(244,63,94,0.3)" stroke-width="1" stroke-dasharray="4 3"/>
    
    <!-- Stylized Folded Document Icon -->
    <path d="M -16 -24 L 6 -24 L 20 -10 L 20 24 C 20 27 18 29 15 29 L -16 29 C -19 29 -21 27 -21 24 L -21 -19 C -21 -22 -19 -24 -16 -24 Z" fill="#2e0f1b" stroke="#f43f5e" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M 6 -24 L 6 -10 L 20 -10" fill="none" stroke="#f43f5e" stroke-width="2.2" stroke-linejoin="round"/>
    
    <!-- Document Text Lines -->
    <line x1="-12" y1="-2" x2="6" y2="-2" stroke="#fca5a5" stroke-width="2" stroke-linecap="round"/>
    <line x1="-12" y1="8" x2="12" y2="8" stroke="#fca5a5" stroke-width="2" stroke-linecap="round"/>
    <line x1="-12" y1="18" x2="4" y2="18" stroke="#fca5a5" stroke-width="2" stroke-linecap="round"/>
    <text x="0" y="44" fill="#f43f5e" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="900" text-anchor="middle" letter-spacing="2">PDF</text>
    ` : `
    <!-- Universal Verified Document Crest -->
    <circle cx="0" cy="0" r="54" fill="#08232e" stroke="#38bdf8" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="46" fill="#03131b" stroke="rgba(56,189,248,0.3)" stroke-width="1" stroke-dasharray="4 3"/>
    <path d="M -14 -4 L -4 6 L 14 -12" fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    `}
  </g>

  <!-- Document Title (High-Contrast, Crisp Typography) -->
  <g transform="translate(400, 345)">
    ${line2 ? `
      <text x="0" y="-8" fill="#ffffff" font-family="'Space Grotesk', system-ui, sans-serif" font-size="28" font-weight="800" text-anchor="middle" letter-spacing="-0.3">
        ${line1}
      </text>
      <text x="0" y="28" fill="#ffffff" font-family="'Space Grotesk', system-ui, sans-serif" font-size="28" font-weight="800" text-anchor="middle" letter-spacing="-0.3">
        ${line2}
      </text>
    ` : `
      <text x="0" y="10" fill="#ffffff" font-family="'Space Grotesk', system-ui, sans-serif" font-size="30" font-weight="800" text-anchor="middle" letter-spacing="-0.3">
        ${line1}
      </text>
    `}
  </g>

  <!-- Issuer & Verification Meta -->
  <g transform="translate(400, 428)">
    <rect x="-170" y="-16" width="340" height="32" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <text x="0" y="5" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1.5">
      ISSUER // ${(cleanIssuer || 'VERIFIED ORGANIZATION').toUpperCase()}
    </text>
  </g>

  <!-- Bottom Security Footer Bar -->
  <g transform="translate(60, 520)">
    <line x1="0" y1="0" x2="680" y2="0" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="0" y="24" fill="#64748b" font-family="'JetBrains Mono', monospace" font-size="11" letter-spacing="1">✓ CRYPTOGRAPHICALLY VERIFIED ARTIFACT</text>
    <text x="680" y="24" fill="#c8f04a" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="800" text-anchor="end" letter-spacing="1.2">INSPECT FULL DOCUMENT ↗</text>
  </g>
</svg>`;

  return svgToBase64Uri(svg);
}

/**
 * Master Engine: Given any URL, filename or data URI, resolves the best preview image.
 * - If already an image: returns the original image URL.
 * - If a document (PDF, PPT, DOC, etc.): automatically generates an official vector badge preview.
 */
export function resolveAutoPreview(
  fileUrl: string,
  title?: string,
  issuer?: string,
  category?: string,
  originalName?: string
): { previewUrl: string; detectedFormat: FormatMeta; autoTitle: string } {
  const detectedFormat = detectFileFormat(fileUrl, originalName);
  const autoTitle = cleanFileNameToTitle(originalName || fileUrl);
  const effectiveTitle = title && title.trim() ? title.trim() : autoTitle;

  // If already an image raster file and NOT a PDF data URI, use it directly
  if (
    detectedFormat.isImage &&
    fileUrl &&
    !fileUrl.startsWith('data:application/pdf') &&
    !fileUrl.toLowerCase().endsWith('.pdf')
  ) {
    return {
      previewUrl: fileUrl,
      detectedFormat,
      autoTitle,
    };
  }

  // Non-image format (PDF, PPTX, DOC, etc.)
  const previewUrl = generateDocumentPreviewSvg({
    title: effectiveTitle,
    format: detectedFormat.ext,
    issuer,
    category,
  });

  return {
    previewUrl,
    detectedFormat,
    autoTitle,
  };
}

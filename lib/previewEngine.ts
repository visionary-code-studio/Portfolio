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

export function detectFileFormat(urlOrFilename: string): FormatMeta {
  if (!urlOrFilename) {
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

  // Extract extension from URL or path (stripping query string and hashes)
  const cleanUrl = urlOrFilename.split('?')[0].split('#')[0];
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
 * Generates an SVG Data URI branded with official format logo, badge,
 * document title, and luxury glassmorphic telemetry.
 */
export function generateDocumentPreviewSvg(params: {
  title: string;
  format?: string;
  issuer?: string;
  category?: string;
}): string {
  const meta = detectFileFormat(params.format || 'pdf');
  const title = params.title || 'Verified Document';
  const issuer = params.issuer || 'Academic & Technical Dossier';
  const category = params.category || 'Verified Artifact';

  // Truncate title for SVG canvas if too long
  const displayTitle = title.length > 40 ? title.substring(0, 37) + '...' : title;

  // Render SVG with format logo
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${meta.bgGradient[0]}"/>
      <stop offset="100%" stop-color="${meta.bgGradient[1]}"/>
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${meta.color}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${meta.accentColor}" stop-opacity="0.2"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Deep Backdrop with Grid -->
  <rect width="800" height="500" fill="url(#bgGrad)"/>
  <rect width="800" height="500" fill="url(#grid)"/>

  <!-- Glowing Outer Frame -->
  <rect x="24" y="24" width="752" height="452" rx="16" fill="none" stroke="url(#borderGrad)" stroke-width="1.5"/>
  <rect x="36" y="36" width="728" height="428" rx="12" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="6 4"/>

  <!-- Top Telemetry Bar -->
  <g transform="translate(60, 75)">
    <!-- Format Badge Pill -->
    <rect x="0" y="0" width="130" height="32" rx="16" fill="${meta.color}" fill-opacity="0.12" stroke="${meta.color}" stroke-opacity="0.4" stroke-width="1"/>
    <circle cx="16" cy="16" r="4" fill="${meta.color}"/>
    <text x="28" y="21" fill="${meta.color}" font-family="monospace" font-size="11" font-weight="700" letter-spacing="1.5">✦ ${meta.ext.toUpperCase()}</text>

    <!-- Category Tag -->
    <text x="680" y="21" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="end" letter-spacing="2">// ${category.toUpperCase()}</text>
  </g>

  <!-- Center Document Icon Glyph -->
  <g transform="translate(400, 210)">
    ${meta.iconType === 'presentation' ? `
    <!-- Official Microsoft PowerPoint Brand Logo -->
    <rect x="-55" y="-55" width="110" height="110" rx="20" fill="rgba(255,255,255,0.04)" stroke="${meta.color}" stroke-opacity="0.35" stroke-width="1.5"/>
    <image href="/images/powerpoint-icon.png" x="-45" y="-45" width="90" height="90" preserveAspectRatio="xMidYMid meet"/>
    ` : `
    <!-- Icon Container Box -->
    <rect x="-45" y="-55" width="90" height="90" rx="18" fill="rgba(255,255,255,0.04)" stroke="${meta.color}" stroke-opacity="0.3" stroke-width="1.5"/>
    
    <!-- Vector Document Symbol with Folded Corner -->
    <path d="M -18 -32 L 6 -32 L 20 -18 L 20 22 C 20 25 17 28 14 28 L -18 28 C -21 28 -24 25 -24 22 L -24 -26 C -24 -29 -21 -32 -18 -32 Z" fill="none" stroke="${meta.color}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M 6 -32 L 6 -18 L 20 -18" fill="none" stroke="${meta.color}" stroke-width="2" stroke-linejoin="round"/>
    
    <!-- Inner Accent Lines -->
    <line x1="-14" y1="-8" x2="6" y2="-8" stroke="${meta.color}" stroke-width="2" stroke-linecap="round"/>
    <line x1="-14" y1="2" x2="14" y2="2" stroke="${meta.color}" stroke-width="2" stroke-linecap="round"/>
    <line x1="-14" y1="12" x2="8" y2="12" stroke="${meta.color}" stroke-width="2" stroke-linecap="round"/>
    `}
  </g>

  <!-- Main Document Title -->
  <text x="400" y="325" fill="#f8fafc" font-family="'Space Grotesk', system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" text-anchor="middle" letter-spacing="0.5">
    ${displayTitle}
  </text>

  <!-- Issuer Subtitle -->
  <text x="400" y="360" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="14" text-anchor="middle">
    ${issuer}
  </text>

  <!-- Bottom Action Footer -->
  <g transform="translate(60, 435)">
    <text x="0" y="0" fill="#64748b" font-family="monospace" font-size="10" letter-spacing="2">VERIFIED ARTIFACT ARCHIVE</text>
    <text x="680" y="0" fill="${meta.color}" font-family="monospace" font-size="10" font-weight="700" text-anchor="end" letter-spacing="1">CLICK TO INSPECT ${meta.ext.toUpperCase()} ↗</text>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Master Engine: Given any URL or filename, resolves the best preview image.
 * - If already an image: returns the original image URL.
 * - If a document (PDF, PPT, DOC, etc.): automatically generates an official vector badge preview.
 */
export function resolveAutoPreview(
  fileUrl: string,
  title?: string,
  issuer?: string,
  category?: string
): { previewUrl: string; detectedFormat: FormatMeta; autoTitle: string } {
  const detectedFormat = detectFileFormat(fileUrl);
  const autoTitle = cleanFileNameToTitle(fileUrl);
  const effectiveTitle = title && title.trim() ? title.trim() : autoTitle;

  if (detectedFormat.isImage && fileUrl) {
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

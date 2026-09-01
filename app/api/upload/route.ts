import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and make unique
    const originalName = file.name || 'uploaded-file';
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueName = `${baseName}_${Date.now()}${ext}`;
    const mimeType = file.type || 'application/octet-stream';

    // ── STRATEGY 1: VERCEL BLOB STORAGE (Production Cloud CDN) ──
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`uploads/${uniqueName}`, buffer, {
          access: 'public',
          contentType: mimeType,
        });

        return NextResponse.json({
          success: true,
          url: blob.url,
          fileName: uniqueName,
          originalName,
          size: file.size,
          mimeType,
          storage: 'vercel-blob',
        });
      } catch (blobError) {
        console.warn('Vercel Blob upload failed, attempting fallback:', blobError);
      }
    }

    // ── STRATEGY 2: LOCAL DISK STORAGE (Development on Localhost) ──
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, uniqueName);
      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${uniqueName}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName: uniqueName,
        originalName,
        size: file.size,
        mimeType,
        storage: 'local-disk',
      });
    } catch (fsError: any) {
      // ── STRATEGY 3: ZERO-CONFIG INLINE DATA-URL FALLBACK (For Vercel without Blob) ──
      // Vercel serverless functions have a read-only filesystem (EROFS).
      // If the user hasn't yet connected a Vercel Blob store, convert files <= 4.5MB
      // to a persistent base64 data URI so uploads work immediately without failing!
      if (
        fsError.code === 'EROFS' ||
        fsError.code === 'EACCES' ||
        fsError.message?.toLowerCase().includes('read-only')
      ) {
        if (file.size <= 4.5 * 1024 * 1024) {
          const base64Content = buffer.toString('base64');
          const dataUrl = `data:${mimeType};base64,${base64Content}`;

          return NextResponse.json({
            success: true,
            url: dataUrl,
            fileName: uniqueName,
            originalName,
            size: file.size,
            mimeType,
            storage: 'inline-data-url',
            message:
              'Uploaded successfully as an inline data URL. Connect Vercel Blob storage in your Vercel Dashboard for global CDN links.',
          });
        }

        return NextResponse.json(
          {
            success: false,
            error:
              'File is larger than 4.5MB on Vercel read-only filesystem. Please connect Vercel Blob in your Vercel project (Storage > Create Blob) to support files up to 500MB.',
          },
          { status: 413 }
        );
      }

      throw fsError;
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to upload file to system',
      },
      { status: 500 }
    );
  }
}

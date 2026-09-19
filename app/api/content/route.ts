import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'portfolio-content.json');

// In-memory serverless cache across warm lambda invocations
declare global {
  // eslint-disable-next-line no-var
  var __PORTFOLIO_CONTENT_CACHE__: any;
}

export async function GET() {
  try {
    // 1. Check in-memory server cache
    if (globalThis.__PORTFOLIO_CONTENT_CACHE__) {
      return NextResponse.json({
        success: true,
        data: globalThis.__PORTFOLIO_CONTENT_CACHE__,
        source: 'server-memory',
      });
    }

    // 2. Check if customized content exists in Vercel Blob storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { list } = await import('@vercel/blob');
        const { blobs } = await list({ prefix: 'portfolio-content.json' });
        if (blobs.length > 0) {
          const res = await fetch(blobs[0].url);
          if (res.ok) {
            const data = await res.json();
            globalThis.__PORTFOLIO_CONTENT_CACHE__ = data;
            return NextResponse.json({ success: true, data, source: 'vercel-blob' });
          }
        }
      } catch (blobErr) {
        console.warn('Vercel Blob read error, falling back to local file:', blobErr);
      }
    }

    const rawData = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(rawData);
    return NextResponse.json({ success: true, data, source: 'local-file' });
  } catch (error) {
    console.error('Failed to read portfolio content:', error);
    return NextResponse.json(
      { success: false, error: 'Could not load portfolio content' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Read existing content
    let existingData: any = {};
    if (globalThis.__PORTFOLIO_CONTENT_CACHE__) {
      existingData = globalThis.__PORTFOLIO_CONTENT_CACHE__;
    } else {
      try {
        const current = await fs.readFile(dataFilePath, 'utf-8');
        existingData = JSON.parse(current);
      } catch {
        existingData = {};
      }
    }

    const updatedData = {
      ...existingData,
      ...body,
      _updatedAt: Date.now(),
      _userEdited: true,
    };

    // Update in-memory server cache
    globalThis.__PORTFOLIO_CONTENT_CACHE__ = updatedData;

    // If Vercel Blob is configured, save JSON to Blob storage for permanent cross-session persistence
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        await put('portfolio-content.json', JSON.stringify(updatedData, null, 2), {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'application/json',
        });
      } catch (blobSaveErr) {
        console.warn('Could not save content to Vercel Blob:', blobSaveErr);
      }
    }

    // Attempt local file write
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf-8');
    } catch (fsErr: any) {
      // On Vercel serverless read-only filesystem (EROFS), avoid crashing
      if (
        fsErr.code === 'EROFS' ||
        fsErr.code === 'EACCES' ||
        fsErr.message?.toLowerCase().includes('read-only')
      ) {
        return NextResponse.json({
          success: true,
          message: 'Changes received and cached in Vercel serverless environment.',
          data: updatedData,
          isVercelReadOnly: true,
        });
      }
      throw fsErr;
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio content updated successfully',
      data: updatedData,
    });
  } catch (error: any) {
    console.error('Failed to write portfolio content:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Could not save portfolio content' },
      { status: 500 }
    );
  }
}

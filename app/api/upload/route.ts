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
      mimeType: file.type,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file to system' },
      { status: 500 }
    );
  }
}

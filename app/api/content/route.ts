import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'portfolio-content.json');

export async function GET() {
  try {
    const rawData = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(rawData);
    return NextResponse.json({ success: true, data });
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

    // Read existing to allow partial merges if needed
    let existingData = {};
    try {
      const current = await fs.readFile(dataFilePath, 'utf-8');
      existingData = JSON.parse(current);
    } catch {
      existingData = {};
    }

    const updatedData = {
      ...existingData,
      ...body,
    };

    await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Portfolio content updated successfully',
      data: updatedData,
    });
  } catch (error) {
    console.error('Failed to write portfolio content:', error);
    return NextResponse.json(
      { success: false, error: 'Could not save portfolio content' },
      { status: 500 }
    );
  }
}

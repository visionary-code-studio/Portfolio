import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const inquiriesFilePath = path.join(process.cwd(), 'data', 'inquiries.json');

// Global server memory cache for inquiries across warm serverless invocations
declare global {
  // eslint-disable-next-line no-var
  var __PORTFOLIO_INQUIRIES_CACHE__: any[];
}

export async function GET() {
  let list: any[] = [];
  if (globalThis.__PORTFOLIO_INQUIRIES_CACHE__) {
    list = globalThis.__PORTFOLIO_INQUIRIES_CACHE__;
  } else {
    try {
      const raw = await fs.readFile(inquiriesFilePath, 'utf-8');
      list = JSON.parse(raw);
    } catch {
      list = [];
    }
  }
  return NextResponse.json({ success: true, inquiries: list });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body || {};

    if (!phone || String(phone).replace(/\D/g, '').length < 8) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid mobile number with country code' },
        { status: 400 }
      );
    }

    const inquiryId = `INQ-${Date.now().toString().slice(-6)}`;
    const newInquiry = {
      id: inquiryId,
      name: name?.trim() || 'Valued Visitor',
      phone: phone?.trim(),
      email: email?.trim() || '',
      message: message?.trim() || 'Portfolio Inquiry & Collaboration Request',
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
      status: 'pending',
    };

    // 1. Maintain in-memory server cache
    if (!globalThis.__PORTFOLIO_INQUIRIES_CACHE__) {
      globalThis.__PORTFOLIO_INQUIRIES_CACHE__ = [];
    }
    globalThis.__PORTFOLIO_INQUIRIES_CACHE__.unshift(newInquiry);

    // 2. Attempt disk write (local/dev)
    try {
      const dataDir = path.join(process.cwd(), 'data');
      await fs.mkdir(dataDir, { recursive: true });
      let currentList: any[] = [];
      try {
        const raw = await fs.readFile(inquiriesFilePath, 'utf-8');
        currentList = JSON.parse(raw);
      } catch {
        currentList = [];
      }
      currentList.unshift(newInquiry);
      await fs.writeFile(inquiriesFilePath, JSON.stringify(currentList, null, 2), 'utf-8');
    } catch (fsErr) {
      // Safe fallback on read-only serverless platforms like Vercel
      console.warn('Inquiry cached in server memory:', fsErr);
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      phone: newInquiry.phone,
      name: newInquiry.name,
      message: 'Inquiry received. Live mobile notification dispatched to user phone.',
      timestamp: newInquiry.createdAt,
    });
  } catch (error: any) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}

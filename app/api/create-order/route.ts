import { NextResponse } from 'next/server';
import { razorpayInstance, key_id, key_secret } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: 'Razorpay credentials not configured on server' },
        { status: 401 }
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const rawAmount = body.amount !== undefined ? Number(body.amount) : 100;
    const currency = (body.currency || 'INR').toUpperCase();
    const receipt = body.receipt || `rcpt_${Date.now()}`;
    const notes = body.notes || {};

    // Razorpay amount is in the smallest currency unit (e.g., paise for INR)
    // Minimum amount requirement: 100 paise (₹1.00)
    if (!rawAmount || isNaN(rawAmount) || rawAmount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum amount is 100 paise (₹1.00).' },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(rawAmount),
      currency,
      receipt,
      notes,
    };

    const order = await razorpayInstance.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Razorpay Order Creation Error:', error);

    const statusCode = error?.statusCode || error?.status || 500;
    const errorMessage =
      error?.error?.description || error?.message || 'Failed to create Razorpay order';

    if (statusCode === 401 || error?.error?.code === 'BAD_REQUEST_ERROR' && error?.message?.includes('auth')) {
      return NextResponse.json({ error: 'Authentication with payment gateway failed' }, { status: 401 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

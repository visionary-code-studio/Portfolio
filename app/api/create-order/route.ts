import { NextResponse } from 'next/server';
import { razorpayInstance, key_id, key_secret } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    if (!key_id || !key_secret) {
      return NextResponse.json(
        {
          error: 'Payment gateway is currently awaiting owner activation. Please use Direct UPI QR Code or send an inquiry.',
          fallbackToQr: true,
        },
        { status: 401 }
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    // Support amount in paise or amount in INR
    let rawAmount = 100;
    if (body.amount !== undefined) {
      rawAmount = Number(body.amount);
    } else if (body.amountInr !== undefined) {
      rawAmount = Number(body.amountInr) * 100;
    }

    const currency = (body.currency || 'INR').toUpperCase();
    const receipt = body.receipt || `rcpt_${Date.now()}`;
    const notes = body.notes || {};

    // Minimum amount requirement: 100 paise (₹1.00)
    if (!rawAmount || isNaN(rawAmount) || rawAmount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum transaction amount is ₹1.00 (100 paise).' },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(rawAmount),
      currency,
      receipt,
      notes: {
        ...notes,
        authorized_by_owner: 'true',
      },
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
    const isAuthError =
      statusCode === 401 ||
      error?.error?.code === 'BAD_REQUEST_ERROR' &&
      (error?.error?.description?.toLowerCase().includes('auth') || error?.message?.toLowerCase().includes('auth'));

    if (isAuthError) {
      return NextResponse.json(
        {
          error: 'Razorpay authentication is in consultation mode. Please use Direct UPI QR Code (with owner access key) or submit an inquiry.',
          fallbackToQr: true,
        },
        { status: 401 }
      );
    }

    const errorMessage =
      error?.error?.description || error?.message || 'Payment processing error. Please use Direct QR Code.';

    return NextResponse.json(
      {
        error: errorMessage,
        fallbackToQr: true,
      },
      { status: 500 }
    );
  }
}

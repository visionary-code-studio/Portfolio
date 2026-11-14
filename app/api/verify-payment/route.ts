import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { key_secret } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    if (!key_secret) {
      return NextResponse.json(
        { error: 'Razorpay secret key not configured on server' },
        { status: 500 }
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate presence of required verification parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, or razorpay_signature',
        },
        { status: 400 }
      );
    }

    // Step 3: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const dataToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(dataToSign)
      .digest('hex');

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(generated_signature),
      Buffer.from(razorpay_signature)
    );

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment verification failed: Invalid signature',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error('Razorpay Signature Verification Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Server error during signature verification',
      },
      { status: 500 }
    );
  }
}

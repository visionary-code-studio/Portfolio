import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vaibhav2026';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vaibhawshaw@gmail.com';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const isValidPassword = password === ADMIN_PASSWORD || password === 'admin' || password === 'vaibhav';
    const isValidEmail = !email || email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() || email.includes('@');

    if (isValidPassword && isValidEmail) {
      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful',
        user: { email: ADMIN_EMAIL, role: 'admin' },
      });

      // Set cookie for simple session
      response.cookies.set('admin_auth', 'authenticated', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials. Password hint: vaibhav2026' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete('admin_auth');
  return response;
}

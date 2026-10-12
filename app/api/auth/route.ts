import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'Direct API password authentication is disabled. Admin panel authenticates directly and securely via Google Firebase Authentication.',
    },
    { status: 403 }
  );
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete('admin_auth');
  return response;
}

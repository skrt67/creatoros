import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.redirect(new URL('/dashboard/analytics?error=no_code', request.url));
    }

    // Get the token from the request cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Send the code to the backend to exchange for access token
    const response = await fetch(`${BACKEND_URL}/tiktok/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      return NextResponse.redirect(new URL('/dashboard/analytics', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard/analytics?error=callback_failed', request.url));
    }
  } catch (error) {
    console.error('Error in TikTok callback:', error);
    return NextResponse.redirect(new URL('/dashboard/analytics?error=callback_error', request.url));
  }
}

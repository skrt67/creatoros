import { NextRequest, NextResponse } from 'next/server';

const TIKTOK_CLIENT_KEY = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
const TIKTOK_REDIRECT_URI = `${process.env.NEXTAUTH_URL || 'https://creatoros-henna.vercel.app'}/api/tiktok/callback`;

export async function POST(request: NextRequest) {
  try {
    const authUrl = new URL('https://www.tiktok.com/v1/oauth/authorize');
    authUrl.searchParams.append('client_key', TIKTOK_CLIENT_KEY || '');
    authUrl.searchParams.append('redirect_uri', TIKTOK_REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'user.info.basic,video.list');
    authUrl.searchParams.append('state', Math.random().toString(36).substring(7));

    return NextResponse.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error('Error generating TikTok auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}

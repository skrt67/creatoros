import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import { Providers } from '@/components/providers/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://creatoros.com'),
  title: {
    default: 'CreatorOS - AI-Powered Content Creation Platform',
    template: '%s | CreatorOS'
  },
  description: 'Transform your YouTube videos into a diverse portfolio of high-quality marketing assets with AI-powered automation. Generate blog posts, social media content, and newsletters instantly.',
  keywords: ['AI content creation', 'YouTube to blog', 'video transcription', 'content marketing automation', 'AI writing assistant', 'social media content generator', 'video to text', 'content repurposing'],
  authors: [{ name: 'CreatorOS Team', url: 'https://creatoros.com' }],
  creator: 'CreatorOS',
  publisher: 'CreatorOS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://creatoros.com',
    title: 'CreatorOS - AI-Powered Content Creation Platform',
    description: 'Transform your YouTube videos into high-quality marketing assets with AI. Generate blog posts, social media content, and more instantly.',
    siteName: 'CreatorOS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CreatorOS - AI Content Creation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreatorOS - AI-Powered Content Creation',
    description: 'Transform your YouTube videos into marketing assets with AI',
    creator: '@creatoros',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0284c7' },
  ],
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Suspense fallback={<div>Chargement...</div>}>
            {children}
          </Suspense>
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}

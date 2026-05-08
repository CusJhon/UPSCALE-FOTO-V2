import type { Metadata, Viewport } from 'next';
import { Inter_Tight, Geist_Mono } from 'next/font/google';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://clarityhd.ai'),
  title: {
    default: 'ClarityHD — AI Image Upscaler | Transform Your Images to 4K',
    template: '%s | ClarityHD',
  },
  description: 'Transform blurry images into ultra HD using advanced AI enhancement technology. Upscale your photos to 4K with stunning detail and clarity.',
  keywords: [
    'AI image upscaler',
    'image enhancement',
    '4K upscale',
    'photo enhancer',
    'AI photo quality',
    'HD upscaler',
    'image resolution enhancer',
    'deep learning upscale',
  ],
  authors: [{ name: 'ClarityHD Team', url: 'https://clarityhd.ai/about' }],
  creator: 'ClarityHD',
  publisher: 'ClarityHD',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ClarityHD — AI Image Upscaler',
    description: 'Transform blurry images into ultra HD using advanced AI enhancement technology.',
    url: 'https://clarityhd.ai',
    siteName: 'ClarityHD',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClarityHD AI Image Upscaler - Before and After Enhancement',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClarityHD — AI Image Upscaler',
    description: 'Transform blurry images into ultra HD using advanced AI enhancement technology.',
    images: ['/twitter-image.png'],
    creator: '@clarityhd',
    site: '@clarityhd',
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
  alternates: {
    canonical: 'https://clarityhd.ai',
    languages: {
      'en-US': 'https://clarityhd.ai',
      'id-ID': 'https://clarityhd.ai/id',
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/shortcut-icon.png'],
  },
  category: 'technology',
  classification: 'AI Image Processing',
  referrer: 'origin-when-cross-origin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${interTight.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/ui/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    default: 'UniJoy — University Events',
    template: '%s | UniJoy',
  },
  description:
    'Discover, host, and manage university events across campuses. Find concerts, workshops, hackathons, and more with UniJoy.',
  keywords: [
    'university events',
    'campus events',
    'event management',
    'student life',
    'Yarmouk University',
    'UniJoy',
  ],
  openGraph: {
    title: 'UniJoy — University Events Platform',
    description:
      'Explore and manage campus events at Yarmouk Private University and beyond.',
    url: 'https://unijoy.com',
    siteName: 'UniJoy',
    images: [
      { url: '/og-image.jpg', width: 1200, height: 630, alt: 'UniJoy Open Graph Image' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UniJoy — University Events',
    description: 'Discover and manage campus events with UniJoy.',
    creator: '@unijoy',
    images: ['/twitter-image.jpg'],
  },
  authors: [{ name: 'UniJoy Team' }],
  creator: 'UniJoy',
  publisher: 'UniJoy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification',
    other: {
      me: ['your-email@domain.com'],
    },
  },
  alternates: {
    canonical: 'https://unijoy.com',
    languages: {
      'en-US': 'https://unijoy.com/en-US',
      'ar-SA': 'https://unijoy.com/ar-SA',
    },
  },
  appLinks: {
    ios: {
      url: 'https://unijoy.com/ios',
      app_store_id: 'app_store_id',
    },
    android: {
      package: 'com.unijoy.app',
      app_name: 'UniJoy',
    },
    web: {
      url: 'https://unijoy.com',
      should_fallback: true,
    },
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='scrollbar-thin'>
    
        <Providers>
          <ThemeProvider>
            <AuthProvider>
              <Header />
              {children}
              <Toaster />
              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
};
export default RootLayout;

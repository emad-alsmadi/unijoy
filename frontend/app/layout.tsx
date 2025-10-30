import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/ui/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'UniJoy',
  description:
    'احجز موعدك الآن في أفضل عيادة أسنان مع أطباء محترفين وبأحدث التقنيات.',
  keywords:
    'طب الأسنان, حجز موعد, عيادة أسنان, تبييض الأسنان, تقويم الأسنان , رعاية طبية , زرع الأسنان , إزالة التصبغ بالليزر , جراحة الزرع',
  openGraph: {
    title: ' | أفضل عيادة أسنان',
    description:
      'احجز موعدك الآن في أفضل عيادة أسنان مع أطباء محترفين وبأح  التقنيات.',
    url: 'https://odental.com',
    type: 'website',
    images: [
      {
        url: 'https://odental.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '',
      },
    ],
  },
  robots: 'index, follow',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0'
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try{
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
                  var root = document.documentElement;
                  if(theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
                }catch(e){}
              })();
            `,
          }}
        />
      </head>
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

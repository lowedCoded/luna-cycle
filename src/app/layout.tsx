import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display, Nunito, Raleway, Lora, Cormorant_Garamond, Manrope, Montserrat } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/components/providers/AppProvider';
import { AppLayout } from '@/components/layout/AppLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const raleway = Raleway({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-raleway',
  display: 'swap',
});

const lora = Lora({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-lora',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Luna — Cycle Tracker',
  description: 'Beautiful menstrual cycle tracking for women',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${nunito.variable} ${raleway.variable} ${lora.variable} ${cormorant.variable} ${manrope.variable} ${montserrat.variable}`}>
      <body>
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LinguaMate AI — Multilingual Speaking & Human Exchange Platform',
  description:
    'AI-powered language learning platform combining real human speaking partners, certificate mock tests (IELTS & Goethe), and sentence-by-sentence shadowing practice.',
  keywords: [
    'Language Learning',
    'Speaking Partner',
    'AI Speaking Tutor',
    'IELTS Speaking Mock',
    'Goethe B1 Practice',
    'Shadowing Lab',
    'Spaced Repetition',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

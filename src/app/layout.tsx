import type { Metadata } from 'next';
import './globals.css';
import { PlatformProvider } from '@/context/PlatformContext';

export const metadata: Metadata = {
  title: 'Bible Verse — AI-Powered Bible Reading, Scripture Context & Research',
  description:
    'Read authentic Bible translations (NIV, KJV, ESV, NKJV, NLT, ASV), explore chapter context and bidirectional Old and New Testament cross-references, listen with natural voice, and save discoveries in your personal research notebook.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans selection:bg-amber-200/70 selection:text-stone-900">
        <PlatformProvider>{children}</PlatformProvider>
      </body>
    </html>
  );
}

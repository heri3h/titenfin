import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'TitenFin - Cermat Kelola Kredit Barang & Kas Titipan',
  description: 'Aplikasi pembukuan kredit barang fleksibel dan buku rekening titipan uang dengan proteksi kas amanah.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 min-h-screen text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <ServiceWorkerRegister />
        {children}
        {/* Google Identity Services 1-Click Library */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

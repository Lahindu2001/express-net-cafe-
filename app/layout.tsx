import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.expressnetcafe.com'),
  title: {
    default: 'Express Net Cafe - Mobile Repair & Accessories | Dompe, Sri Lanka',
    template: '%s | Express Net Cafe'
  },
  description: 'Express Net Cafe: Your trusted mobile repair shop in dompe, Sri Lanka. Expert display repair, battery replacement, accessories, SIM cards, routers, televisions & photocopy services. 16+ years experience. Call 0702882883',
  keywords: ['mobile repair Sri Lanka', 'mobile repair Dompe', 'display repair', 'battery replacement', 'phone repair', 'Samsung repair', 'Apple repair', 'Huawei repair', 'mobile accessories', 'SIM cards Sri Lanka', 'Dialog routers', 'Mobitel routers', 'photocopy services', 'Express Net Cafe'],
  authors: [{ name: 'Express Net Cafe' }],
  creator: 'Express Net Cafe',
  publisher: 'Express Net Cafe',
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: 'https://www.expressnetcafe.com',
    siteName: 'Express Net Cafe',
    title: 'Express Net Cafe - Mobile Repair & Accessories | Dompe, Sri Lanka',
    description: 'Your trusted mobile repair shop in dompe. Expert display repair, battery replacement, accessories & more. 16+ years experience. Call 0702882883',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Express Net Cafe Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Express Net Cafe - Mobile Repair & Accessories',
    description: 'Your trusted mobile repair shop in dompe, Sri Lanka. Expert services with 16+ years experience.',
    images: ['/logo.png'],
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
    google: 'vqb5LATKpJ_Py9C4xZv0Zs1yIvJkkcU_aiQ9JqWybyE',
  },
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

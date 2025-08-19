import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { getLayoutConfig } from '@/lib/layoutConfig'

const inter = Inter({ subsets: ['latin'] })
const layoutConfig = getLayoutConfig()

export const metadata: Metadata = {
  title: layoutConfig.metadata.title,
  description: layoutConfig.metadata.description,
  keywords: layoutConfig.metadata.keywords,
  authors: layoutConfig.metadata.authors,
  creator: layoutConfig.metadata.creator,
  publisher: layoutConfig.metadata.publisher,
  metadataBase: new URL(layoutConfig.metadata.url),
  alternates: {
    canonical: layoutConfig.metadata.url,
  },
  robots: layoutConfig.metadata.robots,
  openGraph: layoutConfig.metadata.openGraph,
  twitter: layoutConfig.metadata.twitter,
  verification: layoutConfig.metadata.verification,
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={layoutConfig.htmlLang} className="scroll-smooth">
      <head>
        {/* Preconnect to Google Fonts for performance */}
        {layoutConfig.fonts.preconnect.map((url) => (
          <link key={url} rel="preconnect" href={url} />
        ))}
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(layoutConfig.structuredData.person)
          }}
        />
        
        {/* Font stylesheets */}
        {layoutConfig.fonts.stylesheets.map((href) => (
          <link
            key={href}
            href={href}
            rel="stylesheet"
          />
        ))}
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(layoutConfig.structuredData.professional)
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
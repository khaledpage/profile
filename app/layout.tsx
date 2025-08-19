import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import config from '@/lib/config'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: config.site.title,
    template: `%s | ${config.site.title}`
  },
  description: config.site.description,
  keywords: config.site.keywords,
  authors: [{ name: config.site.author }],
  creator: config.site.author,
  publisher: config.site.author,
  metadataBase: new URL(config.site.url),
  alternates: {
    canonical: config.site.url,
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.site.url,
    title: config.site.title,
    description: config.site.description,
    siteName: config.site.title,
    images: [
      {
        url: `${config.site.url}/assets/csm_Khaled_Alabsi_Portraet_6d491f1c81.jpg`,
        width: 1200,
        height: 630,
        alt: config.site.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: config.site.title,
    description: config.site.description,
    images: [`${config.site.url}/assets/csm_Khaled_Alabsi_Portraet_6d491f1c81.jpg`],
    creator: '@khaled_alabsi',
  },
  verification: {
    google: 'your-google-verification-code', // You'll need to add this later
  },
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
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Khaled Alabsi",
              "alternateName": "M.Sc. Khaled Alabsi",
              "description": "Digital Transformation Consultant & Software Engineer",
              "url": config.site.url,
              "image": `${config.site.url}/assets/csm_Khaled_Alabsi_Portraet_6d491f1c81.jpg`,
              "sameAs": [
                "",
                "https://alabsi.space"
              ],
              "jobTitle": "Digital Transformation Consultant",
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Germany"
              },
              "email": "khaled.alabsi@outlook.de",
              "knowsAbout": [
                "Digital Transformation",
                "Software Engineering",
                "Legacy System Modernization",
                "Business Process Automation",
                "Khaled Alabsi"
              ]
            })
          }}
        />
        
        {/* Arabic and Turkish font support */}
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Person",
              "name": "Khaled Alabsi",
              "jobTitle": "Senior Software Engineer",
              "description": "Professional Developer & Digital Innovator with over 8 years of experience in full-stack development, specializing in scalable applications and innovative digital solutions.",
              "url": "https://www.alabsi.space",
              "image": "https://www.alabsi.space/assets/csm_Khaled_Alabsi_Portraet_6d491f1c81.jpg",
              "sameAs": [
                "https://github.com/khaled-alabsi",
                "https://linkedin.com/in/khaled-alabsi",
                "https://twitter.com/khaled_alabsi"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Independent Developer"
              },
              "knowsAbout": [
                "Full-Stack Development",
                "Java",
                "Spring Framework",
                "React",
                "Node.js",
                "Python",
                "Cloud Computing",
                "AWS",
                "DevOps",
                "Data Analytics",
                "Machine Learning",
                "Mobile Development",
                "Enterprise Software",
                "Microservices"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Germany"
              }
            })
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
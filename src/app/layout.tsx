import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from '@/utils/content';
import ThemeController from '@/components/ThemeController';
import SettingsPanel from '@/components/ui/SettingsPanel';
import CookieConsent from '@/components/ui/CookieConsent';
import type { ColorPalette } from '@/types/content';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Khaled Alabsi — Full-Stack Developer & Designer",
    template: "%s | Khaled Alabsi",
  },
  description:
    "Full‑Stack Developer & Designer specializing in Next.js, React, TypeScript, and modern web technologies. Clean code, delightful UX, and scalable systems. Explore projects, articles, and technical insights.",
  keywords: [
    "Full-Stack Developer",
    "React Developer", 
    "Next.js Developer",
    "TypeScript",
    "Web Development",
    "UI/UX Design",
    "JavaScript",
    "Portfolio",
    "Technical Articles",
    "Software Engineering"
  ],
  authors: [{ name: "Khaled Alabsi" }],
  creator: "Khaled Alabsi",
  metadataBase: new URL("https://khaledpage.github.io/profile"),
  openGraph: {
    title: "Khaled Alabsi — Full-Stack Developer & Designer",
    description:
      "Explore my portfolio showcasing modern web development projects, technical articles, and expertise in React, Next.js, and TypeScript.",
    url: "https://khaledpage.github.io/profile",
    siteName: "Khaled Alabsi Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Khaled Alabsi - Full-Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khaled Alabsi — Full-Stack Developer & Designer",
    description:
      "Full‑Stack Developer & Designer specializing in Next.js, React, TypeScript. Clean code, delightful UX, and scalable systems.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig().catch(() => null);
  
  // Helper function to get flattened palettes from both legacy and grouped structures
  const getAllPalettes = () => {
    if (config?.paletteGroups) {
      const flattened: Record<string, ColorPalette> = {};
      Object.values(config.paletteGroups).forEach(group => {
        Object.assign(flattened, group.palettes);
      });
      return flattened;
    }
    return config?.palettes ?? {};
  };
  
  const allPalettes = getAllPalettes();
  const anim = config?.animation;

  const gradientStyle: React.CSSProperties | undefined = anim
    ? (Object.assign({}, {
        opacity: anim.fadeMax ?? 0.5,
        ['--anim-rotate']: `${anim.rotateDurationSec ?? 60}s`,
        ['--anim-fade']: `${anim.fadeDurationSec ?? 60}s`,
        ['--anim-min']: String(anim.fadeMin ?? 0.2),
        ['--anim-max']: String(anim.fadeMax ?? 0.6),
      }) as React.CSSProperties)
    : { opacity: 0.5 };

  return (
    <html lang="en" suppressHydrationWarning>
      <body id="app-body" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>        
        <div id="app-root" className="relative min-h-dvh">
          {/* subtle grid background */}
          <div id="app-grid-background" className="fixed inset-0 bg-grid pointer-events-none" aria-hidden />
          <div id="app-animated-background" className="fixed inset-0 animated-gradient -z-10" style={gradientStyle} aria-hidden />
          <ThemeController
            palettes={allPalettes}
            colorProfile={config?.colorProfile ?? ''}
            colorRotation={config?.colorRotation}
            animation={config?.animation}
            interactiveEffects={config?.interactiveEffects}
          />
          <SettingsPanel
            config={config ?? { colorProfile: '', palettes: {} }}
          />
          <CookieConsent />
          {children}
        </div>
      </body>
    </html>
  );
}

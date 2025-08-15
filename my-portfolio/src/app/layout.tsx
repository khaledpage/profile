import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from '@/utils/content';
import ThemeController from '@/components/ThemeController';
import SettingsPanel from '@/components/ui/SettingsPanel';
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
    default: "Khaled Alabsi — Portfolio",
    template: "%s | Khaled Alabsi",
  },
  description:
    "Full‑Stack Developer & Designer — Next.js, React, TypeScript. Clean code, delightful UX, and scalable systems.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Khaled Alabsi — Portfolio",
    description:
      "Full‑Stack Developer & Designer — Next.js, React, TypeScript. Clean code, delightful UX, and scalable systems.",
    type: "website",
    url: "/",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>        
        <div className="relative min-h-dvh">
          {/* subtle grid background */}
          <div className="fixed inset-0 bg-grid pointer-events-none" aria-hidden />
          <div className="fixed inset-0 animated-gradient -z-10" style={gradientStyle} aria-hidden />
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
          {children}
        </div>
      </body>
    </html>
  );
}

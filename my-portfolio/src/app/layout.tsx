import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from '@/utils/content';
import ThemeController from '@/components/ThemeController';

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
  const palette = config?.palettes?.[config?.colorProfile ?? ''] ?? null;
  const anim = config?.animation;
  const bodyStyle: React.CSSProperties | undefined = palette
    ? (Object.assign({}, {
        ['--background']: palette.background,
        ['--foreground']: palette.foreground,
        ['--muted']: palette.muted,
        ['--card']: palette.card,
        ['--card-contrast']: palette.cardContrast,
        ['--accent-1']: palette.accent1,
        ['--accent-2']: palette.accent2,
      }) as React.CSSProperties)
    : undefined;

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={bodyStyle}>        
        <div className="relative min-h-dvh">
          {/* subtle grid background */}
          <div className="fixed inset-0 bg-grid pointer-events-none" aria-hidden />
          <div className={`fixed inset-0 ${anim?.enabled === false ? '' : 'animated-gradient'} -z-10`} style={gradientStyle} aria-hidden />
          <ThemeController palettes={config?.palettes ?? {}} colorProfile={config?.colorProfile ?? ''} colorRotation={config?.colorRotation} animation={config?.animation} />
          {children}
        </div>
      </body>
    </html>
  );
}

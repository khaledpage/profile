import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>        
        <div className="relative min-h-dvh">
          {/* subtle grid background */}
          <div className="fixed inset-0 bg-grid pointer-events-none" aria-hidden />
          {children}
        </div>
      </body>
    </html>
  );
}

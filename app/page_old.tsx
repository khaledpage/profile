'use client';

import React, { useEffect, useState } from 'react';
import config from '@/lib/config';
import { getTheme } from '@/lib/themes';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Motivation from '@/components/Motivation';
import Process from '@/components/Process';
import Contact from '@/components/Contact';
import Nav from '@/components/Nav';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const theme = getTheme(config.theme.active);

  useEffect(() => {
    setMounted(true);
    
    // Apply theme CSS variables
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
  }, [theme]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold gradient-text">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Nav />
      
      <main>
        <Hero />
        <About />
        <Experience />
        <Motivation />
        <Process />
        <Contact />
      </main>
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
    </div>
  );
}
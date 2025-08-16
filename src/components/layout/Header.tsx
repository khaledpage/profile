'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';

type Props = {
  config?: SiteConfig;
};

export default function Header({ config }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { translations } = useLanguage(config);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#about', label: translations?.nav.about || 'About' },
    { href: '#projects', label: translations?.nav.projects || 'Projects' },
    { href: '#skills', label: translations?.nav.skills || 'Skills' },
    { href: '#articles', label: translations?.nav.articles || 'Articles' },
    { href: '#contact', label: translations?.nav.contact || 'Contact' },
  ];

  // Deterministic particle values to prevent hydration mismatch
  const particles = useMemo(() => {
    const count = 20;
    const arr = Array.from({ length: count }, (_, i) => {
      // simple LCG for repeatable pseudo-randoms
      let seed = i * 9301 + 49297;
      const rand = () => {
        seed = (seed * 233280 + 93249) % 233280;
        return seed / 233280;
      };
      const left = rand() * 100; // percent
      const delay = 5 + rand() * 15; // 5-20s
      const duration = 15 + rand() * 10; // 15-25s
      return { left: `${left}%`, delay: `${delay}s`, duration: `${duration}s` };
    });
    return arr;
  }, []);

  return (
    <>
      {/* Particles Background */}
  <div id="header-particles" className="particles fixed inset-0 z-0" aria-hidden>
    {particles.map((p, i) => (
          <div
            key={i}
            id={`header-particle-${i}`}
            className="particle"
            style={{
      left: p.left,
      animationDelay: p.delay,
      animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <motion.header
        id="main-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'glass backdrop-blur-xl border-b border-white/10' 
            : 'bg-transparent'
        }`}
      >
        <nav id="main-nav" className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div id="nav-container" className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.a
              id="header-logo"
              href="#"
              className="flex items-center space-x-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div id="logo-icon-wrapper" className="relative">
                <CodeBracketIcon 
                  id="logo-icon"
                  className="h-8 w-8 transition-colors" 
                  style={{ 
                    color: 'var(--accent-1)', 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent-2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--accent-1)';
                  }}
                />
                <div id="logo-glow" className="absolute inset-0 bg-indigo-400/20 blur-xl rounded-full group-hover:bg-indigo-300/30 transition-all" />
              </div>
              <span id="logo-text" className="font-bold text-xl gradient-text hidden sm:block">
                Portfolio
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div id="desktop-nav" className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  id={`nav-link-${item.href.replace('#', '')}`}
                  href={item.href}
                  className="relative font-medium transition-colors group"
                  style={{ 
                    color: 'var(--muted)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--foreground)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--muted)';
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <span id={`nav-underline-${item.href.replace('#', '')}`} className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <motion.a
              id="header-cta-button"
              href="#contact"
              className="hidden md:block relative px-6 py-2 font-medium rounded-full transition-all duration-300 interactive-border wave-ring hover:shadow-lg"
              style={{
                background: `linear-gradient(to right, var(--accent-1), var(--accent-2))`,
                color: 'var(--card-contrast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, color-mix(in srgb, var(--accent-1), white 20%), color-mix(in srgb, var(--accent-2), white 20%))`;
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, var(--accent-1), var(--accent-2))`;
                e.currentTarget.style.transform = 'scale(1)';
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {translations?.cta?.talk || "Let's Talk"}
            </motion.a>

            {/* Mobile Menu Button */}
            <motion.button
              id="mobile-menu-button"
              className="md:hidden relative z-50 p-2 rounded-lg glass"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    id="mobile-close-icon"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <XMarkIcon id="close-icon" className="h-6 w-6" style={{ color: 'var(--foreground)' }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    id="mobile-open-icon"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Bars3Icon id="hamburger-icon" className="h-6 w-6" style={{ color: 'var(--foreground)' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-dark"
              style={{
                borderTop: `1px solid color-mix(in srgb, var(--foreground), transparent 90%)`,
              }}
            >
              <div id="mobile-menu-container" className="container mx-auto px-4 py-6">
                <div id="mobile-nav-links" className="flex flex-col space-y-4">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.href}
                      id={`mobile-nav-link-${item.href.replace('#', '')}`}
                      href={item.href}
                      className="font-medium py-2 px-4 rounded-lg transition-all"
                      style={{ 
                        color: 'var(--muted)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--foreground)';
                        e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--card), transparent 50%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--muted)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  <motion.a
                    id="mobile-cta-button"
                    href="#contact"
                    className="mt-4 px-6 py-3 font-medium rounded-full text-center wave-ring"
                    style={{
                      background: `linear-gradient(to right, var(--accent-1), var(--accent-2))`,
                      color: 'var(--card-contrast)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setIsOpen(false)}
                  >
                    {translations?.cta?.talk || "Let's Talk"}
                  </motion.a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

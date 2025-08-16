/**
 * Smooth scroll utility with accessibility support and header offset
 */

interface SmoothScrollOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
}

/**
 * Easing function for smooth scrolling animation
 */
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

/**
 * Smooth scroll to element with proper header offset and accessibility
 */
export const smoothScrollToElement = (
  target: string | HTMLElement,
  options: SmoothScrollOptions = {}
): void => {
  const {
    offset = 80, // Default offset for fixed header
    duration = 800,
    easing = easeInOutCubic
  } = options;

  const targetElement = typeof target === 'string' 
    ? document.querySelector(target) as HTMLElement
    : target;

  if (!targetElement) {
    console.warn(`Smooth scroll target not found: ${target}`);
    return;
  }

  // Check if browser supports smooth scrolling
  const supportsNativeSmooth = 'scrollBehavior' in document.documentElement.style;
  
  if (supportsNativeSmooth) {
    // Use native smooth scrolling with proper offset
    const targetPosition = targetElement.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  } else {
    // Fallback for browsers without native support
    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.offsetTop - offset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      window.scrollTo(0, startPosition + distance * easing(progress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  // Handle focus for accessibility
  setTimeout(() => {
    // Set focus to the target element for screen readers
    if (targetElement.tabIndex < 0) {
      targetElement.tabIndex = -1;
    }
    targetElement.focus({ preventScroll: true });
    
    // Remove tabindex after focus to maintain natural tab order
    setTimeout(() => {
      if (targetElement.tabIndex === -1) {
        targetElement.removeAttribute('tabindex');
      }
    }, 100);
  }, supportsNativeSmooth ? 800 : duration + 50);
};

/**
 * Handle click events for smooth scrolling navigation links
 */
export const handleSmoothScrollClick = (
  event: React.MouseEvent<HTMLAnchorElement>,
  options?: SmoothScrollOptions
): void => {
  event.preventDefault();
  
  const href = event.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#')) {
    return;
  }

  const targetId = href.substring(1);
  const targetElement = document.getElementById(targetId);
  
  if (targetElement) {
    smoothScrollToElement(targetElement, options);
    
    // Update URL hash without triggering scroll
    if (history.pushState) {
      history.pushState(null, '', href);
    } else {
      location.hash = href;
    }
  }
};

/**
 * Handle native click events for smooth scrolling navigation links
 */
export const handleNativeSmoothScrollClick = (
  event: Event,
  options?: SmoothScrollOptions
): void => {
  event.preventDefault();
  
  const target = event.currentTarget as HTMLAnchorElement;
  const href = target.getAttribute('href');
  
  if (!href || !href.startsWith('#')) {
    return;
  }

  const targetId = href.substring(1);
  const targetElement = document.getElementById(targetId);
  
  if (targetElement) {
    smoothScrollToElement(targetElement, options);
    
    // Update URL hash without triggering scroll
    if (history.pushState) {
      history.pushState(null, '', href);
    } else {
      location.hash = href;
    }
  }
};

/**
 * Initialize smooth scrolling for all navigation links on the page
 */
export const initializeSmoothScrolling = (options?: SmoothScrollOptions): void => {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach((link) => {
    const anchor = link as HTMLAnchorElement;
    anchor.addEventListener('click', (event) => {
      handleNativeSmoothScrollClick(event, options);
    });
  });
};

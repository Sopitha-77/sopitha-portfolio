import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const observerRef = useRef(null);
  const rafIdRef = useRef(null);
  const isScrollingRef = useRef(false);
  const touchStartY = useRef(0);
  const scrollLockRef = useRef(false);

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Disable smooth scroll on mobile for better performance
      if (mobile) {
        document.documentElement.style.scrollBehavior = 'auto';
      } else {
        document.documentElement.style.scrollBehavior = 'smooth';
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Fast smooth scrolling optimized for mobile
  const smoothScrollTo = useCallback((targetPosition) => {
    if (isScrollingRef.current || scrollLockRef.current) return;
    
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    
    // On mobile, use faster native scroll for better performance
    if (isMobile) {
      // Use faster animation on mobile
      const startTime = performance.now();
      const duration = 200; // Reduced from 400ms to 200ms
      
      isScrollingRef.current = true;
      scrollLockRef.current = true;
      
      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use faster easing function
        const ease = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animateScroll);
        } else {
          isScrollingRef.current = false;
          scrollLockRef.current = false;
          rafIdRef.current = null;
        }
      };
      
      rafIdRef.current = requestAnimationFrame(animateScroll);
      
      // Safety timeout
      setTimeout(() => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        isScrollingRef.current = false;
        scrollLockRef.current = false;
      }, duration + 50);
    } else {
      // Desktop: use smoother scroll
      const duration = 300;
      const startTime = performance.now();
      
      isScrollingRef.current = true;
      
      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic for desktop
        const ease = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo({ top: startPosition + distance * ease });
        
        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animateScroll);
        } else {
          isScrollingRef.current = false;
          rafIdRef.current = null;
        }
      };
      
      rafIdRef.current = requestAnimationFrame(animateScroll);
    }
  }, [isMobile]);

  const scrollToSection = useCallback((id) => {
    if (isScrollingRef.current || scrollLockRef.current) return;
    
    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id);

      // Get the target position with navbar offset
      const elementRect = element.getBoundingClientRect();
      const navbarHeight = isMobile ? 60 : 80;
      const targetPosition = elementRect.top + window.pageYOffset - navbarHeight;

      // Start smooth scroll
      smoothScrollTo(targetPosition);
    }
  }, [smoothScrollTo, isMobile]);

  // Optimized IntersectionObserver for mobile
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Skip if programmatically scrolling
        if (isScrollingRef.current || scrollLockRef.current) return;

        let visibleSection = null;
        let maxVisibleArea = 0;

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const visibleRatio = entry.intersectionRatio;
            if (visibleRatio > maxVisibleArea) {
              maxVisibleArea = visibleRatio;
              visibleSection = entry.target.id;
            }
          }
        });

        if (visibleSection && maxVisibleArea > 0.3 && visibleSection !== activeSection) {
          setActiveSection(visibleSection);
        }
      },
      {
        root: null,
        rootMargin: isMobile ? '-15% 0px -50% 0px' : '-20% 0px -60% 0px',
        threshold: isMobile ? [0.3, 0.5, 0.7] : [0, 0.3, 0.5, 0.7]
      }
    );

    const sections = ['home', 'about', 'experience', 'projects', 'skills', 'certifications', 'contact'];
    
    // Observe sections immediately
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeSection, isMobile]);

  // Optimized scroll handling for mobile
  useEffect(() => {
    let isTicking = false;
    let lastScrollY = window.scrollY;
    let velocity = 0;
    let lastTime = performance.now();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      
      // Calculate velocity
      if (deltaTime > 0) {
        velocity = Math.abs(currentScrollY - lastScrollY) / deltaTime;
      }

      // Cancel programmatic scroll if user scrolls manually with significant velocity
      if (isScrollingRef.current && velocity > 0.5) {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        isScrollingRef.current = false;
        scrollLockRef.current = false;
      }

      lastScrollY = currentScrollY;
      lastTime = currentTime;

      // Throttle using requestAnimationFrame
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(() => {
          // Any scroll-based logic here
          isTicking = false;
        });
      }
    };

    // Use passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Touch handling for mobile - optimized
  useEffect(() => {
    if (!isMobile) return;

    let touchStart = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      touchStart = e.touches[0].clientY;
      touchStartTime = performance.now();
      
      // Cancel any ongoing animations on touch start
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      isScrollingRef.current = false;
      scrollLockRef.current = false;
    };

    const handleTouchMove = (e) => {
      // Very fast response to touch movement
      if (isScrollingRef.current && rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
        isScrollingRef.current = false;
        scrollLockRef.current = false;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile]);

  // Load smoothscroll polyfill only on desktop
  useEffect(() => {
    if (!isMobile) {
      import('smoothscroll-polyfill').then((smoothscroll) => {
        smoothscroll.polyfill();
      });
    }
  }, [isMobile]);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Content Container */}
      <div className="relative z-10">
        <Navbar 
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          isScrolling={isScrollingRef.current}
          isMobile={isMobile}
        />

        <div className="relative">
          {/* Hero Section */}
          <div id="home">
            <Hero scrollToSection={scrollToSection} />
          </div>
          
          {/* Responsive sections - simplified overlays for better performance */}
          <div id="about" className="relative">
            <div className="absolute inset-0 bg-black/80" />
            <div className="relative">
              <About />
            </div>
          </div>
          
          <div id="experience" className="relative">
            <div className="absolute inset-0 bg-black/90" />
            <div className="relative">
              <Experience />
            </div>
          </div>
          
          <div id="projects" className="relative">
            <div className="absolute inset-0 bg-black/85" />
            <div className="relative">
              <Projects />
            </div>
          </div>
          
          <div id="skills" className="relative">
            <div className="absolute inset-0 bg-black/90" />
            <div className="relative">
              <Skills />
            </div>
          </div>
          
          <div id="certifications" className="relative">
            <div className="absolute inset-0 bg-black/85" />
            <div className="relative">
              <Certifications />
            </div>
          </div>
          
          <div id="contact" className="relative">
            <div className="absolute inset-0 bg-black/95" />
            <div className="relative">
              <Contact />
            </div>
          </div>
          
          <Footer />
        </div>
      </div>

      {/* Optimized Performance CSS */}
      <style jsx global>{`
        /* Base styles - optimized for mobile */
        html {
          scroll-behavior: ${isMobile ? 'auto' : 'smooth'};
          scroll-padding-top: ${isMobile ? '60px' : '80px'};
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Optimize rendering for mobile */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-tap-highlight-color: transparent;
          backface-visibility: hidden;
        }
        
        /* Improve scrolling performance */
        body {
          overscroll-behavior-y: none;
          overflow-x: hidden;
          text-rendering: optimizeSpeed;
        }
        
        /* Hardware acceleration for smooth scrolling */
        .scroll-container {
          transform: translateZ(0);
          will-change: transform;
        }
        
        /* Optimize animations for mobile */
        @media (max-width: 768px) {
          * {
            animation-duration: 0.2s !important;
            transition-duration: 0.2s !important;
          }
          
          /* Reduce complex shadows and effects on mobile */
          .shadow-lg, .shadow-xl {
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Fast scrollbar - simplified for mobile */
        ::-webkit-scrollbar {
          width: ${isMobile ? '3px' : '8px'};
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${isMobile ? 'rgba(99, 102, 241, 0.5)' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(168, 85, 247, 0.7))'};
          border-radius: ${isMobile ? '1px' : '4px'};
        }
        
        /* Touch-friendly tap targets */
        @media (max-width: 768px) {
          button, a {
            min-height: 44px;
            min-width: 44px;
            touch-action: manipulation;
          }
          
          /* Prevent text selection during scroll */
          .no-select {
            -webkit-touch-callout: none;
            user-select: none;
          }
          
          /* Improve image rendering */
          img {
            max-width: 100%;
            height: auto;
          }
        }
        
        /* Force GPU acceleration for smooth animations */
        .smooth-transform {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Prevent layout shifts */
        .stable-layout {
          contain: layout style paint;
        }
      `}</style>
    </div>
  );
}
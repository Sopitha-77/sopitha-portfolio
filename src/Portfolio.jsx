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
import Galaxy from './components/Galaxy';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const observerRef = useRef(null);
  const rafIdRef = useRef(null);
  const isScrollingRef = useRef(false);
  const touchStartY = useRef(0);

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Optimized smooth scrolling with requestAnimationFrame
  const smoothScrollTo = useCallback((targetPosition, duration = 300) => {
    if (isScrollingRef.current) return;
    
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    
    // If distance is very small, jump directly
    if (Math.abs(distance) < 50) {
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      setIsScrolling(false);
      isScrollingRef.current = false;
      return;
    }

    // Mobile gets slower animation for better feel
    const scrollDuration = isMobile ? 400 : 300;
    
    let startTime = null;
    isScrollingRef.current = true;
    setIsScrolling(true);

    // Cancel any existing animation
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / scrollDuration, 1);
      
      // Optimized easing function - smooth and responsive
      const easeOutCubic = (t) => {
        return 1 - Math.pow(1 - t, 3);
      };
      
      const run = startPosition + distance * easeOutCubic(progress);
      
      // Use native smooth scrolling when available
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: run });
      } else {
        window.scrollTo(0, run);
      }
      
      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animation);
      } else {
        rafIdRef.current = null;
        isScrollingRef.current = false;
        setIsScrolling(false);
      }
    };

    rafIdRef.current = requestAnimationFrame(animation);

    // Safety timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      isScrollingRef.current = false;
      setIsScrolling(false);
    }, scrollDuration + 100);

  }, [isMobile]);

  const scrollToSection = useCallback((id) => {
    if (isScrollingRef.current) return;
    
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

  // Use IntersectionObserver for smooth section detection
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Skip if programmatically scrolling
        if (isScrollingRef.current) return;

        let maxIntersection = 0;
        let activeId = activeSection;

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const intersectionRatio = entry.intersectionRatio;
            if (intersectionRatio > maxIntersection) {
              maxIntersection = intersectionRatio;
              activeId = entry.target.id;
            }
          }
        });

        if (maxIntersection > 0.4 && activeId !== activeSection) {
          setActiveSection(activeId);
        }
      },
      {
        root: null,
        rootMargin: isMobile ? '-10% 0px -40% 0px' : '-20% 0px -60% 0px',
        threshold: isMobile ? [0, 0.5, 0.7] : [0, 0.3, 0.5, 0.7]
      }
    );

    const sections = ['home', 'about', 'experience', 'projects', 'skills', 'certifications', 'contact'];
    
    // Observe sections
    const observeSections = () => {
      sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    };

    // Small delay to ensure DOM is ready
    setTimeout(observeSections, 100);

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeSection, isMobile]);

  // Handle manual scroll events
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let scrollTimeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastScrollTime;

      // Detect manual scroll during programmatic scroll
      if (isScrollingRef.current && Math.abs(currentScrollY - lastScrollY) > 5) {
        // Cancel programmatic scroll if user scrolls manually
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        isScrollingRef.current = false;
        setIsScrolling(false);
      }

      // Throttle scroll events
      if (timeDiff > 50) {
        lastScrollY = currentScrollY;
        lastScrollTime = currentTime;
      }

      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set new timeout to detect scroll end
      scrollTimeout = setTimeout(() => {
        // Scroll ended, can be used for additional logic
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Handle touch events for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      // Cancel programmatic scroll on touch move
      if (isScrollingRef.current && rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
        isScrollingRef.current = false;
        setIsScrolling(false);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile]);

  // Performance optimization for Galaxy
  const [galaxyQuality, setGalaxyQuality] = useState('low');
  
  useEffect(() => {
    // Load smoothscroll polyfill
    import('smoothscroll-polyfill').then((smoothscroll) => {
      smoothscroll.polyfill();
    });

    // Adjust Galaxy quality based on device
    const adjustGalaxyQuality = () => {
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isHighEndDevice = !isMobile && window.devicePixelRatio >= 2;
      
      setGalaxyQuality(isReducedMotion || isMobile ? 'low' : isHighEndDevice ? 'high' : 'medium');
    };

    adjustGalaxyQuality();
    window.addEventListener('load', adjustGalaxyQuality);

    return () => window.removeEventListener('load', adjustGalaxyQuality);
  }, [isMobile]);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Responsive Galaxy Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Galaxy
          density={galaxyQuality === 'high' ? 0.7 : galaxyQuality === 'medium' ? 0.5 : 0.3}
          starSpeed={0.2}
          hueShift={200}
          glowIntensity={galaxyQuality === 'high' ? 0.2 : 0.1}
          mouseInteraction={galaxyQuality === 'high' && !isMobile}
          mouseRepulsion={false}
          twinkleIntensity={0.15}
          rotationSpeed={0}
          speed={0.2}
          repulsionStrength={0}
          transparent={true}
          particleCount={galaxyQuality === 'high' ? 500 : galaxyQuality === 'medium' ? 300 : 200}
        />
      </div>
      
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
          
          {/* Responsive sections */}
          <div id="about" className="relative">
            <div className={`absolute inset-0 ${isMobile ? 'bg-black/90' : 'bg-black/80'}`} />
            <div className="relative">
              <About />
            </div>
          </div>
          
          <div id="experience" className="relative">
            <div className={`absolute inset-0 ${isMobile ? 'bg-black/95' : 'bg-black/90'}`} />
            <div className="relative">
              <Experience />
            </div>
          </div>
          
          <div id="projects" className="relative">
            <div className={`absolute inset-0 ${isMobile ? 'bg-black/90' : 'bg-black/85'}`} />
            <div className="relative">
              <Projects />
            </div>
          </div>
          
          <div id="skills" className="relative">
            <div className={`absolute inset-0 ${isMobile ? 'bg-black/95' : 'bg-black/90'}`} />
            <div className="relative">
              <Skills />
            </div>
          </div>
          
          <div id="certifications" className="relative">
            <div className={`absolute inset-0 ${isMobile ? 'bg-black/90' : 'bg-black/85'}`} />
            <div className="relative">
              <Certifications />
            </div>
          </div>
          
          <div id="contact" className="relative">
            <div className={`absolute inset-0 ${isMobile ? 'bg-black' : 'bg-black/95'}`} />
            <div className="relative">
              <Contact />
            </div>
          </div>
          
          <Footer />
        </div>
      </div>

      {/* Responsive Performance CSS */}
      <style jsx global>{`
        /* Base smooth scrolling */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
          overflow-x: hidden;
        }
        
        /* Mobile scroll padding */
        @media (max-width: 768px) {
          html {
            scroll-padding-top: 60px;
          }
        }
        
        /* Optimize rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Improve scrolling performance on mobile */
        .scroll-area {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Prevent pull-to-refresh on mobile */
        body {
          overscroll-behavior-y: none;
        }
        
        /* Optimize animations for mobile */
        @media (max-width: 768px) {
          * {
            animation-duration: 0.3s !important;
            transition-duration: 0.3s !important;
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
          
          /* Hide heavy animations */
          .Galaxy,
          .animate-float,
          .animate-pulse {
            display: none !important;
          }
        }
        
        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(168, 85, 247, 0.7));
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(168, 85, 247, 0.9));
        }
        
        /* Mobile scrollbar */
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
        }
        
        /* Touch-friendly tap targets */
        @media (max-width: 768px) {
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Prevent text selection on buttons during scroll */
        .no-select {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
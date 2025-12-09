import { useState, useEffect, useRef } from 'react';
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
  const scrollTimeoutRef = useRef(null);
  const observerRef = useRef(null);
  const rafIdRef = useRef(null);

  // Smooth scroll polyfill - moved to useEffect
  useEffect(() => {
    // Load smoothscroll polyfill dynamically
    import('smoothscroll-polyfill').then((smoothscroll) => {
      smoothscroll.polyfill();
    });
  }, []);

  // Use IntersectionObserver for smooth section detection
  useEffect(() => {
    // Disconnect previous observer if exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        let maxIntersection = 0;
        let activeId = activeSection; // Start with current active section

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const intersectionRatio = entry.intersectionRatio;
            if (intersectionRatio > maxIntersection) {
              maxIntersection = intersectionRatio;
              activeId = entry.target.id;
            }
          }
        });

        // Only update if we found a new section and not currently programmatically scrolling
        if (maxIntersection > 0.3 && activeId !== activeSection && !isScrolling) {
          setActiveSection(activeId);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Triggers when section is near center
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
      }
    );

    // Observe all sections
    const sections = ['home', 'about', 'experience', 'projects', 'skills', 'certifications', 'contact'];
    
    // Delay observation to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    }, 100);

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearTimeout(timeoutId);
    };
  }, [activeSection, isScrolling]); // Added dependencies

  // Smooth scroll function using requestAnimationFrame
  const smoothScrollTo = (targetPosition, duration = 600) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Cancel any existing animation
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function
      const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const run = startPosition + distance * ease(progress);
      
      window.scrollTo(0, run);
      
      if (timeElapsed < duration) {
        rafIdRef.current = requestAnimationFrame(animation);
      } else {
        rafIdRef.current = null;
        setIsScrolling(false);
      }
    };

    rafIdRef.current = requestAnimationFrame(animation);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element && !isScrolling) {
      setIsScrolling(true);
      setActiveSection(id);

      // Get the target position
      const elementRect = element.getBoundingClientRect();
      const targetPosition = elementRect.top + window.pageYOffset - 80; // Offset for navbar

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Start smooth scroll
      smoothScrollTo(targetPosition);

      // Set timeout as backup to reset scrolling state
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        rafIdRef.current = null;
      }, 1000);
    }
  };

  // Handle manual scroll events for edge cases
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling && rafIdRef.current) {
        // If user scrolls manually during smooth scroll, cancel the animation
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
        setIsScrolling(false);
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce to reset scrolling state
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isScrolling]);

  // Performance optimization for Galaxy
  const [galaxyQuality, setGalaxyQuality] = useState('high');
  
  useEffect(() => {
    // Reduce Galaxy quality on slower devices
    const checkPerformance = () => {
      const isLowPerf = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
                       navigator.hardwareConcurrency < 4 ||
                       navigator.deviceMemory < 4;
      
      setGalaxyQuality(isLowPerf ? 'low' : 'high');
    };

    checkPerformance();
    window.addEventListener('load', checkPerformance);
    
    return () => window.removeEventListener('load', checkPerformance);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Optimized Galaxy Background with conditional quality */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Galaxy
          density={galaxyQuality === 'high' ? 0.8 : 0.5}
          starSpeed={galaxyQuality === 'high' ? 0.25 : 0.15}
          hueShift={200}
          glowIntensity={galaxyQuality === 'high' ? 0.25 : 0.15}
          mouseInteraction={galaxyQuality === 'high'}
          mouseRepulsion={galaxyQuality === 'high'}
          twinkleIntensity={galaxyQuality === 'high' ? 0.25 : 0.15}
          rotationSpeed={galaxyQuality === 'high' ? 0.015 : 0}
          speed={galaxyQuality === 'high' ? 0.3 : 0.2}
          repulsionStrength={galaxyQuality === 'high' ? 1.2 : 0.8}
          transparent={true}
        />
      </div>
      
      {/* Content Container with performance optimizations */}
      <div className="relative z-10">
        <Navbar 
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          isScrolling={isScrolling}
        />

        <div className="relative">
          {/* Hero Section */}
          <div id="home">
            <Hero scrollToSection={scrollToSection} />
          </div>
          
          {/* Sections with optimized backgrounds */}
          <div id="about" className="relative will-gpu">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70" />
            <div className="relative">
              <About />
            </div>
          </div>
          
          <div id="experience" className="relative will-gpu">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/90" />
            <div className="relative">
              <Experience />
            </div>
          </div>
          
          <div id="projects" className="relative will-gpu">
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/80" />
            <div className="relative">
              <Projects />
            </div>
          </div>
          
          <div id="skills" className="relative will-gpu">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/90" />
            <div className="relative">
              <Skills />
            </div>
          </div>
          
          <div id="certifications" className="relative will-gpu">
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/80" />
            <div className="relative">
              <Certifications />
            </div>
          </div>
          
          <div id="contact" className="relative will-gpu">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
            <div className="relative">
              <Contact />
            </div>
          </div>
          
          <Footer />
        </div>
      </div>

      {/* Performance CSS - using global style tag */}
      <style jsx global>{`
        /* Optimize scrolling and animations */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px; /* Offset for fixed navbar */
          overscroll-behavior: none;
        }
        
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          overflow-x: hidden;
        }

        /* Hardware acceleration for better performance */
        .will-gpu {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Reduce backdrop-blur performance impact */
        .backdrop-blur-sm {
          will-change: backdrop-filter;
        }

        /* Optimize canvas rendering */
        canvas {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          -ms-interpolation-mode: nearest-neighbor;
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
          
          /* Hide Galaxy for reduced motion */
          .fixed.inset-0.z-0 {
            display: none !important;
          }
        }

        /* Better scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(168, 85, 247, 0.7));
          border-radius: 5px;
          border: 2px solid rgba(15, 23, 42, 0.3);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(168, 85, 247, 0.9));
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          html {
            scroll-padding-top: 60px;
          }
          
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
        }
      `}</style>
    </div>
  );
}
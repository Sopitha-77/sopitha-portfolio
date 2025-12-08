import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sparkles, Home, User, Briefcase, FolderKanban, Code, Mail, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { navItems } from '../data/constants';

const Navbar = ({ activeSection, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const pillRefs = useRef([]);
  const cursorRef = useRef(null);
  const underlineRef = useRef(null);
  const navRef = useRef(null);

  // Icons mapping for each section
  const sectionIcons = {
    home: Home,
    about: User,
    experience: Briefcase,
    projects: FolderKanban,
    skills: Code,
    certifications: X, // 
    contact: Mail
  };

  useEffect(() => {
    // Initialize GSAP animations
    if (underlineRef.current && navRef.current) {
      gsap.set(underlineRef.current, { 
        scaleX: 0,
        transformOrigin: "left center"
      });
    }

    // Custom cursor effect
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX - 10,
          y: e.clientY - 10,
          duration: 0.1,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleItemHover = (item, index) => {
    setHoveredItem(item);
    
    // Pill animation
    if (pillRefs.current[index]) {
      gsap.to(pillRefs.current[index], {
        scale: 1.05,
        y: -3,
        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
        duration: 0.3,
        ease: "power2.out"
      });

      // Particle effect
      createParticles(item);
    }

    // Underline animation
    if (underlineRef.current) {
      const target = document.querySelector(`[data-nav-item="${item}"]`);
      if (target) {
        const { left, width } = target.getBoundingClientRect();
        gsap.to(underlineRef.current, {
          x: left,
          width: width,
          scaleX: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  };

  const handleItemLeave = (index) => {
    setHoveredItem(null);
    
    if (pillRefs.current[index]) {
      gsap.to(pillRefs.current[index], {
        scale: 1,
        y: 0,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    }

    if (underlineRef.current && hoveredItem) {
      gsap.to(underlineRef.current, {
        scaleX: 0,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const createParticles = (item) => {
    // Create particle effect around the hovered item
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-indigo-400 rounded-full';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = '0.8';
      
      const target = document.querySelector(`[data-nav-item="${item}"]`);
      if (target) {
        target.appendChild(particle);
        
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 40,
          y: (Math.random() - 0.5) * 40,
          opacity: 0,
          scale: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => particle.remove()
        });
      }
    }
  };

  const handleScrollToSection = (item) => {
    scrollToSection(item);
    setIsMenuOpen(false);
    
    // Add click animation
    const index = navItems.indexOf(item);
    if (pillRefs.current[index]) {
      gsap.to(pillRefs.current[index], {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
    // Animate menu icon
    if (isMenuOpen) {
      gsap.to('.menu-icon', {
        rotation: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to('.menu-icon', {
        rotation: 180,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <>
      {/* Animated Cursor */}
      <div 
        ref={cursorRef}
        className="hidden lg:block fixed w-5 h-5 rounded-full border-2 border-indigo-400/50 mix-blend-difference pointer-events-none z-[9999]"
        style={{ backdropFilter: 'blur(2px)' }}
      />

      {/* Full-width Desktop Navbar */}
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50"
      >
        {/* Top decorative border */}
        <div className="h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x" />
        
        <div className="relative">
          {/* Glass morphism background - Full width */}
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl shadow-indigo-500/5" />
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Name on left */}
              <div 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => handleScrollToSection('home')}
                onMouseEnter={() => setHoveredItem('home')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="relative w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                    <div className="absolute inset-0 rounded-full border border-indigo-500/30 group-hover:border-indigo-400/50 transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent group-hover:from-indigo-200 group-hover:via-purple-200 group-hover:to-pink-200 transition-all duration-300">
                    Sopitha Portfolio
                  </h1>
                  <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    Frontend Developer
                  </span>
                </div>
              </div>

              {/* Desktop Navigation Pills - Moved to RIGHT side */}
              <div className="hidden md:flex items-center">
                <div className="flex items-center space-x-1">
                  {navItems.map((item, index) => {
                    const Icon = sectionIcons[item];
                    const isActive = activeSection === item;
                    
                    return (
                      <div 
                        key={item}
                        className="relative"
                        onMouseEnter={() => handleItemHover(item, index)}
                        onMouseLeave={() => handleItemLeave(index)}
                      >
                        <button
                          ref={(el) => (pillRefs.current[index] = el)}
                          data-nav-item={item}
                          onClick={() => handleScrollToSection(item)}
                          className={`
                            relative flex items-center space-x-2 px-4 py-2.5 rounded-full 
                            transition-all duration-300 ease-out
                            ${isActive 
                              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300' 
                              : 'bg-slate-800/50 text-gray-400 hover:text-white'
                            }
                            border border-slate-700/50
                            backdrop-blur-sm
                            mx-0.5
                          `}
                        >
                          {/* Icon with glow effect */}
                          <div className="relative">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                            {isActive && (
                              <div className="absolute -inset-1 bg-indigo-400/20 rounded-full blur" />
                            )}
                          </div>
                          
                          <span className="text-sm font-medium capitalize">
                            {item}
                          </span>
                          
                          {/* Active indicator */}
                          {isActive && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                          )}
                        </button>

                        {/* Hover tooltip */}
                        {hoveredItem === item && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-700 text-xs text-gray-300 whitespace-nowrap z-10 shadow-xl">
                            Go to {item}
                            <ChevronRight className="w-3 h-3 ml-1 inline-block" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Animated underline */}
                <div 
                  ref={underlineRef}
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                />
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden relative w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center group"
                onClick={toggleMenu}
              >
                <div className="relative w-6 h-6 flex items-center justify-center menu-icon">
                  <div className="absolute w-4 h-0.5 bg-gray-400 group-hover:bg-indigo-400 transition-all duration-300 rounded-full" 
                    style={{ transform: isMenuOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none' }} 
                  />
                  <div className="absolute w-4 h-0.5 bg-gray-400 group-hover:bg-indigo-400 transition-all duration-300 rounded-full" 
                    style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none' }} 
                  />
                </div>
                
                {/* Ring animation */}
                <div className="absolute inset-0 rounded-full border border-indigo-400/30 animate-ping-slow opacity-0 group-hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Full Width Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0">
            <div className="relative">
              {/* Menu background */}
              <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl" />
              
              {/* Gradient border */}
              <div className="absolute inset-0 p-[1px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-purple-500/20 to-transparent" />
              </div>

              <div className="relative px-6 py-8">
                <div className="grid grid-cols-1 gap-2">
                  {navItems.map((item, index) => {
                    const Icon = sectionIcons[item];
                    const isActive = activeSection === item;
                    
                    return (
                      <button
                        key={item}
                        onClick={() => handleScrollToSection(item)}
                        className={`
                          relative group flex items-center justify-between p-4 rounded-xl
                          transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20' 
                            : 'bg-slate-800/50 hover:bg-slate-800/70'
                          }
                          border border-slate-700/50
                          backdrop-blur-sm
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Icon container */}
                          <div className={`relative p-2 rounded-lg ${isActive ? 'bg-indigo-500/20' : 'bg-slate-700/50'}`}>
                            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                          </div>
                          
                          <div className="flex flex-col items-start">
                            <span className={`text-sm font-medium capitalize ${isActive ? 'text-indigo-300' : 'text-gray-400'}`}>
                              {item}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              Click to navigate
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {/* Active indicator */}
                          {isActive && (
                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                          )}
                          
                          {/* Hover arrow */}
                          <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </button>
                    );
                  })}
                  
                  
                </div>
                
                {/* Close hint */}
                <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
                  <span className="text-xs text-gray-500 animate-pulse">Tap anywhere to close menu</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20" />

      {/* Active section indicator for mobile */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-xl rounded-full border border-slate-700/50 shadow-lg">
          <span className="text-sm text-gray-300 capitalize flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>{activeSection}</span>
          </span>
        </div>
      </div>
    </>
  );
};

export default Navbar;
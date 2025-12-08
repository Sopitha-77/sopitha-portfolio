import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, ChevronDown, Sparkles, Palette, ArrowRight } from 'lucide-react';

const Hero = ({ scrollToSection }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const heroRef = useRef(null);
  
  const roles = [
    "Frontend Developer",
    "UI/UX Designer",
    "Creative Coder"
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Role rotation
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % roles.length);
    }, 3000);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Overlays - No Galaxy Here */}
      <div className="absolute inset-0">
        {/* Mouse-following gradient */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
            transition: 'background 0.3s ease'
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/40 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/5 via-transparent to-purple-950/5" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/30 rounded-full animate-float"
            style={{
              left: `${(i * 10) % 100}%`,
              top: `${Math.sin(i * 0.5) * 50 + 50}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              filter: `blur(${Math.random() * 2}px)`,
              opacity: 0.4 + Math.random() * 0.6
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto text-center px-4 z-10">
        {/* Animated Role Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-5 py-3 bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-full group hover:border-indigo-500/50 transition-all duration-500">
          <div className="relative">
            <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur group-hover:bg-purple-500/20 transition-all duration-500" />
            <Sparkles className="relative w-5 h-5 text-indigo-400 group-hover:text-purple-400 transition-colors duration-300" />
          </div>
          <div className="h-5 w-px bg-slate-600/50 mx-2" />
          <div className="relative h-6 overflow-hidden">
            <div 
              className="flex flex-col items-start transition-transform duration-500 ease-in-out"
              style={{ transform: `translateY(-${textIndex * 24}px)` }}
            >
              {roles.map((role, idx) => (
                <span 
                  key={idx}
                  className="text-sm font-medium text-slate-300 whitespace-nowrap"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
          <div className="h-5 w-px bg-slate-600/50 mx-2" />
          <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
            Chennai, India
          </span>
        </div>

        {/* Name with Glow Effect */}
        <div className="relative mb-8">
          <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/0 via-purple-500/10 to-pink-500/0 blur-3xl animate-pulse" />
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-4 tracking-tight">
            <span className="block">
              <span className="bg-gradient-to-r from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent animate-gradient">
                SOPITHA
              </span>
            </span>
            <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-2 bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
              PORTFOLIO
            </span>
          </h1>
          
          {/* Glowing orb behind name */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl animate-pulse" />
        </div>

        {/* Tagline */}
        <div className="mb-10 max-w-3xl mx-auto">
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-6 leading-relaxed">
            Creating <span className="font-semibold text-cyan-300">immersive digital experiences</span> with{' '}
            <span className="font-semibold text-purple-300">cutting-edge frontend technologies</span> and{' '}
            <span className="font-semibold text-pink-300">thoughtful UI/UX design</span>
          </p>
          
        
        </div>

        {/* Social Links & CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="https://github.com/Sopitha"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="p-3 bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl 
                            hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-300 hover:scale-110">
                <Github className="w-5 h-5 text-slate-300 hover:text-white transition-colors" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 
                            transition-all duration-300 px-2 py-1 bg-slate-900/90 backdrop-blur-sm rounded text-xs 
                            text-slate-300 whitespace-nowrap">
                GitHub
              </div>
            </a>
            
            <a
              href="https://linkedin.com/in/sopitha"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="p-3 bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl 
                            hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-300 hover:scale-110">
                <Linkedin className="w-5 h-5 text-slate-300 hover:text-white transition-colors" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 
                            transition-all duration-300 px-2 py-1 bg-slate-900/90 backdrop-blur-sm rounded text-xs 
                            text-slate-300 whitespace-nowrap">
                LinkedIn
              </div>
            </a>
            
            <a
              href="mailto:sopithasopitha7@gmail.com"
              className="relative group"
            >
              <div className="p-3 bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl 
                            hover:border-purple-500/50 hover:bg-slate-900/60 transition-all duration-300 hover:scale-110">
                <Mail className="w-5 h-5 text-slate-300 hover:text-white transition-colors" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 
                            transition-all duration-300 px-2 py-1 bg-slate-900/90 backdrop-blur-sm rounded text-xs 
                            text-slate-300 whitespace-nowrap">
                Email
              </div>
            </a>
          </div>
          
          {/* Divider */}
          <div className="h-px w-8 sm:h-8 sm:w-px bg-slate-700/50" />
          
          {/* CTA Button */}
          <button 
            onClick={() => scrollToSection('projects')}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 
                     backdrop-blur-sm rounded-xl hover:from-indigo-500/80 hover:to-purple-500/80 
                     transition-all duration-500 hover:scale-105 shadow-2xl shadow-indigo-500/20 
                     border border-indigo-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                          group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="relative flex items-center gap-3">
              <span className="text-lg font-semibold text-white">
                View My Work
              </span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs text-slate-500 uppercase tracking-widest">
            Scroll to explore
          </span>
          <div className="relative">
            <div className="w-px h-16 bg-gradient-to-b from-indigo-500 to-transparent animate-bounce" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
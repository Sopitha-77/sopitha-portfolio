import { useState, useEffect } from 'react';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* Full-page Galaxy Background */}
      <div className="fixed inset-0 z-0">
        <Galaxy
          density={1.3}
          starSpeed={0.5}
          hueShift={200}
          glowIntensity={0.4}
          mouseInteraction={true}
          mouseRepulsion={true}
          twinkleIntensity={0.4}
          rotationSpeed={0.03}
          speed={0.6}
          repulsionStrength={2}
          transparent={true}
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10">
        <Navbar 
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />

        <div className="relative">
          {/* Hero Section */}
          <Hero scrollToSection={scrollToSection} />
          
          {/* Other sections */}
          <div className="bg-black/60 backdrop-blur-md border-t border-white/5">
            <About />
          </div>
          
          <div className="bg-black/70 backdrop-blur-md border-t border-white/5">
            <Experience />
          </div>
          
          <div className="bg-black/60 backdrop-blur-md border-t border-white/5">
            <Projects />
          </div>
          
          <div className="bg-black/70 backdrop-blur-md border-t border-white/5">
            <Skills />
          </div>
          
          <div className="bg-black/60 backdrop-blur-md border-t border-white/5">
            <Certifications />
          </div>
          
          <div className="bg-black/70 backdrop-blur-md border-t border-white/5">
            <Contact />
          </div>
          
          <Footer />
        </div>
      </div>
    </div>
  );
}
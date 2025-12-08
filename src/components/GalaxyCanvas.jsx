import React, { useEffect, useRef } from 'react';

const GalaxyCanvas = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    
    // Set canvas size
    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    // Create stars
    const createStars = () => {
      stars = [];
      const count = 500;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.clientWidth,
          y: Math.random() * canvas.clientHeight,
          radius: Math.random() * 1.5,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.8 + 0.2,
          hue: 220 + Math.random() * 60
        });
      }
    };
    
    // Draw stars
    const draw = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      
      // Draw gradient background
      const gradient = ctx.createRadialGradient(
        canvas.clientWidth / 2,
        canvas.clientHeight / 2,
        0,
        canvas.clientWidth / 2,
        canvas.clientHeight / 2,
        Math.max(canvas.clientWidth, canvas.clientHeight) / 2
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      
      // Draw each star
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        const starGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.radius * 2
        );
        starGradient.addColorStop(0, `hsla(${star.hue}, 100%, 70%, ${star.opacity})`);
        starGradient.addColorStop(1, `hsla(${star.hue}, 100%, 50%, 0)`);
        
        ctx.fillStyle = starGradient;
        ctx.fill();
        
        // Move star
        star.x += Math.sin(Date.now() * 0.001 * star.speed) * 0.1;
        star.y += Math.cos(Date.now() * 0.001 * star.speed) * 0.1;
        
        // Wrap around edges
        if (star.x < 0) star.x = canvas.clientWidth;
        if (star.x > canvas.clientWidth) star.x = 0;
        if (star.y < 0) star.y = canvas.clientHeight;
        if (star.y > canvas.clientHeight) star.y = 0;
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Initialize
    resize();
    createStars();
    draw();
    
    // Event listeners
    window.addEventListener('resize', () => {
      resize();
      createStars();
    });
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  );
};

export default GalaxyCanvas;
import React, { useLayoutEffect, useRef, useCallback } from 'react';
import { Code, ExternalLink, Github, Eye, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { projects } from '../data/constants';
import Lenis from 'lenis';

// Import your project images from assets
import dreamiImages from '../assets/dreamimages.png'; // Create this path
import wavifyMusic from '../assets/wavify.png'; // Create this path
import pizzaRecipe from '../assets/smartrecipe.png'; // Create this path
import smartCook from '../assets/smartcook.png'; // Create this path

// ScrollStackItem Component - Optimized height
export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full h-[280px] md:h-[320px] my-4 md:my-6 p-6 md:p-8 rounded-[28px] md:rounded-[32px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }}
  >
    {children}
  </div>
);

// ScrollStack Component - Fixed for all 4 projects
const ScrollStack = ({
  children,
  className = '',
  itemDistance = 60,
  itemScale = 0.025,
  itemStackDistance = 15,
  stackPosition = '5%',
  scaleEndPosition = '0%',
  baseScale = 0.7,
  scaleDuration = 0.5,
  rotationAmount = 0.6,
  blurAmount = 0.8,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    element => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight, scrollContainer } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end');

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 0.7,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
        infinite: false,
        wheelMultiplier: 0.7,
        lerp: 0.05,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner'),
        duration: 0.7,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
        infinite: false,
        wheelMultiplier: 0.7,
        lerp: 0.05,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    );

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    setupLenis();

    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms
  ]);

  const containerClassName = useWindowScroll
    ? `relative w-full ${className}`.trim()
    : `relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim();

  return (
    <div className={containerClassName} ref={scrollerRef}>
      <div className="scroll-stack-inner pt-[5vh] px-4 sm:px-6 md:px-8 pb-[40rem] min-h-screen">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

// Live and GitHub links for each project
const projectLinks = [
  {
    live: "https://dreamiimages.vercel.app/",
    github: "https://github.com/Sopitha-77/dreamiimages.git"
  },
  {
    live: "https://wavify-modern-music-player.vercel.app/",
    github: "https://github.com/Sopitha-77/Wavify---Modern-Music-Player.git"
  },
  {
    live: "https://pizza-recipe-app-dusky.vercel.app/",
    github: "https://github.com/Sopitha-77/pizza-recipe-app.git"
  },
  {
    live: "#",
    github: "https://github.com/Sopitha-77/SmartCook-Intelligent-Recipe-Matching-with-Photo-Based-Ingredient-Recognition.git"
  }
];

// Project images from assets - Update these paths according to your actual assets
const projectImages = [
  dreamiImages, // Dreami Images
  wavifyMusic, // Wavify Music Player
  pizzaRecipe, // Pizza Recipe App
  smartCook, // SmartCook AI
];

const Projects = () => {
  const handleProjectClick = (index, type) => {
    const links = projectLinks[index];
    if (type === 'live' && links.live && links.live !== '#') {
      window.open(links.live, '_blank');
    } else if (type === 'github') {
      window.open(links.github, '_blank');
    }
  };

  return (
    <section id="projects" className="min-h-screen flex items-center px-4 sm:px-6 py-4 md:py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header - Compact */}
        <div className="text-center mb-4 md:mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-md" />
             
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Projects
              </h2>
             
            </div>
          </div>
        </div>

        {/* ScrollStack Container - Increased height to show all projects */}
        <div className="relative h-[1100px] md:h-[1200px] lg:h-[1300px]">
          <ScrollStack
            useWindowScroll={true}
            itemDistance={50}
            itemScale={0.02}
            itemStackDistance={12}
            stackPosition="3%"
            scaleEndPosition="0%"
            baseScale={0.65}
            rotationAmount={0.5}
            blurAmount={0.6}
            onStackComplete={() => console.log('All 4 projects are now visible!')}
          >
            {projects.map((project, idx) => {
              const links = projectLinks[idx];
              const hasLiveLink = links.live && links.live !== '#';
              const projectImage = projectImages[idx];
              
              return (
                <ScrollStackItem 
                  key={idx}
                  itemClassName="group bg-gradient-to-br from-slate-900/90 to-black/90 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300"
                >
                  <div className="relative h-full flex flex-col lg:flex-row gap-3 md:gap-4">
                    {/* Project Image - Using real project images */}
                    <div className="lg:w-1/2 h-32 md:h-36 lg:h-full relative rounded-lg md:rounded-xl overflow-hidden border border-slate-700/50 group-hover:border-indigo-500/50 transition-all duration-400">
                      {projectImage ? (
                        <img 
                          src={projectImage} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <div className="text-center p-4">
                            <Code className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">Project Preview</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                          <span className="text-xs font-medium text-white">Project {idx + 1}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <div className="flex gap-1.5">
                          {hasLiveLink && (
                            <button
                              onClick={() => handleProjectClick(idx, 'live')}
                              className="bg-black/70 backdrop-blur-sm p-1.5 rounded-lg border border-slate-600/50 hover:border-indigo-500/50 transition-all hover:scale-110 group-hover:bg-black/80"
                              title="View Live Demo"
                            >
                              <Eye className="w-3 h-3 text-white" />
                            </button>
                          )}
                          <button
                            onClick={() => handleProjectClick(idx, 'github')}
                            className="bg-black/70 backdrop-blur-sm p-1.5 rounded-lg border border-slate-600/50 hover:border-indigo-500/50 transition-all hover:scale-110 group-hover:bg-black/80"
                            title="View Source Code"
                          >
                            <Github className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="lg:w-1/2 flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${project.gradient}/20 flex-shrink-0`}>
                            <Code className="w-3.5 h-3.5 text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                              {project.title}
                            </h3>
                            <p className="text-xs text-indigo-400/90 truncate">{project.subtitle}</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 mb-3 leading-relaxed line-clamp-3">
                          {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Tech Stack
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {project.tech.map((tech, i) => (
                              <span 
                                key={i}
                                className="px-2 py-0.5 bg-black/40 border border-slate-700/50 rounded-lg text-xs text-gray-300 hover:border-indigo-500/50 hover:text-white transition-all duration-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-slate-700/50">
                        {hasLiveLink && (
                          <button
                            onClick={() => handleProjectClick(idx, 'live')}
                            className="flex-1 py-2 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center gap-1.5 group/btn hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20"
                          >
                            <ExternalLink className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                            <span className="text-xs">Live Demo</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleProjectClick(idx, 'github')}
                          className={`${hasLiveLink ? 'flex-1' : 'w-full'} py-2 bg-black/40 hover:bg-black/60 border border-slate-700/50 rounded-lg text-gray-300 hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 group/btn hover:scale-105`}
                        >
                          <Github className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                          <span className="text-xs">Source Code</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-[28px] md:rounded-[32px] bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`} />
                </ScrollStackItem>
              );
            })}
          </ScrollStack>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 animate-pulse flex items-center justify-center gap-1">
            <ArrowRight className="w-3 h-3" />
            Scroll down to view all 4 projects
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Showing {projects.length} projects total
          </p>
        </div>
      </div>
    </section>
  );
};

export default Projects;
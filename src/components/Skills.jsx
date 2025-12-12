import React from 'react';
import { Code, Palette, Database, Terminal, Settings, GitBranch, Sparkles } from 'lucide-react';
import { skills } from '../data/constants';
import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import GlareHover from './GlareHover';

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2
};

const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));

const cx = (...parts) => parts.filter(Boolean).join(' ');

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }

    const observers = elements.map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();
    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, [callback, elements, dependencies]);
};

const useImageLoader = (seqRef, onLoad, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) {
        onLoad();
      }
    };

    images.forEach(img => {
      const htmlImg = img;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true });
        htmlImg.addEventListener('error', handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
  }, [onLoad, seqRef, dependencies]);
};

const useAnimationLoop = (trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical) => {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      const transformValue = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
      track.style.transform = transformValue;
    }

    if (prefersReduced) {
      track.style.transform = isVertical ? 'translate3d(0, 0, 0)' : 'translate3d(0, 0, 0)';
      return () => {
        lastTimestampRef.current = null;
      };
    }

    const animate = timestamp => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
        offsetRef.current = nextOffset;

        const transformValue = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`;
        track.style.transform = transformValue;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef]);
};

const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    pauseOnHover,
    hoverSpeed,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    renderItem,
    ariaLabel = 'Partner logos',
    className,
    style
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [seqHeight, setSeqHeight] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const effectiveHoverSpeed = useMemo(() => {
      if (hoverSpeed !== undefined) return hoverSpeed;
      if (pauseOnHover === true) return 0;
      if (pauseOnHover === false) return undefined;
      return 0;
    }, [hoverSpeed, pauseOnHover]);

    const isVertical = direction === 'up' || direction === 'down';

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      let directionMultiplier;
      if (isVertical) {
        directionMultiplier = direction === 'up' ? 1 : -1;
      } else {
        directionMultiplier = direction === 'left' ? 1 : -1;
      }
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction, isVertical]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceRect = seqRef.current?.getBoundingClientRect?.();
      const sequenceWidth = sequenceRect?.width ?? 0;
      const sequenceHeight = sequenceRect?.height ?? 0;
      if (isVertical) {
        const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
        if (containerRef.current && parentHeight > 0) {
          const targetHeight = Math.ceil(parentHeight);
          if (containerRef.current.style.height !== `${targetHeight}px`)
            containerRef.current.style.height = `${targetHeight}px`;
        }
        if (sequenceHeight > 0) {
          setSeqHeight(Math.ceil(sequenceHeight));
          const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
          const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
          setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
        }
      } else if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, [isVertical]);
  
    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);

    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);

    useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical);

    const cssVariables = useMemo(
      () => ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
      }),
      [gap, logoHeight, fadeOutColor]
    );

    const rootClasses = useMemo(
      () =>
        cx(
          'relative group',
          isVertical ? 'overflow-hidden h-full inline-block' : 'overflow-x-hidden',
          '[--logoloop-gap:32px]',
          '[--logoloop-logoHeight:28px]',
          '[--logoloop-fadeColorAuto:#ffffff]',
          'dark:[--logoloop-fadeColorAuto:#0b0b0b]',
          scaleOnHover && 'py-[calc(var(--logoloop-logoHeight)*0.1)]',
          className
        ),
      [isVertical, scaleOnHover, className]
    );

    const handleMouseEnter = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(true);
    }, [effectiveHoverSpeed]);
    const handleMouseLeave = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(false);
    }, [effectiveHoverSpeed]);

    const renderLogoItem = useCallback(
      (item, key) => {
        if (renderItem) {
          return (
            <li
              className={cx(
                'flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]',
                isVertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]',
                scaleOnHover && 'overflow-visible group/item'
              )}
              key={key}
              role="listitem"
            >
              {renderItem(item, key)}
            </li>
          );
        }

        const isNodeItem = 'node' in item;

        const content = isNodeItem ? (
          <span
            className={cx(
              'inline-flex items-center',
              'motion-reduce:transition-none',
              scaleOnHover &&
                'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120'
            )}
            aria-hidden={!!item.href && !item.ariaLabel}
          >
            {item.node}
          </span>
        ) : (
          <img
            className={cx(
              'h-[var(--logoloop-logoHeight)] w-auto block object-contain',
              '[-webkit-user-drag:none] pointer-events-none',
              '[image-rendering:-webkit-optimize-contrast]',
              'motion-reduce:transition-none',
              scaleOnHover &&
                'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120'
            )}
            src={item.src}
            srcSet={item.srcSet}
            sizes={item.sizes}
            width={item.width}
            height={item.height}
            alt={item.alt ?? ''}
            title={item.title}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        );

        const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title);

        const inner = item.href ? (
          <a
            className={cx(
              'inline-flex items-center no-underline rounded',
              'transition-opacity duration-200 ease-linear',
              'hover:opacity-80',
              'focus-visible:outline focus-visible:outline-current focus-visible:outline-offset-2'
            )}
            href={item.href}
            aria-label={itemAriaLabel || 'logo link'}
            target="_blank"
            rel="noreferrer noopener"
          >
            {content}
          </a>
        ) : (
          content
        );

        return (
          <li
            className={cx(
              'flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]',
              isVertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]',
              scaleOnHover && 'overflow-visible group/item'
            )}
            key={key}
            role="listitem"
          >
            {inner}
          </li>
        );
      },
      [isVertical, scaleOnHover, renderItem]
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className={cx('flex items-center', isVertical && 'flex-col')}
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem, isVertical]
    );

    const containerStyle = useMemo(
      () => ({
        width: isVertical
          ? toCssLength(width) === '100%'
            ? undefined
            : toCssLength(width)
          : (toCssLength(width) ?? '100%'),
        ...cssVariables,
        ...style
      }),
      [width, cssVariables, style, isVertical]
    );

    return (
      <div
        ref={containerRef}
        className={rootClasses}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {fadeOut && (
          <>
            {isVertical ? (
              <>
                <div
                  aria-hidden
                  className={cx(
                    'pointer-events-none absolute inset-x-0 top-0 z-10',
                    'h-[clamp(24px,8%,120px)]',
                    'bg-[linear-gradient(to_bottom,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
                  )}
                />
                <div
                  aria-hidden
                  className={cx(
                    'pointer-events-none absolute inset-x-0 bottom-0 z-10',
                    'h-[clamp(24px,8%,120px)]',
                    'bg-[linear-gradient(to_top,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
                  )}
                />
              </>
            ) : (
              <>
                <div
                  aria-hidden
                  className={cx(
                    'pointer-events-none absolute inset-y-0 left-0 z-10',
                    isMobile ? 'w-[clamp(16px,5%,60px)]' : 'w-[clamp(24px,8%,120px)]',
                    'bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
                  )}
                />
                <div
                  aria-hidden
                  className={cx(
                    'pointer-events-none absolute inset-y-0 right-0 z-10',
                    isMobile ? 'w-[clamp(16px,5%,60px)]' : 'w-[clamp(24px,8%,120px)]',
                    'bg-[linear-gradient(to_left,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]'
                  )}
                />
              </>
            )}
          </>
        )}

        <div
          className={cx(
            'flex will-change-transform select-none relative z-0',
            'motion-reduce:transform-none',
            isVertical ? 'flex-col h-max w-full' : 'flex-row w-max'
          )}
          ref={trackRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';

const Skills = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const skillIcons = {
    "Frontend": <Code className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />,
    "Backend": <Database className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />,
    "Programming": <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />,
    "UI/UX": <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />,
    "Tools": <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />,
    "Version Control": <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
  };

  // Actual logo URLs for each technology with official colors
  const technologyLogos = useMemo(() => [
    // Frontend
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", 
      alt: "HTML5", 
      title: "HTML5",
      color: "#E34F26",
      bgColor: "rgba(227, 79, 38, 0.1)"
    },
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", 
      alt: "CSS3", 
      title: "CSS3",
      color: "#1572B6",
      bgColor: "rgba(21, 114, 182, 0.1)"
    },
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", 
      alt: "JavaScript", 
      title: "JavaScript",
      color: "#F7DF1E",
      bgColor: "rgba(247, 223, 30, 0.1)"
    },
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", 
      alt: "React", 
      title: "React",
      color: "#61DAFB",
      bgColor: "rgba(97, 218, 251, 0.1)"
    },
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original-wordmark.svg", 
      alt: "Tailwind CSS", 
      title: "Tailwind CSS",
      color: "#06B6D4",
      bgColor: "rgba(6, 182, 212, 0.1)"
    },
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg", 
      alt: "Bootstrap", 
      title: "Bootstrap",
      color: "#7952B3",
      bgColor: "rgba(121, 82, 179, 0.1)"
    },
    // Backend
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", 
      alt: "Node.js", 
      title: "Node.js",
      color: "#339933",
      bgColor: "rgba(51, 153, 51, 0.1)"
    },
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", 
      alt: "Express.js", 
      title: "Express.js",
      color: "#000000",
      bgColor: "rgba(0, 0, 0, 0.1)"
    },
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", 
      alt: "MongoDB", 
      title: "MongoDB",
      color: "#47A248",
      bgColor: "rgba(71, 162, 72, 0.1)"
    },
    // Programming
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", 
      alt: "Python", 
      title: "Python",
      color: "#3776AB",
      bgColor: "rgba(55, 118, 171, 0.1)"
    },
    // UI/UX
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", 
      alt: "Figma", 
      title: "Figma",
      color: "#F24E1E",
      bgColor: "rgba(242, 78, 30, 0.1)"
    },
    { 
      src: "https://raw.githubusercontent.com/devicons/devicon/master/icons/canva/canva-original.svg", 
      alt: "Canva", 
      title: "Canva",
      color: "#00C4CC",
      bgColor: "rgba(0, 196, 204, 0.1)"
    },
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg", 
      alt: "Blender", 
      title: "Blender",
      color: "#F5792A",
      bgColor: "rgba(245, 121, 42, 0.1)"
    },
    // Tools
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", 
      alt: "VS Code", 
      title: "VS Code",
      color: "#007ACC",
      bgColor: "rgba(0, 122, 204, 0.1)"
    },
    { 
      src: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg", 
      alt: "Postman", 
      title: "Postman",
      color: "#FF6C37",
      bgColor: "rgba(255, 108, 55, 0.1)"
    },
    // Version Control
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", 
      alt: "Git", 
      title: "Git",
      color: "#F05032",
      bgColor: "rgba(240, 80, 50, 0.1)"
    },
    { 
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", 
      alt: "GitHub", 
      title: "GitHub",
      color: "#181717",
      bgColor: "rgba(24, 23, 23, 0.1)"
    }
  ], []);

  return (
    <section id="skills" className="min-h-screen flex items-center px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 px-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-6">
            <div className="relative">
              <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-lg sm:blur-xl" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-1 sm:mb-2">
                Technical Skills
              </h2>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg">Technologies I work with and expertise areas</p>
            </div>
          </div>
        </div>

        {/* Skills Grid with GlareHover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20 px-2 sm:px-0">
          {Object.entries(skills).map(([category, items], idx) => (
            <GlareHover
              key={category}
              width="100%"
              height="auto"
              background="rgb(15 23 42 / 0.5)"
              borderRadius="1rem"
              borderColor="rgb(51 65 85 / 0.5)"
              glareColor="#4f46e5"
              glareOpacity={isMobile ? 0.2 : 0.3}
              glareAngle={45}
              glareSize={isMobile ? 150 : 200}
              transitionDuration={isMobile ? 300 : 500}
              playOnce={false}
              className="overflow-hidden"
            >
              <div className="p-4 sm:p-6 relative z-10">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 bg-slate-800/50 rounded-lg">
                    {skillIcons[category]}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-indigo-400">{category}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {items.map((skill, skillIdx) => (
                    <span 
                      key={skillIdx}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-xs sm:text-sm text-gray-300 hover:bg-indigo-500/20 hover:border-indigo-500 hover:text-white transition-all duration-300"
                      style={{ 
                        animationDelay: `${skillIdx * 50}ms`,
                        minHeight: '44px',
                        minWidth: '44px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none" />
              </div>
            </GlareHover>
          ))}
        </div>

        {/* Logo Loop Section - Technology Carousel */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12 px-2">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
              Technologies & Tools
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Hover over logos to pause • Tap to see details
            </p>
          </div>
          
          <div className="relative">
            <LogoLoop
              logos={technologyLogos}
              speed={isMobile ? 40 : 50}
              direction="left"
              logoHeight={isMobile ? 48 : 64}
              gap={isMobile ? 20 : 36}
              pauseOnHover={true}
              fadeOut={true}
              fadeOutColor="#0f172a"
              scaleOnHover={true}
              className="py-4 sm:py-6 lg:py-8"
              ariaLabel="Technology logos animation"
              renderItem={(item, key) => (
                <div 
                  className="p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl sm:rounded-3xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 sm:hover:scale-110 hover:shadow-lg sm:hover:shadow-2xl group/item relative overflow-hidden active:scale-95"
                  title={item.title}
                  style={{
                    borderColor: `${item.color}30`,
                    background: `linear-gradient(135deg, ${item.bgColor}, rgba(15, 23, 42, 0.3))`,
                    boxShadow: `0 4px 20px ${item.color}20`,
                    minHeight: '80px',
                    minWidth: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && console.log(`${item.title} clicked`)}
                  aria-label={`${item.title} technology logo`}
                >
                  {/* Glow effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at center, ${item.color}15 0%, transparent 70%)`
                    }}
                  />
                  
                  <div className="relative z-10 flex flex-col items-center justify-center gap-1 sm:gap-2">
                    <img 
                      src={item.src} 
                      alt={item.alt}
                      className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain drop-shadow-lg transition-all duration-300 group-hover/item:scale-110 group-hover/item:drop-shadow-2xl"
                      style={{
                        filter: `drop-shadow(0 2px 4px ${item.color}40)`
                      }}
                      loading="lazy"
                    />
                    {/* Mobile-only tooltip text */}
                    {isMobile && (
                      <span className="text-[10px] sm:text-xs text-slate-300 font-medium opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 text-center truncate max-w-[80px]">
                        {item.title}
                      </span>
                    )}
                  </div>
                  
                  {/* Color indicator dot */}
                  <div 
                    className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 group-hover/item:scale-125"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}`
                    }}
                  />
                </div>
              )}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/5 to-slate-900/20 pointer-events-none" />
          </div>

          {/* Instructions */}
          <div className="text-center mt-6 sm:mt-8 lg:mt-12 px-2">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-gray-400 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Hover to pause animation</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Click/tap logos for more info</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Optimization Tips */}
        {isMobile && (
          <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
            <p className="text-sm text-slate-400">
              💡 <span className="text-indigo-300">Tip:</span> Swipe horizontally to see more technologies
            </p>
          </div>
        )}
      </div>

      {/* Responsive CSS */}
      <style jsx global>{`
        /* Mobile touch improvements */
        @media (max-width: 768px) {
          button, [role="button"], span[role="button"] {
            min-height: 44px;
            min-width: 44px;
            touch-action: manipulation;
          }
          
          /* Smooth transitions for mobile */
          * {
            transition-duration: 200ms !important;
          }
          
          /* Better scrolling */
          .scroll-container {
            -webkit-overflow-scrolling: touch;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .LogoLoop, .GlareHover {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Skills;
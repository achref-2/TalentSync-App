import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { useSprings, animated, config } from '@react-spring/web';

export const BlurText = memo(({
  text = '',
  delay = 200,
  className = 'text-4xl font-bold tracking-tight text-balance sm:text-7xl',
  animateBy = 'words', // 'words', 'letters', or 'lines'
  direction = 'top', // 'top', 'bottom', 'left', 'right'
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing,
  onAnimationComplete,
  staggered = true,
  springConfig = config.gentle,
  preserveWhitespace = true,
  once = true
}) => {
  // Split text based on animation type
  const getElements = useCallback(() => {
    if (!text) return [];
    
    if (animateBy === 'lines') {
      return text.split('\n').map(line => line.trim() || ' ');
    } else if (animateBy === 'words') {
      return text.split(/\s+/).filter(word => word !== '');
    } else {
      return text.split('');
    }
  }, [text, animateBy]);

  const elements = getElements();
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const animatedCount = useRef(0);
  const observerRef = useRef(null);

  // Generate direction-based default animations
  const getDefaultAnimations = useCallback(() => {
    const blurAmount = '12px';
    const distance = '30px';
    const transforms = {
      top: `translate3d(0,-${distance},0)`,
      bottom: `translate3d(0,${distance},0)`,
      left: `translate3d(-${distance},0,0)`,
      right: `translate3d(${distance},0,0)`
    };

    return {
      from: {
        filter: `blur(${blurAmount})`,
        opacity: 0,
        transform: transforms[direction] || transforms.top
      },
      to: [
        {
          filter: 'blur(5px)',
          opacity: 0.5,
          transform: direction === 'top' || direction === 'bottom' 
            ? `translate3d(0,${direction === 'top' ? '5px' : '-5px'},0)` 
            : `translate3d(${direction === 'left' ? '5px' : '-5px'},0,0)`
        },
        { 
          filter: 'blur(0px)', 
          opacity: 1, 
          transform: 'translate3d(0,0,0)' 
        }
      ]
    };
  }, [direction]);

  const defaultAnimations = getDefaultAnimations();

  // Set up intersection observer
  useEffect(() => {
    if (!ref.current) return;
  
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            observerRef.current?.unobserve(ref.current);
          }
        } else if (!once) {
          setInView(false);
          animatedCount.current = 0;
        }
      },
      { threshold, rootMargin }
    );
  
    observerRef.current.observe(ref.current);
  
    return () => observerRef.current?.disconnect();
  }, [threshold, rootMargin, once]);
  
  // Trigger animation every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setInView(false); // Reset animation
      setTimeout(() => setInView(true), 100); // Restart animation
    }, 8000); // 10 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Reset animation count when text changes
  useEffect(() => {
    animatedCount.current = 0;
  }, [text]);

  // Animation springs
  const springs = useSprings(
    elements.length,
    elements.map((_, i) => ({
      from: animationFrom || defaultAnimations.from,
      to: async (next) => {
        if (inView) {
          const animSteps = animationTo || defaultAnimations.to;
          for (const step of Array.isArray(animSteps) ? animSteps : [animSteps]) {
            await next(step);
          }
          
          // Track completed animations
          animatedCount.current += 1;
          if (animatedCount.current === elements.length && onAnimationComplete) {
            onAnimationComplete();
          }
        } else {
          await next(animationFrom || defaultAnimations.from);
        }
      },
      delay: staggered ? i * delay : 0,
      config: {
        ...springConfig,
        ...(easing ? { easing } : {})
      }
    }))
  );

  // Don't render empty text
  if (!text || elements.length === 0) {
    return null;
  }

  return (
    <span 
    ref={ref} 
    className={`blur-text ${className} ${animateBy === 'words' ? 'flex flex-wrap justify-center text-center' : 'text-center'}`}
    aria-label={text}
  >
    {springs.map((props, index) => (
      <animated.span 
        key={`blur-text-${index}`} 
        style={props} 
        className={`inline-block ${animateBy === 'words' ? 'mr-1' : ''}`}
      >
        {elements[index] === ' ' && preserveWhitespace ? '\u00A0' : elements[index]}
        {animateBy === 'words' && index < elements.length - 1 && preserveWhitespace && '\u00A0'}
      </animated.span>
    ))}
  </span>
  );
});

// Add display name for DevTools
BlurText.displayName = 'BlurText';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  rotation?: number;
  stagger?: number;
}

export interface ScrollAnimationOptions extends AnimationOptions {
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
}

// Hook для анимации появления с fade in
export function useFadeIn<T extends HTMLElement>(
  dependencies: any[] = [],
  options: AnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const {
      duration = 0.6,
      delay = 0,
      ease = "power2.out",
      y = 30,
      opacity = 0
    } = options;

    gsap.fromTo(
      ref.current,
      {
        opacity,
        y,
        ...options
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease
      }
    );
  }, dependencies);

  return ref;
}

// Hook для анимации slide in
export function useSlideIn<T extends HTMLElement>(
  direction: 'left' | 'right' | 'up' | 'down' = 'up',
  dependencies: any[] = [],
  options: AnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const {
      duration = 0.8,
      delay = 0,
      ease = "power2.out"
    } = options;

    const getInitialPosition = () => {
      switch (direction) {
        case 'left': return { x: -100, y: 0 };
        case 'right': return { x: 100, y: 0 };
        case 'down': return { x: 0, y: -50 };
        default: return { x: 0, y: 50 };
      }
    };

    const initial = getInitialPosition();

    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        ...initial
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease
      }
    );
  }, dependencies);

  return ref;
}

// Hook для анимации scale in
export function useScaleIn<T extends HTMLElement>(
  dependencies: any[] = [],
  options: AnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const {
      duration = 0.5,
      delay = 0,
      ease = "back.out(1.7)",
      scale = 0.8
    } = options;

    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        scale
      },
      {
        opacity: 1,
        scale: 1,
        duration,
        delay,
        ease
      }
    );
  }, dependencies);

  return ref;
}

// Hook для анимации hover эффектов
export function useHoverAnimation<T extends HTMLElement>(
  options: AnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const {
      duration = 0.3,
      scale = 1.05,
      ease = "power2.out"
    } = options;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale,
        duration,
        ease
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration,
        ease
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
}

// Hook для staggered анимаций (для списков)
export function useStaggerAnimation<T extends HTMLElement>(
  dependencies: any[] = [],
  options: AnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const children = ref.current.children;
    if (!children.length) return;

    const {
      duration = 0.6,
      delay = 0,
      ease = "power2.out",
      stagger = 0.1,
      y = 30
    } = options;

    gsap.fromTo(
      children,
      {
        opacity: 0,
        y
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease,
        stagger
      }
    );
  }, dependencies);

  return ref;
}

// Hook для анимации загрузки
export function useLoadingAnimation<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(ref.current, {
      rotation: 360,
      duration: 1,
      ease: "none"
    });

    return () => {
      tl.kill();
    };
  }, []);

  return ref;
}

// Hook для pulse анимации
export function usePulseAnimation<T extends HTMLElement>(
  isActive: boolean = true,
  options: AnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || !isActive) return;

    const {
      duration = 1,
      scale = 1.1,
      ease = "power2.inOut"
    } = options;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(ref.current, {
      scale,
      duration,
      ease
    });

    return () => {
      tl.kill();
      if (ref.current) {
        gsap.set(ref.current, { scale: 1 });
      }
    };
  }, [isActive]);

  return ref;
}

// Hook для анимации при клике
export function useClickAnimation<T extends HTMLElement>(
  options: AnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const {
      duration = 0.1,
      scale = 0.95,
      ease = "power2.out"
    } = options;

    const handleMouseDown = () => {
      gsap.to(element, {
        scale,
        duration,
        ease
      });
    };

    const handleMouseUp = () => {
      gsap.to(element, {
        scale: 1,
        duration,
        ease
      });
    };

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseUp);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseUp);
    };
  }, []);

  return ref;
}

// Hook для анимации появления текста (typewriter эффект)
export function useTypewriterAnimation<T extends HTMLElement>(
  text: string,
  dependencies: any[] = [],
  options: { speed?: number; delay?: number } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const { speed = 50, delay = 0 } = options;
    const element = ref.current;
    
    element.textContent = '';
    
    const timeline = gsap.timeline({ delay });
    
    for (let i = 0; i <= text.length; i++) {
      timeline.to(element, {
        duration: speed / 1000,
        ease: "none",
        onUpdate: () => {
          element.textContent = text.substring(0, i);
        }
      });
    }

    return () => {
      timeline.kill();
    };
  }, [...dependencies, text]);

  return ref;
}

// Hook для анимации границ/outline
export function useBorderAnimation<T extends HTMLElement>(
  isActive: boolean = false,
  options: AnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const {
      duration = 0.3,
      ease = "power2.out"
    } = options;

    if (isActive) {
      gsap.to(ref.current, {
        boxShadow: "0 0 0 2px rgba(3, 135, 148, 0.5)",
        duration,
        ease
      });
    } else {
      gsap.to(ref.current, {
        boxShadow: "0 0 0 0px rgba(3, 135, 148, 0)",
        duration,
        ease
      });
    }
  }, [isActive]);

  return ref;
}
